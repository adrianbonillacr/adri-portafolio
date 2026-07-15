# adrianbonilla.art

Portafolio personal de **Adrián D. Bonilla** — *art · music · love*.

Etapa 1: página de inicio. Define la dirección visual, la base técnica
y la semilla del brandbook antes de desarrollar el resto del sitio.

## Stack

- [Astro](https://astro.build) — sitio estático, componentes reutilizables, cero JS innecesario.
- Tipografías autoalojadas vía Fontsource (sin peticiones a terceros).
- CSS puro con tokens de diseño (custom properties).
- JavaScript vanilla para cursor y animaciones de aparición.

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor local → http://localhost:4321
npm run build    # build de producción → dist/
npm run preview  # previsualizar el build
```

## Estructura

```
├── Assets - Diseñados/       # material fuente original (no se toca)
├── docs/brandbook.md         # semilla del brandbook
├── public/
│   ├── favicon.png
│   └── assets/               # logo, monograma, imagen OG
├── src/
│   ├── styles/
│   │   ├── tokens.css        # tokens de diseño (color, tipo, espaciado, motion)
│   │   └── base.css          # reset, atmósfera, utilidades globales
│   ├── scripts/
│   │   ├── cursor.js         # cursor personalizado con estela
│   │   └── reveal.js         # aparición de secciones al hacer scroll
│   ├── i18n/                 # diccionarios de texto (es hoy; en después)
│   ├── layouts/Base.astro    # documento HTML, meta, fuentes, scripts
│   ├── components/           # Header, Hero, Statement, ComingSoon
│   └── pages/index.astro     # página de inicio
└── astro.config.mjs
```

## Cómo crecer desde aquí

- **Nueva página**: crear `src/pages/nombre.astro` usando `Base.astro` y los componentes existentes.
- **Inglés**: crear `src/i18n/en.ts` con las mismas claves que `es.ts`, registrarlo en `src/i18n/index.ts` y añadir las rutas `/en/`.
- **Obra real**: sustituir los placeholders de `FeaturedWork.astro` con imágenes en `src/assets/` (para que Astro las optimice) y enlaces a páginas de proyecto.
- **Todo cambio visual global** se hace en `src/styles/tokens.css`, no en los componentes.

## Estado actual

La página de inicio es un teaser: hero (monograma + nombre + tagline),
manifiesto («In love we trust.») y cierre «coming soon». Las secciones
de disciplinas, obra y contacto llegarán en las siguientes etapas.
