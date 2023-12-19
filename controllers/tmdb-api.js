const express = require('express');
const axios = require('axios');

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_HEADERS = {
    accept: 'application/json',
    Authorization: process.env.TMDB_AUTHORIZATION,
  }


// Search for movies
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                query,
                api_key: TMDB_API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get movie details by ID
router.get('/movie/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {

            params: {
                api_key: TMDB_API_KEY,
            },
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YmY3YzFiNWNkMDNmNmI5MmVlZWJkNWYyOWNiODA0ZCIsInN1YiI6IjY0ZjdjZTc2ZmZjOWRlMDExYmU5MTUzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yhthook-VeFYqHZF8lCFHsGzbKFWfNgs2UKdxudg26A'
              }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get movie credits (cast and crew) by ID
router.get('/movie/:id/credits', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/credits`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Discover movies by genre
router.get('/discover/:genre', async (req, res) => {
    try {
        const { genre } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                with_genres: genre,
                api_key: TMDB_API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get movie recommendations by ID
router.get('/movie/:id/recommendations', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/recommendations`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get popular movies
router.get('/popular', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get now playing movies
router.get('/now-playing', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
