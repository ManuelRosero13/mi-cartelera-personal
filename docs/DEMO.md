# Guion de demo — Mi Cartelera Personal

Duración orientativa: 5–7 minutos. Ejecutar la demo con Expo Go en el iPhone y la computadora conectada a la misma red.

## Antes de presentar
- Ejecutar npm run dev y abrir la app desde el QR.
- Tener disponibles dos cuentas de prueba, sin mostrar contraseñas.
- Mantener tres obras en Mi lista para la evidencia de Firestore. Si se prueba eliminación, agregar primero una cuarta obra prescindible.
- Abrir Authentication → Usuarios y Firestore → Datos en la computadora.
- Tener a mano docs/pruebas-reglas.json y las capturas en docs/.
- Revisar Acerca de: logo visible, aviso de TMDB legible y botón Cerrar sesión funcional.
- Subir los últimos commits con git push y comprobar que docs/ aparece en GitHub.
- Si el repositorio es privado, comprobar que el docente tiene acceso.

## 1. Presentación y autenticación — 45 segundos
Decir: “Mi Cartelera Personal permite buscar películas y series y mantener una lista privada con estado, calificación y comentario.”
Mostrar login, iniciar sesión y enseñar el correo de la cuenta en Acerca de. Explicar que Firebase Auth gestiona la cuenta y AsyncStorage conserva la sesión. Para demostrar registro, usar un correo de prueba propio que todavía no esté registrado.

## 2. Búsqueda y detalle — 1 minuto
Buscar Inception y abrir la ficha. Mostrar póster, sinopsis, nota de TMDB y elenco. Regresar y buscar Breaking Bad para demostrar series. Buscar zzxxqql938372xyz para mostrar el estado sin resultados.
Decir: “La API se consulta desde un servicio; el detalle incluye el elenco en una sola petición con append_to_response=credits. Si faltan datos, se muestran alternativas.”

## 3. Guardado y duplicados — 45 segundos
Agregar una obra y abrir Mi lista. Reabrir la ficha: debe indicar Ya está en Mi lista.
Decir: “Cada documento usa tipo e ID de TMDB, por ejemplo movie_550. Una transacción comprueba su existencia antes de crearlo.”
Mostrar los documentos en usuarios/{uid}/mi_lista dentro de Firebase.

## 4. Edición, filtros y borrado — 1 minuto
Abrir una entrada desde Mi lista. Marcar Vista, elegir 5 estrellas, escribir un comentario y guardar. Mostrar la nota en la lista y combinar filtros de estado y tipo.
Volver a editar, cambiar a Viendo y mostrar que se elimina la calificación. Explicar el límite de 500 caracteres.
En una cuarta obra de prueba, pulsar Quitar, cancelar primero y luego confirmar. Mantener al menos tres documentos para las capturas.

## 5. Modo sin conexión — 45 segundos
Con Mi lista cargada, activar modo avión y desactivar Wi-Fi si sigue activo. Mostrar que la lista permanece y aparece el aviso de copia local. Intentar guardar un cambio: debe solicitar conexión.
Reactivar internet y esperar que la lista se actualice.
Decir: “La copia se guarda por usuario y refleja los datos confirmados por Firestore. Las escrituras requieren internet.”
Nota: no forzar una descarga nueva del código de Expo Go sin red. La caché de datos no sustituye el acceso al servidor de desarrollo para cargar la app.

## 6. Seguridad y cierre — 1 minuto
Mostrar las capturas de lectura propia permitida y acceso ajeno denegado, y el informe de 30 pruebas del emulador. Explicar que las pruebas locales usan un proyecto de demostración y no modifican producción.
Cerrar sesión e iniciar con la otra cuenta: mostrar que su lista es distinta.
Mostrar Acerca de y el crédito de TMDB.

## Preguntas que debes poder responder
- ¿Dónde se hacen las llamadas externas? En services/, no directamente en las pantallas.
- ¿Cómo se aísla cada cuenta? La ruta incluye uid y las reglas comparan request.auth.uid con ese uid.
- ¿Por qué tipo_tmdbId? Películas y series tienen espacios de IDs separados y esta clave evita duplicados.
- ¿Cómo se conserva la sesión? Firebase Auth usa persistencia con AsyncStorage.
- ¿Qué pasa sin internet? Se muestra la última copia de la lista de esa cuenta, con aviso; no se encolan cambios offline.
- ¿Dónde se valida la calificación? En la interfaz, en el servicio/modelo y en las reglas de Firestore.
- ¿Por qué serverTimestamp? Para usar la hora del servidor; las reglas impiden alterar la fecha de alta.
- ¿El token es secreto dentro de Expo? No: EXPO_PUBLIC_ se incluye en la app. .env evita subirlo a Git, pero no ocultarlo en el dispositivo.
- ¿Qué IA utilizaste? Codex ayudó con implementación, documentación y pruebas; la bitácora del README describe su participación. Debes comprender y explicar el código entregado.

## Entrega
Repositorio: https://github.com/ManuelRosero13/mi-cartelera-personal
Archivos: código, README.md, .env.example, firestore.rules, firebase.json, docs/ con capturas e informe.
No entregar .env, node_modules, archivos temporales ni Java portátil.
La ejecución validada es Expo Go; no presentar la exportación de producción Hermes como verificada.
