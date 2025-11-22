import React, { useState,useEffect } from "react";
import "./Withdrawal.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Withdrawal() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const userId = localStorage.getItem("id"); // 유저 ID 가져오기

  const handleWithdraw = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.clear(); // 모든 로그인 정보 제거
      navigate("/"); // 로그인 페이지 등으로 이동
    } catch (err) {
      alert("회원 탈퇴 실패: " + err.response?.data?.message || "서버 오류");
    }
  };
    useEffect(() => {
          const userId = localStorage.getItem("id"); // 비정상 경로 확인
          if (!userId) {
            alert("잘못된 접근입니다.");
            navigate("/");
          }
        })

  return (
    <div className="Wd-container">
      {/* 상단 헤더 */}
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>←</div>
        <h2 className="title">회원 탈퇴</h2>
      </div>

      {/* 안내문 */}
      <div className="withdrawal-text">
        <p>회원 탈퇴를 요청하시기 전, 아래 내용을 꼭 확인해 주세요.</p>
        <ul>
          <li>탈퇴 시 계정 정보(아이디, 닉네임 등)와 게시물, 개인 데이터가 삭제됩니다.</li>
          <li>삭제된 데이터는 복구할 수 없으니 신중히 결정해 주세요.</li>
        </ul>
      </div>

      {/* 탈퇴 버튼 */}
      <button className="withdraw-button" onClick={() => setShowConfirm(true)}>
        탈퇴하기
      </button>

      {/* 확인 팝업 */}
      {showConfirm && (
        <div className="popup">
          <div className="popup-content">
            <p>정말로 탈퇴하시겠습니까?</p>
            <button className="confirm-button" onClick={handleWithdraw}>예</button>
            <button className="cancel-button" onClick={() => setShowConfirm(false)}>아니요</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Withdrawal;
