$(document).ready(function () {
     $.get("php/sesion.php", function (datos) {
    if (!datos.error) {
      $("#nombre-usuario").text(datos.nombre);
      $("#tipo-usuario").text(`${datos.tipo} ${datos.division}`);
    } else {
      console.warn("No hay sesión activa");
    }
  }, "json");
  
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
  data.forEach(function (oferta) {
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
            data-id="${oferta.id}" 
            data-articulo="${oferta.articulo}" 
            data-variedad="${oferta.variedad}" 
            data-cultivo="${oferta.cultivo}" 
            data-fecha="${oferta.fecha}" 
            data-cajas="${oferta.cajas}">
            Editar
          </button>
          <button class="btn btn-sm btn-danger btn-eliminar-oferta"
            data-id="${oferta.id}">
            Eliminar
          </button>
        </td>
      </tr>
    `);
  });
});

// Mostrar modal de confirmación al hacer click en Eliminar
$(document).on("click", ".btn-eliminar-oferta", function () {
  const id = $(this).data("id");
  $("#eliminar-id-oferta").val(id);
  const modal = new bootstrap.Modal(document.getElementById("modalEliminarOferta"));
  modal.show();
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
//
$("#confirmar-eliminar-oferta").on("click", function () {
  const id = $("#eliminar-id-oferta").val();

  $.post("php/eliminar_oferta.php", { id: id }, function (respuesta) {
    if (respuesta.success) {
      alert("Oferta eliminada correctamente.");
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalEliminarOferta"));
      modal.hide();
      location.reload();
    } else {
      alert("Error al eliminar: " + respuesta.error);
    }
  }, "json");
});
/*filtros de ofertas*/
function filtrarTabla() {
  const filtroArticulo = $("#filtro-articulo").val().toLowerCase();
  const filtroVariedad = $("#filtro-variedad").val().toLowerCase();
  const filtroCultivo = $("#filtro-cultivo").val().toLowerCase();

  $("#tabla-ofertas tbody tr").each(function () {
    const articulo = $(this).find("td:eq(0)").text().toLowerCase();
    const variedad = $(this).find("td:eq(1)").text().toLowerCase();
    const cultivo = $(this).find("td:eq(2)").text().toLowerCase();

    const coincide = articulo.includes(filtroArticulo)
                  && variedad.includes(filtroVariedad)
                  && cultivo.includes(filtroCultivo);

    $(this).toggle(coincide);
  });
}
$("#filtro-articulo, #filtro-variedad, #filtro-cultivo").on("input", filtrarTabla);
});
// Cerrar sesión
  $(document).on("click", "#cerrar-sesion", function (e) {
    e.preventDefault();
    window.location.href = "php/logout.php";
  });



