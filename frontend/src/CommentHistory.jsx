import React, { useEffect } from "react";
import "./CommentHistory.css";
import { useNavigate } from "react-router-dom";

function CommentHistory() {
  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
  const navigate = useNavigate();

  const comments = [
    { id: 1, text: "안녕하세요~" },
    { id: 2, text: "상추가 맛있어보여요~" },
    { id: 3, text: "대파가 싱싱해보이네요~" },  
    { id: 4, text: "레벨업 빨리 하고 싶당 ㅠㅠ" },
  ];

  return (
    <div className="comment-history-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">댓글 내역</h2>
        <span className="placeholder-icon">🔍</span>
      </div>

      <div className="content">
        <div className="comment-list">
          {comments.map((comment) => (
            <button key={comment.id} className="comment-button">
              <span className="icon">L</span> {comment.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommentHistory;
