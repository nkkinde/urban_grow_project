import React, { useEffect } from "react";
import "./InterestedPosts.css";
import { useNavigate } from "react-router-dom";
import starIcon from "./assets/star.png"; 

function InterestedPosts() {
  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
  const navigate = useNavigate();

  const posts = [
    { id: 1, title: "게시글 제목1" },
    { id: 2, title: "게시글 제목2" },
    { id: 3, title: "게시글 제목3" },
    { id: 4, title: "게시글 제목4" },
  ];

  return (
    <div className="interested-posts-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">관심 글</h2>
        <span className="placeholder-icon">🔍</span>
      </div>

      <div className="content">
        <div className="posts-list">
          {posts.map((post) => (
            <button key={post.id} className="post-button">
              <img src={starIcon} alt="star" className="star-icon" />
              {post.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InterestedPosts;
