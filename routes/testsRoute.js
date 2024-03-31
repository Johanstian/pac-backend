const express = require('express');
const router = express.Router();

const {createTest, getAllTests} = require('../controllers/testsController');

router.post('/createTest', createTest);

router.get('/getAllTests', getAllTests);

module.exports = router;