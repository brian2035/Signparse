
import { GoogleGenAI, Type } from "@google/genai";

export interface AIDetectedField {
  type: 'signature' | 'date' | 'initials' | 'text';
  label: string;
  confidence: number;
}

/**
 * Simulates analyzing a document's structure to suggest where signature fields should go.
 * In a real scenario, you'd send an image of the document. 
 * Here we send a textual description of common document patterns for demonstration.
 */
export async function detectSuggestedFields(documentDescription: string): Promise<AIDetectedField[]> {
  // Always initialize with the exact named parameter and direct process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this document description and suggest e-signature fields (type, label, confidence): "${documentDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: 'Field type: signature, date, initials, or text' },
              label: { type: Type.STRING, description: 'Display label for the field' },
              confidence: { type: Type.NUMBER, description: 'Model confidence score 0-1' },
            },
            required: ['type', 'label', 'confidence'],
          },
        },
      },
    });

    // response.text property directly returns the string output.
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Field Detection Error:", error);
    return [];
  }
}
