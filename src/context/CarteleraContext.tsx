import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as servicio from '../services/authService';
import { mensajeAuth } from '../services/authValidation';
import type { EstadoSesion } from '../types';
interface Contexto { sesion: EstadoSesion; ingresar: typeof servicio.ingresar; registrar: typeof servicio.registrar; salir: typeof servicio.salir; reintentar: () => void }
const Context = createContext<Contexto | undefined>(undefined);
export function CarteleraProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<EstadoSesion>({ tipo: 'cargando' });
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    setSesion({ tipo: 'cargando' });
    try {
      return servicio.observarSesion(usuario => setSesion({ tipo: 'exito', usuario }), error => setSesion({ tipo: 'error', mensaje: mensajeAuth(error) }));
    } catch {
      setSesion({ tipo: 'error', mensaje: 'No se pudo iniciar Firebase. Revisa los valores de .env y reinicia Expo.' });
    }
  }, [intento]);
  return <Context.Provider value={{ sesion, ingresar: servicio.ingresar, registrar: servicio.registrar, salir: servicio.salir, reintentar: () => setIntento(value => value + 1) }}>{children}</Context.Provider>;
}
export function useCartelera(): Contexto {
  const context = useContext(Context);
  if (!context) throw new Error('useCartelera requiere CarteleraProvider');
  return context;
}
