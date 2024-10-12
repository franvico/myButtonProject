import express from 'express';

const app = express();

console.log('hola desde el server');   

app.get('/', (req, res) => {
  console.log('peticion recibida con cambios modificado');
  res.send('<h1>Hola mundo desde express</h1>');
});

app.listen(3000, () => {
  console.log('server listening on port http://localhost:3000');
});
