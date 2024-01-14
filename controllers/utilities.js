const express = require('express');
const axios = require('axios');
require('dotenv').config();

const Search = require('../models/search');

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// GET /countries (Public) - returns all countries from TMDB with iso_3166_1 code and name
router.get('/countries', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/configuration/countries?api_key=${TMDB_API_KEY}`);
        res.json({ response: response.data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;