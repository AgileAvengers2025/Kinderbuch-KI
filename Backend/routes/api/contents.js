const express = require("express");
const router = express.Router();
const Prompt = require("../../models/Prompt");
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const authMiddleware = require("../../middleware/authMiddleware");

// AWS Bedrock client config
const bedrockClient = new BedrockRuntimeClient({
    region: "eu-central-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Test route
router.get("/", authMiddleware, (req, res) => {
    res.send(`Hello, this is the /api/contents/ route for ${req.user.name}`);
});

// Example route to generate text
router.post("/generate", authMiddleware, async (req, res, next) => {
    try {
        const { title } = req.body;

        const addTextBefore = "Before the prompt text";
        const addTextAfter = "After the prompt text";

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        title = title.trim();
        
        // Fetch prompt from the database using the title
        const promptData = await Prompt.findOne({ title });

        if (!promptData) {
            return res.status(404).json({ error: "Prompt not found" });
        }

        const { prompt, scene } = promptData;

        // Base text that applies to all prompts
        let finalPrompt = `${addTextBefore || ""} ${prompt} ${addTextAfter || ""}`.trim();

        // Add extra text only if scene === "1"
        if (scene === "1") {
            finalPrompt += " This is an additional instruction for scene 1.";
        }

        const model = modelId || "anthropic.claude-v2"; // Default model

        const command = new InvokeModelCommand({
            modelId: model,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                prompt: finalPrompt,
                max_tokens: 200,
            }),
        });

        const response = await bedrockClient.send(command);
        const responseData = JSON.parse(new TextDecoder().decode(response.body));

        res.json({ response: responseData });
    } catch (error) {
        next(error);
    }
});

module.exports = router;