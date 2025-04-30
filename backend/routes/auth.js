const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
//Status: Agregada ruta para refrescar el token
router.get('/refresh', authController.refresh);

module.exports = router;
