import React from 'react'
import { InputCard } from '../../../Components/InputCard';
import './BusquedaDatosFormacion.css'
import InputComponent from '../../../Components/InputCedula';

function BusquedaDatosFormacion() {
    const [values, setValues]= React.useState({    
        aprobaciones: '',
        conflictoInteres:'',
        pruebasPsicotecnicas:'',
        entrevistaSeleccion:'',
        informeCorrelacionCargo:'',
        visitaDomiciliaria:'',
        cartaSeguridadSocial: '', 
        infolaft: '',
        fechaConsultaInfolaft:'',
        inhabilidades:'',
        fechaConsultaInhabilidades:'',
        consultaAprendizaje:'',
        cartaPresentacionInstitutoUniversidad:'',
        examenMedicoIngreso:'', 
        reporteCentralesRiesgo:'',
        rethus:'',
        informeFinalEstudioSeguridad:'',
        afiliacionARL:'',
        afilicacionCaja:'',
        afiliacionEPS:'',
        contratoFirmado:'',
        perfilCargoFirmado:'',
        prorroga:'',
        indefinido:'',
        polizaVida:'',
        sustitucionPatronal:'',
        clausulaAdicional:''    
      })
      const inputsOption = [
        { id: 'Aprobaciones', label: 'Aprobaciones', placeholder: '', state: 'aprobaciones' },
        { id: 'Conflicto-Interes', label: 'Conflicto de Interés', placeholder: '', state: 'conflictoInteres' },
        { id: 'Pruebas-Psicotecnicas', label: 'Pruebas Psicotécnicas', placeholder: '', state: 'pruebasPsicotecnicas' },
        { id: 'Entrevista-Seleccion', label: 'Entrevista de Selección', placeholder: '', state: 'entrevistaSeleccion' },
        { id: 'Informe-Correlacion-Cargo', label: 'Informe de Correlación de Cargo', placeholder: '', state: 'informeCorrelacionCargo' },
        { id: 'Visita-Domiciliaria', label: 'Visita Domiciliaria', placeholder: '', state: 'visitaDomiciliaria' },
        { id: 'Carta-Seguridad-Social', label: 'Carta de Seguridad Social', placeholder: '', state: 'cartaSeguridadSocial' },
        { id: 'Infolaft', label: 'Infolaft', placeholder: '', state: 'infolaft' },
        { id: 'Fecha-Consulta-Infolaft', label: 'Fecha de Consulta Infolaft', placeholder: '', state: 'fechaConsultaInfolaft' },
        { id: 'Inhabilidades', label: 'Inhabilidades', placeholder: '', state: 'inhabilidades' },
        { id: 'Fecha-Consulta-Inhabilidades', label: 'Fecha de Consulta Inhabilidades', placeholder: '', state: 'fechaConsultaInhabilidades' },
        { id: 'Consulta-Aprendizaje', label: 'Consulta de Aprendizaje', placeholder: '', state: 'consultaAprendizaje' },
        { id: 'Carta-Presentacion-Instituto-Universidad', label: 'Carta de Presentación Instituto/Universidad', placeholder: '', state: 'cartaPresentacionInstitutoUniversidad' },
        { id: 'Examen-Medico-Ingreso', label: 'Examen Médico de Ingreso', placeholder: '', state: 'examenMedicoIngreso' },
        { id: 'Reporte-Centrales-Riesgo', label: 'Reporte de Centrales de Riesgo', placeholder: '', state: 'reporteCentralesRiesgo' },
        { id: 'Rethus', label: 'Rethus', placeholder: '', state: 'rethus' },
        { id: 'Informe-Final-Estudio-Seguridad', label: 'Informe Final del Estudio de Seguridad', placeholder: '', state: 'informeFinalEstudioSeguridad' },
        { id: 'Afiliacion-ARL', label: 'Afiliación ARL', placeholder: '', state: 'afiliacionARL' },
        { id: 'Afilicacion-Caja', label: 'Afiliación a la Caja', placeholder: '', state: 'afilicacionCaja' },
        { id: 'Afiliacion-EPS', label: 'Afiliación EPS', placeholder: '', state: 'afiliacionEPS' },
        { id: 'Contrato-Firmado', label: 'Contrato Firmado', placeholder: '', state: 'contratoFirmado' },
        { id: 'Perfil-Cargo-Firmado', label: 'Perfil de Cargo Firmado', placeholder: '', state: 'perfilCargoFirmado' },
        { id: 'Prorroga', label: 'Prórroga', placeholder: '', state: 'prorroga' },
        { id: 'Indefinido', label: 'Indefinido', placeholder: '', state: 'indefinido' },
        { id: 'Poliza-Vida', label: 'Póliza de Vida', placeholder: '', state: 'polizaVida' },
        { id: 'Sustitucion-Patronal', label: 'Sustitución Patronal', placeholder: '', state: 'sustitucionPatronal' },
        { id: 'Clausula-Adicional', label: 'Cláusula Adicional', placeholder: '', state: 'clausulaAdicional' }
      ];
  return (
    <div>
      <div className= 'Busqueda_Datos_Formacion'>
        <h1>BUSQUEDA PARA DATOS DE INDOLE LABORAL</h1>
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


export default BusquedaDatosFormacion