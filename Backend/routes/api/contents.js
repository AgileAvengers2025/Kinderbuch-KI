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
        let { title, beforeOutput } = req.body;

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

        // Constructing the prompt for text generation
        let additionalInstructions = " ";

        // Scene 1: Starting the story
        if (scene === "1") {
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

            additionalInstructions += `
            **Inspiration für die erste Szene:**  
            "${prompt}"
            `;
        }

        // Scene > 1: Continuation of the story
        if (scene > 1) {
            additionalInstructions += `
            Dies ist eine Fortsetzung der Geschichte. **Achte auf den bisherigen Verlauf und den Erzählstil.**  
            **Vorgaben für den nächsten Abschnitt:**  
            - Die Handlung soll **nahtlos** an die vorherige Ausgabe anschließen.  
            - **Keine Wiederholungen** von ganzen Sätzen oder Dialogen aus vorherigen Teilen.  
            - Antwort ohne Meta-Beschreibungen oder Erklärungen. Nur die Geschichte selbst.
            - Entwickle Charaktere weiter und führe neue Details ein.  
            - Beende den Abschnitt mit einem leichten Cliffhanger oder einer offenen Frage.  
        
            Vorherige Ausgabe zur Orientierung:
            "${beforeOutput}"
            `;
        }
        
        // Final prompt with `prompt` and additional instructions
        let finalPrompt = `
        **Wichtige Anweisungen:**  
        - Schreibe die Fortsetzung der Geschichte mit einem **positiven**, **hoffnungsvollen** oder **abenteuerlichen** Ton.  
        - Vermeide düstere, tragische Wendungen. Stattdessen fokussiere dich auf den **Überlebenswillen**, **Zusammenhalt** oder **Magie**.  
        - **Maximal 300 Wörter** und keine Wiederholungen aus der vorherigen Geschichte.   
        - Die Geschichte soll einen **magischen** oder **hoffnungsvollen** Abschluss finden, der den Leser ermutigt.  
        
        ---
        
        **Bisherige Geschichte:**  
        "${beforeOutput}"
        
        **Inspiration für die Fortsetzung (Prompt):**  
        "${prompt}"

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