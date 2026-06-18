const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

// Export for Vercel Serverless Functions
module.exports = app;
