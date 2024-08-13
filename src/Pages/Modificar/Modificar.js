import './Modificar.css'
import MainWrapper from '../../Components/MainWrapper';
import axios from 'axios';
import api from '../../Utils/Api';
import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import ModificarDatosPersonales from '../DatosModificar/ModificarDatosPersonales/ModificarDatosPersonales';
import ModificarDatosPersonal from '../DatosModificar/ModificarDatosPersonal/ModificarDatosPersonal';
import ModificarDatosFormacion from '../DatosModificar/ModificarDatosFormacion/ModificarDatosFormacion';
import ModificarDatosLaboral from '../DatosModificar/ModificarDatosLaboral/ModificarDatosLaboral';
import ModificarDatosNomina from '../DatosModificar/ModificarDatosNomina/ModificarDatosNomina';


function Modificar() {
    const [auth,setAuth]= useState(false);
    const [message, setMessage]=useState('')
    const [cedula, setCedula]= useState(' ')
    const navigate= useNavigate()
  
    axios.defaults.withCredentials=true; 
  
      const [selectedOption, setSelectedOption]= React.useState(null)
  
      const buttons={
          'Datos personales y únicos': <ModificarDatosPersonales/>,
          'Datos Personal':<ModificarDatosPersonal/>,
          'Datos Formación':<ModificarDatosFormacion/>,
          'Datos Laboral':<ModificarDatosLaboral/>,
          'Datos Nomina':<ModificarDatosNomina/>
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
      <MainWrapper buttons={buttons} selectedOption={selectedOption} setSelectedOption={setSelectedOption} nombre={'Modificación'} >

      </MainWrapper>
    </div>  )
}

export default Modificar