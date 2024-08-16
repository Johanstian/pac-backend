const express = require('express');

const router = express.Router();

const { createComment, getComments, createProduct, getProducts, getProductById, uploadImage, createEvent, getEvent, createHome, getHome, deleteHome } = require('../controllers/appGeneral');

const upload = require('../middlewares/multer')

router.post('/createComment', createComment);

router.get('/getComments', getComments);

router.post('/createProduct', upload.single('avatar'), createProduct);

router.post('/createHome', upload.single('avatar'), createHome);

router.post('/upload', upload.single('image'), uploadImage)

router.get('/products', getProducts);

router.get('/getHome', getHome);

router.delete('/deleteHome', deleteHome);

router.get('/products/:id', getProductById);

router.post('/createEvent', createEvent);

router.get('/getEvent', getEvent);

module.exports = router;