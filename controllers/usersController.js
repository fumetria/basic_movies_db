const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require(__dirname + '/../models/users');

exports.loginUserView = async (req, res) => {
    res.render('./users/login')
}

// Login user and return token
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username })

    // Compare password
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    // If user or password are incorrect, return error
    if (!(user && passwordCorrect)) {
        return res.render('users/login', { error: 'Invalid username or password' })
    }

    // Create token payload
    const payload = {
        username: user.username,
        id: user._id
    }

    const SECRET_KEY = process.env.SECRET_KEY

    // Create token
    const token = jwt.sign(
        payload,            // Payload (username and id)
        SECRET_KEY,             // Secret key
        { expiresIn: '1h' }  // Expiration time in seconds
    )

    res.cookie('access_token', token, {
        httpOnly: true, // Cookie is only accessible by the server
        // secure: true,   // Cookie is only sent over HTTPS (En producció)
        maxAge: 1000 * 60 * 60 //Cookie expires in 1 hour
    }).redirect('/');

}

exports.registerUserView = async (req, res) => {
    res.render('./users/register');
}

// Register user
exports.registerUser = async (req, res) => {
    const { username, password } = req.body;

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user object
    const user = new User({
        username,
        passwordHash
    })

    // Save user in DB
    const savedUser =
        await user.save()
            .catch((error) => {
                res.status(400).json({
                    error: error.message
                })
            }
            )

    // Return saved user (without passwordHash)
    res.json(savedUser.username)
}

// Logout user
exports.logoutUser = async (req, res) => {
    res.clearCookie('access_token').redirect('/')
}
