const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const { logger } = require("../middleware/logging");
const User = require("../models/User");

require("dotenv").config();
const SECRET = process.env.SECRET;

const refreshTokens = new Set();

// Test Route
router.get("/", authMiddleware, (req, res, next) => {
    try {
        logger.info(`Protected route accessed by ${req.user.name}`);
        res.send(`Hello ${req.user.name}, welcome to the protected route!`);
    } catch (error) {
        next(error);
    }
});

// Login route
router.post("/login", async (req, res, next) => {
    try {
        const { email, passwordHash } = req.body;

        if (!email || !passwordHash) {
            logger.error("Login failed - Missing email or password.");
            return res.status(400).json({ error: "Email and hashed password are required." });
        }

        const sanitizedEmail = String(email).trim().toLowerCase();

        // Regex to check that input is an email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(sanitizedEmail)) {
            logger.error(`Login failed - Invalid email format: ${sanitizedEmail}`);
            return res.status(400).json({ error: "Invalid email format." });
        }

        const user = await User.findOne({ email: sanitizedEmail }).lean();
        if (!user) {
            logger.error(`Login failed - User not found: ${sanitizedEmail}`);
            return res.status(401).json({ error: "Invalid email or password." });
        }

        if (passwordHash !== user.passwordHash) {
            logger.error(`Login failed - Incorrect password for email: ${email}`);
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const payload = { id: user.id, name: user.displayName };
        const accessToken = jwt.sign(payload, SECRET, { expiresIn: "8h" });
        const refreshToken = jwt.sign(payload, SECRET, { expiresIn: "7d" });

        refreshTokens.add(refreshToken);
        logger.info(`User ${user.displayName} logged in`);

        res.json({ accessToken, refreshToken });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        next(error);
    }
});

// Logout route
router.post("/logout", (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken || !refreshTokens.has(refreshToken)) {
            throw new Error("Invalid refresh token");
        }

        refreshTokens.delete(refreshToken);
        logger.info("User logged out");
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
});

// Refresh token route
router.post("/refresh-token", (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken || !refreshTokens.has(refreshToken)) {
            logger.warn("Invalid refresh token attempt");
            throw new Error("Invalid refresh token");
        }

        jwt.verify(refreshToken, SECRET, (err, decoded) => {
            if (err) {
                logger.error("Invalid refresh token verification failed");
                throw new Error("Invalid refresh token");
            }

            const newAccessToken = jwt.sign({ id: decoded.id, name: decoded.name }, SECRET, { expiresIn: "15m" });
            logger.info(`New access token issued for user ${decoded.name}`);
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;