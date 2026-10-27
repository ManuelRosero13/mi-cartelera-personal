import { collection, doc, getFirestore, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';
import { obtenerAuth } from '../firebase/config';
import type { ItemLista, Obra } from '../types';
import { crearEntrada, leerEntrada, validarEdicion } from './listaModel';
function base(uid: string) {
  const auth = obtenerAuth();
  if (!uid || auth.currentUser?.uid !== uid) throw new Error('Inicia sesión para acceder a tu lista.');
  return getFirestore(auth.app);
}
export function observarLista(uid: string, cambio: (items: ItemLista[]) => void, error: (fallo: unknown) => void): () => void {
  const db = base(uid);
  const timer = setTimeout(() => error(new Error('No se pudo confirmar tu lista con el servidor. Revisa tu conexión y pulsa Reintentar.')), 15000);
  const cancelar = onSnapshot(collection(db, 'usuarios', uid, 'mi_lista'), { includeMetadataChanges: true }, snapshot => {
    // No presentar una copia en memoria como una lectura confirmada del servidor.
    if (snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
    clearTimeout(timer);
    try { cambio(snapshot.docs.map(item => leerEntrada(item.id, item.data())).sort((a,b) => a.titulo.localeCompare(b.titulo))); }
    catch (fallo: unknown) { error(fallo); }
  }, fallo => { clearTimeout(timer); error(fallo); });
  return () => { clearTimeout(timer); cancelar(); };
}
export async function agregar(uid: string, obra: Obra): Promise<boolean> {
  const db = base(uid);
  const entrada = crearEntrada(obra);
  const { id, ...datos } = entrada;
  const referencia = doc(db, 'usuarios', uid, 'mi_lista', id);
  const limite = Date.now() + 15000;
  const operacion = runTransaction(db, async transaction => {
    if (Date.now() >= limite) throw new Error('Se agotó el tiempo de espera. Actualiza tu lista antes de reintentar.');
    const existente = await transaction.get(referencia);
    if (existente.exists()) return false;
    if (Date.now() >= limite) throw new Error('Se agotó el tiempo de espera. Actualiza tu lista antes de reintentar.');
    transaction.set(referencia, { ...datos, agregadoEn: serverTimestamp(), actualizadoEn: serverTimestamp() });
    return true;
  }, { maxAttempts: 3 });
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([operacion, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('No se pudo confirmar el guardado a tiempo. Revisa Mi lista antes de reintentar; la operación podría completarse.')), 15000);
    })]);
  } finally { if (timer) clearTimeout(timer); }
  // El timeout no cancela una operación enviada: el listener reconcilia el resultado.
}

async function modificar(uid: string, id: string, cambios: import('../types').EdicionEntrada | null): Promise<void> {
  if (!/^(movie|tv)_[1-9][0-9]*$/.test(id)) throw new Error('La entrada no es válida.');
  const db = base(uid);
  const referencia = doc(db, 'usuarios', uid, 'mi_lista', id);
  const limite = Date.now() + 15000;
  const operacion = runTransaction(db, async transaction => {
    if (Date.now() >= limite) throw new Error('Se agotó el tiempo de espera. Revisa tu lista antes de reintentar.');
    const actual = await transaction.get(referencia);
    if (!actual.exists()) {
      if (cambios === null) return;
      throw new Error('Esta entrada ya no está en tu lista.');
    }
    if (Date.now() >= limite) throw new Error('Se agotó el tiempo de espera. Revisa tu lista antes de reintentar.');
    if (cambios === null) transaction.delete(referencia);
    else transaction.update(referencia, { ...cambios, actualizadoEn: serverTimestamp() });
  }, { maxAttempts: 3 });
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([operacion, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('No se pudo confirmar el cambio a tiempo. Revisa Mi lista antes de reintentar; podría completarse.')), 15000);
    })]);
  } finally { if (timer) clearTimeout(timer); }
}
export function actualizar(uid: string, id: string, datos: import('../types').EdicionEntrada): Promise<void> {
  return modificar(uid, id, validarEdicion(datos));
}
export function eliminar(uid: string, id: string): Promise<void> { return modificar(uid, id, null); }

