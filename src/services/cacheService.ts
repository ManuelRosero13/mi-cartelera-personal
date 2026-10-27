import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ItemLista } from '../types';
import { claveCache, codificarCache, decodificarCache } from './cacheModel';
// Serializar por cuenta evita que una escritura antigua termine después de otra nueva.
const pendientes = new Map<string, Promise<void>>();
export async function leerCache(uid: string): Promise<ItemLista[] | null> {
  await pendientes.get(uid)?.catch(() => {});
  return decodificarCache(uid, await AsyncStorage.getItem(claveCache(uid)));
}
export function guardarCache(uid: string, items: ItemLista[]): Promise<void> {
  const texto = codificarCache(uid, items);
  const operacion = (pendientes.get(uid) ?? Promise.resolve()).catch(() => {}).then(() => AsyncStorage.setItem(claveCache(uid), texto));
  pendientes.set(uid, operacion);
  const limpiar = () => { if (pendientes.get(uid) === operacion) pendientes.delete(uid); };
  void operacion.then(limpiar, limpiar);
  return operacion;
}
