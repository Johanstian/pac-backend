const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pdfSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    }
})

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;