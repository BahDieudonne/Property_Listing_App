const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const cookieParser = require('cookie-parser'); // NEW: reads cookies from requests
const connectDB  = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Allow cookies to be sent from the React frontend (credentials: true is required)
app.use(cors({
  origin: 'http://localhost:3000', // React dev server origin
  credentials: true,               // Allow cookies to be included in requests
}));

app.use(express.json());
app.use(cookieParser()); // NEW: parse cookies so req.cookies is available

app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/users',      require('./routes/userRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));

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