const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../../middleware/authMiddleware");
const { logger } = require("../../middleware/logging");
const Story = require("../../models/Story");
const User = require("../../models/User");

// Get all stories
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const stories = await Story.find();
        logger.info(`Fetched all stories - Count: ${stories.length}`);
        res.status(200).json(stories);
    } catch (error) {
        next(error); // Pass error to centralized error handler
    }
});

// Get a single story by ID
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            logger.warn(`Story with ID ${req.params.id} not found`);
            return res.status(404).json({ error: "Story not found." });
        }

        logger.info(`Fetched story ${req.params.id} - Title: ${story.title}`);
        res.status(200).json(story);
    } catch (error) {
        next(error);
    }
});

// Create a new story
router.post("/", authMiddleware, async (req, res, next) => {
    try {
        const { title, content } = req.body;

        if (!title || !content || !Array.isArray(content)) {
            logger.warn(`Story creation failed - Invalid input from user ${req.user.id}`);
            return res.status(400).json({ error: "Title and valid content are required." });
        }

        const newStory = new Story({
            id: new mongoose.Types.ObjectId().toString(), // Generate unique ID
            userId: req.user.id,
            title,
            content,
        });

        await newStory.save();

        await User.findByIdAndUpdate(req.user.id, {
            $push: { createdStories: new mongoose.Types.ObjectId(newStory._id) },
        });

        logger.info(`New story created: ${newStory.title} by user ${req.user.id}`);
        res.status(201).json(newStory);
    } catch (error) {
        next(error);
    }
});

// Update a story by ID (only owner can update)
router.put("/:id", authMiddleware, async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            logger.warn(`Story update failed - ID ${req.params.id} not found`);
            return res.status(404).json({ error: "Story not found." });
        }

        if (story.userId.toString() !== req.user.id) {
            logger.warn(`Unauthorized update attempt by user ${req.user.id} on story ${req.params.id}`);
            return res.status(403).json({ error: "Unauthorized to update this story." });
        }

        const updatedStory = await Story.findByIdAndUpdate(
            req.params.id,
            { $set: req.body, updatedAt: Date.now() },
            { new: true }
        );

        logger.info(`Story updated: ${req.params.id} by user ${req.user.id}`);
        res.status(200).json(updatedStory);
    } catch (error) {
        next(error);
    }
});

// Delete a story by ID (only owner can delete)
router.delete("/:id", authMiddleware, async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            logger.warn(`Story deletion failed - ID ${req.params.id} not found`);
            return res.status(404).json({ error: "Story not found." });
        }

        if (story.userId.toString() !== req.user.id) {
            logger.warn(`Unauthorized delete attempt by user ${req.user.id} on story ${req.params.id}`);
            return res.status(403).json({ error: "Unauthorized to delete this story." });
        }

        await Story.findByIdAndDelete(req.params.id);

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { createdStories: req.params.id },
        });

        logger.info(`Story deleted: ${req.params.id} by user ${req.user.id}`);
        res.status(200).json({ message: "Story deleted successfully." });
    } catch (error) {
        next(error);
    }
});

module.exports = router;