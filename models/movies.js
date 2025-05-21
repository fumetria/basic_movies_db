const mongoose = require('mongoose');

let movieSchema = new mongoose.Schema({
    id: {
        type: String
    },
    title: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        min: 1900,
        max: 2024
    },
    director: String,
    duration: {
        type: Number,
        min: 0
    },
    poster: String,
    genre: [String],
    rate: {
        type: Number,
        min: 0,
        max: 10,
        default: 5
    },
    fav: {
        type: Boolean,
        default: false
    }
})

let Movie = mongoose.model('Movies', movieSchema);

module.exports = Movie;