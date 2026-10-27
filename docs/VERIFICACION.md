# Verificación final y evidencias

## Estado
El usuario confirmó funcionamiento en iPhone de autenticación, catálogo, guardado y, en su última confirmación, edición/filtros/eliminación y copia sin conexión. La pantalla Acerca de requiere su revisión visual. Las reglas fueron publicadas por el usuario, pero su aislamiento todavía debe verificarse con el simulador y dos cuentas.

## Dos cuentas reales
1. Con la cuenta A, guardar al menos tres obras y confirmar sus documentos en Firestore.
2. Cerrar sesión y registrar una segunda cuenta B con otro correo propio.
3. La cuenta B debe tener una lista vacía; guardar una obra en B.
4. Volver a A: debe conservar sus propias obras y no mostrar la de B.
5. Probar también el modo sin conexión de cada cuenta después de cargar su lista con internet. Esto comprueba separación visual y de caché, pero no reemplaza las pruebas de reglas siguientes.

## Simulador de reglas (Rules Playground)
En Authentication → Users, copiar los UID de A y B. En Firestore → Reglas, abrir el simulador. Usar la ruta de un documento real de A, por ejemplo /usuarios/UID_A/mi_lista/movie_27205. Sustituir UID_A por el UID real, manteniendo la misma ruta en cada prueba.

| Operación | Autenticación | Resultado esperado |
| --- | --- | --- |
| get | UID A | Permitido |
| get | UID B | Denegado |
| get | Desactivada | Denegado |
| delete | UID B | Denegado |

Las operaciones del simulador no modifican los documentos reales. En particular, probar delete aquí no equivale a borrar desde la pestaña Datos.

Para validar escritura y negocio, comprobar también en el simulador: estado desconocido, comentario de 501 caracteres, calificación mayor de 5, calificación con estado viendo, intento de cambiar tmdbId/tipo/agregadoEn y documento con campos extra: deben denegarse. Las escrituras válidas deben incluir los campos completos y respetar las fechas de servidor de las reglas. No usar fechas arbitrarias para concluir que un caso válido falla; la app usa serverTimestamp.

## Capturas requeridas en docs/
- auth-users.png: Authentication → Users con las cuentas de prueba.
- firestore-mi-lista.png: subcolección mi_lista con al menos tres documentos.
- reglas-acceso-ajeno-denegado.png: simulador mostrando ruta de A, autenticación B y resultado denegado.

No incluir contraseñas, tokens ni el archivo .env. Las capturas deben ser reales; este documento no constituye evidencia de que las pruebas se ejecutaron.

## Demo breve
Registro/login → buscar película y serie → abrir ficha → agregar → filtros → editar como Vista con nota y comentario → cancelar borrado y luego confirmar → modo avión con lista cargada → recuperar conexión → créditos → cerrar sesión.

## Evidencias de lectura recibidas
Se guardaron las capturas reales enviadas por el usuario:
- reglas-propietario-permitido.png: get autenticado como propietario autorizado.
- reglas-acceso-ajeno-denegado.png: get autenticado con otro UID rechazado.
- reglas-sin-sesion-denegado.png: get sin autenticación rechazado.

La ruta se muestra truncada en las capturas; no se transcribió ni se inventó su parte oculta. El usuario realizó las pruebas manteniendo la ruta según las instrucciones del chat. Estas evidencias corresponden a lectura: no acreditan todavía denegación de modificación o eliminación ajenas ni validación de campos.

Pendientes: simulación delete con UID ajeno, pruebas de escritura inválida y capturas auth-users.png y firestore-mi-lista.png.

## Evidencia de borrado ajeno recibida
reglas-borrado-ajeno-denegado.png muestra la operación delete con autenticación de un UID diferente al propietario de la ruta y el resultado rechazado. La prueba fue realizada en el simulador; no eliminó datos reales. Se suma a las pruebas de lectura. La ruta completa continúa truncada visualmente.

Pendientes actualizados: captura de Authentication → Users, captura de mi_lista con al menos tres documentos, y pruebas específicas de actualización ajena y validación de campos en el servidor.
