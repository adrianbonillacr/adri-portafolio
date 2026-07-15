# Brandbook — semilla · adrianbonilla.art

Base del sistema visual definida en la etapa 1 (página de inicio).
Fuente de verdad técnica: `src/styles/tokens.css`.

## Concepto

**Galería silenciosa.** El sitio se comporta como una sala de exposición:
fondo negro con grano fílmico, un marco fino perimetral, enorme espacio
negativo y la marca como única protagonista. Elegante, editorial,
contemporáneo. Nada decora sin propósito.

## Color · monocromo puro

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#0e0e0e` | fondo global |
| `--color-bg-raised` | `#161615` | superficies elevadas (tarjetas) |
| `--color-ink` | `#f4f3f0` | texto principal (blanco cálido) |
| `--color-ink-muted` | `#a6a49e` | texto secundario |
| `--color-ink-faint` | `#64625e` | metadatos, marcadores |
| `--color-line` | `rgba(244,243,240,.18)` | líneas activas / hover |
| `--color-line-soft` | `rgba(244,243,240,.08)` | líneas de reposo, marco |

Regla: no se introducen colores nuevos. Si algo necesita énfasis,
se resuelve con jerarquía, escala o espacio.

## Tipografía · tríada

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Bodoni Moda** (variable) | titulares y momentos editoriales — eco del monograma serif |
| Sans | **Montserrat** (variable) | nombre, cuerpo, UI — eco del lockup «ADRIÁN D. BONILLA» |
| Mono | **Space Mono** | etiquetas, numeración, tagline — eco de «art – music – love» |

Convenciones:
- Etiquetas de sección en mono minúscula con numeración: `01 — manifiesto`.
- Tagline siempre en minúscula con guiones medios: `art – music – love`.
- El nombre se compone en Montserrat: ADRIÁN en 800, D. BONILLA en 300.

## Espaciado y layout

- Escala fluida con `clamp()`; secciones respiran con `--space-section`.
- Contenedor máx. `78rem` con gutter fluido.
- **Marco de galería**: borde de 1px inset `--frame` presente en todo el sitio.

## Movimiento

- Curva única: `cubic-bezier(0.22, 1, 0.36, 1)` — salida suave, sin rebotes.
- Apariciones: fundido + 28px de elevación, 1.1s, escalonadas ~130ms.
- Cursor: punto que acompaña con arrastre + estela efímera (~420ms de vida).
  Crece a anillo sobre elementos interactivos. Solo con puntero fino;
  respeta `prefers-reduced-motion`.
- Regla: el movimiento nunca compite con el contenido; solo lo presenta.

## Voz

- Bilingüe por diseño (ES primero). El tagline permanece en inglés como pieza de marca.
- Tono: sereno, editorial, primera persona discreta. Frases cortas.
