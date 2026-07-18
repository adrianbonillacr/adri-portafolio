/**
 * Detección automática de medios en `public/portfolio/`.
 *
 * Convención de carpetas por proyecto (o caso de estudio anidado):
 *
 *   public/portfolio/<id>/hero.jpg          → imagen principal
 *   public/portfolio/<id>/gallery/01.jpg    → galería (imágenes y videos, orden alfabético)
 *   public/portfolio/<id>/videos/hero.mp4   → videos con nombre semántico (hero, process, reel…)
 *
 * Los componentes consultan estas funciones en build/dev: si el archivo
 * existe se sirve; si no, se muestra un placeholder. Agregar medios nunca
 * requiere tocar código — basta con colocar los archivos en la carpeta.
 */
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_ROOT = path.resolve('public');
const PORTFOLIO_ROOT = 'portfolio';

const IMAGE_EXTENSIONS = ['.avif', '.webp', '.jpg', '.jpeg', '.png'];
const VIDEO_EXTENSIONS = ['.webm', '.mp4'];

export type GalleryItem =
  | { type: 'image'; src: string; name: string }
  | { type: 'video'; src: string; name: string };

export interface ProjectMedia {
  /** URL pública de la imagen hero, o null si aún no existe. */
  hero: string | null;
  /** URL pública del video hero (`videos/hero.*`), o null si aún no existe. */
  heroVideo: string | null;
  /** Elementos de `gallery/` (imágenes y videos) en orden alfabético. */
  gallery: GalleryItem[];
  /** Videos de `videos/` indexados por nombre de archivo sin extensión. */
  videos: Record<string, string>;
}

function toPublicUrl(...segments: string[]): string {
  return '/' + [PORTFOLIO_ROOT, ...segments].join('/');
}

function listDir(relativeDir: string): string[] {
  const absolute = path.join(PUBLIC_ROOT, PORTFOLIO_ROOT, relativeDir);
  if (!fs.existsSync(absolute)) return [];
  return fs
    .readdirSync(absolute)
    .filter((entry) => fs.statSync(path.join(absolute, entry)).isFile())
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
}

function findByBaseName(
  relativeDir: string,
  baseName: string,
  extensions: string[]
): string | null {
  for (const ext of extensions) {
    const candidate = path.join(PUBLIC_ROOT, PORTFOLIO_ROOT, relativeDir, `${baseName}${ext}`);
    if (fs.existsSync(candidate)) {
      return toPublicUrl(...relativeDir.split('/').filter(Boolean), `${baseName}${ext}`);
    }
  }
  return null;
}

/**
 * Lee los medios disponibles para un proyecto (`"distrito11"`) o un caso
 * de estudio anidado (`"advanced/proyecto-1"`).
 */
export function getProjectMedia(mediaId: string): ProjectMedia {
  const segments = mediaId.split('/').filter(Boolean);

  const hero = findByBaseName(mediaId, 'hero', IMAGE_EXTENSIONS);
  const heroVideo = findByBaseName(`${mediaId}/videos`, 'hero', VIDEO_EXTENSIONS);

  const gallery: GalleryItem[] = listDir(`${mediaId}/gallery`).flatMap((file) => {
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, ext);
    const src = toPublicUrl(...segments, 'gallery', file);
    if (IMAGE_EXTENSIONS.includes(ext)) return [{ type: 'image' as const, src, name }];
    if (VIDEO_EXTENSIONS.includes(ext)) return [{ type: 'video' as const, src, name }];
    return [];
  });

  const videos: Record<string, string> = {};
  for (const file of listDir(`${mediaId}/videos`)) {
    const ext = path.extname(file).toLowerCase();
    if (!VIDEO_EXTENSIONS.includes(ext)) continue;
    videos[path.basename(file, ext)] = toPublicUrl(...segments, 'videos', file);
  }

  return { hero, heroVideo, gallery, videos };
}
