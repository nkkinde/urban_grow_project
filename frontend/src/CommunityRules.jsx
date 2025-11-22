import React, { useEffect } from "react";

import "./CommunityRules.css";
import { useNavigate } from "react-router-dom";

function CommunityRules() {
  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
  const navigate = useNavigate();

  const rules = [
    {
      id: 1,
      title: "존중과 배려",
      content: "타인을 비방하거나 모욕하는 언행은 삼가주세요.",
    },
    {
      id: 2,
      title: "허위 정보 및 광고 금지",
      content:
        "허위 정보 유포, 상업성 광고, 홍보성 글은 금지됩니다.\n무단 링크 또는 스팸성 게시물도 허용되지 않습니다.",
    },
    {
      id: 3,
      title: "개인 정보 보호",
      content:
        "타인의 개인정보를 유출할 경우 강제 퇴장될 수 있습니다.",
    },
    {
      id: 4,
      title: "중복 게시물 및 도배 금지",
      content:
        "같은 내용을 반복적으로 올리는 행위는 제한됩니다.",
    },
    {
      id: 5,
      title: "게시글 및 댓글 관리",
      content:
        "부적절한 게시물은 운영진 판단에 따라 사전 통보 없이 삭제될 수 있습니다.",
    },
    {
      id: 6,
      title: "저작권 존중",
      content:
        "타인의 콘텐츠를 무단으로 게시하는 행위는 금지됩니다.",
    },
  ];

  return (
    <div className="community-rules-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">커뮤니티 이용 규칙</h2>
        <span className="placeholder-icon">🔍</span>
      </div>

      <div className="content">
        <div className="rules-list">
          {rules.map((rule) => (
            <button key={rule.id} className="rule-button">
              {rule.id}. {rule.title}
              <br />
              {rule.content}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityRules;
