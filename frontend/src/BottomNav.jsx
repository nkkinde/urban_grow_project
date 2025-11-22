import React from "react";
import "./BottomNav.css";
import { useNavigate, useLocation } from "react-router-dom";
import diaryicon from "./assets/diary-icon.png";
import homeicon from "./assets/home-icon.png";
import communityicon from "./assets/community-icon.png";
import settingicon from "./assets/setting-icon.png";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <div className="bottom-nav">
      <button className="nav-button" onClick={() => navigate("/plant-diary")}> 
        <img src={diaryicon} alt="diaryicon" className="icon-image" />
        <span className="nav-label" style={{ color: isActive("/plant-diary") ? "#2e7d32" : "#444" }}>식물일지</span>
      </button>
      <button className="nav-button" onClick={() => navigate("/main")}> 
        <img src={homeicon} alt="homeicon" className="icon-image" />
        <span className="nav-label" style={{ color: isActive("/main") ? "#2e7d32" : "#444" }}>메인</span>
      </button>
      <button className="nav-button" onClick={() => navigate("/community")}> 
        <img src={communityicon} alt="communityicon" className="icon-image" />
        <span className="nav-label" style={{ color: isActive("/community") ? "#2e7d32" : "#444" }}>커뮤니티</span>
      </button>
      <button className="nav-button" onClick={() => navigate("/information")}> 
        <img src={settingicon} alt="settingicon" className="icon-image" />
        <span className="nav-label" style={{ color: isActive("/information") ? "#2e7d32" : "#444" }}>설정</span>
      </button>
    </div>
  );
} 