const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes')); // We'll create this later

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running ${PORT}`));
