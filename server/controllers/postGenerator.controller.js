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

    const prompt = `Write a comprehensive blog post about ${category} in markdown format with proper headings, subheadings, and sections. Focus on: 
    - provide image related to category
    - Key concepts
    - Practical examples
    - Best practices
    - Common use cases`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    const text = response.text();

    res.status(200).json({ content: text });
  } catch (error) {
    console.log(error);
  }
};
