import React, {useEffect } from "react";
import "/styles/CommonContainer.css";

useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
const CommonContainer = ({ children }) => {
  return <div className="common-container">{children}</div>;
};

export default CommonContainer;