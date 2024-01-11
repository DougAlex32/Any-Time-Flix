// Imports
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { JWT_SECRET } = process.env;

// DB Models
const User = require("../models/user");

// GET /users/test (Public) - test route
router.get("/test", (req, res) => {
  // returns a message if the endpoint is working
  res.json({ message: "User endpoint OK! ✅" });
  console.log("'/users/test' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
});

// POST /users/signup (Public) - create a user in the DB
router.post("/signup", (req, res) => {
  // Check if email is already in the db
  User.findOne({ email: req.body.email })
    .then((user) => {
      // if email already exists, a user will come back
      if (user) {
        // send a 400 response
        return res.status(400).json({ message: "Email already exists" });
      } else {
        // Create a new user
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          email: req.body.email,
          password: req.body.password,
          bio: req.body.bio,
          profilePicture: req.body.profilePicture,
          ratings: [],
          watched: [],
          watchList: [],
          liked: [],
          disliked: [],
          playlists: [],
        });
        // Salt and hash the password - before saving the user
        bcrypt.genSalt(10, (err, salt) => {
          // if err, send err in json response
          if (err) throw Error;
          // if no error, proceed to hash the password
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            // if err, send err in json response
            if (err) console.log("==> Error inside of hash", err);
            // Change the password in newUser to the hash
            newUser.password = hash;
            // Save the user with the hashed password instead of plain text password
            newUser
              .save()
              // send the saved user in the response to be used by the next then block
              .then((createdUser) => {
                console.log("'/users/signup' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
                console.log("New user sucessfully created", createdUser.firstName, createdUser.lastName, "with user id", createdUser._id);
                res.json({ user: createdUser })
              })
              .catch((err) => {
                console.log("error with creating new user", err);
                res.json({ message: "Error occured... Please try again." });
              });
          });
        });
      }
    })
    .catch((err) => {
      console.log("Error finding user", err);
      res.json({ message: "Error occured... Please try again." });
    });
});

// POST /users/login (Public) - authenticate user, check password, return JWT
router.post('/login', async (req, res) => {
    // Find user by email in the db
    const foundUser = await User.findOne({ email: req.body.email });
    // If user exists in the db
    if (foundUser) {
      // Compare the submitted password with the password in the db      
      let isMatch = await bcrypt.compare(req.body.password, foundUser.password);
      // If password is a match, create a token and send to the client.
      if (isMatch) {
            // Create a token payload containing id and email
            const payload = {
                id: foundUser.id,
                email: foundUser.email
            }
            // Set token expiration to 1 hour and return token to the client
            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    res.status(400).json({ message: 'Session has ended, please log in again'});
                }
                const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
                console.log("token", token, "legit", legit, "user", foundUser);
                res.json({ success: true, token: `Bearer ${token}`, loginData: legit, userData: foundUser});
                console.log("'/users/login' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
                console.log("User", foundUser.firstName, foundUser.lastName, "with user id", foundUser._id, "successfully logged in");
            });
        } else {
            // If password is not a match, send a 400 response with the message
            return res.status(400).json({ message: 'Incorrect Password' });
    }
  } else {
    // If user with given Email does not exist, send a 400 response with the message
    return res.status(400).json({ message: "User not found" });
  }
});

// PUT /users/:id (Private) - update user info based on request body
router.put("/:id", async (req, res) => {
  // set id to the id in the params
  const { id } = req.params;
  // destructure the rest of the properties out of the request body
  const {
    firstName,
    lastName,
    userName,
    city,
    state,
    country,
    email,
    bio,
    profilePicture,
  } = req.body;
  try {
    // find user by id and update the properties
    let updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        userName,
        city,
        state,
        country,
        email,
        bio,
        profilePicture,
      },
      { new: true }
    );
    // send updated user back as json response
    res.json(updatedUser);
    console.log("'/users/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
    console.log("User", updatedUser.firstName, updatedUser.lastName, "with user id", updatedUser._id, "successfully updated");
  } catch (error) {
    console.log(error);
  }
});

// DELETE /users/:id (Private) - delete user from db
router.delete("/:id", async (req, res) => {
  // find the user by their ID from the request params
  const { id } = req.params;
  // delete the user from the db and capture the deleted user in a variable
  let deletedUser = await User.findByIdAndDelete(id);
  // if there is no user with the given id, return a 400 response
  if (!deletedUser) {
    return res.status(400).json({ message: "No user with that id" });
  } else {
    // if user is found, send a 200 response with a message
    res.status(200).json({ message: "Successfully deleted user" });
    console.log("'/users/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
    console.log("User", deletedUser.firstName, deletedUser.lastName, "with user id", deletedUser._id, "successfully deleted");
  }
});

// PUT /users/addToList/:listName/:id (Private) - add movie to user's list
router.put("/addToList/:listName/:id", async (req, res) => {
  // listName is the name of the list we want to add to (watched, watchList, etc.)
  // id is the user's id
  const { listName, id } = req.params;
  // movie is the movie object we want to add to the list
  const { movie } = req.body;
  try {
      // Find user by id and push the movie object into the correct list array
      let updatedUser = await User.findByIdAndUpdate(
          id,
          { $push: { [listName]: movie } },
          { new: true }
      );
      // Send updated user back as json response
      res.json(updatedUser);
      console.log("'/users/addToList/:listName/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
      console.log("User", updatedUser.firstName, updatedUser.lastName, "with user id", updatedUser._id, "successfully updated", listName, "list");
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating user's list" });
  }
});

// PUT /users/removeFromList/:listName/:id (Private) - remove movie from user's list
router.put("/removeFromList/:listName/:id", async (req, res) => {
  // listName is the name of the list we want to remove from (watched, watchList, etc.)
  // id is the user's id
  const { listName, id } = req.params;
  // movie is the movie object we want to remove from the list
  const { movie } = req.body;

  try {
      // Find user by id and pull the movie object from the correct list array
      let updatedUser = await User.findByIdAndUpdate(
          id,
          { $pull: { [listName]: { id: movie.id } } }, // Remove based on movie ID
          { new: true }
      );
      // Send updated user back as json response
      res.json(updatedUser);
      console.log("'/users/removeFromList/:listName/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
      console.log("User", updatedUser.firstName, updatedUser.lastName, "with user id", updatedUser._id, "successfully updated", listName, "list");
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating user's list" });
  }
});

// GET /users/refreshData/:id (Private) - refresh user data
router.get("/refreshData/:email", async (req, res) => {
  const { email } = req.params;
    let updatedUser = await User.findOne({ email: email });
    res.json(updatedUser);
    console.log("'/users/refreshData/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
})
  

// GET /users/updateTokenExpiration/:id (Private) - update token expiration
router.get("/updateTokenExpiration/:id", async (req, res) => {
  // id is the user's id
  const { id } = req.params;
  try {
      // Find user by id
      let updatedUser = await User.findById(id);
      // Create a token payload containing id and email
      const payload = {
          id: updatedUser.id,
          email: updatedUser.email
      }
      // Set token expiration to 1 hour and return token to the client
      jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
          if (err) {
              res.status(400).json({ message: 'Session has ended, please log in again'});
          }
          const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
          console.log("token", token, "legit", legit, "user", updatedUser);
          res.json({ success: true, token: `Bearer ${token}`, loginData: legit, userData: updatedUser});
          console.log("'/users/updateTokenExpiration/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
          console.log("User", updatedUser.firstName, updatedUser.lastName, "with user id", updatedUser._id, "successfully updated token expiration");
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating user's data" });
  }
});

// Exports
module.exports = router;
