import React, { useEffect } from "react";
import "./Information.css";
import { useNavigate } from "react-router-dom";
import { useUserNickname } from "./UserNickname";
import BottomNav from "./BottomNav";

function Information() {
  const navigate = useNavigate();
  const { nickname } = useUserNickname();

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  }, []);

  return (
    <div className="Info-container">
      {/* 상단 헤더 */}
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="Info-title">내 정보</h2>
      </div>

      {/* 캐릭터 정보 */}
      <div className="Info-profile-box">
        <div className="Info-character-circle">캐릭터</div>
        <div className="character-name">{nickname}</div>
      </div>

      {/* 메뉴 항목 */}
      <div style={{ width: "100%" }}>
        <div className="menu-item" onClick={() => navigate("/change-password")}>
          비밀번호 변경 <span className="arrow">→</span>
        </div>
        <div className="menu-item" onClick={() => navigate("/nickname-change")}>
          닉네임 변경 <span className="arrow">→</span>
        </div>
        <div className="menu-item" onClick={() => navigate("/withdrawal")}>
          회원 탈퇴 <span className="arrow">→</span>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default Information;
