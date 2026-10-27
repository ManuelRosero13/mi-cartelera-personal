import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { obtenerAuth } from '../firebase/config';
import type { Usuario } from '../types';
export function observarSesion(cambio: (usuario: Usuario | null) => void, fallo: (error: unknown) => void) {
  return onAuthStateChanged(obtenerAuth(), user => cambio(user ? { uid: user.uid, email: user.email } : null), fallo);
}
export async function registrar(correo: string, clave: string): Promise<void> {
  await createUserWithEmailAndPassword(obtenerAuth(), correo.trim(), clave);
}
export async function ingresar(correo: string, clave: string): Promise<void> {
  await signInWithEmailAndPassword(obtenerAuth(), correo.trim(), clave);
}
export async function salir(): Promise<void> { await signOut(obtenerAuth()); }
