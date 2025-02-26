const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const SONAR_TOKEN = process.env.SONAR_TOKEN;

// Import middleware
const {
  requestLogger,
  errorLogger,
  errorHandler,
  logger,
} = require("./middleware/logging");

// Import general routes
const generalRoutes = require("./routes/index");

// Import API routes
const userRoutes = require("./routes/api/users");
const storyRoutes = require("./routes/api/stories");
const contentRoutes = require("./routes/api/contents");
const promptRoutes = require("./routes/api/prompts");

const app = express();

// Use Helmet for security
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS middleware - allow all origins (use only in development)
app.use(
  cors({
    origin: "*", //CHANGE THIS IN THE FUTURE
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Express internal parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// Use logging middleware
app.use(requestLogger);

// Use routes
app.use("/", generalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/contents", contentRoutes);
app.use("/api/prompts", promptRoutes);

// Connect Database
connectDB();

// Use error logging/handling middleware
app.use(errorLogger); // Log errors
app.use(errorHandler); // Handle errors

const port = process.env.PORT || 8082;
app.listen(port, () => logger.info(`Server running on port ${port}`));

module.exports = logger;
