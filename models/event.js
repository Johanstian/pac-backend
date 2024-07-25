const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

const Events = mongoose.model('Events', eventSchema);

module.exports = Events;