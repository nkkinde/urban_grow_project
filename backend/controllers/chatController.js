const axios = require('axios');

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
      '너무 의학적인 표현이나 어려운 농업 용어는 피하고 말투는 부드럽고 친구처럼 말해줘.'+
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

    // Gemini 응답 텍스트 꺼내기
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
