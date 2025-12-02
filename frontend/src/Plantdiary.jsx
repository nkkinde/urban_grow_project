import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Plantdiary.css";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import BottomNav from "./BottomNav";
import API_URL from "./api.js";

export default function Plantdiary() {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("id");
  const menuRef = useRef(null);

  // 상태 관리
  const [showMenu, setShowMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [showMemoPopup, setShowMemoPopup] = useState(false);
  const [memo, setMemo] = useState("");
  const [hasMemo, setHasMemo] = useState(false);
  const [memoDates, setMemoDates] = useState([]);
  const [createdAt, setCreatedAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 인증 체크
  useEffect(() => {
    if (!user_id) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  }, [user_id, navigate]);

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

  // 메모 날짜 목록 조회
  useEffect(() => {
    if (!user_id) return;

    const fetchMemoDates = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/memos/dates?user_id=${user_id}`);
        setMemoDates(res.data.memoDates || []);
      } catch (err) {
        console.error("메모 날짜 불러오기 실패:", err);
      }
    };

    fetchMemoDates();
  }, [user_id]);

  // 이미지 경로 파싱
  const parseImagePaths = (imagePathsString) => {
    if (!imagePathsString) return [];
    try {
      return JSON.parse(imagePathsString);
    } catch {
      return [];
    }
  };

  // 메모 데이터 초기화
  const resetMemoData = useCallback(() => {
    setMemo("");
    setHasMemo(false);
    setCreatedAt(null);
    setUpdatedAt(null);
    setImages([]);
  }, []);

  // 날짜 클릭 핸들러
  const handleDateClick = useCallback(async (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const formatted = new Date(date.getTime() - offset).toISOString().split("T")[0];

    setSelectedDate(date);
    setFormattedDate(formatted);
    setCurrentImageIndex(0);

    try {
      const res = await axios.get(
        `${API_URL}/api/memos/memo?date=${formatted}&user_id=${user_id}`
      );

      setMemo(res.data.content || "");
      setCreatedAt(res.data.created_at);
      setUpdatedAt(res.data.updated_at);
      setImages(parseImagePaths(res.data.image_paths));
      setHasMemo(true);
    } catch (err) {
      if (err.response?.status === 404) {
        resetMemoData();
      } else {
        console.error("메모 조회 오류:", err);
      }
    }

    setShowMemoPopup(true);
  }, [user_id, resetMemoData]);

  // 메모 삭제 핸들러
  const handleDeleteMemo = useCallback(async () => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/memos/memo`, {
        data: { date: formattedDate, user_id },
      });

      alert("삭제 완료!");
      resetMemoData();
      setMemoDates((prev) => prev.filter((d) => d !== formattedDate));
      setShowMemoPopup(false);
    } catch (err) {
      alert("삭제 실패: " + err.response?.data?.message);
    }
  }, [formattedDate, user_id, resetMemoData]);

  // 이미지 네비게이션
  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }, [images.length]);

  // 일지 편집 네비게이션
  const handleEditMemo = useCallback(() => {
    navigate("/write-memo", {
      state: { 
        date: formattedDate, 
        user_id, 
        existingMemo: hasMemo ? memo : "" 
      },
    });
  }, [navigate, formattedDate, user_id, hasMemo, memo]);

  // 닉네임 조회
  const nickname = localStorage.getItem("nickname") || "사용자";

  return (
    <div className="diary-container">
      {/* 상단 헤더 */}
      <div className="diary-header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="diary-page-title">🌱 식물 일지</h2>
        <button
          className="profile-button"
          onClick={() => setShowMenu((prev) => !prev)}
          aria-label="프로필 메뉴"
        >
          <FaUserAlt size={20} color="#4a7c59" />
        </button>
      </div>

      {/* 프로필 드롭다운 메뉴 */}
      {showMenu && (
        <div className="dropdown-menu" ref={menuRef}>
          <p className="greeting">
            어서오세요<br />
            <strong>{nickname}</strong> 님
          </p>
          <hr />
          <div className="menu-item">
            <button onClick={() => navigate("/notifications")}>
              🔔 알림
            </button>
          </div>
          <div className="menu-item">
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              🔓 로그아웃
            </button>
          </div>
        </div>
      )}

      {/* 소개 카드 */}
      <div className="diary-intro-card">
        <div className="intro-icon">📝</div>
        <div className="intro-text">
          <h3>매일의 성장을 기록하세요</h3>
          <p>식물의 변화를 찍고 다이어리를 작성해보세요</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="diary-stats">
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <div className="stat-info">
            <p className="stat-label">작성한 메모</p>
            <p className="stat-value">{memoDates.length}개</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🌿</span>
          <div className="stat-info">
            <p className="stat-label">선택된 날짜</p>
            <p className="stat-value">{selectedDate.getDate()}일</p>
          </div>
        </div>
      </div>

      {/* 달력 헤더 */}
      <div className="calendar-header">
        <h3>{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월</h3>
        <p className="calendar-subtitle">메모가 있는 날짜를 선택하세요 ·</p>
      </div>

      {/* 달력 */}
      <div className="calendar-container">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateClick}
          inline
          renderDayContents={(day, date) => {
            const formatted = date.toISOString().split("T")[0];
            const hasDot = memoDates.includes(formatted);
            return (
              <div className="day-cell">
                {day}
                {hasDot && <div className="dot"></div>}
              </div>
            );
          }}
        />
      </div>

      {/* 메모 팝업 */}
      {showMemoPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{selectedDate.toLocaleDateString("ko-KR")}의 메모</h3>

            {/* 메모 텍스트 */}
            <p className="memo-text">
              {hasMemo ? memo : "메모가 없습니다."}
            </p>

            {/* 이미지 슬라이더 */}
            {images.length > 0 && (
              <div className="image-slider-container">
                <div className="image-display">
                  <img
                    src={`${API_URL}/${images[currentImageIndex]}`}
                    alt={`메모 이미지 ${currentImageIndex + 1}`}
                    className="memo-image"
                  />
                </div>

                {/* 이미지 네비게이션 */}
                <div className="image-controls">
                  <button
                    className="image-nav-btn prev"
                    onClick={handlePrevImage}
                    disabled={images.length === 1}
                    aria-label="이전 이미지"
                  >
                    ◀
                  </button>
                  <span className="image-counter">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                  <button
                    className="image-nav-btn next"
                    onClick={handleNextImage}
                    disabled={images.length === 1}
                    aria-label="다음 이미지"
                  >
                    ▶
                  </button>
                </div>
              </div>
            )}

            {/* 타임스탬프 */}
            {createdAt && (
              <p className="timestamp">
                작성 : {new Date(createdAt).toLocaleString("ko-KR")}
              </p>
            )}
            {updatedAt && createdAt !== updatedAt && (
              <p className="timestamp">
                수정 : {new Date(updatedAt).toLocaleString("ko-KR")}
              </p>
            )}

            {/* 액션 버튼 */}
            <div style={{ marginTop: "12px" }}>
              <button
                className="write-button"
                onClick={handleEditMemo}
              >
                {hasMemo ? "글수정" : "글쓰기"}
              </button>

              {hasMemo && (
                <button
                  className="delete-button"
                  onClick={handleDeleteMemo}
                >
                  글삭제
                </button>
              )}

              <button
                className="close-button"
                onClick={() => setShowMemoPopup(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
