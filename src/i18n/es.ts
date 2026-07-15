/**
 * Diccionario en español (idioma base).
 * Para la etapa bilingüe se añadirá `en.ts` con las mismas claves
 * y se registrará en `index.ts`.
 */
export default {
  meta: {
    title: 'Adrián D. Bonilla — art · music · love',
    description:
      'Portafolio de Adrián D. Bonilla, artista multidisciplinario: arte visual, música y diseño desde una misma sensibilidad.',
  },
  a11y: {
    skip: 'Saltar al contenido',
    home: 'Adrián D. Bonilla — inicio',
    monogramAlt: 'Monograma AB de Adrián D. Bonilla',
    scrollHint: 'Bajar al manifiesto',
  },
  hero: {
    firstName: 'Adrián',
    lastName: 'D. Bonilla',
    tagline: 'art – music – love',
  },
  statement: {
    label: '01 — manifiesto',
    text: 'In love we trust.',
  },
  coming: 'coming soon',
} as const;
