import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import { useNavigate } from "react-router-dom";
import { MdImage } from "react-icons/md";

function CreatePost() {
  useEffect(() => {
      const userId = localStorage.getItem("id"); // 비정상 경로 확인
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    })
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      console.log("새 게시글:", { title, content, vegetable, image });
      navigate("/community");
    } else {
      alert("제목과 내용을 입력해주세요.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="create-post-container">
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="title">게시글 작성</h2>
        <span className="placeholder-icon">🔍</span>
      </div>

      <div className="form-section">
        <div className="title-row">
          <input type="text" className="title-input"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        <label className="image-upload">
        <MdImage size={24} color="#4a704a" className="picture-icon" />
        <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
        />
        </label>
        </div>
        {image && <img src={image} alt="미리보기" className="preview-image" />}

        <select
          className="vegetable-select"
          value={vegetable}
          onChange={(e) => setVegetable(e.target.value)}
        >
          <option value="">채소 선택</option>
          <option value="상추">상추</option>
          <option value="깻잎">깻잎</option>
          <option value="대파">대파</option>
          <option value="양파">양파</option>
          <option value="고추">고추</option>
        </select>

        <textarea
          className="content-input"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="submit-button" onClick={handleSubmit}>
          등록
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
