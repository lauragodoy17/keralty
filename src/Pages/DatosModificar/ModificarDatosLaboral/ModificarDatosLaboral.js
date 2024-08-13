import './ModificarDatosLaboral.css'
import { InputCard } from '../../../Components/InputCard';
import InputComponent from '../../../Components/InputCedula';

import React from 'react'

function ModificarDatosLaboral() {
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
        { id: 'Aprobaciones', label: 'Aprobaciones', placeholder: 'Ingresa las aprobaciones', state: 'aprobaciones' },
        { id: 'Conflicto-Interes', label: 'Conflicto de Interés', placeholder: 'Ingresa el conflicto de interés', state: 'conflictoInteres' },
        { id: 'Pruebas-Psicotecnicas', label: 'Pruebas Psicotécnicas', placeholder: 'Ingresa las pruebas psicotécnicas', state: 'pruebasPsicotecnicas' },
        { id: 'Entrevista-Seleccion', label: 'Entrevista de Selección', placeholder: 'Ingresa la entrevista de selección', state: 'entrevistaSeleccion' },
        { id: 'Informe-Correlacion-Cargo', label: 'Informe de Correlación de Cargo', placeholder: 'Ingresa el informe de correlación de cargo', state: 'informeCorrelacionCargo' },
        { id: 'Visita-Domiciliaria', label: 'Visita Domiciliaria', placeholder: 'Ingresa la visita domiciliaria', state: 'visitaDomiciliaria' },
        { id: 'Carta-Seguridad-Social', label: 'Carta de Seguridad Social', placeholder: 'Ingresa la carta de seguridad social', state: 'cartaSeguridadSocial' },
        { id: 'Infolaft', label: 'Infolaft', placeholder: 'Ingresa el infolaft', state: 'infolaft' },
        { id: 'Fecha-Consulta-Infolaft', label: 'Fecha de Consulta Infolaft', placeholder: 'Fecha de la consulta de infolaft (AAAA-MM-DD)', state: 'fechaConsultaInfolaft' },
        { id: 'Inhabilidades', label: 'Inhabilidades', placeholder: 'Ingresa las inhabilidades', state: 'inhabilidades' },
        { id: 'Fecha-Consulta-Inhabilidades', label: 'Fecha de Consulta Inhabilidades', placeholder: 'Fecha de la consulta de inhabilidades (AAAA-MM-DD)', state: 'fechaConsultaInhabilidades' },
        { id: 'Consulta-Aprendizaje', label: 'Consulta de Aprendizaje', placeholder: 'Ingresa la consulta de aprendizaje', state: 'consultaAprendizaje' },
        { id: 'Carta-Presentacion-Instituto-Universidad', label: 'Carta de Presentación Instituto/Universidad', placeholder: 'Ingresa la carta de presentación del instituto o universidad', state: 'cartaPresentacionInstitutoUniversidad' },
        { id: 'Examen-Medico-Ingreso', label: 'Examen Médico de Ingreso', placeholder: 'Ingresa el examen médico de ingreso', state: 'examenMedicoIngreso' },
        { id: 'Reporte-Centrales-Riesgo', label: 'Reporte de Centrales de Riesgo', placeholder: 'Ingresa el reporte de centrales de riesgo', state: 'reporteCentralesRiesgo' },
        { id: 'Rethus', label: 'Rethus', placeholder: 'Ingresa el rethus', state: 'rethus' },
        { id: 'Informe-Final-Estudio-Seguridad', label: 'Informe Final del Estudio de Seguridad', placeholder: 'Ingresa el informe final del estudio de seguridad', state: 'informeFinalEstudioSeguridad' },
        { id: 'Afiliacion-ARL', label: 'Afiliación ARL', placeholder: 'Ingresa la afiliación ARL', state: 'afiliacionARL' },
        { id: 'Afilicacion-Caja', label: 'Afiliación a la Caja', placeholder: 'Ingresa la afiliación a la caja', state: 'afilicacionCaja' },
        { id: 'Afiliacion-EPS', label: 'Afiliación EPS', placeholder: 'Ingresa la afiliación EPS', state: 'afiliacionEPS' },
        { id: 'Contrato-Firmado', label: 'Contrato Firmado', placeholder: 'Ingresa el contrato firmado', state: 'contratoFirmado' },
        { id: 'Perfil-Cargo-Firmado', label: 'Perfil de Cargo Firmado', placeholder: 'Ingresa el perfil de cargo firmado', state: 'perfilCargoFirmado' },
        { id: 'Prorroga', label: 'Prórroga', placeholder: 'Ingresa la prórroga', state: 'prorroga' },
        { id: 'Indefinido', label: 'Indefinido', placeholder: 'Ingresa si es indefinido', state: 'indefinido' },
        { id: 'Poliza-Vida', label: 'Póliza de Vida', placeholder: 'Ingresa la póliza de vida', state: 'polizaVida' },
        { id: 'Sustitucion-Patronal', label: 'Sustitución Patronal', placeholder: 'Ingresa la sustitución patronal', state: 'sustitucionPatronal' },
        { id: 'Clausula-Adicional', label: 'Cláusula Adicional', placeholder: 'Ingresa la cláusula adicional', state: 'clausulaAdicional' }
      ];
  return (
    <div>
      <div className= 'Modificar_Datos_Laboral'>
        <h1>MODIFICACIÓN DE DATOS DE INDOLE LABORAL</h1>
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

export default ModificarDatosLaboral