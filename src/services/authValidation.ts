const mensajes: Record<string, string> = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-login-credentials': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'Escribe un correo electrónico válido.',
  'auth/email-already-in-use': 'Este correo ya tiene una cuenta. Inicia sesión.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/password-does-not-meet-requirements': 'La contraseña no cumple los requisitos del proyecto.',
  'auth/network-request-failed': 'No se pudo conectar. Revisa tu conexión a internet.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/operation-not-allowed': 'El acceso con correo y contraseña no está habilitado en Firebase.',
  'auth/invalid-api-key': 'La configuración de Firebase no es válida. Revisa el archivo .env.',
  'auth/app-not-authorized': 'Esta aplicación no está autorizada en Firebase.',
};
export function mensajeAuth(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
    return mensajes[error.code] ?? 'No se pudo completar la operación. Inténtalo de nuevo.';
  }
  return 'No se pudo completar la operación. Inténtalo de nuevo.';
}
export function validarFormulario(correo: string, clave: string, registro: boolean, confirmacion: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) return 'Escribe un correo electrónico válido.';
  if (!clave) return 'Escribe tu contraseña.';
  if (registro && clave.length < 6) return 'Usa una contraseña de al menos 6 caracteres.';
  if (registro && clave !== confirmacion) return 'Las contraseñas no coinciden.';
  return null;
}
