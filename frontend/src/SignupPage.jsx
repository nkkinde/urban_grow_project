import React, { useState } from "react";
import "./SignupPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "./api.js";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: "",
    email: "",
    password: "",
    passwordCheck: "",
    nickname: "",
    phone_number: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    // 필수 항목 검증
    if (!form.id || !form.email || !form.password || !form.nickname) {
      alert("아이디, 이메일, 비밀번호, 닉네임은 필수항목입니다.");
      return;
    }

    if (form.password !== form.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        id: form.id,
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        phone_number: form.phone_number || null,
      });
      
      alert(response.data.message || "회원가입 완료!");
      navigate("/");
    } catch (error) {
      alert("회원가입 실패: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="signup-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h1 className="signup-title">회원가입</h1>
      </div>

      <div className="input-group">
        <img src="/src/assets/email_icon.png" alt="id" />
        <input 
          type="text" 
          name="id" 
          placeholder="아이디 입력" 
          onChange={handleChange} 
        />
      </div>

      <div className="input-group">
        <img src="/src/assets/email_icon.png" alt="email" />
        <input 
          type="email" 
          name="email" 
          placeholder="이메일 입력" 
          onChange={handleChange} 
        />
      </div>

      <div className="input-group">
        <img src="/src/assets/password_icon.png" alt="password" />
        <input 
          type="password" 
          name="password" 
          placeholder="비밀번호 입력" 
          onChange={handleChange} 
        />
      </div>

      <div className="input-group">
        <img src="/src/assets/password_icon.png" alt="password check" />
        <input 
          type="password" 
          name="passwordCheck" 
          placeholder="비밀번호 확인" 
          onChange={handleChange} 
        />
      </div>

      <div className="input-group">
        <img src="/src/assets/name_icon.png" alt="nickname" />
        <input 
          type="text" 
          name="nickname" 
          placeholder="닉네임 입력" 
          onChange={handleChange} 
        />
      </div>

      <div className="input-group">
        <img src="/src/assets/phonenumber_icon.png" alt="phonenumber" />
        <input 
          type="text" 
          name="phone_number" 
          placeholder="전화번호 입력 (선택사항)" 
          onChange={handleChange} 
        />
      </div>

      <button className="signup-button" onClick={handleSignup}>가입하기</button>
    </div>
  );
}

