const db = require('../db');
const path = require('path');
const fs = require('fs');

// 레벨 계산 함수
const calculateLevel = (count) => {
  if (count >= 3) return 4;
  if (count >= 2) return 3;
  if (count >= 1) return 2;
  return 1;
};

// 메모 저장 또는 수정
exports.saveOrUpdateMemo = (req, res) => {
  const { content, date, user_id, existingImages } = req.body;
  const files = req.files || [];

  if (!date || !user_id) {
    // 파일이 업로드된 경우 삭제
    if (files.length > 0) {
      files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('파일 삭제 실패:', err);
        });
      });
    }
    return res.status(400).json({ message: '날짜와 사용자 ID가 필요합니다.' });
  }

  // 기존 이미지 파싱
  let existingImageArray = [];
  if (existingImages) {
    try {
      existingImageArray = JSON.parse(existingImages);
      if (!Array.isArray(existingImageArray)) {
        existingImageArray = [];
      }
    } catch (e) {
      existingImageArray = [];
    }
  }

  // 새로 업로드된 이미지 경로 (정규화: uploads/로 시작하는 상대경로만 저장)
  const newImagePaths = files.map(file => {
    let filePath = file.path.replace(/\\/g, '/');
    // "uploads/"부터의 상대경로만 저장
    if (filePath.includes('uploads/')) {
      filePath = filePath.substring(filePath.indexOf('uploads/'));
    }
    return filePath;
  });
  
  // 기존 이미지 + 새로운 이미지 합치기
  const allImagePaths = [...existingImageArray, ...newImagePaths];

  const checkSql = 'SELECT * FROM plant_memos WHERE date = ? AND user_id = ?';
  db.query(checkSql, [date, user_id], (err, rows) => {
    if (err) {
      if (files.length > 0) {
        files.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('파일 삭제 실패:', err);
          });
        });
      }
      return res.status(500).json({ message: 'DB 조회 오류', error: err });
    }

    const memoContent = content || '';
    const imagePathsJson = allImagePaths.length > 0 ? JSON.stringify(allImagePaths) : null;

    if (rows.length > 0) {
      // 기존 메모 수정
      const updateSql = 'UPDATE plant_memos SET content = ?, image_paths = ?, updated_at = NOW() WHERE date = ? AND user_id = ?';
      db.query(updateSql, [memoContent, imagePathsJson, date, user_id], (err) => {
        if (err) {
          if (files.length > 0) {
            files.forEach(file => {
              fs.unlink(file.path, (err) => {
                if (err) console.error('파일 삭제 실패:', err);
              });
            });
          }
          return res.status(500).json({ message: 'DB 수정 오류', error: err });
        }
        res.status(200).json({ message: '메모 수정 성공', isNew: false });
      });
    } else {
      // 새 메모 저장
      const insertSql = 'INSERT INTO plant_memos (content, image_paths, date, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
      db.query(insertSql, [memoContent, imagePathsJson, date, user_id], (err) => {
        if (err) {
          if (files.length > 0) {
            files.forEach(file => {
              fs.unlink(file.path, (err) => {
                if (err) console.error('파일 삭제 실패:', err);
              });
            });
          }
          return res.status(500).json({ message: 'DB 저장 오류', error: err });
        }

        // diary_count 증가 후 level 재계산
        const updateUser = 'UPDATE users SET diary_count = diary_count + 1 WHERE id = ?';
        db.query(updateUser, [user_id], (err) => {
          if (err) console.error('diary_count 증가 실패:', err);
          else {
            const levelSql = 'UPDATE users SET level = ? WHERE id = ?';
            db.query('SELECT diary_count FROM users WHERE id = ?', [user_id], (err, rows) => {
              if (!err && rows.length > 0) {
                const newLevel = calculateLevel(rows[0].diary_count);
                db.query(levelSql, [newLevel, user_id]);
                // 새 레벨을 포함하여 응답
                res.status(201).json({ 
                  message: '메모 저장 성공!', 
                  isNew: true,
                  memoCount: rows[0].diary_count
                });
              } else {
                res.status(201).json({ 
                  message: '메모 저장 성공!', 
                  isNew: true,
                  memoCount: 0
                });
              }
            });
          }
        });
      });
    }
  });
};

