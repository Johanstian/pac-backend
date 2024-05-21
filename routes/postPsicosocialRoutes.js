const express = require('express');
const router = express.Router();

const { createPostPsicosocial, getAllPostpsicosocial, getPostpsicosocialByCC, updateCompetencias } = require('../controllers/postPsicosocialController');

router.post('/createPostPsicosocial', createPostPsicosocial);

// router.put('/updateEnlistment', updateEnlistment);

router.put('/updateCompetencias', updateCompetencias);

router.get('/getAllPostpsicosocial', getAllPostpsicosocial);

router.get('/getPostpsicosocialByCC/:cc', getPostpsicosocialByCC);

// router.get('/getEnlistmentInfoAndDownloadPDF/:cc', getEnlistmentInfoAndDownloadPDF);

module.exports = router;