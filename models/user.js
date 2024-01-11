const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:      { type : String, required: true },
    lastName:       { type : String, required: true },
    userName:       { type : String },
    city:           { type : String },
    state:          { type : String },
    country:        { type : String },
    email:          { type : String, required: true, unique: true },
    password:       { type : String, required: true },
    bio:            { type : String },
    profilePicture: { type : String },
    ratings : [{
        id:              { type : String },
        original_title:  { type : String },
        poster_path:     { type : String },
        overview:        { type : String },
        rating:          { type : Number },
    }],
    watched : [{ 
      id :               { type : String },
      original_title :   { type : String },
      poster_path :      { type : String },
      overview:          { type : String },
    }],
    watchList : [{ 
      id :               { type : String },
      original_title :   { type : String },
      poster_path :      { type : String },
      overview:          { type : String },
    }],
    liked : [{ 
      id :               { type : String },
      original_title :   { type : String },
      poster_path :      { type : String },
      overview:          { type : String },
    }],
    disliked : [{ 
      id :               { type : String },
      original_title :   { type : String },
      poster_path :      { type : String },
      overview:          { type : String },
    }],
    playlists : [{
      name :             { type : String },
      videos : [{ 
        id :             { type : String },
        original_title : { type : String },
        poster_path :    { type : String },
        overview:        { type : String },
      }],
    }],
}, { timestamps:    { type : true });

const User = mongoose.model('User', userSchema);

module.exports = User;