//메모 조회 (작성/수정 시간 + 이미지 포함)
exports.getMemoByDate = (req, res) => {
  const { date, user_id } = req.query;
  if (!date || !user_id) {
    return res.status(400).json({ message: '날짜와 사용자 ID가 필요합니다.' });
  }

  const sql = 'SELECT content, image_paths, created_at, updated_at FROM plant_memos WHERE date = ? AND user_id = ?';
  db.query(sql, [date, user_id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB 조회 오류', error: err });
    if (rows.length === 0) return res.status(404).json({ message: '메모 없음' });

    // image_paths 처리 - MySQL2가 JSON을 자동 파싱할 수 있음
    let imagePaths = [];
    const rawImagePaths = rows[0].image_paths;
    
    console.log('DB에서 가져온 image_paths:', rawImagePaths);
    console.log('타입:', typeof rawImagePaths);
    
    if (rawImagePaths) {
      if (Array.isArray(rawImagePaths)) {
        // 이미 배열인 경우 (MySQL2 자동 파싱)
        imagePaths = rawImagePaths;
      } else if (typeof rawImagePaths === 'string') {
        // 문자열인 경우 파싱 필요
        try {
          imagePaths = JSON.parse(rawImagePaths);
          if (!Array.isArray(imagePaths)) {
            imagePaths = [];
          }
        } catch {
          imagePaths = [];
        }
      }
    }
    
    console.log('최종 imagePaths:', imagePaths);

    res.status(200).json({
      content: rows[0].content,
      image_paths: imagePaths,
      created_at: rows[0].created_at,
      updated_at: rows[0].updated_at
    });
  });
};

// 메모 삭제
exports.deleteMemo = (req, res) => {
  const { date, user_id } = req.body;
  if (!date || !user_id) {
    return res.status(400).json({ message: '날짜와 사용자 ID가 필요합니다.' });
  }

  // 먼저 메모 조회하여 이미지 경로 확인
  const selectSql = 'SELECT image_paths FROM plant_memos WHERE date = ? AND user_id = ?';
  db.query(selectSql, [date, user_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'DB 조회 오류', error: err });
    }

    // 이미지 파일 삭제
    if (rows.length > 0 && rows[0].image_paths) {
      try {
        let imagePaths = rows[0].image_paths;
        
        // JSON 배열인지 확인
        if (typeof imagePaths === 'string') {
          if (imagePaths.startsWith('[')) {
            imagePaths = JSON.parse(imagePaths);
          } else {
            // 단일 경로 문자열인 경우 배열로 변환
            imagePaths = [imagePaths];
          }
        }
        
        if (Array.isArray(imagePaths)) {
          imagePaths.forEach((imagePath) => {
            fs.unlink(imagePath, (err) => {
              if (err) console.error('이미지 파일 삭제 실패:', err);
            });
          });
        }
      } catch (e) {
        console.error('이미지 경로 파싱 실패:', e);
      }
    }

    // 메모 삭제
    const deleteSql = 'DELETE FROM plant_memos WHERE date = ? AND user_id = ?';
    db.query(deleteSql, [date, user_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB 삭제 오류', error: err });

      // diary_count 감소 후 level 재계산
      const updateUser = 'UPDATE users SET diary_count = GREATEST(diary_count - 1, 0) WHERE id = ?';
      db.query(updateUser, [user_id], (err) => {
        if (err) console.error('diary_count 감소 실패:', err);
        else {
          const levelSql = 'UPDATE users SET level = ? WHERE id = ?';
          db.query('SELECT diary_count FROM users WHERE id = ?', [user_id], (err, rows) => {
            if (!err && rows.length > 0) {
              const newLevel = calculateLevel(rows[0].diary_count);
              db.query(levelSql, [newLevel, user_id]);
            }
          });
        }
      });

      res.status(200).json({ message: '메모 삭제 성공' });
    });
  });
};

// 메모 날짜 목록 조회
exports.getMemoDates = (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: 'user_id가 필요합니다.' });

  const sql = 'SELECT DISTINCT date FROM plant_memos WHERE user_id = ?';
  db.query(sql, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB 조회 오류', error: err });

    const memoDates = rows.map(row => row.date.toISOString().split('T')[0]);
    res.status(200).json({ memoDates });
  });
};
