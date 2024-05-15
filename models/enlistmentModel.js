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
    finalReport: {
        type: String,
        required: true
    },
    technical: {
        type: String,
        required: false
    }
});

const Enlistment = mongoose.model('Enlistment', enlistmentSchema);

module.exports = Enlistment;