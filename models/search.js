const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    query:         { type : String, required: true },
    top5Results:   [{
        id:              { type : String },
        original_title:  { type : String },
        poster_path:     { type : String },
        overview:        { type : String },
        rating:          { type : Number },
        }],
    timesQueried: { type : Number, required: true },
}, { timestamps:    { type : true }});

const Search = mongoose.model('GlobalSearch', searchSchema);

module.exports = Search;
