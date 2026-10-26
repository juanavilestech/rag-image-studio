# 🧠 RAG Image Studio

Aplicación web interactiva construida con **Next.js 15 (App Router)**, **Tailwind CSS**, **Google GenAI** y **Búsqueda Vectorial por Similitud Coseno**.

Implementa una **arquitectura RAG (Retrieval-Augmented Generation) de dos vías** orientada a la síntesis de imágenes por difusión:
1. **Retrieval & Augmentation:** Enriquece el prompt del usuario recuperando ópticas, esquemas de iluminación y estéticas de una base de conocimiento vectorial.
2. **Vector Persistence & Semantic Search:** Almacena cada creación junto con su vector matemático para permitir búsquedas por significado en la galería.

---

## 🚀 Inicio Rápido

El servidor de desarrollo ya está listo. Para iniciarlo manualmente en cualquier momento:

```bash
cd C:\Users\Juan\Proyectos\rag-image-studio
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📐 Arquitectura del Sistema RAG

```
┌──────────────────────────────────────────────────────────────┐
│                    IDEA DEL USUARIO                         │
│       "un auto deportivo en la ciudad con lluvia"            │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
               [1. Cálculo de Embedding Vectorial]
               (Google text-embedding-004 / Local Dense)
                               │
                               ▼
        [2. Búsqueda Vectorial por Similitud Coseno]
   ◄───► Base de Conocimiento de Estilos & Cámaras
         • Cyberpunk Neón (Similitud: 73.6%)
         • Fotografía Cinematográfica 35mm (Similitud: 72.6%)
                               │
                               ▼
                [3. Enriquecimiento del Prompt]
                 (Augmentation vía Gemini LLM)
   ==> Master Prompt con textura, lentes Panavision e iluminación
                               │
                               ▼
                [4. Difusión y Renderizado]
                 (Google Imagen 3 / Flux Engine)
                               │
                               ▼
               [5. Persistencia & Búsqueda Semántica]
          Guarda la imagen + frase + vector en galería
```

---

## 🌟 Funcionalidades Implementadas

* **Generador RAG:**
  * Modo **Auto-RAG** (detección vectorial automática de los estilos más afines).
  * Modo **Fijar Estilo** (selección manual de técnicas ópticas).
  * **Inspector RAG en Vivo:** visualiza la similitud coseno porcentual de cada estilo recuperado y la comparación entre el prompt original y el enriquecido.
* **Galería con Búsqueda Semántica:**
  * Búsqueda por concepto (ej: *"vehículo nocturno"* encuentra *"un auto deportivo en la ciudad con lluvia"* aunque usen palabras distintas).
  * Vista previa en alta definición y descarga de imágenes.
* **Base de Conocimiento Vectorial:**
  * Explorador de estilos precargados (Cyberpunk, 35mm, Ghibli, Retrato de Estudio, Macro, Chiaroscuro Barroco, etc.).
  * Formulario para añadir nuevos estilos vectorizados personalizados.
  * Simulador de similitud matemática en tiempo real contra cualquier frase.
* **Ajustes:**
  * Compatible con Google Gemini API Key para utilizar `Imagen 3` y `text-embedding-004`.
  * Fallback automático a `Flux` y vectorizador denso local (funciona al 100% sin necesidad de configurar claves).

---

## 🛠️ Tecnologías

* **Framework:** Next.js 16.4 / React 19 / TypeScript
* **Estilos:** Tailwind CSS 4
* **Iconografía:** Lucide React
* **IA & Vectores:** `@google/genai`, Similitud Coseno vectorial, Pollinations Flux / Imagen 3
