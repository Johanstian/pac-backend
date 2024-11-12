// const express = require('express');
// const router = express.Router();
// const { generatePDF } = require('../controllers/pdfkit');

// router.get('/invoice', generatePDF);

// module.exports = router;



const express = require('express');
const router = express.Router();
const { generatePDF } = require('../controllers/pdfkit');

router.post('/generate', generatePDF);

module.exports = router;
