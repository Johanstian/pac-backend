const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    products: {
        type: String,
        required: true
    },
    facebook: {
        type: String,
        required: false
    },
    mail: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    }
})

const Products = mongoose.model('Products', productSchema);

module.exports = Products;