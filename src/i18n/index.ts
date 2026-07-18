/**
 * Sistema de internacionalización.
 * `es` es el idioma base (rutas sin prefijo); `en` vive bajo /en/.
 * Los componentes derivan el idioma de la URL con `getLangFromUrl`,
 * sin necesidad de pasar props en cascada.
 */
import es from './es';
import en from './en';

const dictionaries = { es, en } as const;

export type Lang = keyof typeof dictionaries;
export const defaultLang: Lang = 'es';

export function useTranslations(lang: Lang = defaultLang) {
  return dictionaries[lang];
}

/** 'en' si la ruta vive bajo /en/, de lo contrario el idioma base. */
export function getLangFromUrl(url: URL): Lang {
  return url.pathname === '/en' || url.pathname.startsWith('/en/') ? 'en' : 'es';
}
