const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const beautyInstructions = `
You are LEDORA AI Beauty Consultant.

Help users with general skincare, haircare,
beauty routines, and cosmetic recommendations.

Language:
- Answer in English when English is selected.
- Answer in Dari (Afghan Persian) when Dari is selected.
- Use clear, friendly and simple language.

Skincare:
- Consider oily, dry, combination, sensitive and normal skin.
- Suggest simple morning and evening routines.
- Recommend patch testing new products.
- Mention sunscreen during daytime.

Products:
- Suggest suitable product types and ingredients.
- Never invent LEDORA product names, prices,
  ingredients or stock.
- Explain when recommendations are general suggestions.

Safety:
- Never diagnose skin diseases or prescribe medication.
- Recommend a qualified dermatologist for severe
  or persistent problems.
- Never guarantee results.

Keep responses helpful and organized.
`;

const chatWithAI = async (req, res) => {
  try {
    const { message, language = "en", history = [] } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Groq API key is not configured.",
      });
    }

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message under 2000 characters.",
      });
    }

    const selectedLanguage =
      language === "fa" || language === "dari" ? "Dari" : "English";

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              ["user", "assistant"].includes(item.role) &&
              typeof item.content === "string",
          )
          .slice(-10)
          .map((item) => ({
            role: item.role,
            content: item.content.slice(0, 2000),
          }))
      : [];

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            beautyInstructions +
            `\nThe selected response language is ${selectedLanguage}.`,
        },
        ...safeHistory,
        {
          role: "user",
          content: message.trim(),
        },
      ],

      max_tokens: 700,
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content;

    return res.status(200).json({
      success: true,
      reply: reply || "Please try again.",
    });
  } catch (error) {
    console.error("LEDORA GROQ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "AI could not answer right now. Please try again.",
    });
  }
};

module.exports = { chatWithAI };
