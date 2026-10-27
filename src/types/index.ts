export interface Usuario { uid: string; email: string | null }
export type EstadoSesion =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'exito'; usuario: Usuario | null };
