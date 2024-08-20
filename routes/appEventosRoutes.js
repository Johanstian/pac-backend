const express = require('express');
const router = express.Router();

const { createEvents, getEvents, getEventsById } = require('../controllers/appEventosController');

const upload = require('../middlewares/multer');

router.post('/createEvents', upload.single('imageUrl'), createEvents);

router.get('/getEvents', getEvents);

router.get('/getEventsById/:id', getEventsById);

module.exports = router;