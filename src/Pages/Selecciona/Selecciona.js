import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Selecciona.css'
import api from '../../Utils/Api';
import busqueda_imagen from '../../Assets/busqueda_imagen.png'
import ingreso from '../../Assets/ingreso4-removebg-preview.png'
import modificar from '../../Assets/modificar_imagen.png'
import estadistica from '../../Assets/estadistica2-removebg-preview.png'



export default function Selecciona() {
  const [auth,setAuth]= useState(false);
  const [message, setMessage]=useState('')
  const [cedula, setCedula]= useState(' ')
  const navigate= useNavigate()

  axios.defaults.withCredentials=true; 

  useEffect(() => {
    axios.get(`${api}`)
        .then(res => {
            if (res.data.Status === "Success") {
                setAuth(true);
                setCedula(res.data.cedula);
            } else {
                setAuth(false);
                setMessage(res.data.Error);
                navigate('/Inicio');
            }
        })
        .catch(err => console.log(err)); // Agrega .catch para manejar errores
}, []);


const handleDelete = () => {
  axios.get(`${api}/logout`)
      .then(res => {
          setAuth(false); // Cambiar estado de autenticación
          navigate('/Inicio'); // Redirigir a la página de inicio
      })
      .catch(err => console.log(err));
};


  const handleCardClickRegistrar = () => {
    navigate('/Registrar');
  };
  const handleCardClickModificar = () => {
    navigate('/Modificar');
  };
  const handleCardClick = () => {
    navigate('/Busqueda');
  };






  return (
    <div className='main-wrapper'>
      <div className='container_selecciona'>
        {
          auth ?
          <div>
            <button className='boton_salir' onClick={handleDelete} >Cerrar sesión</button>
          </div>
          :
          <div>
            <h3>{message}</h3>
            <h3></h3>
            <Link to="/Inicio" className='boton_primario'></Link>
          </div>
        }
      </div>

      <h2 className="titulo">Selecciona según tu necesidad</h2>

      <div className='cartas-wrapper'>

      <div className='Carta_ingreso' onClick={handleCardClickRegistrar}>
        <img src={ingreso}className='Imagen-perfil'/>
        <div className='NombrePerfil'>
          Ingreso
        </div>
      </div>

      <div className='Carta_modificar' onClick={handleCardClickModificar}>
        <img src={modificar}className='Imagen-perfil'/>
        <div className='NombrePerfil'>
          Modificar Usuarios
        </div>
      </div>
      
      <div className='Cartas' onClick={handleCardClick}>
        <img src={busqueda_imagen}className='Imagen-perfil'/>
        <div className='NombrePerfil'>
          Busqueda
        </div>
        
      </div>





      </div>

      </div>
    
  )
}
