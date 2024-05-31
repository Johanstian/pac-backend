const express = require('express');
const router = express.Router();

const { createInterview, getAllInterviews, getInterviewByCC, updateInterview, exportToExcel } = require('../controllers/interviewController');

router.post('/createInterview', createInterview);

router.get('/getAllInterviews', getAllInterviews);

router.get('/getInterviewByCC/:cc', getInterviewByCC);

router.put('/updateInterview/:cc', updateInterview);

router.get('/exportToExcel', exportToExcel);

module.exports = router;