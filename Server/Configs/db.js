const mongoose = require('mongoose');
require('dotenv').config();
const connectToServer = async () => {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to server");
}
module.exports = connectToServer;