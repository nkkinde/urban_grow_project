# 🌱 UrbanGrow - AI 기반 식물 관리 애플리케이션

<div align="center">
  <strong>식물의 건강 상태를 AI로 진단하고, 맞춤형 관리 조언을 제공하는 스마트 식물 케어 앱</strong>
</div>

---

## 🎯 프로젝트 개요

**UrbanGrow**는 Google Gemini AI를 활용한 스마트 식물 관리 플랫폼입니다.

- **이미지 분석**: Gemini Vision API로 식물 질병 진단
- **AI 챗봇**: 식물 관리 맞춤 조언 제공
- **게이미피케이션**: 레벨 시스템으로 사용자 참여 유도
- **음성 피드백**: TTS로 자연스러운 한국어 음성 제공
- **물 주기 관리**: 마지막 물 준 시간 추적

---

## ✨ 주요 기능

### 1. 사용자 인증
- 회원가입 (필수: 아이디, 이메일, 비밀번호, 닉네임)
- JWT 기반 로그인/로그아웃
- 계정 찾기 및 비밀번호 재설정

### 2. 식물 이미지 분석
- **Gemini Vision API** 기반 실시간 진단
- 질병 진단 및 해결 방법 제시
- 분석 결과 자동 저장

### 3. 식물 일기 & 레벨 시스템
- 날짜별 식물 상태 기록
- 레벨 진행: 0개→L1, 1개→L2, 2개→L3, 3개↑→L4
- 레벨업 시 팝업 알림

### 4. AI 챗봇
- Gemini API 기반 식물 관리 조언
- 이미지 분석 및 대화 저장
- Edge TTS로 음성 출력

---

## 🛠️ 기술 스택

### Frontend
- React 19.0.0, Vite 6.3.5, Axios 1.9.0
- React Router, React Icons, CSS3

### Backend
- Node.js + Express 5.1.0
- MySQL2 3.14.0, Multer, bcrypt, JWT

### AI & Voice
- **Google Gemini 2.0 Flash**: Vision + Text API
- **Python FastAPI**: TTS 서버 (Edge TTS)

### Database
- MySQL 8.0 (utf8mb4, 4 테이블)

---

## 📊 데이터베이스 스키마

### users
```sql
id (PK) | email (UQ) | password | nickname | phone_number (nullable) | 
level (default 1) | diary_count (default 0) | last_watered | created_at | updated_at
```

### plant_memos
```sql
id (PK) | user_id (FK) | date | content | image_paths (JSON) | 
created_at | updated_at | UNIQUE(user_id, date)
```

### chat_history
```sql
id (PK) | user_id (FK) | message | reply | image_url | created_at
```

### watering_history
```sql
id (PK) | user_id (FK) | plant_name | watered_at
```

---

## 🚀 설치 및 실행

### 1. 데이터베이스 초기화
```bash
mysql -u root -p
CREATE DATABASE capston_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE capston_db;
SOURCE init_tables.sql;
```

### 2. 백엔드 실행
```bash
cd backend
npm install
# .env 파일 설정 (DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET, GEMINI_API_KEY)
npm start  # 포트 3000
```

### 3. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev  # 포트 5173
```

### 4. TTS 서버 실행 (선택)
```bash
cd TTS
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py  # 포트 5001
```

---

## 📡 주요 API

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/find-id` - 아이디 찾기
- `POST /api/auth/find-password` - 비밀번호 찾기
- `POST /api/auth/reset-password/:id` - 비밀번호 재설정

### 사용자
- `GET /api/users/level?user_id=...` - 레벨 조회
- `PATCH /api/users/nickname` - 닉네임 변경
- `DELETE /api/users/:id` - 회원 탈퇴

### 챗봇
- `GET /api/chat?user_id=...` - 대화 이력
- `POST /api/chat/send` - 메시지 전송
- `POST /api/chat/analyze` - 이미지 분석

### 일기
- `GET /api/memo?user_id=...` - 일기 목록
- `POST /api/memo/create` - 일기 생성

---

## ⚙️ 환경 설정

### Backend .env
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=0000
DB_NAME=capston_db
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

---

## 📁 프로젝트 구조

```
urban_grow_project/
├── frontend/          # React (포트 5173)
│   ├── src/
│   │   ├── MainPage.jsx       # 챗봇 & 레벨
│   │   ├── WriteMemoPage.jsx  # 일기 작성
│   │   ├── SignupPage.jsx     # 회원가입
│   │   └── ...
│   └── package.json
├── backend/           # Express (포트 3000)
│   ├── controllers/   # 비즈니스 로직
│   ├── routes/        # API 라우트
│   ├── app.js
│   ├── db.js
│   └── package.json
├── TTS/               # FastAPI (포트 5001)
│   ├── app.py
│   └── requirements.txt
└── init_tables.sql    # DB 스키마
```

---

## 🐛 트러블슈팅

| 문제 | 해결 방법 |
|------|---------|
| MySQL 연결 실패 | `net start MySQL80` 실행 |
| 포트 충돌 | `netstat -ano \| findstr :포트번호` |
| Gemini API 오류 | `.env` 에서 API 키 확인 |
| 회원가입 실패 | 필수 필드 확인: id, email, password, nickname |

---

## 🎓 최근 업데이트

- ✅ DB 스키마 재설계 (phone_number 선택사항)
- ✅ Backend Promise/async-await 통일
- ✅ Frontend 회원가입 폼 최적화
- ✅ 모든 API 에러 처리 개선
- ✅ README 완전 재작성

---

<div align="center">
  <strong>🌿 UrbanGrow와 함께 반려식물을 더 행복하게 키워보세요! 🌿</strong>
</div>
