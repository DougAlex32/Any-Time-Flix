const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cors = require('cors');

// create app
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/users', require('./controllers/users'));
app.use('/movies', require('./controllers/tmdb-api'));
app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to AnyTime Flix' });
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;