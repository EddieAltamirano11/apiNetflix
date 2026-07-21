//const dns = require('dns');
//dns.setServers(['8.8.8.8', '1.1.1.1']); // Google + Cloudflare
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const MONGO_URI = "mongodb+srv://grupo:grupo@servidorprueba.ygegryf.mongodb.net/netflix";

let isConnected = false;

async function conectarDB() {
    if (isConnected && mongoose.connection.readyState === 1) return;
    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log("Conectado Correctamente");
    } catch (error) {
        isConnected = false;
        console.log("Error al conectar con MongoDB:", error);
        throw error;
    }
}

// Middleware que asegura la conexión antes de cualquier ruta
app.use(async (req, res, next) => {
    try {
        await conectarDB();
        next();
    } catch (error) {
        res.status(500).json({ mensaje: "Error de conexión a la base de datos", error: error.message });
    }
});

/*
mongoose.connect("mongodb+srv://grupo:grupo@servidorprueba.ygegryf.mongodb.net/netflix").then(()=>{
    console.log("Conectado Correctamente");
}).catch((error) =>{
    console.log("Error al conectar con MongoDB:", error);
});
*/

const peliculaSchema = new mongoose.Schema(
    {
        titulo: {type: String, required: true, trim: true},
        genero: {type: String, required: true, trim: true},
        año: {type: Number, required: true, min: 1895},
        duracion: {type: Number, required: true, min: 0},
        idioma: {type: String, required: true, trim: true},
        calificacion: {type: Number, required: true, min: 0},
        nc: {type: String, required: true, trim: true},
    },
    {
        timestamps:true
    }
);
const serieSchema = new mongoose.Schema(
    {
        titulo: {type: String, required: true, trim: true},
        genero: {type: String, required: true, trim: true},
        año: {type: Number, required: true, min: 1895},
        temporadas: {type: Number, required: true, min: 0},
        episodios: {type: Number, required: true, min: 0},
        idioma: {type: String, required: true, trim: true},
        calificacion: {type: Number, required: true, min: 0},
        nc: {type: String, required: true, trim: true},
    },
    {
        timestamps:true
    }
);

const Pelicula = mongoose.model("Pelicula", peliculaSchema,"peliculas");

const Serie = mongoose.model("Serie", serieSchema,"series");

app.get("/peliculas", async (req,res) =>{
    try{
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    }catch (error){
        res.status(500).json({
            mensaje: "Error al obtener las peliculas",
            error: error
        });
    }
});

app.get("/series", async (req,res) =>{
    try{
        const series = await Serie.find();
        res.json(series);
    }catch (error){
        res.status(500).json({
            mensaje: "Error al obtener las series...",
            error: error
        });
    }
});

app.get("/peliculas/:id", async (req,res) =>{
    const id = req.params.id;
    try{
        const pelicula = await Pelicula.findById(id);
        if(!pelicula){
            return res.status(404).json({mensaje:"Película no encontrada"});
        }
        res.json(pelicula);
    }catch(error){
         res.status(500).json({mensaje:"Error al obtener la película", error:error})
    }
});


app.get("/series/:id", async (req,res) =>{
    const id = req.params.id;
    try{
        const serie = await Serie.findById(id);
        if(!serie){
            return res.status(404).json({mensaje:"Serie no encontrada"});
        }
        res.json(serie);
    }catch(error){
         res.status(500).json({mensaje:"Error al obtener la serie", error:error})
    }
});

app.post("/peliculas", async (req,res) => {
    try{  
        const {titulo,genero,año,duracion,idioma,calificacion,nc} = req.body;
        if(!titulo || !genero || !año || !duracion || !idioma || !calificacion || !nc){
            return res.status(404).json({
                mensaje: "Faltan datos de la pelicula"
            });
        }
        const nuevaPelicula = new Pelicula({
            titulo,genero,año,duracion,idioma,calificacion,nc
        });
        const peliculaGuardada = await nuevaPelicula.save();
        res.json({
            mensaje: "Pelicula registrada correctamente",
            pelicula: peliculaGuardada
        });
    }catch(error){
        res.status(500).json({mensaje:"Error al guardar la Pelicula", error:error})
    }
});

