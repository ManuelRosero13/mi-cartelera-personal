import type { ItemLista } from '../types';
import { leerEntrada } from './listaModel';
export function claveCache(uid: string): string { return `@cartelera/lista/v1/${encodeURIComponent(uid)}`; }
export function codificarCache(uid: string, items: ItemLista[]): string {
  return JSON.stringify({ version: 1, uid, items });
}
export function decodificarCache(uid: string, texto: string | null): ItemLista[] | null {
  if (texto === null) return null;
  const valor: unknown = JSON.parse(texto);
  if (typeof valor !== 'object' || valor === null) throw new Error('Copia local no válida.');
  const datos = valor as Record<string, unknown>;
  if (datos.version !== 1 || datos.uid !== uid || !Array.isArray(datos.items)) throw new Error('La copia local no corresponde a esta cuenta.');
  return datos.items.map((item: unknown) => {
    if (typeof item !== 'object' || item === null || !('id' in item) || typeof item.id !== 'string') throw new Error('Entrada local no válida.');
    return leerEntrada(item.id, item);
  });
}
