require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 연결 재시도 로직
function handleConnect() {
  db.connect((err) => {
    if (err) {
      console.error('❌ MySQL 연결 실패:', err.message);
      console.log('⏳ 5초 후 재시도합니다...');
      setTimeout(handleConnect, 5000); // 5초 후 재시도
    } else {
      console.log('✅ MySQL 연결 성공!');

      // 현재 연결된 데이터베이스 확인
      db.query('SELECT DATABASE()', (err, rows) => {
        if (!err) {
          console.log('📊 현재 연결된 DB:', rows[0]['DATABASE()']);
        }
      });
    }
  });
}

// 연결 해제 시 자동 재연결
db.on('error', (err) => {
  console.error('❌ Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    handleConnect();
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    handleConnect();
  }
  if (err.code === 'ECONNREFUSED') {
    handleConnect();
  }
});

handleConnect();

module.exports = db;