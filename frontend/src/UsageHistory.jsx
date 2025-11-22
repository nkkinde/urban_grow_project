import React, { useEffect } from "react";

import "./UsageHistory.css";
import { useNavigate } from "react-router-dom";

function UsageHistory() {
  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
  const navigate = useNavigate();

  const historyItems = [
    { id: 1, title: "댓글 내역", path: "/comment-history" },
    { id: 2, title: "최근 사용 날짜 및 시간", path: "/recent-usage" },
    { id: 3, title: "자주 묻는 질문", path: "/frequently-asked-questions" },
    { id: 4, title: "기록 지우기", path: "#" },
  ];

  const handleItemClick = (title, path) => {
    if (title === "기록 지우기") {
      if (window.confirm("기록을 지우시겠습니까?")) {
        console.log("기록 지우기 완료");
        // 실제 삭제 로직은 백엔드 연동 필요 // 연동 중
      }
    } else if (path !== "#") {
      navigate(path);
    } else {
      console.log(`${title} 클릭됨`);
      // 다른 항목 클릭 시 동작 추가 가능
    }
  };

  return (
    <div className="usage-history-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">이용 내역</h2>
        <span className="placeholder-icon">🔍</span>
      </div>

      <div className="content">
        <div className="history-list">
          {historyItems.map((item) => (
            <button
              key={item.id}
              className={`list-button ${
                item.title === "기록 지우기" ? "delete-button" : ""
              }`}
              onClick={() => handleItemClick(item.title, item.path)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UsageHistory;
