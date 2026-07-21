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
  | { type: 'image'; src: string; name: string; ratio?: string }
  | { type: 'video'; src: string; name: string; ratio?: string };

/**
 * Lee el tamaño real de una imagen leyendo solo su cabecera (sin decodificar).
 * Así cada pieza se muestra con su proporción verdadera —cuadrada, 4:5, 9:16—
 * en lugar de depender de convenciones en el nombre del archivo.
 */
function readImageSize(absolute: string): { w: number; h: number } | null {
  let buf: Buffer;
  try {
    buf = fs.readFileSync(absolute);
  } catch {
    return null;
  }

  const ext = path.extname(absolute).toLowerCase();

  if (ext === '.png') {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }

  if (ext === '.gif') {
    return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  }

  if (ext === '.webp') {
    const fourcc = buf.toString('ascii', 12, 16);
    if (fourcc === 'VP8X') return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
    if (fourcc === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (fourcc === 'VP8L') {
      const n = buf.readUInt32LE(21);
      return { w: 1 + (n & 0x3fff), h: 1 + ((n >> 14) & 0x3fff) };
    }
    return null;
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    // recorre los marcadores hasta el SOF, que lleva alto y ancho
    let offset = 2;
    while (offset < buf.length - 9) {
      if (buf[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buf[offset + 1];
      // SOF0–SOF15, excluyendo DHT(c4), JPGA(c8) y DAC(cc)
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { h: buf.readUInt16BE(offset + 5), w: buf.readUInt16BE(offset + 7) };
      }
      offset += 2 + buf.readUInt16BE(offset + 2);
    }
  }

  return null;
}

/** Cache por ruta: el build renderiza cada proyecto varias veces (ES/EN). */
const sizeCache = new Map<string, string | undefined>();

function ratioOf(absolute: string): string | undefined {
  if (sizeCache.has(absolute)) return sizeCache.get(absolute);
  const size = readImageSize(absolute);
  const ratio = size && size.w > 0 && size.h > 0 ? `${size.w} / ${size.h}` : undefined;
  sizeCache.set(absolute, ratio);
  return ratio;
}

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
    const absolute = path.join(PUBLIC_ROOT, PORTFOLIO_ROOT, relativeDir, file);
    if (IMAGE_EXTENSIONS.includes(ext)) {
      return [{ type: 'image' as const, src, name, ratio: ratioOf(absolute) }];
    }
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

  // Un prefijo numérico opcional en el nombre de la subcarpeta ("1 - Platillos")
  // controla el orden sin aparecer en la etiqueta visible.
  const stripOrderPrefix = (folder: string) => folder.replace(/^\d+\s*[-.)]\s*/, '');

  const galleryCategories: GalleryCategory[] = listSubdirs(`${mediaId}/gallery`).map((folder) => ({
    name: stripOrderPrefix(folder),
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
