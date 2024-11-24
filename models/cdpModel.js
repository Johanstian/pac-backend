const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cdpSchema = new Schema({
    nombres: {
        type: String,
        required: true,
    },
    documento: {
        type: Number,
        required: true,
        unique: true
    },
    autorizacion: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: false
    },
    objeto: {
        type: String,
        required: true
    },
    resumido: {
        type: String,
        required: true
    },
    largo: {
        type: String,
        required: true
    },
    nombrerubro: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    valorletras: {
        type: String,
        required: true
    },
    codigo: {
        type: String,
        required: true
    },
    nombreproyecto: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Cdp = mongoose.model('Cdp', cdpSchema);

module.exports = Cdp;