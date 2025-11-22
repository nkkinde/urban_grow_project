import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./WriteMemoPage.css";

export default function WriteMemoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, user_id } = location.state || {};

  const [memo, setMemo] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (!user_id || !date) {
      alert("로그인이 필요합니다.");
      navigate("/plant-diary");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/memos/memo?date=${date}&user_id=${user_id}`
        );
        setMemo(res.data.content);
        setIsEdit(true);
      } catch (err) {
        if (err.response?.status === 404) {
          try {
            const weatherRes = await axios.get(
              "http://localhost:3000/api/weather?lat=37.5665&lon=126.9780"
            );
            const weather = weatherRes.data;
            const outside = `야외날씨 : ${weather.description}, ${weather.temperature}℃, ${weather.humidity}%`;
            const inside = `실내환경 : 18℃, 40%`;
            setMemo(`${outside}\n${inside}\n\n`);
          } catch {
            setMemo("야외날씨: 정보 없음\n실내환경: 24℃, 45%\n\n");
          }
        } else {
          alert("서버 오류");
        }
      }
    };

    fetchData();
  }, [date, user_id, navigate]);

  const handleSave = async () => {
    if (!memo.trim()) {
      alert("메모 내용을 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/memos/memo", {
        content: memo,
        date,
        user_id,
      });

      if (!isEdit && res.data.isNew) {
        const currentLevel = parseInt(localStorage.getItem("level")) || 1;
        localStorage.setItem("level", currentLevel + 1);
      }

      alert(isEdit ? "메모 수정 완료!" : "메모 저장 완료!");
      navigate("/plant-diary");
    } catch (err) {
      alert("메모 저장 실패: " + err.response?.data?.message);
    }
  };

  return (
    <div className="write-container">
      <h2 className="write-title">{isEdit ? "메모 수정" : "메모 작성"}</h2>
      <textarea
        className="memo-textarea"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="오늘의 식물 기록을 남겨보세요!"
      />
      <div className="button-group">
        <button className="save-button" onClick={handleSave}>
          저장
        </button>
        <button className="cancel-button" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </div>
  );
}