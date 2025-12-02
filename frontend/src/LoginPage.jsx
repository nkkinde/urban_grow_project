import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css";
import loginicon from "./assets/mainicon.png";
import emailIcon from "./assets/email_icon.png";
import passwordicon from "./assets/password_icon.png";
import kakaoicon from "./assets/kakao_icon.png";
import navericon from "./assets/naver_icon.png";
import googleicon from "./assets/google_icon.png";
import signupicon from "./assets/signup.png";
import FindIDicon from "./assets/FindID.png";
import API_URL from "./api.js";
import FindPWicon from "./assets/FindPW.png";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        id : id,
        password : password
      });
      localStorage.setItem("id", res.data.user.id); // 로컬 호스트에 아이디 저장
      localStorage.setItem("nickname", res.data.user.nickname); // 로컬 호스트에 저장
      alert(res.data.message); // "로그인 성공!"
      navigate("/main");
    } catch (err) {
      alert(err.response?.data?.message || "로그인 실패");
    }
  };

  return (
    <div className="LP-container">
      <h1 className="LP-title">UrbanGrow</h1>
      <img src={loginicon} alt="LP-logo" className="LP-logo" />

      {/* 아이디 입력 */}
      <div className="id-pw">
        <img src={emailIcon} alt="id" className="LP-id" />
        <input
          type="text"
          placeholder="아이디 입력"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="id-pw">
        <img src={passwordicon} alt="password" className="LP-pw" />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* 링크 버튼들 */}
      <div className="LP-links">
        <button className="LP-link-btn" onClick={() => navigate("/signup")}>
          <img src={signupicon} alt="signupicon" className="LP-icon" />
          회원가입
        </button>
        <button className="LP-link-btn" onClick={() => navigate("/find-account")}>
          <img src={FindIDicon} alt="FindIDicon" className="LP-icon" />
          아이디 찾기
        </button>
        <button className="LP-link-btn" onClick={() => navigate("/find-password")}>
          <img src={FindPWicon} alt="FindPWicon" className="LP-icon" />
          비밀번호 찾기
        </button>
      </div>

      {/* 로그인 버튼 */}
      <button className="LP-login-btn" onClick={handleLogin}>
        Login
      </button>

      {/* 소셜 로그인 아이콘 */}
      <div className="LP-social-icons">
        <button className="LP-social-btn"><img src={kakaoicon} alt="kakao" /></button>
        <button className="LP-social-btn"><img src={navericon} alt="naver" /></button>
        <button className="LP-social-btn"><img src={googleicon} alt="google" /></button>
      </div>
    </div>
  );
}
