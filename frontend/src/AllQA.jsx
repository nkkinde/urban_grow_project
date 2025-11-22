import React from "react";
import "./AllQA.css"; // 새 CSS 파일 참조
import mainicon from "./assets/mainicon.png";
import { useNavigate } from "react-router-dom";

function AllQA() {
  const navigate = useNavigate();

  // 더미 데이터: 전체 Q&A (10개 항목)
  const allQA = [
    { id: 1, question: "상추 잘키우는 법 알려주세요.", author: "bjongseong" },
    { id: 2, question: "상추 잎이 노랗게 변했어요", author: "leejuhyeong" },
    { id: 3, question: "상추에 물을 얼마나 줘야 하나요?", author: "kimminseo" },
    { id: 4, question: "상추 병충해 어떻게 해결하나요?", author: "parkjisoo" },
    { id: 5, question: "상추 햇빛이 부족하면 어떻게 되나요?", author: "choisun" },
    { id: 6, question: "상추 씨앗 심는 간격은 어떻게 하나요?", author: "yoonji" },
    { id: 7, question: "상추 수확 후 관리 방법이 있나요?", author: "jungwoo" },
    { id: 8, question: "상추 잎이 말리는 이유가 뭔가요?", author: "hanseo" },
    { id: 9, question: "상추 토양은 어떤 걸 써야 하나요?", author: "minho" },
    { id: 10, question: "겨울에 상추를 실내에서 키울 수 있나요?", author: "sooyeon" },
  ];

  return (
    <div className="all-qa-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">전체 Q&A</h2>
        <span className="search-icon" onClick={() => navigate("/search")}>
          🔍
        </span>
      </div>

      <div className="qa-list">
        {allQA.map((qa) => (
          <div key={qa.id} className="qa-card" onClick={() => navigate(`/qa-detail`)}>
            <img src={mainicon} alt="프로필 아이콘" className="qa-profile-icon" />
            <div className="qa-content">
              <p className="qa-id">ID: {qa.author}</p>
              <p className="qa-question">{qa.question}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllQA;