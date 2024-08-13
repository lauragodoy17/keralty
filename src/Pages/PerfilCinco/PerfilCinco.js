import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PerfilCinco.css'
import api from '../../Utils/Api';
import busqueda_imagen from '../../Assets/busqueda_imagen.png'
import ingreso from '../../Assets/ingreso4-removebg-preview.png'
import modificar from '../../Assets/modificar_imagen.png'



export default function PerfilCinco() {
  const [auth,setAuth]= useState(false);
  const [message, setMessage]=useState('')
  const [cedula, setCedula]= useState(' ')
  const navigate= useNavigate()

  axios.defaults.withCredentials=true; 

  useEffect(()=> {
    axios.get(`${api}`)
    .then(res=> {
        if (res.data.Status === "Success"){
            setAuth(true)
            setCedula(res.data.cedula)
        } else{
            setAuth(false)
            setMessage(res.data.Error)
            navigate('/Inicio')
        }
    })
    .then(err=> console.log(err));
  },[])

  const handleDelete= ()=>{
    axios.get(`${api}/logout`)
    .then(res=> {
        window.location.reload(true);
    }).catch(err=>console.log(err));
  }

  const handleCardClick = () => {
    navigate('/Busqueda');
  };

  const handleCardClickModificar = () => {
    navigate('/Modificar');
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
      <div className='Cartas' onClick={handleCardClick}>
        <img src={busqueda_imagen}className='Imagen-perfil'/>
        <div className='NombrePerfil'>
          Busqueda
        </div>
        
      </div>

      <div className='Carta_modificar' onClick={handleCardClickModificar}>
        <img src={modificar}className='Imagen-perfil'/>
        <div className='NombrePerfil'>
          Modificar
        </div>
      </div>

      </div>

      </div>
    
  )
}