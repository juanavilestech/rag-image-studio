import { KnowledgeChunk } from '@/types';
import { generateLocalEmbedding } from './vector';

export const DEFAULT_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'cyberpunk-neo-tokyo',
    name: 'Cyberpunk Futurista & Neón',
    category: 'estetica',
    description: 'Estética distópica urbana de alta tecnología con densa lluvia nocturna, rascacielos monolíticos y saturación de luces de neón cian y magenta.',
    modifiers: 'cyberpunk aesthetics, neo-tokyo megacity, volumetric neon glow, wet reflective asphalt, moody atmospheric rain, high contrast, 8k octane render, cinematic lighting',
    keywords: ['futuro', 'robot', 'androide', 'ciudad', 'neon', 'cyberpunk', 'tecnologia', 'noche', 'lluvia', 'auto', 'vehiculo', 'sci-fi', 'espacio', 'nave'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cinematic-35mm',
    name: 'Fotografía Cinematográfica 35mm',
    category: 'fotografia',
    description: 'Composición cinematográfica realista con textura analógica de película 35mm Kodak Portra, profundidad de campo reducida y luz dorada natural.',
    modifiers: 'shot on 35mm panavision lens, kodak portra 400 film grain, shallow depth of field, f/1.4, natural golden hour rim light, cinematic color grade, photorealistic, authentic texture',
    keywords: ['persona', 'retrato', 'paisaje', 'viaje', 'calle', 'cine', 'pelicula', 'realista', 'foto', 'atardecer', 'humano', 'vida'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'studio-portrait',
    name: 'Retrato de Estudio Profesional',
    category: 'iluminacion',
    description: 'Iluminación de estudio de alta gama con softbox envolvente, luz de recorte sutil, fondo neutro oscuro y nitidez óptica en texturas finas.',
    modifiers: 'professional studio lighting, large softbox key light, subtle rim light, dark seamless backdrop, 85mm portrait prime lens, tack-sharp eye focus, hyper-detailed skin texture, editorial magazine quality',
    keywords: ['rostro', 'mujer', 'hombre', 'modelo', 'retrato', 'ojos', 'estudio', 'editorial', 'moda', 'belleza', 'elegante', 'perfil'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ghibli-watercolor',
    name: 'Anime Paisajista Studio Ghibli',
    category: 'arte',
    description: 'Ilustración artística tradicional inspirada en Hayao Miyazaki, con cielos de acuarela exuberantes, nubes esponjosas y una atmósfera pacífica y nostálgica.',
    modifiers: 'studio ghibli aesthetic, hayao miyazaki inspired art, vibrant hand-painted watercolor background, fluffy cumulus clouds, lush green scenery, whimsical nostalgic atmosphere, high aesthetic masterpiece',
    keywords: ['anime', 'dibujo', 'ilustracion', 'magia', 'naturaleza', 'bosque', 'pradera', 'nubes', 'cielo', 'nostalgia', 'fantasia', 'castillo', 'pueblo'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'macro-nature',
    name: 'Macro Fotografía de Naturaleza',
    category: 'lentes',
    description: 'Detalle extremo a nivel microscópico con lente macro 100mm, iluminación anular suave, gotas de rocío y refracciones de luz.',
    modifiers: 'extreme macro photography, 100mm macro lens f/2.8, soft ring light illumination, morning dew droplets with prismatic refraction, creamy smooth bokeh, hyper-detailed surface texture',
    keywords: ['insecto', 'flor', 'planta', 'gota', 'ojo', 'detalle', 'micro', 'macro', 'hoja', 'cristal', 'mineral', 'textura'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'baroque-oil-painting',
    name: 'Pintura al Óleo Barroca & Chiaroscuro',
    category: 'arte',
    description: 'Pintura clásica al óleo con técnica de claroscuro dramático al estilo Caravaggio y Rembrandt, pinceladas empastadas visibles y pigmentos profundos.',
    modifiers: 'classic baroque oil painting, dramatic chiaroscuro contrast, caravaggio tenebrism lighting, rich deep pigments, visible canvas impasto brushwork, museum fine art masterpiece',
    keywords: ['clasico', 'pintura', 'oleo', 'cuadro', 'antiguo', 'rey', 'reina', 'bodegon', 'museo', 'dramatico', 'sombra', 'velas', 'renacimiento'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dark-gothic-fantasy',
    name: 'Fantasía Oscura Gótica',
    category: 'fantasia',
    description: 'Atmósfera gótica y misteriosa inspirada en universos como Elden Ring y Dark Souls, niebla volumétrica, arquitectura en ruinas y tonos fríos desaturados.',
    modifiers: 'dark gothic fantasy concept art, atmospheric heavy mist, crumbling ancient cathedral ruins, eerie moonlight backlighting, intricate ornate medieval textures, ominous moody color grading',
    keywords: ['caballero', 'espada', 'dragon', 'monstruo', 'castillo', 'ruinas', 'gualda', 'mago', 'bruja', 'oscuro', 'niebla', 'gualdo', 'demonios', 'almas'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'isometric-3d-clay',
    name: 'Diorama Isométrico 3D',
    category: 'estetica',
    description: 'Modelo isométrico en miniatura con textura de arcilla suave, iluminación global de Unreal Engine 5 y efecto tilt-shift estilo maqueta tierna.',
    modifiers: 'isometric 3d diorama render, tilt-shift miniature lens effect, soft tactile clay material, warm ambient occlusion, cute playful aesthetic, raytraced shadows, unreal engine 5 quality',
    keywords: ['isometrico', 'miniatura', 'juguete', 'habitacion', 'casa', 'maqueta', '3d', 'tierno', 'cute', 'diorama', 'bloques', 'render'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'retro-synthwave-80s',
    name: 'Retro Synthwave & Vaporwave 80s',
    category: 'estetica',
    description: 'Estética retro-futurista de los años 80 con sol de rejilla en degradado violeta, cuadrículas cromadas, autos deportivos clásicos y textura de cinta VHS.',
    modifiers: '1980s synthwave aesthetic, outrun style, retro neon grid horizon, chrome reflections, vibrant magenta and electric blue sunset, subtle VHS scanline tape distortion, dreamlike retro nostalgia',
    keywords: ['80s', 'retro', 'synthwave', 'vaporwave', 'atardecer', 'palmeras', 'auto', 'deportivo', 'rejilla', 'magenta', 'arcade'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'scifi-deep-space',
    name: 'Exploración Espacial Hard Sci-Fi',
    category: 'fantasia',
    description: 'Visuales espaciales científicas con naves interestelares detalladas, nebulosas estelares, titanio pulido y estética fotorrealista tipo Interstellar.',
    modifiers: 'hard sci-fi aesthetic, interstellar deep space exploration, accurate celestial nebula backdrop, brushed titanium spaceship hull, solar lens flare, photorealistic cosmic scale, 8k resolution',
    keywords: ['astronauta', 'espacio', 'galaxia', 'planeta', 'estrella', 'cosmos', 'universo', 'nasa', 'agujero', 'nebulosa', 'estelar'],
    createdAt: new Date().toISOString(),
  },
];

// Initialize with embeddings
export function getInitializedKnowledgeBase(): KnowledgeChunk[] {
  return DEFAULT_KNOWLEDGE_BASE.map((chunk) => {
    const textToEmbed = `${chunk.name} ${chunk.description} ${chunk.keywords.join(' ')} ${chunk.modifiers}`;
    return {
      ...chunk,
      embedding: generateLocalEmbedding(textToEmbed),
    };
  });
}
