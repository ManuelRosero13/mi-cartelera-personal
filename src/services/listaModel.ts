import type { ItemLista, Obra } from '../types';
export function crearEntrada(obra: Obra): ItemLista {
  if (!Number.isInteger(obra.tmdbId) || obra.tmdbId <= 0 || !['movie', 'tv'].includes(obra.tipo)) throw new Error('La obra no es válida.');
  if (!obra.titulo.trim() || obra.titulo.length > 200) throw new Error('El título debe tener entre 1 y 200 caracteres.');
  if (obra.anio !== '' && !/^[0-9]{4}$/.test(obra.anio)) throw new Error('El año de la obra no es válido.');
  if (obra.posterPath !== null && obra.posterPath.length > 500) throw new Error('La ruta del póster no es válida.');
  // Copiar únicamente los campos que admite Firestore; no incluir sinopsis/elenco.
  return { id: `${obra.tipo}_${obra.tmdbId}`, tmdbId: obra.tmdbId, tipo: obra.tipo, titulo: obra.titulo, anio: obra.anio, posterPath: obra.posterPath, estado: 'por_ver', calificacionPersonal: null, comentario: '' };
}
export function leerEntrada(id: string, valor: unknown): ItemLista {
  if (typeof valor !== 'object' || valor === null) throw new Error('Una entrada guardada no es válida.');
  const d = valor as Record<string, unknown>;
  if (typeof d.tmdbId !== 'number' || (d.tipo !== 'movie' && d.tipo !== 'tv') || typeof d.titulo !== 'string' || typeof d.anio !== 'string' || (d.posterPath !== null && typeof d.posterPath !== 'string') || !['por_ver','viendo','vista'].includes(String(d.estado)) || typeof d.comentario !== 'string' || d.comentario.length > 500 || !(d.calificacionPersonal === null || (d.estado === 'vista' && typeof d.calificacionPersonal === 'number' && d.calificacionPersonal >= 1 && d.calificacionPersonal <= 5))) throw new Error('Una entrada guardada no es válida.');
  const base = crearEntrada({ tmdbId: d.tmdbId, tipo: d.tipo, titulo: d.titulo, anio: d.anio, posterPath: d.posterPath });
  if (base.id !== id) throw new Error('El identificador de una entrada no es válido.');
  return { ...base, estado: d.estado as ItemLista['estado'], comentario: d.comentario, calificacionPersonal: d.calificacionPersonal as number | null };
}
export function mensajeLista(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    if (error.code === 'permission-denied') return 'No tienes permiso para acceder a esta lista. Comprueba las reglas publicadas en Firebase.';
    if (error.code === 'unavailable') return 'No se pudo conectar con Firestore. Revisa tu conexión.';
    if (error.code === 'unauthenticated') return 'Tu sesión ha caducado. Vuelve a iniciar sesión.';
    return 'No se pudo completar la operación en Firestore. Inténtalo de nuevo.';
  }
  return error instanceof Error ? error.message : 'No se pudo completar la operación.';
}
