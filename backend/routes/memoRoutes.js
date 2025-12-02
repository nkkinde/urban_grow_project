const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const memoController = require('../controllers/memoController');

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/memos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // 이미지 파일만 허용
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// 메모 관련 라우터
router.get('/memo', memoController.getMemoByDate);
router.post('/memo', upload.array('images', 10), memoController.saveOrUpdateMemo); // 수정 또는 저장 (최대 10장)
router.delete('/memo', memoController.deleteMemo);
router.get('/dates', memoController.getMemoDates);

module.exports = router;
