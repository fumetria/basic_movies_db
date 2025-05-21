const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.get('authorization')

    if (!token) {
        return res.status(401).json({
            error: 'Acces denied'
        })
    }
    try {
        const tokenWithoutBearer = token.substring(7);
        const verified = jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).json({
            error: 'Invalid token'
        })
    }
}
