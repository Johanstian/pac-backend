const express = require('express');
const router = express.Router();
const User = require('./models/user');

// router.post('/identity/sign-up', (req, res) => {
//     const user = new User({
//         username: 'Johan',
//         password: 261122
//     });
//     user.save()
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log('Error al crear user', err)
//     })
//   });

// Función para borrar un usuario
router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    // Lógica para borrar un usuario
});

module.exports = router;