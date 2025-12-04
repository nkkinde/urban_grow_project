const db = require('../db');
const bcrypt = require('bcrypt');

// ========================================
// 회원가입
// ========================================
exports.registerUser = async (req, res) => {
  const { id, email, password, nickname, phone_number } = req.body;

  // 필수 항목 검증
  if (!id || !email || !password || !nickname) {
    return res.status(400).json({ message: '아이디, 이메일, 비밀번호, 닉네임은 필수항목입니다.' });
  }

  try {
    const saltRounds = 10;
    const hashedPW = await bcrypt.hash(password, saltRounds);

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
};

// ========================================
// 로그인
// ========================================
exports.loginUser = async (req, res) => {
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

    return res.status(200).json({
      message: '로그인 성공!',
      user: {
        id: user.id,
        nickname: user.nickname
      }
    });
  } catch (err) {
    console.error('로그인 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
};

// ========================================
// 비밀번호 찾기 (인증)
// ========================================
exports.findPasswordUser = async (req, res) => {
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
};

// ========================================
// 비밀번호 재설정
// ========================================
exports.resetPassword = async (req, res) => {
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
};

// ========================================
// 아이디 찾기
// ========================================
exports.findId = async (req, res) => {
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
};

// ========================================
// 비밀번호 변경 (현재 비밀번호 확인 후 변경)
// ========================================
exports.changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    // 현재 사용자 조회
    const [rows] = await db.promise().query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 현재 비밀번호 확인
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: '현재 비밀번호가 틀렸습니다.' });
    }

    // 새 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 비밀번호 업데이트
    await db.promise().query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    return res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다!' });
  } catch (err) {
    console.error('비밀번호 변경 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
};

// ========================================
// 닉네임 변경
// ========================================
exports.nicknameChange = async (req, res) => {
  const { userId, newNickname } = req.body;

  if (!userId || !newNickname) {
    return res.status(400).json({ message: '사용자 ID와 새 닉네임을 입력해주세요.' });
  }

  try {
    const [result] = await db.promise().query(
      'UPDATE users SET nickname = ? WHERE id = ?',
      [newNickname, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({ message: '닉네임 변경 성공!' });
  } catch (err) {
    console.error('닉네임 변경 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
};

// ========================================
// 사용자 탈퇴
// ========================================
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
  }

  try {
    const [result] = await db.promise().query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({ message: '탈퇴 완료' });
  } catch (err) {
    console.error('사용자 탈퇴 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
};

// ========================================
// 사용자 레벨 조회
// ========================================
exports.getUserLevel = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id가 필요합니다.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT level, nickname FROM users WHERE id = ?',
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      level: rows[0].level,
      nickname: rows[0].nickname
    });
  } catch (err) {
    console.error('레벨 조회 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
};

// ========================================
// 물 주기 기록 업데이트
// ========================================
exports.updateLastWatered = async (req, res) => {
  const { user_id, userId, watered_time, wateredTime } = req.body;
  
  // 두 가지 형식 모두 지원 (user_id 또는 userId, watered_time 또는 wateredTime)
  const id = user_id || userId;
  const time = watered_time || wateredTime;

  if (!id || !time) {
    return res.status(400).json({ message: '사용자 ID와 물준 시간이 필요합니다.' });
  }

  try {
    const [result] = await db.promise().query(
      'UPDATE users SET last_watered = ? WHERE id = ?',
      [time, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({ message: '물 주기 기록 완료' });
  } catch (err) {
    console.error('물 주기 업데이트 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
};

// ========================================
// 마지막 물준 시간 조회
// ========================================
exports.getLastWatered = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id가 필요합니다.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT last_watered FROM users WHERE id = ?',
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      lastWatered: rows[0].last_watered
    });
  } catch (err) {
    console.error('물 주기 조회 오류:', err);
    return res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
};
