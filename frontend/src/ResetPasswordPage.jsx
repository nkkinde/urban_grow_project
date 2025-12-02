import React, { useState,useEffect } from "react";
import "./ResetPasswordPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import API_URL from "./api.js";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.id;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  /* 로그인 안된 상태에서 url 하면 로그인 창으로 강제 이동*/
  useEffect(() => {
      if (!userId) {
        alert("잘못된 접근입니다.");
        navigate("/");
      }
    })  
  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      alert("모든 칸을 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
 await axios.post(`${API_URL}/api/users/reset-password/${userId}`, {
        newPassword,
        confirmPassword,
      });
      alert("비밀번호가 재설정되었습니다.");
      navigate("/"); // 로그인 페이지로 이동
    } catch (err) {
      alert(err.response?.data?.message || "비밀번호 재설정 실패");
    }
  };

  return (
    <div className="RPP-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>←</div>
        <h2 className="password-title">비밀번호 재설정</h2>
      </div>
      <hr />
      <p>새로운 비밀번호를 입력해주세요.</p>

      <input
        type="password"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className="main-btn" onClick={handleReset}>재설정하기</button>
    </div>
  );
}
