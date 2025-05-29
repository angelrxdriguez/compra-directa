$(document).ready(function () {
    $.get("php/obtener_usuarios.php", function (data) {
        data.forEach(function (usuario) {
            $("#tabla-usuarios tbody").append(`
        <tr>
          <td>${usuario.id}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.tipo}</td>
          <td>${usuario.division}</td>
          <td>${usuario.fecha_creacion}</td>
          <td>
        <button class="btn btn-sm btn-primary btn-editar" data-id="${usuario.id}" data-nombre="${usuario.nombre}" data-tipo="${usuario.tipo}" data-division="${usuario.division}">
          Editar
        </button>
      </td>
        </tr>
      `);
        });
    });
    //cargar oferrtas
    $.get("php/obtener_ofertas.php", function (data) {
        data.forEach(function (oferta, index) {
            $("#tabla-ofertas tbody").append(`
      <tr>
        <td>${oferta.articulo}</td>
        <td>${oferta.variedad}</td>
        <td>${oferta.cultivo}</td>
        <td>${oferta.fecha}</td>
        <td>${oferta.cajas}</td>
        <td>${oferta.disponible ?? '-'}</td>
        <td>${oferta.reservado ?? '-'}</td>
        <td>
          <button class="btn btn-sm btn-primary btn-editar-oferta"
            data-id="${oferta.id ?? index}" 
            data-articulo="${oferta.articulo}" 
            data-variedad="${oferta.variedad}" 
            data-cultivo="${oferta.cultivo}" 
            data-fecha="${oferta.fecha}" 
            data-cajas="${oferta.cajas}">
            Editar
          </button>
        </td>
      </tr>
    `);
        });
    });

});
/*BOTONES y FORMS*/
$(document).on("click", ".btn-editar", function () {
    const id = $(this).data("id");
    const nombre = $(this).data("nombre");
    const tipo = $(this).data("tipo");
    const division = $(this).data("division");

    $("#edit-id").val(id);
    $("#edit-nombre").val(nombre);
    $("#edit-tipo").val(tipo);
    $("#edit-division").val(division);

    const modal = new bootstrap.Modal(document.getElementById("modalEditar"));
    modal.show();
});
//editar usuario
$("#formEditar").on("submit", function (e) {
    e.preventDefault();

    const datos = {
        id: $("#edit-id").val(),
        nombre: $("#edit-nombre").val(),
        tipo: $("#edit-tipo").val(),
        division: $("#edit-division").val()
    };

    $.post("php/actualizar_usuario.php", datos, function (respuesta) {
        if (respuesta.success) {
            alert("Usuario actualizado correctamente.");
            location.reload();
        } else {
            alert("Error al actualizar: " + respuesta.error);
        }
    }, "json");
});
$("#formCrear").on("submit", function (e) {
    e.preventDefault();

    const datos = {
        nombre: $("#crear-nombre").val(),
        pass: $("#crear-pass").val(),
        tipo: $("#crear-tipo").val(),
        division: $("#crear-division").val()
    };

    $.post("php/crear_usuario.php", datos, function (respuesta) {
        if (respuesta.success) {
            alert("Usuario creado correctamente.");
            $("#modalCrear").modal("hide");
            location.reload();
        } else {
            alert("Error: " + respuesta.error);
        }
    }, "json");
});
//crear oferta
$("#form-oferta").on("submit", function (e) {
    e.preventDefault();

    const datos = {
        articulo: $("#articulo").val(),
        variedad: $("#variedad").val(),
        cultivo: $("#cultivo").val(),
        fecha: $("#fecha").val(),
        cajas: $("#cajas").val()
    };

    $.post("php/crear_oferta.php", datos, function (respuesta) {
        if (respuesta.success) {
            alert("Oferta registrada correctamente.");
            location.reload();
        } else {
            alert("Error al guardar: " + respuesta.error);
        }
    }, "json");
});
//editar oferta
$(document).on("click", ".btn-editar-oferta", function () {
    const id = $(this).data("id");
    const articulo = $(this).data("articulo");
    const variedad = $(this).data("variedad");
    const cultivo = $(this).data("cultivo");
    const fecha = $(this).data("fecha");
    const cajas = $(this).data("cajas");

    $("#edit-id-oferta").val(id);
    $("#edit-articulo").val(articulo);
    $("#edit-variedad").val(variedad);
    $("#edit-cultivo").val(cultivo);
    $("#edit-fecha").val(fecha);
    $("#edit-cajas").val(cajas);

    const modal = new bootstrap.Modal(document.getElementById("modalEditarOferta"));
    modal.show();
});
$("#formEditarOferta").on("submit", function (e) {
    e.preventDefault();

    const datos = {
        id: $("#edit-id-oferta").val(),
        articulo: $("#edit-articulo").val(),
        variedad: $("#edit-variedad").val(),
        cultivo: $("#edit-cultivo").val(),
        fecha: $("#edit-fecha").val(),
        cajas: $("#edit-cajas").val()
    };

    $.post("php/actualizar_oferta.php", datos, function (respuesta) {
        if (respuesta.success) {
            alert("Oferta actualizada correctamente.");
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarOferta"));
            modal.hide();
            location.reload();
        } else {
            alert("Error al actualizar: " + respuesta.error);
        }
    }, "json");
});



