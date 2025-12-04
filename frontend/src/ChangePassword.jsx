import React, { useState, useEffect } from "react";
import "./ChangePassword.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "./api.js";

function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호
  const [password, setPassword] = useState(""); // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  }, [navigate]);

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
    if (!password.trim()) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < 4) {
      alert("비밀번호는 4자 이상이어야 합니다.");
      return;
    }

    try {
      const userId = localStorage.getItem("id");
      const res = await axios.post(`${API_URL}/api/users/change-password`, {
        userId: userId,
        currentPassword: currentPassword,
        newPassword: password,
      });

      alert(res.data.message || "비밀번호가 변경되었습니다!");
      navigate(-1);
    } catch (err) {
      alert("비밀번호 변경 실패: " + (err.response?.data?.message || "서버 오류"));
    }
  };

  return (
    <div className="CP-container">
      {/* 뒤로가기 버튼과 타이틀 */}
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">비밀번호 변경</h2>
      </div>

      {/* 안내 문구 */}
      <div className="info-text">
        비밀번호를 변경하려면 현재 비밀번호를 확인해주세요.
      </div>

      {/* 현재 비밀번호 입력 필드 */}
      <div className="input-container">
        <input
          type={showCurrentPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호"
          className="password-input"
        />
        <span className="toggle-password" onClick={toggleShowCurrentPassword}>
          {showCurrentPassword ? "👀" : "🫣"}
        </span>
      </div>

      {/* 새 비밀번호 입력 필드 */}
      <div className="input-container">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="새 비밀번호"
          className="password-input"
        />
        <span className="toggle-password" onClick={toggleShowPassword}>
          {showPassword ? "👀" : "🫣"}
        </span>
      </div>

      {/* 비밀번호 확인 입력 필드 */}
      <div className="input-container">
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호 확인"
          className="password-input"
        />
        <span className="toggle-password" onClick={toggleShowConfirmPassword}>
          {showConfirmPassword ? "👀" : "🫣"}
        </span>
      </div>

      {/* 제출 버튼 */}
      <button className="submit-button" onClick={handleChangePassword}>
        비밀번호 변경
      </button>
    </div>
  );
}

export default ChangePassword;