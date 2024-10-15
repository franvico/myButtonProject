import logoReact from './assets/logoReact.svg';
import logoNodejs from './assets/logoNodejs.svg';
import logoDocker from './assets/logoDocker.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Card, {CardBody} from './components/Card';
import Boton from './components/Boton';
import ListChistes from './components/ListChistes';
import ListQuijote from './components/ListQuijote';

function App() {

  const [ruta, setRuta] = useState('chistes');
  const [textoBoton, setTextoBoton] = useState('Cuéntame un chiste');
  const [fichero, setFichero] = useState(null);
  const [nombreFichero, setNombreFichero] = useState('');
  const [contenido, setContenido] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [cargaTrasFetch, setCargaTrasFetch] = useState(false);
  const [primerClic, setPrimerClic] = useState(true);

  // solo se ejecutará una vez tras el fetch
  useEffect(() => {
    if(cargaTrasFetch){
      if(primerClic){
        setContenido(contenido.concat(fichero[pagina]));
        setTextoBoton(nombreFichero === 'chistes' ? 'Respuesta' : 'Siguiente');
        setPagina(nombreFichero === 'chistes' ? pagina : pagina + 1);
        setPrimerClic(false);
      }
    }

  },[fichero, nombreFichero, pagina, primerClic, cargaTrasFetch, contenido]);

  return (
    <div className='App-container'>
      <h1>Bienvenido al botón de chistes aleatorios</h1>
      <Card>
        <CardBody/>
        <div className='divContenido'>
          {nombreFichero === 'chistes' && <ListChistes data={contenido} respuesta={textoBoton}/>}
          {nombreFichero === 'quijote' && <ListQuijote data={contenido}/>}
          <Boton texto={textoBoton} onClick={primerClic ? getContenido : mostrarContenido}/>
        </div>
      </Card>

      <p>
        <img src={logoDocker} alt='logo' />
        <img src={logoReact} className='App-logo' alt='logo' />
        <img src={logoNodejs} alt='logo'/>
      </p>
    </div>
  );

  function getContenido(){

    if(ruta !== ''){
      fetch(`http://localhost:3000/contenidoAleatorio?contenido=${ruta}`)
        .then(response=>{
          return response.json();
        })
        .then(data=>{
          setNombreFichero(ruta);
          setFichero(JSON.parse(data));
          setRuta('');
          setCargaTrasFetch(true);
        })
        .catch(err=>{
          setNombreFichero('');
          setRuta('quijote');
          console.log('Este es el error ' + err + '\nSe sirve otro documento en su lugar');
        });
    }
  }

  function mostrarContenido(){
    if(textoBoton === 'Respuesta'){
      setPagina(pagina + 1);
      setTextoBoton(nombreFichero === 'chistes' ? 'Otro Chiste' : 'Siguiente');
    }
    else{
      nombreFichero === 'quijote' ? setPagina(pagina + 1) : setPagina(pagina);
      setContenido(contenido.concat(fichero[pagina]));
      setTextoBoton(nombreFichero === 'chistes' ? 'Respuesta' : 'Siguiente');
    }
  }
}

export default App;
