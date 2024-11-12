const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'User name is required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        role: {
            type: String,
            required: [true]
        }
    },
    {
        timestamps: true,
    }
);

//Definir índice único para evitar duplicación



module.exports = mongoose.model('User', userSchema);