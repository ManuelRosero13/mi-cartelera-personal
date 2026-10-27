import type { ConfiguracionImagenes, Obra, PaginaBusqueda, DetalleObra, IntegranteElenco, TipoMedio } from '../types';
const BASE = 'https://api.themoviedb.org/3';
let configuracion: ConfiguracionImagenes | undefined;
function objeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}
async function pedir(ruta: string): Promise<unknown> {
  const token = process.env.EXPO_PUBLIC_TMDB_TOKEN?.trim();
  if (!token) throw new Error('Falta configurar el token de TMDB.');
  const controlador = new AbortController();
  const tiempo = setTimeout(() => controlador.abort(), 15000);
  try {
    const respuesta = await fetch(`${BASE}${ruta}`, { headers: { Authorization: `Bearer ${token}` }, signal: controlador.signal });
    if (respuesta.status === 401 || respuesta.status === 403) throw new Error('TMDB no autorizó la consulta. Revisa el token configurado.');
    if (respuesta.status === 429) throw new Error('TMDB recibió demasiadas consultas. Espera un momento e inténtalo de nuevo.');
    if (respuesta.status === 404) throw new Error('Esta obra ya no está disponible en TMDB.');
    if (!respuesta.ok) throw new Error('TMDB no está disponible en este momento. Inténtalo de nuevo.');
    return await respuesta.json();
  } catch (error: unknown) {
    if (controlador.signal.aborted) throw new Error('La consulta tardó demasiado. Revisa tu conexión e inténtalo de nuevo.');
    if (error instanceof TypeError) throw new Error('No se pudo conectar con TMDB. Revisa tu conexión a internet.');
    throw error;
  } finally { clearTimeout(tiempo); }
}
export function normalizarPagina(datos: unknown): PaginaBusqueda {
  if (!objeto(datos) || !Array.isArray(datos.results) || typeof datos.page !== 'number' || typeof datos.total_pages !== 'number') throw new Error('TMDB devolvió una respuesta inesperada.');
  const resultados: Obra[] = [];
  for (const obra of datos.results) {
    if (!objeto(obra) || (obra.media_type !== 'movie' && obra.media_type !== 'tv') || typeof obra.id !== 'number') continue;
    const titulo = obra.media_type === 'movie' ? obra.title : obra.name;
    const fecha = obra.media_type === 'movie' ? obra.release_date : obra.first_air_date;
    resultados.push({ tmdbId: obra.id, tipo: obra.media_type, titulo: typeof titulo === 'string' && titulo.trim() ? titulo : 'Sin título', anio: typeof fecha === 'string' ? fecha.slice(0, 4) : '', posterPath: typeof obra.poster_path === 'string' ? obra.poster_path : null });
  }
  return { pagina: datos.page, totalPaginas: Math.min(datos.total_pages, 500), resultados };
}
export async function buscar(titulo: string, pagina = 1): Promise<PaginaBusqueda> {
  if (!titulo.trim()) return { pagina: 1, totalPaginas: 0, resultados: [] };
  return normalizarPagina(await pedir(`/search/multi?query=${encodeURIComponent(titulo.trim())}&page=${pagina}&language=es-ES&include_adult=false`));
}
export async function obtenerConfiguracion(): Promise<ConfiguracionImagenes> {
  if (configuracion) return configuracion;
  const datos = await pedir('/configuration');
  if (!objeto(datos) || !objeto(datos.images) || typeof datos.images.secure_base_url !== 'string' || !Array.isArray(datos.images.poster_sizes)) throw new Error('No se pudo obtener la configuración de imágenes.');
  configuracion = { secure_base_url: datos.images.secure_base_url, poster_sizes: datos.images.poster_sizes.filter((valor): valor is string => typeof valor === 'string') };
  return configuracion;
}
export function urlImagen(path: string | null, config: ConfiguracionImagenes | null, detalle = false): string | null {
  if (!path || !config) return null;
  const preferido = detalle ? 'w500' : 'w185';
  const tamano = config.poster_sizes.includes(preferido) ? preferido : config.poster_sizes[0];
  return tamano ? `${config.secure_base_url}${tamano}${path}` : null;
}


export function normalizarDetalle(datos: unknown, tipo: TipoMedio): DetalleObra {
  if (!objeto(datos) || typeof datos.id !== 'number') throw new Error('TMDB devolvió un detalle inesperado.');
  const titulo = tipo === 'movie' ? datos.title : datos.name;
  const fecha = tipo === 'movie' ? datos.release_date : datos.first_air_date;
  const elenco: IntegranteElenco[] = [];
  if (objeto(datos.credits) && Array.isArray(datos.credits.cast)) {
    for (const actor of datos.credits.cast) {
      if (!objeto(actor) || typeof actor.id !== 'number' || typeof actor.name !== 'string') continue;
      elenco.push({ id: actor.id, nombre: actor.name, personaje: typeof actor.character === 'string' && actor.character.trim() ? actor.character : 'Personaje no disponible' });
    }
  }
  return {
    tmdbId: datos.id, tipo,
    titulo: typeof titulo === 'string' && titulo.trim() ? titulo : 'Sin título',
    anio: typeof fecha === 'string' ? fecha.slice(0, 4) : '',
    posterPath: typeof datos.poster_path === 'string' && datos.poster_path ? datos.poster_path : null,
    sinopsis: typeof datos.overview === 'string' && datos.overview.trim() ? datos.overview : 'No hay sinopsis disponible en español.',
    calificacionTmdb: typeof datos.vote_average === 'number' && Number.isFinite(datos.vote_average) && datos.vote_average >= 0 && datos.vote_average <= 10 && typeof datos.vote_count === 'number' && datos.vote_count > 0 ? datos.vote_average : null,
    elenco,
  };
}
export async function obtenerDetalle(tipo: TipoMedio, id: number): Promise<DetalleObra> {
  if ((tipo !== 'movie' && tipo !== 'tv') || !Number.isInteger(id) || id <= 0) throw new Error('La obra solicitada no es válida.');
  return normalizarDetalle(await pedir(`/${tipo}/${id}?language=es-ES&append_to_response=credits`), tipo);
}
