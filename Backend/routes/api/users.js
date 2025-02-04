const express = require("express");
const router = express.Router();

const User = require('../../models/User');
const authMiddleware = require("../../middleware/authMiddleware");

// Test route
router.get("/", authMiddleware, (req, res) => {
    res.send(`Hello, this is the /api/users/ route for ${req.user.name}`);
});

// Get all users
router.get("/", authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching users." });
    }
});

// Get user by ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("createdStories");
        if (!user) return res.status(404).json({ error: "User not found." });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching the user." });
    }
});

// Create a new user
router.post("/", async (req, res) => {
    try {
        const { email, passwordHash, displayName, kidsNames } = req.body;

        if (!email || !passwordHash) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        const newUser = new User({
            email,
            passwordHash,
            displayName,
            kidsNames,
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Server error while creating the user." });
    }
});

// Update user by ID
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Server error while updating the user." });
    }
});

// Delete user by ID
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Server error while deleting the user." });
    }
});

module.exports = router;