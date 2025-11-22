const db = require('../db');

// 레벨 계산 함수
const calculateLevel = (count) => {
  if (count >= 9) return 4;
  if (count >= 6) return 3;
  if (count >= 3) return 2;
  return 1;
};

// 메모 저장 또는 수정
exports.saveOrUpdateMemo = (req, res) => {
  const { content, date, user_id } = req.body;
  if (!content || !date || !user_id) {
    return res.status(400).json({ message: '내용, 날짜, 사용자 ID가 필요합니다.' });
  }

  const checkSql = 'SELECT * FROM plant_memos WHERE date = ? AND user_id = ?';
  db.query(checkSql, [date, user_id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB 조회 오류', error: err });

    if (rows.length > 0) {
      const updateSql = 'UPDATE plant_memos SET content = ?, updated_at = NOW() WHERE date = ? AND user_id = ?';
      db.query(updateSql, [content, date, user_id], (err) => {
        if (err) return res.status(500).json({ message: 'DB 수정 오류', error: err });
        res.status(200).json({ message: '메모 수정 성공' });
      });
    } else {
      const insertSql = 'INSERT INTO plant_memos (content, date, user_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';
      db.query(insertSql, [content, date, user_id], (err) => {
        if (err) return res.status(500).json({ message: 'DB 저장 오류', error: err });

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
              }
            });
          }
        });

        res.status(201).json({ message: '메모 저장 성공!', isNew: true });
      });
    }
  });
};

//메모 조회 (작성/수정 시간 포함)
exports.getMemoByDate = (req, res) => {
  const { date, user_id } = req.query;
  if (!date || !user_id) {
    return res.status(400).json({ message: '날짜와 사용자 ID가 필요합니다.' });
  }

  const sql = 'SELECT content, created_at, updated_at FROM plant_memos WHERE date = ? AND user_id = ?';
  db.query(sql, [date, user_id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB 조회 오류', error: err });
    if (rows.length === 0) return res.status(404).json({ message: '메모 없음' });

    res.status(200).json({
      content: rows[0].content,
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
