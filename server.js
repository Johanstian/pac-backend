require('dotenv').config();
const express = require('express');
const cors = require('cors');

//EXPRESS APP
const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARES

app.use(express.json());
app.use(cors());

const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const tests = require('./routes/testsRoute');
const retests = require('./routes/retestsRoutes');
const interview = require('./routes/interviewRoutes');
const enlistment = require('./routes/enlistmentRoutes');
const psicosocial = require('./routes/postPsicosocialRoutes');
const arl = require('./routes/arlRoutes');
const general = require('./routes/appGeneralRoutes');

//CONNECT TO DB
connectDB();

//ROUTES
app.use('/api', userRoutes);
app.use('/api/tests', tests);
app.use('/api/retests', retests);
app.use('/api/interview', interview);
app.use('/api/enlistment', enlistment);
app.use('/api/psicosocial', psicosocial);
app.use('/api/arl', arl);
app.use('/api/general', general);

app.use('/', (req, res) => {
    return res.json({
        message: 'Welcome to the PAC Backend'
    });
})

// app.use();

const server = app.listen(port, () => {
    console.log('Server started listening on ' + port)
})


process.on('unhandledRejection', (error, promise) => {
    console.log('Logged error ' + error);
    server.close(() => process.exit(1));
})








// const PORT = process.env.PORT
// app.listen(PORT, () => {
//     console.log('Server running on port ' + PORT)
// })


// const dbURI = 'mongodb+srv://johan:johan@cluster.dkdvjfa.mongodb.net/pac?retryWrites=true&w=majority&appName=cluster';
// mongoose.connect(dbURI)
//     .then((result) => app.listen(3000))
//     .catch((err) => console.log(err))

// app.set('view engine', 'ejs');
// app.use(cors());

// app.get('/users', (req, res) => {
//     User.find()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err)
//         })
// })



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

app.post('api/identity/sign-in', (req, res) => {
    const { username, email } = req.body;

    // Verificar si el usuario existe en la base de datos
    User.findOne({ username })
        .then(user => {
            if (!user) {
                // Si el usuario no existe, enviar una respuesta de error
                return res.status(404).send('El usuario no se ha encontrado');
            }
            // Si el usuario existe, verificar la contraseña
            if (user.password !== email) {
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
