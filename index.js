require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const moviesRouter = require('./routes/moviesRoutes.js');
const moviesRouterAPI = require('./routes/apiMoviesRoutes.js');
const usersRouter = require('./routes/userRoutes.js');
const nunjucks = require('nunjucks');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cors());

app.set('view engine', 'njk');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
// Habilitar l'analisi de dades enviades a través de formularis HTML
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

mongoose.connect(process.env.DB_HOST)
    .then(() => {
        console.log('Connected to the DB!');
    })
    .catch((e) => {
        console.log('Error connecting to MongoDB ', e);
    });

const authMiddleware = require(__dirname + '/routes/authMiddleware.js')
app.use(authMiddleware.verifyCookieToken) // S'aplicaria a totes les rutes

app.use('/', moviesRouter);

app.use('/api', moviesRouterAPI);

app.use('/users', usersRouter);


app.listen(process.env.PORT, () => {
    console.log(`Excercici pel·licules escoltant a localhost:${process.env.PORT}/`);
});

