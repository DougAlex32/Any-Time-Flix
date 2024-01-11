const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('./config/passport')(passport);

// create app
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(cors());

// connect to database, console log connection status
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to Any Time Flix database');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// routes for controllers
app.use('/users', require('./controllers/users'));
app.use('/movies', require('./controllers/movies'));

// GET / (Public) - test route
app.get('/', (req, res) => {
    console.log("'/' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
    res.json({ message: 'Welcome to AnyTime Flix' });
});

// PORT assignment, defualts to 8000
const PORT = process.env.PORT || 8000;

// listen on PORT, console log PORT number
app.listen(PORT, () => {
    console.log(`Connected Any Time Flix server to PORT: ${PORT}`);
});

module.exports = app;