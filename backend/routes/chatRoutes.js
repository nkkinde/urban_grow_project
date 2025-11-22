const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// AI 챗봇 메시지 전송
router.post('/', chatController.chatWithPlantAI);

module.exports = router;
