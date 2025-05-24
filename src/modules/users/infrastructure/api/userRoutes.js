const express = require('express');
const router = express.Router();
const UserContainer = require('@users/infrastructure/container');

// Inicializar el container
const container = new UserContainer();

// Ruta para crear un usuario
router.post('/', async (req, res) => {
    try {
        const { name, communicationType } = req.body;
        const user = await container.createUserHandler.handle(name, communicationType);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para listar usuarios
router.get('/', async (req, res) => {
    try {
        const users = await container.listUsersHandler.handle();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 