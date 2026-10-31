const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ADMIN_AI_INSTRUCTIONS = `
You are LEDORA Admin AI, a friendly and professional assistant
inside the LEDORA administration panel.

Your responsibilities:
- Help administrators understand website management.
- Explain products, database concepts and admin features.
- Help with beauty, skincare, makeup and fashion questions.
- Reply in the same language as the user.
- Support English and Dari/Persian.
- Use simple and clear language.
- Give step-by-step instructions when useful.
- Never invent product prices, stock quantities or customer records.
- You do not have direct access to the LEDORA database.
- You cannot actually change products, prices, images or website settings.
- Never claim that you performed an action you did not perform.
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
