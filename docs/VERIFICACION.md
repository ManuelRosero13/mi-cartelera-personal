# Verificación y evidencias

## Resultado actual
- El usuario confirmó en iPhone autenticación y persistencia de sesión, búsqueda, detalle, guardado, edición, filtros, eliminación y copia sin conexión.
- El usuario confirmó separación de listas entre dos cuentas.
- Las reglas fueron publicadas por el usuario en Firebase.
- Las capturas del simulador real muestran lectura propia permitida, lectura ajena y sin sesión denegadas, y borrado ajeno denegado.
- Las 30 pruebas automatizadas del emulador oficial de Firestore terminaron correctamente. El informe está en pruebas-reglas.json e incluye el hash del archivo de reglas probado.

## Pruebas automatizadas de seguridad
Se utilizó exclusivamente el proyecto ficticio demo-mi-cartelera-reglas en 127.0.0.1:18088. No se cargó .env ni se conectó a producción. Las reglas probadas son las del repositorio; no se descargó una copia de las reglas publicadas para comparar automáticamente.

Se verificaron: lectura/listado propios; denegación de lectura/listado/actualización/borrado ajenos; denegación sin sesión; actualización y borrado propios; notas 1 y 5 permitidas para Vista; notas 0 y 6 denegadas; calificación denegada en Por ver/ Viendo; comentarios de 500 permitidos y 501 denegados; estado inválido; identidad/título/fecha de alta inmutables; campos extra; fecha arbitraria; creación válida con serverTimestamp; creación ajena; estado inicial; identificador incorrecto y campo obligatorio ausente.

Para repetir: instalar dependencias con npm install y disponer de Java 21 o superior en PATH; ejecutar npm run test:rules. El comando descarga la versión fijada de Firebase CLI mediante npx y arranca/cierra el emulador. npm test ejecuta las pruebas de caché/modelo y npm run typecheck comprueba TypeScript.

## Capturas reales guardadas
| Archivo | Evidencia |
| --- | --- |
| auth-users.png | Dos usuarios en Authentication |
| firestore-mi-lista.png | Tres documentos: movie_239459, tv_1396 y tv_42009 |
| reglas-propietario-permitido.png | Lectura propia permitida |
| reglas-acceso-ajeno-denegado.png | Lectura ajena denegada |
| reglas-sin-sesion-denegado.png | Lectura sin autenticación denegada |
| reglas-borrado-ajeno-denegado.png | Borrado ajeno denegado |

Las rutas se ven truncadas en las capturas del simulador. No se inventó la parte oculta; se conserva la evidencia enviada por el usuario. Las pruebas locales adicionales verifican rutas completas conocidas.

## Pendiente para entregar
- Subir los últimos commits a GitHub.
- Confirmar visualmente el logo y los créditos de Acerca de en iPhone.
- Agregar al docente como colaborador si el repositorio es privado.
- Presentar la demo en Expo Go. La exportación de producción con Hermes quedó fuera de la validación final; los paquetes de desarrollo iOS y la ejecución en Expo Go sí se comprobaron.

## Demo breve
Registro/login → buscar película y serie → abrir ficha → agregar → filtros → editar como Vista con nota y comentario → cancelar borrado y luego confirmar → modo avión con lista cargada → recuperar conexión → créditos → cerrar sesión.
