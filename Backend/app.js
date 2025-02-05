const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db");
const userRoutes = require("./routes/api/users");
const storyRoutes = require("./routes/api/stories");
const contentRoutes = require("./routes/api/contents");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Import middleware
const { requestLogger, errorLogger, logger } = require("./middleware/logging");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

const SECRET = process.env.SECRET;

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

const refreshTokens = new Set();

// Login route
app.post("/login", (req, res) => {
    const user = { id: 1, name: "Frontend" };
    const accessToken = jwt.sign(user, SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(user, SECRET, { expiresIn: "7d" });

    refreshTokens.add(refreshToken);
    logger.info(`User ${user.name} logged in`); // Log login event

    res.json({ accessToken, refreshToken });
});

// Logout route
app.post("/logout", (req, res) => {
    const { refreshToken } = req.body;
    refreshTokens.delete(refreshToken);
    logger.info("User logged out");
    res.json({ message: "Logged out successfully" });
});

// Refresh token route
app.post("/refresh-token", (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken || !refreshTokens.has(refreshToken)) {
        logger.warn("Invalid refresh token attempt");
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(refreshToken, SECRET, (err, decoded) => {
        if (err) {
            logger.error("Invalid refresh token verification failed");
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign({ id: decoded.id, name: decoded.name }, SECRET, { expiresIn: "15m" });
        logger.info(`New access token issued for user ${decoded.name}`);
        res.json({ accessToken: newAccessToken });
    });
});

// Use API routes
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/contents", contentRoutes);

// Connect Database
connectDB();

// Test Route
app.get("/", authMiddleware, (req, res) => {
    logger.info(`Protected route accessed by ${req.user.name}`);
    res.send(`Hello ${req.user.name}, welcome to the protected route!`);
});

// Use error logging middleware
app.use(errorLogger); // Log errors

const port = process.env.PORT || 8082;
app.listen(port, () => logger.info(`Server running on port ${port}`));

module.exports = logger; // Export logger for use in other files