const express = require('express');
let router = express.Router();
const moviesController = require('../controllers/moviesController.js');
const { verifyToken } = require('./validate-token');
const authMiddleware = require('./authMiddleware.js');

router.get('/', moviesController.goToIndex);

//get Main page
router.get('/movies', moviesController.getMoviesPage)

/**
* GET /movies - Retorna la llista de les pel·lícules, si existeix un filtre, filtra
* segons criteris
*/
router.get('/movies/list', moviesController.getMovies);

router.get('/movies/addmovie', authMiddleware.verifyCookieToken, authMiddleware.loggedIn, moviesController.addMovieView)


router.post('/movies/addmovie', moviesController.postMovie)

//GET /movies/{:id} - Obtenir la informació d'una pel·lícula concreta

router.get('/movies/:_id', moviesController.getMoviesById);

// POST /movies - Afegeix una pel·lícula a la llista
router.post('/movies', moviesController.postMovie);

// Resta d'endpoints DELETE, PATCH, etc.
router.get('/movies/edit/:_id', authMiddleware.verifyCookieToken, authMiddleware.loggedIn, moviesController.editMovieView)

router.post('/movies/update/:_id', authMiddleware.verifyCookieToken, authMiddleware.loggedIn, moviesController.patchMovie);

router.post('/movies/update/fav/:_id', moviesController.patchMovieFav);

router.post('/movies/delete/:_id', authMiddleware.verifyCookieToken, authMiddleware.loggedIn, moviesController.deleteMovieView);

module.exports = router;