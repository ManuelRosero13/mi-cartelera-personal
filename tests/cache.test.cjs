// Pruebas de caché sin dispositivo: sustituir solo el almacenamiento nativo.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const memoria = new Map();
let falla = false;
const storage = {
  getItem: async key => memoria.get(key) ?? null,
  setItem: async (key, value) => {
    if (falla) { falla = false; throw new Error('disco no disponible'); }
    await new Promise(resolve => setTimeout(resolve, 5));
    memoria.set(key, value);
  },
};
const cargar = Module._load;
Module._load = function(id, parent, main) {
  return id === '@react-native-async-storage/async-storage' ? storage : cargar.call(this, id, parent, main);
};
Module._extensions['.ts'] = (mod, nombre) => {
  const result = ts.transpileModule(fs.readFileSync(nombre, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } });
  mod._compile(result.outputText, nombre);
};
const { crearEntrada, validarEdicion, filtrarLista } = require('../src/services/listaModel.ts');
const { claveCache, codificarCache, decodificarCache } = require('../src/services/cacheModel.ts');
const { leerCache, guardarCache } = require('../src/services/cacheService.ts');
(async () => {
  const item = crearEntrada({ tmdbId: 1, tipo: 'movie', titulo: 'Prueba', anio: '', posterPath: null });
  assert.notEqual(claveCache('A'), claveCache('B'));
  assert.equal(decodificarCache('A', null), null);
  assert.throws(() => decodificarCache('B', codificarCache('A', [item])));
  assert.throws(() => decodificarCache('A', '{'));
  assert.throws(() => decodificarCache('A', JSON.stringify({ version: 2, uid: 'A', items: [] })));
  assert.throws(() => decodificarCache('A', codificarCache('A', [{ ...item, estado: 'invalido' }])));
  await guardarCache('A', [item]);
  assert.deepEqual(await leerCache('A'), [item]);
  assert.equal(await leerCache('B'), null);
  await Promise.all([guardarCache('A', [item]), guardarCache('A', [])]);
  assert.deepEqual(await leerCache('A'), []);
  assert.equal(await leerCache('B'), null);
  falla = true;
  await assert.rejects(guardarCache('A', [item]));
  await guardarCache('A', [item]);
  assert.deepEqual(await leerCache('A'), [item]);
  const vista = { estado: 'vista', calificacionPersonal: 5, comentario: 'x'.repeat(500) };
  assert.deepEqual(validarEdicion(vista), vista);
  for (const nota of [0, 6, NaN, Infinity]) assert.throws(() => validarEdicion({ ...vista, calificacionPersonal: nota }));
  for (const estado of ['por_ver', 'viendo']) assert.throws(() => validarEdicion({ ...vista, estado }));
  assert.throws(() => validarEdicion({ ...vista, comentario: 'x'.repeat(501) }));
  assert.deepEqual(filtrarLista([item], 'por_ver', 'movie'), [item]);
  assert.deepEqual(filtrarLista([item], 'vista', 'tv'), []);
  console.log('Caché: aislamiento, corrupción, orden de escrituras, borrado, recuperación y reglas del modelo correctos.');
})().catch(error => { console.error(error); process.exitCode = 1; });
