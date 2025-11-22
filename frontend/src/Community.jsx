import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Community.css";
import loginicon from "./assets/mainicon.png";
import diaryicon from "./assets/diary-icon.png";
import communityicon from "./assets/community-icon.png";
import homeicon from "./assets/home-icon.png";
import settingicon from "./assets/setting-icon.png";
import searchicon from "./assets/search-icon.png";
import lettuce1 from "./assets/lettuce1.png";
import lettuce2 from "./assets/lettuce2.png";
import { MdMenu } from "react-icons/md";
import BottomNav from "./BottomNav";

function Community() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <div className="community-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>←</div>
        <h2 className="title">커뮤니티</h2>
        <img
          src={searchicon}
          alt="검색"
          className="search-icon"
          onClick={() => navigate("/search")}
        />
      </div>

      <div className="popular-posts-header" onClick={() => navigate("/all-posts")}>
        <span className="popular-title">커뮤니티 인기글</span>
        <span className="popular-arrow">&gt;</span>
      </div>

      <div className="post-card" onClick={() => navigate("/post/1")}>
        <div className="post-content">
          <div className="post-text">
            <p className="post-title">상추 키우기</p>
            <p className="post-description">상추가 잘 자라고 있어요</p>
            <p className="post-author">bjongseong</p>
          </div>
          <img src={lettuce1} alt="상추" className="post-icon" />
        </div>
      </div>

      <div className="post-card" onClick={() => navigate("/post/2")}>
        <div className="post-content">
          <div className="post-text">
            <p className="post-title">상추가 이상해요</p>
            <p className="post-description">상추 잎이 노랗게 변했어요</p>
            <p className="post-author">leejuhyeong</p>
          </div>
          <img src={lettuce2} alt="상추" className="post-icon" />
        </div>
      </div>

      <h2 className="section-title">Q&A</h2>

      <div className="popular-QnA-header" onClick={() => navigate("/all-qa")}>
        <span className="popular-title">자주 묻는 질문</span>
        <span className="popular-arrow">&gt;</span>
      </div>

      <div className="qa-card" onClick={() => navigate("/qa/1")}>
        <img src={loginicon} alt="프로필 아이콘" className="qa-profile-icon" />
        <div className="qa-content">
          <p className="qa-id">ID: bjongseong</p>
          <p className="qa-question">상추 잘키우는 법 알려주세요.</p>
        </div>
      </div>

      {/* 오른쪽 하단 메뉴 */}
      <div className="floating-menu-container">
        {menuOpen && (
          <div className="popup-menu-box">
            <button onClick={() => navigate("/create-post")}>✏ 글쓰기</button>
            <button onClick={() => navigate("/community-settings")}>⚙ 설정</button>
          </div>
        )}
        <button className="menu-toggle-btn" onClick={toggleMenu}>
          <MdMenu size={28} color="#4a704a" />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

export default Community;
