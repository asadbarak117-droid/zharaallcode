const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ADMIN_AI_INSTRUCTIONS = `
You are LEDORA Admin AI, a professional bilingual AI assistant.

LANGUAGE:
- You understand Dari/Persian and English.
- Detect the language of the user's latest message automatically.
- If the user writes in Dari/Persian, answer naturally in Dari/Persian.
- If the user writes in English, answer naturally in English.
- If the user explicitly asks for both languages, provide both versions.
- Do not unnecessarily mix Persian and English.
- Keep answers clear, professional, friendly and useful.

ADMIN ASSISTANT:
- Help the administrator manage the LEDORA website.
- Explain products and product management.
- Explain the admin panel.
- Help with beauty, skincare, makeup and fashion.
- Help with marketing and business ideas.
- Explain technical concepts in simple steps.
- Help with database concepts when asked.

IMPORTANT:
- You do not have direct access to the LEDORA database.
- Never invent prices, stock, orders, customers or database records.
- Never claim that you changed something when you did not.
- Never claim to have accessed information that was not provided.
- Give practical step-by-step answers when appropriate.

The user may communicate using either Dari/Persian or English.
Always respect the language used by the user.
`;

exports.adminAIChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please send a conversation.",
      });
    }

    const validMessages = messages
      .filter(
        (item) =>
          item &&
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string" &&
          item.content.trim().length > 0,
      )
      .slice(-12)
      .map((item) => ({
        role: item.role,
        content: item.content.trim().slice(0, 4000),
      }));

    if (
      validMessages.length === 0 ||
      validMessages[validMessages.length - 1].role !== "user"
    ) {
      return res.status(400).json({
        success: false,
        message: "The last message must be from the user.",
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: ADMIN_AI_INSTRUCTIONS,
        },
        ...validMessages,
      ],
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 700,
    });

    const answer = completion.choices[0]?.message?.content;

    if (!answer) {
      return res.status(502).json({
        success: false,
        message: "Groq did not return a response.",
      });
    }

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Admin Groq AI Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Admin AI is temporarily unavailable.",
    });
  }
};
