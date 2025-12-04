import React, { useState, useEffect } from "react";
import "./NicknameChange.css";
import { useNavigate } from "react-router-dom";
import { useUserNickname } from "./UserNickname";
import axios from "axios";
import API_URL from "./api.js";

function NicknameChange() {
  const navigate = useNavigate();
  const { nickname, setNickname } = useUserNickname();
  const [newNickname, setNewNickname] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
    // 현재 닉네임을 기본값으로 설정
    setNewNickname(nickname || "");
  }, [navigate, nickname]);

  const handleSave = async () => {
    if (!newNickname.trim()) {
      alert("닉네임을 입력해 주세요!");
      return;
    }

    try {
      const userId = localStorage.getItem("id");
      // 서버에 닉네임 업데이트 요청
      await axios.put(`${API_URL}/api/users/nickname-change`, {
        userId: userId,
        newNickname: newNickname,
      });

      // localStorage와 화면에 모두 반영
      localStorage.setItem('nickname', newNickname);
      setNickname(newNickname);

      alert(`닉네임이 "${newNickname}"으로 변경되었습니다!`);
      navigate(-1);
    } catch (err) {
      alert("닉네임 변경 실패: " + (err.response?.data?.message || "서버 오류"));
    }
  };

  return (
    <div className="NC-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">닉네임 변경</h2>
      </div>

      <div className="info-text">새로운 닉네임을 입력해 주세요.</div>

      <div className="input-container">
        <input
          type="text"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder="닉네임 입력"
          className="nickname-input"
        />
      </div>

      <button className="NC-save-button" onClick={handleSave}>
        저장하기
      </button>
    </div>
  );
}

export default NicknameChange;
