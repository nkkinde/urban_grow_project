import React, { useState, useEffect } from "react";
import "./ChangePassword.css";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보이기/숨기기 상태
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 비밀번호 확인 보이기/숨기기 상태
  

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // 토글
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword); // 토글
  };

  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })

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
        새로운 비밀번호를 입력해주세요.
      </div>

      {/* 비밀번호 입력 필드 */}
    <div className="input-container">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="새로운 비밀번호"
        className="password-input"
      />
      <span
        className="toggle-password"
        onClick={toggleShowPassword}
      >
        {showPassword ? "👀" : "🫣"}
      </span>
    </div>

{/* 비밀번호 확인 입력 필드 */}
    <div className="input-container">
      <input
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="비밀번호 확인"
        className="password-input"
      />
      <span
        className="toggle-password"
        onClick={toggleShowConfirmPassword}
      >
        {showConfirmPassword ? "👀" : "🫣"}
      </span>
    </div>

      {/* 제출 버튼 */}
      <button className="submit-button">재설정하기</button>
    </div>
  );
}

export default ChangePassword;