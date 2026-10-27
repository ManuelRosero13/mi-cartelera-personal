# Mi Cartelera Personal

## Objetivo y descripción
Aplicación móvil para buscar películas y series en TMDB y guardarlas en una lista privada, con estado de visionado, calificación y comentario personales. Integra React Native, Expo, TypeScript, Firebase Auth, Firestore y AsyncStorage.

## Estado actual
Base creada con la plantilla oficial blank-typescript: Expo SDK 58, React Native 0.88 y TypeScript estricto. Incluye registro, inicio y cierre de sesión con Firebase Auth, navegación condicional con React Navigation y persistencia con AsyncStorage. El usuario confirmó la autenticación y persistencia en iPhone. La búsqueda y el detalle de TMDB están implementados. Mi lista permite agregar y consultar obras; edición y caché sin conexión pendientes.

## Pantallas
- Login / Registro: validación y errores en español.
- Buscar: resultados con póster, título y año.
- Detalle de TMDB: sinopsis, calificación, elenco y agregar a la lista.
- Mi lista: filtros por estado y tipo.
- Editar mi entrada: estado, calificación, comentario y eliminación con confirmación.
- Acerca de: créditos de TMDB y cierre de sesión.

La navegación utilizará pila y pestañas, con acceso condicional según la sesión.

## Arquitectura prevista
- src/firebase/config.ts: inicialización.
- src/services/authService.ts: autenticación.
- src/services/tmdbService.ts: búsqueda, detalle e imágenes.
- src/services/listaService.ts: operaciones de Firestore.
- src/context/CarteleraContext.tsx: estado global y acciones.
- src/types/index.ts: tipos e interfaces.
- src/screens/: pantallas.
- src/components/: componentes reutilizables.

Solo la capa de servicios llamará a Firebase y TMDB. AsyncStorage guardará una copia por usuario para mostrar la última lista sin conexión con un aviso.

## Reglas de negocio
Los documentos se guardarán en usuarios/{uid}/mi_lista/{itemId}. El identificador combina tipo y tmdbId para evitar duplicados. Los estados serán por_ver, viendo y vista; el inicial será por_ver. La calificación será nula o de 1 a 5, y solo se permitirá calificar una obra vista. Los comentarios tendrán un máximo de 500 caracteres. Las reglas de Firestore validarán los datos y el acceso del propietario.

## Instalación
Para ejecutar la pantalla inicial no se necesitan credenciales. Firebase y TMDB se configurarán en los siguientes pasos:
1. Instalar Node.js y Git y obtener el repositorio.
2. Ejecutar `npm install` en la carpeta del proyecto.
3. Copiar `.env.example` a `.env` y completar los valores.
4. Habilitar correo y contraseña en Firebase Authentication y crear Firestore.
5. Publicar las reglas de Firestore cuando estén implementadas.
6. Ejecutar `npm run dev`. En PowerShell, si se bloquean scripts, usar `npm.cmd run dev`.
7. Abrir la app con Expo Go en un dispositivo compatible.

### Variables necesarias
EXPO_PUBLIC_TMDB_TOKEN contendrá el API Read Access Token de TMDB. Las variables EXPO_PUBLIC_FIREBASE_* del archivo de ejemplo corresponden a apiKey, authDomain, projectId, storageBucket, messagingSenderId y appId de la configuración web de Firebase.

No subir .env al repositorio. Las variables EXPO_PUBLIC_ son visibles en el paquete de la app; excluirlas de Git no las convierte en secretos en el dispositivo. La privacidad de los datos dependerá de Auth y las reglas de Firestore.

## Verificaciones del Paso 1
- [x] README previo a la programación.
- [x] .gitignore y .env.example sin credenciales.
- [x] Primer commit local creado.
- [x] Repositorio publicado en GitHub (confirmado por el usuario).
- [ ] Colaborador docente, si el repositorio es privado.
- [x] Token de TMDB comprobado con una búsqueda real (Inception, 27 de octubre de 2026).
- [x] Expo con TypeScript funcionando en Expo Go (confirmado por el usuario en iPhone).
- [x] Compilación de TypeScript sin errores.
- [x] Registro, inicio, cierre y persistencia de sesión verificados por el usuario en iPhone.

## Créditos previstos
Acerca de incluirá el logo de TMDB, menos prominente que la marca de la app, y el aviso:

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Bitácora de IA
Preparación inicial: Codex ayudó a redactar el README y los archivos de configuración a partir del enunciado. El equipo debe revisar y comprender todo el material entregado.

