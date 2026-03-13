const { GoogleGenerativeAI } = require("@google/generative-ai");
const Course = require("../models/Course");
require("dotenv").config();

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      // Mock logic to provide a response without API key for demo purposes
      const lowerMessage = message.toLowerCase();
      let mockReply = "Hello! I'm the LMS Platform AI. Since the API key isn't set yet, I'm in **Demo Mode**. 🚀\n\n";
      
      if (lowerMessage.includes("course") || lowerMessage.includes("what")) {
        mockReply += "We have several great courses including:\n" + courses.slice(0, 3).map(c => `- **${c.title}** (${c.category})`).join('\n') + "\n\nFeel free to explore them!";
      } else if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
        mockReply += "I can help you navigate the platform, find courses, or explain technical concepts once my Gemini brain is connected! 🧠";
      } else {
        mockReply += "I'm currently running in a limited capacity. To unlock my full potential with Gemini, please add a valid `GEMINI_API_KEY` to the `.env` file! 🔑";
      }
      
      return res.json({ reply: mockReply });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Fetch context
    const courses = await Course.getAll();
    const courseContext = courses.map(c => `- ${c.title}: ${c.description} (Category: ${c.category})`).join('\n');

    const prompt = `
      You are the LMS Platform AI Assistant. Friendly tutor.
      LMS Platform Courses:
      ${courseContext}

      User: "${message}"
      Reply in markdown, short and helpful.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ reply: "I'm having a little trouble connecting to my AI core. Please check if the API key is valid!" });
  }
};
