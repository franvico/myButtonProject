import React from 'react';
import './styles/List.css';

function ListQuijote({data}){

  return(
    <ul className='list-group list scrollable-container'>
      {data.slice().reverse().map((item, indice)=>(
        <div className='divParrafo' key={indice}>
          <li className='list-group-item'>{item.parrafo}</li>
        </div>
      ))}
    </ul>
  );
}

export default ListQuijote;
