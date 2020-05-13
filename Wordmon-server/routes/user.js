const express = require('express');
const router = express.Router();

const { userController } = require('../controller');

// * POST /user/signin
router.post('/signin', userController.signin.post);

// * POST /user/signout
router.post('/signout', userController.signout.post);

// * POST /user/signup
router.post('/signup', userController.signup.post);

// * GET /user/info
router.get('/info', userController.info.get);

// * GET /user/:nickname
router.get('/:nickname', userController.nickname.get);

// * POST? PUT? PATCH? /user/modify
router.post('/modify', userController.modify.post);

// * POST
// router.post('/nickname', userController.nickname.post);

module.exports = router;
