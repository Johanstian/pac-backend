const express = require('express');

const router = express.Router();

const { createContractor, getAllContractors, updateContractor, getOneContractor, allContractors, getBySearch } = require('../controllers/contractorsController');

router.post('/createContractor', createContractor);

router.get('/contractors', getAllContractors);

router.put('/update-contractor/:documento', updateContractor);

router.get('/contractors/:documento', getOneContractor);

router.get('/all', allContractors);

router.get('/search', getBySearch);


module.exports = router