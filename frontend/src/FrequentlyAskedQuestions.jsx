import React, { useEffect } from "react";
import "./FrequentlyAskedQuestions.css";
import { useNavigate } from "react-router-dom";

function FrequentlyAskedQuestions() {
  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
  const navigate = useNavigate();

  const faqs = [
    {
      id: 1,
      question: "식물 사진을 어떻게 업로드하나요?",
      answer:
        "커뮤니티 페이지에서 + 버튼을 눌러 사진과 글을 함께 업로드할 수 있어요.",
    },
    {
      id: 2,
      question: "식물 종류를 추가할 수 있나요?",
      answer: "현재는 등록된 식물만 선택할 수 있습니다.",
    },
    {
      id: 3,
      question: "비밀번호를 잊었어요.",
      answer: "로그인 화면에서 “비밀번호 찾기”를 통해 재설정할 수 있어요.",
    },
    {
      id: 4,
      question: "앱 사용은 무료인가요?",
      answer: "네, 이 앱은 완전히 무료로 제공됩니다.",
    },
  ];

  return (
    <div className="faq-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">자주 묻는 질문</h2>
        <span className="placeholder-icon">🔍</span>
      </div>

      <div className="content">
        <div className="faq-list">
          {faqs.map((faq) => (
            <button key={faq.id} className="faq-button">
              Q: {faq.question}
              <br />
              A: {faq.answer}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FrequentlyAskedQuestions;
