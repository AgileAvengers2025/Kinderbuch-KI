const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/api/users");
const storyRoutes = require("./routes/api/stories");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

require("dotenv").config();

const app = express();

const SECRET = process.env.SECRET;

// Cors middleware with origin and credentials
app.use(cors({ origin: true, credentials: true }));

// Body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing cookies
app.use(cookieParser());

// Login route
app.post("/login", (req, res) => {
    const user = { id: 1, name: "Frontend" };
    const accessToken = jwt.sign(user, SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(user, SECRET, { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.json({ accessToken });
});

// Refresh token route
app.post("/refresh-token", (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign({ id: decoded.id, name: decoded.name }, SECRET, { expiresIn: "1h" });

        res.json({ accessToken: newAccessToken });
    });
});

// Logout route
app.post("/logout", (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
});

// Use the routes module as a middleware
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);

// Connect Database
connectDB();

// Test Route
app.get("/", authMiddleware, (req, res) => {
    res.send(`Hello ${req.user.name}, welcome to the protected route!`);
});

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));