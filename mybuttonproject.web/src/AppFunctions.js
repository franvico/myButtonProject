export function reiniciarApp({listActual, list_config, setListOrder, setNombreFichero, setTitulo, setTextoBoton, setFichero, setContenido, setPagina, setCargaTrasFetch, setPrimerClic}){

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

export function mostrarContenido({textoBoton, setPagina, setContenido, contenido, fichero, pagina, nombreFichero, setTextoBoton, reiniciarApp, reiniciarAppParams, list_config}){

  switch(nombreFichero){
  case 'chistes' : mostrarContenidoChistes({textoBoton, setPagina, setContenido, contenido, fichero, pagina, nombreFichero, setTextoBoton, reiniciarApp, reiniciarAppParams, list_config});
    break;
  case 'quijote' :  mostrarContenidoQuijote({textoBoton, setPagina, setContenido, contenido, fichero, pagina, nombreFichero, setTextoBoton, reiniciarApp, reiniciarAppParams, list_config});
    break;
  default : console.log('');
  }
}

function mostrarContenidoChistes({textoBoton, setPagina, setContenido, contenido, fichero, pagina, nombreFichero, setTextoBoton, reiniciarApp, reiniciarAppParams, list_config}){
  if(textoBoton === 'Respuesta'){
    setPagina(pagina + 1);
    setTextoBoton(list_config[nombreFichero].textoBoton[2]);
  }
  else if(contenido.length === fichero.length){
    reiniciarApp(reiniciarAppParams);
    return;
  }
  else{
    setContenido(contenido.concat(fichero[pagina]));
    setTextoBoton(list_config[nombreFichero].textoBoton[1]);
  }
}

function mostrarContenidoQuijote({textoBoton, setPagina, setContenido, contenido, fichero, pagina, nombreFichero, setTextoBoton, reiniciarApp, reiniciarAppParams, list_config}){
  if(contenido.length === fichero.length){
    reiniciarApp(reiniciarAppParams);
    return;
  }
  else{
    setPagina(pagina + 1);
    setContenido(contenido.concat(fichero[pagina]));
    setTextoBoton(list_config[nombreFichero].textoBoton[1]);
  }
}
