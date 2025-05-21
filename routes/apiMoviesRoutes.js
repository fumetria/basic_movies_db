const express = require('express');
let router = express.Router();
const apiMoviesController = require('../controllers/apiMoviesController.js');
const { verifyToken } = require('./validate-token');

router.get('/movies', apiMoviesController.getMovies);


// DELETE /api/movies/:id - Elimina una pel·lícula de la llista
//router.delete('/:id',moviesController.deleteMovie)

// DELETE /api/movies/:id - Elimina una pel·lícula de la llista (versió amb validació de token)
router.post('/:id', verifyToken, apiMoviesController.deleteMovie)

module.exports = router;