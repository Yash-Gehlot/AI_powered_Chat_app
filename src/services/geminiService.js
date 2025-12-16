import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const FALLBACK_REPLIES = ["Yes", "No", "Okay"];

// ✅ Create Gemini ONCE (same as expense tracker)
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const model = genAI
  ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  : null;

export const getSmartReplies = async (lastMessage) => {
  if (!model) {
    console.log("⚠️ Gemini not available, using fallback replies");
    return FALLBACK_REPLIES;
  }

  try {
    const prompt = `Generate 3 one-word replies for: "${lastMessage}".
Reply ONLY with 3 words, one per line. No punctuation or explanation.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const replies = text
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean)
      .slice(0, 3);

    if (replies.length === 3) {
      console.log("✅ AI Replies:", replies);
      return replies;
    }

    return FALLBACK_REPLIES;
  } catch (error) {
    console.log(
      "⚠️ Gemini error, fallback used:",
      error.status,error.message
    );
    return FALLBACK_REPLIES;
  }
};

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config({ quiet: true });

// const FALLBACK_REPLIES = ["Yes", "No", "Okay"];

// export const getSmartReplies = async (lastMessage) => {
//   if (!process.env.GEMINI_API_KEY) {
//     console.log("⚠️ Gemini API key not configured, using fallback replies");
//     return FALLBACK_REPLIES;
//   }

//   try {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

//     const prompt = `Generate 3 one-word replies for: "${lastMessage}". Reply ONLY with 3 words, one per line. No punctuation or explanation.`;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();
//     const replies = text.split("\n").filter(Boolean).slice(0, 3);

//     if (replies.length === 3) {
//       console.log("✅ AI Replies:", replies);
//       return replies;
//     }

//     return FALLBACK_REPLIES;
//   } catch (error) {
//     if (error.status === 429) {
//       console.log("⚠️ Gemini quota exceeded, using fallback replies");
//     } else {
//       console.log("⚠️ Gemini error:", error.message.split("\n")[0]);
//     }
//     return FALLBACK_REPLIES;
//   }
// };
