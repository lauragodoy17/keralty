import React from 'react'
import { InputCard } from '../../../Components/InputCard';
import './BusquedaDatosNomina.css'
import InputComponent from '../../../Components/InputCedula';

function BusquedaDatosNomina() {
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
        { id: 'Carta-Personal-Retirado', label: 'Carta Personal Retirado', placeholder: '', state: 'cartaPersonalRetirado' },
        { id: 'Carta-Examen-Medico-Egreso', label: 'Carta Examen Médico de Egreso', placeholder: '', state: 'cartaExamenMedicoEgreso' },
        { id: 'Carta-Entrega-Soportes-Pagos-SGSS', label: 'Carta Entrega Soportes Pagos SGSS', placeholder: '', state: 'cartaEntregaSoportesPagosSGSS' },
        { id: 'Carta-Retiro-Cesantias', label: 'Carta Retiro Cesantías', placeholder: '', state: 'cartaRetiroCesantias' },
        { id: 'Carta-Aceptacion-Renuncia', label: 'Carta Aceptación Renuncia', placeholder: '', state: 'cartaAceptacionRenuncia' },
        { id: 'Carta-Fase-Final', label: 'Carta Fase Final', placeholder: '', state: 'cartaFaseFinal' },
        { id: 'Certificado-Aportes-Tres-Meses', label: 'Certificado Aportes Tres Meses', placeholder: '', state: 'certificadoAportesTresMeses' },
        { id: 'Liquidacion', label: 'Liquidación', placeholder: '', state: 'liquidacion' }
    ];
    
  return (
    <div>
        <div className= 'Busqueda_Datos_Nomina'>
        <h1>BUSQUEDA PARA DATOS DE INDOLE DE NÓMINA</h1>
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
        </form>
    </div>    
  )
}

export default BusquedaDatosNomina