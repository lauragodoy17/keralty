import React from 'react'
import { InputCard } from '../../../Components/InputCard';
import './BusquedaDatosPersonal.css'
import InputComponent from '../../../Components/InputCedula';


function BusquedaDatosPersonal() {
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
        { id: 'Fotocopia-Documento', label: 'Fotocopia Documento', placeholder: '', state: 'fotocopiaDocumento' },
        { id: 'Hoja-Vida', label: 'Hoja de Vida', placeholder: '', state: 'hojaVida' },
        { id: 'Certificados-Laborales', label: 'Certificados Laborales', placeholder: '', state: 'certificadosLaborales' },
        { id: 'Fotocopia-Tarjeta-Profesional', label: 'Fotocopia Tarjeta Profesional', placeholder: '', state: 'fotocopiaTarjetaProfesional' },
        { id: 'Diploma-Acta-Bachiller', label: 'Diploma o Acta de Bachiller', placeholder: '', state: 'diplomaoActaBachiller' },
        { id: 'Diploma-Acta-Profesional', label: 'Diploma o Acta Profesional', placeholder: '', state: 'diplomaoActaProfesional' },
        { id: 'Diploma-Acta-Especializacion', label: 'Diploma o Acta de Especialización', placeholder: '', state: 'diplomaoActaEspecializacion' },
        { id: 'Certificado-Estudios', label: 'Certificado de Estudios', placeholder: '', state: 'certificadoEstudios' },
        { id: 'Certificado-EPS', label: 'Certificado EPS', placeholder: '', state: 'certificadoEPS' },
        { id: 'Fecha-Certificado-EPS', label: 'Fecha Certificado EPS', placeholder: '', state: 'fechaCertificadoEPS' },
        { id: 'Certificado-Fondo-Pensiones', label: 'Certificado Fondo de Pensiones', placeholder: '', state: 'certificadoFondoPensiones' },
        { id: 'Fecha-Certificado-Fondo-Pensiones', label: 'Fecha Certificado Fondo de Pensiones', placeholder: '', state: 'fechaCertificadoFondoPensiones' },
        { id: 'Certificado-Fondo-Cesantias', label: 'Certificado Fondo de Cesantías', placeholder: '', state: 'certificadoFondoCesantias' },
        { id: 'Fecha-Certificado-Fondo-Cesantias', label: 'Fecha Certificado Fondo de Cesantías', placeholder: '', state: 'fechaCertificadoFondoCesantias' },
        { id: 'Certificado-Cuenta-Bancaria', label: 'Certificado Cuenta Bancaria', placeholder: '', state: 'certificadoCuentaBancaria' },
        { id: 'Fecha-Certificado-Cuenta-Bancaria', label: 'Fecha Certificado Cuenta Bancaria', placeholder: '', state: 'fechaCertificadoCuentaBancaria' },
        { id: 'Tarjeta-Secretaria-Salud', label: 'Tarjeta Secretaria de Salud', placeholder: '', state: 'tarjetaSecretariaSalud' },
        { id: 'Resolucion-Secretaria-Salud', label: 'Resolución Secretaria de Salud', placeholder: '', state: 'resolucionSecreatariaSalud' },
        { id: 'Carnet-Todas-Vacunas', label: 'Carnet de Todas las Vacunas', placeholder: '', state: 'carnetTodasVacunas' },
      ];
  return (
    <div>
      <div className= 'Busqueda_Datos_Personal_BD'>
        <h1>BUSQUEDA PARA DATOS DE INDOLE PERSONAL</h1>
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

export default BusquedaDatosPersonal