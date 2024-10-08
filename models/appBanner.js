const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bannerSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;