const mongoose = require("mongoose");
const config = require("./config");
const logger = require("../utils/logger");
const { ApplicationError } = require("../utils/errorHandler");

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return mongoose.connection;
    }

    try {
        await mongoose.connect(config.db.uri);
        isConnected = true;
        logger.success("Connected to MongoDB Atlas.");
        return mongoose.connection;
    } catch (err) {
        throw new ApplicationError("Failed to connect to MongoDB", { original: err.message });
    }
}

async function disconnectDB() {
    if (isConnected) {
        await mongoose.disconnect();
        isConnected = false;
        logger.info("MongoDB connection closed.");
    }
}

module.exports = { connectDB, disconnectDB };