const Prompt = require("./models/promptModel");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

// Prompt Data
const PromptData = {
 
  prompts: [
    {
      title: "Lina im Dorf",
      prompt:
        "A little girl with brown hair and a lantern standing at the edge of a small village...",
    },
    {
      title: "Der leuchtende Sternenjunge Lumo",
      prompt:
        "A glowing, small star boy with a bright, shimmering body sitting on a forest clearing...",
    },
    {
      title: "Die alte Eiche",
      prompt:
        "An ancient, towering oak tree whose top reaches the stars...",
    },
    {
      title: "Lina mit dem Sternen-Amulett",
      prompt:
        "A little girl lying in bed, holding a glowing star-shaped amulet around her neck...",
    },
  ],
};

router.get("/", authMiddleware, (req, res) => {
    
});

// Function to Save the Story
const saveStory = async () => {
  await connectDB();
  
  try {
    const newStory = new Story(promptData);
    await newStory.save();
    console.log("Story saved successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error saving story:", err);
  }
};

// Run the function
saveStory();
module.exports = router;