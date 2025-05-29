Veraleza - Plataforma de Gestión de Ofertas
Aplicación web interna para gestionar ofertas, usuarios y adjudicaciones para distintos roles (comprador, comercial, administrador, etc.).

Funcionalidades actuales
Autenticación
Inicio de sesión con validación de credenciales.

Uso de sesiones para mantener al usuario autenticado.

Redirección automática según el tipo de usuario.

Perfil
Vista de perfil con nombre, tipo y división del usuario autenticado.

Opción para cerrar sesión desde la sección de perfil.

Gestión de Usuarios (vista administrador)
Listado dinámico de usuarios.

Añadir nuevo usuario mediante modal.

Editar usuario mediante modal.

Eliminación de usuario con confirmación.

Gestión de Ofertas
Formulario para crear nuevas ofertas.

Tabla con scroll vertical para navegación cómoda.

Edición de ofertas con modal prellenado.

Eliminación de ofertas con confirmación.

Filtros dinámicos por artículo, variedad y cultivo.

Filtros integrados dentro de los inputs, con iconos de lupa.

Interfaz
Diseño responsivo con Bootstrap 5.

Estética visual basada en la identidad de marca Veraleza.

Componentes reutilizables y estructura clara.

Tecnologías usadas
HTML5 / CSS3 / JavaScript (jQuery)

Bootstrap 5

PHP (para lógica backend)

MySQL (base de datos)

Sesiones PHP para autenticación

Estructura básica del proyecto
bash
Copiar
Editar
/
├── index.html               # Login
├── perfil.html              # Perfil del usuario
├── comprador.html           # Vista comprador
├── admin.html               # Vista administrador
├── oferta.html              # Gestión de ofertas
├── php/
│   ├── log.php              # Login
│   ├── logout.php           # Logout
│   ├── obtener_usuarios.php # API usuarios
│   ├── crear_usuario.php
│   ├── actualizar_usuario.php
│   ├── eliminar_usuario.php
│   ├── obtener_ofertas.php  # API ofertas
│   ├── crear_oferta.php
│   ├── actualizar_oferta.php
│   ├── eliminar_oferta.php
├── style/
│   └── style.css
└── script.js                # JS principal (DOM + AJAX)
