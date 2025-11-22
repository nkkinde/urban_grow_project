import React, { useEffect } from "react";
import "./RecentUsage.css";
import { useNavigate } from "react-router-dom";

function RecentUsage() {
  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
  const navigate = useNavigate();

  // 현재 시간 기반으로 날짜와 시간 분리 recentdate = 날, 나머지는 시간
  const currentDateTime = new Date();
  const recentDate = currentDateTime.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const recentTime = currentDateTime.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="recent-usage-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">최근 사용 날짜 및 시간</h2>
        <span className="placeholder-icon">🔍</span>
      </div>

      <div className="content">
        <div className="usage-list">
          <button className="usage-button">
            <span className="icon">L</span> 최근 사용 날짜: {recentDate}
          </button>
          <button className="usage-button">
            <span className="icon">L</span> 최근 사용 시간: {recentTime}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecentUsage;
