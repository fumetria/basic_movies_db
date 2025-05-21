const jwt = require('jsonwebtoken');

// Middleware per comprovar si l'usuari està autenticat i guardar la sessió
exports.verifyCookieToken = (req, res, next) => {
    // Comprovar si l'usuari està autenticat
    const token = req.cookies.access_token
    req.session = { user: null }

    try {
        // Validar el token
        if (token != null) {
            const verified = jwt.verify(token, process.env.SECRET_KEY)
            req.session.user = verified
        }

    } catch (error) {
        return res.render('movies/error', { error })
    }

    next()
}

// Middleware per comprovar si l'usuari està autenticat i no deixar passar
exports.loggedIn = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/users/login')
    }
}