const express = require('express');
const router = express.Router();
const { faker } = require('@faker-js/faker');
const User = require('../models/User');

// Create a new user with fake data
router.post('/signup', async (req, res) => {
    try {
        const newUser = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            userName: faker.internet.userName(),
            city: faker.address.city(),
            state: faker.address.state(),
            country: faker.address.country(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            bio: faker.lorem.sentence(),
            profilePicture: faker.image.avatar(),
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
