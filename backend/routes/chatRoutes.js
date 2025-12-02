const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// AI 챗봇 메시지 전송
router.post('/', chatController.chatWithPlantAI);

// 채팅 메시지 DB에 저장
router.post('/save', chatController.saveChatMessage);

// 채팅 이력 조회
router.get('/history', chatController.getChatHistory);

module.exports = router;
