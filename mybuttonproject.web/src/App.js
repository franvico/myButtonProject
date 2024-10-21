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

  const reiniciarAppParams = {listActual, list_config, setListOrder, setNombreFichero, setTitulo, setTextoBoton, setFichero, setContenido, setPagina, setCargaTrasFetch, setPrimerClic};
  const getContenidoParams = {contenido, setIsLoading, setFichero, setCargaTrasFetch, nombreFichero, reiniciarApp, reiniciarAppParams};
  const mostrarContenidoParams = {textoBoton, setPagina, setContenido, contenido, fichero, pagina, nombreFichero, setTextoBoton, reiniciarApp, reiniciarAppParams, list_config};

  // solo se ejecutará una vez tras el fetch
  useEffect(() => {
    if(cargaTrasFetch){
      if(primerClic){
        setContenido(contenido.concat(fichero[pagina]));
        setTextoBoton(list_config[nombreFichero].textoBoton[1]);
        setPagina(list_config[nombreFichero].espera === 0 ? pagina + 1 : pagina);
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
