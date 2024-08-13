import React from 'react';
import salud_dibujo from '../../Assets/salud_dibujo_final.png'
import './Home.css';
import Header from '../../Components/Header/Header';

 function Home() {
  return (
<div className='main-container'>
      <div className='container'>
        <div className='container-titulo'>


            <h1 className="Titulo">
              Compromiso Global con la Salud: <br /> Modelo Integral de Bienestar y Cuidado Personalizado
            </h1>


            <h2 className= "Subtitulo">
              Comprometidos en mantener la salud de la  población mediante un Modelo <br /> de Salud Integral
              que enfoca en la prevención, gestión de riesgos y <br />cuidado de enfermedades y dependencias.
            </h2>


        </div>
        <div className='container-imagen'>
            <img className='imagen' src={salud_dibujo} alt='' />
        </div>


      </div>
    </div>
  );
}
export default Home;
