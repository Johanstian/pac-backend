const User = require('../models/user');

const createUser = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            res.status(400);
            return next(new Error('username and password and role fields are required'));
        }
        const isUserExists = await User.findOne({ username });
        if (isUserExists) {
            res.status(409);
            return next(new Error('username already exists'));
        }
        const user = await User.create({
            username, password, role
        });
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}


const getUsers = async (req, res, next) => {
    try {
        const users = await User.find(); // Obtener todos los usuarios de la base de datos

        res.status(200).json({
            // success: true,
            users // Enviar la lista de usuarios como respuesta
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const loginUser = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user) {
            return res.status(401).json({message: 'Usuario no encontrado'});
        }
        if(user.password !== password) {
            return res.status(401).json({message: 'Contraseña incorrecta'});
        }
        // res.status(200).json({message: 'Inicio de sesión exitoso', user});
        res.status(200).send(user)
    } catch (error) {
        console.log(error);
        return next(error);
    }
}




module.exports = { createUser, getUsers, loginUser };