const express = require("express");
const router = express.Router();
const Prompt = require("../../models/Prompt");
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const authMiddleware = require("../../middleware/authMiddleware");

require("dotenv").config();

// AWS Bedrock client config
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        // sessionToken: process.env.AWS_SESSION_TOKEN,
    },
});

// Test route
router.get("/", authMiddleware, (req, res) => {
    res.send(`Hello, this is the /api/contents/ route for ${req.user.name}`);
});

// Example route to generate text
router.post("/generate", authMiddleware, async (req, res, next) => {
    try {
        let { title } = req.body;

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

        // Base text
        let finalPrompt = `Before the prompt text. ${prompt} After the prompt text.`.trim();

        // Extra instruction for scene 1
        if (scene === "1") {
            finalPrompt += " ";
        }

        // Set model for Amazon Titan Text
        const model = "amazon.titan-text-express-v1";

        const command = new InvokeModelCommand({
            modelId: model,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({ inputText: finalPrompt }),
        });

        const response = await bedrockClient.send(command);

        // Correctly decode response
        const responseData = JSON.parse(new TextDecoder().decode(response.body));

        // Extract generated text (Titan returns results[0].outputText)
        const resultText = responseData.results?.[0]?.outputText || "No response generated";

        res.json({ response: resultText });
    } catch (error) {
        next(error);
    }
});

module.exports = router;