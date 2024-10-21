import logoReact from './assets/logoReact.svg';
import logoNodejs from './assets/logoNodejs.svg';
import logoDocker from './assets/logoDocker.svg';
import './App.css';
import React, { useState, useEffect, Suspense } from 'react';
import Card, {CardBody} from './components/Card';
import Boton from './components/Boton';
import ListChistes from './components/ListChistes';
import list_config from './lists_config.json';
const ListQuijote = React.lazy(() => import('./components/ListQuijote'));

function App() {

  const [listActual, setListOrder] = useState(0);
  const [nombreFichero, setNombreFichero] = useState(list_config['listOrder'][listActual]);
  const [textoBoton, setTextoBoton] = useState(list_config[nombreFichero].textoBoton[0]);
  const [titulo, setTitulo] = useState(list_config[nombreFichero].titulo);
  const [fichero, setFichero] = useState(null);
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
        setTextoBoton(list_config[nombreFichero].textoBoton[1]);
        setPagina(list_config[nombreFichero].saltoPagina === 0 ? pagina : pagina + 1);
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

    if(contenido.length === 0){
      setIsLoading(true);
      fetch(`http://localhost:3000/contenidoAleatorio?contenido=${nombreFichero}`)
        .then(response=>{
          return response.json();
        })
        .then(data=>{
          setFichero(JSON.parse(data));
          setCargaTrasFetch(true);
        })
        .catch(err=>{
          reiniciarApp();
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

    // si se terminan los .json disponibles se vuelve al primero
    let listSiguiente = (listActual + 1) % list_config['listOrder'].length;
    let nombreFicheroSiguiente = list_config['listOrder'][listSiguiente];

    setListOrder(listSiguiente);
    setNombreFichero(nombreFicheroSiguiente);
    setTitulo(list_config[nombreFicheroSiguiente].titulo);
    setTextoBoton(list_config[nombreFicheroSiguiente].textoBoton[0]);
    setFichero(null);
    setContenido([]);
    setPagina(0);
    setCargaTrasFetch(false);
    setPrimerClic(true);
  }
}

export default App;
