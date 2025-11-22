import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FindPasswordPage.css";

export default function FindPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", name: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVerify = async () => {
    try {
await axios.post("http://localhost:3000/api/users/find-password", form);
      alert("인증 성공! 비밀번호를 재설정해주세요.");
      navigate("/reset-password", { state: { id: form.id } }); // id 전달
    } catch (err) {
      alert(err.response?.data?.message || "인증 실패");
    }
  };

  return (
    <div className="FPW-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>←</div>
        <h2 className="FindPassword-title">비밀번호 찾기</h2>
      </div>
      <hr />
      <input name="id" placeholder="아이디 입력" onChange={handleChange} />
      <input name="name" placeholder="이름 입력" onChange={handleChange} />
      <button className="main-btn" onClick={handleVerify}>다음</button>
    </div>
  );
}
