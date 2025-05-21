const router = require('express').Router()

const usersController = require('../controllers/usersController.js')

router.get('/login', usersController.loginUserView);
router.post('/login', usersController.loginUser);
router.get('/register', usersController.registerUserView);
router.post('/register', usersController.registerUser);
router.get('/logout', usersController.logoutUser);

module.exports = router