const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

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
                append_to_response: 'credits,videos,images',
            },
        });
        console.log('Movie details retrieved for:', response.data.title, 'on', new Date().toDateString(), 'at', new Date().toLocaleTimeString('en-US'))
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
router.get('/discover/:genre/:page', async (req, res) => {
    try {
        const { genre } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                with_genres: genre,
                api_key: TMDB_API_KEY,
                page: req.params.page,
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
router.get('/popular/:page', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                page: req.params.page,

            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get now playing movies
router.get('/now-playing/:page', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
            params: {
                api_key: TMDB_API_KEY,
                page: req.params.page,
            },
        });
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get upcoming movies
router.get('/upcoming/:page', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
            params: {
                api_key: TMDB_API_KEY,
                page: req.params.page,
            },
        });
        console.log(response.data, 'response')
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get top rated movies
router.get('/top-rated/:page', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
            params: {
                api_key: TMDB_API_KEY,
                page: req.params.page,
            },
        });
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/genre/movie/list', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
            params: {
                api_key: TMDB_API_KEY,
                page: req.params.page,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/discover/year/:year/:page', async (req, res) => {
    try {
        const { year } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                primary_release_year: year,
            },
        });
        console.log(response.data, 'response')
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/discover/genre/:genre/:page', async (req, res) => {
    try {
        const { genre } = req.params;
        console.log('searching for', genre)
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                with_genres: genre,
                include_adult: false,
                sort_by: 'vote_count.desc',

            },
        });
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/discover/rating/:rating:/page', async (req, res) => {
    try {
        const { rating } = req.params;
        console.log('Initial rating is:',rating)

        if (rating > 10 || rating < 0) {
            return res.json({ error: 'Rating must be between 0 and 10' });
        }

        let ratingBottom
        let ratingTop

        if (rating === '10') {
            ratingTop = 10;
        } else {
            ratingTop = rating + '.4999999999999999';
        }

        if (rating === 1) {
            ratingBottom = 0;
        } else {
            ratingBottom = rating - '.5';
        }
        console.log('Upper threshold:', Number(ratingTop), 'Lower threshold:', ratingBottom)
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                'vote_average.lte': ratingTop,
                'vote_average.gte': ratingBottom,
                'vote_count.gte': 5,
                'inclue_adult': false,
            },
        });
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
