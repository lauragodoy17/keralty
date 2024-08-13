import './ModificarDatosPersonal.css';
import { InputCard } from '../../../Components/InputCard';
import InputComponent from '../../../Components/InputCedula';

import React from 'react'

function ModificarDatosPersonal() {
    const [values, setValues]= React.useState({    
        fotocopiaDocumento: '',
        hojaVida:'',
        certificadosLaborales:'',
        fotocopiaTarjetaProfesional:'',
        diplomaoActaBachiller:'',
        diplomaoActaProfesional:'',
        diplomaoActaEspecializacion: '', 
        certificadoEstudios: '',
        certificadoEPS:'',
        fechaCertificadoEPS:'',
        certificadoFondoPensiones:'',
        fechaCertificadoFondoPensiones:'',
        certificadoFondoCesantias:'',
        fechaCertificadoFondoCesantias:'', 
        certificadoCuentaBancaria:'',
        fechaCertificadoCuentaBancaria:'',
        tarjetaSecretariaSalud:'',
        resolucionSecreatariaSalud:'',
        carnetTodasVacunas:''      
      })
      const [error, setError] = React.useState('')
      const inputsOption = [
        { id: 'Fotocopia-Documento', label: 'Fotocopia Documento', placeholder: 'Ingresa la fotocopia del documento', state: 'fotocopiaDocumento' },
        { id: 'Hoja-Vida', label: 'Hoja de Vida', placeholder: 'Ingresa la hoja de vida', state: 'hojaVida' },
        { id: 'Certificados-Laborales', label: 'Certificados Laborales', placeholder: 'Ingresa los certificados laborales', state: 'certificadosLaborales' },
        { id: 'Fotocopia-Tarjeta-Profesional', label: 'Fotocopia Tarjeta Profesional', placeholder: 'Ingresa la fotocopia de la tarjeta profesional', state: 'fotocopiaTarjetaProfesional' },
        { id: 'Diploma-Acta-Bachiller', label: 'Diploma o Acta de Bachiller', placeholder: 'Ingresa el diploma o acta de bachiller', state: 'diplomaoActaBachiller' },
        { id: 'Diploma-Acta-Profesional', label: 'Diploma o Acta Profesional', placeholder: 'Ingresa el diploma o acta profesional', state: 'diplomaoActaProfesional' },
        { id: 'Diploma-Acta-Especializacion', label: 'Diploma o Acta de Especialización', placeholder: 'Ingresa el diploma o acta de especialización', state: 'diplomaoActaEspecializacion' },
        { id: 'Certificado-Estudios', label: 'Certificado de Estudios', placeholder: 'Ingresa el certificado de estudios', state: 'certificadoEstudios' },
        { id: 'Certificado-EPS', label: 'Certificado EPS', placeholder: 'Ingresa el certificado de EPS', state: 'certificadoEPS' },
        { id: 'Fecha-Certificado-EPS', label: 'Fecha Certificado EPS', placeholder: 'Fecha del certificado de EPS (AAAA-MM-DD)', state: 'fechaCertificadoEPS' },
        { id: 'Certificado-Fondo-Pensiones', label: 'Certificado Fondo de Pensiones', placeholder: 'Ingresa el certificado del fondo de pensiones', state: 'certificadoFondoPensiones' },
        { id: 'Fecha-Certificado-Fondo-Pensiones', label: 'Fecha Certificado Fondo de Pensiones', placeholder: 'Fecha del certificado del fondo de pensiones (AAAA-MM-DD)', state: 'fechaCertificadoFondoPensiones' },
        { id: 'Certificado-Fondo-Cesantias', label: 'Certificado Fondo de Cesantías', placeholder: 'Ingresa el certificado del fondo de cesantías', state: 'certificadoFondoCesantias' },
        { id: 'Fecha-Certificado-Fondo-Cesantias', label: 'Fecha Certificado Fondo de Cesantías', placeholder: 'Fecha del certificado del fondo de cesantías (AAAA-MM-DD)', state: 'fechaCertificadoFondoCesantias' },
        { id: 'Certificado-Cuenta-Bancaria', label: 'Certificado Cuenta Bancaria', placeholder: 'Ingresa el certificado de la cuenta bancaria', state: 'certificadoCuentaBancaria' },
        { id: 'Fecha-Certificado-Cuenta-Bancaria', label: 'Fecha Certificado Cuenta Bancaria', placeholder: 'Fecha del certificado de la cuenta bancaria (AAAA-MM-DD)', state: 'fechaCertificadoCuentaBancaria' },
        { id: 'Tarjeta-Secretaria-Salud', label: 'Tarjeta Secretaria de Salud', placeholder: 'Ingresa la tarjeta de la secretaria de salud', state: 'tarjetaSecretariaSalud' },
        { id: 'Resolucion-Secretaria-Salud', label: 'Resolución Secretaria de Salud', placeholder: 'Ingresa la resolución de la secretaria de salud', state: 'resolucionSecreatariaSalud' },
        { id: 'Carnet-Todas-Vacunas', label: 'Carnet de Todas las Vacunas', placeholder: 'Ingresa el carnet de todas las vacunas', state: 'carnetTodasVacunas' },
      ];
  return (
    <div>
      <div className= 'Modificar_Datos_Personal'>
        <h1>MODIFICACIÓN DE DATOS DE ÍNDOLE PERSONAL</h1>
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

export default ModificarDatosPersonal