app.post("/series", async (req,res) => {
    try{  
        const {titulo,genero,año,temporadas,episodios,idioma,calificacion,nc} = req.body;
        if(!titulo || !genero || !año || !temporadas || !episodios || !idioma || !calificacion || !nc){
            return res.status(404).json({
                mensaje: "Faltan datos de la serie"
            });
        }
        const nuevaSerie = new Serie({
            titulo,genero,año,temporadas,episodios,idioma,calificacion,nc
        });
        const serieGuardada = await nuevaSerie.save();
        res.json({
            mensaje: "Serie registrada correctamente",
            serie: serieGuardada
        });
    }catch(error){
        res.status(500).json({mensaje:"Error al guardar la Serie", error:error})
    }
})


app.put("/peliculas/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const {titulo,genero,año,duracion,idioma,calificacion,nc} = req.body;

        if(!titulo || !genero || !año || !duracion || !idioma || !calificacion || !nc){
            return res.status(404).json({
                mensaje: "Faltan datos de la pelicula"
            });
        }
        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            id,
            {titulo,genero,año,duracion,idioma,calificacion,nc},
             //New te regresa el documento ya actualizado si es true, si no, te regresa el método antes de actualziar
             // runValidators verifica que se cumplan las reglas del esquema antes de intentar hacer la actualización.
            {new: true, runValidators: true}
        );

        if (!peliculaActualizada){
            return res.status(404).json({
                mensaje: "Pelicula no encontrada."
            });
        }

        res.json({
            mensaje: "Pelicula actualizada correctamente",
            pelicula: peliculaActualizada
        });
    }catch(error){
        res.status(500).json({mensaje:"Error al actualizar Pelicula", error:error})
    }
    
});



app.put("/series/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const {titulo,genero,año,temporadas,episodios,idioma,calificacion,nc} = req.body;

        if(!titulo || !genero || !año || !temporadas || !episodios || !idioma || !calificacion || !nc){
            return res.status(404).json({
                mensaje: "Faltan datos de la serie"
            });
        }
        const serieActualizada = await Serie.findByIdAndUpdate(
            id,
            {titulo,genero,año,temporadas,episodios,idioma,calificacion,nc},
             //New te regresa el documento ya actualizado si es true, si no, te regresa el método antes de actualziar
             // runValidators verifica que se cumplan las reglas del esquema antes de intentar hacer la actualización.
            {new: true, runValidators: true}
        );

        if (!serieActualizada){
            return res.status(404).json({
                mensaje: "Serie no encontrada."
            });
        }

        res.json({
            mensaje: "Serie actualizada correctamente",
            serie: serieActualizada
        });
    }catch(error){
        res.status(500).json({mensaje:"Error al actualizar Serie", error:error})
    }
    
});

app.delete("/peliculas/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const peliculaBorrada = await Pelicula.findByIdAndDelete(id);
        if (!peliculaBorrada){
            return res.status(404).json({
                mensaje: "Pelicula no encontrada."
            });
        }
        
        res.json({
            mensaje: "Pelicula eliminada correctamente",
            pelicula: peliculaBorrada
        });
    }catch(error){
        res.status(500).json({mensaje:"Error al eliminar Pelicula", error:error});
    }
});


app.delete("/series/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const serieBorrada = await Serie.findByIdAndDelete(id);
        if (!serieBorrada){
            return res.status(404).json({
                mensaje: "Serie no encontrada."
            });
        }
        
        res.json({
            mensaje: "Serie eliminada correctamente",
            serie: serieBorrada
        });
    }catch(error){
        res.status(500).json({mensaje:"Error al eliminar Serie", error:error});
    }
});
module.exports = app;
/*
app.listen(PORT, () => {
    console.log("Servidor iniciado en http://localhost:"+PORT);
});
*/

