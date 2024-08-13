import './Busqueda.css'
import BusquedaPropia from '../DatosBusqueda/BusquedaPropia/BusquedaPropia'
import MainWrapper from '../../Components/MainWrapper';
import axios from 'axios';
import api from '../../Utils/Api';
import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import BusquedaDatosPersonal from '../DatosBusqueda/BusquedaDatosPersonal/BusquedaDatosPersonal';
import BusquedaDatosFormacion from '../DatosBusqueda/BusquedaDatosFormacion/BusquedaDatosFormacion';
import BusquedaDatosLaboral from '../DatosBusqueda/BusquedaDatosLaboral/BusquedaDatosLaboral';
import BusquedaDatosNomina from '../DatosBusqueda/BusquedaDatosNomina/BusquedaDatosNomina';


function Busqueda() {
  const [auth,setAuth]= useState(false);
  const [message, setMessage]=useState('')
  const [cedula, setCedula]= useState(' ')
  const navigate= useNavigate()

  axios.defaults.withCredentials=true; 

    const [selectedOption, setSelectedOption]= React.useState(null)

    const buttons={
        'Datos personales y únicos': <BusquedaPropia/>,
        'Datos Personal':<BusquedaDatosPersonal/>,
        'Datos Formación':<BusquedaDatosLaboral/>,
        'Datos Laboral':<BusquedaDatosFormacion/>,
        'Datos Nomina':<BusquedaDatosNomina/>,

    }

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
    <div>
      <div>
              <button className='boton_salir' onClick={handleDelete} >Cerrar sesión</button>
            </div>
      <MainWrapper buttons={buttons} selectedOption={selectedOption} setSelectedOption={setSelectedOption} nombre={'Busqueda'} >

      </MainWrapper>
    </div>
  )
}

export default Busqueda