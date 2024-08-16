const express = require('express');
const router = express.Router();
const { createBanner, getBanners } = require('../controllers/appBanner');
const upload = require('../middlewares/multer')

router.post('/createBanner', upload.single('imageUrl'), createBanner);

router.get('/getBanners', getBanners);

module.exports = router;