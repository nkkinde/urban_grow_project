import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FindAccountPage.css";
import nameicon from "./assets/name_icon.png";
import phonenumbericon from "./assets/phonenumber_icon.png";

export default function FindAccountPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", nickname: "", phone_number: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFindId = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/users/find-id", form);
      const foundId = res.data.id;
      navigate("/id-result", { state: { id: foundId } });
    } catch (err) {
      alert(err.response?.data?.message || "아이디 찾기 실패");
    }
  };

  return (
    <div className="FAP-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>←</div>
        <h2 className="FindAccount-title">아이디찾기</h2>
      </div>
      <hr />

      <div className="input-group">
        <img src="/src/assets/email_icon.png" alt="id" />
        <input name="name" placeholder="이름 입력" onChange={handleChange} />
      </div>

      <div className="input-group">
        <img src={nameicon} alt="nn" />
        <input name="nickname" placeholder="닉네임 입력" onChange={handleChange} />
      </div>

      <div className="input-group">
        <img src={phonenumbericon} alt="phonenumber" />
        <input name="phone_number" placeholder="전화번호 입력" onChange={handleChange} />
      </div>

      <button className="main-btn" onClick={handleFindId}>아이디 찾기</button>
    </div>
  );
}
