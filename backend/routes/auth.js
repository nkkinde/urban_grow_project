const express = require('express');
const bcrypt  = require('bcrypt');
const db      = require('../db');
const router = express.Router();



// 회원가입
router.post('/register', async (req, res) => {
  const { id, password, name, nickname, phone_number } = req.body;
  if (!id || !password || !name || !nickname || !phone_number) {
    return res.status(400).json({ message: '모든 항목을 입력해주세요.' });
  }

  try {
    // 비밀번호 해싱
    const saltRounds = 10;
    const hashedPW = await bcrypt.hash(password, saltRounds);

    // DB 저장
    const sql = `
      INSERT INTO users (id, password, name, nickname, phone_number)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.promise().query(sql, [id, hashedPW, name, nickname, phone_number]);

    return res.status(201).json({ message: '회원가입 성공!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: '이미 사용 중인 ID입니다.' });
    }
    console.error('회원가입 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});
// 로그인 부분
router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) {
    return res.status(400).json({ message: '아이디와 비밀번호를 모두 입력해주세요.' });
  }

  try {
    // 사용자 조회
    const [rows] = await db.promise().query(
      'SELECT id, password, nickname FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
    }

    const user = rows[0]; // user 변수 정의
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
    }

    // 로그인 성공 시 토큰 생성 (여기서 해야 user.id 사용 가능)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    return res.status(200).json({
      message: '로그인 성공!',
      token,
      user: {
        id: user.id,
        nickname: user.nickname
      }
    });
  } catch (err) {
    console.error('로그인 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});

// ───── 아이디 찾기 ─────
router.post('/find-id', async (req, res) => {
  const { name, nickname, phone_number } = req.body;
  if (!name || !nickname || !phone_number) {
    return res.status(400).json({ message: '이름, 닉네임, 전화번호를 모두 입력해주세요.' });
  }

  try {
    const sql = `
      SELECT id
        FROM users
       WHERE name = ? AND nickname = ? AND phone_number = ?
       LIMIT 1
    `;
    const [rows] = await db.promise().query(sql, [name, nickname, phone_number]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '일치하는 회원 정보가 없습니다.' });
    }
    return res.status(200).json({
      message: '아이디 찾기 성공',
      id: rows[0].id
    });
  } catch (err) {
    console.error('아이디 찾기 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});

// ───── 비밀번호 찾기(인증) ─────
router.post('/find-password', async (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({ message: '아이디와 이름을 모두 입력해주세요.' });
  }

  try {
    const sql = 'SELECT id FROM users WHERE id = ? AND name = ?';
    const [rows] = await db.promise().query(sql, [id, name]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '일치하는 회원 정보가 없습니다.' });
    }
    return res.status(200).json({ message: '인증 성공' });
  } catch (err) {
    console.error('비밀번호 찾기 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});

// ───── 비밀번호 재설정 ─────
router.post('/reset-password/:id', async (req, res) => {
  const idParam = req.params.id;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: '새 비밀번호와 확인을 모두 입력해주세요.' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: '비밀번호와 확인이 일치하지 않습니다.' });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const sql    = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await db.promise().query(sql, [hashed, idParam]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '회원 정보를 찾을 수 없습니다.' });
    }
    return res.status(200).json({ message: '비밀번호 재설정 성공!' });
  } catch (err) {
    console.error('비밀번호 재설정 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});

module.exports = router;