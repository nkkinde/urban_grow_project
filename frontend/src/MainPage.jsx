import './MainPage.css';
import level1Video from "./assets/plant_icon1.mp4";
import level2Video from "./assets/plant_icon2.mp4";
import level3Video from "./assets/plant_icon3.mp4";
import level4Video from "./assets/plant_icon4.mp4";
import plantWaterVideo from "./assets/plant_water.mp4";
import { FaUserAlt } from 'react-icons/fa';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomNav from './BottomNav';
import API_URL, { TTS_URL } from './api.js';

export default function MainPage() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const [weatherData, setWeatherData] = useState(null);
  const [lastWatered, setLastWatered] = useState(null);
  const [level, setLevel] = useState(1);
  
  // 물주기 팝업
  const [showWaterPopup, setShowWaterPopup] = useState(false);
  const waterVideoRef = useRef(null);

  // TTS
  const playTTS = async (text) => {
    try {
      console.log('🎤 TTS 요청:', text);
      const res = await fetch(`${TTS_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          speaker_id: 0,
          speed: 1.0
        }),
      });

      console.log('📡 응답 상태:', res.status);
      if (!res.ok) {
        console.error("TTS 서버 에러:", await res.text());
        return;
      }

      const blob = await res.blob();
      console.log('📦 오디오 크기:', blob.size, 'bytes, 타입:', blob.type);
      
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.addEventListener('play', () => console.log('▶️ 재생 시작'));
      audio.addEventListener('error', (e) => console.error('❌ 재생 오류:', e));
      
      audio.play().catch(e => console.error('재생 실패:', e));
      console.log('✅ TTS 재생 명령 전송');
    } catch (err) {
      console.error("TTS 호출 실패:", err);
    }
  };

  // 챗봇 상태
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '안녕하세요! UrbanGrow AI 가드너입니다. 식물 관리에 대해 뭐든 물어보세요 🌱',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showImageAnalysis, setShowImageAnalysis] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  // 유저 인증 및 날씨, 물주기 시간 불러오기, 채팅 이력 불러오기
  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    const fetchWeather = async () => {
      const lat = 37.5665;
      const lon = 126.9780;
      try {
        const res = await axios.get(`${API_URL}/api/weather?lat=${lat}&lon=${lon}`);
        setWeatherData(res.data);
      } catch (err) {
        console.error("날씨 요청 실패:", err);
      }
    };

    const fetchWateredTime = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/last-watered?user_id=${userId}`);
        if (res.data.lastWatered) {
          setLastWatered(new Date(res.data.lastWatered));
        }
      } catch (err) {
        console.error("마지막 물준 시간 조회 실패:", err);
      }
    };

    // 채팅 이력 불러오기
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/chat/history?user_id=${userId}`);
        if (res.data.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("채팅 이력 조회 실패:", err);
      }
    };

    fetchWeather();
    fetchWateredTime();
    fetchChatHistory();
  }, [navigate]);

  // 레벨 주기적 조회
  useEffect(() => {
    const userId = localStorage.getItem("id");

    const fetchLevel = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/level?user_id=${userId}`);
        setLevel(res.data.level);
      } catch (err) {
        console.error("레벨 조회 실패:", err);
      }
    };

    fetchLevel();
    const interval = setInterval(fetchLevel, 3000);
    return () => clearInterval(interval);
  }, []);

  // 물주기
  const handleWater = async () => {
    setShowWaterPopup(true);
  };

  // 물주기 팝업 완료 처리
  const handleWaterVideoEnd = async () => {
    const userId = localStorage.getItem("id");
    try {
      const now = new Date();
      
      if (lastWatered) {
        const timeDiff = now - lastWatered;
        const THREE_HOURS = 3 * 60 * 60 * 1000;
        
        if (timeDiff < THREE_HOURS) {
          const hoursLeft = Math.ceil((THREE_HOURS - timeDiff) / (60 * 60 * 1000));
          const warningMsg = `물을 너무 자주 주지 않도록 주의하세요! 약 ${hoursLeft}시간 후에 다시 물을 주세요. 과도한 물주기는 식물을 썩게 만들 수 있습니다. 🚨`;
          
          const aiMsg = { sender: "ai", text: warningMsg };
          setMessages((prev) => [...prev, aiMsg]);
          
          await axios.post(`${API_URL}/api/chat/save`, {
            user_id: userId,
            sender: "ai",
            text: warningMsg,
          });
          
          playTTS(warningMsg);
          setShowWaterPopup(false);
          return;
        }
      }

      const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const formatted = kstTime.toISOString().slice(0, 19).replace("T", " ");

      await axios.post(
        `${API_URL}/api/users/water`,
        {
          user_id: userId,
          watered_time: formatted,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setLastWatered(now);
      
      alert("✅ 물주기 완료!");
      
      const successMsg = `좋습니다! 🌱 ${now.toLocaleTimeString("ko-KR")}에 물을 주었습니다. 다음 물주기는 약 3시간 후에 해주세요.`;
      const aiMsg = { sender: "ai", text: successMsg };
      setMessages((prev) => [...prev, aiMsg]);

      await axios.post(`${API_URL}/api/chat/save`, {
        user_id: userId,
        sender: "ai",
        text: successMsg,
      });
      
      playTTS(successMsg);
      setShowWaterPopup(false);
    } catch (err) {
      console.error("물주기 실패:", err);
      const errorMsg = "물주기 기록에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      const aiMsg = { sender: "ai", text: errorMsg };
      setMessages((prev) => [...prev, aiMsg]);
      setShowWaterPopup(false);
    }
  };

  const iconCode = weatherData?.icon;
  const iconUrl = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : null;

  const getVideoByLevel = (level) => {
    if (level >= 4) return level4Video;
    if (level >= 3) return level3Video;
    if (level >= 2) return level2Video;
    return level1Video;
  };

  // AI 챗봇 전송
  const handleSendChat = async (e) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed || isSending) return;

    const userId = localStorage.getItem("id");
    const userMsg = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsSending(true);

    try {
      await axios.post(`${API_URL}/api/chat/save`, {
        user_id: userId,
        sender: "user",
        text: trimmed,
      });

      const res = await axios.post(`${API_URL}/api/chat`, {
        message: trimmed,
      });

      const replyText = res.data.reply || "응답을 불러오지 못했어요 😢";

      const aiMsg = { sender: "ai", text: replyText };
      setMessages((prev) => [...prev, aiMsg]);

      await axios.post(`${API_URL}/api/chat/save`, {
        user_id: userId,
        sender: "ai",
        text: replyText,
      });

      playTTS(replyText);
    } catch (error) {
      console.error("채팅 전송 실패:", error);
      const errorMsg = "서버와 통신 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요 🙏";
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorMsg,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // 이미지 선택 핸들러
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('이미지 크기는 10MB 이하여야 합니다.');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result);
    reader.readAsDataURL(file);
  };

  // 이미지 분석 요청
  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    const userId = localStorage.getItem("id");
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.post(`${API_URL}/api/chat/analyze-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const analysis = response.data.analysis;
      const imageUrl = response.data.imageUrl;
      
      // 사용자가 업로드한 이미지 메시지 추가
      const userImageMsg = { sender: 'user', imageUrl, text: '[식물 사진 업로드]' };
      setMessages((prev) => [...prev, userImageMsg]);
      
      // AI 분석 결과 메시지 추가
      const aiMsg = { sender: 'ai', text: analysis };
      setMessages((prev) => [...prev, aiMsg]);
      
      // 채팅 기록에 저장 - 사용자 이미지 메시지
      await axios.post(`${API_URL}/api/chat/save`, {
        user_id: userId,
        sender: 'user',
        text: imageUrl,
        imageUrl: imageUrl,
      });
      
      // 채팅 기록에 저장 - AI 분석 결과
      await axios.post(`${API_URL}/api/chat/save`, {
        user_id: userId,
        sender: 'ai',
        text: analysis,
      });
      
      // TTS로 재생
      playTTS(analysis);
      
      // 모달 닫기 및 상태 초기화
      setShowImageAnalysis(false);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('이미지 분석 실패:', error);
      const errorMsg = '식물 이미지 분석에 실패했습니다. 다시 시도해주세요.';
      const aiMsg = { sender: 'ai', text: errorMsg };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 이미지 분석 취소
  const handleCancelImageAnalysis = () => {
    setShowImageAnalysis(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="main-container">
      {/* 상단 헤더 */}
      <div className="mainpage-header">
        <button
          className="profile-button"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <FaUserAlt size={20} color="#4a7c59" />
        </button>
        <h2 className="mainpage-header-title">메인 페이지</h2>
      </div>

      {/* 프로필 드롭다운 메뉴 (헤더 밖) */}
      {showMenu && (
        <div className="dropdown-menu" ref={menuRef}>
          <p className="greeting">
            어서오세요<br />
            <strong>{localStorage.getItem("nickname") || "사용자"}</strong> 님
          </p>
          <hr />
          <div className="menu-item">
            <button onClick={() => navigate('/notifications')}>🔔 알림</button>
          </div>
          <div className="menu-item">
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
            >
              🔓 로그아웃
            </button>
          </div>
        </div>
      )}

      {/* 날씨 */}
      <div className="icon-group">
        {iconUrl && <img src={iconUrl} alt="날씨 아이콘" width={50} height={50} />}
        <div>🌡️ {weatherData?.temperature ?? '--'}℃</div>
        <div>💧 {weatherData?.humidity ?? '--'}%</div>
      </div>

      {/* 작물 정보 */}
      <div className="plant-name">
        <strong>{localStorage.getItem("nickname")}</strong>
      </div>

      {/* 레벨 표시 */}
      <div className="level-display">
        <span className="level-label">Level</span>
        <span className="level-value">{level}</span>
      </div>

      {/* 식물 성장 영상 */}
      <div className="video-wrapper">
        <video key={level} muted autoPlay loop playsInline>
          <source src={getVideoByLevel(level)} type="video/mp4" />
        </video>
      </div>

      {/* 실내 환경 */}
      <div className="roomindoor-temperature">
        <div>🌡️ 18℃</div>
        <div>🌱 40%</div>
      </div>

      {/* AI 챗봇 영역 */}
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'ai'}`}
            >
              {msg.imageUrl && (
                <img 
                  src={`${API_URL}${msg.imageUrl}`} 
                  alt="식물 사진" 
                  className="chat-image"
                />
              )}
              {msg.text}
            </div>
          ))}
        </div>

        <form className="chat-input-area" onSubmit={handleSendChat}>
          <button 
            type="button"
            className="image-analysis-button"
            onClick={() => setShowImageAnalysis(true)}
            title="식물 사진으로 진단 받기"
          >
            📸
          </button>
          <input
            type="text"
            className="chat-input"
            placeholder="식물에게 궁금한 걸 물어보세요..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isSending}
          />
          <button type="submit" className="chat-send-button" disabled={isSending}>
            {isSending ? '생각 중…' : '전송'}
          </button>
        </form>

        {/* 이미지 분석 모달 */}
        {showImageAnalysis && (
          <div className="image-analysis-overlay" onClick={handleCancelImageAnalysis}>
            <div className="image-analysis-modal" onClick={(e) => e.stopPropagation()}>
              <div className="image-analysis-header">
                <h3>식물 사진으로 진단 받기</h3>
                <button 
                  className="close-button"
                  onClick={handleCancelImageAnalysis}
                >
                  ✕
                </button>
              </div>

              {!imagePreview ? (
                <div className="image-upload-area">
                  <button 
                    className="upload-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📷 사진 선택하기
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                  <p className="upload-hint">
                    식물의 잎, 줄기, 전체 모습 등을 선명하게 찍어주세요
                  </p>
                </div>
              ) : (
                <div className="image-preview-section">
                  <img src={imagePreview} alt="선택된 식물 사진" className="preview-image" />
                  <div className="image-actions">
                    <button 
                      className="cancel-image-button"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                      }}
                    >
                      다시 선택
                    </button>
                    <button 
                      className="analyze-button"
                      onClick={handleAnalyzeImage}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? '분석 중...' : '식물 진단 시작'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 물주기 버튼 */}
      <div className="water-section">
        <button className="water-button" onClick={handleWater}>
          💧 물주기
        </button>
        {lastWatered && (
          <p className="last-watered">
            마지막 물준 시간: {lastWatered.toLocaleString("ko-KR")}
          </p>
        )}
      </div>

      {/* 물주기 팝업 */}
      {showWaterPopup && (
        <div className="water-popup-overlay" onClick={() => setShowWaterPopup(false)}>
          <div className="water-popup" onClick={(e) => e.stopPropagation()}>
            <video
              ref={waterVideoRef}
              src={plantWaterVideo}
              autoPlay
              onEnded={handleWaterVideoEnd}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
