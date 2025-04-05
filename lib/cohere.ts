// lib/cohere.ts
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_COHERE_API_KEY;
const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_COHERE_API_URL;

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-r', // adjust to correct model
        prompt,
        task: 'image-generation', // hypothetical key, check actual Cohere docs
      }),
    });

    const data = await response.json();
    return data.image_url || null;
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
}
