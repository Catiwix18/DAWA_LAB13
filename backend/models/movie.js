const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: [{ type: String, required: true }], // Debe ser un arreglo de cadenas
    year: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    language: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    image: { type: String, required: false }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
