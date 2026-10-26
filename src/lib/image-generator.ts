import { generateImagen3 } from './gemini';

export interface ImageGenerationResult {
  imageUrl: string;
  engine: 'imagen-3' | 'pollinations-flux' | 'pollinations-turbo';
}

export async function generateStudioImage(
  prompt: string,
  apiKey?: string,
  preferredEngine: 'auto' | 'imagen-3' | 'pollinations-flux' | 'pollinations-turbo' = 'auto'
): Promise<ImageGenerationResult> {
  // 1. Try Imagen 3 if requested or in auto mode with valid key
  if ((preferredEngine === 'auto' || preferredEngine === 'imagen-3') && apiKey && apiKey.length > 10) {
    try {
      const imagenDataUrl = await generateImagen3(prompt, apiKey);
      if (imagenDataUrl) {
        return {
          imageUrl: imagenDataUrl,
          engine: 'imagen-3',
        };
      }
    } catch (e) {
      console.warn('Imagen 3 fallback to Pollinations:', e);
    }
  }

  // 2. High Quality Fast Diffusion Engine (Pollinations Flux / Turbo)
  const seed = Math.floor(Math.random() * 9999999);
  const cleanPrompt = encodeURIComponent(prompt.slice(0, 1000));
  const model = preferredEngine === 'pollinations-turbo' ? 'turbo' : 'flux';
  
  // Format standard Pollinations URL
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=1024&model=${model}&nologo=true&seed=${seed}`;

  return {
    imageUrl: pollinationsUrl,
    engine: model === 'turbo' ? 'pollinations-turbo' : 'pollinations-flux',
  };
}
