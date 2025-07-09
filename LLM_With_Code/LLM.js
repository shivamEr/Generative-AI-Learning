import { GoogleGenAI, Type } from "@google/genai";
import readlineSync from 'readline-sync';
import dotenv from 'dotenv';
dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

let history = [];

async function chatWithAi() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        // contents: "Hey, can you give me code of binary search in cpp", // Asking quetion like this will not response you from past your info
        contents: history, // for past info and context
        config: {
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
                systemInstruction: "You are a DSA Instructor. Your name is CodeAlexa",
            }
        }
    });
    console.log(response.text);
    history.push({
        role:"model",
        parts:[{text: response.text}]
    });

}

async function main() {
    var userProblem = readlineSync.question('Ask me anything ==>> ');
    history.push({
        role: "user",
        parts: [{ text: userProblem }]
    });
    await chatWithAi(); // GPT api call
    main(); // for calling in loop
}

main();