const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.DB_URL;

if (!uri) {
    throw new Error("Database connection URL is missing in environment variables");
}

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        setTimeout(() => connectDB(), 5000); // Retry connection after 5 seconds
    }
};

module.exports = connectDB;
