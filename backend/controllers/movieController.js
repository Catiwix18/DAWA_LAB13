const Movie = require('../models/movie');

// Obtener todas las películas
exports.getMovies = (req, res) => {
    Movie.find()
        .then((movies) => {
            res.json(movies);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

// Obtener una película por su ID
exports.getMovieById = (req, res) => {
    Movie.findById(req.params.id)
        .then((movie) => {
            if (!movie) {
                return res.status(404).json({ message: 'Película no encontrada' });
            }
            res.json(movie);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

// Crear una nueva película
exports.createMovie = async (req, res) => {
  try {
      const { title, director, year, rating, description, duration, language, releaseDate } = req.body;
      const genres = JSON.parse(req.body.genres); // Parsear el JSON string a un array
      const imagePath = req.file ? req.file.path : ''; // Ruta de la imagen, si está presente

      // Verificar si el campo genres está presente y es un array no vacío
      if (!genres || !Array.isArray(genres) || genres.length === 0) {
          return res.status(400).json({ error: 'El campo genres es requerido y debe ser un arreglo con al menos un género.' });
      }

      // Crear una nueva instancia de Movie
      const newMovie = new Movie({
          title,
          director,
          genre: genres,
          year,
          rating,
          description,
          duration,
          language,
          releaseDate,
          image: imagePath
      });

      // Guardar la película en la base de datos
      const savedMovie = await newMovie.save();

      // Devolver la respuesta con la película creada
      res.status(201).json(savedMovie);
  } catch (error) {
      // Manejar errores
      console.error('Error al crear la película:', error);
      res.status(500).json({ error: 'Hubo un error al crear la película' });
  }
};
// Actualizar una película existente
exports.updateMovie = (req, res) => {
  const updatedMovie = {
      ...req.body,
      genre: JSON.parse(req.body.genres), // Parsear el JSON string a un array
      image: req.file ? req.file.path : req.body.image // Mantiene la imagen existente si no se carga una nueva
  };
  
  Movie.findByIdAndUpdate(req.params.id, updatedMovie, { new: true })
      .then((movie) => {
          if (!movie) {
              return res.status(404).json({ message: 'Película no encontrada' });
          }
          res.json(movie);
      })
      .catch((error) => {
          res.status(500).json({ error: error.message });
      });
};


// Eliminar una película existente
exports.deleteMovie = (req, res) => {
    Movie.findByIdAndDelete(req.params.id)
        .then((movie) => {
            if (!movie) {
                return res.status(404).json({ message: 'Película no encontrada' });
            }
            res.json({ message: 'Película eliminada correctamente' });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};
