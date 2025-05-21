const Movie = require('../models/movies.js');
const express = require('express');
const app = express();

exports.getMovies = async (req, res) => {
    const { genre, anyInicial, anyFinal, rate } = req.query;

    try {
        const movies = await Movie.find({})
        let filteredMovies = [];
        if (rate) {
            filteredMovies = movies.sort((a, b) => {
                if (a.rate > b.rate) {
                    return 1;
                }
                if (a.rate < b.rate) {
                    return -1;
                }
                return 0;
            });
        }
        if (genre) {
            filteredMovies = movies.filter(movie => movie.genre.includes(genre));
        }
        if (anyInicial || anyFinal) {
            filteredMovies = movies.filter(
                movie => movie.year >= anyInicial && movie.year <= anyFinal
            );
        }
        if (filteredMovies.length === 0) {
            res.json(movies)
        } else {
            res.json(filteredMovies)
        }
    } catch (error) {
        res.send(error);
    }
}

exports.deleteMovie = async (req, res) => {
    const { _id } = req.params;

    try {
        const deletedMovie = await Movie.findByIdAndDelete(_id)
        console.log('Movie deleted!')
        res.redirect('/movies/list')
    } catch (error) {
        res.send(error);
    }
}