// Import required packages
const express = require('express');   // Web framework for Node.js
const cors    = require('cors');      // Allows the React frontend to communicate with this server
const dotenv  = require('dotenv');    // Loads variables from .env file into process.env

// Import our database connection function
const connectDB = require('./config/db');

// Load environment variables from .env into process.env
dotenv.config();

// Connect to MongoDB before starting the server
connectDB();

// Create the Express application
const app = express();

// ===== GLOBAL MIDDLEWARE =====
app.use(cors());

app.use(express.json());

// ===== ROUTES =====
app.use('/api/auth',       require('./routes/authRoutes'));

// All user profile endpoints
app.use('/api/users',      require('./routes/userRoutes'));

// All property endpoints
app.use('/api/properties', require('./routes/propertyRoutes'));

// ===== ERROR HANDLERS =====
// 404 handler — runs when no route matched the request
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));