## Comprobaciones locales
Ejecutar `npm run typecheck` para comprobar TypeScript. Para abrir la app, ejecutar `npm run dev` y escanear el QR con Expo Go compatible con SDK 58, usando la misma red Wi-Fi. El usuario confirmó el arranque en Expo Go en su iPhone.

## Continuación en GitHub
Repositorio: https://github.com/ManuelRosero13/mi-cartelera-personal. Primera versión publicada; los cambios locales posteriores se subirán con git push.

Base Expo: Codex generó la plantilla oficial, añadió el comando dev, creó las carpetas por capas y personalizó la pantalla inicial.


### Resultado de validación de la base
- TypeScript: sin errores.
- Versiones de dependencias: compatibles según Expo.
- Paquete Android de desarrollo sin bytecode: generado correctamente.
- Exportación de producción: pendiente de resolver un fallo del compilador Hermes (código de salida 6) en este entorno Windows. No se considera verificada para producción.
- Ejecución en Expo Go: arranque en iPhone confirmado por el usuario.



## Autenticación implementada
- Login y registro con correo, contraseña y confirmación al registrar.
- Errores traducidos al español y controles deshabilitados durante el envío.
- Firebase Auth inicializado con persistencia en AsyncStorage; no se guarda la contraseña en la app.
- Contexto de sesión con estados de carga, error y éxito; la pila se reconstruye al iniciar o cerrar sesión.
- La declaración src/types/firebase-auth.d.ts completa el tipo de una función nativa que Firebase exporta en ejecución pero omite en sus declaraciones generales.

### Verificación manual de RF1 (confirmada por el usuario)
1. Reiniciar Expo con `npm run dev -- --clear` y abrir la app en el iPhone.
2. Pulsar Crear una cuenta, introducir un correo propio y contraseña de al menos 6 caracteres, confirmarla y crear la cuenta.
3. Comprobar que aparece el correo en la app y el usuario en Firebase Authentication → Users.
4. Cerrar completamente Expo Go y abrir de nuevo el proyecto: debe seguir mostrando la sesión.
5. Cerrar sesión: debe volver al login sin posibilidad de regresar a la pantalla privada.
6. Iniciar sesión con la misma cuenta. Probar también una contraseña incorrecta para ver el error en español.
7. Cerrar sesión, cerrar completamente Expo Go y reabrir: debe continuar en el login.

Validación local: TypeScript sin errores, dependencias compatibles según Expo, 8 comprobaciones de formulario y traducción correctas, variables Firebase completas y paquete iOS de desarrollo sin bytecode generado. No se ha creado una cuenta de prueba automáticamente y la persistencia fue comprobada posteriormente por el usuario en iPhone.

Bitácora de IA: Codex implementó la capa de autenticación, el contexto, las pantallas y la navegación condicional, y ejecutó las verificaciones locales. El equipo debe revisar y explicar el flujo antes de entregar.

## Paso 2 — Búsqueda implementada
- Pestañas Buscar y Cuenta; las tarjetas abren la ficha de detalle. Mi lista permite agregar y consultar obras.
- Servicio TMDB con búsqueda combinada (excluye personas), idioma español, paginación, tiempo máximo de 15 segundos y errores en español.
- Configuración de imágenes obtenida desde /configuration y almacenada en memoria; tamaños pequeños para las tarjetas.
- Tarjetas con título, año, tipo y reemplazo si falta o falla el póster.
- Estados de carga, error, éxito y búsqueda vacía. Las respuestas antiguas no reemplazan una consulta más reciente.
- Pruebas locales: búsquedas reales de Inception y Breaking Bad, búsqueda sin resultados, segunda página, respuesta 429 y error de red simulado, obras sin póster ni fecha.

### Prueba de búsqueda en iPhone (confirmada por el usuario)
Reiniciar con `npm run dev -- --clear`. Buscar Inception, Breaking Bad y zzxxqql938372xyz. Buscar Star y avanzar de página. Desactivar internet y hacer una búsqueda nueva para comprobar el mensaje de error; reactivar internet y reintentar. Las tarjetas ahora permiten abrir la ficha de detalle.

Bitácora de IA: Codex implementó y comprobó el servicio de búsqueda, tipos, tarjetas y pestañas. El usuario confirmó RF2 en iPhone. La ficha de detalle requiere su propia prueba en el dispositivo.

## Paso 2 — Detalle implementado
- Cada tarjeta abre una pantalla de la pila con tipo e identificador tipados.
- obtenerDetalle(tipo, id) consulta película o serie en español e incluye credits mediante append_to_response: una sola petición para ficha y elenco.
- Póster grande, título, año, calificación de TMDB sobre 10, sinopsis y actores con personajes.
- Mensajes alternativos para póster, sinopsis, fecha, calificación o elenco ausentes.
- Carga, errores de red, obra inexistente y reintento. Las respuestas de una ficha cerrada no actualizan su estado.
- El botón de regreso conserva la búsqueda; al cerrar sesión desaparecen las pantallas privadas.

