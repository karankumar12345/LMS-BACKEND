// For CommonJS
const cloudinary = require('cloudinary').v2;

const app = require('./app.js');
const connectDB = require('./utils/DB.js');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

const startServer = async () => {
    try {
        // Connect to the database
        await connectDB();

        // Start the server
        const port = process.env.PORT || 3000; // Default to 3000 if PORT isn't set
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1); // Exit if server startup fails
    }
};

// Start the server
startServer();
