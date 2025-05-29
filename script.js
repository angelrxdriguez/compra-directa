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


