const express = require('express');
const mongoose = require('mongoose');

// Connexió a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/moviesDB')
    .then(() => {
        console.log('Connected to the DB!');
    })
    .catch((e) => {
        console.log('Error connecting to MongoDB ', e);
    });

//Model de Movie
const Movie = require('../models/movies.js');

//Dades de prova
const movies = require('./movies.json');

//Inserir dades a la base de dades a partir del fitxer JSON
Movie.insertMany(movies)
    .then(() => {
        console.log("Data inserted");
    })
    .catch(er => {
        console.log("Error inserting data", er);
    });


