const express = require('express');

const router = express.Router();

const { recreateTest, getAllRetests, getRetestByCC, exportToExcel } = require('../controllers/retestsController');

router.post('/recreateTest', recreateTest);

router.get('/getAllRetests', getAllRetests);

router.get('/getRetestByCC/:cc', getRetestByCC);

router.get('/exportToExcel', exportToExcel);

module.exports = router;