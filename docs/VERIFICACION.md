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
