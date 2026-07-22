// APP
const formulario = document.getElementById("formulario");
const id = document.getElementById("id");
const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const año = document.getElementById("año");
const duracion = document.getElementById("duracion");
const idioma = document.getElementById("idioma");
const calificacion = document.getElementById("calificacion");
const numCtrl = document.getElementById("numCtrl");
const portada = document.getElementById("portada");

const btnMetodo = document.getElementById("btnMetodo");
const listaPeliculas = document.getElementById("listaPeliculas");
const metodo = document.getElementById("metodo");

let editandoId = null;

metodo.addEventListener("change", () => {
    editandoId = null;
    const metodoSeleccionado = metodo.value;

    if (metodoSeleccionado === "sinSeleccion") {
        btnMetodo.innerText = "Selecciona un Método";
        id.style.display = "none";
        btnMetodo.disabled = true;
        inhabilitarInputs();
    } else if (metodoSeleccionado === "GET") {
        btnMetodo.disabled = false;
        id.style.display = "none";
        inhabilitarInputs();
        btnMetodo.innerText = "Consultar Películas";
    } else if (metodoSeleccionado === "GETxID") {
        btnMetodo.disabled = false;
        id.style.display = "block";
        inhabilitarInputs();
        btnMetodo.innerText = "Consultar Película por ID";
    } else if (metodoSeleccionado === "POST") {
        btnMetodo.disabled = false;
        id.style.display = "none";
        habilitarInputs();
        btnMetodo.innerText = "Crear Película";
    }
});


async function cargarTodasLasPeliculas() {
    try {
        const peliculas = await obtenerPeliculas();
        renderPeliculas(peliculas);
    } catch (error) {
        alert(error.message);
    }
}

function renderPeliculas(peliculas) {
    listaPeliculas.innerHTML = "";
    peliculas.forEach((pelicula) => {
        const card = document.createElement("div");
        card.className = "pelicula-card";
        card.innerHTML = `
            <div class="pelicula-portada" style="background-image: url('${pelicula.portada}')"></div>
            <div class="pelicula-overlay">
                <h3>${pelicula.titulo}</h3>
                <p class="pelicula-meta">${pelicula.genero} · ${pelicula.año}</p>
                <p class="pelicula-detalle">${pelicula.duracion} min · ${pelicula.idioma}</p>
                <p class="pelicula-detalle">Calificación: ${pelicula.calificacion}</p>
                <p class="pelicula-detalle">N° Control: ${pelicula.nc}</p>
                <div class="pelicula-acciones">
                    <button class="btn-editar" data-id="${pelicula._id}">Actualizar</button>
                    <button class="btn-eliminar" data-id="${pelicula._id}">Eliminar</button>
                </div>
            </div>
        `;
        listaPeliculas.appendChild(card);
    });
}

// Acciones por tarjeta (delegación de eventos)
listaPeliculas.addEventListener("click", async (e) => {
    const idPelicula = e.target.dataset.id;
    if (!idPelicula) return;

    if (e.target.classList.contains("btn-eliminar")) {
        try {
            const respuesta = await eliminarPelicula(idPelicula);
            alert(respuesta.mensaje);
            cargarTodasLasPeliculas();
        } catch (error) {
            alert(error.message);
        }
    }

    if (e.target.classList.contains("btn-editar")) {
        try {
            const pelicula = await obtenerPeliculaPorID(idPelicula);
            activarModoEdicion(pelicula);
        } catch (error) {
            alert(error.message);
        }
    }
});

function activarModoEdicion(pelicula) {
    editandoId = pelicula._id;

    metodo.value = "sinSeleccion";
    id.style.display = "none";

    titulo.value = pelicula.titulo;
    genero.value = pelicula.genero;
    año.value = pelicula.año;
    duracion.value = pelicula.duracion;
    idioma.value = pelicula.idioma;
    calificacion.value = pelicula.calificacion;
    numCtrl.value = pelicula.nc;
    portada.value = pelicula.portada;

    habilitarInputs();
    btnMetodo.disabled = false;
    btnMetodo.innerText = "Guardar Cambios";
    formulario.scrollIntoView({ behavior: "smooth" });
}

// Guardar / actualizar / consultar
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pelicula = {
        titulo: titulo.value,
        genero: genero.value,
        año: Number(año.value),
        duracion: Number(duracion.value),
        idioma: idioma.value,
        calificacion: Number(calificacion.value),
        nc: numCtrl.value,
        portada: portada.value
    };

    try {
        if (editandoId) {
            const respuesta = await actualizarPelicula(editandoId, pelicula);
            alert(respuesta.mensaje);
            editandoId = null;
            cargarTodasLasPeliculas();
        } else if (metodo.value === "GET") {
            const peliculas = await obtenerPeliculas();
            renderPeliculas(peliculas);
        } else if (metodo.value === "GETxID") {
            const peliculaEncontrada = await obtenerPeliculaPorID(id.value);
            renderPeliculas([peliculaEncontrada]);
        } else if (metodo.value === "POST") {
            const respuesta = await agregarPelicula(pelicula);
            alert(respuesta.mensaje);
            cargarTodasLasPeliculas();
        }

        formulario.reset();
        metodo.value = "sinSeleccion";
        btnMetodo.innerText = "Selecciona un Método";
        btnMetodo.disabled = true;
        id.style.display = "none";
        inhabilitarInputs();

    } catch (error) {
        alert(error.message);
    }
});

const inhabilitarInputs = () => {
    titulo.disabled = true;
    genero.disabled = true;
    año.disabled = true;
    duracion.disabled = true;
    idioma.disabled = true;
    calificacion.disabled = true;
    numCtrl.disabled = true;
    portada.disabled = true;
}

const habilitarInputs = () => {
    titulo.disabled = false;
    genero.disabled = false;
    año.disabled = false;
    duracion.disabled = false;
    idioma.disabled = false;
    calificacion.disabled = false;
    numCtrl.disabled = false;
    portada.disabled = false;
}