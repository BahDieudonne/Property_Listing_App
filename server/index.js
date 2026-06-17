const express      = require('express');
const cors         = require('cors');
const dotenv       = require('dotenv');
const cookieParser = require('cookie-parser');
const path         = require('path');
const connectDB    = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Allow cookies to be sent from the React frontend (credentials: true is required)
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server origin
  credentials: true,               // Allow cookies to be included in requests
}));

app.use(express.json());
app.use(cookieParser());

// Serve uploaded property images as static files at /uploads/*
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',       require('./routes/auth.Routes'));
app.use('/api/users',      require('./routes/user.Routes'));
app.use('/api/properties', require('./routes/property.Routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));