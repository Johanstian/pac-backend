const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Blog = require('./models/blog');
const User = require('./models/user');
app.use(express.json());


const dbURI = 'mongodb+srv://johan:johan@cluster.dkdvjfa.mongodb.net/pac?retryWrites=true&w=majority&appName=cluster';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err))

app.set('view engine', 'ejs');
app.use(cors());



app.get('/users', (req, res) => {
    User.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})



//así se crea con ruta y body:

app.post('/identity/sign-up', (req, res) => {
    User.findOne({ username: req.body.username })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).send('El usuario ya existe');
            } else {
                const user = new User({
                    username: req.body.username,
                    password: req.body.password
                });
                return user.save()
                    .then(result => {
                        res.send(result);
                    });
            }
        })
        .catch(() => {
            res.status(400).send('Error al crear usuario');
        });
});

app.post('/identity/sign-in', (req, res) => {
    const { username, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    User.findOne({ username })
        .then(user => {
            if (!user) {
                // Si el usuario no existe, enviar una respuesta de error
                return res.status(404).send('El usuario no se ha encontrado');
            }
            // Si el usuario existe, verificar la contraseña
            if (user.password !== password) {
                // Si la contraseña no coincide, enviar una respuesta de error
                return res.status(401).send('Usuario y/o contraseña incorrectas');
            }
            // Si el usuario y la contraseña son correctos, enviar una respuesta exitosa
            res.send(user);
        })
        .catch(error => {
            // Manejar cualquier error que ocurra durante la búsqueda del usuario
            console.error('Error al iniciar sesión:', error);
            res.status(500).send('Error interno del servidor');
        });
});
