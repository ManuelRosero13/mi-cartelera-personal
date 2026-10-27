import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as servicio from '../services/authService';
import { mensajeAuth } from '../services/authValidation';
import type { EstadoSesion, EstadoPeticion, ItemLista, Obra } from '../types';
import * as listaServicio from '../services/listaService';
import { mensajeLista } from '../services/listaModel';
interface Contexto { lista: EstadoPeticion<ItemLista[]>; agregar: (obra: Obra) => Promise<boolean>; recargarLista: () => void; sesion: EstadoSesion; ingresar: typeof servicio.ingresar; registrar: typeof servicio.registrar; salir: typeof servicio.salir; reintentar: () => void }
const Context = createContext<Contexto | undefined>(undefined);
export function CarteleraProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<EstadoSesion>({ tipo: 'cargando' });
  const [intento, setIntento] = useState(0);
  const uid = sesion.tipo === 'exito' ? sesion.usuario?.uid : undefined;
  const [versionLista, setVersionLista] = useState(0);
  const [datosLista, setDatosLista] = useState<{ uid: string; estado: EstadoPeticion<ItemLista[]> } | null>(null);
  const lista: EstadoPeticion<ItemLista[]> = uid && datosLista?.uid === uid ? datosLista.estado : { tipo: 'cargando' };
  useEffect(() => {
    if (!uid) { setDatosLista(null); return; }
    let activo = true;
    const guardar = (estado: EstadoPeticion<ItemLista[]>) => { if (activo) setDatosLista({ uid, estado }); };
    guardar({ tipo: 'cargando' });
    let cancelar: (() => void) | undefined;
    try { cancelar = listaServicio.observarLista(uid, datos => guardar({ tipo: 'exito', datos }), error => guardar({ tipo: 'error', mensaje: mensajeLista(error) })); }
    catch (error: unknown) { guardar({ tipo: 'error', mensaje: mensajeLista(error) }); }
    return () => { activo = false; cancelar?.(); };
  }, [uid, versionLista]);
  async function agregar(obra: Obra): Promise<boolean> {
    if (!uid) throw new Error('Inicia sesión para guardar una obra.');
    return listaServicio.agregar(uid, obra);
  }
  useEffect(() => {
    setSesion({ tipo: 'cargando' });
    try {
      return servicio.observarSesion(usuario => setSesion({ tipo: 'exito', usuario }), error => setSesion({ tipo: 'error', mensaje: mensajeAuth(error) }));
    } catch {
      setSesion({ tipo: 'error', mensaje: 'No se pudo iniciar Firebase. Revisa los valores de .env y reinicia Expo.' });
    }
  }, [intento]);
  return <Context.Provider value={{ lista, agregar, recargarLista: () => setVersionLista(value => value + 1), sesion, ingresar: servicio.ingresar, registrar: servicio.registrar, salir: servicio.salir, reintentar: () => setIntento(value => value + 1) }}>{children}</Context.Provider>;
}
export function useCartelera(): Contexto {
  const context = useContext(Context);
  if (!context) throw new Error('useCartelera requiere CarteleraProvider');
  return context;
}

