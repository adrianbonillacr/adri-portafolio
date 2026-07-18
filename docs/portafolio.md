# Portafolio profesional — guía de contenido

El cascarón del portafolio está completo y navegable. Para llenarlo **no hay que
tocar código**: todo se edita en `/content`, en `src/i18n/es.ts` y colocando
archivos en `public/portfolio/`.

## Rutas

| Ruta                                 | Contenido                                          |
| ------------------------------------ | -------------------------------------------------- |
| `/portafolio`                        | Hero, sobre mí, espacios de trabajo, experiencia, servicios, herramientas, contacto |
| `/portafolio/advance`                | Advance + negocios atendidos (4 casos anidados)    |
| `/portafolio/advance/cuenta-01…04`   | Negocios dentro de Advance                         |
| `/portafolio/lage`                   | Lagé Estrategia + negocios (Eddie Bauer CR, Quarzo) |
| `/portafolio/lage/eddie-bauer`       | Caso Eddie Bauer Costa Rica (contenido real)       |
| `/portafolio/mulailah`               | Caso de estudio Mulailah Gastropub                 |
| `/portafolio/distrito11`             | Caso de estudio Distrito 11                        |
| `/portafolio/freelance`              | Freelance + proyectos independientes (4 casos)     |

Los casos anidados admiten contenido completo opcional en el JSON del
espacio (challenge, objective, role, strategy, process, results): si un
campo no existe, la página muestra un placeholder.

**Retrato de "Sobre mí"**: colocar la foto en
`public/portfolio/sobre-mi/hero.jpg` (o `.png/.webp/.avif`) y recargar.

## Textos

- **Proyectos** → `content/projects/<id>.json` (desafío, objetivo, rol,
  estrategia, proceso, resultados, métricas, casos anidados, SEO).
- **Experiencia** → `content/experience.json` (cargo, fechas, responsabilidades,
  logros, herramientas; `projectId` enlaza con su caso de estudio).
- **Servicios** → `content/services.json`.
- **Herramientas** → `content/tools.json` (agrupadas por `category`).
- **Hero, sobre mí, contacto y etiquetas de interfaz** →
  `src/i18n/es.ts`, bloque `portfolio`.

Todos los JSON se validan con Zod (`src/content.config.ts`): si falta un campo,
`npm run dev` lo indica con un error claro.

## Imágenes

Colocar los archivos y recargar; el sitio los detecta solo
(`src/lib/media.ts`). Formatos: `.avif`, `.webp`, `.jpg`, `.jpeg`, `.png`.

```text
public/portfolio/<id>/hero.jpg          → imagen principal del caso
public/portfolio/<id>/gallery/01.jpg    → galería (orden alfabético)
```

Para los casos anidados: `public/portfolio/advanced/proyecto-1/hero.jpg`, etc.
Mientras no exista un archivo, se muestra un marco placeholder.

## Videos

Servidos directo desde `public` (sin YouTube/Vimeo). Formatos: `.mp4`, `.webm`.

```text
public/portfolio/<id>/videos/hero.mp4      → sustituye a la imagen hero (autoplay silencioso)
public/portfolio/<id>/videos/process.mp4   → aparece al final de la sección de proceso
public/portfolio/<id>/gallery/03.mp4       → dentro de la galería (se reproduce al hover)
```

El componente `SmartVideo` admite los modos `autoplay` (silencioso, en bucle),
`hover` y `controls` (con fullscreen nativo).

## Iconos de herramientas

`public/assets/tools/<id>.svg` — donde `<id>` es el id del JSON
(`tool-01.svg`…). Sin icono, se muestra la inicial del nombre.

## Integración a producción

El trabajo vive en la rama `feature/portafolio-profesional` (worktree
`ADRI-WEB-DEV`). Una vez aprobado: merge a `main` y push — Vercel despliega.
