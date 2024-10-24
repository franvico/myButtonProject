import logoReact from './assets/logoReact.svg';
import logoNodejs from './assets/logoNodejs.svg';
import logoDocker from './assets/logoDocker.svg';
import './App.css';
import React, { useState, useEffect, Suspense } from 'react';
import Card, {CardBody} from './components/Card';
import Boton from './components/Boton';
import ListChistes from './components/ListChistes';
import list_config from './lists_config.json';
import { getContenido, mostrarContenido, reiniciarApp } from './AppFunctions';
// const ListChistes = React.lazy(() => import('./components/ListChistes'));
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
  // algunos ficheros tienen más de una línea por párrafo, esta variable indica cuántos ciclos tengo que esperar para concatenar el siguiente párrafo del fichero al contenido a mostrar
  // cuando llegue a 0 concatenaré el siguiente párrafo al contenido a mostrar
  const [bloqueActual, setBloqueActual] = useState(1);
  const [mensajeEspera, setMensajeEspera] = useState(list_config[nombreFichero].esperaMsg);

  const reiniciarAppParams = {listActual, list_config, setListOrder, setNombreFichero, setTitulo, setTextoBoton, setFichero, setContenido, setPagina, setCargaTrasFetch, setPrimerClic, setMensajeEspera};
  const getContenidoParams = {contenido, setIsLoading, setFichero, setCargaTrasFetch, nombreFichero, reiniciarApp, reiniciarAppParams};
  const mostrarContenidoParams = {setPagina, setContenido, contenido, fichero, pagina, nombreFichero, setTextoBoton, reiniciarApp, reiniciarAppParams, list_config, bloqueActual, setBloqueActual};

  const listasIntegradas = {
    ListChistes: ListChistes,
    ListQuijote: ListQuijote
  };
  const listaActual = listasIntegradas[list_config[nombreFichero].tipoLista];

  // solo se ejecutará una vez tras el fetch
  useEffect(() => {
    if(cargaTrasFetch){
      if(primerClic){
        setContenido(contenido.concat(fichero[pagina]));
        setTextoBoton(list_config[nombreFichero].textoBoton[1]);
        bloqueActual === list_config[nombreFichero].bloques ? setPagina(pagina + 1) : setBloqueActual(bloqueActual + 1);
        setPrimerClic(false);
      }
    }

  },[fichero, nombreFichero, pagina, primerClic, cargaTrasFetch, contenido, bloqueActual]);

  return (
    <div className='App-container'>
      <h1>{titulo}</h1>
      <Card>
        <CardBody/>
        <div className='divContenido'>
          {isLoading ? (
            <div>{mensajeEspera}</div>
          ) : (
            <>
              <Suspense fallback={<div>{mensajeEspera}</div>}>
                {React.createElement(listaActual, { data: contenido, respuesta: textoBoton })}
              </Suspense>
              <Boton texto={textoBoton} onClick={()=>{primerClic ? getContenido(getContenidoParams) : mostrarContenido(mostrarContenidoParams);}}/>
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
}

export default App;
