const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const movieController = require('./controllers/movieController');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para CORS, bodyParser y archivos estáticos
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para manejar archivos con multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único basado en la fecha
    }
});

const upload = multer({ storage: storage });

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
        // Definir rutas para CRUD después de la conexión exitosa
        defineRoutes();
    })
    .catch((error) => {
        console.log('Error al conectar a MongoDB:', error);
    });

// Función para definir las rutas CRUD
function defineRoutes() {
    app.get('/api/movies', movieController.getMovies);
    app.get('/api/movies/:id', movieController.getMovieById);
    app.post('/api/movies', upload.single('image'), movieController.createMovie);  
    app.put('/api/movies/:id', upload.single('image'), movieController.updateMovie);
    app.delete('/api/movies/:id', movieController.deleteMovie);

    // Iniciar el servidor después de definir las rutas
    app.listen(port, () => {
        console.log(`Servidor backend en funcionamiento en el puerto ${port}`);
    });
}
