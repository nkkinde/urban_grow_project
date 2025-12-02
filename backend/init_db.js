require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL 연결 실패:', err.message);
    process.exit(1);
  } else {
    console.log('✅ MySQL 연결 성공!');
  }
});

// chat_history 테이블 생성
const createChatHistoryTable = `
  CREATE TABLE IF NOT EXISTS chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    message LONGTEXT,
    reply LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// watering_history 테이블 생성
const createWateringHistoryTable = `
  CREATE TABLE IF NOT EXISTS watering_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    plant_name VARCHAR(100),
    watered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_watered_at (watered_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// 테이블 생성 실행
db.query(createChatHistoryTable, (err) => {
  if (err) {
    console.error('❌ chat_history 테이블 생성 실패:', err.message);
  } else {
    console.log('✅ chat_history 테이블 생성 완료!');
  }
});

db.query(createWateringHistoryTable, (err) => {
  if (err) {
    console.error('❌ watering_history 테이블 생성 실패:', err.message);
  } else {
    console.log('✅ watering_history 테이블 생성 완료!');
  }
});

// 모든 쿼리 완료 후 연결 종료
setTimeout(() => {
  db.end((err) => {
    if (err) {
      console.error('❌ 연결 종료 실패:', err);
    } else {
      console.log('✅ 데이터베이스 초기화 완료!');
    }
  });
}, 1000);
