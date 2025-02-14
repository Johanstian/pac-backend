// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const contractorSchema = new Schema({
//     documento: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     contratista: {
//         type: String,
//         required: true
//     },
//     invitacion: {
//         type: String,
//         required: true
//     },
// })
// const Contractor = mongoose.model('Contractor', contractorSchema);
// module.exports = Contractor;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contractorSchema = new Schema({
    documento: {
        type: Number,
        required: true,
        unique: true
    },
    contratista: {
        type: String,
        required: true
    },
    invitacion: {
        type: String,
        required: true
    },
    identificado: {
        type: String,
        required: true
    },
    oficio: {
        type: String,
        required: true
    },
    fechacdp: {
        type: String,
        required: true
    },
    actividad: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    requisitoestudios: {
        type: String,
        required: true
    },
    requisitoexperiencia: {
        type: String,
        required: true
    },
    alternativaestudio: {
        type: String,
        required: true
    },
    alternativaexperiencia: {
        type: String,
        required: true
    },
    plazo: {
        type: String,
        required: true
    },
    cdp: {
        type: Schema.Types.ObjectId,
        ref: 'Cdp'
    },
    cdpInfo: {
        nombres: String,
        documento: Number,
        autorizacion: String,
        fecha: String,
        objeto: String,
        resumido: String,
        largo: String,
        nombrerubro: String,
        valor: Number,
        valorletras: String,
        codigo: String,
        nombreproyecto: String
    }
});

const Contractor = mongoose.model('Contractor', contractorSchema);

module.exports = Contractor;