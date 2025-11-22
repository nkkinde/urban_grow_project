// routes/weatherRoutes.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
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
        units: 'metric',
        lang: 'kr',
        appid: apiKey,
      }
    });

    res.json({
      icon: data.weather[0].icon,
      description: data.weather[0].description,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity
    });
  } catch (err) {
    console.error('날씨 API 에러', err);
    res.status(500).json({ message: '날씨 정보를 가져오지 못했습니다.' });
  }
});

module.exports = router;
