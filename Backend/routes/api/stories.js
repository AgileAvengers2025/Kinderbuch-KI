const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

// Test route
router.get("/", authMiddleware, (req, res) => {
    res.send(`Hello, this is the /api/stories/ route for ${req.user.name}`);
});

// Get all stories
router.get("/", authMiddleware, async (req, res) => {
    try {
        const stories = await Story.find();
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching stories." });
    }
});

// Get a single story by ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ error: "Story not found." });

        res.status(200).json(story);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching the story." });
    }
});

// Create a new story
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content || !Array.isArray(content)) {
            return res.status(400).json({ error: "Title and valid content are required." });
        }

        const newStory = new Story({
            userId: req.user.id, // Assign story to logged-in user
            title,
            content,
        });

        await newStory.save();

        // Add story to user's createdStories list
        await User.findByIdAndUpdate(req.user.id, {
            $push: { createdStories: newStory._id },
        });

        res.status(201).json(newStory);
    } catch (error) {
        res.status(500).json({ error: "Server error while creating the story." });
    }
});

// Update a story by ID (only owner can update)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ error: "Story not found." });

        // Check if logged-in user owns the story
        if (story.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to update this story." });
        }

        const updatedStory = await Story.findByIdAndUpdate(
            req.params.id,
            { $set: req.body, updatedAt: Date.now() },
            { new: true }
        );

        res.status(200).json(updatedStory);
    } catch (error) {
        res.status(500).json({ error: "Server error while updating the story." });
    }
});

// Delete a story by ID (only owner can delete)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ error: "Story not found." });

        // Check if logged-in user owns the story
        if (story.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to delete this story." });
        }

        await Story.findByIdAndDelete(req.params.id);

        // Remove story from user's createdStories list
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { createdStories: req.params.id },
        });

        res.status(200).json({ message: "Story deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Server error while deleting the story." });
    }
});

module.exports = router;
