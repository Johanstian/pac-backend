const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: Schema.Types.Mixed,
        required: true
    },
    password: {
        type: Schema.Types.Mixed,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;