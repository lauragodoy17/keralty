import './ModificarDatosFormacion.css'
import { InputCard } from '../../../Components/InputCard';
import InputComponent from '../../../Components/InputCedula';

import React from 'react'

function ModificarDatosFormacion() {
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
        { id: 'Copia-Certificado-Soporte-Vital-Basico', label: 'Copia Certificado Soporte Vital Básico', placeholder: 'Ingresa la copia del certificado de soporte vital básico', state: 'copiaCertificadoSoporteVitalBasico' },
        { id: 'Fecha-Vencimiento-BLS', label: 'Fecha de Vencimiento BLS', placeholder: 'Fecha de vencimiento del certificado BLS (AAAA-MM-DD)', state: 'fechaVencimientoBLS' },
        { id: 'Certificado-Soporte-Vital-Avanzado-Vigente', label: 'Certificado Soporte Vital Avanzado Vigente', placeholder: 'Ingresa el certificado de soporte vital avanzado vigente', state: 'certificadoSoporteVitalAvanzadoVigente' },
        { id: 'Fecha-Vencimiento-ACLS', label: 'Fecha de Vencimiento ACLS', placeholder: 'Fecha de vencimiento del certificado ACLS (AAAA-MM-DD)', state: 'fechaVencimientoACLS' },
        { id: 'Curso-Atencion-Integral-Victimas-Violencia-Genero', label: 'Curso Atención Integral Víctimas Violencia de Género', placeholder: 'Ingresa el curso de atención integral a víctimas de violencia de género', state: 'cursoAtencionIntegralVictimasViolenciaGenero' },
        { id: 'Curso-PALS', label: 'Curso PALS', placeholder: 'Ingresa el curso PALS', state: 'cursoPALS' },
        { id: 'Fecha-Vencimiento-Curso-PALS', label: 'Fecha Vencimiento Curso PALS', placeholder: 'Fecha de vencimiento del curso PALS (AAAA-MM-DD)', state: 'fechaVencimientoCursoPALS' },
        { id: 'Curso-NALS', label: 'Curso NALS', placeholder: 'Ingresa el curso NALS', state: 'cursoNALS' },
        { id: 'Fecha-Vencimiento-Curso-NALS', label: 'Fecha Vencimiento Curso NALS', placeholder: 'Fecha de vencimiento del curso NALS (AAAA-MM-DD)', state: 'fechaVencimientoCursoNALS' },
        { id: 'Toma-Muestras-Laboratorio', label: 'Toma de Muestras de Laboratorio', placeholder: 'Ingresa el curso de toma de muestras de laboratorio', state: 'tomaMuestrasLaboratorio' },
        { id: 'Curso-Primeros-Auxilios', label: 'Curso Primeros Auxilios', placeholder: 'Ingresa el curso de primeros auxilios', state: 'cursoPrimerosAuxilios' },
        { id: 'Curso-Camillero', label: 'Curso Camillero', placeholder: 'Ingresa el curso de camillero', state: 'cursoCamillero' },
        { id: 'Induccion-Corporativa-Keralty', label: 'Inducción Corporativa Keralty', placeholder: 'Ingresa la inducción corporativa Keralty', state: 'induccionCorporativaKeralty' },
        { id: 'Curso-Manejo-Duelo', label: 'Curso Manejo del Duelo', placeholder: 'Ingresa el curso de manejo del duelo', state: 'cursoManejoDuelo' },
        { id: 'Curso-Victimas-Ataques-Agentes-Quimicos', label: 'Curso Víctimas de Ataques con Agentes Químicos', placeholder: 'Ingresa el curso de víctimas de ataques con agentes químicos', state: 'cursoVictimasAtaquesAgentesQuimicos' },
        { id: 'Curso-Donacion-Organos', label: 'Curso Donación de Órganos', placeholder: 'Ingresa el curso de donación de órganos', state: 'cursoDonacionOrganos' }
      ];
  return (
    <div>
      <div className= 'Modificar_Datos_Formacion'>
        <h1>MODIFICACIÓN DE DATOS DE INDOLE DE FORMACIÓN</h1>
        <InputComponent />
        </div>
        <form >
          {inputsOption.map((item, index)=>(
            <InputCard 
              id={item.id}
              label={item.label}
             S placeholder={item.placeholder}
              onChange={(event)=>{setValues((prev)=>({...prev,[item.state]: event}))}}
              className="input-box"
              key={index}
            />                    
          ))}
            <button  className='Guardar' type='submit'>Guardar</button>
            <button  className='Cancelar'>Cancelar</button>
        </form>
    </div>      )
}
export default ModificarDatosFormacion