const express = require('express');
const router = express.Router();
// const { faker } = require('@faker-js/faker');
const User = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const users =   {users: [
            {
            _id: "5f9d88b18d6b1e0017b6d9b1",
            firstName: "Shawn",
            lastName: "Spencer",
            jobTitle: "Psychic Detective",
            email: "sspencer@email.com",
            },
            {
            _id: "5f9d88b18d6b1e0017b6d9b2",
            firstName: "Burton",
            lastName: "Guster",
            jobTitle: "Pharmaceutical Sales Representative",
            email: "bguster@email.com",
            },
            {
            _id: "5f9d88b18d6b1e0017b6d9b3",
            firstName: "Carlton",
            lastName: "Lassiter",
            jobTitle: "Head Detective",
            email: "classiter@email.com",
            }
        ]
    }
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new user with fake data
router.post('/signup', async (req, res) => {
    try {
        console.log(req.body);

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
            watched : [],
            watchList : [],
            liked : [],
            disliked : [],
            playlists : [],
        
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a user by ID
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update user information by ID
router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUserData = req.body; // Assuming the request body contains updated user data

        const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
            new: true, // Return the updated user data
        });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a user by ID
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
