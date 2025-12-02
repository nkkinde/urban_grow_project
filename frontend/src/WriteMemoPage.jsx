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
        
        // 기존 이미지 로드
        if (res.data.image_paths) {
          try {
            const imagePaths = JSON.parse(res.data.image_paths);
            setExistingImages(imagePaths);
          } catch (e) {
            setExistingImages([]);
          }
        }
      } catch (err) {
        if (err.response?.status === 404) {
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
        } else {
          alert("서버 오류");
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
            {existingImages.map((imagePath, index) => (
              <div key={`existing-${index}`} className="image-preview-item">
                <img 
                  src={`${API_URL}/${imagePath}`}
                  alt={`existing-${index}`} 
                />
                <button
                  className="remove-image-btn"
                  onClick={() => removeImage(index, true)}
                >
                  ✕
                </button>
              </div>
            ))}
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
    </div>
  );
}