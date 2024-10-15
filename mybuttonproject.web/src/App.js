import logoReact from './assets/logoReact.svg';
import logoNodejs from './assets/logoNodejs.svg';
import logoDocker from './assets/logoDocker.svg';
import './App.css';
import React, { useState, useEffect, Suspense } from 'react';
import Card, {CardBody} from './components/Card';
import Boton from './components/Boton';
import ListChistes from './components/ListChistes';
const ListQuijote = React.lazy(() => import('./components/ListQuijote'));

function App() {

  const [ruta, setRuta] = useState('chistes');
  const [textoBoton, setTextoBoton] = useState(ruta === 'chistes' ? 'Cuéntame un chiste' : 'Leer el Quijote');
  const [titulo, setTitulo] = useState(ruta === 'chistes' ? 'Bienvenido al botón de chistes aleatorios' : 'Suficientes risas, pongámonos serios');
  const [fichero, setFichero] = useState(null);
  const [nombreFichero, setNombreFichero] = useState('');
  const [contenido, setContenido] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [cargaTrasFetch, setCargaTrasFetch] = useState(false);
  const [primerClic, setPrimerClic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
      <h1>{titulo}</h1>
      <Card>
        <CardBody/>
        <div className='divContenido'>
          {isLoading ? (
            <div>Cargando contenido...</div>
          ) : (
            <>
              {nombreFichero === 'chistes' && <ListChistes data={contenido} respuesta={textoBoton}/>}
              <Suspense fallback={<div>Cargando El Quijote...</div>}>
                {nombreFichero === 'quijote' && <ListQuijote data={contenido}/>}
              </Suspense>
              <Boton texto={textoBoton} onClick={primerClic ? getContenido : mostrarContenido}/>
            </>
          )}
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
      setIsLoading(true);
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
        }).finally(()=>{
          setIsLoading(false);
        });
    }
  }

  function mostrarContenido(){

    if(textoBoton === 'Respuesta'){
      setPagina(pagina + 1);
      setTextoBoton(nombreFichero === 'chistes' ? 'Otro Chiste' : 'Siguiente');
    }
    else if(contenido.length === fichero.length){
      reiniciarApp();
      return;
    }
    else{
      nombreFichero === 'quijote' ? setPagina(pagina + 1) : setPagina(pagina);
      setContenido(contenido.concat(fichero[pagina]));
      setTextoBoton(nombreFichero === 'chistes' ? 'Respuesta' : 'Siguiente');
    }
  }

  function reiniciarApp(){
    setRuta(nombreFichero === 'chistes' ? 'quijote' : 'chistes');
    setTextoBoton(nombreFichero === 'chistes' ?'Leer el Quijote' : 'Cuéntame un chiste');
    setTitulo(nombreFichero === 'chistes' ? 'Suficientes risas, pongámonos serios' : 'Bienvenido al botón de chistes aleatorios');
    setFichero(null);
    setNombreFichero('');
    setContenido([]);
    setPagina(0);
    setCargaTrasFetch(false);
    setPrimerClic(true);
  }
}

export default App;
