/**
 * Sistema de internacionalización mínimo y escalable.
 * Hoy solo existe `es`; al añadir inglés bastará con crear `en.ts`
 * (mismas claves) y registrarlo en `dictionaries`.
 */
import es from './es';

const dictionaries = { es } as const;

export type Lang = keyof typeof dictionaries;
export const defaultLang: Lang = 'es';

export function useTranslations(lang: Lang = defaultLang) {
  return dictionaries[lang];
}
