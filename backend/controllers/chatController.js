const axios = require('axios');
const db = require('../db');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

exports.chatWithPlantAI = async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      message: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다. .env를 확인해주세요.',
    });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'message 필드는 필수입니다.' });
  }

  try {
    const systemPrompt =
      '너는 UrbanGrow 앱의 식물 관리 AI 어시스턴트야. ' +
      '사용자의 식물(예: 상추, 깻잎, 대파, 양파, 고추 등)에 대해 한국어로 친절하고 이해하기 쉽게 설명해줘. ' +
      '온도, 습도, 햇빛, 물주기 주기 등을 중심으로 조언하고, ' +
      '너무 의학적인 표현이나 어려운 농업 용어는 피하고 말투는 부드럽고 친구처럼 말해줘.' +
      '그리고 출력 문장은 최대한 짧고 간결하게 해줘.';

    const payload = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: `사용자 질문: ${message}` },
          ],
        },
      ],
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const candidate = response.data.candidates && response.data.candidates[0];
    const replyText =
      candidate?.content?.parts?.map((p) => p.text).join('') ||
      '죄송해요, 지금은 적절한 답변을 만들지 못했어요. 잠시 후 다시 시도해 주세요.';

    return res.json({ reply: replyText });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    return res.status(500).json({
      message: 'AI 응답 생성 중 오류가 발생했습니다.',
      error: error.response?.data || error.message,
    });
  }
};

// 채팅 메시지 DB에 저장
exports.saveChatMessage = (req, res) => {
  const { user_id, sender, text } = req.body;

  if (!user_id || !sender || !text) {
    return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
  }

  const query = `
    INSERT INTO chat_history (user_id, message, reply, created_at)
    VALUES (?, ?, ?, NOW())
  `;
  
  const messageData = sender === 'user' ? text : '';
  const replyData = sender === 'ai' ? text : '';

  db.query(query, [user_id, messageData, replyData], (err, result) => {
    if (err) {
      console.error('채팅 저장 실패:', err);
      return res.status(500).json({
        message: '채팅 저장 중 오류가 발생했습니다.',
        error: err.message,
      });
    }
    return res.json({ message: '채팅이 저장되었습니다.' });
  });
};

// 채팅 이력 조회
exports.getChatHistory = (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id는 필수입니다.' });
  }

  const query = `
    SELECT id, message, reply, created_at
    FROM chat_history
    WHERE user_id = ?
    ORDER BY created_at ASC
    LIMIT 50
  `;

  db.query(query, [user_id], (err, rows) => {
    if (err) {
      console.error('채팅 이력 조회 실패:', err);
      return res.status(500).json({
        message: '채팅 이력 조회 중 오류가 발생했습니다.',
        error: err.message,
      });
    }

    const messages = [];
    rows.forEach((row) => {
      if (row.message) {
        messages.push({
          sender: 'user',
          text: row.message,
          timestamp: row.created_at,
        });
      }
      if (row.reply) {
        messages.push({
          sender: 'ai',
          text: row.reply,
          timestamp: row.created_at,
        });
      }
    });

    if (messages.length === 0) {
      messages.push({
        sender: 'ai',
        text: '안녕하세요! UrbanGrow AI 가드너입니다. 식물 관리에 대해 뭐든 물어보세요 🌱',
      });
    }

    return res.json({ messages });
  });
};
