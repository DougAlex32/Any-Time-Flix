const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    city: String,
    state: String,
    country: String,
    email: String,
    password: String,
    bio: String,
    profilePicture: String,
    ratings : [{
        id: String,
        original_title : String,
        poster_path : String,
        overview: String,
        rating: Number
    }],
    watched : [{ 
      id : String,
      original_title : String,
      poster_path : String,
      overview: String,
    }],
    watchList : [{ 
      id : String,
      original_title : String,
      poster_path : String,
      overview: String,
    }],
    liked : [{ 
      id : String,
      original_title : String,
      poster_path : String,
      overview: String,
    }],
    disliked : [{ 
      id : String,
      original_title : String,
      poster_path : String,
      overview: String,
    }],
    playlists : [{
      name : String,
      videos : [{ 
        id : String,
        original_title : String,
        poster_path : String,
        overview: String,
      }],
    }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;