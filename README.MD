# UrbanGrow - 실내 식물 관리 AI 애플리케이션

## 프로젝트 개요

UrbanGrow는 실내 식물 관리를 돕는 통합 플랫폼입니다. AI 챗봇과 자연스러운 한국어 음성 합성(TTS)을 통해 사용자 친화적인 식물 관리 조언을 제공합니다.

---

## 기술 스택

### Frontend (포트 5173)
- **React 19.0.0** - UI 프레임워크
- **Vite 6.3.5** - 빌드 도구 및 개발 서버
- **Axios 1.9.0** - HTTP 클라이언트
- **React Router** - 클라이언트 라우팅
- **React Icons 5.5.0** - 아이콘 라이브러리
- **React DatePicker 8.3.0** - 날짜 선택 컴포넌트
- **ESLint** - 코드 린팅

### Backend (포트 3000)
- **Node.js LTS** - 런타임 환경
- **Express 5.1.0** - 웹 프레임워크
- **MySQL2 3.14.0** - MySQL 데이터베이스 드라이버
- **Multer** - 파일 업로드 미들웨어
- **Axios** - HTTP 클라이언트 (외부 API 호출)
- **dotenv** - 환경 변수 관리

### TTS Server (포트 5001)
- **Python 3.11+** - 런타임 환경
- **FastAPI 0.121.3** - 비동기 웹 프레임워크
- **Uvicorn 0.38.0** - ASGI 서버
- **Edge TTS 7.2.3** - Microsoft 텍스트-음성 변환
  - 한국어 지원: SunHiNeural(여성), InJoonNeural(남성)
  - 속도 조절 가능

### Database (포트 3306)
- **MySQL 8.0+** - 관계형 데이터베이스
- **문자 인코딩**: utf8mb4 (한글 완벽 지원)

### External APIs
- **Google Gemini 2.0 Flash API** - AI 식물 진단 및 챗봇
  - 텍스트 기반 식물 관리 조언
  - 이미지 분석 (Vision API)를 통한 식물 진단
- **OpenWeatherMap API** - 날씨 정보 조회
- **Microsoft Edge TTS** - 한국어 음성 합성

---

## 데이터베이스 스키마

### Users Table (사용자 정보)
```sql
CREATE TABLE users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    level INT DEFAULT 1,
    diary_count INT DEFAULT 0,
    last_watered DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Plant Memos Table (식물 일지)
```sql
CREATE TABLE plant_memos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    content LONGTEXT,
    image_paths JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_memo (user_id, date)
);
```

### Chat History Table (채팅 이력)
```sql
CREATE TABLE chat_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    message LONGTEXT,
    reply LONGTEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

### Watering History Table (물주기 기록)
```sql
CREATE TABLE watering_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    plant_name VARCHAR(100),
    watered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_watered_at (watered_at)
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

### 인증 API (`/api/auth`)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/find-id` - 아이디 찾기
- `POST /api/auth/find-password` - 비밀번호 찾기

### 사용자 API (`/api/users`)
- `GET /api/users/level?user_id={id}` - 현재 레벨 조회
- `GET /api/users/last-watered?user_id={id}` - 마지막 물주기 조회
- `POST /api/users/change-password` - 비밀번호 변경
- `POST /api/users/change-nickname` - 닉네임 변경
- `POST /api/users/withdraw` - 회원탈퇴

### 식물 일지 API (`/api/memos`)
- `GET /api/memos/memo?date={date}&user_id={id}` - 특정 날짜 메모 조회
- `POST /api/memos/memo` - 메모 작성/수정 (이미지 업로드 지원)
- `DELETE /api/memos/memo` - 메모 삭제
- `GET /api/memos/dates?user_id={id}` - 메모가 있는 날짜 목록 조회

### 채팅 API (`/api/chat`)
- `POST /api/chat/` - AI 챗봇에 메시지 전송 (Gemini 사용)
- `POST /api/chat/save` - 채팅 메시지 DB 저장
- `GET /api/chat/history?user_id={id}` - 채팅 이력 조회
- `POST /api/chat/analyze-image` - 식물 이미지 분석 (Gemini Vision API)

