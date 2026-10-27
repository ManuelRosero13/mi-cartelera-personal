# Mi Cartelera Personal

## Objetivo y descripción
Aplicación móvil para buscar películas y series en TMDB y guardarlas en una lista privada, con estado de visionado, calificación y comentario personales. Integra React Native, Expo, TypeScript, Firebase Auth, Firestore y AsyncStorage.

## Estado actual
Base creada con la plantilla oficial blank-typescript: Expo SDK 58, React Native 0.88 y TypeScript estricto. Incluye una pantalla de bienvenida; Firebase, TMDB y las funciones de la lista siguen pendientes.

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
- [ ] Repositorio publicado en GitHub.
- [ ] Colaborador docente, si el repositorio es privado.
- [ ] Token de TMDB comprobado con una búsqueda real.
- [x] Expo con TypeScript funcionando en Expo Go (confirmado por el usuario en iPhone).
- [x] Compilación de TypeScript sin errores.
- [ ] Registro, inicio, cierre y persistencia de sesión verificados.

## Créditos previstos
Acerca de incluirá el logo de TMDB, menos prominente que la marca de la app, y el aviso:

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Bitácora de IA
Preparación inicial: Codex ayudó a redactar el README y los archivos de configuración a partir del enunciado. El equipo debe revisar y comprender todo el material entregado.

## Comprobaciones locales
Ejecutar `npm run typecheck` para comprobar TypeScript. Para abrir la app, ejecutar `npm run dev` y escanear el QR con Expo Go compatible con SDK 58, usando la misma red Wi-Fi. El usuario confirmó el arranque en Expo Go en su iPhone.

## Continuación en GitHub
Crear un repositorio vacío llamado mi-cartelera-personal en la cuenta del equipo. Su URL se utilizará después para conectar este repositorio local. No se ha publicado todavía.

Base Expo: Codex generó la plantilla oficial, añadió el comando dev, creó las carpetas por capas y personalizó la pantalla inicial.


### Resultado de validación de la base
- TypeScript: sin errores.
- Versiones de dependencias: compatibles según Expo.
- Paquete Android de desarrollo sin bytecode: generado correctamente.
- Exportación de producción: pendiente de resolver un fallo del compilador Hermes (código de salida 6) en este entorno Windows. No se considera verificada para producción.
- Ejecución en Expo Go: arranque en iPhone confirmado por el usuario.


