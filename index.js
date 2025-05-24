// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3080;

// Ruta raíz: responde "Hello World!"
app.get('/', (req, res) => {
  res.send('Hello World, es magia!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
