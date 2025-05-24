// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3080;

// Initialize welcome module
require('@welcome/application/handlers/UserCreatedEventHandler');

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('@users/infrastructure/api/userRoutes');
app.use('/api/users', userRoutes);

// Ruta raíz: responde "Hello World!"
app.get('/', (req, res) => {
  res.send('Hello World, es magia!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
