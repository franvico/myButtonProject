import React from 'react';
import './styles/Card.css';

function Card({ children }) {
  return (
    <div className='card'>
      <div className='card-body'>
        {children}
      </div>
    </div>
  );
}

export function CardBody(props){
  const {title} = props;

  return (
    <>
      <h5 className='card-title'>{title}</h5>
    </>
  );
}

export default Card;
