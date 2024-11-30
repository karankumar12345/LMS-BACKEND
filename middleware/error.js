// const ErrorHandler = require("../utils/ErrorHandler");

const errorMiddleware = (err, req, res, next) => {
    // Default status code and message
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // Handling CastError for invalid MongoDB ObjectId
    if (err.name === "CastError") {
        err.message = `Resource not found. Invalid ${err.path}`;
        err.statusCode = 400; // Set specific status code
    }

    // Handling Mongoose duplicate key error (code 11000)
    if (err.code === 11000) {
        err.message = "Duplicate field value entered";
        err.statusCode = 400; // Set specific status code
    }

    // Handling JWT errors (invalid token)
    if (err.name === "JsonWebTokenError") {
        err.message = "JSON Web Token is invalid, try again";
        err.statusCode = 400; // Set specific status code
    }

    // Handling expired JWT token
    if (err.name === "TokenExpiredError") {
        err.message = "JSON Web Token is expired, try again";
        err.statusCode = 400; // Set specific status code
    }

    // Validate the status code
    const statusCode = typeof err.statusCode === 'number' && err.statusCode >= 100 && err.statusCode <= 599
        ? err.statusCode
        : 500; // Default to 500 for invalid status codes

    // Sending error response
    res.status(statusCode).json({
        success: false,
        message: err.message,
    });
};

module.exports = errorMiddleware;
