const mongoose = require('mongoose');
const dbpass = process.env.DB_PASSWORD;
const dbuser = process.env.DB_USERNAME;
const mongoURI = "mongodb+srv://"+dbuser+":"+dbpass+"@cluster0.d7hlqy6.mongodb.net/notes?retryWrites=true&w=majority";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connectToMongo;