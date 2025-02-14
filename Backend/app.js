const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
const SONAR_TOKEN = process.env.SONAR_TOKEN;

// Import middleware
const { requestLogger, errorLogger, errorHandler, logger } = require("./middleware/logging");

// Import general routes
const generalRoutes = require('./routes/index');

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

// CORS middleware
app.use(cors({ origin: true, credentials: true }));

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use logging middleware
app.use(requestLogger);

// Use routes
app.use('/', generalRoutes); 
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