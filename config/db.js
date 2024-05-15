const mongoose = require('mongoose');
mongoose.set('strictQuery', false)
// require('dotenv').config();

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('Yes connected to Mongodb ' + conn.connection.host);
    } catch (error) {
        console.log('Connect failed ' + error.message);
        process.exit(1);
    }
}

module.exports = connectDB;