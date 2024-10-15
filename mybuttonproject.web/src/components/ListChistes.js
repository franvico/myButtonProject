import React, { useEffect, useRef } from 'react';
import './styles/List.css';

function ListChistes({data, respuesta}){

  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  });

  return(
    <ul className='list-group list scrollable-container' ref={listRef}>
      {data.map((chiste, indice) => (
        <React.Fragment key={indice}>
          <div className='divPregunta'>
            <li className='list-group-item'>{chiste.pregunta}</li>
          </div>
          {((indice === data.length - 1 && respuesta !== 'Respuesta') || (indice < data.length - 1)) &&(
            <div className='divRespuesta'>
              <li className='list-group-item'>{chiste.respuesta}</li>
            </div>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
}

export default ListChistes;
