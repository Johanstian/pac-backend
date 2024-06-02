const express = require('express');

const router = express.Router();

const { recreateTest, getAllRetests, getRetestByCC, exportToExcel, getAll } = require('../controllers/retestsController');

router.post('/recreateTest', recreateTest);

router.get('/getAllRetests', getAllRetests);

router.get('/getRetestByCC/:cc', getRetestByCC);

router.get('/exportToExcel', exportToExcel);

router.get('/getAll', getAll);

module.exports = router;