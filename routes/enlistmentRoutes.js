const express = require('express');
const router = express.Router();

const { createEnlistment, getAllEnlistment, getEnlistmentByCC } = require('../controllers/enlistmentController');

router.post('/createEnlistment', createEnlistment);

router.get('/getAllEnlistment', getAllEnlistment);

router.get('/getEnlistmentByCC/:cc', getEnlistmentByCC);

module.exports = router;