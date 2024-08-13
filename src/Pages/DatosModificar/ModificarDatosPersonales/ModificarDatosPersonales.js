import './ModificarDatosPersonales.css'
import { InputCard } from '../../../Components/InputCard';
import InputComponent from '../../../Components/InputCedula';

import React from 'react'

function ModificarDatosPersonales() {
    const [values, setValues]= React.useState({    
        auxiliarSeleccion: '',
        documento:0,
        nombreCompleto:'',
        fechaIngreso:'',
        fechaTerminacion:'',
        regional:'',
        empresa: '', 
        cargo: '',
        posicion:0,
        tipoGasto:'',
        centroCosto:'',
        tipoPlanta:'',
        tipoIngreso:'',
        analistaSeleccion:'', 
        estado:''
        
      })
      const [error, setError] = React.useState('')
      const inputsOption = [
        {
          id: 'Auxiliar-Seleccion',
          label: 'Auxiliar Selección',
          placeholder: 'Ingresa el auxiliar de selección',
          state: 'auxiliarSeleccion'
        },
        {
          id: 'Documento',
          label: 'Documento',
          placeholder: 'Ingresa el documento',
          state: 'documento'
        },
        {
          id: 'Nombre-Completo',
          label: 'Nombre Completo',
          placeholder: 'Ingresa el nombre completo',
          state: 'nombreCompleto'
        },
        {
          id: 'Fecha-Ingreso',
          label: 'Fecha Ingreso',
          placeholder: 'Fecha de ingreso (AAAA-MM-DD)',
          state: 'fechaIngreso'
        },
        {
          id: 'Fecha-Terminacion',
          label: 'Fecha Terminación',
          placeholder: 'Fecha de terminación (AAAA-MM-DD)',
          state: 'fechaTerminacion'
        },
        {
          id: 'Regional',
          label: 'Regional',
          placeholder: 'Ingresa la regional',
          state: 'regional'
        },
        {
          id: 'Empresa',
          label: 'Empresa',
          placeholder: 'Ingresa la empresa',
          state: 'empresa'
        },
        {
          id: 'Cargo',
          label: 'Cargo',
          placeholder: 'Ingresa el cargo',
          state: 'cargo'
        },
        {
          id: 'Posicion',
          label: 'Posición',
          placeholder: 'Ingresa la posición',
          state: 'posicion'
        },
        {
          id: 'Tipo-Gasto',
          label: 'Tipo de Gasto',
          placeholder: 'Ingresa el tipo de gasto',
          state: 'tipoGasto'
        },
        {
          id: 'Centro-Costo',
          label: 'Centro de Costo',
          placeholder: 'Ingresa el centro de costo',
          state: 'centroCosto'
        },
        {
          id: 'Tipo-Planta',
          label: 'Tipo de Planta',
          placeholder: 'Ingresa el tipo de planta',
          state: 'tipoPlanta'
        },
        {
          id: 'Tipo-Ingreso',
          label: 'Tipo de Ingreso',
          placeholder: 'Ingresa el tipo de ingreso',
          state: 'tipoIngreso'
        },
        {
          id: 'Analista-Seleccion',
          label: 'Analista de Selección',
          placeholder: 'Ingresa el analista de selección',
          state: 'analistaSeleccion'
        },
        {
          id: 'Estado',
          label: 'Estado',
          placeholder: 'Ingresa el estado',
          state: 'estado'
        }
      ];

  return (
    <div>
      <div className= 'Modificacion_Datos_Personal'>
        <h1>MODIFICACIÓN DE DATOS PERSONALES Y ÚNICOS</h1>
        <InputComponent />
        </div>
        <form >
          {inputsOption.map((item, index)=>(
            <InputCard 
              id={item.id}
              label={item.label}
              placeholder={item.placeholder}
              onChange={(event)=>{setValues((prev)=>({...prev,[item.state]: event}))}}
              className="input-box"
              key={index}
            />                    
          ))}
          <button  className='Guardar' type='submit'>Guardar</button>
          <button  className='Cancelar'>Cancelar</button>
        </form>
    </div>  
    )
}

export default ModificarDatosPersonales;