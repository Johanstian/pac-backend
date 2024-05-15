const express = require('express');
const router = express.Router();

const { createEnlistment, updateEnlistment, getAllEnlistment, getEnlistmentByCC, getEnlistmentInfoAndDownloadPDF } = require('../controllers/enlistmentController');

router.post('/createEnlistment', createEnlistment);

router.put('/updateEnlistment', updateEnlistment);

router.get('/getAllEnlistment', getAllEnlistment);

router.get('/getEnlistmentByCC/:cc', getEnlistmentByCC);

router.get('/getEnlistmentInfoAndDownloadPDF/:cc', getEnlistmentInfoAndDownloadPDF);

module.exports = router;