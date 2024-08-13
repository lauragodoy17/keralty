import React from 'react'
import { InputCard } from '../../../Components/InputCard';
import './BusquedaDatosLaboral.css'
import InputComponent from '../../../Components/InputCedula';

function BusquedaDatosLaboral() {
    const [values, setValues]= React.useState({    
        copiaCertificadoSoporteVitalBasico: '',
        fechaVencimientoBLS:'',
        certificadoSoporteVitalAvanzadoVigente:'',
        fechaVencimientoACLS:'',
        cursoAtencionIntegralVictimasViolenciaGenero:'',
        cursoPALS:'',
        fechaVencimientoCursoPALS: '', 
        cursoNALS: '',
        fechaVencimientoCursoNALS:'',
        tomaMuestrasLaboratorio:'',
        cursoPrimerosAuxilios:'',
        cursoCamillero:'',
        induccionCorporativaKeralty:'',
        cursoManejoDuelo:'', 
        cursoVictimasAtaquesAgentesQuimicos:'',
        cursoDonacionOrganos:''       
      })

      const [error, setError] = React.useState('')

      const inputsOption = [
        { id: 'Copia-Certificado-Soporte-Vital-Basico', label: 'Copia Certificado Soporte Vital Básico', placeholder: '', state: 'copiaCertificadoSoporteVitalBasico' },
        { id: 'Fecha-Vencimiento-BLS', label: 'Fecha de Vencimiento BLS', placeholder: '', state: 'fechaVencimientoBLS' },
        { id: 'Certificado-Soporte-Vital-Avanzado-Vigente', label: 'Certificado Soporte Vital Avanzado Vigente', placeholder: '', state: 'certificadoSoporteVitalAvanzadoVigente' },
        { id: 'Fecha-Vencimiento-ACLS', label: 'Fecha de Vencimiento ACLS', placeholder: '', state: 'fechaVencimientoACLS' },
        { id: 'Curso-Atencion-Integral-Victimas-Violencia-Genero', label: 'Curso Atención Integral Víctimas Violencia de Género', placeholder: '', state: 'cursoAtencionIntegralVictimasViolenciaGenero' },
        { id: 'Curso-PALS', label: 'Curso PALS', placeholder: '', state: 'cursoPALS' },
        { id: 'Fecha-Vencimiento-Curso-PALS', label: 'Fecha Vencimiento Curso PALS', placeholder: '', state: 'fechaVencimientoCursoPALS' },
        { id: 'Curso-NALS', label: 'Curso NALS', placeholder: '', state: 'cursoNALS' },
        { id: 'Fecha-Vencimiento-Curso-NALS', label: 'Fecha Vencimiento Curso NALS', placeholder: '', state: 'fechaVencimientoCursoNALS' },
        { id: 'Toma-Muestras-Laboratorio', label: 'Toma de Muestras de Laboratorio', placeholder: '', state: 'tomaMuestrasLaboratorio' },
        { id: 'Curso-Primeros-Auxilios', label: 'Curso Primeros Auxilios', placeholder: '', state: 'cursoPrimerosAuxilios' },
        { id: 'Curso-Camillero', label: 'Curso Camillero', placeholder: '', state: 'cursoCamillero' },
        { id: 'Induccion-Corporativa-Keralty', label: 'Inducción Corporativa Keralty', placeholder: '', state: 'induccionCorporativaKeralty' },
        { id: 'Curso-Manejo-Duelo', label: 'Curso Manejo del Duelo', placeholder: '', state: 'cursoManejoDuelo' },
        { id: 'Curso-Victimas-Ataques-Agentes-Quimicos', label: 'Curso Víctimas de Ataques con Agentes Químicos', placeholder: '', state: 'cursoVictimasAtaquesAgentesQuimicos' },
        { id: 'Curso-Donacion-Organos', label: 'Curso Donación de Órganos', placeholder: '', state: 'cursoDonacionOrganos' }
      ];
  return (
    <div>
      <div className= 'Busqueda_Datos_Laboral'>
        <h1>BUSQUEDA PARA DATOS DE INDOLE DE FORMACIÓN</h1>
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

export default BusquedaDatosLaboral