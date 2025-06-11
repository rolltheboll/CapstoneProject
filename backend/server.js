const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/listings', require('./routes/listing.routes'));
app.use('/api/inquiries', require('./routes/inquiry.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/favorites', require('./routes/favorite.routes'));
app.use('/api/admin', require('./routes/admin.routes'));




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
