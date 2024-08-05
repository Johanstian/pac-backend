const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const homeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    }
})

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;