const express = require('express');
const router = express.Router();

const { wordController } = require('../controller');

// * POST
router.post('/', wordController.checkDic.post);

module.exports = router;
