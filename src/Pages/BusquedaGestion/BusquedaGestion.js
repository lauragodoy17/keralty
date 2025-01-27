import MainWrapper from '../../Components/MainWrapper';
import axios from 'axios';
import api from '../../Utils/Api';
import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import DatosBusquedaGestion from '../DatosBusquedaGestion/DatosBusquedaGestion';


function BusquedaGestion() {
  const [auth,setAuth]= useState(false);
  const [message, setMessage]=useState('')
  const [cedula, setCedula]= useState(' ')
  const navigate= useNavigate()

  axios.defaults.withCredentials=true; 

    const [selectedOption, setSelectedOption]= React.useState(null)

    const buttons={
        'Datos personales y únicos': <DatosBusquedaGestion/>,
    

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
            setAuth(false); // Cambiar estado de autenticación
            navigate('/Inicio'); // Redirigir a la página de inicio
        })
        .catch(err => console.log(err));
  };

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

export default BusquedaGestion