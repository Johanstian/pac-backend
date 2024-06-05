const express = require('express');
const router = express.Router();

const { createPostPsicosocial, getAllPostpsicosocial, getPostpsicosocialByCC, updateCompetencias, getAll, exportToExcel } = require('../controllers/postPsicosocialController');

router.post('/createPostPsicosocial', createPostPsicosocial);

// router.put('/updateEnlistment', updateEnlistment);

router.put('/updateCompetencias', updateCompetencias);

router.get('/getAllPostpsicosocial', getAllPostpsicosocial);

router.get('/getPostpsicosocialByCC/:cc', getPostpsicosocialByCC);

router.get('/getAll', getAll);

router.get('/exportToExcel', exportToExcel);

// router.get('/getEnlistmentInfoAndDownloadPDF/:cc', getEnlistmentInfoAndDownloadPDF);

module.exports = router;