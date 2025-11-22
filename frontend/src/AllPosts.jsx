import React from "react";
import "./AllPosts.css"; // 새 CSS 파일 참조
import lettuce1 from "./assets/lettuce1.png";
import lettuce2 from "./assets/lettuce2.png";
import { useNavigate } from "react-router-dom";

function AllPosts() {
  const navigate = useNavigate();

  // 더미 데이터: 전체 게시글 (10개 항목)
  const allPosts = [
    { id: 1, title: "상추 키우기", description: "상추가 잘 자라고 있어요", author: "bjongseong", time: "8시간 전", image: lettuce1 },
    { id: 2, title: "상추가 이상해요", description: "상추 잎이 노랗게 변했어요", author: "leejuhyeong", time: "1일 전", image: lettuce2 },
    { id: 3, title: "상추 물 주는 법", description: "하루에 몇 번 물을 줘야 하나요?", author: "kimminseo", time: "2일 전", image: lettuce1 },
    { id: 4, title: "상추 병충해", description: "상추에 벌레가 생겼어요", author: "parkjisoo", time: "3일 전", image: lettuce2 },
    { id: 5, title: "상추 햇빛 필요량", description: "상추는 햇빛을 얼마나 받아야 하나요?", author: "choisun", time: "4일 전", image: lettuce1 },
    { id: 6, title: "상추 씨앗 심기", description: "상추 씨앗을 어떻게 심나요?", author: "yoonji", time: "5일 전", image: lettuce2 },
    { id: 7, title: "상추 수확 시기", description: "상추는 언제 수확해야 하나요?", author: "jungwoo", time: "6일 전", image: lettuce1 },
    { id: 8, title: "상추 잎이 말려요", description: "상추 잎이 말리는 이유는 뭔가요?", author: "hanseo", time: "7일 전", image: lettuce2 },
    { id: 9, title: "상추 토양 관리", description: "상추를 위한 토양 관리법", author: "minho", time: "8일 전", image: lettuce1 },
    { id: 10, title: "상추 겨울 재배", description: "겨울에도 상추를 키울 수 있나요?", author: "sooyeon", time: "9일 전", image: lettuce2 },
  ];

  return (
    <div className="all-posts-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">전체 게시글</h2>
        <span className="search-icon" onClick={() => navigate("/search")}>
          🔍
        </span>
      </div>

      <div className="post-list">
        {allPosts.map((post) => (
          <div key={post.id} className="post-card" onClick={() => navigate(`/post-detail`)}>
            <div className="post-content">
              <div className="post-text">
                <p className="post-title">{post.title}</p>
                <p className="post-description">{post.description}</p>
                <p className="post-author">{post.author}</p>
              </div>
              <img src={post.image} alt={`${post.title} 아이콘`} className="post-icon" />
            </div>
            <p className="post-time">{post.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllPosts;