const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const strengthSchema = new Schema ({
    cc: {
        type: Number,
        required: true
    }
})