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

// plant_memos 테이블에 image_paths 컬럼 추가
const addColumnSql = `
  ALTER TABLE plant_memos ADD COLUMN image_paths LONGTEXT;
`;

db.query(addColumnSql, (err) => {
  if (err) {
    if (err.message.includes('Duplicate column')) {
      console.log('✅ image_paths 컬럼이 이미 존재합니다!');
    } else {
      console.error('❌ 컬럼 추가 실패:', err.message);
    }
  } else {
    console.log('✅ image_paths 컬럼 추가 완료!');
  }
});

// 모든 쿼리 완료 후 연결 종료
setTimeout(() => {
  db.end((err) => {
    if (err) {
      console.error('❌ 연결 종료 실패:', err);
    } else {
      console.log('✅ 데이터베이스 업데이트 완료!');
    }
  });
}, 1000);
