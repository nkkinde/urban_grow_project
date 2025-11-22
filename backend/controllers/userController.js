const db     = require('../db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// 회원가입
exports.registerUser = async (req, res) => {
  const { id, password, name, nickname, phone_number } = req.body;
  if (!id || !password || !name || !nickname || !phone_number) {
    return res.status(400).json({ message: '모든 항목을 입력해주세요.' });
  }

  try {
    const saltRounds = 10;
    const hashedPW = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (id, password, name, nickname, phone_number)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [id, hashedPW, name, nickname, phone_number];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("DB 삽입 오류:", err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: '이미 사용 중인 ID입니다.' });
        }
        return res.status(500).json({ message: '서버 에러', error: err });
      }
      return res.status(201).json({ message: '회원가입 성공!' });
    });

  } catch (e) {
    console.error("비밀번호 해싱 오류:", e);
    return res.status(500).json({ message: '비밀번호 처리 중 에러', error: e });
  }
};

exports.loginUser = async (req, res) => {
  const { id, password } = req.body;

  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], async (err, result) => {
    if (err) return res.status(500).json({ message: '서버 오류' });
    if (result.length === 0) return res.status(404).json({ message: '존재하지 않는 아이디입니다.' });

    const user = result[0]; // 이 줄로 user 정의
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });

    // 이제 user.id 사용 가능
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "로그인 성공!",
      token,
      user: {
        id: user.id,
        nickname: user.nickname
      }
    });
  });
};


// 비밀번호 찾기
exports.findPasswordUser = (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({ message: '아이디와 이름을 모두 입력해주세요.' });
  }

  const sql = 'SELECT id FROM users WHERE id = ? AND name = ?';
  db.query(sql, [id, name], (err, rows) => {
    if (err) return res.status(500).json({ message: '서버 에러', error: err });
    if (rows.length === 0) {
      return res.status(404).json({ message: '일치하는 회원 정보가 없습니다.' });
    }
    res.status(200).json({ message: '인증 성공' });
  });
};

// 비밀번호 재설정
exports.resetPassword = async (req, res) => {
  const id = req.params.id;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: '새 비밀번호와 확인을 모두 입력해주세요.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: '비밀번호와 확인이 일치하지 않습니다.' });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(sql, [hashed, id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: '서버 에러', error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '회원 정보를 찾을 수 없습니다.' });
      }
      res.status(200).json({ message: '비밀번호 재설정 성공!' });
    });
  } catch (e) {
    res.status(500).json({ message: '서버 에러', error: e });
  }
};

// 아이디 찾기
exports.findId = (req, res) => {
  const { name, nickname, phone_number } = req.body;

  if (!name || !nickname || !phone_number) {
    return res.status(400).json({ message: '이름, 닉네임, 전화번호를 모두 입력해주세요.' });
  }

  const sql = `
    SELECT id
      FROM users
     WHERE name     = ?
       AND nickname = ?
       AND phone_number = ?
    LIMIT 1
  `;
  db.query(sql, [name, nickname, phone_number], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: '서버 에러', error: err });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: '일치하는 회원 정보가 없습니다.' });
    }

    const foundId = rows[0].id;
    res.status(200).json({ message: '아이디 찾기 성공', id: foundId });
  });
};
// 닉네임 변경
exports.nicknameChange = (req, res) => {
  const { user_nickname, nickname } = req.body;

  if (!user_nickname || !nickname) {
    return res.status(400).json({ message: '기존 닉네임 또는 새 닉네임이 누락되었습니다.' });
  }

  const sql = 'UPDATE users SET nickname = ? WHERE nickname = ?';
  db.query(sql, [nickname, user_nickname], (err, result) => {
    if (err) {
      console.error('DB 오류:', err);
      return res.status(500).json({ message: 'DB 오류 발생', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '해당 닉네임의 사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({ message: '닉네임 변경 성공!' });
  });
};

// 아이디 삭제
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB 오류", err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "사용자 없음" });
    res.status(200).json({ message: "탈퇴 성공" });
  });
};

// 유저 레벨 조회
exports.getUserLevel = (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ message: 'user_id가 필요합니다.' });
  }

  const sql = 'SELECT level FROM users WHERE id = ?';
  db.query(sql, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB 조회 오류', error: err });
    if (rows.length === 0) return res.status(404).json({ message: '사용자 없음' });

    res.status(200).json({ level: rows[0].level });
  });
};

// 물주기 기록 (마지막 물준 시간 업데이트)
exports.updateLastWatered = (req, res) => {
  const { user_id, watered_time } = req.body;
  if (!user_id || !watered_time) {
    return res.status(400).json({ message: 'user_id와 watered_time이 필요합니다.' });
  }

  const sql = 'UPDATE users SET last_watered = ? WHERE id = ?';
  db.query(sql, [watered_time, user_id], (err) => {
    if (err) return res.status(500).json({ message: '업데이트 실패', error: err });
    res.status(200).json({ message: '물주기 기록 완료' });
  });
};

// 마지막 물준 시간 조회
exports.getLastWatered = (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ message: 'user_id가 필요합니다.' });
  }

  const sql = 'SELECT last_watered FROM users WHERE id = ?';
  db.query(sql, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ message: '조회 실패', error: err });
    if (rows.length === 0) return res.status(404).json({ message: '사용자 없음' });

    res.status(200).json({ lastWatered: rows[0].last_watered });
  });
};

