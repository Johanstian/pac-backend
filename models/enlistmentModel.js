const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const enlistmentSchema = new Schema({
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
        required: true
    },
    sanity: {
        type: String,
        required: true
    },
    aptitudes: {
        type: String,
        required: true
    },
    nonVerbal: {
        type: String,
        required: true
    },
    finalReport: {
        type: String,
        required: true
    },
});

const Enlistment = mongoose.model('Enlistment', enlistmentSchema);

module.exports = Enlistment;