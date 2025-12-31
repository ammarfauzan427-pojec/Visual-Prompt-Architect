import { GoogleGenAI } from "@google/genai";
import { GenerationMode } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }
  return new GoogleGenAI({ apiKey });
};

const fileToPart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the Data-URI prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(",")[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateOptimizedPrompt = async (
  text: string,
  files: File[],
  mode: GenerationMode
): Promise<string> => {
  const ai = getClient();
  const imageParts = await Promise.all(files.map(fileToPart));

  const modeInstruction = `
  CURRENT MODE: ${mode}
  USER INPUT: "${text}"
  
  Please analyze the attached image(s) if provided. Use the visual context from the images (lighting, pose, colors) to construct the perfect prompt according to the ${mode} template rules.
  Output ONLY the final optimized prompt string. Do not output markdown or explanations unless requested.
  `;

  const contents = {
    parts: [...imageParts, { text: modeInstruction }],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Lower temperature for more structural adherence
      },
    });

    return response.text || "No prompt generated.";
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};
