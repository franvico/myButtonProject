import React from 'react';
import './styles/Boton.css';

function Boton({texto, onClick }) {

  return (
    <button className='btn btn-success boton' type='button'
      onClick={onClick}>
      {texto}
    </button>
  );
}

export default Boton;
