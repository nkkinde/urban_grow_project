import React, { useState, useEffect } from "react";
import "./Plantdiary.css";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import BottomNav from "./BottomNav";

export default function Plantdiary() {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("id");

  const [showMenu, setShowMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [showMemoPopup, setShowMemoPopup] = useState(false);
  const [memo, setMemo] = useState("");
  const [hasMemo, setHasMemo] = useState(false);
  const [memoDates, setMemoDates] = useState([]);
  const [createdAt, setCreatedAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    if (!user_id) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (!user_id) return;
    axios
      .get(`http://localhost:3000/api/memos/dates?user_id=${user_id}`)
      .then((res) => setMemoDates(res.data.memoDates))
      .catch((err) => console.error("메모 날짜 불러오기 실패", err));
  }, [user_id]);

  const handleDateClick = async (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const formatted = new Date(date.getTime() - offset).toISOString().split("T")[0];

    setSelectedDate(date);
    setFormattedDate(formatted);

    try {
      const res = await axios.get(`http://localhost:3000/api/memos/memo?date=${formatted}&user_id=${user_id}`);
      setMemo(res.data.content);
      setCreatedAt(res.data.created_at);
      setUpdatedAt(res.data.updated_at);
      setHasMemo(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setMemo("");
        setHasMemo(false);
        setCreatedAt(null);
        setUpdatedAt(null);
      } else {
        console.error("메모 조회 오류:", err);
      }
    }

    setShowMemoPopup(true);
  };

  return (
    <div className="diary-container">
      {/* 상단바 */}
      <div className="top-bar">
        <h1 className="Pd-title">UrbanGrow</h1>
        <button className="profile-button" onClick={() => setShowMenu(!showMenu)}>
          <FaUserAlt size={20} color="#4a7c59" />
        </button>
        {showMenu && (
          <div className="dropdown-menu">
            <p className="greeting">
              어서오세요<br />
              <strong>{localStorage.getItem("nickname") || "사용자"}</strong> 님
            </p>
            <hr />
            <div className="menu-item">🔔 알림</div>
            <div className="menu-item">📊 랭크</div>
            <div className="menu-item">
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
              >
                🔓 로그아웃
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 날짜 인풋 */}
      <div className="datepicker-wrapper">
        <label>날짜</label>
        <input
          type="text"
          className="custom-datepicker"
          value={selectedDate.toLocaleDateString("ko-KR")}
          readOnly
        />
      </div>

      {/* 달력 */}
      <div className="calendar-container">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateClick}
          inline
          renderDayContents={(day, date) => {
            const formatted = date.toISOString().split("T")[0];
            const hasDot = memoDates.includes(formatted);
            return (
              <div className="day-cell">
                {day}
                {hasDot && <div className="dot"></div>}
              </div>
            );
          }}
        />
      </div>

      {/* 메모 팝업 */}
      {showMemoPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{selectedDate.toLocaleDateString("ko-KR")}의 메모</h3>
            <p>{hasMemo ? memo : "메모가 없습니다."}</p>
            {createdAt && (<p className="timestamp">작성 : {new Date(createdAt).toLocaleString("ko-KR")}</p>)}
            {updatedAt && createdAt !== updatedAt && (<p className="timestamp">수정 : {new Date(updatedAt).toLocaleString("ko-KR")}</p>)}
            <div style={{ marginTop: "12px" }}>
              <button
                className="write-button"
                onClick={() =>
                  navigate("/write-memo", {
                    state: { date: formattedDate, user_id, existingMemo: hasMemo ? memo : "" }
                  })
                }
              >
                {hasMemo ? "글수정" : "글쓰기"}
              </button>

              {hasMemo && (
                <button
                  className="delete-button"
                  onClick={async () => {
                    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
                    if (!confirmDelete) return;

                    try {
                      await axios.delete("http://localhost:3000/api/memos/memo", {
                        data: { date: formattedDate, user_id },
                      });
                      alert("삭제 완료!");
                      setMemo("");
                      setHasMemo(false);
                      setMemoDates((prev) => prev.filter((d) => d !== formattedDate));
                      setShowMemoPopup(false);
                    } catch (err) {
                      alert("삭제 실패: " + err.response?.data?.message);
                    }
                  }}
                >
                  글삭제
                </button>
              )}

              <button className="close-button" onClick={() => setShowMemoPopup(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
