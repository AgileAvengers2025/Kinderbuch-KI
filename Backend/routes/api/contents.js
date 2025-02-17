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

router.post("/generate", authMiddleware, async (req, res, next) => {
    try {
        let { scene1, scene2, scene3, scene4 } = req.body;

        // Check for required scenes
        if (!scene1 || !scene2 || !scene3 || !scene4) {
            return res.status(400).json({ error: "All scenes are required" });
        }

        // Trim scene values to remove extra spaces
        scene1 = scene1.trim();
        scene2 = scene2.trim();
        scene3 = scene3.trim();
        scene4 = scene4.trim();

        // Constructing the prompt for text generation
        let additionalInstructions = " ";

        // Scene 1: Starting the story
        additionalInstructions += `
        Du wirst eine fortlaufende Kindergeschichte in vier Teilen erstellen. 
        Jeder Abschnitt soll detailreich, lebendig und kindgerecht sein. 

        **Vorgaben für jeden Teil:**
        - Nutze das Maximum an Zeichen für eine spannende Handlung.
        - Verwende einfache, altersgerechte Sprache mit fantasievollen Beschreibungen.
        - Jeder Abschnitt soll eine abgeschlossene Mini-Handlung haben, aber die Gesamtgeschichte fortführen.
        - Stelle sicher, dass die Geschichte am Ende eine logische und zufriedenstellende Auflösung hat.
        - Antwort ohne Meta-Beschreibungen oder Erklärungen. Nur die Geschichte selbst.
        `;

        // Adding each scene as part of the prompt
        additionalInstructions += `
        **Szene 1:**
        "${scene1}"

        **Szene 2:**
        "${scene2}"

        **Szene 3:**
        "${scene3}"

        **Szene 4:**
        "${scene4}"
        `;

        // Final prompt with additional instructions
        let finalPrompt = `
        **Wichtige Anweisungen:**  
        - Schreibe die Fortsetzung der Geschichte mit einem **positiven**, **hoffnungsvollen** oder **abenteuerlichen** Ton.  
        - Vermeide düstere, tragische Wendungen. Stattdessen fokussiere dich auf den **Überlebenswillen**, **Zusammenhalt** oder **Magie**.  
        - **Maximal 300 Wörter** und keine Wiederholungen aus der vorherigen Geschichte.   
        - Die Geschichte soll einen **magischen** oder **hoffnungsvollen** Abschluss finden, der den Leser ermutigt.  

        **Deine Aufgabe:**  
        Schreibe eine Fortsetzung, in der die Charaktere **trotz der Herausforderungen** Hoffnung finden oder **eine unerwartete Hilfe** bekommen. Die Fortsetzung sollte kreative Lösungen, magische Ereignisse oder kleine Freuden im Chaos zeigen. Achte darauf, dass die Atmosphäre positiv und hoffnungsvoll bleibt. 
        Schreibe ohne Meta-Beschreibungen. Keine Überschrift wie 'Fortsetzung'. Beginne direkt mit der Geschichte.
        `.trim();

        // Set model for Amazon Titan Text
        const model = "amazon.titan-text-express-v1";

        const command = new InvokeModelCommand({
            modelId: model,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                inputText: finalPrompt,
                textGenerationConfig: {
                    maxTokenCount: 500,
                    temperature: 0.9,
                    topP: 0.9,
                }
            })
        });

        const response = await bedrockClient.send(command);

        // Correctly decode response
        const responseData = JSON.parse(new TextDecoder().decode(response.body));

        // Extract generated text (Titan returns results[0].outputText)
        const resultText = responseData.results?.[0]?.outputText?.trim().replace(/^\n+/, '') || "No response generated";

        res.json({ response: resultText });
    } catch (error) {
        next(error);
    }
});

module.exports = router;