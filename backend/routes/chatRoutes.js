const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const chatController = require('../controllers/chatController');

// 이미지 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/plant-analysis');
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `plant-${timestamp}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('지원하는 이미지 형식: JPEG, PNG, WebP'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// AI 챗봇 메시지 전송
router.post('/', chatController.chatWithPlantAI);

// 채팅 메시지 DB에 저장
router.post('/save', chatController.saveChatMessage);

// 채팅 이력 조회
router.get('/history', chatController.getChatHistory);

// 식물 이미지 분석
router.post('/analyze-image', upload.single('image'), chatController.analyzePlantImage);

module.exports = router;
