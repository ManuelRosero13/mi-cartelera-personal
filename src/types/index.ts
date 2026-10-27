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

export interface IntegranteElenco { id: number; nombre: string; personaje: string }
export interface DetalleObra extends Obra {
  sinopsis: string;
  calificacionTmdb: number | null;
  elenco: IntegranteElenco[];
}
export type RutasPila = {
  Login: undefined;
  Inicio: undefined;
  Detalle: { tipo: TipoMedio; id: number };
  Editar: { id: string };
};

export type EstadoVisto = 'por_ver' | 'viendo' | 'vista';
export const ETIQUETA_ESTADO: Record<EstadoVisto, string> = {
  por_ver: 'Por ver', viendo: 'Viendo', vista: 'Vista',
};
export interface ItemLista extends Obra {
  id: string;
  estado: EstadoVisto;
  calificacionPersonal: number | null;
  comentario: string;
}

export type EdicionEntrada = Pick<ItemLista, 'estado' | 'calificacionPersonal' | 'comentario'>;

