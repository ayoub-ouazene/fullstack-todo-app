const { Router } = require("express");
const express = require("express");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = Router();
router.use(express.json());



const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

async function main(message) {
  try {
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
   const contents = [
      {
        role: "user",
        // The instruction for the AI goes here, nested in parts
        parts: [
          {
            text: `You are a professional assistant specializing in task management and productivity. Your purpose is to provide expert advice, actionable strategies, and helpful guidance on time management, task prioritization, and general productivity workflows. If a user asks you about something not related to a todo app or time management, respond with: "My expertise is focused on task management and productivity. How can I assist you with your to-do list or time management goals?"`,
          },
        ],
      },
      {
        role: "user",
        // The user's message goes here
        parts: [
          {
            text: message,
          },
        ],
      },
    ];

    const result = await model.generateContent({ contents });

    const response = await result.response;
    const text = response.text();
    return text;

  } 
  catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI.");
  }
}



router.post("/",async (req,res)=>{

    if(!req.body.message)
    {
        res.status(400).send("no message was provided");
        return;
    }

    const message = req.body.message;

    const response = await main(message);
    res.send(response);

})

module.exports = router;