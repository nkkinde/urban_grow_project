import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./IdResultPage.css";

export default function IdResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id || "*****";

  return (
    <div className="IRP-container">
      <h2 className="result-text">회원님의 아이디는<br /><strong>{id}</strong> 입니다.</h2>

      <div className="button-row">
        <button onClick={() => navigate("/")}>로그인 하러가기</button>
        <button onClick={() => navigate("/find-password")}>비밀번호 찾기</button>
      </div>
    </div>
  );
}
