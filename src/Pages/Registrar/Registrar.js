import './Registrar.css'
import MainWrapper from '../../Components/MainWrapper';
import axios from 'axios';
import api from '../../Utils/Api';
import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import DatosRegistroPersonales from '../DatosRegistro/DatosRegistroPersonales';


function Registrar() {
    const [auth,setAuth]= useState(false);
    const [message, setMessage]=useState('')
    const [cedula, setCedula]= useState(' ')

  
    const navigate= useNavigate()
  
    axios.defaults.withCredentials=true; 
  
      const [selectedOption, setSelectedOption]= React.useState(null)
  
      const buttons={
          'Datos personales y únicos': <DatosRegistroPersonales/>,
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
    <MainWrapper buttons={buttons} selectedOption={selectedOption} setSelectedOption={setSelectedOption} nombre={'Registro'} >

    </MainWrapper>
    </div> 
  )
}

export default Registrar