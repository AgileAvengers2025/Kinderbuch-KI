const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

// Test route
router.get("/", authMiddleware, (req, res) => {
    res.send(`Hello, this is the /api/stories/ route for ${req.user.name}`);
});

module.exports = router;
