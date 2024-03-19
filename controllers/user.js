const User = require('../models/user')

const createUser = async (req, res, next) => {
    try {
        const {name, email} = req.body;
        if(!name || !email) {
            res.status(400);
            return next(new Error('name and email fields are required'));
        }

        const isUserExists = await User.findOne({email});

        if(isUserExists) {
            res.status(404);
            return next(new Error('user already exists'));
        }

        const user = await User.create({
            name, email
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
            success: true,
            users: users // Enviar la lista de usuarios como respuesta
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}


module.exports = {createUser, getUsers};