const express = require('express');
const axios = require('axios');
require('dotenv').config();

const Search = require('../models/search');

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const extractMpaaCertification = (releaseDates) => {
    let mpaaCertification;
    releaseDates.forEach((release) => {
        if (release.iso_3166_1 === 'US') {
            mpaaCertification = release.release_dates[0].certification;
        }
    });
    return mpaaCertification || 'not rated';
}

// GET /movies/test (Public) - test route
router.get('/test', (req, res) => {
    res.json({ message: 'TMDB endpoint OK! ✅' });
    console.log("'movies/test' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
});

// GET /movies/search/:query/:page (Public) - search movies by title
router.get('/search/:query/:page', async (req, res) => {
    try {
        const { query } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                query,
                api_key: TMDB_API_KEY,
                include_adult: false,
                page: req.params.page,
            },
        });
        // if results exist, save query to database
        if (response.data.results.length > 0) {
            // see if query exists in database
            const globalQuery = await Search.findOne({ query });
            // if query exists, update timesQueried
            if (globalQuery) {
                globalQuery.timesQueried += 1;
                globalQuery.top5Results = response.data.results.slice(0, 5)
                await globalQuery.save();
            }
            // if query does not exist, create new query
            else {
                const newQuery = await Search.create({ query, timesQueried: 1 });
                newQuery.top5Results = response.data.results.slice(0, 5)
                await newQuery.save();
            }
        }

        res.json(response.data);
        console.log("'movies/search/"+query+"' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /movies/movie/:id (Public) - get movie details by ID
router.get('/movie/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
            params: {
                api_key: TMDB_API_KEY,
                append_to_response: 'credits,videos,images,release_dates',
            },
        });
        const providers = await axios.get(`${TMDB_BASE_URL}/movie/${id}/watch/providers`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        response.data.mpaa_certification = extractMpaaCertification(response.data.release_dates.results); // get US rating
        response.data.watch_providers = providers.data.results.US; // get US streaming providers
        res.json(response.data);
        console.log("'movies/movie/"+id+"' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
        console.log('Movie id is for', response.data.title)
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
        if (req.params.page = 1) {
            console.log("'movies/movie/"+id+"/recommendations' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
            console.log(response.data)
        } else {
            console.log('More recommendations for movie:', id)
        }
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
        if (req.params.page = 1) {
            console.log("'movies/popular' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
        } else {
            console.log('More popular movies loaded')
        }
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
        res.json(response.data);
        if (req.params.page = 1) {
            console.log("'movies/now-playing' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
        } else {
            console.log('More now playing movies loaded')
        }
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
        res.json(response.data);
        if (req.params.page = 1) {
            console.log("'movies/upcoming' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
        } else {
            console.log('More upcoming movies loaded')
        }
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
        res.json(response.data);
        if (req.params.page = 1) {
            console.log("'movies/top-rated' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
        } else {
            console.log('More top rated movies loaded')
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a list of genres
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
        console.log("'movies/genre/movie/list' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get movies by selected year
router.get('/discover/year/:year/:page', async (req, res) => {
    try {
        const { year } = req.params;
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                primary_release_year: year,
                page: req.params.page,
                sort_by: 'vote_count.desc',
                include_adult: false,
            },
        });
        res.json(response.data);
        if (req.params.page = 1) {
            console.log("'movies/discover/year/"+year+"' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
        } else {
            console.log('More movies from', year, 'loaded')
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get movies by selected genre
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
        res.json(response.data);
        if (req.params.page = 1) {
            console.log("'movies/discover/genre/"+genre+"' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
        } else {
            console.log('More movies from', genre, 'loaded')
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get movies by selected rating (range from rating - .5 to rating + .49)
router.get('/discover/rating/:rating/:page', async (req, res) => {
    try {
        const { rating } = req.params;
        const ratingTop = Number(rating) + .4;
        let ratingBottom = () => {
            if (rating > 1) {
                return (rating - .5)
            } else {
                return 0;
            }
        }
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
        res.json(response.data);
        if (req.params.page = 1) {
            console.log("'movies/discover/rating/"+rating+"' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
        } else {
            console.log('More movies from', rating, 'loaded')
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;