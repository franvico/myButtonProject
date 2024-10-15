import logoReact from './assets/logoReact.svg';
import logoNodejs from './assets/logoNodejs.svg';
import logoDocker from './assets/logoDocker.svg';
import './App.css';
import React from 'react';
import Card, {CardBody} from './components/Card';
import Boton from './components/Boton';
import List from './components/List';

function App() {

  return (
    <div className='App-container'>
      <h1>Bienvenido al botón de chistes aleatorios</h1>
      <Card>
        <CardBody/>
        <div className='divContenido'>
          <List/>
          <Boton texto='Cuéntame un chiste'/>
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
