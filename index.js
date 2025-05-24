// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Ruta raíz: responde "Hello World!"
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
