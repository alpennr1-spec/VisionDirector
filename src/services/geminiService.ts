import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Scene {
  sceneNumber: number;
  visualDescription: string;
  actionScript: string;
  videoPrompt: string;
  duration: string;
}

export interface StoryboardResponse {
  title: string;
  genre: string;
  scenes: Scene[];
}

export async function generateStoryboard(idea: string, style: string): Promise<StoryboardResponse> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are a professional film director and AI video expert. 
Your task is to take a core concept and expand it into a detailed storyboard.
For each scene, provide:
1. Visual Description: What we see in the frame.
2. Action/Script: What is happening or being said.
3. Video AI Prompt: A high-quality prompt optimized for AI video generators (like Sora, Kling, Runway, Luma). 
   Use technical camera terms (wide shot, tracking, bokeh, 4k, cinematic lighting).
4. Duration: Estimated time in seconds.

Return the response in JSON format.`;

  const prompt = `Core Idea: ${idea}\nVisual Style: ${style}\n\nPlease generate a storyboard with about 5-8 key scenes.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            genre: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  visualDescription: { type: Type.STRING },
                  actionScript: { type: Type.STRING },
                  videoPrompt: { type: Type.STRING },
                  duration: { type: Type.STRING },
                },
                required: ["sceneNumber", "visualDescription", "actionScript", "videoPrompt", "duration"],
              },
            },
          },
          required: ["title", "genre", "scenes"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as StoryboardResponse;
  } catch (error) {
    console.error("Error generating storyboard:", error);
    throw error;
  }
}
