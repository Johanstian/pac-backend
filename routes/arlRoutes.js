const express = require('express');

const router = express.Router();

const { createArl, getAllArls, getArlByCc, exportToExcel } = require('../controllers/arlController')

router.post('/createArl', createArl);

router.get('/getAllArls', getAllArls);

router.get('/getArlByCc', getArlByCc);

router.get('/exportToExcel', exportToExcel);

module.exports = router;