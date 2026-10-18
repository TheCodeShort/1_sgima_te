# SIGMA-TE

Sistema de Gestión de Mantenimiento y Trazabilidad de Equipos.

**Estado: proyecto en desarrollo activo.** No es un producto terminado; varias
funciones del plan aún no están implementadas. Desarrollado por NexoSoft Labs.

Última actualización: 18/10/2026.

## Descripción

SIGMA-TE es un CMMS (Sistema de Gestión de Mantenimiento) multi-empresa para equipos de
medición (balanzas, grameras). La empresa dueña de la plataforma administra empresas
clientes; cada cliente ve únicamente su información y los permisos que se le habiliten.

## Tabla de contenidos

- [Estado del proyecto](#estado-del-proyecto)
- [Arquitectura y stack](#arquitectura-y-stack)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Modelo de acceso](#modelo-de-acceso)
- [Base de datos](#base-de-datos)
- [API](#api)
- [Requisitos previos y ejecución local](#requisitos-previos-y-ejecución-local)
- [Primer arranque](#primer-arranque)
- [Uso básico](#uso-básico)
- [Despliegue](#despliegue)
- [Seguridad](#seguridad)
- [Documentación](#documentación)
- [Soporte y contacto](#soporte-y-contacto)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Estado del proyecto

### Implementado

| Función | Detalle verificado en el código |
| --- | --- |
| Inicio de sesión con JWT | `POST /api/auth/login`; token con vigencia de 24 h |
| Multi-empresa (multi-tenant) | Aislamiento de datos por empresa en el backend (`TenantContext`) |
| Gestión de empresas | Crear, editar, activar/desactivar, eliminación lógica y permisos por empresa; exclusivo del administrador global (MAIN) |
| Usuarios y roles con permisos | CRUD de usuarios y roles; permisos asignados individualmente, nunca en bloque |
| Protecciones | Roles protegidos que no se modifican ni eliminan; nadie edita, elimina ni desactiva su propia cuenta desde administración (esos cambios van por Mi Perfil) |
| Cierre de sesión inmediato | Al desactivar una cuenta o su empresa, el token deja de ser válido en la siguiente petición (401) |
| Mi Perfil | Cambio de correo y contraseña, con validación de la contraseña actual |
| Módulo de equipos (API y vista por empresa) | Alta, edición, baja lógica y cambio de estado; solo el administrador global escribe, las empresas solo consultan |
| Hoja de vida (API + vista parcial) | `GET/PUT /api/equipos/{id}/hoja-vida`; la vista edita los bloques Equipo e Información básica |
| API de operación | CRUD en backend de fallas, mantenimientos (con estado y campos de validación), evidencias, notificaciones y auditoría; sin interfaz funcional todavía |
| Sidebar y rutas por permisos | El menú y el enrutador ocultan/bloquean vistas según los permisos efectivos |

### Planeado

| Función | Detalle |
| --- | --- |
| Hoja de vida completa por secciones | Fotos, historiales y pestañas Reporte y Certificado funcionales |
| Documentos del equipo | Manual, factura y certificado adjuntos |
| Flujo de revisión del supervisor | Aprobación/rechazo desde la interfaz para fallas y mantenimientos |
| Evidencias fotográficas | Carga y consulta desde la interfaz |
| Reportes | Exportación de informes (Excel/PDF) |
| Códigos QR | Generación y lectura de QR por equipo |
| Modo offline / PWA | Funcionamiento sin conexión y sincronización posterior |
| Notificaciones en la interfaz | Campana y bandeja de notificaciones |
| Reglas automáticas de estado del equipo (Averiado, En mantenimiento, bloqueo operativo y avisos) | Hoy el estado se cambia solo manualmente |
| Estado Averiado en el catálogo | El catálogo sembrado solo incluye Operativo, En mantenimiento y Fuera de servicio |

Orden previsto de trabajo: 1) endurecimiento de seguridad, 2) flujo empresa-equipos y
hoja de vida, 3) documentos del equipo, 4) fallas, mantenimientos y revisión,
5) reportes, 6) códigos QR y PDF, 7) modo offline/PWA, 8) publicación y pruebas con el cliente.

## Arquitectura y stack

Arquitectura cliente-servidor:

```
Navegador (SPA vanilla + Tailwind CDN)
   |  HTTPS / JSON (JWT en Authorization)
   v
API REST - Spring Boot 4.1.0 (Java 25): controllers -> services -> repositories
   |  JDBC
   v
PostgreSQL (Neon)
```

- **Backend:** Java 25, Spring Boot 4.1.0 (Security, Data JPA, Web MVC), JJWT 0.13.0,
  PostgreSQL, Lombok, Apache POI 5.5.1, BCrypt. Ver `back_end/pom.xml`.
- **Frontend:** HTML/CSS/JS vanilla con enrutador SPA propio y Tailwind por CDN; sin
  paso de compilación (`front_end/index.html`).
- **Despliegue:** backend en Railway (`back_end/Dockerfile`); frontend en Netlify.

## Estructura del repositorio

```
back_end/
├── src/main/java/com/mantenimiento/sigma_te/
│   ├── config/ controllers/ dto/ exceptions/   # CORS, siembra inicial, API REST, DTOs, errores
│   ├── models/ repositories/                   # 16 entidades JPA y sus repositorios
│   └── security/ services/                     # JWT, TenantContext, PermisoChecker, negocio
├── src/main/resources/                         # application.properties
├── src/test/  .mvn/wrapper/                    # pruebas y Maven Wrapper
├── .env.example                                # plantilla de variables de entorno
└── Dockerfile  .dockerignore  mvnw  mvnw.cmd  pom.xml
front_end/
├── assets/
│   └── css/  js/                               # estilos globales, enrutador SPA, helpers
├── scripts/                                    # utilidades internas de desarrollo
├── src/
│   ├── components/  services/                  # navbar/sidebar y clientes de la API
│   └── views/                                  # 17 vistas (index.html + css + js cada una)
└── index.html                                  # shell de la SPA
```

## Modelo de acceso

Jerarquía:

1. **Dueño de plataforma (MAIN):** rol protegido global (sin empresa) y usuario sin
   empresa. Único perfil con acceso a la gestión de empresas.
2. **Ayudantes:** usuarios globales sin empresa, creados por el MAIN con roles propios no protegidos.
3. **Empresa:** al crear una empresa se crean su rol protegido de administrador de
   empresa y el usuario administrador.
4. **Usuarios de empresa:** creados por el administrador de la empresa; solo ven datos de su propia empresa.

Permisos base (sembrados por `DataInitializer`):

| Permiso | Módulo |
| --- | --- |
| `ver_equipos` | Equipos |
| `ver_detalle_equipo` | Equipos |
| `editar_equipos` | Equipos |
| `registrar_falla` | Fallas |
| `registrar_mantenimiento` | Mantenimiento |
| `cargar_evidencia` | Evidencia |
| `gestionar_usuarios` | Administración |
| `gestionar_roles` | Administración |
| `mi_perfil` | mi-perfil |

Reglas clave:

- Las empresas **nunca** crean, editan, eliminan ni desactivan equipos: el backend
  responde 403.
- Los permisos no se asignan automáticamente en bloque: al crear una empresa se
  asignan solo los permisos indicados por el MAIN.
- Eliminar es lógico: el registro se desactiva sin borrar su historial.
- Los roles protegidos y los usuarios protegidos no pueden modificarse ni eliminarse,
  salvo el administrador global desde el módulo Empresas (los roles de empresa solo los
  administra el MAIN).

## Base de datos

PostgreSQL. El esquema se valida al arrancar (`spring.jpa.hibernate.ddl-auto=validate`),
por lo que la base debe existir con las tablas correspondientes.

Tablas (16 entidades JPA): `empresa`, `tipo_notificacion`, `tipo_equipo`, `rol`,
`estado_equipo`, `permiso`, `empresa_permiso`, `rol_permiso`, `usuario`, `equipo`,
`hoja_vida_equipo`, `falla`, `mantenimiento`, `evidencia`, `notificacion`, `auditoria`.

- Frente al modelo original de 14 tablas se agregan `tipo_equipo` y `hoja_vida_equipo`;
  `equipo` incluye `peso_maximo`, `unidad_peso` y `activo` (baja lógica).
- Orden de dependencia para datos de prueba: `empresa` -> `rol` -> `usuario` -> `equipo`.
- Unicidad: `nombre_empresa` y `correo_usuario` son únicos globales; `nombre_rol`,
  `codigo_equipo`, `serial` y `codigo_qr` son únicos por empresa.
- El repositorio **no incluye** script SQL; el esquema debe aprovisionarse aparte.

## API

API REST en JSON. Todas las rutas (excepto `/api/auth/**`) requieren cabecera
`Authorization: Bearer <token>`.

| Recurso | Ruta base | Operaciones principales |
| --- | --- | --- |
| Autenticación | `/api/auth` | `POST /login` |
| Empresas | `/api/empresas` | GET, GET `/{id}`, POST, PUT `/{id}`, PUT `/{id}/permisos`, PATCH `/{id}/estado`, DELETE `/{id}` (lógico). Solo MAIN |
| Usuarios | `/api/usuarios` | GET, GET `/{id}`, POST, PUT `/{id}`, PATCH `/{id}/estado`, PUT/GET `/mi-perfil`, GET `/mi-perfil/permisos`, GET `/mi-perfil/rol` |
| Roles y permisos | `/api/roles`, `/api/permisos`, `/api/rol-permisos` | CRUD |
| Equipos | `/api/equipos` | GET, GET `/{id}`, GET `/empresa/{idEmpresa}`, POST, PUT `/{id}`, PATCH `/{id}/estado`, DELETE `/{id}`, GET/PUT `/{id}/hoja-vida` |
| Catálogos | `/api/estados-equipo`, `/api/tipos-equipo`, `/api/tipo-notificacion` | CRUD; `tipos-equipo` solo lectura |
| Operación | `/api/fallas`, `/api/mantenimientos`, `/api/evidencias`, `/api/notificaciones`, `/api/auditorias` | CRUD |

Códigos de respuesta usados: `400` datos inválidos; `401` credenciales inválidas o
sesión invalidada; `403` sin permiso; `404` recurso no encontrado (también si es de
otra empresa); `409` conflicto de unicidad; `201` y `204` en creación y eliminación.

## Requisitos previos y ejecución local

- **Java 25** (versión exacta de `back_end/pom.xml`); Maven Wrapper incluido.
- **PostgreSQL** accesible con el esquema ya creado (`ddl-auto=validate`); existe la
  alternativa comentada `ddl-auto=update` en `application.properties` para generarlo en desarrollo.
- Un servidor de archivos estáticos para el frontend (sin `package.json` ni compilación).

Backend en PowerShell:

```powershell
cd back_end
.\mvnw.cmd spring-boot:run
```

Backend en bash:

```bash
cd back_end
./mvnw spring-boot:run
```

Frontend: servir `front_end/` como sitio estático (por ejemplo, extensión Live Server
de VS Code en el puerto 5500, o `python -m http.server 5500` dentro de `front_end`).
La SPA usa `http://localhost:8080/api` en local y la API de Railway en caso contrario
(`src/services/apiConfig.js`); los orígenes locales habituales ya están en CORS.

Variables de entorno (solo nombres; los valores reales no se versionan):

| Variable | Descripción |
| --- | --- |
| `DB_URL` | URL JDBC de PostgreSQL (formato `jdbc:postgresql://host:puerto/base`) |
| `DB_USERNAME` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `JWT_SECRET` | Clave de firma de los tokens (mínimo 32 caracteres) |
| `ADMIN_EMAIL` | Correo del usuario MAIN inicial |
| `ADMIN_PASSWORD` | Contraseña del usuario MAIN inicial |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos, separados por coma |
| `PORT` | Puerto del servidor (por defecto 8080) |

Hay una plantilla en `back_end/.env.example` (cubre `DB_*`, `JWT_SECRET` y `ADMIN_*`).
El `.env` real está ignorado por git y no debe subirse.

## Primer arranque

`DataInitializer` siembra los estados de equipo (Operativo, En mantenimiento y Fuera de
servicio) siempre que la tabla de estados esté vacía, aunque ya existan roles. El rol
Administrador global, los permisos base y el usuario MAIN desde `ADMIN_EMAIL` y
`ADMIN_PASSWORD` (marcado con cambio de contraseña requerido) solo se crean si no existe
ningún rol. En cada arranque se garantiza el permiso `editar_equipos`. Use una contraseña
larga y única para `ADMIN_PASSWORD`.

## Uso básico

1. Iniciar sesión con el usuario MAIN creado en el primer arranque; la cuenta se crea
   marcada con cambio de contraseña requerido (el cambio se realiza en Mi Perfil).
2. En **Empresas**, crear una empresa con su administrador y los permisos que tendrá.
3. El administrador de la empresa inicia sesión y crea sus usuarios y roles en
   **Usuarios y Roles**.
4. Los equipos los registra el MAIN desde la interfaz (vista Equipos por empresa,
   accesible desde Empresas, con su botón "Nuevo Equipo").

## Despliegue

- `back_end/Dockerfile`: build multi-stage con `eclipse-temurin:25-jdk` (empaqueta con
  Maven Wrapper sin tests) y runtime sobre `eclipse-temurin:25-jre`.
- Railway: servicio del backend con **Root Directory** `/back_end`; tras cambiar
  variables de entorno, pulsar **Deploy**. `CORS_ALLOWED_ORIGINS` debe incluir el
  origen del frontend desplegado (Netlify publica el frontend estático).
- URLs: frontend `https://sigma-te-front.netlify.app`; API `https://sigma-te-back.up.railway.app`.

## Seguridad

- Los permisos se validan en el servidor (`PermisoChecker` + `@PreAuthorize`) además de ocultarse en la interfaz.
- JWT firmado con HMAC y vigencia de 24 h; en cada petición se verifica que la cuenta
  y su empresa sigan activas (si no, responde 401 y el cliente cierra la sesión).
- Contraseñas almacenadas con BCrypt y aislamiento por empresa en los servicios.

El endurecimiento de seguridad forma parte del plan de trabajo en curso.

## Documentación

La documentación completa del proyecto (especificación de requisitos e informes de
estado) es de uso interno y no se incluye en este repositorio.

## Soporte y contacto

Proyecto en desarrollo sin canal de soporte público. Para consultas, contactar al
propietario del repositorio a través de su perfil de GitHub.

## Contribuciones

Este repositorio no acepta contribuciones externas.

## Licencia

Copyright (c) 2026 NexoSoft Labs. Todos los derechos reservados.

No se concede licencia de uso, copia, modificación ni distribución total o parcial
sin autorización escrita previa de NexoSoft Labs.
