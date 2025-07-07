import { GoogleGenAI, Type } from "@google/genai";
import readlineSync from 'readline-sync';
import dotenv from 'dotenv';
dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

// Ai model LLM with maintaning history 
const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [],
});


async function main() {
    var userProblem = readlineSync.question('Ask me anything ==>> ');
    
    const response = await chat.sendMessage({message:userProblem});
    console.log(response.text);
    main(); // for calling in loop
}

main();