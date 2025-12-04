const express = require('express');
const bcrypt  = require('bcrypt');
const db      = require('../db');
const jwt     = require('jsonwebtoken');
const router = express.Router();

// ========================================
// 회원가입
// ========================================
router.post('/register', async (req, res) => {
  const { id, email, password, nickname, phone_number } = req.body;
  
  // 필수 항목 검증
  if (!id || !email || !password || !nickname) {
    return res.status(400).json({ message: '아이디, 이메일, 비밀번호, 닉네임은 필수항목입니다.' });
  }

  try {
    // 비밀번호 해싱
    const saltRounds = 10;
    const hashedPW = await bcrypt.hash(password, saltRounds);

    // DB 저장
    const sql = `
      INSERT INTO users (id, email, password, nickname, phone_number)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.promise().query(sql, [id, email, hashedPW, nickname, phone_number || null]);

    return res.status(201).json({ message: '회원가입 성공!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: '이미 사용 중인 ID 또는 이메일입니다.' });
    }
    console.error('회원가입 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});
// ========================================
// 로그인
// ========================================
router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  
  if (!id || !password) {
    return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT id, password, nickname FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
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

// ========================================
// 아이디 찾기
// ========================================
router.post('/find-id', async (req, res) => {
  const { email, nickname } = req.body;
  
  if (!email || !nickname) {
    return res.status(400).json({ message: '이메일과 닉네임을 입력해주세요.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT id FROM users WHERE email = ? AND nickname = ?',
      [email, nickname]
    );

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

// ========================================
// 비밀번호 찾기 (인증)
// ========================================
router.post('/find-password', async (req, res) => {
  const { id, email } = req.body;
  
  if (!id || !email) {
    return res.status(400).json({ message: '아이디와 이메일을 입력해주세요.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT id FROM users WHERE id = ? AND email = ?',
      [id, email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '일치하는 회원 정보가 없습니다.' });
    }

    return res.status(200).json({ message: '인증 성공' });
  } catch (err) {
    console.error('비밀번호 찾기 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});

// ========================================
// 비밀번호 재설정
// ========================================
router.post('/reset-password/:id', async (req, res) => {
  const { id } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: '새 비밀번호를 입력해주세요.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  try {
    const hashedPW = await bcrypt.hash(newPassword, 10);
    const [result] = await db.promise().query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPW, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    return res.status(200).json({ message: '비밀번호 재설정 성공!' });
  } catch (err) {
    console.error('비밀번호 재설정 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});

module.exports = router;