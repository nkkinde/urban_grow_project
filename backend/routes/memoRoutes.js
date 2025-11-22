const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');

// 메모 관련 라우터
router.get('/memo', memoController.getMemoByDate);
router.post('/memo', memoController.saveOrUpdateMemo); // 수정 또는 저장
router.delete('/memo', memoController.deleteMemo);
router.get('/dates', memoController.getMemoDates);

module.exports = router;
