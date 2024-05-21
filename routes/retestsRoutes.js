const express = require('express');

const router = express.Router();

const { recreateTest, getAllRetests, getRetestByCC } = require('../controllers/retestsController');

router.post('/recreateTest', recreateTest);

router.get('/getAllRetests', getAllRetests);

router.get('/getRetestByCC/:cc', getRetestByCC);

module.exports = router;