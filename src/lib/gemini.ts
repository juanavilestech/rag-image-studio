import { GoogleGenAI } from '@google/genai';
import { generateLocalEmbedding } from './vector';

export async function getEmbedding(text: string, apiKey?: string): Promise<number[]> {
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: text,
      });

      if (response && response.embeddings && response.embeddings.length > 0 && response.embeddings[0].values) {
        return response.embeddings[0].values;
      }
    } catch (err) {
      console.warn('Gemini embedding failed, falling back to local vectorizer:', err);
    }
  }

  // Fallback to local high-precision semantic vectorizer
  return generateLocalEmbedding(text);
}

export async function augmentPrompt(
  userPrompt: string,
  retrievedStyles: Array<{ name: string; modifiers: string; similarity: number }>,
  apiKey?: string
): Promise<{ augmentedPrompt: string; explanation: string }> {
  const stylesText = retrievedStyles
    .map((s) => `• Estilo '${s.name}' (Similitud RAG: ${(s.similarity * 100).toFixed(1)}%): ${s.modifiers}`)
    .join('\n');

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Eres un Director de Arte y Prompt Engineer de élite para generadores de imágenes (Imagen 3, Flux, Midjourney).
Tu misión en esta arquitectura RAG es tomar la idea original del usuario y combinarla orgánicamente con los modificadores visuales recuperados por el sistema de búsqueda vectorial.

Instrucciones:
1. El prompt resultante debe ser en inglés (el idioma óptimo para modelos de difusión de imágenes).
2. Debe fusionar la idea del usuario con la iluminación, lentes, atmósfera y estética de los estilos recuperados.
3. Sé descriptivo, sensorial y específico (composición, paleta, iluminación, tipo de cámara).
4. Devuelve ÚNICAMENTE un objeto JSON con este formato exacto:
{
  "augmentedPrompt": "el prompt maestro en inglés aquí...",
  "explanation": "breve explicación en español de qué elementos RAG se incorporaron"
}`;

      const userMessage = `IDEA ORIGINAL DEL USUARIO:\n"${userPrompt}"\n\nCONOCIMIENTO RECUPERADO POR RAG:\n${stylesText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\n${userMessage}` }] },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(responseText);
        if (parsed.augmentedPrompt) {
          return {
            augmentedPrompt: parsed.augmentedPrompt,
            explanation: parsed.explanation || 'Prompt enriquecido por Gemini integrando el conocimiento vectorial.',
          };
        }
      } catch {
        // Fall through to deterministic if parse fails
      }
    } catch (err) {
      console.warn('Gemini augment prompt failed, using programmatic synthesizer:', err);
    }
  }

  // Programmatic Augmentation Engine (Reliable Fallback)
  const combinedModifiers = retrievedStyles.map((s) => s.modifiers).join(', ');
  const augmentedPrompt = `${userPrompt}, ${combinedModifiers}, ultra-detailed, 8k resolution, award-winning visual composition`;
  const topStyle = retrievedStyles[0]?.name || 'Estilos seleccionados';
  const explanation = `Se integraron modificadores ópticos y atmosféricos basados en el vector de similitud con '${topStyle}'.`;

  return { augmentedPrompt, explanation };
}

export async function generateImagen3(prompt: string, apiKey: string): Promise<string | null> {
  if (!apiKey || apiKey.trim().length < 10) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64Bytes = response.generatedImages[0].image?.imageBytes;
      if (base64Bytes) {
        return `data:image/jpeg;base64,${base64Bytes}`;
      }
    }
    return null;
  } catch (err) {
    console.warn('Imagen 3 generation error:', err);
    return null;
  }
}
