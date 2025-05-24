const express = require('express');
const router = express.Router();
const CreateUserHandler = require('@users/application/handlers/CreateUserHandler');
const ListUsersHandler = require('@users/application/handlers/ListUsersHandler');
const InMemoryUserRepository = require('@users/infrastructure/repositories/InMemoryUserRepository');

// Inicializar el repositorio y los handlers
const userRepository = new InMemoryUserRepository();
const createUserHandler = new CreateUserHandler(userRepository);
const listUsersHandler = new ListUsersHandler(userRepository);

// Ruta para crear un usuario
router.post('/', async (req, res) => {
    try {
        const { name, communicationType } = req.body;
        const user = await createUserHandler.handle(name, communicationType);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para listar usuarios
router.get('/', async (req, res) => {
    try {
        const users = await listUsersHandler.handle();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 