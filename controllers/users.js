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
  res.json({ message: "User test endpoint OK! ✅" });
  console.log("'/users/test' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
});

// POST /users/signup (Public) - create a user in the DB
router.post("/signup", async (req, res) => {
  // Check if email is already in the db
  await User.findOne({ email: req.body.email })
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
                console.log("New user sucessfully created", createdUser.firstName, createdUser.lastName, "with user id", createdUser.id);
                res.json({ userData: createdUser })
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
            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, async (err, token) => {
                if (err) {
                    res.status(400).json({ message: 'Session has ended, please log in again'});
                }
                const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
                const fullUserData = await User.findById(foundUser.id);
                res.json({ success: true, token: `Bearer ${token}`, userData: fullUserData, tokenExpiration: legit.exp });
                console.log("'/users/login' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
                console.log("User", foundUser.firstName, foundUser.lastName, "with user id", foundUser.id, "successfully logged in");
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
router.put("/", passport.authenticate('jwt', {session : false }), async (req, res) => {
  const decrytptedToken = jwt.verify(req.headers.authorization.split(" ")[1], JWT_SECRET);
  const id = decrytptedToken.id;
  const { firstName, lastName, userName, city, state, country, email, bio, profilePicture } = req.body;
  try {
    for (let key in req.body) {
      if (req.body[key] === "") {
        delete req.body[key];
      }
    }
    const oldUserData = await User.findById(id);
    for (let key in req.body) {
      oldUserData[key] = req.body[key];
    }
    await oldUserData.save();
    let userData = await User.findById(id);
    // send updated user back as json response
    res.json({ userData: userData, message: "User updated" });
    console.log("'/users/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
    console.log("User", userData.firstName, userData.lastName, "with user id", userData.id, "successfully updated");
  } catch (error) {
    console.log(error);
  }
});

// DELETE /users/:id (Private) - delete user from db
router.delete("/", passport.authenticate('jwt', { session : false }), async (req, res) => {
  const decrytptedToken = jwt.verify(req.headers.authorization.split(" ")[1], JWT_SECRET);
  const userEmail = decrytptedToken.email;
  // delete the user from the db and capture the deleted user in a variable
  const data = await User.findOneAndDelete({ email: userEmail });
  // if there is no user with the given id, return a 400 response
  if (!data) {
    return res.status(400).json({ message: "Your account can not be found." });
  } else {
    // if user is found, send a 200 response with a message
    res.status(200).json({ message: "You have successfully deleted your account" });
    console.log("'/users/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
    console.log("User", data.firstName, data.lastName, "with user id", data.id, "successfully deleted");
  }
});

// PUT /users/addToList/:listName/:id (Private) - add movie to user's list
router.put("/addToList/:listName/", passport.authenticate('jwt', { session : false }), async (req, res) => {
  // listName is the name of the list we want to add to (watched, watchList, etc.)
  // id is the user's id
  const { listName } = req.params;
  // movie is the movie object we want to add to the list
  const { movie } = req.body;
  const decrytptedToken = jwt.verify(req.headers.authorization.split(" ")[1], JWT_SECRET);
  const id = decrytptedToken.id;
  try {
      // Find user by id and push the movie object into the correct list array
      await User.findByIdAndUpdate(
          id,
          { $push: { [listName]: movie } },
          { new: true }
      );
      // check if list has same movie multiple times and remove duplicates
      const updatedUserData = await User.findById(id);
      const list = updatedUserData[listName];
      const uniqueList = list.filter((movie, index, self) => self.findIndex(m => m.id === movie.id) === index);
      updatedUserData[listName] = uniqueList;
      await updatedUserData.save();
      // send updated user back as json response and console log success message
      res.json({updatedUserData: updatedUserData, message: "Movie added to " + listName});
      console.log("'/users/addToList/:listName/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
      console.log("User", updatedUserData.id, "successfully added", movie.title, "to", listName);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating user's list" });
  }
});

// PUT /users/removeFromList/:listName/:id (Private) - remove movie from user's list
router.put("/removeFromList/:listName/", passport.authenticate('jwt', { session : false }), async (req, res) => {
  // listName is the name of the list we want to remove from (watched, watchList, etc.)
  // id is the user's id
  const { listName } = req.params;
  // movie is the movie object we want to remove from the list
  const { movie } = req.body;
  const decrytptedToken = jwt.verify(req.headers.authorization.split(" ")[1], JWT_SECRET);
  const id = decrytptedToken.id;
  try {
      // Find user by id and pull the movie object from the correct list array
      await User.findByIdAndUpdate(
          id,
          { $pull: { [listName]: { id: movie.id } } }, // Remove based on movie ID
          { new: true }
      );
      const updatedUserData = await User.findById(id);
      // send updated user back as json response and console log success message
      res.json({updatedUserData: updatedUserData, message: "Movie removed from " + listName});
      console.log("'/users/removeFromList/:listName/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
      console.log("User", updatedUserData.id, "successfully removed", movie.title, "from", listName);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating user's list" });
  }
});

// GET /users/refreshData/ (Private) - refresh user data. Used if token is valid but user data is missing
router.get("/refreshData", passport.authenticate('jwt', { session : false }), async (req, res) => {
    const decrytptedToken = jwt.verify(req.headers.authorization.split(" ")[1], JWT_SECRET);
    const userEmail = decrytptedToken.email;
    let data = await User.findOne({ email: userEmail });
    res.json({data: data, message : "User data refreshed"});
    console.log("'/users/refreshData' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
    console.log("User", data.firstName, data.lastName, "with user id", data.id, "successfully refreshed");
})
  
/// GET /users/updateTokenExpiration/ (Private) - update token expiration
router.get("/updateTokenExpiration", passport.authenticate('jwt', { session: false }), async (req, res) => {
  const decryptedToken = jwt.verify(req.headers.authorization.split(" ")[1], JWT_SECRET);
  const userEmail = decryptedToken.email;

  try {
    // Update the token expiration for the user
    await User.findOneAndUpdate(
      { email: userEmail },
      { tokenExpiration: Date.now() + 3600000 } // Set token expiration to 1 hour from now
    );

    // Create a new token payload containing id and email
    const payload = {
      id: decryptedToken.id,
      email: userEmail
    };

    // Create a new token with updated expiration time
    jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) {
        return res.status(400).json({ message: 'Session has ended, please log in again' });
      }
      const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
      res.json({ success: true, token: `Bearer ${token}`, loginData: legit, message: "Token expiration updated"});
      console.log( "'/users/updateTokenExpiration/:id' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
      console.log("User with email", userEmail, "successfully updated token expiration");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating token expiration" });
  }
});
router.post("/updateRecentSearches/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  const decryptedToken = jwt.verify(req.headers.authorization.split(" ")[1], JWT_SECRET);
  const id = decryptedToken.id;
  const { query } = req.body;
  // Find the user by id
  try {
    let updatedUserData = await User.findByIdAndUpdate(
      id,
    // Add the query to the beginning of the recentSearches array
      { $push: { recentSearches: { $each: [query], $position: 0 } } },
      { new: true } 
    );
    // Save the updated user data
    await updatedUserData.save();

    // Send updated user back as a JSON response and log a success message
    res.json({ updatedUserData, message: "Search query added to recent searches" });
    console.log("'/users/updateRecentSearches' route hit on", new Date().toDateString(), "at", new Date().toLocaleTimeString("en-US"));
    console.log("User", updatedUserData.id, "successfully added", query, "to recent searches");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user's recent searches" });
  }
});

// Exports
module.exports = router;
