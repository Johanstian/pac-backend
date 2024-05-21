const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postpsicosocialSchema = new Schema({
    names: {
        type: String,
        required: true
    },
    cc: {
        type: Number,
        required: true
    },
    test: {
        type: String,
        required: true
    },
    workExperience: {
        type: String,
        required: false
    },
    sanity: {
        type: String,
        required: false
    },
    aptitudes: {
        type: String,
        required: false
    },
    nonVerbal: {
        type: String,
        required: false
    },
    cCompetence: {
        type: String,
        required: false
    },
    eCompetence: {
        type: String,
        required: false
    },
    aydCompetence: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Pendiente', 'Concluido'],
        default: 'Pendiente'
    },
    finalReport: {
        type: String,
        required: true
    },
    technical: {
        type: String,
        required: false
    }
});

const Postpsicosocial = mongoose.model('Postpsicosocial', postpsicosocialSchema);

module.exports = Postpsicosocial;