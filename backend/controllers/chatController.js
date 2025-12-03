const axios = require('axios');
const db = require('../db');
const fs = require('fs');
const path = require('path');

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
  const { user_id, sender, text, imageUrl } = req.body;

  if (!user_id || !sender) {
    return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
  }

  const query = `
    INSERT INTO chat_history (user_id, message, reply, image_url, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  
  const messageData = sender === 'user' ? text : '';
  const replyData = sender === 'ai' ? text : '';
  const imageUrlData = imageUrl || null;

  db.query(query, [user_id, messageData, replyData, imageUrlData], (err, result) => {
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

// 식물 이미지 분석
exports.analyzePlantImage = async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      message: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.',
    });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ message: '이미지 파일이 필요합니다.' });
    }

    // 이미지를 Base64로 변환
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = req.file.mimetype;
    
    // 이미지 URL 생성 (파일명만 저장, 나중에 프론트에서 조회 가능)
    const imageFileName = req.file.filename;
    const imageUrl = `/uploads/plant-analysis/${imageFileName}`;

    const systemPrompt =
      '너는 UrbanGrow 앱의 식물 진단 AI 어시스턴트야. ' +
      '사용자가 보낸 식물 이미지를 분석해서 다음을 확인해줘: ' +
      '1. 식물의 종류 (상추, 깻잎, 대파, 방울토마토 등) ' +
      '2. 현재 건강 상태 (건강함, 약함, 병들었음) ' +
      '3. 문제점 (물부족, 과습, 병충해, 영양부족, 햇빛부족 등) ' +
      '4. 해결 방법 (물주기, 환기, 약 사용 등) ' +
      '친구처럼 반말로, 의학적 용어는 피하고 쉽게 설명해줘. ' +
      '중요: TTS로 읽혀질 거니까 특수문자(*, -, #), 이모지, 괄호, 번호 매기기를 절대 쓰지 마. ' +
      '오직 한글, 숫자, 마침표, 쉼표만 사용하고, 문장은 짧게 끊어. ' +
      '예: "상추가 좀 시들어 보여. 물이 부족한 것 같아. 흙이 말라 있으면 물을 줘. 햇빛도 하루 4시간은 쬐게 해줘."';

    const payload = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
            { text: '이 식물 이미지를 분석해줘.' },
          ],
        },
      ],
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    const candidate = response.data.candidates && response.data.candidates[0];
    const analysis =
      candidate?.content?.parts?.map((p) => p.text).join('') ||
      '죄송해요, 이미지 분석을 실패했어요. 다른 사진을 올려주세요.';

    return res.json({ analysis, imageUrl });
  } catch (error) {
    console.error('Gemini Vision API error:', error.response?.data || error.message);
    return res.status(500).json({
      message: '이미지 분석 중 오류가 발생했습니다.',
      error: error.response?.data || error.message,
    });
  }
};

// 채팅 이력 조회
exports.getChatHistory = (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id는 필수입니다.' });
  }

  const query = `
    SELECT id, message, reply, image_url, created_at
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
        // 메시지가 이미지 URL이면 imageUrl로 처리
        const isImageUrl = row.message.startsWith('/uploads/');
        messages.push({
          sender: 'user',
          text: isImageUrl ? '[식물 사진 업로드]' : row.message,
          imageUrl: isImageUrl ? row.message : null,
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
