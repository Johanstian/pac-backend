const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const eventosSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateTechEvent: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
});

const Eventos = mongoose.model('Eventos', eventosSchema)

module.exports = Eventos;