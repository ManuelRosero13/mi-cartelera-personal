import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import * as servicio from '../services/authService';
import { mensajeAuth } from '../services/authValidation';
import type { EstadoSesion, EstadoPeticion, ItemLista, Obra, EdicionEntrada } from '../types';
import * as listaServicio from '../services/listaService';
import { mensajeLista } from '../services/listaModel';
import { leerCache, guardarCache } from '../services/cacheService';
import { observarConexion } from '../services/conexionService';
interface Contexto {
  lista: EstadoPeticion<ItemLista[]>;
  avisoLista: string;
  sinConexion: boolean;
  actualizar: (id: string, datos: EdicionEntrada) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
  agregar: (obra: Obra) => Promise<boolean>;
  recargarLista: () => void;
  sesion: EstadoSesion;
  ingresar: typeof servicio.ingresar;
  registrar: typeof servicio.registrar;
  salir: typeof servicio.salir;
  reintentar: () => void;
}
interface DatosLista { uid: string; estado: EstadoPeticion<ItemLista[]>; aviso: string }
const Context = createContext<Contexto | undefined>(undefined);
export function CarteleraProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<EstadoSesion>({ tipo: 'cargando' });
  const [intento, setIntento] = useState(0);
  const [conexion, setConexion] = useState<boolean | null>(null);
  const uid = sesion.tipo === 'exito' ? sesion.usuario?.uid : undefined;
  const [versionLista, setVersionLista] = useState(0);
  const [datosLista, setDatosLista] = useState<DatosLista | null>(null);
  const ultima = useRef<DatosLista | null>(null);
  const lista: EstadoPeticion<ItemLista[]> = uid && datosLista?.uid === uid ? datosLista.estado : { tipo: 'cargando' };
  const avisoLista = uid && datosLista?.uid === uid ? datosLista.aviso : '';
  useEffect(() => observarConexion(setConexion), []);
  useEffect(() => {
    if (!uid) { ultima.current = null; setDatosLista(null); return; }
    let activo = true;
    let confirmada = false;
    let copia = ultima.current?.uid === uid && ultima.current.estado.tipo === 'exito' ? ultima.current.estado.datos : null;
    const avisoCopia = conexion === false ? 'Sin conexión: mostrando la última copia guardada. Los cambios requieren internet.' : 'Mostrando la última copia mientras se actualiza con el servidor.';
    const guardar = (estado: EstadoPeticion<ItemLista[]>, aviso = '') => {
      if (!activo) return;
      const datos = { uid, estado, aviso };
      ultima.current = datos; setDatosLista(datos);
    };
    if (copia) guardar({ tipo: 'exito', datos: copia }, avisoCopia);
    else guardar({ tipo: 'cargando' });
    const cargaCache = leerCache(uid).then(datos => {
      if (!activo || confirmada) return;
      // La memoria confirmada más reciente prevalece sobre una lectura de disco.
      if (copia === null && datos !== null) copia = datos;
      if (copia !== null) guardar({ tipo: 'exito', datos: copia }, avisoCopia);
      else if (conexion === false) guardar({ tipo: 'error', mensaje: 'Sin conexión y sin copia guardada para esta cuenta. Conéctate para cargar tu lista.' });
    }).catch(() => {
      if (!activo || confirmada) return;
      if (copia !== null) guardar({ tipo: 'exito', datos: copia }, avisoCopia);
      else if (conexion === false) guardar({ tipo: 'error', mensaje: 'No se pudo leer la copia local. Conéctate para recuperar tu lista.' });
    });
    if (conexion === false) return () => { activo = false; };
    let cancelar: (() => void) | undefined;
    const fallo = async (error: unknown) => {
      await cargaCache;
      if (!activo) return;
      const denegado = typeof error === 'object' && error !== null && 'code' in error && (error.code === 'permission-denied' || error.code === 'unauthenticated');
      if (copia !== null && !denegado) guardar({ tipo: 'exito', datos: copia }, `${mensajeLista(error)} Mostrando la última copia guardada.`);
      else guardar({ tipo: 'error', mensaje: mensajeLista(error) });
    };
    try {
      cancelar = listaServicio.observarLista(uid, datos => {
        if (!activo) return;
        confirmada = true; copia = datos;
        guardar({ tipo: 'exito', datos });
        // Cada snapshot confirmado incluye altas, cambios y bajas y actualiza la caché.
        void guardarCache(uid, datos).catch(() => {
          if (activo) guardar({ tipo: 'exito', datos: copia ?? datos }, 'La lista está en Firestore, pero no se pudo guardar la copia sin conexión.');
        });
      }, error => { void fallo(error); });
    } catch (error: unknown) { void fallo(error); }
    return () => { activo = false; cancelar?.(); };
  }, [uid, versionLista, conexion]);
  function usuarioParaEscribir(): string {
    if (!uid) throw new Error('Inicia sesión para modificar tu lista.');
    if (conexion === false) throw new Error('Sin conexión. Conéctate para guardar cambios en tu lista.');
    return uid;
  }
  async function agregar(obra: Obra): Promise<boolean> { return listaServicio.agregar(usuarioParaEscribir(), obra); }
  async function actualizar(id: string, datos: EdicionEntrada): Promise<void> { await listaServicio.actualizar(usuarioParaEscribir(), id, datos); }
  async function eliminar(id: string): Promise<void> { await listaServicio.eliminar(usuarioParaEscribir(), id); }
  useEffect(() => {
    setSesion({ tipo: 'cargando' });
    try { return servicio.observarSesion(usuario => setSesion({ tipo: 'exito', usuario }), error => setSesion({ tipo: 'error', mensaje: mensajeAuth(error) })); }
    catch { setSesion({ tipo: 'error', mensaje: 'No se pudo iniciar Firebase. Revisa los valores de .env y reinicia Expo.' }); }
  }, [intento]);
  return <Context.Provider value={{ lista, avisoLista, sinConexion: conexion === false, agregar, actualizar, eliminar, recargarLista: () => setVersionLista(value => value + 1), sesion, ingresar: servicio.ingresar, registrar: servicio.registrar, salir: servicio.salir, reintentar: () => setIntento(value => value + 1) }}>{children}</Context.Provider>;
}
export function useCartelera(): Contexto {
  const context = useContext(Context);
  if (!context) throw new Error('useCartelera requiere CarteleraProvider');
  return context;
}

