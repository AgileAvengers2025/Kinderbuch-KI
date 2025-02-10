const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/User");
const authMiddleware = require("../../middleware/authMiddleware");
const { logger } = require("../../middleware/logging");

// Get all users
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const users = await User.find();
        logger.info(`Fetched all users - Count: ${users.length}`);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

// Get user by ID
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate("createdStories");

        if (!user) {
            logger.warn(`User with ID ${req.params.id} not found`);
            return res.status(404).json({ error: "User not found." });
        }

        logger.info(`Fetched user ${req.params.id} - ${user.email}`);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

// Create a new user
router.post("/", async (req, res, next) => {
    try {
        const { email, passwordHash, displayName, kidsNames } = req.body;

        if (!email || !passwordHash) {
            logger.warn("User creation failed - Missing fields");
            return res.status(400).json({ error: "Email and password are required." });
        }

        const sanitizedEmail = String(email).trim().toLowerCase();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(sanitizedEmail)) {
            logger.warn(`User creation failed - Invalid email format: ${sanitizedEmail}`);
            return res.status(400).json({ error: "Invalid email format." });
        }

        const existingUser = await User.findOne({ email: sanitizedEmail }).lean();
        if (existingUser) {
            logger.warn(`User creation failed - Email already exists: ${sanitizedEmail}`);
            return res.status(400).json({ error: "User already exists." });
        }

        const newUser = new User({
            email: sanitizedEmail,
            passwordHash: hashedPassword,
            displayName: displayName || "",
            kidsNames: kidsNames || [],
        });

        await newUser.save();

        logger.info(`New user created: ${sanitizedEmail}`);
        res.status(201).json(newUser);
    } catch (error) {
        logger.error(`User creation error: ${error.message}`);
        next(error);
    }
});

// Update user by ID
router.put("/:id", authMiddleware, async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedUser) {
            logger.warn(`User update failed - ID ${req.params.id} not found`);
            return res.status(404).json({ error: "User not found." });
        }

        logger.info(`User updated: ${req.params.id}`);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

// Delete user by ID
router.delete("/:id", authMiddleware, async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            logger.warn(`User deletion failed - ID ${req.params.id} not found`);
            return res.status(404).json({ error: "User not found." });
        }

        logger.info(`User deleted: ${req.params.id}`);
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        next(error);
    }
});

module.exports = router;