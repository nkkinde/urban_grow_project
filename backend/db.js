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
    console.error('MySQL 연결 실패:', err.message);
  } else {
    console.log('MySQL 연결 성공!');

    // 현재 연결된 데이터베이스 확인
    db.query('SELECT DATABASE()', (err, rows) => {
      if (!err) {
        console.log('현재 연결된 DB:', rows[0]['DATABASE()']);
      }
    });
  }
});

module.exports = db;