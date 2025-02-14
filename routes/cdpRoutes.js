const express = require('express');

const router = express.Router();

const { createCdp, getCdpPaginated, getAllCdps, updateCdp, getCdpById, getBySearch, generateDocument, generateDocumentList } = require('../controllers/cdpController');

router.post('/create', createCdp);

router.get('/paginated', getCdpPaginated);

router.get('/all', getAllCdps);

router.get('/get-cdp/:_id', getCdpById);

router.put('/update/:_id', updateCdp);

router.get('/search', getBySearch);

router.post('/generate-document', generateDocument);

router.post('/generate-cdplist', generateDocumentList);

module.exports = router