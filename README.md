# Veraleza - Plataforma de Gestión de Ofertas

Aplicación web interna para la gestión de usuarios y ofertas, diseñada para diferentes roles dentro de la organización.

---

## Funcionalidades Actuales

### 🔐 Autenticación
- Inicio de sesión con verificación de usuario y contraseña.
- Manejo de sesiones PHP.
- Redirección automática al panel correspondiente según el tipo de usuario (`administrador`, `comprador`, `comercial`, `almacen`).

### 👤 Perfil
- Visualización del perfil con:
  - Nombre
  - Tipo de usuario
  - División
- Botón de cierre de sesión (logout) con redirección al login.

### 👥 Gestión de Usuarios
- Listado dinámico de usuarios.
- Añadir nuevos usuarios mediante formulario modal.
- Edición de usuarios con datos precargados en modal.
- Eliminación con confirmación por modal.

### 📦 Gestión de Ofertas
- Creación de ofertas desde formulario.
- Tabla con scroll vertical independiente.
- Edición de ofertas en modal.
- Eliminación de ofertas con confirmación.
- Filtros dinámicos por:
  - Artículo
  - Variedad
  - Cultivo
- Filtros con inputs que incluyen icono de lupa.

---

## Tecnologías Utilizadas

- HTML5 + CSS3
- JavaScript (jQuery)
- Bootstrap 5
- PHP
- MySQL

---

## Estructura del Proyecto

