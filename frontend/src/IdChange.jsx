import React, { useState, useEffect } from "react";
import "./IdChange.css";
import { useNavigate } from "react-router-dom";

function IdChange() {
  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
  const navigate = useNavigate();
  const [id, setId] = useState("");

  const handleSave = () => {
    alert(`아이디 "${id}"으로 저장되었습니다!`);
    navigate(-1);
  };

  return (
    <div className="Idch-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="Idch-title">아이디 변경</h2>
      </div>
      <div className="info-text">
        새로운 아이디를 입력해 주세요.
      </div>
      <div className="Id-input-container">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="아이디 입력"
          className="id-input"
        />
      </div>
      <button className="IC-save-button" onClick={handleSave}>
        저장하기
      </button>
    </div>
  );
}

export default IdChange;