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
    text: 'In love we trust.',
  },
  coming: 'coming soon',

  /* — Sección Portafolio Profesional — */
  portfolio: {
    meta: {
      title: 'Portafolio — Adrián D. Bonilla',
      description:
        '[Placeholder] Portafolio profesional de Adrián D. Bonilla: diseño estratégico, branding, dirección creativa y comunicación visual.',
    },
    nav: {
      about: 'sobre mí',
      projects: 'proyectos',
      experience: 'experiencia',
      services: 'servicios',
      contact: 'contacto',
      backToPortfolio: 'volver al portafolio',
    },
    hero: {
      label: 'portafolio profesional',
      headline: '[Placeholder] Headline potente sobre resolver problemas de negocio con diseño.',
      value:
        '[Placeholder] Propuesta de valor: qué hago, para quién y qué resultados genero. Dos o tres líneas máximo.',
      ctaProjects: 'ver proyectos',
      ctaContact: 'contacto',
    },
    about: {
      label: 'sobre mí',
      title: '[Placeholder] Cómo pienso y cómo trabajo',
      items: [
        {
          title: '[Placeholder] Cómo pienso',
          text: '[Placeholder] Enfoque estratégico: el diseño como herramienta para resolver problemas de negocio.',
        },
        {
          title: '[Placeholder] Cómo trabajo',
          text: '[Placeholder] Metodología: investigación, estrategia, diseño, iteración y medición.',
        },
        {
          title: '[Placeholder] Qué resuelvo',
          text: '[Placeholder] Tipos de problemas que resuelvo: marca, comunicación, posicionamiento, conversión.',
        },
      ],
    },
    projects: {
      label: 'proyectos',
      title: '[Placeholder] Trabajo seleccionado',
      intro: '[Placeholder] Introducción breve a los casos de estudio.',
      view: 'ver caso de estudio',
    },
    project: {
      challenge: 'desafío',
      objective: 'objetivo',
      role: 'mi rol',
      strategy: 'estrategia',
      process: 'proceso',
      results: 'resultados',
      gallery: 'galería',
      caseStudies: 'casos de estudio',
      next: 'próximo proyecto',
      viewCase: 'ver caso',
      imagePlaceholder: 'imagen',
      videoPlaceholder: 'video',
      relatedExperience: 'experiencia relacionada',
    },
    experience: {
      label: 'experiencia',
      title: '[Placeholder] Trayectoria profesional',
      responsibilities: 'responsabilidades',
      achievements: 'logros',
      tools: 'herramientas',
      viewProject: 'ver proyecto en el portafolio',
    },
    services: {
      label: 'servicios',
      title: '[Placeholder] Qué puedo hacer por tu negocio',
    },
    tools: {
      label: 'herramientas',
      title: '[Placeholder] Software y herramientas',
    },
    contact: {
      label: 'contacto',
      title: '[Placeholder] Hablemos',
      text: '[Placeholder] Invitación breve a conversar sobre un proyecto o una colaboración.',
      emailLabel: 'correo',
      email: '[correo@placeholder.com]',
      socialLabel: 'redes',
      socials: [
        { name: '[Red social 1]', url: '#' },
        { name: '[Red social 2]', url: '#' },
        { name: '[Red social 3]', url: '#' },
      ],
    },
  },
} as const;
