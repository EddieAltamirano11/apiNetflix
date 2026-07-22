// APP
const formulario = document.getElementById("formulario");
const id = document.getElementById("id");
const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const año = document.getElementById("año");
const duracion = document.getElementById("duracion");
const idioma = document.getElementById("idioma");
const calificacion = document.getElementById("calificacion");

const btnMetodo = document.getElementById("btnMetodo");
const listaPeliculas = document.getElementById("listaPeliculas");
const metodo = document.getElementById("metodo");
const numCtrl = document.getElementById("numCtrl");
const portada = document.getElementById("portada");
metodo.addEventListener("change", () => {
    const metodoSeleccionado = metodo.value;
    if(metodoSeleccionado === "sinSeleccion"){
        btnMetodo.innerText = "Selecciona un Método";
        id.style.display = "none";
        btnMetodo.disabled = true;
        inhabilitarInputs();
        portada.disabled = true;
    }
    if (metodoSeleccionado === "GET") {
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
    } else if (metodoSeleccionado === "PUT") {
        btnMetodo.disabled = false;
        id.style.display = "block";
        habilitarInputs();
        btnMetodo.innerText = "Actualizar Película";
    } else if (metodoSeleccionado === "DELETE") {
        btnMetodo.disabled = false;
        id.style.display = "block";
        inhabilitarInputs();
        btnMetodo.innerText = "Eliminar Película";
    }

}); 

// Guardar película
formulario.addEventListener("submit", async (e) => {
    // alert("Se ha seleccionado el método: " + metodo.value);
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
        if (metodo.value === "GET") {
            const peliculas = await obtenerPeliculas();
            listaPeliculas.innerHTML = "";
            peliculas.forEach((pelicula) => {
                const li = document.createElement("li");
                li.textContent = "ID: " + pelicula._id + " - Título: " + pelicula.titulo;
                listaPeliculas.appendChild(li);
            });
        } else if (metodo.value === "GETxID") {
            const pelicula = await obtenerPeliculaPorID(id.value);
            listaPeliculas.innerHTML = "";
            const li = document.createElement("li");
            li.textContent = "ID: " + pelicula._id + " - Título: " + pelicula.titulo;
            listaPeliculas.appendChild(li);
        } else if (metodo.value === "POST") {
            try {

                const respuesta = await agregarPelicula(pelicula);

                alert(respuesta.mensaje);

            } catch (error) {

                alert(error.message);
            }
        } else if (metodo.value === "PUT") {
            alert("Si");
            const respuesta = await actualizarPelicula(pelicula);
            alert(respuesta.mensaje);
        } else if (metodo.value === "DELETE") {
            const respuesta = await eliminarPelicula(id.value);
            alert(respuesta.mensaje);
        }
        formulario.reset();

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