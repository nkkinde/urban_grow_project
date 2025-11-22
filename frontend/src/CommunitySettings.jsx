import React, { useEffect } from "react";

import "./CommunitySettings.css";
import { useNavigate } from "react-router-dom";

function CommunitySettings() {
  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">커뮤니티 설정</h2>
      </div>

      <div className="menu-section">
        <div className="menu-item" onClick={() => navigate("/usage-history")}>
          이용 내역
        </div>
        <div
          className="menu-item"
          onClick={() => navigate("/community-rules")}
        >
          커뮤니티 이용 규칙
        </div>
        <div className="menu-item" onClick={() => navigate("/interested-posts")}>
          관심 글
        </div>
        <div className="menu-item" onClick={() => navigate("/liked-posts")}>
          좋아요 누른 글
        </div>
      </div>
    </div>
  );
}

export default CommunitySettings;
