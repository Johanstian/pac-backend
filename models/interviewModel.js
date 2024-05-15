const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const interviewSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    cc: {
        type: Number,
        required: true
    },
    names: {
        type: String,
        required: true
    },
    cellphone: {
        type: Number,
        required: true
    },
    test: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    techLead: {
        type: String,
        required: true
    },
    interview: {
        type: String,
        required: true
    },
    observations: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pendiente', 'Concluido'],
        default: 'Pendiente'
    }
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;