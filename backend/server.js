const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
// CHECK INCOMING REQUESTS
app.use((req, res, next) => {
    console.log("REQUEST RECEIVED:", req.method, req.url);
    next();
});

// Test backend
app.get('/', (req, res) => {
    res.send('Library Management System API is running!');
});

// Test MySQL connection
app.get('/test-db', (req, res) => {
    db.query('SELECT 1', (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Database connection failed',
                error: err.message
            });
        }

        res.json({
            message: 'MySQL database is connected successfully!'
        });
    });
});

// GET ALL BOOKS
console.log("BOOKS ROUTE HAS BEEN LOADED!");
app.get('/api/books', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to retrieve books',
                error: err.message
            });
        }

        res.json(results);
    });
});


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});