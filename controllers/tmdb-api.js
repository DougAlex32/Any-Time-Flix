const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Search for movies
router.get('/search/:query/:page', async (req, res) => {
    try {
        const { query } = req.params;
        console.log('Search query is:', query)
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                query,
                api_key: TMDB_API_KEY,
                include_adult: false,
                page: req.params.page,
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
        const providers = await axios.get(`${TMDB_BASE_URL}/movie/${id}/watch/providers`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        response.data.watch_providers = providers.data.results.US;
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

// Get movie recommendations by ID
router.get('/movie/:id/recommendations/:page', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/recommendations`, {
            params: {
                api_key: TMDB_API_KEY,
                page: req.params.page,
                include_adult: false,
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
                include_adult: false,

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
                include_adult: false,
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
                include_adult: false,
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
                include_adult: false,
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
                include_adult: false,
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
        console.log(req.params)
        const { year } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                primary_release_year: year,
                page: req.params.page,
                include_adult: false,
            },
        });
        console.log('response')
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/discover/genre/:genre/:page', async (req, res) => {
    try {
        const { genre } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                with_genres: genre,
                include_adult: false,
                sort_by: 'vote_count.desc',
                page: req.params.page,

            },
        });
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/discover/rating/:rating/:page', async (req, res) => {
    try {
        const { rating } = req.params;
        let ratingBottom
        console.log('Initial rating is:',rating)
        const ratingTop = Number(rating) + .4;
        if (rating > 1) {
            ratingBottom = rating - .5;
        } else {
            ratingBottom = 0;
        }
        console.log('rating range is between:', ratingBottom, 'and', ratingTop)
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                'vote_average.lte': ratingTop,
                'vote_average.gte': ratingBottom,
                'sort_by': 'vote_count.desc',
                'include_adult': false,
                'vote_count.gte': 2,
                page: req.params.page,
            },
        });
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
