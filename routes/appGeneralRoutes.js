const express = require('express');

const router = express.Router();

const { createComment, getComments, createProduct, getProduct, getProductById } = require('../controllers/appGeneral');

router.post('/createComment', createComment);

router.get('/getComments', getComments);

router.post('/createProduct', createProduct);

router.get('/product', getProduct);

router.get('/products/:id', getProductById);

module.exports = router;