**이미지 분석 요청 형식**:
```javascript
const formData = new FormData();
formData.append('image', imageFile);
// POST /api/chat/analyze-image
```

**응답 형식**:
```json
{
  "analysis": "식물 진단 결과 텍스트",
  "imageUrl": "/uploads/plant-analysis/plant-1234567890.jpg"
}
```

### 날씨 API (`/api/weather`)
- `GET /api/weather?lat={latitude}&lon={longitude}` - 날씨 정보 조회

**응답 형식**:
```json
{
  "temperature": 18,
  "humidity": 45,
  "description": "맑음",
  "icon": "01d"
}
```

### TTS API (Python, 포트 5001)
- `POST /tts` - 한국어 음성 합성

**요청 형식**:
```json
{
  "text": "안녕하세요",
  "speaker_id": 0,
  "speed": 1.0
}
```

**파라미터**:
- `text` (string): 음성으로 변환할 한국어 텍스트
- `speaker_id` (int): 0 = 여성(SunHiNeural), 1 = 남성(InJoonNeural)
- `speed` (float): 속도 배율 (기본값: 1.0)

**응답**: MP3 오디오 blob (Content-Type: audio/mpeg)

---

## 주요 기능

### 1. AI 식물 챗봇 (MainPage)
- **Gemini 2.0 Flash API** 기반 지능형 식물 관리 조언
- Edge TTS를 통한 자동 한국어 음성 재생
- 채팅 이력 저장 및 조회
- **식물 이미지 분석**: Gemini Vision API를 사용한 실시간 식물 진단
  - 식물 종류 식별
  - 건강 상태 판단
  - 문제점 진단
  - 해결 방법 제시
  - 분석 결과가 채팅 기록에 자동 저장

### 2. 식물 성장 시뮬레이션
- 다이어리 작성 기반 레벨업 시스템
  - 0개 = Level 1 (씨앗)
  - 1개 = Level 2 (새싹)
  - 2개 = Level 3 (성장)
  - 3개 이상 = Level 4 (성숙)
- 레벨업 시 팝업 알림
- 애니메이션 변화 (비디오 파일로 시각화)

### 3. 식물 다이어리 (Plantdiary)
- 날짜별 식물 상태 기록
- 이미지 다중 업로드 지원
- 이미지 슬라이더 네비게이션
- 메모 작성/수정/삭제 기능
- 타임스탬프 (작성일, 수정일)

### 4. 물주기 관리
- 마지막 물주기 시간 표시
- 물주기 팝업 (애니메이션 포함)
- 물주기 이력 DB 저장

### 5. 날씨 정보
- 실시간 날씨 조회 (OpenWeatherMap)
- 온도, 습도, 날씨 설명 제공
- 다이어리 작성 시 자동 삽입

### 6. 커뮤니티 기능
- 식물 관련 게시물 작성/조회
- 댓글 기능
- 좋아요 기능
- 질문/답변 포럼

### 7. 사용자 계정 관리
- 회원가입/로그인
- 프로필 설정 및 수정
- 닉네임 변경
- 비밀번호 변경
- 아이디/비밀번호 찾기
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
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=capston_db
DB_PORT=3306

# API Configuration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
WEATHER_API_KEY=your_openweathermap_api_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

### Frontend (api.js)
```javascript
// API URL Configuration
const API_URL = 'http://localhost:3000';
export const TTS_URL = 'http://localhost:5001';
export default API_URL;
```

### TTS Server (uvicorn 실행)
```bash
uvicorn app:app --reload --port 5001 --host 127.0.0.1
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

- **마지막 수정**: 2025년 12월 4일
- **AI 엔진**: Google Gemini 2.0 Flash (텍스트 + Vision)
- **음성 합성**: Microsoft Edge TTS
- **데이터베이스**: MySQL 8.0+
- **한국어 지원**: 완벽 지원 (음성 합성, 텍스트 처리, 이미지 분석)