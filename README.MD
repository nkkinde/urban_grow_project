# UrbanGrow - 실내 식물 관리 AI 애플리케이션

## 프로젝트 개요

UrbanGrow는 실내 식물 관리를 돕는 통합 플랫폼입니다. AI 챗봇과 자연스러운 한국어 음성 합성(TTS)을 통해 사용자 친화적인 식물 관리 조언을 제공합니다.

---

## 기술 스택

### Frontend (포트 5173)
- **React 19.0.0** - UI 프레임워크
- **Vite 6.3.5** - 빌드 도구 및 개발 서버
- **React Router 7.5.3** - 클라이언트 라우팅
- **Axios 1.9.0** - HTTP 클라이언트
- **React Icons 5.5.0** - 아이콘 라이브러리
- **React DatePicker 8.3.0** - 날짜 선택 컴포넌트

### Backend (포트 3000)
- **Node.js LTS** - 런타임 환경
- **Express 5.1.0** - 웹 프레임워크
- **MySQL2 3.14.0** - 데이터베이스 드라이버
- **JWT 9.0.2** - 토큰 기반 인증 (jsonwebtoken)
- **bcrypt 6.0.0** - 비밀번호 해싱 (salt rounds: 10)
- **CORS 2.8.5** - 교차 출처 요청 미들웨어
- **dotenv 16.5.0** - 환경 변수 관리

### TTS Server (포트 5001)
- **Python 3.11+** - 런타임 환경
- **FastAPI 0.121.3** - 비동기 웹 프레임워크
- **Uvicorn 0.38.0** - ASGI 서버
- **Edge TTS 7.2.3** - Microsoft 텍스트-음성 변환
  - 한국어 지원: SunHiNeural(여성), InJoonNeural(남성)
  - 속도 조절: 0.5배 ~ 1.5배

### Database (포트 3306)
- **MySQL 8.0+**
- **문자 인코딩**: utf8mb4

---

## 데이터베이스 스키마

```sql
CREATE DATABASE urban_grow DEFAULT CHARSET=utf8mb4;
USE urban_grow;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_levels (
    user_id INT PRIMARY KEY,
    level INT DEFAULT 1,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE watering_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    watered_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT,
    reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 프로젝트 구조

```
urban_grow_project/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── App.jsx          # 라우팅 설정
│   │   ├── MainPage.jsx     # AI 챗봇 통합 메인
│   │   ├── Search.jsx       # 채소 정보 검색 페이지
│   │   ├── Plantdiary.jsx   # 식물 일지
│   │   ├── Community.jsx    # 커뮤니티
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Express 백엔드
│   ├── app.js               # 메인 앱 파일
│   ├── db.js                # DB 연결
│   ├── controllers/         # 비즈니스 로직
│   ├── routes/              # API 라우트
│   ├── package.json
│   └── requirements.txt
├── TTS/                      # Python FastAPI 서버
│   ├── app.py               # Edge TTS 엔드포인트
│   ├── requirements.txt
│   └── ...
└── README.md
```

---

## 설치 및 실행 방법

### 1. Frontend 설정
```bash
cd frontend
npm install
npm run dev
```
접속: `http://localhost:5173`

### 2. Backend 설정
```bash
cd backend
npm install
npm start
```
서버: `http://localhost:3000`

### 3. TTS Server 설정
```bash
cd TTS
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
uvicorn app:app --reload --port 5001
```
TTS API: `http://localhost:5001`

### 4. 데이터베이스 설정
```bash
mysql -u root -p
```
위의 데이터베이스 스키마 SQL을 실행하세요.

---

### 5. 통합 실행
```
npm run dev

```
---
## API 엔드포인트

### 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### 채팅 API
- `POST /api/chat` - AI 챗봇에 메시지 전송
- `GET /api/chat/history` - 채팅 이력 조회

### TTS API (Python)
- `POST /tts` - 한국어 음성 합성

**요청 형식**:
```json
{
  "text": "안녕하세요",
  "speaker_id": 0,
  "speed": 1.0
}
```

**응답**: MP3 오디오 blob (Content-Type: audio/mpeg)

**파라미터**:
- `text` (string): 음성으로 변환할 한국어 텍스트
- `speaker_id` (int): 0 = 여성(SunHiNeural), 1 = 남성(InJoonNeural)
- `speed` (float): 속도 배율 (0.5 ~ 1.5)

---

## 주요 기능

### 1. AI 챗봇 (MainPage)
- Gemini API 기반 지능형 식물 관리 조언
- Edge TTS를 통한 자동 한국어 음성 재생
- 채팅 이력 저장

### 2. 식물 다이어리 (Plantdiary)
- 식물 상태 기록
- 물주기 관리
- 성장 추적

### 3. 채소 정보 검색 (Search)
- 5가지 채소 정보:
  - 🌱 키우는 방법
  - ⏰ 자라는 시기
  - 💧 물주는 방법
  - 🌾 수확 시기

### 4. 커뮤니티
- 식물 관련 게시물 공유
- 질문/답변 포럼
- 사용자 상호작용

### 5. 사용자 계정 관리
- 회원가입/로그인
- 프로필 설정
- 비밀번호 변경
- 회원탈퇴

---

## 라우팅 경로 (kebab-case 통일)

| 경로 | 설명 |
|------|------|
| `/` | 로그인 페이지 |
| `/signup` | 회원가입 페이지 |
| `/main` | 메인 페이지 (AI 챗봇) |
| `/plant-diary` | 식물 일지 |
| `/search` | 채소 정보 검색 |
| `/community` | 커뮤니티 |
| `/create-post` | 게시물 작성 |
| `/faq` | 자주 묻는 질문 |
| `/information` | 설정 페이지 |

---

## 환경 변수 설정

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=urban_grow
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 문제 해결

### TTS 소리가 안 나올 때
- Edge TTS 속도 파라미터 형식 확인: `"+0%"`, `"-50%"` (문자열 필수)
- 음성 ID 확인: 0(여성), 1(남성)
- 브라우저 음소거 해제
- TTS 서버 포트 5001 실행 확인

### 데이터베이스 연결 실패
- MySQL 실행 확인: `mysql -u root -p`
- `.env` 파일 설정 확인
- utf8mb4 인코딩 설정 확인

### CORS 에러
- Backend CORS 화이트리스트 확인
- Frontend URL이 `http://localhost:5173` 인지 확인

### 로그인 실패
- JWT 토큰 발급 확인
- 비밀번호 해싱 알고리즘 확인 (bcrypt 10 rounds)
- 로컬 스토리지에 토큰 저장 확인

---

## 의존성 관리

각 디렉토리의 `requirements.txt` 참고:
- `frontend/requirements.txt` - React/Vite 패키지
- `backend/requirements.txt` - Node.js 패키지
- `TTS/requirements.txt` - Python 패키지 (FastAPI, Edge TTS)

---

## 기여 가이드

1. Fork 저장소
2. Feature 브랜치 생성: `git checkout -b feature/AmazingFeature`
3. 변경사항 커밋: `git commit -m 'Add some AmazingFeature'`
4. 브랜치 Push: `git push origin feature/AmazingFeature`
5. Pull Request 생성

---

## 최종 업데이트

- **마지막 수정**: 2024년 11월 23일
- **TTS 엔진**: Edge TTS (Microsoft)
- **한국어 지원**: 완벽 지원 (음성 합성, 텍스트 처리)