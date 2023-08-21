const express = require('express');
const router = express.Router(); 

const controllers = require('../controllers/authController')

router.get('/', authController.Authenticated, (req, res) => {
    conexion()
    res.render('index')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.get('/logout', authController.logout)
module.exports = router