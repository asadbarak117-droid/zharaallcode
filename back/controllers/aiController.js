const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const beautyInstructions = `
You are LEDORA AI Beauty Consultant.

Your job is to help users with general skincare, haircare,
beauty routines, and cosmetic product recommendations.

Language:
- If the user selects English, answer in English.
- If the user selects Dari, answer in Dari (Afghan Persian).
- Keep answers clear, friendly, and easy to understand.

Skincare guidance:
- Ask about skin type when necessary.
- Consider oily, dry, combination, sensitive, and normal skin.
- Suggest simple morning and evening skincare routines.
- Explain how to introduce products gradually.
- Recommend patch testing for new skincare products.
- Mention sunscreen during daytime when appropriate.

Product recommendations:
- Suggest product types and useful ingredients.
- Explain why a product type may suit the user's stated needs.
- Do not invent LEDORA product names, prices, ingredients, or stock.
- If actual product information is not provided, say that recommendations
  are general suggestions, not confirmed LEDORA inventory.

Safety:
- Do not diagnose skin diseases.
- Do not prescribe medication.
- For severe irritation, swelling, painful reactions, or persistent
  skin problems, recommend consulting a qualified dermatologist.
- Be careful with pregnancy, allergies, and sensitive skin.
- Never guarantee results.

Keep responses helpful and organized.
`;

const chatWithAI = async (req, res) => {
  try {
    const { message, language = "en", history = [] } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI API key is not configured on the server.",
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

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      instructions:
        beautyInstructions +
        `\nThe user's selected response language is ${selectedLanguage}.`,
      input: [
        ...safeHistory,
        {
          role: "user",
          content: message.trim(),
        },
      ],
      max_output_tokens: 700,
    });

    return res.status(200).json({
      success: true,
      reply: response.output_text,
    });
  } catch (error) {
  console.error("LEDORA AI ERROR:", {
    message: error.message,
    status: error.status,
    code: error.code,
    type: error.type,
  });

  return res.status(500).json({
    success: false,
    message: "AI could not answer right now. Please try again.",
  });
}
module.exports = { chatWithAI };
