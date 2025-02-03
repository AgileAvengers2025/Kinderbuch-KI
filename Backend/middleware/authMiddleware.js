const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const authMiddleware = (req, res, next) => {
    // Get token from cookie
    const token = req.cookies.refreshToken;

    // If no token is found, respond with an error
    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }

    // Verify the token
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token is invalid" });
        }
        
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;
