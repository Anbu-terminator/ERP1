const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files like login.html and header.jpeg

// MongoDB Connection
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/erp';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html'); // Serve the login page
});

// Example API endpoint (you can replace this with your logic)
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
