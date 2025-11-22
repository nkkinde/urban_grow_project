import React, { useState } from "react";
import "./QADetail.css";
import { useNavigate, useParams } from "react-router-dom";
import profileIcon from "./assets/mainicon.png"; // 프로필 아이콘

function QADetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const qaData = {
    1: {
      title: "Q&A",
      author: "bjongseong",
      question: "상추 잘 키우는 법 알려주세요.",
      answers: [
        "james: 물 많이주세요...",
        "user2: 햇빛도 중요해요...",
      ],
      time: "2025.6.15 15:23",
    },
  };

  const qa = qaData[id] || qaData[1];
  const [newAnswer, setNewAnswer] = useState("");

  const handleAddAnswer = () => {
    if (newAnswer.trim()) {
      const updatedAnswers = [...qa.answers, newAnswer];
      console.log("새 답변 추가:", updatedAnswers);
      setNewAnswer("");
    }
  };

  return (
    <div className="qa-detail-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">{qa.title}</h2>
        <span className="search-icon">🔍</span>
      </div>

      {/* 질문 섹션 */}
      <div className="qa-question-section">
        <div className="qa-card">
          <img src={profileIcon} alt="프로필" className="profile-icon" />
          <div className="qa-content">
            <p className="qa-id">ID: {qa.author}</p>
            <p className="qa-question">{qa.question}</p>
            <p className="qa-time">{qa.time}</p>
          </div>
          <button className="like-button">👍</button>
        </div>
      </div>

      {/* 답변 섹션 */}
      <div className="qa-answer-section">
        {qa.answers.map((answer, index) => (
          <div key={index} className="qa-answer-card">
            <p className="qa-answer">답변: {answer}</p>
          </div>
        ))}
        <div className="answer-section">
          <input
            type="text"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddAnswer()}
            className="answer-input"
            placeholder="댓글을 입력해주세요..."
          />
          <button className="submit-button" onClick={handleAddAnswer}>등록</button>
        </div>
      </div>

      <div className="author-info">
        <p>댓글을 입력해주세요.</p>
      </div>
    </div>
  );
}

export default QADetail;
