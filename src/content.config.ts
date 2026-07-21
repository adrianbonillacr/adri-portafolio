/**
 * Colecciones de contenido (Astro Content Layer).
 * Toda la información editable del portafolio vive en `/content`
 * como JSON validado con Zod: para actualizar el sitio basta con
 * modificar esos archivos, nunca los componentes.
 *
 * Bilingüe: cada colección tiene su par en inglés (sufijo -en en la
 * carpeta o el archivo). Las páginas bajo /en/ leen las colecciones En.
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
  /** Marca el caso como trabajo en curso (muestra la etiqueta animada). */
  inProgress: z.boolean().optional(),
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

const projectSchema = z.object({
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
  /** Opcional: sin resultados reales, la sección no se muestra. */
  results: z
    .object({
      summary: z.string(),
      metrics: z.array(metricSchema).default([]),
    })
    .optional(),
  /** Marcos vacíos que muestra la galería mientras no existan archivos reales. */
  galleryPlaceholders: z.number().default(6),
  /**
   * Series de video todavía en producción: se muestran como un carrusel de
   * marcos «video en producción». Al colocar los archivos reales en
   * `gallery/<nombre>/`, basta con borrar la entrada de aquí.
   */
  pendingSeries: z
    .array(z.object({ name: z.string(), count: z.number().default(4) }))
    .default([]),
  /** Nombres de series de la galería que siguen ampliándose. */
  progressSeries: z.array(z.string()).default([]),
  /** Solo para espacios contenedores: casos de estudio anidados. */
  caseStudies: z.array(caseStudySchema).default([]),
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const experienceSchema = z.object({
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
});

const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  deliverables: z.array(z.string()).default([]),
  order: z.number(),
});

const toolSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  /** Sello tipográfico del icono (ej. "Ai"); un SVG en /assets/tools/<id>.svg lo sustituye. */
  abbr: z.string().optional(),
  order: z.number(),
});

export const collections = {
  projects: defineCollection({
    loader: glob({ pattern: '*.json', base: './content/projects' }),
    schema: projectSchema,
  }),
  projectsEn: defineCollection({
    loader: glob({ pattern: '*.json', base: './content/projects-en' }),
    schema: projectSchema,
  }),
  experience: defineCollection({
    loader: file('./content/experience.json'),
    schema: experienceSchema,
  }),
  experienceEn: defineCollection({
    loader: file('./content/experience-en.json'),
    schema: experienceSchema,
  }),
  services: defineCollection({
    loader: file('./content/services.json'),
    schema: serviceSchema,
  }),
  servicesEn: defineCollection({
    loader: file('./content/services-en.json'),
    schema: serviceSchema,
  }),
  tools: defineCollection({
    loader: file('./content/tools.json'),
    schema: toolSchema,
  }),
  toolsEn: defineCollection({
    loader: file('./content/tools-en.json'),
    schema: toolSchema,
  }),
};
