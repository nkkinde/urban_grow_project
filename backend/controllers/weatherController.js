const axios = require('axios');

// 대전 좌표 (기본값)
const DAEJEON_LAT = 36.3504;
const DAEJEON_LON = 127.3845;

exports.getCurrentWeather = async (req, res) => {
  // 대전 좌표를 기본값으로 사용
  const lat = req.query.lat || DAEJEON_LAT;
  const lon = req.query.lon || DAEJEON_LON;

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

    const { temp, humidity } = data.main;
    const { icon, description } = data.weather[0];

    res.json({
      temperature: Math.round(temp),  // 정수로 반올림
      humidity,                       // % 단위
      icon,                           // 아이콘 코드 (e.g. "10d")
      description                     // 날씨 설명 (e.g. "가벼운 비")
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '날씨 정보 조회 실패', error: err.toString() });
  }
};