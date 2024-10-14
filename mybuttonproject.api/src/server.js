import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
// necesario para acceder a las variables de entonrno del fichero .env
dotenv.config();
// necesario para permitir las peticiones Cross-Origin Resource Sharing desde el frontend
app.use(cors());

const directorioActual = path.dirname(new URL(import.meta.url).pathname);

// endpoints
app.get('/', (req, res)=>{
  res.send('<div>Hola desde la raiz del server</div>');
});

app.get('/contenidoAleatorio', solicitarContenido);

// inicio el servidor
app.listen(3000, () => {
  console.log('server listening on port http://localhost:3000');
});


// funciones
async function solicitarContenido(req, res) {
  const contenido = req.query.contenido;

  if(contenido === 'quijote'){
    const parrafosQuijote = await cargarQuijote();
    if(parrafosQuijote != null){
      res.json(parrafosQuijote);
    } else{
      cargarFichero(contenido, res);
    }
  }
  else{
    cargarFichero(contenido, res);
  }
}

async function cargarFichero(contenido, res) {
  try{
    const rutaFichero = path.join(directorioActual, '/assets/', contenido + '.json');

    fs.readFile(rutaFichero, 'utf-8', (err, data)=>{
      if(err){
        res.status(500).send('Internal server error, fichero no encontrado');
      } else{
        res.json(data);
      }
    });
  }catch(err){
    res.status(400).send('Ruta al fichero incorrecta');
  }
}

async function cargarQuijote() {
  // eslint-disable-next-line no-undef
  const prompt = process.env.PROMPT_QUIJOTE;
  const response = await fetch('https://api.openai.com/v1/chat/completions',{
    method:'POST',
    headers:{
      // eslint-disable-next-line no-undef
      'Authorization': `Bearer ${process.env.OPEN_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{rol: 'user', content: prompt}],
      max_tokens: 200
    })
  });

  const data = await response.json();

  if('error' in data){
    console.log('Error en la respuesta de OpenAI');
    console.log('Mensaje: '+  data.error.message);
    return null;
  }

  return JSON.parse(data.choices[0].message.content);
}
