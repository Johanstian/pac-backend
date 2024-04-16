const express = require('express');
const router = express.Router();

const { createInterview, getAllInterviews, getInterviewByCC } = require('../controllers/interviewController');

router.post('/createInterview', createInterview);

router.get('/getAllInterviews', getAllInterviews);

router.get('/getInterviewByCC/:cc', getInterviewByCC);

module.exports = router;