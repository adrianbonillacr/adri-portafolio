/**
 * Colecciones de contenido (Astro Content Layer).
 * Toda la información editable del portafolio vive en `/content`
 * como JSON validado con Zod: para actualizar el sitio basta con
 * modificar esos archivos, nunca los componentes.
 */
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const metricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

/**
 * Caso anidado dentro de un espacio de trabajo (agencia o práctica
 * independiente). Los campos de contenido son opcionales: mientras
 * no existan, la página del caso muestra placeholders.
 */
const caseStudySchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  challenge: z.string().optional(),
  objective: z.string().optional(),
  role: z.string().optional(),
  strategy: z.string().optional(),
  process: z
    .array(z.object({ title: z.string(), description: z.string() }))
    .optional(),
  results: z
    .object({
      summary: z.string(),
      metrics: z.array(metricSchema).default([]),
    })
    .optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    order: z.number(),
    disciplines: z.array(z.string()).default([]),
    challenge: z.string(),
    objective: z.string(),
    role: z.string(),
    strategy: z.string(),
    process: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    results: z.object({
      summary: z.string(),
      metrics: z.array(metricSchema).default([]),
    }),
    /** Marcos vacíos que muestra la galería mientras no existan archivos reales. */
    galleryPlaceholders: z.number().default(6),
    /** Solo para proyectos contenedores (Advanced, LAGE): casos de estudio anidados. */
    caseStudies: z.array(caseStudySchema).default([]),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

const experience = defineCollection({
  loader: file('./content/experience.json'),
  schema: z.object({
    id: z.string(),
    company: z.string(),
    role: z.string(),
    period: z.string(),
    summary: z.string(),
    responsibilities: z.array(z.string()),
    achievements: z.array(z.string()),
    tools: z.array(z.string()),
    /** Si existe, enlaza la experiencia con su caso de estudio en el portafolio. */
    projectId: z.string().optional(),
    order: z.number(),
  }),
});

const services = defineCollection({
  loader: file('./content/services.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    deliverables: z.array(z.string()).default([]),
    order: z.number(),
  }),
});

const tools = defineCollection({
  loader: file('./content/tools.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    order: z.number(),
  }),
});

export const collections = { projects, experience, services, tools };
