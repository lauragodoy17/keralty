import './NoAutorizado.css'
import api from '../../Utils/Api';
import axios from 'axios'
import { Link,useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'


function NoAutorizado() {
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

  return (
    <div className='main-wrapper'>
        <h1>No tienes permiso para acceder a ninguna función, comunicate con tu jefe directo</h1>
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
  )
}

export default NoAutorizado;