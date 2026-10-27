const fs = require('node:fs');
const assert = require('node:assert/strict');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, collection, getDoc, getDocs, setDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp, setLogLevel } = require('firebase/firestore');
// La prueba solo puede conectarse al emulador de demostración en loopback.
const projectId = 'demo-mi-cartelera-reglas';
if (process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:18088') {
  throw new Error('Ejecuta npm run test:rules: se requiere el emulador local en 127.0.0.1:18088.');
}
setLogLevel('silent');
const resultados = [];
(async () => {
  const entorno = await initializeTestEnvironment({ projectId, firestore: { host: '127.0.0.1', port: 18088, rules: fs.readFileSync('firestore.rules', 'utf8') } });
  const a = entorno.authenticatedContext('usuarioA').firestore();
  const b = entorno.authenticatedContext('usuarioB').firestore();
  const anon = entorno.unauthenticatedContext().firestore();
  const ruta = 'usuarios/usuarioA/mi_lista/movie_550';
  const ref = db => doc(db, ruta);
  const datos = () => ({ tmdbId: 550, tipo: 'movie', titulo: 'Obra de prueba', anio: '1999', posterPath: null, estado: 'por_ver', calificacionPersonal: null, comentario: '', agregadoEn: serverTimestamp(), actualizadoEn: serverTimestamp() });
  async function caso(nombre, accion) {
    await entorno.clearFirestore();
    await entorno.withSecurityRulesDisabled(async ctx => {
      await setDoc(ref(ctx.firestore()), { ...datos(), agregadoEn: Timestamp.fromMillis(1000), actualizadoEn: Timestamp.fromMillis(1000) });
    });
    try { await accion(); resultados.push({ prueba: nombre, resultado: 'correcto' }); console.log('OK: ' + nombre); }
    catch (error) { resultados.push({ prueba: nombre, resultado: 'fallo' }); throw error; }
  }
  try {
    await caso('Propietario puede leer su documento', () => assertSucceeds(getDoc(ref(a))));
    await caso('Propietario puede consultar su lista', () => assertSucceeds(getDocs(collection(a, 'usuarios/usuarioA/mi_lista'))));
    await caso('Otra cuenta no puede leer el documento', () => assertFails(getDoc(ref(b))));
    await caso('Otra cuenta no puede consultar la lista', () => assertFails(getDocs(collection(b, 'usuarios/usuarioA/mi_lista'))));
    await caso('Sin sesión no se puede leer', () => assertFails(getDoc(ref(anon))));
    await caso('Otra cuenta no puede actualizar comentario', () => assertFails(updateDoc(ref(b), { comentario: 'Ajeno', actualizadoEn: serverTimestamp() })));
    await caso('Otra cuenta no puede borrar', () => assertFails(deleteDoc(ref(b))));
    await caso('Sin sesión no se puede actualizar', () => assertFails(updateDoc(ref(anon), { comentario: 'Ajeno', actualizadoEn: serverTimestamp() })));
    await caso('Propietario puede actualizar estado y comentario', () => assertSucceeds(updateDoc(ref(a), { estado: 'viendo', comentario: 'En curso', actualizadoEn: serverTimestamp() })));
    await caso('Propietario puede borrar', () => assertSucceeds(deleteDoc(ref(a))));
    for (const nota of [1, 5]) await caso(`Vista permite nota ${nota}`, () => assertSucceeds(updateDoc(ref(a), { estado: 'vista', calificacionPersonal: nota, actualizadoEn: serverTimestamp() })));
    for (const nota of [0, 6]) await caso(`Rechaza nota ${nota}`, () => assertFails(updateDoc(ref(a), { estado: 'vista', calificacionPersonal: nota, actualizadoEn: serverTimestamp() })));
    for (const estado of ['por_ver','viendo']) await caso(`Rechaza calificación en ${estado}`, () => assertFails(updateDoc(ref(a), { estado, calificacionPersonal: 4, actualizadoEn: serverTimestamp() })));
    await caso('Permite comentario de 500 caracteres', () => assertSucceeds(updateDoc(ref(a), { comentario: 'a'.repeat(500), actualizadoEn: serverTimestamp() })));
    await caso('Rechaza comentario de 501 caracteres', () => assertFails(updateDoc(ref(a), { comentario: 'a'.repeat(501), actualizadoEn: serverTimestamp() })));
    await caso('Rechaza estado desconocido', () => assertFails(updateDoc(ref(a), { estado: 'otro', actualizadoEn: serverTimestamp() })));
    for (const [campo, valor] of [['tmdbId',551],['tipo','tv'],['titulo','Modificado'],['agregadoEn',Timestamp.fromMillis(5000)],['campoExtra',true]]) {
      await caso(`Rechaza cambio de ${campo}`, () => assertFails(updateDoc(ref(a), { [campo]: valor, actualizadoEn: serverTimestamp() })));
    }
    await caso('Rechaza fecha de actualización arbitraria', () => assertFails(updateDoc(ref(a), { comentario: 'Cambio', actualizadoEn: Timestamp.fromMillis(5000) })));
    await caso('Creación válida con fecha del servidor', async () => {
      await assertSucceeds(deleteDoc(ref(a)));
      await assertSucceeds(setDoc(ref(a), datos()));
      assert.equal((await getDoc(ref(a))).data().estado, 'por_ver');
    });
    await caso('Otra cuenta no puede crear en lista ajena', async () => {
      await deleteDoc(ref(a)); await assertFails(setDoc(ref(b), datos()));
    });
    await caso('Rechaza creación con estado inicial vista', async () => {
      await deleteDoc(ref(a)); await assertFails(setDoc(ref(a), { ...datos(), estado: 'vista' }));
    });
    await caso('Rechaza identificador distinto de tipo_tmdbId', () => assertFails(setDoc(doc(a, 'usuarios/usuarioA/mi_lista/movie_551'), datos())));
    await caso('Rechaza campo obligatorio ausente', async () => {
      await deleteDoc(ref(a)); const d = datos(); delete d.anio; await assertFails(setDoc(ref(a), d));
    });
  } finally {
    await entorno.cleanup();
    fs.writeFileSync('docs/pruebas-reglas.json', JSON.stringify({ entorno: 'Emulador local de Firestore; no producción', proyecto: projectId, reglasSha256: require('node:crypto').createHash('sha256').update(fs.readFileSync('firestore.rules')).digest('hex'), resultados }, null, 2) + '\n');
  }
  console.log(`Completadas ${resultados.length} pruebas de reglas.`);
})().catch(error => { console.error(error); process.exitCode = 1; });

