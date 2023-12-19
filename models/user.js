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
        rating: Number
    }],
    watched : [{ id : String }],
    watchList : [{ id : String }],
    liked : [{ id : String }],
    disliked : [{ id : String }],
    playlists : [{
      name : String,
      videos : [{ id : String}]
    }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;