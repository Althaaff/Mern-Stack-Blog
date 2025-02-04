import { errorHandler } from "../utils/errorHandler.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateContent = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to generate content!")
      );
    }

    const { category } = req.body;

    if (!category || typeof category !== "string" || category.trim() === "") {
      return next(errorHandler(403, "Category must be a non-empty string"));
    }

    const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAi.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Write a detailed and engaging blog post about ${category}. 
    - Focus on key concepts, best practices, practical code snippets with black code background, and real-world use cases.
    - Include a structured format that is user-friendly and easy to read.
    - Avoid markdown syntax, but use bold formatting for headings and key points.
    - Ensure readability like a well-designed blog article.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text(); // Markdown content from AI

    let formattedContent = textResponse;

    // Enhance the content with styling and spacing for a cleaner UX
    formattedContent = formattedContent.replace(
      /(\*\*|__)(.*?)\1/g,
      "<strong>$2</strong>"
    );

    formattedContent = formattedContent.replace(/\n/g, "<br />");

    res.status(200).json({ content: formattedContent });
  } catch (error) {
    next(error);
  }
};
