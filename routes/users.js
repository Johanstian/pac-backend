const express = require('express');
const router = express.Router();

const {createUser, getUsers, loginUser} = require('../controllers/user');


router.post('/createUser', createUser);

router.get('/getUsers', getUsers);

router.post('/loginUser', loginUser);

// router.delete('/:id', deleteUser);


module.exports = router;