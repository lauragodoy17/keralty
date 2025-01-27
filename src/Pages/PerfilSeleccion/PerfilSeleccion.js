import api from '../../Utils/Api';
import axios from 'axios'
import { Link,useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import MainWrapper from '../../Components/MainWrapper';
import ingreso from '../../Assets/ingreso4-removebg-preview.png'
import busqueda_imagen from '../../Assets/busqueda_imagen.png'

import modificar from '../../Assets/modificar_imagen.png'
import './PerfilSeleccion.css'


export default function PerfilSeleccion() {
    const [auth,setAuth]= useState(false);
    const [message, setMessage]=useState('')
    const [cedula, setCedula]= useState(' ')
    const navigate= useNavigate()
    axios.defaults.withCredentials=true; 
    const [selectedOption, setSelectedOption]= React.useState(null)

    const buttons={
        'Datos personales y únicos': <p/>,


    }

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
                console.log(res.data); // Verificar la respuesta del servidor
                setAuth(false);
                navigate('/Inicio');
            })
            .catch(err => {
                console.log('Error:', err); // Imprimir el error
            });
    };

    
      const handleCardClickRegistrar = () => {
        navigate('/IngresoSeleccion');
      };
      const handleCardClick = () => {
        navigate('/BusquedaPsicologos');
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
          Ingreso Personas, psicologo
        </div>
      </div>

      <div className='Cartas' onClick={handleCardClick}>
        <img src={busqueda_imagen}className='Imagen-perfil'/>
        <div className='NombrePerfil'>
          Busqueda Personas, psicologo
        </div>
      </div>

      </div>
</div>
     )
}