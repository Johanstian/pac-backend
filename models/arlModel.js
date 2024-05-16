const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const arlSchema = new Schema({
    arlName: {
        type: String,
        required: true
    },
    documentType: {
        type: String,
        required: true
    },
    cc: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String,
        required: false
    },
    firstSurname: {
        type: String,
        required: true
    },
    secondSurname: {
        type: String,
        required: false
    },
    birthday: {
        type: Date,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    cellphone: {
        type: Number,
        required: true
    },
    eps: {
        type: String,
        required: true
    },
    afp: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
})

const Arl = mongoose.model('Arl', arlSchema);

module.exports = Arl;