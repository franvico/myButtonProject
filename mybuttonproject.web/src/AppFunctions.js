export function reiniciarApp({listActual, list_config, setListOrder, setNombreFichero, setTitulo, setTextoBoton, setFichero, setContenido, setPagina, setCargaTrasFetch, setPrimerClic, setMensajeEspera}){

  // si se terminan los .json disponibles se vuelve al primero
  let listSiguiente = (listActual + 1) % list_config['listOrder'].length;
  let nombreFicheroSiguiente = list_config['listOrder'][listSiguiente];

  setListOrder(listSiguiente);
  setNombreFichero(nombreFicheroSiguiente);
  setTitulo(list_config[nombreFicheroSiguiente].titulo);
  setTextoBoton(list_config[nombreFicheroSiguiente].textoBoton[0]);
  setMensajeEspera(list_config[nombreFicheroSiguiente].esperaMsg);
  setFichero(null);
  setContenido([]);
  setPagina(0);
  setCargaTrasFetch(false);
  setPrimerClic(true);
}

export function getContenido({contenido, setIsLoading, setFichero, setCargaTrasFetch, nombreFichero, reiniciarApp, reiniciarAppParams}){

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
        reiniciarApp(reiniciarAppParams);
        console.log('Este es el error ' + err + '\nSe sirve otro documento en su lugar');
      }).finally(()=>{
        setIsLoading(false);
      });
  }
}

export function mostrarContenido({setPagina, setContenido, contenido, fichero, pagina, nombreFichero, setTextoBoton, reiniciarApp, reiniciarAppParams, list_config, bloqueActual, setBloqueActual}){

  if(bloqueActual === list_config[nombreFichero].bloques && list_config[nombreFichero].bloques !== 1){
    setPagina(pagina + 1);
    setTextoBoton(list_config[nombreFichero].textoBoton[bloqueActual]);
    setBloqueActual(1);
  }
  else if(contenido.length === fichero.length){
    reiniciarApp(reiniciarAppParams);
    return;
  }
  else{
    list_config[nombreFichero].bloques === 1 ? setPagina(pagina + 1): setBloqueActual(bloqueActual + 1);
    setContenido(contenido.concat(fichero[pagina]));
    setTextoBoton(list_config[nombreFichero].textoBoton[bloqueActual]);
  }
}
