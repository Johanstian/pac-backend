const express = require('express');

const router = express.Router();

const { createArl, getAllArls, getArlByCc, getArlById, updateArl, deleteArl, exportToExcel } = require('../controllers/arlController')

router.post('/createArl', createArl);

router.get('/getAllArls', getAllArls);

router.get('/getArlByCc/:cc', getArlByCc);

router.get('/getArlById/:id', getArlById);

router.put('/updateArl/:id', updateArl);

router.delete('/deleteArl/:id', deleteArl);

router.get('/exportToExcel', exportToExcel);

module.exports = router;