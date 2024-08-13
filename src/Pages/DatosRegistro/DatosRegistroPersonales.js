import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { InputCard } from '../../Components/InputCard';
import './DatosRegistroPersonales.css';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../Utils/Api';

function DatosRegistroPersonales() {
  const initialValues = {
    auxiliarSeleccion: '',
    documento: 0,
    nombreCompleto: '',
    fechaIngreso: '',
    fechaTerminacion: '',
    regional: '',
    empresa: '', 
    cargo: '',
    posicion: '',
    tipoGasto: '',
    centroCosto: '',
    tipoPlanta: '',
    tipoIngreso: '',
    analistaSeleccion: '', 
    estado: ''
  };
  
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const reload = () => {
    navigate(0); 
  };

  const inputsOption = [
    { id: 'Auxiliar-Seleccion', label: 'Auxiliar Selección', placeholder: 'Ingresa el auxiliar de selección', state: 'auxiliarSeleccion' },
    { id: 'Documento', label: 'Documento', placeholder: 'Ingresa el documento', state: 'documento' },
    { id: 'Nombre-Completo', label: 'Nombre Completo', placeholder: 'Ingresa el nombre completo', state: 'nombreCompleto' },
    { id: 'Fecha-Ingreso', label: 'Fecha Ingreso', placeholder: 'Fecha de ingreso (AAAA-MM-DD)', state: 'fechaIngreso' },
    { id: 'Fecha-Terminacion', label: 'Fecha Terminación', placeholder: 'Fecha de terminación (AAAA-MM-DD)', state: 'fechaTerminacion' },
    { id: 'Regional', label: 'Regional', placeholder: 'Ingresa la regional', state: 'regional' },
    { id: 'Empresa', label: 'Empresa', placeholder: 'Ingresa la empresa', state: 'empresa' },
    { id: 'Cargo', label: 'Cargo', placeholder: 'Ingresa el cargo', state: 'cargo' },
    { id: 'Posicion', label: 'Posición', placeholder: 'Ingresa la posición', state: 'posicion' },
    { id: 'Tipo-Gasto', label: 'Tipo de Gasto', placeholder: 'Ingresa el tipo de gasto', state: 'tipoGasto' },
    { id: 'Centro-Costo', label: 'Centro de Costo', placeholder: 'Ingresa el centro de costo', state: 'centroCosto' },
    { id: 'Tipo-Planta', label: 'Tipo de Planta', placeholder: 'Ingresa el tipo de planta', state: 'tipoPlanta' },
    { id: 'Tipo-Ingreso', label: 'Tipo de Ingreso', placeholder: 'Ingresa el tipo de ingreso', state: 'tipoIngreso' },
    { id: 'Analista-Seleccion', label: 'Analista de Selección', placeholder: 'Ingresa el analista de selección', state: 'analistaSeleccion' },
  ];

  const handleChange = (e, field) => {
    const value = e.target ? e.target.value : e; 
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    let formErrors = {};

    if (values.documento) {
      if (isNaN(values.documento)) {
        formErrors.documento = 'El documento debe ser un número';
      } else if (values.documento.toString().length < 10) {
        formErrors.documento = 'La cédula debe tener al menos 10 dígitos';
      }
    }
    
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (values.fechaIngreso && !datePattern.test(values.fechaIngreso)) {
      formErrors.fechaIngreso = 'Fecha de ingreso debe estar en el formato AAAA-MM-DD';
    }

    if (values.posicion && isNaN(values.posicion)) {
      formErrors.posicion = 'La posición debe ser un número';
    }
    setErrors(formErrors); 
    return formErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm();    
    if (Object.keys(formErrors).length === 0) {
      axios.post(`${api}/Registrar`, values)
        .then(res => {
          if (res.data.Status === "Success") {
            swal({
              title: "Bien hecho!",
              text: "Tu registro fue guardado exitosamente",
              icon: "success",
              buttons: ["","Aceptar"]
            }).then(respuesta => {
              if (respuesta) {
                window.location.reload();
              }
            });
          } else {
            setMessage("Error en el registro.");
          }
        })
        .catch(err => {
          console.log(err);
          setMessage("Error en el servidor.");
        });
    }
  };

  return (
    <div>
      <div className="Registro_Datos_Personal">
        <h1>REGISTRO DE DATOS PERSONALES Y ÚNICOS</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {inputsOption.map((item, index) => (
          <div key={index}>
            <InputCard
              id={item.id}
              label={item.label}
              placeholder={item.placeholder}
              value={values[item.state]}
              onChange={(e) => handleChange(e, item.state)}
              className="input-box"
            />
            {errors[item.state] && <p className="error">{errors[item.state]}</p>}
          </div>
        ))}

        <div className="select-container">
          <label className="estado">Selecciona el Estado *</label>
          <select
            name="estado"
            value={values.estado}
            onChange={(e) => handleChange(e, "estado")}
          >
            <option value="">- Selecciona uno - </option>
            <option value="activo">- Activo - </option>
            <option value="inactivo">- Inactivo - </option>
          </select>
          {errors.estado && <p className="error">{errors.estado}</p>}
        </div>

        <div className="button-container">
          <button className="Guardar" type="submit">Guardar</button>
          <button onClick={reload} className="Cancelar" type="button">Cancelar</button>
        </div>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default DatosRegistroPersonales;





