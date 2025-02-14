const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cdpSchema = new Schema({
    nombres: {
        type: String,
        required: false, // <-- Ya no es obligatorio
    },
    documento: {
        type: Number,
        required: false, // <-- Ya no es obligatorio
        unique: true
    },
    autorizacion: {
        type: String,
        required: false, // <-- Ya no es obligatorio
    },
    fecha: {
        type: String,
        required: false
    },
    objeto: {
        type: String,
        required: false
    },
    resumido: {
        type: String,
        required: false
    },
    largo: {
        type: String,
        required: false
    },
    nombrerubro: {
        type: String,
        required: false
    },
    valor: {
        type: Number,
        required: false
    },
    valorletras: {
        type: String,
        required: false
    },
    codigo: {
        type: String,
        required: false
    },
    nombreproyecto: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Cdp = mongoose.model('Cdp', cdpSchema);

module.exports = Cdp;
