require("dotenv").config();
const express = require("express");
const router = express.Router();

const Search = require("../models/search");

router.get("/all", async (req, res) => {
  try {
    const allSearches = await Search.find({});
    res.json({ allSearches });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/save", async (req, res) => {
  try {
    const newSearch = await Search.create(req.body);
    res.json({ newSearch });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const recentSearches = await Search.find({}).sort({ createdAt: -1 }).limit(25);
    res.json({ recentSearches });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/top25", async (req, res) => {
  try {
    const response = await Search.find({}).sort({ timesQueried: -1 }).limit(25);
    res.json({ response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;