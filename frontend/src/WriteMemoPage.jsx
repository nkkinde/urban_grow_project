import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./WriteMemoPage.css";
import API_URL from "./api.js";

export default function WriteMemoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, user_id } = location.state || {};

  const [memo, setMemo] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [showLevelUpPopup, setShowLevelUpPopup] = useState(false);
  const [newLevel, setNewLevel] = useState(null);

  useEffect(() => {
    if (!user_id || !date) {
      alert("로그인이 필요합니다.");
      navigate("/plant-diary");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/memos/memo?date=${date}&user_id=${user_id}`
        );
        setMemo(res.data.content);
        setIsEdit(true);
        
        // 기존 이미지 로드 (Backend에서 이미 배열로 파싱되어 옴)
        if (res.data.image_paths && Array.isArray(res.data.image_paths)) {
          setExistingImages(res.data.image_paths);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // 새 메모 작성 - 기존 메모가 없는 것이 정상
          try {
            const weatherRes = await axios.get(
              `${API_URL}/api/weather?lat=37.5665&lon=126.9780`
            );
            const weather = weatherRes.data;
            const outside = `야외날씨 : ${weather.description}, ${weather.temperature}℃, ${weather.humidity}%`;
            const inside = `실내환경 : 18℃, 40%`;
            setMemo(`${outside}\n${inside}\n\n`);
          } catch {
            setMemo("야외날씨: 정보 없음\n실내환경: 24℃, 45%\n\n");
          }
        } else if (err.response?.status) {
          alert("서버 오류가 발생했습니다.");
        }
      }
    };

    fetchData();
  }, [date, user_id, navigate]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 선택 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImages((prev) => [...prev, event.target.result]);
        setImages((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!memo.trim() && images.length === 0 && existingImages.length === 0) {
      alert("메모 내용 또는 이미지를 추가해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", memo);
      formData.append("date", date);
      formData.append("user_id", user_id);

      // 새로 추가된 이미지
      images.forEach((image) => {
        formData.append("images", image);
      });

      // 기존 이미지 (유지할 것들)
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      const res = await axios.post(
        `${API_URL}/api/memos/memo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 새로운 메모 저장 시 레벨업 확인
      if (!isEdit && res.data.isNew) {
        const currentLevel = parseInt(localStorage.getItem("level")) || 1;
        const memoCount = res.data.memoCount || 0;
        const calculatedLevel = memoCount + 1; // 0개=1레벨, 1개=2레벨 등
        
        // 레벨이 증가했으면 팝업 표시
        if (calculatedLevel > currentLevel) {
          setNewLevel(calculatedLevel);
          localStorage.setItem("level", calculatedLevel);
          setShowLevelUpPopup(true);
          return; // 팝업 확인 후 네비게이션
        }
      }

      alert(isEdit ? "메모 수정 완료!" : "메모 저장 완료!");
      navigate("/plant-diary");
    } catch (err) {
      alert("메모 저장 실패: " + err.response?.data?.message);
    }
  };

  const handleLevelUpConfirm = () => {
    setShowLevelUpPopup(false);
    alert("메모 저장 완료!");
    navigate("/plant-diary");
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

      {/* 이미지 업로드 섹션 */}
      <div className="image-upload-section">
        <label htmlFor="image-input" className="image-upload-label">
          📸 사진 추가
        </label>
        <input
          id="image-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          className="image-input"
        />
        <p className="image-hint">여러 장의 사진을 선택할 수 있습니다</p>
      </div>

      {/* 기존 이미지 미리보기 (수정 시) */}
      {existingImages.length > 0 && (
        <div className="image-preview-section">
          <h3 className="preview-title">저장된 사진</h3>
          <div className="image-preview-grid">
            {existingImages.map((imagePath, index) => {
              const displayPath = imagePath.includes('uploads/') 
                ? imagePath.substring(imagePath.indexOf('uploads/'))
                : imagePath;
              return (
                <div key={`existing-${index}`} className="image-preview-item">
                  <img 
                    src={`${API_URL}/${displayPath}`}
                    alt={`existing-${index}`}
                    onError={(e) => {
                      console.error('이미지 로드 실패:', displayPath);
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23999"%3E로드실패%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <button
                    className="remove-image-btn"
                    onClick={() => removeImage(index, true)}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 선택된 이미지 미리보기 */}
      {previewImages.length > 0 && (
        <div className="image-preview-section">
          <h3 className="preview-title">추가될 사진</h3>
          <div className="image-preview-grid">
            {previewImages.map((image, index) => (
              <div key={`new-${index}`} className="image-preview-item">
                <img src={image} alt={`preview-${index}`} />
                <button
                  className="remove-image-btn"
                  onClick={() => removeImage(index, false)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="button-group">
        <button className="save-button" onClick={handleSave}>
          저장
        </button>
        <button className="cancel-button" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>

      {/* 레벨업 팝업 */}
      {showLevelUpPopup && (
        <div className="levelup-overlay" onClick={handleLevelUpConfirm}>
          <div className="levelup-popup" onClick={(e) => e.stopPropagation()}>
            <div className="levelup-header">
              <span className="levelup-icon">🎉</span>
            </div>
            <h2 className="levelup-title">레벨 업!</h2>
            <p className="levelup-text">
              축하합니다! 당신의 식물이<br />
              <strong>Level {newLevel}</strong>로 성장했어요!
            </p>
            <button className="levelup-button" onClick={handleLevelUpConfirm}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}