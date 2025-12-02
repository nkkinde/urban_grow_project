require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (업로드된 파일 접근)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 라우터 연결
app.use('/api/weather',  require('./routes/weatherRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/memos',    require('./routes/memoRoutes'));
app.use('/api/chat',     require('./routes/chatRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중! http://localhost:${PORT}`);
});