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

        // Base instructions (always included)
        let additionalInstructions = " ";

        // Extra instruction for scene 1 - NOW ADDED BEFORE the old text
        if (scene === "1") {
            additionalInstructions += `
            Du erhältst insgesamt vier Prompts. Aus jedem einzelnen Prompt sollst du eine Teilgeschichte generieren. 
            Diese Teilgeschichten müssen am Ende logisch zusammenhängen und gemeinsam eine kindgerechte, spannende und fantasievolle Story ergeben.
            
            Wichtige Vorgaben:
            1. Jede Teilgeschichte soll das Maximum an Zeichen nutzen, um die Handlung detailreich und lebendig zu gestalten.
            2. Die Sprache soll altersgerecht, leicht verständlich und unterhaltsam sein, damit Kinder Spaß am Lesen haben.
            3. Achte darauf, dass jede Teilgeschichte einen klaren Handlungsbogen hat, aber offen genug bleibt, damit die nächste Teilgeschichte nahtlos anschließen kann.
            4. Am Ende soll die gesamte Story einen logischen Abschluss finden. Bitte bestätige, dass du diese Struktur verstanden hast. Danach folgt der erste Teil der Geschichte.
            `;
        }
        
        // Final prompt: Additional instructions come FIRST
        let finalPrompt = `${additionalInstructions} ${prompt} 
        Schreibe eine kurze Geschichte mit maximal 300 Wörtern auf Deutsch. 
        Achte darauf, dass alle Sätze vollständig sind. 
        Vermeide es, mitten in einem Satz oder Dialog aufzuhören.`.trim();

        // Set model for Amazon Titan Text
        const model = "amazon.titan-text-express-v1";

        const command = new InvokeModelCommand({
            modelId: model,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                inputText: finalPrompt,
                textGenerationConfig: {
                    maxTokenCount: 300,
                    temperature: 0.9,
                    topP: 0.9,
                }
            })
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