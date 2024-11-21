require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');


const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET, // Use secret from .env file
    resave: false,
    saveUninitialized: true,
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Failed to connect to MongoDB:', err));
// User Schema and Model for Login
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = mongoose.model('user', userSchema);

// Root route to redirect to login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user in the database
        const user = await User.findOne({ email, password });
        if (user) {
            // Set session on successful login
            req.session.userId = user._id;

            // Redirect to the desired website
            res.redirect('https://vlgeadmin1.onrender.com/');
        } else {
            // If credentials are invalid
            res.send('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred. Please try again.');
    }
});

// Define the schema and model for the registration collection
const registrationSchema = new mongoose.Schema({
    email: String,
    password: String,
});
const Registration = mongoose.model('registration', registrationSchema);

// Serve the login page (optional)
app.get('/login1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login submission
app.post('/login1', async (req, res) => {
    const { email, password, loginType } = req.body;

    try {
        // Verify the login type and handle the respective logic
        if (loginType === 'form2') {
            // Check if the user exists in the database
            const user = await Registration.findOne({ email, password });

            if (user) {
                // Set the session and redirect to the specified website
                req.session.userId = user._id;
                console.log(`Login successful for: ${email}`);
                res.redirect('https://studentprofile1.onrender.com/');
            } else {
                // If credentials are invalid
                res.status(401).send('Invalid credentials. Please try again.');
            }
        } else {
            // Handle other login types if needed
            res.status(400).send('Invalid login type.');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred. Please try again.');
    }
});



// Student Routes

app.get('/api/students', async (req, res) => {
    const search = req.query.search || '';
    try {
        const students = await Student.find({ name: new RegExp(search, 'i') });
        res.send(students);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});