const express = require("express");
const router = express.Router();

const User = require('../../models/User');
const authMiddleware = require("../../middleware/authMiddleware");

// Test route
router.get("/", authMiddleware, (req, res) => {
    res.send(`Hello, this is the /api/users/ route for ${req.user.name}`);
});

module.exports = router;