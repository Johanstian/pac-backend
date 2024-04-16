const express = require('express');
const router = express.Router();

const {createTest, getAllTests, getTestByCC} = require('../controllers/testsController');

router.post('/createTest', createTest);

router.get('/getAllTests', getAllTests);

router.get('/getTestByCC/:cc', getTestByCC);

module.exports = router;