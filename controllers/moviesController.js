const Movie = require('../models/movies.js');
const express = require('express');
const jwt = require('jsonwebtoken');


const app = express();


exports.goToIndex = async (req, res) => {
    res.redirect('/movies')
}

exports.getMoviesPage = async (req, res) => {
    let user = ""
    const token = req.cookies.access_token || null;
    if (token) {
        user = jwt.decode(token);
    }
    const username = user?.username ? user.username.toUpperCase() : '';
    const movies = await Movie.find();
    res.render('./movies/index', { movies: movies, user: username })
}

//GET /movies/list - Retorna la llista de pel·lícules
exports.getMovies = async (req, res) => {
    // filtrat per un query string
    let user = "";

    const token = req.cookies.access_token
    if (token) {
        user = jwt.decode(token);
    }
    const username = user?.username ? user.username.toUpperCase() : '';
    const { genre, anyInicial, anyFinal, rate, fav, rate_f, title_o } = req.query;


    try {
        const movies = await Movie.find({})
        let filteredMovies = [];
        let rateFilter = "all";
        let rateIcon = "funnel";
        let title_order = "none";
        let titleOrderIcon = "";
        if (title_o === 'none') {
            filteredMovies = movies.sort((a, b) => {
                if (a.title > b.title) {
                    return 1;
                }
                if (a.title < b.title) {
                    return -1;
                }
                return 0;
            });
            title_order = "az";
            titleOrderIcon = "bi bi-sort-alpha-down";
        } else if (title_o === "az") {
            filteredMovies = movies.sort((a, b) => {
                if (a.rate > b.rate) {
                    return -1;
                }
                if (a.rate < b.rate) {
                    return 1;
                }
                return 0;
            });
            title_order = "za";
            titleOrderIcon = "bi bi-sort-alpha-down-alt";
        } else {
            title_order = "none";
            titleOrderIcon = ""
        }
        if (rate_f === 'all') {
            rateFilter = 'asc';
            rateIcon = 'sort-up';
            filteredMovies = movies.sort((a, b) => {
                if (a.rate > b.rate) {
                    return 1;
                }
                if (a.rate < b.rate) {
                    return -1;
                }
                return 0;
            });
        } else if (rate_f === 'asc') {
            rateFilter = 'desc';
            rateIcon = 'sort-down';
            filteredMovies = movies.sort((a, b) => {
                if (a.rate > b.rate) {
                    return -1;
                }
                if (a.rate < b.rate) {
                    return 1;
                }
                return 0;
            });
        } else {
            rateFilter = 'all'
            filteredMovies = movies;
        }
        if (genre) {
            filteredMovies = movies.filter(movie => movie.genre.includes(genre));
        }
        if (anyInicial || anyFinal) {
            filteredMovies = movies.filter(
                movie => movie.year >= anyInicial && movie.year <= anyFinal
            );
        }
        if (fav) {
            filteredMovies = movies.filter(movie => movie.fav.includes(fav));

        }
        if (filteredMovies.length === 0) {
            res.render('movies/llistar', { movies: movies, user: username, rate_filter: rateFilter, rateIcon: rateIcon, title_order: title_order, title_order_icon: titleOrderIcon })
        } else {
            res.render('movies/llistar', { movies: filteredMovies, user: username, rate_filter: rateFilter, rateIcon: rateIcon, title_order: title_order, title_order_icon: titleOrderIcon })
        }

    } catch (error) {
        res.render('movies/error', { error: error });
    }
}

exports.addMovieView = async (req, res) => {
    let user = ""
    const token = req.cookies.access_token
    if (token) {
        user = jwt.decode(token);
    }
    const username = user?.username ? user.username.toUpperCase() : '';
    try {
        res.render('movies/afegir', { user: username })
    } catch (error) {
        res.render('movies/error', { error: error });
    }
}

exports.getMoviesById = async (req, res) => {
    const { _id } = req.params;
    const movie = await Movie.findById(_id);
    // Tornem la pel·lícula si la troba
    if (movie) return res.send(movie)
    // Si no la troba, tornem un error 404
    res.status(404).json({ message: "Movie not found" });
}

//POST /movies - Afegeix una pel·lícula
exports.postMovie = async (req, res) => {
    const {
        title,
        year,
        director,
        duration,
        genre,
        rate,
        poster,
        fav
    } = req.body;

    try {
        const newMovie = await Movie.create({
            title,
            year,
            director,
            duration,
            poster,
            genre,
            rate,
            fav
        })

        res.render('movies/afegir');


    } catch (error) {
        res.render('movies/error', { error: error });
    }
}

exports.patchMovie = async (req, res) => {
    let user = ""
    const token = req.cookies.access_token
    if (token) {
        user = jwt.decode(token);
    }
    const username = user?.username ? user.username.toUpperCase() : '';
    const { _id } = req.params;
    const movie = Movie.find(_id);

    if (movie === null) {
        return res.status(404).json({ message: "Movie not found" });
    } else {
        const {
            title,
            year,
            director,
            duration,
            genre,
            rate,
            poster,
            fav
        } = req.body;

        Movie.findByIdAndUpdate(_id,
            {
                title: title,
                year: year,
                director: director,
                duration: duration,
                genre: genre,
                rate: rate,
                poster: poster,
                fav: fav
            }, { runValidators: true }
        ).then(r => {
            console.log('Movie updated!');
            res.redirect('/movies/list')
        }).catch(error => {
            const movie = new Movie(req.body)
            res.render('movies/editar', { movie, user: username, errors: error.errors })
        });
    };
};

exports.patchMovieFav = async (req, res) => {
    const { _id } = req.params;
    const movie = Movie.find(_id);

    favorit = false;
    if (movie === null) {
        return res.status(404).json({ message: "Movie not found" });
    } else {
        const { fav } = req.body;
        if (fav === 'true') {
            favorit = false;
        }
        if (fav === 'false') {
            favorit = true;
        }
        Movie.findByIdAndUpdate(_id,
            {
                fav: favorit
            }, { new: true }
        ).then(r => {
            console.log('Movie updated!');
            res.redirect('/movies/list')
        }).catch(e => {
            res.render('movies/error', { error: e || "" });
        });
    }

};


// Mostra el formulari d'edició de pel·lícules
exports.editMovieView = async (req, res) => {
    const { _id } = req.params;
    let user = ""
    const token = req.cookies.access_token
    if (token) {
        user = jwt.decode(token);
    }
    const username = user?.username ? user.username.toUpperCase() : '';

    try {
        const movie = await Movie.findById(_id)
        res.render('movies/editar', { movie, user: username })
    } catch (error) {
        res.render('movies/error', { error: error });
    }
}

exports.deleteMovieView = async (req, res) => {
    const { _id } = req.params;

    try {
        const deletedMovie = await Movie.findByIdAndDelete(_id)
        console.log('Movie deleted!')
        res.redirect('/movies/list')
    } catch (error) {
        res.render('movies/error', { error: error });
    }
}

