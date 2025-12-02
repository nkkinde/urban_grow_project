# UrbanGrow - 개발 및 실행 가이드

## 프로젝트 개요
UrbanGrow는 식물 관리를 위한 웹 기반 애플리케이션입니다.
- **Frontend**: React 19.0.0 (Vite)
- **Backend**: Node.js Express 5.1.0
- **Database**: MySQL 8.0
- **TTS**: Python FastAPI (한국어 음성)

---

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Python 가상환경 설정 (TTS용)
```bash
cd TTS
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
cd ..
```

### 3. 한 번에 모든 서비스 실행

프로젝트 루트에서:
```bash
npm run dev
```

이 명령어는 다음 세 가지를 동시에 실행합니다:
- 🌐 **프론트엔드** (Vite): http://localhost:5173
- 🔌 **백엔드** (Express): http://localhost:3000
- 🎤 **TTS** (FastAPI): http://localhost:5001

**필수 조건**: MySQL이 실행 중이어야 합니다.

### 4. 애플리케이션 접속
브라우저에서 `http://localhost:5173` 접속

---

## ⚙️ 필수 설정

### MySQL 데이터베이스
1. **MySQL 실행 확인**:
```bash
mysql -u root -p
```

2. **데이터베이스 생성**:
```sql
CREATE DATABASE plant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **테이블**: 애플리케이션 시작 시 자동 생성됨

### 환경 변수 (선택사항)
`backend/.env` 파일 생성:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=plant_db
PORT=3000
```

---

## 📁 프로젝트 구조

```
urban_grow_project/
├── frontend/              # React 애플리케이션
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── MainPage.jsx
│   │   ├── Plantdiary.jsx
│   │   ├── api.js         # API URL 설정
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/               # Node.js Express 서버
│   ├── app.js
│   ├── db.js              # MySQL 연결 (재시도 로직 포함)
│   ├── controllers/
│   ├── routes/
│   ├── uploads/           # 이미지 저장 폴더
│   ├── package.json
│   └── requirements.txt
│
├── TTS/                   # Python FastAPI 음성 서비스
│   ├── app.py
│   ├── requirements.txt
│   ├── .venv/
│   └── 1164_epochs.pth    # 학습된 모델
│
└── package.json
```

---

## 🎯 개발 팁

### 각 서비스를 별도로 실행 (디버깅용)

**프론트엔드만 실행**:
```bash
npm run frontend
```

**백엔드만 실행**:
```bash
npm run backend
```

**TTS만 실행**:
```bash
npm run tts
```

### 자동 재시작 (Backend)
nodemon 설치 후:
```bash
cd backend
npm install -D nodemon
npx nodemon app.js
```

### API 테스트
```bash
# 사용자 조회
curl http://localhost:3000/api/users

# 로그인
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"id":"test","password":"1234"}'
```

---

## 🔧 문제 해결

### MySQL 연결 실패
```bash
# MySQL 서비스 상태 확인
tasklist | findstr mysqld

# MySQL 재시작
net stop MySQL80
net start MySQL80
```

### 포트 이미 사용 중
```bash
# 포트 확인
netstat -ano | findstr :3000

# 포트 변경 (backend/app.js)
const PORT = process.env.PORT || 3001;
```

### TTS 서버 오류
```bash
cd TTS
pip install -r requirements.txt --force-reinstall
```

### 이미지 업로드 오류
`backend/app.js`에서 파일 크기 제한 조정:
```javascript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
```

---

## 📚 참고 자료

- [React 공식 문서](https://react.dev)
- [Express 공식 문서](https://expressjs.com)
- [Vite 공식 문서](https://vitejs.dev)
- [FastAPI 공식 문서](https://fastapi.tiangolo.com)
- [MySQL 공식 문서](https://dev.mysql.com/doc/)

---

## 📝 라이선스

UrbanGrow © 2025



