const jwt = require("jsonwebtoken");
const { catchAsync } = require("./catchAsync");
const UserModel = require("../models/user.model");
// const UserModel = require("../models/user.model"); // Adjust the import based on your User model location
// const { catchAsync } = require("./catchAsync");
require("dotenv").config();

exports.isAuthenticated = catchAsync(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;

        console.log("Access Token:", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "karankumar");

        console.log("User ID from token:", decoded.id);

        // Find the user by ID
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Attach user info to the request
        req.user = user;
        console.log("Authenticated User:", req.user);

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({
                success: false,
                message: "Token expired, please refresh your token",
            });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV !== "production" ? error.message : undefined,
        });
    }
});


// Middleware to check if the user is an admin
exports.authorizeAdmin = () => {
    return (req, res, next) => {
        const userRole = req.user?.role || "";

        // Allow access only if the user is an admin
        if (userRole !== "admin") {
            res.status(403).json({ message: "Access denied." });
            return; // Ensure to return here to avoid continuing the middleware
        }

        next(); // Proceed to the next middleware or route handler
    };
};