Verificaciones locales: TypeScript sin errores; Origen (película) y Breaking Bad (serie) con elenco real; casos sintéticos sin póster, sinopsis, votos ni elenco; respuesta 404 e identificador inválido. Se comprobó una sola petición de detalle y elenco por obra.

Prueba pendiente de RF3 en iPhone: abrir una película y una serie desde Buscar, revisar póster, sinopsis, calificación y elenco, y regresar a los resultados. Con internet desactivado, abrir otra ficha para comprobar el error y el reintento. Agregar a Mi lista permite agregar y consultar obras; edición y caché sin conexión pendientes.

Bitácora de IA: Codex añadió tipos de detalle y elenco, normalización, la pantalla DetalleTmdb y navegación desde tarjetas, y ejecutó las comprobaciones locales. El usuario debe revisar y poder explicar el código.

## Paso 3 — Base de datos y reglas
El usuario confirmó que creó Firestore. Se preparó firestore.rules para la subcolección usuarios/{uid}/mi_lista/{itemId}.

Las reglas restringen lectura, creación, edición y eliminación al propietario autenticado. Validan campos obligatorios y permitidos, identificador tipo_tmdbId, estado, comentario de hasta 500 caracteres y calificación de 1 a 5 únicamente para obras vistas. La creación exige por_ver, comentario vacío y calificación nula. Las fechas se escriben con serverTimestamp; solo se pueden editar estado, calificación, comentario y actualizadoEn. Otras rutas quedan cerradas.

### Publicación confirmada por el usuario
Abrir Firestore Database → Reglas, reemplazar el contenido por firestore.rules y publicar. firebase.json referencia el mismo archivo para una futura publicación mediante Firebase CLI. El usuario confirmó la publicación desde la consola. Todavía no se ha ejecutado el simulador de reglas.

### Pruebas de seguridad pendientes
En el simulador de reglas, probar get de usuarios/usuarioA/mi_lista/movie_550 autenticado como usuarioA (permitido), como usuarioB (denegado) y sin autenticación (denegado). Después, probar las operaciones desde dos cuentas reales y capturar el acceso ajeno denegado para docs/. Las pruebas de escritura deben usar los campos y timestamps exigidos; la aplicación enviará serverTimestamp.

Bitácora de IA: Codex preparó las reglas a partir del modelo del proyecto. La publicación y validación con el simulador están pendientes; no se considera completado RF de seguridad todavía.

## Paso 3 — Agregar y consultar Mi lista
- Servicio listaService separado de las pantallas, con transacción de creación y escucha de la subcolección privada.
- Identificador fijo tipo_tmdbId: una transacción comprueba la existencia y no sobrescribe una entrada existente.
- Estado inicial por_ver, calificación nula, comentario vacío y fechas con serverTimestamp.
- Botón Agregar a mi lista en el detalle y pestaña Mi lista con actualización al confirmar Firestore.
- El contexto asocia la lista al uid y cancela la escucha anterior para no mostrar datos de otra cuenta.
- Espera máxima visible de 15 segundos. Un timeout no cancela una escritura ya enviada: el aviso indica revisar la lista y la escucha reconcilia confirmaciones tardías.
- En esta entrega todavía no hay caché persistente de la lista ni edición, eliminación o filtros. La persistencia de sesión sigue funcionando.

Pruebas locales: TypeScript y 13 comprobaciones de identidad, campos permitidos, estado inicial, lectura y validación del modelo. Falta comprobar operaciones reales con una cuenta autenticada y realizar pruebas de seguridad con dos cuentas y simulador.

### Prueba manual pendiente
1. Abrir una película y pulsar Agregar a mi lista.
2. Comprobar que aparece en Mi lista como Por ver.
3. Reabrir su ficha: debe indicar Ya está en Mi lista.
4. Agregar dos obras más, incluyendo una serie.
5. En Firebase → Firestore → Datos, comprobar usuarios/{uid}/mi_lista y sus tres documentos. El documento padre del usuario puede aparecer sin campos: las subcolecciones no requieren crear un perfil.
6. Cerrar y reabrir la app con conexión y comprobar que carga la lista guardada.
7. Iniciar sesión con otra cuenta: no debe mostrar las obras de la primera. Esto no sustituye la prueba de acceso ajeno en el simulador.

Bitácora de IA: Codex implementó el modelo de lista, la creación transaccional, la escucha, su integración en Context y las pantallas. El guardado real queda pendiente de la prueba del usuario.
