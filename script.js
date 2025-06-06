let tipoUsuario = null;
function generarFilaOferta(o) {
  return `
<tr class="${
  Number(o.disponible) === 0
    ? 'sin-stock'
    : Number(o.disponible) < 5
    ? 'poco-stock'
    : 'ok-stock'
}">


      <td>${o.articulo}</td>
      <td>${o.variedad}</td>
      <td>${o.cultivo}</td>
<td>${formatearFecha(o.fecha)}</td>
      <td>${o.cajas}</td>
  <td class="columna-disponible">
  <span class="${o.disponible == 0 ? 'disponible-cero' : o.disponible < 5 ? 'disponible-bajo' : 'disponible-ok'}">
    ${o.disponible ?? '-'}
  </span>
</td>

      <td>${o.reservado ?? '-'}</td>
      ${tipoUsuario === "comercial" ? `<td>${o.mi_reserva ?? '-'}</td>` : ''}
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
              Reservar
            </button>
          </div>
        `}
      </td>
    </tr>
  `;
}
function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const partes = fechaStr.split("-");
  if (partes.length !== 3) return fechaStr;
  return `${partes[2]}/${partes[1]}/${partes[0]}`; // dd/mm/yyyy
}
function ordenarTabla(columna, ascendente) {
  const filas = $("#tabla-ofertas tbody tr").get();

  filas.sort(function (a, b) {
    let valA = $(a).find(`td:eq(${columna})`).text().toLowerCase();
    let valB = $(b).find(`td:eq(${columna})`).text().toLowerCase();

    if (columna === 3) { // Fecha
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (valA < valB) return ascendente ? -1 : 1;
    if (valA > valB) return ascendente ? 1 : -1;
    return 0;
  });

  $.each(filas, function (_, fila) {
    $("#tabla-ofertas tbody").append(fila);
  });

  ordenActual = { columna, ascendente };
}

function cargarOfertas() {
  const $tbody = $("#tabla-ofertas tbody");

  // Guardar los filtros antes de borrar
  const filtroArticulo = $("#filtro-articulo").val().toLowerCase();
  const filtroVariedad = $("#filtro-variedad").val().toLowerCase();
  const filtroCultivo = $("#filtro-cultivo").val().toLowerCase();

  // Guardar orden actual (índice de columna y asc/desc)
  const columnaOrden = ordenActual.columna;
  const ascendente = ordenActual.ascendente;

  $.get("php/obtener_ofertas.php", function (data) {
    $tbody.empty();
    const fragmento = $(document.createDocumentFragment());

    data.forEach(function (oferta) {
      const fila = generarFilaOferta(oferta);
      fragmento.append(fila);
    });

    $tbody.append(fragmento);

    // Restaurar filtros
    $("#filtro-articulo").val(filtroArticulo);
    $("#filtro-variedad").val(filtroVariedad);
    $("#filtro-cultivo").val(filtroCultivo);
    filtrarTabla();

    // Restaurar orden
    if (columnaOrden !== null) {
      ordenarTabla(columnaOrden, ascendente);
    }
  }, "json");
}


  let ordenActual = {
    columna: null,
    ascendente: true
  };

//READY EL DOM !!!!!!!!!!!!!!!!!!!
$(document).ready(function () {
$("#filtro-articulo").val(localStorage.getItem("filtro-articulo") || "");
$("#filtro-variedad").val(localStorage.getItem("filtro-variedad") || "");
$("#filtro-cultivo").val(localStorage.getItem("filtro-cultivo") || "");

 $.get("php/sesion.php", function (datos) {
  if (!datos.error) {
    $("#nombre-usuario").text(datos.nombre);
    $("#tipo-usuario").text(`${datos.tipo} ${datos.division}`);
    tipoUsuario = datos.tipo;

    // solo una llamada
    cargarOfertas(); 
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
  // Filtros de usuarios
  $("#filtro-articulo, #filtro-variedad, #filtro-cultivo").on("input", function () {
  localStorage.setItem("filtro-articulo", $("#filtro-articulo").val());
  localStorage.setItem("filtro-variedad", $("#filtro-variedad").val());
  localStorage.setItem("filtro-cultivo", $("#filtro-cultivo").val());

  filtrarTabla(); // seguir aplicando en tiempo real
});

  //cargar oferrtas


$(".ordenable").on("click", function () {
  const columna = parseInt($(this).data("columna"));
  const ascendente = (ordenActual.columna === columna) ? !ordenActual.ascendente : true;
  ordenarTabla(columna, ascendente);
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
let variedadPendiente = "";
let cultivoPendiente = "";

$("#form-oferta").on("submit", function (e) {
  e.preventDefault();

  const variedad = $("#variedad").val().trim();
  const cultivo = $("#cultivo").val().trim();
  const faltantes = [];

  $.when(
    $.post("php/existe_variedad.php", { variedad }),
    $.post("php/existe_cultivo.php", { cultivo })
  ).done(function (resVariedad, resCultivo) {
    const existeVariedad = resVariedad[0].existe;
    const existeCultivo = resCultivo[0].existe;

    variedadPendiente = !existeVariedad ? variedad : "";
    cultivoPendiente = !existeCultivo ? cultivo : "";

    if (!existeVariedad) faltantes.push(`la variedad <b>${variedad}</b>`);
    if (!existeCultivo) faltantes.push(`del cultivo <b>${cultivo}</b>`);

    if (faltantes.length > 0) {
      $("#mensaje-modal-registro").html(`${faltantes.join(",")} no están registrados. ¿Deseas registrarlos?`);
      new bootstrap.Modal(document.getElementById("modalConfirmarRegistro")).show();
    } else {
      crearOferta(); // Si todo existe, crear directamente
    }
  });
});

$("#confirmar-registro-cultivo-variedad").on("click", function () {
  const registros = [];

  if (variedadPendiente) {
    registros.push($.post("php/insertar_variedad.php", { variedad: variedadPendiente }));
  }
  if (cultivoPendiente) {
    registros.push($.post("php/insertar_cultivo.php", { cultivo: cultivoPendiente }));
  }

  Promise.all(registros).then(() => {
    bootstrap.Modal.getInstance(document.getElementById("modalConfirmarRegistro")).hide();
    crearOferta();
    cargarOfertas(); 
  });
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
  // AUTOCOMPLETE cultivo
  $("#cultivo").autocomplete({
    source: function (request, response) {
      $.ajax({
        url: "php/buscar_cultivos.php",
        dataType: "json",
        data: { term: request.term },
        success: function (data) {
          response(data);
        }
      });
    },
    minLength: 1
  });

  // AUTOCOMPLETE variedad hecho
  $("#variedad").autocomplete({
    source: function (request, response) {
      $.ajax({
        url: "php/buscar_variedades.php",
        dataType: "json",
        data: { term: request.term },
        success: function (data) {
          response(data);
        }
      });
    },
    minLength: 1
  });
function crearOferta() {
  const datos = {
    articulo: $("#articulo").val(),
    variedad: $("#variedad").val(),
    cultivo: $("#cultivo").val(),
    fecha: $("#fecha").val(),
    cajas: $("#cajas").val()
  };

  $.post("php/crear_oferta.php", datos, function (respuesta) {
    if (respuesta.success && respuesta.oferta) {
      const fila = generarFilaOferta(respuesta.oferta);
      $("#tabla-ofertas tbody").prepend(fila);
      $("#form-oferta")[0].reset();
      if (typeof filtrarTabla === "function") filtrarTabla();
    } else {
      alert("Error al guardar: " + (respuesta.error || "Sin detalles."));
    }
  }, "json");
}
setInterval(() => {
  if (!estaInteraccionActiva()) {
    cargarOfertas();
  }
}, 3000); // cada 10 segundos, ajustable

});//acabe ready
//importar ofertas desde CSV
document.getElementById("archivo_excel").addEventListener("change", function () {
  const archivo = this.files[0];
  if (!archivo) return;

  // Solo habilitar el botón sin mostrar nada más
  document.getElementById("btn-confirmar-importacion").disabled = false;
});

document.getElementById("form-importacion").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  fetch("php/procesar_csv_temp.php", {
    method: "POST",
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = "importar_revision.html";
      } else {
        alert("Error al procesar el archivo: " + data.error);
      }
    })
    .catch(err => {
      console.error("Error al importar:", err);
      alert("Hubo un error al importar el archivo.");
    });
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
      cargarOfertas(); //importante actualizar disponible/reservado

    } else {
      alert("Error al guardar la reserva: " + (respuesta.error || "desconocido."));
    }
  }, "json");
});
function estaInteraccionActiva() {
  const hayModalAbierto = document.querySelectorAll(".modal.show").length > 0;
  const elementoActivo = document.activeElement;
  const esInputActivo = elementoActivo && (
    elementoActivo.tagName === "INPUT" || elementoActivo.tagName === "TEXTAREA"
  );

  const hayFiltrosEscritos = (
    $("#filtro-articulo").val().trim() !== "" ||
    $("#filtro-variedad").val().trim() !== "" ||
    $("#filtro-cultivo").val().trim() !== ""
  );

  return hayModalAbierto || esInputActivo || hayFiltrosEscritos;
}



// Cerrar sesión
$(document).on("click", "#cerrar-sesion", function (e) {
  e.preventDefault();
  window.location.href = "php/logout.php";
});




