const Prompt = require("../../models/Prompt");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const { logger } = require("../../middleware/logging");
const { ThrottlingException } = require("@aws-sdk/client-bedrock-runtime");

// Prompt Data
// const PromptData = {
 
//   prompts: [
//     {
//       title: "Lina im Dorf",
//       prompt:
//         "A little girl with brown hair and a lantern standing at the edge of a small village...",
//     },
//     {
//       title: "Der leuchtende Sternenjunge Lumo",
//       prompt:
//         "A glowing, small star boy with a bright, shimmering body sitting on a forest clearing...",
//     },
//     {
//       title: "Die alte Eiche",
//       prompt:
//         "An ancient, towering oak tree whose top reaches the stars...",
//     },
//     {
//       title: "Lina mit dem Sternen-Amulett",
//       prompt:
//         "A little girl lying in bed, holding a glowing star-shaped amulet around her neck...",
//     },
//   ],
// };

router.post("/testdata", authMiddleware, async (req, res) =>
{
    try {
        const { id, title, prompt, scene } = req.body;
    
        // Check if all required fields are provided
        if (!id || !title || !prompt || !scene) {
        return res.status(400).json({ error: "All fields are required." });
        }
    
        // Create a new prompt document
        const newPrompt = new Prompt({
        id,
        title,
        prompt,
        scene,
        });

        const savedPrompt = await newPrompt.save();
        res.status(201).json(savedPrompt);
        } catch (error) {
        console.error("Error saving prompt:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    

// GET all prompts
router.get("/", authMiddleware, async (req, res) => {
    try {
            const prompts = await Prompt.find();
            logger.info(`Fetched all prompts - Count: ${prompts.length}`);
            res.status(200).json(prompts);
        } catch (error) {
            next(error); // Pass error to centralized error handler
        }
  });
  
  // GET a single prompt by ID
  router.get("/:id", authMiddleware, async (req, res) => {
    try {
      const prompt = await Prompt.findById(req.params.id);
      if (!prompt) 
        {   
            loggar.warn(`Prompt with ID ${req.params.id} not found`);
            return res.status(404).json({ message: "Prompt not found" });
        }
        then(res.status(200).json(prompt),
        logger.info(`Fetched prompt ${req.params.id} - Title: ${prompt.title}`),
        res.json(prompt));
    } 
    catch (error) {
        next(error);
    }
  });

  

module.exports = router;