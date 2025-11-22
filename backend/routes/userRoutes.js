const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 회원가입
router.post('/register', userController.registerUser);
// 로그인
router.post('/login',    userController.loginUser);
// 비밀번호 찾기
router.post('/find-password',  userController.findPasswordUser);
// 비밀번호 재설정
router.post('/reset-password/:id', userController.resetPassword);
// 아이디 찾기
router.post('/find-id',userController.findId);
// 닉네임 변경
router.put('/nickname-change', userController.nicknameChange);
// 아이디 삭제
router.delete("/:id", userController.deleteUser);
// 레벨 업
router.get('/level', userController.getUserLevel);
// 물준 시간 조회
router.post('/water', userController.updateLastWatered);
router.get('/last-watered', userController.getLastWatered);

module.exports = router;