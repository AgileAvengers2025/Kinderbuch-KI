const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authMiddleware = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const BEARER_PREFIX = "Bearer ";

    if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Extract the token (after "Bearer ")
    const token = authHeader.substring(BEARER_PREFIX.length);

    jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden - Invalid or expired token" });
        }

        // Attach the decoded payload to req.user
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;