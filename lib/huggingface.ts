export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  const HF_TOKEN = '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';
  const API_URL = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';

  try {
    console.log('Generating image for prompt:', prompt);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        options: {
          wait_for_model: true,
          use_cache: false
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', error);
      throw new Error(`Failed to generate image: ${error}`);
    }

    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error in generateImageFromPrompt:', error);
    throw error;
  }
};
