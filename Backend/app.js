const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");

// Import middleware
const { requestLogger, errorLogger, errorHandler, logger } = require("./middleware/logging");
const authMiddleware = require("./middleware/authMiddleware");

// Import API routes
const userRoutes = require("./routes/api/users");
const storyRoutes = require("./routes/api/stories");
const contentRoutes = require("./routes/api/contents");
const promptRoutes = require("./routes/api/prompts");

const app = express();

const SECRET = process.env.SECRET;
const SONAR_TOKEN = process.env.SONAR_TOKEN;

const refreshTokens = new Set();

// Use Helmet for security
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

// CORS middleware
app.use(cors({ origin: true, credentials: true }));

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use logging middleware
app.use(requestLogger);

// Login route
app.post("/login", async (req, res, next) => {
    try {
        const { email, passwordHash } = req.body;

        if (!email || !passwordHash) {
            logger.error("Login failed - Missing email or password.");
            return res.status(400).json({ error: "Email and hashed password are required." });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            logger.error(`Login failed - Invalid email format: ${email}`);
            return res.status(400).json({ error: "Invalid email format." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            logger.error(`Login failed - User not found: ${email}`);
            return res.status(401).json({ error: "Invalid email or password." });
        }

        if (passwordHash !== user.passwordHash) {
            logger.error(`Login failed - Incorrect password for email: ${email}`);
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const payload = { id: user.id, name: user.displayName };
        const accessToken = jwt.sign(payload, SECRET, { expiresIn: "2h" });
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
app.post("/logout", (req, res, next) => {
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
app.post("/refresh-token", (req, res, next) => {
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

// Use API routes
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/contents", contentRoutes);
app.use("/api/prompts", promptRoutes);

// Connect Database
connectDB();

// Test Route
app.get("/", authMiddleware, (req, res, next) => {
    try {
        logger.info(`Protected route accessed by ${req.user.name}`);
        res.send(`Hello ${req.user.name}, welcome to the protected route!`);
    } catch (error) {
        next(error);
    }
});

// Use error logging/handling middleware
app.use(errorLogger); // Log errors
app.use(errorHandler); // Handle errors

const port = process.env.PORT || 8082;
app.listen(port, () => logger.info(`Server running on port ${port}`));

module.exports = logger;