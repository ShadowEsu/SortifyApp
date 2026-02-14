
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, BinCategory } from "../types";

export const geminiService = {
  classifyWaste: async (base64Image: string): Promise<ScanResult> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image.split(',')[1] || base64Image,
      },
    };

    const prompt = `You are an expert waste management assistant. Analyze the provided image and classify the item for disposal. 
    You must return a structured JSON response identifying the item, its bin category (waste, compost, or recycle), your confidence level, and helpful tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedItem: { type: Type.STRING },
            binCategory: { 
              type: Type.STRING, 
              enum: ['waste', 'compost', 'recycle'] 
            },
            confidence: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            disposalTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
          },
          required: ['detectedItem', 'binCategory', 'confidence', 'explanation', 'disposalTips']
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}') as ScanResult;
    } catch (error) {
      console.error("Failed to parse AI response", error);
      throw new Error("AI classification failed to generate valid data.");
    }
  }
};
