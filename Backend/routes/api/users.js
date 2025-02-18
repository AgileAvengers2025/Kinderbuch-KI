const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const authMiddleware = require("../../middleware/authMiddleware");
const { logger } = require("../../middleware/logging");
const { ACCESS_TOKEN_SECRET } = process.env;

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
        const { email, password, displayName, kidsNames } = req.body;  // Accept password (not passwordHash) from frontend

        if (!email || !password) {
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

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password with 10 rounds of salt

        const newUser = new User({
            email: sanitizedEmail,
            passwordHash: hashedPassword,  // Save the hashed password
            displayName: displayName || "",
            kidsNames: kidsNames || [],
        });

        await newUser.save();

        logger.info(`New user created: ${sanitizedEmail}`);

        // Generate access token after successful user creation
        const payload = { id: newUser._id, name: newUser.displayName };
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.status(201).json({
            message: "User registered successfully",
            accessToken,
            user: newUser,  // Optionally, you can return the user as well
        });
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