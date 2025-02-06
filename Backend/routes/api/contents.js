const express = require("express");
const router = express.Router();
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
        const { prompt, modelId, addTextBefore, addTextAfter } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const model = modelId || "anthropic.claude-v2"; // Default model

        // Construct the prompt
        let finalPrompt = `${addTextBefore || ""} ${prompt} ${addTextAfter || ""}`.trim();

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