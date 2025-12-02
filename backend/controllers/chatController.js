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
    '사용자의 식물(상추, 깻잎, 대파 등) 상태에 대해 친구처럼 반말로 설명해줘. ' +
    '온도, 습도, 햇빛, 물주기 정보를 중심으로 이야기하되, 의학적 용어는 빼고 아주 쉽게 말해줘. ' +
    '중요: 이 답변은 TTS로 읽혀질 거야. 특수문자(*, -, #), 이모지, 괄호, 번호 매기기를 절대 쓰지 마. ' +
    '오직 한글, 숫자, 그리고 마침표와 쉼표만 사용해. ' +
    '가장 중요한 건 문장의 길이이야. 호흡이 길어지지 않게 최대한 짧게 끊어. ' +
    '접속사로 문장을 길게 잇지 말고, 핵심만 딱 잘라서 단문으로 말해줘. ' +
    '예를 들어 "물이 부족하니까 물을 줘야 하고 햇빛도 중요해" 대신 "물 좀 줘. 햇빛도 쬐게 해주고." 처럼 짧게 해.';

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
