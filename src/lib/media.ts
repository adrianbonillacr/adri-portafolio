/**
 * Detección automática de medios en `public/portfolio/`.
 *
 * Convención de carpetas por proyecto (o caso de estudio anidado):
 *
 *   public/portfolio/<id>/hero.jpg          → imagen principal
 *   public/portfolio/<id>/card.jpg          → imagen opcional para la tarjeta del grid
 *   public/portfolio/<id>/gallery/01.jpg    → galería suelta (imágenes y videos, orden alfabético)
 *   public/portfolio/<id>/gallery/Fotos/    → subcarpeta = categoría propia dentro de la galería,
 *                                             con su propio encabezado (se conserva la división
 *                                             en carpetas tal como el usuario las organiza)
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

const IMAGE_EXTENSIONS = ['.avif', '.webp', '.jpg', '.jpeg', '.png', '.gif'];
const VIDEO_EXTENSIONS = ['.webm', '.mp4'];

export type GalleryItem =
  | { type: 'image'; src: string; name: string }
  | { type: 'video'; src: string; name: string };

/** Una subcarpeta de `gallery/` renderizada como su propia sección con encabezado. */
export interface GalleryCategory {
  /** Nombre de la carpeta, usado tal cual como etiqueta visible (ej. "Fotos", "Historias"). */
  name: string;
  items: GalleryItem[];
}

export interface ProjectMedia {
  /** URL pública de la imagen hero, o null si aún no existe. */
  hero: string | null;
  /**
   * Imagen opcional para la tarjeta del grid (`card.*`, 4:3).
   * Si no existe, la tarjeta usa el hero con recorte centrado.
   */
  card: string | null;
  /** URL pública del video hero (`videos/hero.*`), o null si aún no existe. */
  heroVideo: string | null;
  /** Elementos sueltos directamente en `gallery/` (no dentro de una subcarpeta). */
  gallery: GalleryItem[];
  /** Subcarpetas de `gallery/`, cada una como su propia categoría con encabezado. */
  galleryCategories: GalleryCategory[];
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

function listSubdirs(relativeDir: string): string[] {
  const absolute = path.join(PUBLIC_ROOT, PORTFOLIO_ROOT, relativeDir);
  if (!fs.existsSync(absolute)) return [];
  return fs
    .readdirSync(absolute)
    .filter((entry) => fs.statSync(path.join(absolute, entry)).isDirectory())
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

function readGalleryItems(relativeDir: string, urlSegments: string[]): GalleryItem[] {
  return listDir(relativeDir).flatMap((file) => {
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, ext);
    const src = toPublicUrl(...urlSegments, file);
    if (IMAGE_EXTENSIONS.includes(ext)) return [{ type: 'image' as const, src, name }];
    if (VIDEO_EXTENSIONS.includes(ext)) return [{ type: 'video' as const, src, name }];
    return [];
  });
}

/**
 * Lee los medios disponibles para un proyecto (`"distrito11"`) o un caso
 * de estudio anidado (`"advance/eddie-bauer"`).
 */
export function getProjectMedia(mediaId: string): ProjectMedia {
  const segments = mediaId.split('/').filter(Boolean);

  const hero = findByBaseName(mediaId, 'hero', IMAGE_EXTENSIONS);
  const card = findByBaseName(mediaId, 'card', IMAGE_EXTENSIONS);
  const heroVideo = findByBaseName(`${mediaId}/videos`, 'hero', VIDEO_EXTENSIONS);

  const gallery = readGalleryItems(`${mediaId}/gallery`, [...segments, 'gallery']);

  const galleryCategories: GalleryCategory[] = listSubdirs(`${mediaId}/gallery`).map((folder) => ({
    name: folder,
    items: readGalleryItems(`${mediaId}/gallery/${folder}`, [...segments, 'gallery', folder]),
  }));

  const videos: Record<string, string> = {};
  for (const file of listDir(`${mediaId}/videos`)) {
    const ext = path.extname(file).toLowerCase();
    if (!VIDEO_EXTENSIONS.includes(ext)) continue;
    videos[path.basename(file, ext)] = toPublicUrl(...segments, 'videos', file);
  }

  return { hero, card, heroVideo, gallery, galleryCategories, videos };
}
