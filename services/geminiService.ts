
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GeminiResponseData } from '../types';

// IMPORTANT: The API key MUST be available as an environment variable named API_KEY.
// For local development, you can set this in your .env file (if your setup supports it) or terminal.
// For deployment (e.g., on Netlify), set this environment variable in the site's build & deploy settings.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable is not set. The application will not be able to connect to Gemini API.");
  // Optionally, you could throw an error here or display a message to the user,
  // but for now, we'll let the app attempt to run and fail gracefully if the key is missing.
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Fallback to prevent crash if API_KEY is undefined at init

const TEXT_MODEL_NAME = "gemini-2.5-flash-preview-04-17"; // Supports text and vision

const parseGeminiResponse = (responseText: string): GeminiResponseData | null => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsedData = JSON.parse(jsonStr) as GeminiResponseData;
    // Basic validation
    if (parsedData && parsedData.potentialConditions && parsedData.importantDisclaimer) {
      return parsedData;
    }
    console.error("Parsed JSON does not match expected GeminiResponseData structure:", parsedData);
    return null;
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e, "Raw response:", responseText);
    return null;
  }
};

export const analyzeImageWithGemini = async (base64ImageData: string): Promise<GeminiResponseData | null> => {
  if (!API_KEY) {
    console.error("Gemini API Key is not configured.");
    alert("Gemini API Key is not configured. Please check console for details.");
    return null;
  }
  try {
    const imagePart: Part = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64ImageData.split(',')[1], // Remove the "data:image/jpeg;base64," prefix
      },
    };

    const textPart: Part = {
      text: `Analyze the provided image for any visible health symptoms.
Task: Based *only* on the visual cues in the image, provide the following information in JSON format:
1. A brief summary of relevant visual observations.
2. List 2-3 potential non-emergency common conditions suggested by these visual cues.
3. For each condition, recommend 1-2 safe, over-the-counter (OTC) medicines suitable for adults, including general dosage guidelines.
4. Include a disclaimer.

JSON Structure:
{
  "analysisTitle": "Visual Symptom Analysis",
  "summary": "Relevant visual observations from the image.",
  "potentialConditions": [
    {
      "conditionName": "Name of the potential condition",
      "otcRecommendations": [
        { "medicineName": "OTC Medicine Name", "dosage": "General adult dosage" }
      ],
      "reasoning": "Brief reasoning based on visual cues."
    }
  ],
  "importantDisclaimer": "This is not a medical diagnosis. The information provided is for general informational purposes only and is based on visual analysis of the image. Consult a healthcare professional for any health concerns or before making any decisions related to your health or treatment."
}
Ensure the entire response is a single valid JSON object. Do not include any text outside this JSON object, including markdown fences.`,
    };
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: TEXT_MODEL_NAME,
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
        }
    });
    
    return parseGeminiResponse(response.text);

  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    alert(`Error communicating with AI: ${errorMessage}. Ensure your API key is valid and has access to the model.`);
    return null;
  }
};

export const getSymptomAnalysisFromText = async (symptomDescription: string): Promise<GeminiResponseData | null> => {
  if (!API_KEY) {
    console.error("Gemini API Key is not configured.");
    alert("Gemini API Key is not configured. Please check console for details.");
    return null;
  }
  try {
    const prompt = `User described symptoms: "${symptomDescription}"

Task: Based *only* on the user's described symptoms, provide the following information in JSON format:
1. A brief summary of the user's described symptoms.
2. List 2-3 potential non-emergency common conditions suggested by these symptoms.
3. For each condition, recommend 1-2 safe, over-the-counter (OTC) medicines suitable for adults, including general dosage guidelines.
4. Include a disclaimer.

JSON Structure:
{
  "analysisTitle": "Symptom Description Analysis",
  "summary": "Summary of user's described symptoms.",
  "potentialConditions": [
    {
      "conditionName": "Name of the potential condition",
      "otcRecommendations": [
        { "medicineName": "OTC Medicine Name", "dosage": "General adult dosage" }
      ],
      "reasoning": "Brief reasoning based on described symptoms."
    }
  ],
  "importantDisclaimer": "This is not a medical diagnosis. The information provided is for general informational purposes only and is based on the symptoms described. Consult a healthcare professional for any health concerns or before making any decisions related to your health or treatment."
}
Ensure the entire response is a single valid JSON object. Do not include any text outside this JSON object, including markdown fences.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: TEXT_MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    return parseGeminiResponse(response.text);

  } catch (error) {
    console.error("Error getting symptom analysis from text with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    alert(`Error communicating with AI: ${errorMessage}. Ensure your API key is valid and has access to the model.`);
    return null;
  }
};
    