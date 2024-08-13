import React, { useContext, useState,  } from 'react'
import { FaLock } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import './Inicio.css'
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import api from '../../Utils/Api';
import useAuth from '../../Hooks/useAuth';




export default function Inicio() {
  const { setAuth } = useAuth();
  const [values, setValues] = useState({
    email: '',
    contraseña: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3080/Inicio', {
        email: values.email,
        contraseña: values.contraseña
      });

      console.log(response.data);
      if (response.data.Status === "Success") {
        const { role } = response.data; 
        
        if (role === 1) {
          navigate('/Selecciona');
        } else if (role === 2) {
          navigate('/Busqueda');
        } else if( role===3){
          navigate('/Modificar');
        } else if (role===4){
          navigate('/Registrar')
        } else if (role===5){
          navigate('/PerfilCinco')
        } else if(role===6){
          navigate('/PerfilSeis')
        } else if(role===7){
          navigate('/PerfilSiete')
        }
        else if(role === 0){
          navigate('/noAutorizado')
        }

        else {
          setError('ERROR EN LA AUTENTIFICACION');
        }

      } else {
        setError(response.data.Error || 'Error desconocido');
      }
    } catch (error) {
      setError('Error al intentar iniciar sesión. Verifique sus credenciales.');
    }
  };



  return (
<div className="main-wrapper">
      <div className="wrapper-login">
          <div className="form-box login">
              <form onSubmit={handleSubmit}>
                  <h1>Inicia sesión</h1>

                  <div className="input-box">
                      <input type="text"
                      placeholder="Correo" 
                      onChange={e => setValues({...values, email: e.target.value})}
                      required/>
                      <IoIosMail className="icon" />
                  </div>

                  <div className="input-box">
                      <input type="password"
                      placeholder="Contraseña"
                      onChange={e => setValues({...values, contraseña: e.target.value})}
                      required/>
                      <FaLock className="icon" />

                    <a className="olvidaste" href='#'>¿Olvidaste tu contraseña?</a>
                  </div>

                  <button type="submit">Iniciar</button>
          
              </form>
              {error && <div className="error-message">{error}</div>}

          </div>
      </div>
    </div>   
  );
};

