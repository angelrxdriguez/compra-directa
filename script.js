let tipoUsuario = null; 
function generarFilaOferta(o) {
  return `
    <tr>
      <td>${o.articulo}</td>
      <td>${o.variedad}</td>
      <td>${o.cultivo}</td>
      <td>${o.fecha}</td>
      <td>${o.cajas}</td>
      <td>${o.disponible ?? '-'}</td>
      <td>${o.reservado ?? '-'}</td>
      <td>
        ${tipoUsuario === "comprador" ? `
          <button class="btn btn-sm btn-primary btn-editar-oferta"
            data-id="${o.id}" data-articulo="${o.articulo}" data-variedad="${o.variedad}"
            data-cultivo="${o.cultivo}" data-fecha="${o.fecha}" data-cajas="${o.cajas}">
            Editar
          </button>
          <button class="btn btn-sm btn-danger btn-eliminar-oferta"
            data-id="${o.id}">
            Eliminar
          </button>
        ` : `
          <div class="d-flex">
            <input type="number" class="form-control form-control-sm input-reserva me-2" 
              data-id="${o.id}" placeholder="Reservar..." value="${o.mi_reserva ?? ''}">
            <button class="btn btn-sm btn-success btn-reservar" data-id="${o.id}">
              Guardar
            </button>
          </div>
        `}
      </td>
    </tr>
  `;
}
function cargarOfertas() {
  $.get("php/obtener_ofertas.php", function (data) {
    $("#tabla-ofertas tbody").empty();
    data.forEach(function (oferta) {
      const fila = generarFilaOferta(oferta);
      $("#tabla-ofertas tbody").append(fila);
    });

    // Si tienes filtros activos, reaplícalos
    if (typeof filtrarTabla === "function") filtrarTabla();
  }, "json");
}
//READY EL DOM !!!!!!!!!!!!!!!!!!!
$(document).ready(function () {
  $.get("php/sesion.php", function (datos) {
    if (!datos.error) {
      $("#nombre-usuario").text(datos.nombre);
      $("#tipo-usuario").text(`${datos.tipo} ${datos.division}`);
      tipoUsuario = datos.tipo;
      cargarOfertas();  // llama a la función que carga las ofertas
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

let ordenAscendente = true;

let ordenActual = {
  columna: null,
  ascendente: true
};

$(".ordenable").on("click", function () {
  const columna = parseInt($(this).data("columna"));

  // Alternar orden si es la misma columna
  if (ordenActual.columna === columna) {
    ordenActual.ascendente = !ordenActual.ascendente;
  } else {
    ordenActual.columna = columna;
    ordenActual.ascendente = true;
  }

  const filas = $("#tabla-ofertas tbody tr").get();

  filas.sort(function (a, b) { //eq=columna
    // obtiene el valor de la columna correspondiente
    let valA = $(a).find(`td:eq(${columna})`).text().toLowerCase();
    let valB = $(b).find(`td:eq(${columna})`).text().toLowerCase();

    // compara si es indice tal ordena por tal
    if (columna === 3) {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (valA < valB) return ordenActual.ascendente ? -1 : 1;
    if (valA > valB) return ordenActual.ascendente ? 1 : -1;
    return 0;
  });

  $.each(filas, function (_, fila) {
    $("#tabla-ofertas tbody").append(fila);
  });
});

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
    if (respuesta.success && respuesta.oferta) {
      const o = respuesta.oferta;

      // Crear la fila nueva
      const fila = `
        <tr>
          <td>${o.articulo}</td>
          <td>${o.variedad}</td>
          <td>${o.cultivo}</td>
          <td>${o.fecha}</td>
          <td>${o.cajas}</td>
          <td>${o.disponible ?? '-'}</td>
          <td>${o.reservado ?? '-'}</td>
          <td>
            <button class="btn btn-sm btn-primary btn-editar-oferta"
              data-id="${o.id}"
              data-articulo="${o.articulo}"
              data-variedad="${o.variedad}"
              data-cultivo="${o.cultivo}"
              data-fecha="${o.fecha}"
              data-cajas="${o.cajas}">
              Editar
            </button>
            <button class="btn btn-sm btn-danger btn-eliminar-oferta"
              data-id="${o.id}">
              Eliminar
            </button>
          </td>
        </tr>
      `;

      // Añadirla al principio de la tabla
      $("#tabla-ofertas tbody").prepend(fila);

      // Limpiar el formulario
      $("#form-oferta")[0].reset();

      // Reaplicar filtros si hay función
      if (typeof filtrarTabla === "function") filtrarTabla();
    } else {
      alert("Error al guardar: " + (respuesta.error || "Sin detalles."));
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
//RESERVAS***************
$(document).on("click", ".btn-reservar", function () {
  const btn = $(this);
  const idOferta = btn.data("id");
  const input = btn.closest("tr").find(".input-reserva");
  const cajas = parseFloat(input.val());

  if (isNaN(cajas) || cajas < 0) {
    alert("Introduce una cantidad válida.");
    return;
  }

  $.post("php/crear_reserva.php", { id_oferta: idOferta, cajas: cajas }, function (respuesta) {
    if (respuesta.success) {
      alert("Reserva actualizada correctamente.");
      cargarOfertas(); //importante si quieres actualizar disponible/reservado
    } else {
      alert("Error al guardar la reserva: " + (respuesta.error || "desconocido."));
    }
  }, "json");
});


// Cerrar sesión
  $(document).on("click", "#cerrar-sesion", function (e) {
    e.preventDefault();
    window.location.href = "php/logout.php";
  });



