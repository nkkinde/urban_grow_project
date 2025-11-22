import React, { useState } from "react";
import "./PostDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import profileIcon from "./assets/mainicon.png"; // 프로필 아이콘
import lettuce1 from "./assets/lettuce1.png"; // 상추 키우기 이미지
import lettuce2 from "./assets/lettuce2.png"; // 상추가 이상해요 이미지

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // 이 줄이 올바른 useParams 사용입니다.

  const postData = {
    1: {
      title: "상추 키우기",
      author: "bjongseong",
      time: "2025.6.15 15:23",
      description: "상추가 잘 자라고 있어요",
      content: "정말 잘 자라는 중이에요!",
      image: lettuce1,
      initialComments: [
        { author: "user1", text: "멋진 상추네요!", time: "2025.6.15 16:00" },
      ],
    },
    2: {
      title: "상추가 이상해요",
      author: "leejuhyeong",
      time: "2025.4.11 10:10",
      description: "상추 잎이 노랗게 변했어요",
      content: "어떻게 해야 할까요?",
      image: lettuce2,
      initialComments: [
        { author: "user2", text: "물 조절이 필요할지도요.", time: "2025.4.11 11:00" },
      ],
    },
  };

  const post = postData[id] || postData[1];
  const [comments, setComments] = useState(post.initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        { author: post.author, text: newComment, time: new Date().toLocaleString() },
      ]);
      setNewComment("");
    }
  };

  return (
    <div className="post-detail-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">{post.title}</h2>
        <span className="search-icon" onClick={() => navigate("/search")}>
          🔍
        </span>
      </div>

      <div className="profile-section">
        <img src={profileIcon} alt="프로필" className="profile-icon" />
        <p className="profile-description">{post.description}</p>
      </div>

      <div className="post-image-section">
        <img src={post.image} alt="상추 이미지" className="post-image" />
      </div>

      <div className="post-content-section">
        <div className="post-meta">
          <p className="post-author">KAI: {post.author}</p>
          <p className="post-time">{post.time}</p>
        </div>
        <div className="post-content">
          <p>{post.content}</p>
        </div>
        {comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <p className="comment-author">KAI: {comment.author}</p>
            <p className="comment-text">{comment.text}</p>
            <p className="comment-time">{comment.time}</p>
          </div>
        ))}
        <div className="comment-input-wrapper">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="comment-input"
          />
          <button className="comment-submit" onClick={handleAddComment}>
            등록
          </button>
        </div>
      </div>

      <div className="author-info">
        <p>{post.author} 8시간 전</p>
      </div>
    </div>
  );
}

export default PostDetail;