const axios = require('axios');

exports.getCurrentWeather = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'lat, lon 쿼리 파라미터를 모두 입력해주세요.' });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const { data } = await axios.get(url, {
      params: {
        lat,
        lon,
        units: 'metric',        // 섭씨 온도
        lang: 'kr',             // 한국어 설명
        appid: apiKey
      }
    });

    const { temperature, humidity } = data.main;
    const { icon, description } = data.weather[0];

    res.json({
      temperature: Math.round(temperature),  // 정수로 반올림
      humidity,                       // % 단위
      icon,                           // 아이콘 코드 (e.g. "10d")
      description                     // 날씨 설명 (e.g. "가벼운 비")
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '날씨 정보 조회 실패', error: err.toString() });
  }
};