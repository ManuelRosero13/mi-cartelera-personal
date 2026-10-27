export interface Usuario { uid: string; email: string | null }
export type EstadoSesion =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'exito'; usuario: Usuario | null };

export type TipoMedio = 'movie' | 'tv';
export type EstadoPeticion<T> =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'exito'; datos: T };
export interface Obra {
  tmdbId: number;
  tipo: TipoMedio;
  titulo: string;
  anio: string;
  posterPath: string | null;
}
export interface PaginaBusqueda {
  pagina: number;
  totalPaginas: number;
  resultados: Obra[];
}
export interface ConfiguracionImagenes {
  secure_base_url: string;
  poster_sizes: string[];
}
