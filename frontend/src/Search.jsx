import React, { useState, useEffect } from "react";
import "./Search.css";
import { useNavigate } from "react-router-dom";
import lettuce3 from "./assets/lettuce3.png";
import Sesame from "./assets/Sesame.png";
import leek from "./assets/leek.png";
import onion from "./assets/onion.png";
import chili from "./assets/chili.png";

function Search() {
  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      console.log("검색어:", searchTerm);
      setSearchTerm("");
    }
  };

  const vegetables = [
    {
      name: "상추",
      image: lettuce3,
      growingMethod: "실내 창가에 놓고 18-20°C에서 재배. 흙은 항상 촉촉하게 유지.",
      growingPeriod: "파종 후 30-40일",
      wateringMethod: "2-3일에 한 번, 흙 표면이 마르면 물 주기. 과습 피하기.",
      harvestPeriod: "잎이 15cm 정도 자라면 수확. 외부 잎부터 따기로 지속 수확 가능.",
    },
    {
      name: "깻잎",
      image: Sesame,
      growingMethod: "따뜻한 환경 선호(20-25°C). 밝은 실내 또는 베란다 추천.",
      growingPeriod: "파종 후 35-45일",
      wateringMethod: "흙이 마르지 않도록 1-2일에 한 번 물 주기. 잎이 시들면 즉시 급수.",
      harvestPeriod: "잎이 8-10cm 정도 자라면 수확. 한 번에 2-3장씩 따기.",
    },
    {
      name: "대파",
      image: leek,
      growingMethod: "배수가 잘 되는 흙 사용. 15-20°C 선호. 햇빛 충분히 필요.",
      growingPeriod: "파종 후 60-90일",
      wateringMethod: "흙이 마르면 충분히 물 주기. 주 2-3회 정도 급수.",
      harvestPeriod: "흰 부분이 15-20cm 정도 자라면 수확 가능. 뿌리는 남겨 재생 가능.",
    },
    {
      name: "양파",
      image: onion,
      growingMethod: "통풍 잘 되는 밝은 장소. 흙은 약간 건조하게 유지. 13-20°C 적정.",
      growingPeriod: "파종 후 120-150일",
      wateringMethod: "흙이 완전히 마르기 전에 물 주기. 과습은 곰팡이 유발.",
      harvestPeriod: "잎이 누래지면 수확. 줄기가 완전히 말린 후 저장.",
    },
    {
      name: "고추",
      image: chili,
      growingMethod: "따뜻함 필요(20-25°C). 햇빛 많이 필요. 통풍 잘 되는 환경.",
      growingPeriod: "파종 후 90-120일",
      wateringMethod: "흙 표면이 건조해지면 물 주기. 하루 한 번 정도 급수 필요.",
      harvestPeriod: "초록색 고추는 파종 후 80일, 빨간 고추는 100-120일. 열매가 단단하면 수확.",
    },
  ];

  return (
    <div className="search-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
      </div>

      <div className="veg-list">
        {vegetables.map((veg, index) => (
          <div key={index} className="veg-card">
            <img src={veg.image} alt={veg.name} className="veg-image" />
            <div className="veg-info">
              <p className="veg-name">{veg.name}</p>
              <div className="veg-details">
                <div className="detail-item">
                  <strong>🌱 키우는 방법:</strong>
                  <p>{veg.growingMethod}</p>
                </div>
                <div className="detail-item">
                  <strong>⏰ 자라는 시기:</strong>
                  <p>{veg.growingPeriod}</p>
                </div>
                <div className="detail-item">
                  <strong>💧 물주는 방법:</strong>
                  <p>{veg.wateringMethod}</p>
                </div>
                <div className="detail-item">
                  <strong>🌾 수확 시기:</strong>
                  <p>{veg.harvestPeriod}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
