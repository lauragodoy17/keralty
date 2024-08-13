import './ModificarDatosNomina.css'
import { InputCard } from '../../../Components/InputCard';
import InputComponent from '../../../Components/InputCedula';

import React from 'react'

function ModificarDatosNomina() {
    const [values, setValues]= React.useState({    
        cartaPersonalRetirado: '',
        cartaExamenMedicoEgreso:'',
        cartaEntregaSoportesPagosSGSS:'',
        cartaRetiroCesantias:'',
        cartaAceptacionRenuncia:'',
        cartaFaseFinal:'',
        certificadoAportesTresMeses: '', 
        liquidacion: '',     
      })
      const [error, setError] = React.useState('')

      const inputsOption = [
        { id: 'Carta-Personal-Retirado', label: 'Carta Personal Retirado', placeholder: 'Ingresa la carta personal del retirado', state: 'cartaPersonalRetirado' },
        { id: 'Carta-Examen-Medico-Egreso', label: 'Carta Examen Médico de Egreso', placeholder: 'Ingresa la carta del examen médico de egreso', state: 'cartaExamenMedicoEgreso' },
        { id: 'Carta-Entrega-Soportes-Pagos-SGSS', label: 'Carta Entrega Soportes Pagos SGSS', placeholder: 'Ingresa la carta de entrega de soportes de pagos SGSS', state: 'cartaEntregaSoportesPagosSGSS' },
        { id: 'Carta-Retiro-Cesantias', label: 'Carta Retiro Cesantías', placeholder: 'Ingresa la carta de retiro de cesantías', state: 'cartaRetiroCesantias' },
        { id: 'Carta-Aceptacion-Renuncia', label: 'Carta Aceptación Renuncia', placeholder: 'Ingresa la carta de aceptación de renuncia', state: 'cartaAceptacionRenuncia' },
        { id: 'Carta-Fase-Final', label: 'Carta Fase Final', placeholder: 'Ingresa la carta de fase final', state: 'cartaFaseFinal' },
        { id: 'Certificado-Aportes-Tres-Meses', label: 'Certificado Aportes Tres Meses', placeholder: 'Ingresa el certificado de aportes de tres meses', state: 'certificadoAportesTresMeses' },
        { id: 'Liquidacion', label: 'Liquidación', placeholder: 'Ingresa la liquidación', state: 'liquidacion' }
    ];
  return (
    <div>
        <div className= 'Modificar_Datos_Nomina'>
        <h1>MODIFICACIÓN DE DATOS DE INDOLE DE NÓMINA</h1>
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

export default ModificarDatosNomina
