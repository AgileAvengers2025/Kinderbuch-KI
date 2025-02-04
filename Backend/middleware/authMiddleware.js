const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const authMiddleware = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token is required" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token is invalid" });
        }
        
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;
