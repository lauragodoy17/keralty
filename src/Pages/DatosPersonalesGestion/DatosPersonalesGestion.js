import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Importa el componente DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Importa el CSS de DatePicker
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { format,parseISO } from 'date-fns';
import './DatosPersonalesGestion.css'
import api from '../../Utils/Api';

function DatosPersonalesGestion() {
  const initialValues = {
    auxiliares: '', // AUXILAR OPERATIVO
    analista: '', // ANALISTA
    fechaInicioProcesoAnalista: null, // FECHA DE INICIO PROCESO ANALISTA
    idRequisicion: '', // ID
    fechaAsignacionCH: null, // FECHA ASIGNACION POR CH
    tipoProceso: '', // TIPO PROCESO MANUAL O CH
    empresa: '', // EMPRESA
    nuevoReingreso: '', // NUEVO O REINGRESO
    ciudad: '', // CIUDAD
    fechaExpedicionCedula: null, // FECHA EXPEDICION
    cedula: '', // CEDULA
    nombreCandidato: '', // NOMBRES CANDIDATOS
    cargo: '', // CARGO
    correo: '', // CORREO
    celular: '', // CELULAR
    tipoPlanta: '', // TIPO DE PLANTA
    tiempoContrato: '', // TIEMPO DE CONTRATO (Si es temporal)
    fechaEnvioDocumentos: null, // ENVIO DE SOLICITUD DE DOCUMENTOS O PASO POR CH AL CANDIDATO
    recepcionDocumentosCandidato: null, // RECEPCION DE DOCUMENTOS POR PARTE DEL CANDIDATO
    fechaProgramacionExamen: null, // PROGAMACION EXAMEN (Dia asistencia)
    fechaConceptoExamen: null, // FECHA CONCEPTO EXAMEN
    fechaEnvioAYC: null, // FECHA ENVIO AYC
    fechaConceptoEstudioSeguridad: null, // FECHA CONCEPTO ESTUDIO DE SEGURIDAD
    fechaAsignacionAnalista: null, // FECHA ASIGNACION ANALISTA
    estado: '', // ESTADO
    novedadPendiente: '', // NOVEDAD PENDIENTE
    induccion: ''
  };
  
  
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const reload = () => {
    navigate(0); 
  };
  const options = {
    empresa: ["Empresa 1", "Empresa 2", "Empresa 3"],
    cargo: ["Cargo 1", "Cargo 2", "Cargo 3"],
    posicion: ["Posición 1", "Posición 2", "Posición 3"],
    tipoGasto: ["Gasto 1", "Gasto 2", "Gasto 3"],
    centroCosto: ["Centro 1", "Centro 2", "Centro 3"],
    tipoPlanta: ["Planta 1", "Planta 2", "Planta 3"],
    tipoIngreso: ["Ingreso 1", "Ingreso 2", "Ingreso 3"],
    analistaSeleccion: ["Analista 1", "Analista 2", "Analista 3"],
    estado: ["Activo", "Inactivo"], 

  };


  const handleChange = (e, field) => {
    const value = e.target.value; 
    setValues(prev => ({ ...prev, [field]: value }));
  };
  const handleDateChange = (date, field) => {
    setValues(prev => ({ ...prev, [field]: date }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (values.cedula) {
      if (isNaN(values.cedula)) {
        formErrors.cedula = 'El documento debe ser un número';
      } else if (values.cedula.toString().length < 6) {
        formErrors.cedula = 'La cédula debe tener al menos 6 dígitos';
      }
    }


    if (values.posicion && isNaN(values.posicion)) {
      formErrors.posicion = 'La posición debe ser un número';
    }
    setErrors(formErrors); 
    return formErrors;
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = parseISO(dateString);
    
    if (isNaN(date.getTime())) return '';

    return format(date, 'yyyy-MM-dd'); // format to match <TextField> date format
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Validamos el formulario antes de enviar
    const formErrors = validateForm();    
    
    // Si no hay errores, hacemos la petición POST
    if (Object.keys(formErrors).length === 0) {
      axios.post(`${api}/RegistrarGestion`, values)
        .then(res => {
          if (res.data.Status === "Success") {
            // Mostramos mensaje de éxito con SweetAlert
            swal({
              title: "Bien hecho!",
              text: "Tu registro fue guardado exitosamente",
              icon: "success",
              buttons: ["","Aceptar"]
            }).then(respuesta => {
              if (respuesta) {
                // Refrescamos la página después de aceptar
                window.location.reload();
              }
            });
          } else {
            // Mensaje de error en caso de problemas con el registro
            setMessage("Error en el registro.");
          }
        })
        .catch(err => {
          console.error("Error del servidor:", err);
          // Mensaje de error en caso de problemas con el servidor
          setMessage("Error en el servidor.");
        });
    }
  };
  

  return (
    <div>
      <div className="Registro_Datos_Gestion">
        <h1>REGISTRO DE DATOS PERSONALES Y ÚNICOS</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Campo auxiliarSeleccion con opciones específicas */}
        <div className="select-container">
  <label htmlFor="auxiliares">Auxiliares Operativos</label>
  <select
    name="auxiliares"
    id="auxiliares"
    value={values.auxiliares}
    onChange={(e) => handleChange(e, 'auxiliares')}
  >
    <option value="">- Selecciona uno -</option>
    <option value="ANA MARIA CESPEDES">ANA MARIA CESPEDES</option>
<option value="LAURA BELEÑO">LAURA BELEÑO</option>
<option value="JUAN ANDRES NOVA">JUAN ANDRES NOVA</option>
<option value="NINI JOHANA SILVA">NINI JOHANA SILVA</option>
<option value="ANDREA PEÑA">ANDREA PEÑA</option>
<option value="DAYANA PINEDA">DAYANA PINEDA</option>

  </select>
  {errors.auxiliares && <p className="error">{errors.auxiliares}</p>}
</div>

<div className="select-container">
          <label htmlFor="analista">Analista de selección</label>
          <select
            name="analista"
            id="analista"
            value={values.analista}
            onChange={(e) => handleChange(e, 'analista')}
          >
            <option value="">- Selecciona uno -</option>
            <option value="ANDREA CRUZ ARIAS">ANDREA CRUZ ARIAS</option>
<option value="BEATRIZ ELENA ARBOLEDA CORTEZ">BEATRIZ ELENA ARBOLEDA CORTEZ</option>
<option value="DIANA MARCELA OLARTE">DIANA MARCELA OLARTE</option>
<option value="JEIMMY ALEXANDRA ESPITIA SUAREZ">JEIMMY ALEXANDRA ESPITIA SUAREZ</option>
<option value="LEONARDO LEON ALARCON">LEONARDO LEON ALARCON</option>
<option value="LUISA FERNANDA RUEDA SALAZAR">LUISA FERNANDA RUEDA SALAZAR</option>
<option value="EDNA ROCIO VARGAS PENAGOS">EDNA ROCIO VARGAS PENAGOS</option>
<option value="PAOLA ANDREA MALDONADO GIRALDO">PAOLA ANDREA MALDONADO GIRALDO</option>
<option value="LUZ HELENA BERMUDEZ">LUZ HELENA BERMUDEZ</option>
<option value="JHON SEBASTIAN URREA GUTIERREZ">JHON SEBASTIAN URREA GUTIERREZ</option>
<option value="TIBISAY DAYANNA PEREZ LIZCANO">TIBISAY DAYANNA PEREZ LIZCANO</option>
<option value="JESSICA MORENO ALFONSO">JESSICA MORENO ALFONSO</option>
<option value="EDNA ROCIO VARGAS PENAGOS">EDNA ROCIO VARGAS PENAGOS</option>
<option value="ROSMERY MARTINEZ">ROSMERY MARTINEZ</option>
<option value="ANA MARIA SUESCA">ANA MARIA SUESCA</option>
<option value="NATHALIA PEÑA VANEGAS">NATHALIA PEÑA VANEGAS</option>
<option value="ANA LORENA LOPEZ">ANA LORENA LOPEZ</option>
<option value="ANA MARIA PERAZA">ANA MARIA PERAZA</option>
<option value="NATALY JIMENEZ">NATALY JIMENEZ</option>
<option value="JULIE PULIDO">JULIE PULIDO</option>
<option value="ERIKA BARBOSA">ERIKA BARBOSA</option>
<option value="DIANA PAOLA BARRAGAN">DIANA PAOLA BARRAGAN</option>
          </select>
          {errors.analista && <p className="error">{errors.analista}</p>}
        </div>


        <div className="select-container">
          <label htmlFor="fechaInicioProcesoAnalista">Fecha de Inicio de proceso Analista</label>
          <DatePicker
            selected={values.fechaInicioProcesoAnalista}
            onChange={(date) => handleDateChange(date, 'fechaInicioProcesoAnalista')}

            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona la fecha de inicio de proceso analista"
            className="date-picker-input"
          />
          {errors.fechaInicioProcesoAnalista && <p className="error">{errors.fechaInicioProcesoAnalista}</p>}
        </div>

        <div className="input-container">
          <label htmlFor="idRequisicion">ID</label>
          <input
            type="text"
            id="idRequisicion"
            name="idRequisicion"
            placeholder='idRequisicion'
            value={values.idRequisicion}
            onChange={(e) => handleChange(e, 'idRequisicion')}
          />
          {errors.idRequisicion && <p className="error">{errors.idRequisicion}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="fechaAsignacionCH">Fecha de Asignación por CH</label>
          <DatePicker
            selected={values.fechaAsignacionCH}
            onChange={(date) => handleDateChange(date, 'fechaAsignacionCH')}

            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona la fecha de Asignación por CH"
            className="date-picker-input"
          />
          {errors.fechaAsignacionCH && <p className="error">{errors.fechaAsignacionCH}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="tipoProceso">Tipo de proceso</label>
          <select
            name="tipoProceso"
            id="tipoProceso"
            value={values.tipoProceso}
            onChange={(e) => handleChange(e, 'tipoProceso')}
          >
            <option value="">- Selecciona uno -</option>
            <option value="MANUAL">MANUAL</option>
            <option value="CONEXION HUMANA">CONEXION HUMANA</option>

          </select>
          {errors.tipoProceso && <p className="error">{errors.tipoProceso}</p>}
        </div>

         <div className="select-container">
          <label htmlFor="empresa">Empresa</label>
          <select
            name="empresa"
            id="empresa"
            value={values.empresa}
            onChange={(e) => handleChange(e, 'empresa')}
          >
            <option value="">- Selecciona una empresa -</option>
            <option value="ASOCIACION DE USUARIOS DE SANITAS">ASOCIACION DE USUARIOS DE SANITAS</option>
<option value="CENTRO DE CIRUGIA MINIMA INVASIVA S.A.S">CENTRO DE CIRUGIA MINIMA INVASIVA S.A.S</option>
<option value="CENTROS MEDICOS COLSANITAS SAS">CENTROS MEDICOS COLSANITAS SAS</option>
<option value="CLINICA CAMPO ABIERTO ORGANIZACION SANITAS INTER.">CLINICA CAMPO ABIERTO ORGANIZACION SANITAS INTER.</option>
<option value="CLINICA COLSANITAS S.A.">CLINICA COLSANITAS S.A.</option>
<option value="CLINICA DENTAL KERALTY SAS">CLINICA DENTAL KERALTY SAS</option>
<option value="COMPAÑIA DE MEDICINA PREPAGADA COLSANITAS S.A.">COMPAÑIA DE MEDICINA PREPAGADA COLSANITAS S.A.</option>
<option value="COMPAÑIA DE SEGUROS COLSANITAS S.A.">COMPAÑIA DE SEGUROS COLSANITAS S.A.</option>
<option value="CORPORACION SOCIAL MEDICA SANITAS">CORPORACION SOCIAL MEDICA SANITAS</option>
<option value="EDITORIAL BIENESTAR S A S">EDITORIAL BIENESTAR S A S</option>
<option value="ENTIDAD PROMOTORA DE SALUD SANITAS S.A.S.">ENTIDAD PROMOTORA DE SALUD SANITAS S.A.S.</option>
<option value="FUNDACION KERALTY">FUNDACION KERALTY</option>
<option value="FUNDACION UNIVERSITARIA SANITAS">FUNDACION UNIVERSITARIA SANITAS</option>
<option value="KERALTY S.A.S">KERALTY S.A.S</option>
<option value="LAZOS HUMANOS SAS">LAZOS HUMANOS SAS</option>
<option value="MEDICINA NUCLEAR PALERMO ORGANIZACION SANITAS INTERNACIONAL">MEDICINA NUCLEAR PALERMO ORGANIZACION SANITAS INTERNACIONAL</option>
<option value="MEDISANITAS S.A.S. COMPAÑIA DE MEDICINA PREPAGADA">MEDISANITAS S.A.S. COMPAÑIA DE MEDICINA PREPAGADA</option>
<option value="OFTALMOSANITAS CALI SAS">OFTALMOSANITAS CALI SAS</option>
<option value="OFTALMOSANITAS SAS">OFTALMOSANITAS SAS</option>
<option value="OPTICA COLSANITAS SAS">OPTICA COLSANITAS SAS</option>
<option value="PROMOTORA INMOBILIARIA SANITAS LTDA.">PROMOTORA INMOBILIARIA SANITAS LTDA.</option>
<option value="SALUD OCUPACIONAL SANITAS SAS">SALUD OCUPACIONAL SANITAS SAS</option>
<option value="SOCIEDAD CLINICA IBEROAMERICA S.A.S">SOCIEDAD CLINICA IBEROAMERICA S.A.S</option>
<option value="UNIDAD DE CUIDADOS PALIATIVOS PRESENTES SAS">UNIDAD DE CUIDADOS PALIATIVOS PRESENTES SAS</option>
<option value="UNIDAD DE IMAGENES AVANZADAS SAS">UNIDAD DE IMAGENES AVANZADAS SAS</option>
<option value="VERSANIA PSICOSOCIAL ITA S.A.S.">VERSANIA PSICOSOCIAL ITA S.A.S.</option>
<option value="VERSANIA SENIOR S.A.S">VERSANIA SENIOR S.A.S</option>
<option value="VERSANIA PRIMERA INFANCIA SAS">VERSANIA PRIMERA INFANCIA SAS</option>
<option value="COMPAÑIA DE SEGUROS COLSANITAS S.A.">COMPAÑIA DE SEGUROS COLSANITAS S.A.</option>
          </select>
          {errors.empresa && <p className="error">{errors.empresa}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="nuevoReingreso">Nuevo o Reingreso</label>
          <select
            name="nuevoReingreso"
            id="nuevoReingreso"
            value={values.nuevoReingreso}
            onChange={(e) => handleChange(e, 'nuevoReingreso')}
          >
            <option value="">- Selecciona  -</option>
            <option value="NUEVO">NUEVO</option>
            <option value="REINGRESO">REINGRESO</option>

          </select>
          {errors.nuevoReingreso && <p className="error">{errors.nuevoReingreso}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="ciudad">Ciudad</label>
          <select
            name="ciudad"
            id="ciudad"
            value={values.ciudad}
            onChange={(e) => handleChange(e, 'ciudad')}
          >
            <option value="">- Selecciona la ciudad  -</option>
            <option value="ACACÍAS">ACACÍAS</option>
<option value="AGUACHICA">AGUACHICA</option>
<option value="AGUAZUL">AGUAZUL</option>
<option value="ALBANIA">ALBANIA</option>
<option value="ALTO BAUDÓ">ALTO BAUDÓ</option>
<option value="ARAUCA">ARAUCA</option>
<option value="ARAUQUITA">ARAUQUITA</option>
<option value="ARMENIA">ARMENIA</option>
<option value="BARRANCABERMEJA">BARRANCABERMEJA</option>
<option value="BARRANCAS">BARRANCAS</option>
<option value="BARRANQUILLA">BARRANQUILLA</option>
<option value="BOGOTÁ, D.C.">BOGOTÁ, D.C.</option>
<option value="BUCARAMANGA">BUCARAMANGA</option>
<option value="BUENAVENTURA">BUENAVENTURA</option>
<option value="CAJICÁ">CAJICÁ</option>
<option value="CALI">CALI</option>
<option value="CARTAGENA">CARTAGENA</option>
<option value="CARTAGO">CARTAGO</option>
<option value="CHÍA">CHÍA</option>
<option value="CHIQUINQUIRÁ">CHIQUINQUIRÁ</option>
<option value="CHITAGÁ">CHITAGÁ</option>
<option value="CÚCUTA">CÚCUTA</option>
<option value="DIBULLA">DIBULLA</option>
<option value="DUITAMA">DUITAMA</option>
<option value="FACATATIVÁ">FACATATIVÁ</option>
<option value="FLORENCIA">FLORENCIA</option>
<option value="FONSECA">FONSECA</option>
<option value="FORTUL">FORTUL</option>
<option value="FUSAGASUGÁ">FUSAGASUGÁ</option>
<option value="GARZÓN">GARZÓN</option>
<option value="GIRARDOT">GIRARDOT</option>
<option value="GUACA">GUACA</option>
<option value="GUADALUPE">GUADALUPE</option>
<option value="HONDA">HONDA</option>
<option value="IBAGUÉ">IBAGUÉ</option>
<option value="IPIALES">IPIALES</option>
<option value="ISNOS">ISNOS</option>
<option value="ISTMINA">ISTMINA</option>
<option value="LA CALERA">LA CALERA</option>
<option value="LA PLATA">LA PLATA</option>
<option value="LETICIA">LETICIA</option>
<option value="MAICAO">MAICAO</option>
<option value="MÁLAGA">MÁLAGA</option>
<option value="MANIZALES">MANIZALES</option>
<option value="MEDELLÍN">MEDELLÍN</option>
<option value="MONTELÍBANO">MONTELÍBANO</option>
<option value="MONTERÍA">MONTERÍA</option>
<option value="NEIVA">NEIVA</option>
<option value="OCAÑA">OCAÑA</option>
<option value="PALMIRA">PALMIRA</option>
<option value="PASTO">PASTO</option>
<option value="BOGOTÁ, D.C.">BOGOTÁ, D.C.</option>
<option value="PEREIRA">PEREIRA</option>
<option value="PIENDAMÓ">PIENDAMÓ</option>
<option value="PITALITO">PITALITO</option>
<option value="POPAYÁN">POPAYÁN</option>
<option value="QUIBDÓ">QUIBDÓ</option>
<option value="RIOHACHA">RIOHACHA</option>
<option value="RIONEGRO">RIONEGRO</option>
<option value="SAN ANDRÉS">SAN ANDRÉS</option>
<option value="SAN GIL">SAN GIL</option>
<option value="SAN JUAN DEL CESAR">SAN JUAN DEL CESAR</option>
<option value="SANTA MARTA">SANTA MARTA</option>
<option value="SANTANDER DE QUILICHAO">SANTANDER DE QUILICHAO</option>
<option value="SARDINATA">SARDINATA</option>
<option value="SINCELEJO">SINCELEJO</option>
<option value="SOACHA">SOACHA</option>
<option value="SOGAMOSO">SOGAMOSO</option>
<option value="SOLEDAD">SOLEDAD</option>
<option value="TAME">TAME</option>
<option value="TULUÁ">TULUÁ</option>
<option value="TUNJA">TUNJA</option>
<option value="URIBIA">URIBIA</option>
<option value="VALLEDUPAR">VALLEDUPAR</option>
<option value="VILLANUEVA">VILLANUEVA</option>
<option value="VILLAVICENCIO">VILLAVICENCIO</option>
<option value="VILLETA">VILLETA</option>
<option value="YOPAL">YOPAL</option>
<option value="ZIPAQUIRÁ">ZIPAQUIRÁ</option>
<option value="TAURAMENA">TAURAMENA</option>
<option value="CHAPARRAL">CHAPARRAL</option>
<option value="CAMPOALEGRE">CAMPOALEGRE</option>
<option value="MONTERREY">MONTERREY</option>
<option value="PAZ DE ARIPORO">PAZ DE ARIPORO</option>
<option value="USA">USA</option>
<option value="MONGUA">MONGUA</option>
<option value="GIGANTE">GIGANTE</option>
<option value="SORA - CUCAITA">SORA - CUCAITA</option>
<option value="TINJACA">TINJACA</option>
<option value="JUNIN">JUNIN</option>
<option value="NIMAIMA">NIMAIMA</option>

          </select>
          {errors.ciudad && <p className="error">{errors.ciudad}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="fechaExpedicionCedula">Fecha de Expedicion </label>
          <DatePicker
            selected={values.fechaExpedicionCedula}
            onChange={(date) => handleDateChange(date, 'fechaExpedicionCedula')}

            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona la Fecha de Expedicion "
            className="date-picker-input"
          />
          {errors.fechaExpedicionCedula && <p className="error">{errors.fechaExpedicionCedula}</p>}
        </div>

                {/* Campo de entrada para Documento */}
                 <div className="input-container">
          <label htmlFor="cedula">Cédula</label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            placeholder='Cédula'
            value={values.cedula}
            onChange={(e) => handleChange(e, 'cedula')}
          />
          {errors.cedula && <p className="error">{errors.cedula}</p>}
        </div>

        <div className="input-container">
          <label htmlFor="nombreCandidato">Nombre del Candidato</label>
          <input
            type="text"
            id="nombreCandidato"
            name="nombreCandidato"
            placeholder="Nombre del Candidato"
            value={values.nombreCandidato}
            onChange={(e) => handleChange(e, 'nombreCandidato')}
          />
          {errors.nombreCandidato && <p className="error">{errors.nombreCandidato}</p>}
        </div>

        
        <div className="select-container">
          <label htmlFor="cargo">Cargo</label>
          <select
            name="cargo"
            id="cargo"
            value={values.cargo}
            onChange={(e) => handleChange(e, 'cargo')}
          >
            <option value="">- Selecciona un cargo -</option>
            <option value="AUXILIAR ADMINISTRATIVO">AUXILIAR ADMINISTRATIVO</option>
<option value="DIRECTORA EJECUTIVA">DIRECTORA EJECUTIVA</option>
<option value="RECEPCIONISTA I">RECEPCIONISTA I</option>
<option value="FONOAUDIOLOGO">FONOAUDIOLOGO</option>
<option value="AUXILIAR DE FACTURACION">AUXILIAR DE FACTURACION</option>
<option value="BACTERIOLOGO II">BACTERIOLOGO II</option>
<option value="AUXILIAR DE SALAS DE CIRUGIA">AUXILIAR DE SALAS DE CIRUGIA</option>
<option value="ENFERMERA JEFE">ENFERMERA JEFE</option>
<option value="APRENDIZ">APRENDIZ</option>
<option value="COORDINADOR SALAS DE CIRUGIA">COORDINADOR SALAS DE CIRUGIA</option>
<option value="AUXILIAR DE ENFERMERIA">AUXILIAR DE ENFERMERIA</option>
<option value="TECNICO EN RADIOLOGIA">TECNICO EN RADIOLOGIA</option>
<option value="AUXILIAR DE ODONTOLOGIA">AUXILIAR DE ODONTOLOGIA</option>
<option value="MEDICO GENERAL">MEDICO GENERAL</option>
<option value="RECEPCIONISTA">RECEPCIONISTA</option>
<option value="REHABILITADOR ORAL">REHABILITADOR ORAL</option>
<option value="COORDINADOR ADMINISTRATIVO">COORDINADOR ADMINISTRATIVO</option>
<option value="ENDODONCISTA">ENDODONCISTA</option>
<option value="COORDINADOR DE MANTENIMIENTO">COORDINADOR DE MANTENIMIENTO</option>
<option value="INSTRUMENTADOR QUIRURGICO">INSTRUMENTADOR QUIRURGICO</option>
<option value="MENSAJERO">MENSAJERO</option>
<option value="ODONTOLOGO">ODONTOLOGO</option>
<option value="SECRETARIA">SECRETARIA</option>
<option value="COORDINADORA DE ATENCION AL USUARIO Y MERCADEO">COORDINADORA DE ATENCION AL USUARIO Y MERCADEO</option>
<option value="COORDINADOR DE CONSULTA EXTERNA">COORDINADOR DE CONSULTA EXTERNA</option>
<option value="QUIMICO FARMACEUTICO">QUIMICO FARMACEUTICO</option>
<option value="ASESOR COMERCIAL">ASESOR COMERCIAL</option>
<option value="COORDINADOR APOYO DIAGNOSTICO Y CONSULTA PRIORITARIA">COORDINADOR APOYO DIAGNOSTICO Y CONSULTA PRIORITARIA</option>
<option value="DIRECTOR OPERATIVO">DIRECTOR OPERATIVO</option>
<option value="AUXILIAR DE MANTENIMIENTO">AUXILIAR DE MANTENIMIENTO</option>
<option value="AUXILIAR CONTABLE">AUXILIAR CONTABLE</option>
<option value="CAJERO">CAJERO</option>
<option value="CAJERO II">CAJERO II</option>
<option value="ORTODONCISTA">ORTODONCISTA</option>
<option value="ENFERMERA ESPECIALISTA">ENFERMERA ESPECIALISTA</option>
<option value="GERENTE CECIMIN">GERENTE CECIMIN</option>
<option value="PROMOTORA DE VENTAS">PROMOTORA DE VENTAS</option>
<option value="CAJERO I">CAJERO I</option>
<option value="TECNICO DE SOPORTE TI">TECNICO DE SOPORTE TI</option>
<option value="AUXILIAR DE TESORERIA Y CARTERA">AUXILIAR DE TESORERIA Y CARTERA</option>
<option value="ODONTOPEDIATRA">ODONTOPEDIATRA</option>
<option value="AUXILIAR DE LABORATORIO">AUXILIAR DE LABORATORIO</option>
<option value="TERAPEUTA RESPIRATORIA">TERAPEUTA RESPIRATORIA</option>
<option value="AUXILIAR CONTABLE I">AUXILIAR CONTABLE I</option>
<option value="MEDICO QUIRURGICO">MEDICO QUIRURGICO</option>
<option value="FISIOTERAPEUTA">FISIOTERAPEUTA</option>
<option value="ANALISTA ADMINISTRATIVO">ANALISTA ADMINISTRATIVO</option>
<option value="HIGIENISTA ORAL">HIGIENISTA ORAL</option>
<option value="ANALISTA DE CONTABILIDAD">ANALISTA DE CONTABILIDAD</option>
<option value="GESTOR DE FACTURACION">GESTOR DE FACTURACION</option>
<option value="DIRECTOR ADMINISTRATIVO Y CONTABLE">DIRECTOR ADMINISTRATIVO Y CONTABLE</option>
<option value="COORDINADOR DE CALIDAD">COORDINADOR DE CALIDAD</option>
<option value="CIRUJANO ORAL MAXILOFACIAL">CIRUJANO ORAL MAXILOFACIAL</option>
<option value="CONTADOR">CONTADOR</option>
<option value="SECRETARIA TRANSCRIPTORA">SECRETARIA TRANSCRIPTORA</option>
<option value="AUXILIAR INTEGRAL DE ADMISIONES">AUXILIAR INTEGRAL DE ADMISIONES</option>
<option value="COORDINADOR OPERATIVO CENTRO MEDICO">COORDINADOR OPERATIVO CENTRO MEDICO</option>
<option value="NUTRICIONISTA">NUTRICIONISTA</option>
<option value="PSICOLOGO">PSICOLOGO</option>
<option value="TRABAJADOR SOCIAL">TRABAJADOR SOCIAL</option>
<option value="AUXILIAR OPERATIVO">AUXILIAR OPERATIVO</option>
<option value="ANALISTA ADMINISTRACION DE SALARIOS SENIOR">ANALISTA ADMINISTRACION DE SALARIOS SENIOR</option>
<option value="TECNOLOGO EN RADIOLOGIA CONVENCIONAL">TECNOLOGO EN RADIOLOGIA CONVENCIONAL</option>
<option value="SECRETARIA ADMINISTRATIVA">SECRETARIA ADMINISTRATIVA</option>
<option value="DIGITADOR">DIGITADOR</option>
<option value="COORDINADOR OPERATIVO">COORDINADOR OPERATIVO</option>
<option value="ANALISTA DE CALIDAD">ANALISTA DE CALIDAD</option>
<option value="MEDICO ESPECIALISTA PEDIATRA">MEDICO ESPECIALISTA PEDIATRA</option>
<option value="COORDINADOR TI">COORDINADOR TI</option>
<option value="AUXILIAR DE SEGUIMIENTO EN SALUD">AUXILIAR DE SEGUIMIENTO EN SALUD</option>
<option value="INFORMADOR DE USUARIOS">INFORMADOR DE USUARIOS</option>
<option value="TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD">TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD</option>
<option value="TECNOLOGO EN RADIOLOGIA ESTUDIOS ESPECIALES">TECNOLOGO EN RADIOLOGIA ESTUDIOS ESPECIALES</option>
<option value="AUXILIAR COMPENSACION PRESTADORES">AUXILIAR COMPENSACION PRESTADORES</option>
<option value="MEDICO ESPECIALISTA FAMILIAR">MEDICO ESPECIALISTA FAMILIAR</option>
<option value="TERAPEUTA OCUPACIONAL">TERAPEUTA OCUPACIONAL</option>
<option value="ANALISTA DE RECAUDO">ANALISTA DE RECAUDO</option>
<option value="GESTOR DE INFORMACION Y SERVICIO">GESTOR DE INFORMACION Y SERVICIO</option>
<option value="MEDICO GENERAL DE APOYO">MEDICO GENERAL DE APOYO</option>
<option value="DIRECTOR MEDICO">DIRECTOR MEDICO</option>
<option value="COORDINADOR OPERATIVO UAP">COORDINADOR OPERATIVO UAP</option>
<option value="MEDICO SUBESPECIALISTA ENDOCRINOLOGO">MEDICO SUBESPECIALISTA ENDOCRINOLOGO</option>
<option value="LIDER AREA POLISOMNOGRAFIA">LIDER AREA POLISOMNOGRAFIA</option>
<option value="MEDICO ESPECIALISTA OTORRINOLARINGOLOGO">MEDICO ESPECIALISTA OTORRINOLARINGOLOGO</option>
<option value="ANALISTA DE CAPACITACION Y DESARROLLO JUNIOR">ANALISTA DE CAPACITACION Y DESARROLLO JUNIOR</option>
<option value="TECNOLOGO EN POLISOMNOGRAFIA">TECNOLOGO EN POLISOMNOGRAFIA</option>
<option value="MEDICO ESPECIALISTA GINECOBSTETRA">MEDICO ESPECIALISTA GINECOBSTETRA</option>
<option value="ENFERMERA JEFE DE APOYO">ENFERMERA JEFE DE APOYO</option>
<option value="GESTOR DE EQUIPAMIENTO">GESTOR DE EQUIPAMIENTO</option>
<option value="DIGITADOR I">DIGITADOR I</option>
<option value="CONSULTOR DE MEJORA SENIOR">CONSULTOR DE MEJORA SENIOR</option>
<option value="MEDICO ESPECIALISTA PSIQUIATRA">MEDICO ESPECIALISTA PSIQUIATRA</option>
<option value="MEDICO ESPECIALISTA CIRUJANO">MEDICO ESPECIALISTA CIRUJANO</option>
<option value="GESTOR DE CONVENIOS Y TARIFAS">GESTOR DE CONVENIOS Y TARIFAS</option>
<option value="COORDINADOR MEDICO UAP I">COORDINADOR MEDICO UAP I</option>
<option value="ANALISTA DE COMUNICACIONES SENIOR">ANALISTA DE COMUNICACIONES SENIOR</option>
<option value="AUXILIAR DE TERAPIA RESPIRATORIA">AUXILIAR DE TERAPIA RESPIRATORIA</option>
<option value="REGENTE DE FARMACIA">REGENTE DE FARMACIA</option>
<option value="AUXILIAR INTEGRAL DE ADMISIONES I">AUXILIAR INTEGRAL DE ADMISIONES I</option>
<option value="AUXILIAR DE ENFERMERIA DE APOYO">AUXILIAR DE ENFERMERIA DE APOYO</option>
<option value="ANALISTA ADMINISTRATIVO JUNIOR">ANALISTA ADMINISTRATIVO JUNIOR</option>
<option value="MEDICO ESPECIALISTA INTERNISTA">MEDICO ESPECIALISTA INTERNISTA</option>
<option value="MEDICO ESPECIALISTA NEUROLOGO">MEDICO ESPECIALISTA NEUROLOGO</option>
<option value="MEDICO ESPECIALISTA DERMATOLOGO">MEDICO ESPECIALISTA DERMATOLOGO</option>
<option value="MEDICO ESPECIALISTA FISIATRA">MEDICO ESPECIALISTA FISIATRA</option>
<option value="AUXILIAR DE FACTURACION I">AUXILIAR DE FACTURACION I</option>
<option value="MEDICO ESPECIALISTA PEDIATRA DE APOYO">MEDICO ESPECIALISTA PEDIATRA DE APOYO</option>
<option value="MEDICO ESPECIALISTA MEDICINA FAMILIAR">MEDICO ESPECIALISTA MEDICINA FAMILIAR</option>
<option value="RADIOPERADORA">RADIOPERADORA</option>
<option value="DIRECTOR DE COMPRAS EQUIPOS MEDICOS Y DE APOYO">DIRECTOR DE COMPRAS EQUIPOS MEDICOS Y DE APOYO</option>
<option value="DIRECTOR DE COMPRAS SERVICIOS Y SEGUROS">DIRECTOR DE COMPRAS SERVICIOS Y SEGUROS</option>
<option value="COORDINADOR MEDICO UAP">COORDINADOR MEDICO UAP</option>
<option value="GERENTE DE URGENCIAS">GERENTE DE URGENCIAS</option>
<option value="ANALISTA DE RIESGOS">ANALISTA DE RIESGOS</option>
<option value="DIRECTOR DE PROYECTOS SISTEMAS DE INFORMACION">DIRECTOR DE PROYECTOS SISTEMAS DE INFORMACION</option>
<option value="ENFERMERA JEFE DE CUIDADOS PALIATIVOS">ENFERMERA JEFE DE CUIDADOS PALIATIVOS</option>
<option value="MEDICO ESPECIALISTA FAMILIAR VIH">MEDICO ESPECIALISTA FAMILIAR VIH</option>
<option value="BUSINESS PARTNER">BUSINESS PARTNER</option>
<option value="AUXILIAR OPERATIVO II">AUXILIAR OPERATIVO II</option>
<option value="ANALISTA GESTION DE PROYECTOS">ANALISTA GESTION DE PROYECTOS</option>
<option value="MEDICO GENERAL GRADO 3">MEDICO GENERAL GRADO 3</option>
<option value="MEDICO EXPERTO PROGRAMA VIH">MEDICO EXPERTO PROGRAMA VIH</option>
<option value="LIDER DE SOPORTE APLICACIONES TI">LIDER DE SOPORTE APLICACIONES TI</option>
<option value="ANALISTA DE CUENTAS POR PAGAR">ANALISTA DE CUENTAS POR PAGAR</option>
<option value="COORDINADOR DE ENFERMERIA">COORDINADOR DE ENFERMERIA</option>
<option value="AUXILIAR SOPORTE VACUNACION">AUXILIAR SOPORTE VACUNACION</option>
<option value="TRABAJADOR SOCIAL DE CUIDADOS PALIATIVOS">TRABAJADOR SOCIAL DE CUIDADOS PALIATIVOS</option>
<option value="MEDICO SUBESPECIALISTA ENDOCRINOLOGO PEDIATRICO">MEDICO SUBESPECIALISTA ENDOCRINOLOGO PEDIATRICO</option>
<option value="MEDICO SUBESPECIALISTA REUMATOLOGO">MEDICO SUBESPECIALISTA REUMATOLOGO</option>
<option value="COORDINADOR DE ENTES DE CONTROL">COORDINADOR DE ENTES DE CONTROL</option>
<option value="ANALISTA DE PLANEACION Y CONTROL">ANALISTA DE PLANEACION Y CONTROL</option>
<option value="MEDICO ESPECIALISTA ORTOPEDISTA">MEDICO ESPECIALISTA ORTOPEDISTA</option>
<option value="REACCION">REACCION</option>
<option value="DIRECTOR CLINICO">DIRECTOR CLINICO</option>
<option value="COORDINADOR NACIONAL DE ENFERMERIA NUTRICION Y TERAPIAS">COORDINADOR NACIONAL DE ENFERMERIA NUTRICION Y TERAPIAS</option>
<option value="COORDINADOR ADMINISTRATIVO REGIONALES">COORDINADOR ADMINISTRATIVO REGIONALES</option>
<option value="COORDINADOR MEDICO">COORDINADOR MEDICO</option>
<option value="ABOGADO PROCESAL III">ABOGADO PROCESAL III</option>
<option value="DIRECTOR DE PLANEACION Y CONTROL">DIRECTOR DE PLANEACION Y CONTROL</option>
<option value="AUXILIAR OPERATIVO I">AUXILIAR OPERATIVO I</option>
<option value="DIRECTOR MEDICO DE PROGRAMAS">DIRECTOR MEDICO DE PROGRAMAS</option>
<option value="ANALISTA DE SELECCION">ANALISTA DE SELECCION</option>
<option value="COORDINADOR MEDICO REGIONAL ATENCION SECUNDARIA">COORDINADOR MEDICO REGIONAL ATENCION SECUNDARIA</option>
<option value="COORDINADOR ADMINISTRATIVO REGIONAL BOGOTA">COORDINADOR ADMINISTRATIVO REGIONAL BOGOTA</option>
<option value="RECLUTADOR">RECLUTADOR</option>
<option value="ANALISTA ADMINISTRACION DE SALARIOS JUNIOR">ANALISTA ADMINISTRACION DE SALARIOS JUNIOR</option>
<option value="COORDINADOR DE SEGURIDAD">COORDINADOR DE SEGURIDAD</option>
<option value="MEDICO GENERAL DOMICILIARIO">MEDICO GENERAL DOMICILIARIO</option>
<option value="INFORMADOR DE ATENCION AL USUARIO">INFORMADOR DE ATENCION AL USUARIO</option>
<option value="MEDICO GENERAL DE CUIDADOS PALIATIVOS">MEDICO GENERAL DE CUIDADOS PALIATIVOS</option>
<option value="COORDINADOR ADMINISTRATIVO Y DE RECAUDO">COORDINADOR ADMINISTRATIVO Y DE RECAUDO</option>
<option value="PSICOLOGO DE CUIDADOS PALIATIVOS">PSICOLOGO DE CUIDADOS PALIATIVOS</option>
<option value="AUXILIAR OPERATIVO DE CONTRATACION">AUXILIAR OPERATIVO DE CONTRATACION</option>
<option value="AUXILIAR INTEGRAL DE ADMISIONES DE CUIDADOS PALIATIVOS">AUXILIAR INTEGRAL DE ADMISIONES DE CUIDADOS PALIATIVOS</option>
<option value="JEFE DE UROLOGIA">JEFE DE UROLOGIA</option>
<option value="PROFESIONAL DE ATENCION AL USUARIO">PROFESIONAL DE ATENCION AL USUARIO</option>
<option value="AUXILIAR LOGISTICO DE MEDICAMENTOS">AUXILIAR LOGISTICO DE MEDICAMENTOS</option>
<option value="DIRECTOR DE CONVENIOS Y TARIFAS CM">DIRECTOR DE CONVENIOS Y TARIFAS CM</option>
<option value="MEDICO ESPECIALISTA UROLOGO">MEDICO ESPECIALISTA UROLOGO</option>
<option value="MEDICO SUBESPECIALISTA NEUROPEDIATRA">MEDICO SUBESPECIALISTA NEUROPEDIATRA</option>
<option value="AUXILIAR OPERATIVO DE SELECCION">AUXILIAR OPERATIVO DE SELECCION</option>
<option value="ADMINISTRADOR REGENTE DE DROGUERIA">ADMINISTRADOR REGENTE DE DROGUERIA</option>
<option value="SUPERVISOR DE MANTENIMIENTO">SUPERVISOR DE MANTENIMIENTO</option>
<option value="COORDINADOR OPERATIVO SERVICIO DE URGENCIAS">COORDINADOR OPERATIVO SERVICIO DE URGENCIAS</option>
<option value="ENFERMERA ESPECIALISTA DE APOYO">ENFERMERA ESPECIALISTA DE APOYO</option>
<option value="DIRECTOR DE GESTION FINANCIERA">DIRECTOR DE GESTION FINANCIERA</option>
<option value="ANALISTA FUNCIONAL JUNIOR I">ANALISTA FUNCIONAL JUNIOR I</option>
<option value="COORDINADOR INTEGRAL I">COORDINADOR INTEGRAL I</option>
<option value="ESPECIALISTA I">ESPECIALISTA I</option>
<option value="ADMINISTRADOR DEL SISTEMA">ADMINISTRADOR DEL SISTEMA</option>
<option value="ENFERMERA GESTION DE CASOS">ENFERMERA GESTION DE CASOS</option>
<option value="MEDICO ESPECIALISTA EN MEDICINA ALTERNATIVA">MEDICO ESPECIALISTA EN MEDICINA ALTERNATIVA</option>
<option value="GESTOR DE SERVICIO">GESTOR DE SERVICIO</option>
<option value="COORDINADOR DE ENFERMERIA URGENCIAS">COORDINADOR DE ENFERMERIA URGENCIAS</option>
<option value="GERENTE DE SALUD">GERENTE DE SALUD</option>
<option value="PROFESIONAL DE GESTION EN SALUD">PROFESIONAL DE GESTION EN SALUD</option>
<option value="AUXILIAR DE PARQUEADERO">AUXILIAR DE PARQUEADERO</option>
<option value="MEDICO SUBESPECIALISTA PSIQUIATRA INFANTIL">MEDICO SUBESPECIALISTA PSIQUIATRA INFANTIL</option>
<option value="MEDICO SUBESPECIALISTA EN NEUROPEDIATRIA">MEDICO SUBESPECIALISTA EN NEUROPEDIATRIA</option>
<option value="DIRECTOR ADMINISTRATIVO">DIRECTOR ADMINISTRATIVO</option>
<option value="AUXILIAR OPERATIVO DE CONTRATACION I">AUXILIAR OPERATIVO DE CONTRATACION I</option>
<option value="MEDICO ESPECIALISTA DEL DOLOR">MEDICO ESPECIALISTA DEL DOLOR</option>
<option value="MEDICO ESPECIALISTA EMERGENCIOLOGO">MEDICO ESPECIALISTA EMERGENCIOLOGO</option>
<option value="ANALISTA OPERATIVO">ANALISTA OPERATIVO</option>
<option value="DIRECTOR DE PROCESOS">DIRECTOR DE PROCESOS</option>
<option value="LIDER NACIONAL DIRECCION MEDICA">LIDER NACIONAL DIRECCION MEDICA</option>
<option value="ANALISTA DE INFRAESTRUCTURA">ANALISTA DE INFRAESTRUCTURA</option>
<option value="DIRECTOR DE PROGRAMAS">DIRECTOR DE PROGRAMAS</option>
<option value="DIRECTOR DE CONTABILIDAD">DIRECTOR DE CONTABILIDAD</option>
<option value="AUXILIAR DE SEGURIDAD">AUXILIAR DE SEGURIDAD</option>
<option value="GERENTE FINANCIERO DE CENTROS MEDICOS">GERENTE FINANCIERO DE CENTROS MEDICOS</option>
<option value="PRESIDENTE CENTROS MEDICOS">PRESIDENTE CENTROS MEDICOS</option>
<option value="AUXILIAR DE FACTURACION II">AUXILIAR DE FACTURACION II</option>
<option value="SUBGERENTE GESTION BIOMEDICA">SUBGERENTE GESTION BIOMEDICA</option>
<option value="COORDINADOR DE PROGRAMAS CENTROS MEDICOS">COORDINADOR DE PROGRAMAS CENTROS MEDICOS</option>
<option value="MEDICO ESPECIALISTA OFTALMOLOGIA">MEDICO ESPECIALISTA OFTALMOLOGIA</option>
<option value="AUXILIAR DE APOYO DIAGNOSTICO">AUXILIAR DE APOYO DIAGNOSTICO</option>
<option value="DIRECTOR ADMINISTRATIVO NACIONAL">DIRECTOR ADMINISTRATIVO NACIONAL</option>
<option value="GESTOR OPERATIVO ADMINISTRACION PLANTA PERSONAL">GESTOR OPERATIVO ADMINISTRACION PLANTA PERSONAL</option>
<option value="INGENIERO DE GESTION CLINICA">INGENIERO DE GESTION CLINICA</option>
<option value="ASESOR CENTRAL DE LLAMADAS">ASESOR CENTRAL DE LLAMADAS</option>
<option value="DIRECTOR OPERATIVO DE SALARIOS">DIRECTOR OPERATIVO DE SALARIOS</option>
<option value="ABOGADO LABORAL III">ABOGADO LABORAL III</option>
<option value="APRENDIZ PRACTICANTE">APRENDIZ PRACTICANTE</option>
<option value="JEFE DE DERMATOLOGIA">JEFE DE DERMATOLOGIA</option>
<option value="AUXILIAR INTEGRAL ATENCION PRIMARIA">AUXILIAR INTEGRAL ATENCION PRIMARIA</option>
<option value="COORDINADOR DE SEGURIDAD DEL PACIENTE Y SALUD PUBLICA">COORDINADOR DE SEGURIDAD DEL PACIENTE Y SALUD PUBLICA</option>
<option value="AUXILIAR DE CONTABILIDAD">AUXILIAR DE CONTABILIDAD</option>
<option value="ESPECIALISTA BIOMEDICO III">ESPECIALISTA BIOMEDICO III</option>
<option value="MEDICO ESPECIALISTA GERIATRA">MEDICO ESPECIALISTA GERIATRA</option>
<option value="COORDINADOR DE OPERACIONES">COORDINADOR DE OPERACIONES</option>
<option value="ESPECIALISTA II">ESPECIALISTA II</option>
<option value="ANALISTA SOPORTE IMAGENOLOGIA">ANALISTA SOPORTE IMAGENOLOGIA</option>
<option value="AUXILIAR DE CANAL VIRTUAL">AUXILIAR DE CANAL VIRTUAL</option>
<option value="ANALISTA DISE O ORGANIZACIONAL">ANALISTA DISE O ORGANIZACIONAL</option>
<option value="DIRECTOR DE GESTION DE DATOS">DIRECTOR DE GESTION DE DATOS</option>
<option value="VICEPRESIDENTE EJECUTIVO DE PRESTACION CENTROS MEDICOS">VICEPRESIDENTE EJECUTIVO DE PRESTACION CENTROS MEDICOS</option>
<option value="MEDICO SUBESPECIALISTA NEUMOLOGO">MEDICO SUBESPECIALISTA NEUMOLOGO</option>
<option value="JEFE DE MEDICINA INTERNA">JEFE DE MEDICINA INTERNA</option>
<option value="AUXILIAR DE CUENTAS POR PAGAR">AUXILIAR DE CUENTAS POR PAGAR</option>
<option value="JEFE DE GINECOLOGIA">JEFE DE GINECOLOGIA</option>
<option value="AUXILIAR DE SERVICIOS DE APOYO">AUXILIAR DE SERVICIOS DE APOYO</option>
<option value="TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD DE APOYO">TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD DE APOYO</option>
<option value="SUBGERENTE DE CALIDAD">SUBGERENTE DE CALIDAD</option>
<option value="DIRECTOR DE SELECCION">DIRECTOR DE SELECCION</option>
<option value="COORDINADOR DE CUENTAS DE ALTO COSTO">COORDINADOR DE CUENTAS DE ALTO COSTO</option>
<option value="JEFE DE ORTOPEDIA">JEFE DE ORTOPEDIA</option>
<option value="LIDER SICOF">LIDER SICOF</option>
<option value="COORDINADOR DE INFRAESTRUCTURA">COORDINADOR DE INFRAESTRUCTURA</option>
<option value="INTERPRETE LENGUAJE DE SE AS">INTERPRETE LENGUAJE DE SE AS</option>
<option value="DIRECTOR SERVICIOS NO PRESENCIALES">DIRECTOR SERVICIOS NO PRESENCIALES</option>
<option value="LIDER DE COMPRAS">LIDER DE COMPRAS</option>
<option value="COORDINADOR MEDICO URGENCIAS">COORDINADOR MEDICO URGENCIAS</option>
<option value="AUXILIAR INTEGRAL ADMINISTRATIVO">AUXILIAR INTEGRAL ADMINISTRATIVO</option>
<option value="JEFE DE OBSTETRICIA">JEFE DE OBSTETRICIA</option>
<option value="JEFE DE RIAS">JEFE DE RIAS</option>
<option value="COMPRADOR">COMPRADOR</option>
<option value="DIRECTOR DE INVESTIGACION, DESARROLLO E INNOVACION">DIRECTOR DE INVESTIGACION, DESARROLLO E INNOVACION</option>
<option value="DIRECTOR MEDICO NACIONAL DE ATENCION COMPLEMENTARIA">DIRECTOR MEDICO NACIONAL DE ATENCION COMPLEMENTARIA</option>
<option value="COORDINADOR NACIONAL GESTION DE INFORMACION">COORDINADOR NACIONAL GESTION DE INFORMACION</option>
<option value="AUXILIAR DE SERVICIOS ASISTENCIALES">AUXILIAR DE SERVICIOS ASISTENCIALES</option>
<option value="GERENTE DE OPERACIONES CENTROS MEDICOS">GERENTE DE OPERACIONES CENTROS MEDICOS</option>
<option value="ESPECIALISTA III">ESPECIALISTA III</option>
<option value="AUXILIAR DE METROLOGIA">AUXILIAR DE METROLOGIA</option>
<option value="MEDICO GENETISTA">MEDICO GENETISTA</option>
<option value="MEDICO SUBESPECIALISTA INFECTOLOGO">MEDICO SUBESPECIALISTA INFECTOLOGO</option>
<option value="MEDICO SUBESPECIALISTA GASTROENTEROLOGO PEDIATRA">MEDICO SUBESPECIALISTA GASTROENTEROLOGO PEDIATRA</option>
<option value="COORDINADOR NACIONAL DE DEMANDA INDUCIDA">COORDINADOR NACIONAL DE DEMANDA INDUCIDA</option>
<option value="COORDINADOR">COORDINADOR</option>
<option value="DIRECTOR MEDICO DE PRESTACION PREMIUM">DIRECTOR MEDICO DE PRESTACION PREMIUM</option>
<option value="DIRECTOR DE GESTION Y PROYECTOS">DIRECTOR DE GESTION Y PROYECTOS</option>
<option value="SUBGERENTE BUSINESS PARTNER">SUBGERENTE BUSINESS PARTNER</option>
<option value="AUDITOR DE SISTEMAS">AUDITOR DE SISTEMAS</option>
<option value="COORDINADOR MEDICO REGIONAL DE ATENCION PRIMARIA">COORDINADOR MEDICO REGIONAL DE ATENCION PRIMARIA</option>
<option value="ANALISTA DE COMUNICACIONES JUNIOR">ANALISTA DE COMUNICACIONES JUNIOR</option>
<option value="GERENTE DE PRESTACION ASEGURAMIENTO BASICO">GERENTE DE PRESTACION ASEGURAMIENTO BASICO</option>
<option value="DIRECTOR DE CALIDAD CENTROS MEDICOS">DIRECTOR DE CALIDAD CENTROS MEDICOS</option>
<option value="MEDICO ESPECIALISTA EN CUIDADOS PALIATIVOS">MEDICO ESPECIALISTA EN CUIDADOS PALIATIVOS</option>
<option value="JEFE DE PSIQUIATRIA">JEFE DE PSIQUIATRIA</option>
<option value="COORDINADOR DE VACUNACION">COORDINADOR DE VACUNACION</option>
<option value="MEDICO SUBESPECIALISTA CARDIOLOGO">MEDICO SUBESPECIALISTA CARDIOLOGO</option>
<option value="MEDICO ESPECIALISTA EN GASTROENTEROLOGIA">MEDICO ESPECIALISTA EN GASTROENTEROLOGIA</option>
<option value="ESPECIALISTA DISE O ORGANIZACIONAL">ESPECIALISTA DISE O ORGANIZACIONAL</option>
<option value="DIRECTOR PROGRAMAS ESPECIALES">DIRECTOR PROGRAMAS ESPECIALES</option>
<option value="DIRECTOR PROGRAMA DE SEGURIDAD DEL PACIENTE">DIRECTOR PROGRAMA DE SEGURIDAD DEL PACIENTE</option>
<option value="ADMINISTRADOR BASE DE DATOS">ADMINISTRADOR BASE DE DATOS</option>
<option value="ANALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO">ANALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO</option>
<option value="JEFE NACIONAL DE ENFERMERIA NUTRICION Y TERAPIAS">JEFE NACIONAL DE ENFERMERIA NUTRICION Y TERAPIAS</option>
<option value="PROFESIONAL DE SEGURIDAD DE LA INFORMACION">PROFESIONAL DE SEGURIDAD DE LA INFORMACION</option>
<option value="COORDINADOR COMERCIAL CONVENIOS">COORDINADOR COMERCIAL CONVENIOS</option>
<option value="SUBGERENTE DE SERVICIO CENTROS MEDICOS">SUBGERENTE DE SERVICIO CENTROS MEDICOS</option>
<option value="AUXILIAR INTEGRAL DE ADMISIONES DE APOYO">AUXILIAR INTEGRAL DE ADMISIONES DE APOYO</option>
<option value="EPIDEMIOLOGO">EPIDEMIOLOGO</option>
<option value="MEDICO SUBESPECIALISTA HEMATOLOGO">MEDICO SUBESPECIALISTA HEMATOLOGO</option>
<option value="GERENTE ADMINISTRATIVO Y FINANCIERO">GERENTE ADMINISTRATIVO Y FINANCIERO</option>
<option value="ANALISTA GESTION DE PROYECTOS I">ANALISTA GESTION DE PROYECTOS I</option>
<option value="MEDICO EMPRESA">MEDICO EMPRESA</option>
<option value="JEFE DE PEDIATRIA">JEFE DE PEDIATRIA</option>
<option value="COORDINADOR BIOMEDICO">COORDINADOR BIOMEDICO</option>
<option value="GERENTE DE PRESTACION">GERENTE DE PRESTACION</option>
<option value="AUXILIAR DE ENFERMERIA DE CUIDADOS PALIATIVOS">AUXILIAR DE ENFERMERIA DE CUIDADOS PALIATIVOS</option>
<option value="ENFERMERA JEFE EXTRAMURAL">ENFERMERA JEFE EXTRAMURAL</option>
<option value="AUXILIAR DE SERVICIO DESARROLLO HUMANO">AUXILIAR DE SERVICIO DESARROLLO HUMANO</option>
<option value="DIRECTOR REQUERIMIENTOS DE ENTES DE CONTROL">DIRECTOR REQUERIMIENTOS DE ENTES DE CONTROL</option>
<option value="CONSULTOR FUNCIONAL SENIOR">CONSULTOR FUNCIONAL SENIOR</option>
<option value="CONSEJERO ESPIRITUAL">CONSEJERO ESPIRITUAL</option>
<option value="AUXILIAR DE ADMISIONES">AUXILIAR DE ADMISIONES</option>
<option value="MEDICO ESPECIALISTA FAMILIAR HEMOFILIA">MEDICO ESPECIALISTA FAMILIAR HEMOFILIA</option>
<option value="MEDICO ESPECIALISTA DEPORTOLOGO">MEDICO ESPECIALISTA DEPORTOLOGO</option>
<option value="COORDINADOR DE URGENCIAS">COORDINADOR DE URGENCIAS</option>
<option value="BUSINESS PARTNER SENIOR">BUSINESS PARTNER SENIOR</option>
<option value="DIRECTOR NACIONAL DE ENFERMERIA">DIRECTOR NACIONAL DE ENFERMERIA</option>
<option value="DIRECTOR DE FORMACION CONTINUA">DIRECTOR DE FORMACION CONTINUA</option>
<option value="JEFE DE DEPARTAMENTO DE MANTENIMIENTO">JEFE DE DEPARTAMENTO DE MANTENIMIENTO</option>
<option value="AUDITOR INTERNO">AUDITOR INTERNO</option>
<option value="LIDER DE PRESUPUESTO Y PLANEACION">LIDER DE PRESUPUESTO Y PLANEACION</option>
<option value="GERENTE DE PRESTACION MP">GERENTE DE PRESTACION MP</option>
<option value="INGENIERO DE MEJORAMIENTO">INGENIERO DE MEJORAMIENTO</option>
<option value="DIRECTOR MEDICO CIENTIFICO">DIRECTOR MEDICO CIENTIFICO</option>
<option value="AUXILIAR DE SERVICIOS VARIOS">AUXILIAR DE SERVICIOS VARIOS</option>
<option value="INFORMADOR LABORATORIO">INFORMADOR LABORATORIO</option>
<option value="CAMILLERO">CAMILLERO</option>
<option value="ASESOR DE TRATAMIENTOS DENTALES">ASESOR DE TRATAMIENTOS DENTALES</option>
<option value="ASESOR DE SERVICIO">ASESOR DE SERVICIO</option>
<option value="AUXILIAR DE LABORATORIO DE APOYO">AUXILIAR DE LABORATORIO DE APOYO</option>
<option value="MEDICO ESPECIALISTA ANESTESIOLOGO">MEDICO ESPECIALISTA ANESTESIOLOGO</option>
<option value="TERAPEUTA DE LENGUAJE">TERAPEUTA DE LENGUAJE</option>
<option value="COORDINADOR DE ENFERMERIA SOPORTE NUTRICIONAL">COORDINADOR DE ENFERMERIA SOPORTE NUTRICIONAL</option>
<option value="GESTOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO">GESTOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO</option>
<option value="AUXILIAR LACTARIO">AUXILIAR LACTARIO</option>
<option value="CITOHISTOTECNOLOGO">CITOHISTOTECNOLOGO</option>
<option value="ASESOR DE SERVICIO SUPERNUMERARIO">ASESOR DE SERVICIO SUPERNUMERARIO</option>
<option value="MEDICO ESPECIALISTA INTENSIVISTA">MEDICO ESPECIALISTA INTENSIVISTA</option>
<option value="JEFE DE MANTENIMIENTO">JEFE DE MANTENIMIENTO</option>
<option value="ESPECIALISTA DE COMPENSACION">ESPECIALISTA DE COMPENSACION</option>
<option value="BACTERIOLOGO II DE APOYO">BACTERIOLOGO II DE APOYO</option>
<option value="ANALISTA DE CONTABILIDAD I">ANALISTA DE CONTABILIDAD I</option>
<option value="ASISTENTE ADMINISTRATIVO">ASISTENTE ADMINISTRATIVO</option>
<option value="MEDICO GENERAL HOSPITALARIO">MEDICO GENERAL HOSPITALARIO</option>
<option value="ENFERMERA ESPECIALISTA ONCOLOGIA">ENFERMERA ESPECIALISTA ONCOLOGIA</option>
<option value="TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD I">TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD I</option>
<option value="PATOLOGO">PATOLOGO</option>
<option value="TECNOLOGO EN MEDICINA NUCLEAR">TECNOLOGO EN MEDICINA NUCLEAR</option>
<option value="AUXILIAR DE SERVICIOS ASISTENCIALES I">AUXILIAR DE SERVICIOS ASISTENCIALES I</option>
<option value="MEDICO PEDIATRA NEONATOS CUC">MEDICO PEDIATRA NEONATOS CUC</option>
<option value="GESTOR DE TRABAJO SOCIAL DEL PROGRAMA CONTIGO">GESTOR DE TRABAJO SOCIAL DEL PROGRAMA CONTIGO</option>
<option value="AUXILIAR DE TERAPIA">AUXILIAR DE TERAPIA</option>
<option value="BACTERIOLOGA ADMINISTRATIVA Y CALIDAD">BACTERIOLOGA ADMINISTRATIVA Y CALIDAD</option>
<option value="GESTOR OPERATIVO DE RECAUDO">GESTOR OPERATIVO DE RECAUDO</option>
<option value="AYUDANTE DE LAVADO">AYUDANTE DE LAVADO</option>
<option value="ADMINISTRADOR DE PARQUEADERO">ADMINISTRADOR DE PARQUEADERO</option>
<option value="COORDINADOR OPERATIVO DE ADMISIONES">COORDINADOR OPERATIVO DE ADMISIONES</option>
<option value="AUXILIAR DE ENFERMERIA APH">AUXILIAR DE ENFERMERIA APH</option>
<option value="AUXILIAR DE ENFERMERIA DE EPIDEMIOLOGIA">AUXILIAR DE ENFERMERIA DE EPIDEMIOLOGIA</option>
<option value="ENFERMERO CODIFICADOR">ENFERMERO CODIFICADOR</option>
<option value="MEDICO PEDIATRA URGENCIAS">MEDICO PEDIATRA URGENCIAS</option>
<option value="MEDICO PEDIATRA URG CUC">MEDICO PEDIATRA URG CUC</option>
<option value="COORDINADOR SERVICIOS GENERALES">COORDINADOR SERVICIOS GENERALES</option>
<option value="SUBGERENTE DE BIENESTAR">SUBGERENTE DE BIENESTAR</option>
<option value="MEDICO PEDIATRA HOSPITALARIO">MEDICO PEDIATRA HOSPITALARIO</option>
<option value="PATOLOGO SUBESPECIALISTA">PATOLOGO SUBESPECIALISTA</option>
<option value="AUXILIAR DE ENFERMERIA DE APOYO APH">AUXILIAR DE ENFERMERIA DE APOYO APH</option>
<option value="ASESOR MEDICO HISTORIA CLINICA">ASESOR MEDICO HISTORIA CLINICA</option>
<option value="MEDICO ESPECIALISTA PEDIATRA URG PEDIATRICO">MEDICO ESPECIALISTA PEDIATRA URG PEDIATRICO</option>
<option value="AUXILIAR DE FACTURACION III">AUXILIAR DE FACTURACION III</option>
<option value="MEDICO RADIOLOGO">MEDICO RADIOLOGO</option>
<option value="SUPERVISOR(A) DE ENFERMERIA">SUPERVISOR(A) DE ENFERMERIA</option>
<option value="AUXILIAR ENFERMERA SOPORTE FACTURACION">AUXILIAR ENFERMERA SOPORTE FACTURACION</option>
<option value="SUPERVISOR DE SEGURIDAD I">SUPERVISOR DE SEGURIDAD I</option>
<option value="COORDINADOR DE PATOLOGIA">COORDINADOR DE PATOLOGIA</option>
<option value="AUXILIAR ARCHIVO Y ESTADISTICA">AUXILIAR ARCHIVO Y ESTADISTICA</option>
<option value="GESTOR CLINICO">GESTOR CLINICO</option>
<option value="MEDICO PEDIATRA NEONATOLOGA">MEDICO PEDIATRA NEONATOLOGA</option>
<option value="COORDINADOR MEDICO UCI PEDIATRA">COORDINADOR MEDICO UCI PEDIATRA</option>
<option value="TELEFONISTA-RECEPCIONISTA">TELEFONISTA-RECEPCIONISTA</option>
<option value="DIRECTOR DE SALUD Y SEGURIDAD EN EL TRABAJO">DIRECTOR DE SALUD Y SEGURIDAD EN EL TRABAJO</option>
<option value="ARQUITECTO DISE ADOR">ARQUITECTO DISE ADOR</option>
<option value="COORDINADOR DE NEONATOLOGIA CRS">COORDINADOR DE NEONATOLOGIA CRS</option>
<option value="MEDICO PEDIATRA NEONATOS SEBASTIAN">MEDICO PEDIATRA NEONATOS SEBASTIAN</option>
<option value="JEFE DE DEPARTAMENTO">JEFE DE DEPARTAMENTO</option>
<option value="ENFERMERO AUDITOR JUNIOR">ENFERMERO AUDITOR JUNIOR</option>
<option value="ESPECIALISTA DE CIBERSEGURIDAD">ESPECIALISTA DE CIBERSEGURIDAD</option>
<option value="ESPECIALISTA EN PROYECTOS">ESPECIALISTA EN PROYECTOS</option>
<option value="DIRECTOR COMERCIAL INFRAESTRUCTURA CLINICA">DIRECTOR COMERCIAL INFRAESTRUCTURA CLINICA</option>
<option value="MEDICO SUBESPECIALISTA NEONATOLOGO CRS">MEDICO SUBESPECIALISTA NEONATOLOGO CRS</option>
<option value="DIRECTOR DE DESARROLLO">DIRECTOR DE DESARROLLO</option>
<option value="ANALISTA DE CONTRATACION">ANALISTA DE CONTRATACION</option>
<option value="JEFE DE TURNO - MEDICO CIRUJANO">JEFE DE TURNO - MEDICO CIRUJANO</option>
<option value="LIDER DE EXPERIENCIA AL PACIENTE CUC">LIDER DE EXPERIENCIA AL PACIENTE CUC</option>
<option value="MEDICO SUBESPECIALISTA GENETISTA">MEDICO SUBESPECIALISTA GENETISTA</option>
<option value="SUBGERENTE DE CONVENIOS, TARIFAS Y PARAMETRIZACION">SUBGERENTE DE CONVENIOS, TARIFAS Y PARAMETRIZACION</option>
<option value="MEDICO ESPECIALISTA CIRUGIA PEDIATRICA">MEDICO ESPECIALISTA CIRUGIA PEDIATRICA</option>
<option value="ANALISTA TECNICO SENIOR II">ANALISTA TECNICO SENIOR II</option>
<option value="MEDICO NEONATOLOGO">MEDICO NEONATOLOGO</option>
<option value="COORDINADOR DE IMAGENOLOGIA">COORDINADOR DE IMAGENOLOGIA</option>
<option value="HEMATOPATOLOGO">HEMATOPATOLOGO</option>
<option value="MEDICO PEDIATRA URG CUC DE APOYO">MEDICO PEDIATRA URG CUC DE APOYO</option>
<option value="DIRECTOR DE HOSPITALIZACION">DIRECTOR DE HOSPITALIZACION</option>
<option value="DIRECTOR DE CIBERSEGURIDAD">DIRECTOR DE CIBERSEGURIDAD</option>
<option value="MEDICO ESPECIALISTA CARDIOLOGO">MEDICO ESPECIALISTA CARDIOLOGO</option>
<option value="COMMUNITY MANAGER">COMMUNITY MANAGER</option>
<option value="ENFERMERA ESPECIALISTA DE CALIDAD">ENFERMERA ESPECIALISTA DE CALIDAD</option>
<option value="GESTOR DE INFORMACION">GESTOR DE INFORMACION</option>
<option value="MEDICO INTENSIVISTA PEDIATRA">MEDICO INTENSIVISTA PEDIATRA</option>
<option value="COORDINADOR DE SERVICIO Y EXPERIENCIA DEL USUARIO I">COORDINADOR DE SERVICIO Y EXPERIENCIA DEL USUARIO I</option>
<option value="ANALISTA GESTION FINANCIERA">ANALISTA GESTION FINANCIERA</option>
<option value="ANALISTA TECNICO JUNIOR">ANALISTA TECNICO JUNIOR</option>
<option value="LIDER FINANCIERO">LIDER FINANCIERO</option>
<option value="NUTRICIONISTA DE APOYO">NUTRICIONISTA DE APOYO</option>
<option value="SECRETARIA DEPARTAMENTO I">SECRETARIA DEPARTAMENTO I</option>
<option value="BACTERIOLOGO COORDINADOR">BACTERIOLOGO COORDINADOR</option>
<option value="COORDINADOR DE NUTRICION">COORDINADOR DE NUTRICION</option>
<option value="MEDICO SUBESPECIALISTA GINECOONCOLOGO">MEDICO SUBESPECIALISTA GINECOONCOLOGO</option>
<option value="CONDUCTOR">CONDUCTOR</option>
<option value="DIRECTOR MEDICO PHD">DIRECTOR MEDICO PHD</option>
<option value="JEFE DE CARDIOLOGIA">JEFE DE CARDIOLOGIA</option>
<option value="SECRETARIA - AUXILIAR DE LABORATORIO">SECRETARIA - AUXILIAR DE LABORATORIO</option>
<option value="SUBGERENTE DE MANTENIMIENTO LOCATIVO">SUBGERENTE DE MANTENIMIENTO LOCATIVO</option>
<option value="JEFE DE DEPARTAMENTO DE RADIOLOGIA">JEFE DE DEPARTAMENTO DE RADIOLOGIA</option>
<option value="ASESOR JUNIOR SISTEMAS DE INFORMACION">ASESOR JUNIOR SISTEMAS DE INFORMACION</option>
<option value="GERENTE DE GESTI N FARMAC UTICA">GERENTE DE GESTI N FARMAC UTICA</option>
<option value="CONSULTOR FUNCIONAL SENIOR II">CONSULTOR FUNCIONAL SENIOR II</option>
<option value="AUXILIAR DE ARCHIVO">AUXILIAR DE ARCHIVO</option>
<option value="COORDINADOR DE ENFERMERIA ENFERMEDADES INFECCIOSAS">COORDINADOR DE ENFERMERIA ENFERMEDADES INFECCIOSAS</option>
<option value="MEDICO GENERAL HOSPITALARIO DE APOYO">MEDICO GENERAL HOSPITALARIO DE APOYO</option>
<option value="GESTOR LOGISTICO Y ADMINISTRATIVO">GESTOR LOGISTICO Y ADMINISTRATIVO</option>
<option value="ADMINISTRADOR DEL SISTEMA DE IMAGENES">ADMINISTRADOR DEL SISTEMA DE IMAGENES</option>
<option value="MEDICO PEDIATRA HOSPITALARIO CUC">MEDICO PEDIATRA HOSPITALARIO CUC</option>
<option value="ANALISTA GESTION DEL CAMBIO SENIOR">ANALISTA GESTION DEL CAMBIO SENIOR</option>
<option value="MEDICO ESPECIALISTA INTERNISTA DE APOYO">MEDICO ESPECIALISTA INTERNISTA DE APOYO</option>
<option value="SECRETARIA TRANSCRIPTORA I">SECRETARIA TRANSCRIPTORA I</option>
<option value="AUXILIAR DE ENFERMERIA UNIDAD DE UROLOGIA">AUXILIAR DE ENFERMERIA UNIDAD DE UROLOGIA</option>
<option value="DOCTOR EN BIOLOGIA">DOCTOR EN BIOLOGIA</option>
<option value="ANALISTA DE DATOS">ANALISTA DE DATOS</option>
<option value="PROMOTOR DE SERVICIOS">PROMOTOR DE SERVICIOS</option>
<option value="AUXILIAR DE SERVICIOS ASISTENCIALES DE APOYO">AUXILIAR DE SERVICIOS ASISTENCIALES DE APOYO</option>
<option value="MEDICO ESPECIALISTA EN MEDICINA DEL DOLOR Y CUIDADO PALIATIVO">MEDICO ESPECIALISTA EN MEDICINA DEL DOLOR Y CUIDADO PALIATIVO</option>
<option value="ANALISTA RECURSOS FISICOS">ANALISTA RECURSOS FISICOS</option>
<option value="MEDICO SUBESPECIALISTA NEUMOLOGO PEDIATRA">MEDICO SUBESPECIALISTA NEUMOLOGO PEDIATRA</option>
<option value="LIDER DE CALIDAD Y TECNOVIGILANCIA">LIDER DE CALIDAD Y TECNOVIGILANCIA</option>
<option value="AUXILIAR ADMINISTRATIVO DE FACTURACION">AUXILIAR ADMINISTRATIVO DE FACTURACION</option>
<option value="JEFE DE DEPARTAMENTO QUIRURGICO">JEFE DE DEPARTAMENTO QUIRURGICO</option>
<option value="ANALISTA BUSINESS PARTNER">ANALISTA BUSINESS PARTNER</option>
<option value="MEDICO PEDIATRA NEONATOS CRS">MEDICO PEDIATRA NEONATOS CRS</option>
<option value="BACTERIOLOGO">BACTERIOLOGO</option>
<option value="TERAPEUTA RESPIRATORIA DE APOYO">TERAPEUTA RESPIRATORIA DE APOYO</option>
<option value="GERENTE DE INGENIERIA HOSPITALARIA">GERENTE DE INGENIERIA HOSPITALARIA</option>
<option value="COORDINADOR DE ENFERMERIA PROGRAMA DE SEGURIDAD DEL PACIENTE">COORDINADOR DE ENFERMERIA PROGRAMA DE SEGURIDAD DEL PACIENTE</option>
<option value="PROFESIONAL DE DESARROLLO DE TALENTO">PROFESIONAL DE DESARROLLO DE TALENTO</option>
<option value="COORDINADOR COMITE INFECCIONES">COORDINADOR COMITE INFECCIONES</option>
<option value="AUXILIAR OPERATIVO DE ENFERMERIA">AUXILIAR OPERATIVO DE ENFERMERIA</option>
<option value="GERENTE DE CANALES">GERENTE DE CANALES</option>
<option value="MEDICO RADIOLOGO I">MEDICO RADIOLOGO I</option>
<option value="SECRETARIA GRUPO DE TRASPLANTES">SECRETARIA GRUPO DE TRASPLANTES</option>
<option value="COORDINADOR DE ENFERMERIA HEMODINAMIA Y CARDIOLOGIA">COORDINADOR DE ENFERMERIA HEMODINAMIA Y CARDIOLOGIA</option>
<option value="LIDER DE PROYECTOS DE OBRA">LIDER DE PROYECTOS DE OBRA</option>
<option value="SECRETARIA VICEPRESIDENCIA">SECRETARIA VICEPRESIDENCIA</option>
<option value="GESTOR DE SERVICIOS TI">GESTOR DE SERVICIOS TI</option>
<option value="ABOGADO CORPORATIVO III">ABOGADO CORPORATIVO III</option>
<option value="AUXILIAR CONTRATACION DE PRESTADORES">AUXILIAR CONTRATACION DE PRESTADORES</option>
<option value="ESPECIALISTA IV">ESPECIALISTA IV</option>
<option value="COORDINADOR OPERATIVO CENTRAL DE REFERENCIA">COORDINADOR OPERATIVO CENTRAL DE REFERENCIA</option>
<option value="ENFERMERA JEFE ONCOLOGIA">ENFERMERA JEFE ONCOLOGIA</option>
<option value="MEDICO INVESTIGADOR">MEDICO INVESTIGADOR</option>
<option value="GESTOR DE ATENCION AL USUARIO I">GESTOR DE ATENCION AL USUARIO I</option>
<option value="GERENTE DE OPERACIONES EN SALUD">GERENTE DE OPERACIONES EN SALUD</option>
<option value="AUXILIAR SOPORTE DE IMAGENOLOGIA">AUXILIAR SOPORTE DE IMAGENOLOGIA</option>
<option value="TECNOLOGO EN RADIOLOGIA CONVENCIONAL DE APOYO">TECNOLOGO EN RADIOLOGIA CONVENCIONAL DE APOYO</option>
<option value="SECRETARIA DEPARTAMENTO SERVICIOS GENERALES">SECRETARIA DEPARTAMENTO SERVICIOS GENERALES</option>
<option value="MEDICO SUBESPECIALISTA NEONATOLOGO CUC">MEDICO SUBESPECIALISTA NEONATOLOGO CUC</option>
<option value="AUXILIAR DE ESTERILIZACION">AUXILIAR DE ESTERILIZACION</option>
<option value="COORDINADOR DE CONTABILIDAD">COORDINADOR DE CONTABILIDAD</option>
<option value="ANALISTA DE COMPENSACION PRESTADORES">ANALISTA DE COMPENSACION PRESTADORES</option>
<option value="COORDINADOR DE ENFERMERIA PROGRAMAS ESPECIALES">COORDINADOR DE ENFERMERIA PROGRAMAS ESPECIALES</option>
<option value="JEFE DE SOPORTE EMOCIONAL">JEFE DE SOPORTE EMOCIONAL</option>
<option value="MEDICO ESPECIALISTA REHABILITADOR CARDIACO">MEDICO ESPECIALISTA REHABILITADOR CARDIACO</option>
<option value="MEDICO DPTO VIG Y CONT ENF INFECCIOSAS">MEDICO DPTO VIG Y CONT ENF INFECCIOSAS</option>
<option value="GESTOR CLINICO PHD">GESTOR CLINICO PHD</option>
<option value="MEDICO PEDIATRA DPTO VIG CONT ENF INFECC">MEDICO PEDIATRA DPTO VIG CONT ENF INFECC</option>
<option value="MEDICO ESPECIALISTA EN MEDICINA NUCLEAR">MEDICO ESPECIALISTA EN MEDICINA NUCLEAR</option>
<option value="SECRETARIA TRANSCRIPTORA DE APOYO">SECRETARIA TRANSCRIPTORA DE APOYO</option>
<option value="ANALISTA DE BIENESTAR">ANALISTA DE BIENESTAR</option>
<option value="GERENTE PROYECTOS DE INFRAESTRUCTURA">GERENTE PROYECTOS DE INFRAESTRUCTURA</option>
<option value="DIRECTOR DE COMPRAS DE TECNOLOGIA INFORMATICA">DIRECTOR DE COMPRAS DE TECNOLOGIA INFORMATICA</option>
<option value="REGENTE DE FARMACIA DE APOYO">REGENTE DE FARMACIA DE APOYO</option>
<option value="MEDICO ESPECIALISTA CIRUJANO DE APOYO">MEDICO ESPECIALISTA CIRUJANO DE APOYO</option>
<option value="MEDICO ESPECIALISTA INFECTOLOGO">MEDICO ESPECIALISTA INFECTOLOGO</option>
<option value="GESTOR MEDICO PROGRAMA CONTIGO PHD">GESTOR MEDICO PROGRAMA CONTIGO PHD</option>
<option value="INFORMADOR DE ATENCION AL USUARIO DE APOYO">INFORMADOR DE ATENCION AL USUARIO DE APOYO</option>
<option value="SECRETARIA DEPARTAMENTO">SECRETARIA DEPARTAMENTO</option>
<option value="JEFE COMITE INFECCIONES">JEFE COMITE INFECCIONES</option>
<option value="PATOLOGO DE APOYO">PATOLOGO DE APOYO</option>
<option value="MEDICO PEDIATRA URGENCIAS DE APOYO">MEDICO PEDIATRA URGENCIAS DE APOYO</option>
<option value="AUXILIAR DE ADMISIONES Y FACTURACION DE APOYO">AUXILIAR DE ADMISIONES Y FACTURACION DE APOYO</option>
<option value="COORDINADOR DE ENFERMERIA UNIDAD DE EPIDEMIOLOGIA">COORDINADOR DE ENFERMERIA UNIDAD DE EPIDEMIOLOGIA</option>
<option value="COORDINADOR MEDICO UCI">COORDINADOR MEDICO UCI</option>
<option value="LIDER DE MANTENIMIENTO">LIDER DE MANTENIMIENTO</option>
<option value="ANALISTA DE ESTADISTICA">ANALISTA DE ESTADISTICA</option>
<option value="LIDER TRABAJO SOCIAL">LIDER TRABAJO SOCIAL</option>
<option value="GESTOR DE SALUD MENTAL">GESTOR DE SALUD MENTAL</option>
<option value="JEFE DEL SERVICIO DE RADIOLOGIA CUNC.">JEFE DEL SERVICIO DE RADIOLOGIA CUNC.</option>
<option value="GESTOR DE ATENCION AL USUARIO">GESTOR DE ATENCION AL USUARIO</option>
<option value="GESTOR OPERATIVO DE SEGURIDAD">GESTOR OPERATIVO DE SEGURIDAD</option>
<option value="GESTOR OPERATIVO">GESTOR OPERATIVO</option>
<option value="ESPECIALISTA BIOMEDICO II">ESPECIALISTA BIOMEDICO II</option>
<option value="JEFE DEPARTAMENTO DE ENFERMERIA">JEFE DEPARTAMENTO DE ENFERMERIA</option>
<option value="PROFESIONAL MODELOS DE INFORMACION">PROFESIONAL MODELOS DE INFORMACION</option>
<option value="VICEPRESIDENTE CIENTIFICO E INVESTIGACION">VICEPRESIDENTE CIENTIFICO E INVESTIGACION</option>
<option value="SECRETARIA DEPARTAMENTO DE ENFERMERIA">SECRETARIA DEPARTAMENTO DE ENFERMERIA</option>
<option value="BACTERIOLOGO COORDINADOR REGIONAL">BACTERIOLOGO COORDINADOR REGIONAL</option>
<option value="BACTERIOLOGO ADMINISTRATIVO">BACTERIOLOGO ADMINISTRATIVO</option>
<option value="BACTERIOLOGO DE CALIDAD">BACTERIOLOGO DE CALIDAD</option>
<option value="RECLUTADOR INVESTIGACION">RECLUTADOR INVESTIGACION</option>
<option value="ANALISTA DE DESARROLLO HUMANO">ANALISTA DE DESARROLLO HUMANO</option>
<option value="MEDICO ESPECIALISTA EN MEDICINA DEL DOLOR">MEDICO ESPECIALISTA EN MEDICINA DEL DOLOR</option>
<option value="JEFE NACIONAL DE RADIOLOGIA">JEFE NACIONAL DE RADIOLOGIA</option>
<option value="AUXILIAR DE CORRESPONDENCIA">AUXILIAR DE CORRESPONDENCIA</option>
<option value="GESTOR ASEGURAMIENTO DE LA CALIDAD">GESTOR ASEGURAMIENTO DE LA CALIDAD</option>
<option value="COORDINADOR DE CAMPA A">COORDINADOR DE CAMPA A</option>
<option value="COORDINADOR DE ENFERMERIA CONSULTA EXTERNA">COORDINADOR DE ENFERMERIA CONSULTA EXTERNA</option>
<option value="COORDINADOR DE FACTURACION">COORDINADOR DE FACTURACION</option>
<option value="COORDINADOR DE EPIDEMIOLOGIA Y SALUD PUBLICA">COORDINADOR DE EPIDEMIOLOGIA Y SALUD PUBLICA</option>
<option value="COORDINADOR DE CUENTAS POR PAGAR">COORDINADOR DE CUENTAS POR PAGAR</option>
<option value="DIRECTOR CIENTIFICO">DIRECTOR CIENTIFICO</option>
<option value="GESTOR INTEGRAL DE ATENCION">GESTOR INTEGRAL DE ATENCION</option>
<option value="SUBGERENTE DE SOLUCIONES UNIDAD DE NEGOCIO">SUBGERENTE DE SOLUCIONES UNIDAD DE NEGOCIO</option>
<option value="CONSULTOR TECNICO DE ARQUITECTURA">CONSULTOR TECNICO DE ARQUITECTURA</option>
<option value="LIDER DE COMPENSACION">LIDER DE COMPENSACION</option>
<option value="SUBGERENTE DE SISTEMA DE ACREDITACION">SUBGERENTE DE SISTEMA DE ACREDITACION</option>
<option value="COORDINADOR DE TESORERIA">COORDINADOR DE TESORERIA</option>
<option value="LIDER OPERATIVO NACIONAL RADIOLOGIA">LIDER OPERATIVO NACIONAL RADIOLOGIA</option>
<option value="MEDICO SUBESPECIALISTA NEFROLOGO PEDIATRA">MEDICO SUBESPECIALISTA NEFROLOGO PEDIATRA</option>
<option value="COORDINADOR BUSINESS PARTNER REGIONAL">COORDINADOR BUSINESS PARTNER REGIONAL</option>
<option value="AUDITOR MEDICO">AUDITOR MEDICO</option>
<option value="SUBDIRECTOR MEDICO DE CALIDAD">SUBDIRECTOR MEDICO DE CALIDAD</option>
<option value="LIDER DE INGENIERIA BIOMEDICA">LIDER DE INGENIERIA BIOMEDICA</option>
<option value="ESPECIALISTA DE GESTION DE LA INFORMACION">ESPECIALISTA DE GESTION DE LA INFORMACION</option>
<option value="DIRECTOR DE SEGUROS">DIRECTOR DE SEGUROS</option>
<option value="JEFE DEL SERVICIO DE TERAPIA">JEFE DEL SERVICIO DE TERAPIA</option>
<option value="ANALISTA TECNICO SENIOR I">ANALISTA TECNICO SENIOR I</option>
<option value="ADMINISTRADOR DEL SISTEMA I">ADMINISTRADOR DEL SISTEMA I</option>
<option value="MEDICO ESPECIALISTA OTORRINOLARINGOLOGO DE APOYO">MEDICO ESPECIALISTA OTORRINOLARINGOLOGO DE APOYO</option>
<option value="SECRETARIA DEPARTAMENTO DE URGENCIAS">SECRETARIA DEPARTAMENTO DE URGENCIAS</option>
<option value="INSTRUMENTADOR QUIRURGICO DE APOYO">INSTRUMENTADOR QUIRURGICO DE APOYO</option>
<option value="FISIOTERAPEUTA DE APOYO">FISIOTERAPEUTA DE APOYO</option>
<option value="GESTOR CLINICO PROGRAMA CONTIGO">GESTOR CLINICO PROGRAMA CONTIGO</option>
<option value="MEDICO SUBESPECIALISTA NEONATOLOGO PEDIATRA">MEDICO SUBESPECIALISTA NEONATOLOGO PEDIATRA</option>
<option value="CONSULTOR FUNCIONAL SENIOR I">CONSULTOR FUNCIONAL SENIOR I</option>
<option value="TECNOLOGO EN MEDICINA NUCLEAR DE APOYO">TECNOLOGO EN MEDICINA NUCLEAR DE APOYO</option>
<option value="ANALISTA BIOINFORMATICO JUNIOR">ANALISTA BIOINFORMATICO JUNIOR</option>
<option value="AUXILIAR DE DIETAS">AUXILIAR DE DIETAS</option>
<option value="COORDINADOR DE ESTUDIOS">COORDINADOR DE ESTUDIOS</option>
<option value="PSICOPEDAGOGA">PSICOPEDAGOGA</option>
<option value="MEDICO ESPECIALISTA GINECOBSTETRA DE APOYO">MEDICO ESPECIALISTA GINECOBSTETRA DE APOYO</option>
<option value="ANALISTA FUNCIONAL JUNIOR">ANALISTA FUNCIONAL JUNIOR</option>
<option value="AUXILIAR DE ENFERMERIA SERVICIO">AUXILIAR DE ENFERMERIA SERVICIO</option>
<option value="ANALISTA DE CARTERA">ANALISTA DE CARTERA</option>
<option value="SECRETARIA INGENIERIA Y MANTENIMIENTO">SECRETARIA INGENIERIA Y MANTENIMIENTO</option>
<option value="ENFERMERA JEFE DE RADIOLOGIA">ENFERMERA JEFE DE RADIOLOGIA</option>
<option value="COORDINADOR DE BIOINFORMATICA">COORDINADOR DE BIOINFORMATICA</option>
<option value="ANALISTA DE COSTOS">ANALISTA DE COSTOS</option>
<option value="MEDICO GINECOBSTETRA">MEDICO GINECOBSTETRA</option>
<option value="ANALISTA DE SOPORTE JUNIOR I">ANALISTA DE SOPORTE JUNIOR I</option>
<option value="AUXILIAR ADMINISTRATIVO I">AUXILIAR ADMINISTRATIVO I</option>
<option value="LIDER DE SELECCION">LIDER DE SELECCION</option>
<option value="AUXILIAR DE ADMINISTRACION DE SALARIOS">AUXILIAR DE ADMINISTRACION DE SALARIOS</option>
<option value="GESTOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO DE APOYO">GESTOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO DE APOYO</option>
<option value="GERENTE DE BUSINESS PARTNER INFRAESTRUCTURA DE SALUD">GERENTE DE BUSINESS PARTNER INFRAESTRUCTURA DE SALUD</option>
<option value="ANALISTA ADMINISTRATIVO DE APOYO">ANALISTA ADMINISTRATIVO DE APOYO</option>
<option value="ABOGADO PROCESAL II">ABOGADO PROCESAL II</option>
<option value="PRESIDENTE DE INFRAESTRUCTURA CLINICA">PRESIDENTE DE INFRAESTRUCTURA CLINICA</option>
<option value="COORDINADOR DE SALUD MENTAL">COORDINADOR DE SALUD MENTAL</option>
<option value="JEFE DE SERVICIOS AMBULATORIOS">JEFE DE SERVICIOS AMBULATORIOS</option>
<option value="MEDICO RADIOLOGO DE APOYO">MEDICO RADIOLOGO DE APOYO</option>
<option value="JEFE DEL SERVICIO DE ORTOPEDIA CUNC">JEFE DEL SERVICIO DE ORTOPEDIA CUNC</option>
<option value="DIRECTOR DE TESORERIA">DIRECTOR DE TESORERIA</option>
<option value="JEFE DE SEGURIDAD CLINICA">JEFE DE SEGURIDAD CLINICA</option>
<option value="ANALISTA WEB">ANALISTA WEB</option>
<option value="DIRECTORA DE BIENESTAR Y CALIDAD DE VIDA">DIRECTORA DE BIENESTAR Y CALIDAD DE VIDA</option>
<option value="JEFE DE AMBIENTES FISICOS Y SERVICIOS GENERALES">JEFE DE AMBIENTES FISICOS Y SERVICIOS GENERALES</option>
<option value="ANALISTA DE CAPACITACION Y DESARROLLO SENIOR">ANALISTA DE CAPACITACION Y DESARROLLO SENIOR</option>
<option value="ANALISTA FUNCIONAL SENIOR I">ANALISTA FUNCIONAL SENIOR I</option>
<option value="SECRETARIA DIRECCION CIENTIFICA">SECRETARIA DIRECCION CIENTIFICA</option>
<option value="CAPELLAN">CAPELLAN</option>
<option value="AUXILIAR DE LAVANDERIA">AUXILIAR DE LAVANDERIA</option>
<option value="ALMACENISTA">ALMACENISTA</option>
<option value="MEDICO ESPECIALISTA SALUD OCUPACIONAL">MEDICO ESPECIALISTA SALUD OCUPACIONAL</option>
<option value="COORDINADOR DE INVESTIGACION">COORDINADOR DE INVESTIGACION</option>
<option value="ESPECIALISTA DE BIENESTAR Y CALIDAD">ESPECIALISTA DE BIENESTAR Y CALIDAD</option>
<option value="AUXILIAR OPERATIVO DE COMPENSACION PRESTADORES">AUXILIAR OPERATIVO DE COMPENSACION PRESTADORES</option>
<option value="ENFERMERA SOPORTE FACTURACION">ENFERMERA SOPORTE FACTURACION</option>
<option value="ESPECIALISTA DE PROTECCION RADIOLOGICA">ESPECIALISTA DE PROTECCION RADIOLOGICA</option>
<option value="TELEFONISTA-RECEPCIONISTA I">TELEFONISTA-RECEPCIONISTA I</option>
<option value="COORDINADOR DE FACTURACION CUC">COORDINADOR DE FACTURACION CUC</option>
<option value="JEFE DE MANTENIMIENTO REGIONAL">JEFE DE MANTENIMIENTO REGIONAL</option>
<option value="AUXILIAR DE CONTRATACION">AUXILIAR DE CONTRATACION</option>
<option value="SUPERVISOR DE RADIOLOGIA">SUPERVISOR DE RADIOLOGIA</option>
<option value="AUXILIAR OPERATIVO DE FACTURACION">AUXILIAR OPERATIVO DE FACTURACION</option>
<option value="COORDINADOR DE FISIOTERAPIA">COORDINADOR DE FISIOTERAPIA</option>
<option value="GESTOR DE COMPRAS">GESTOR DE COMPRAS</option>
<option value="ENFERMERA GESTORA CLINICA">ENFERMERA GESTORA CLINICA</option>
<option value="AUXILIAR DE COMPRAS">AUXILIAR DE COMPRAS</option>
<option value="GESTOR ADMINISTRATIVO">GESTOR ADMINISTRATIVO</option>
<option value="ESPECIALISTA DE COMUNICACIONES EXTERNAS">ESPECIALISTA DE COMUNICACIONES EXTERNAS</option>
<option value="DIRECTOR ADMINISTRATIVO NACIONAL CENTROS AMBULATORIOS">DIRECTOR ADMINISTRATIVO NACIONAL CENTROS AMBULATORIOS</option>
<option value="ENFERMERA ESPECIALISTA DE CUIDADOS PALIATIVOS">ENFERMERA ESPECIALISTA DE CUIDADOS PALIATIVOS</option>
<option value="GESTOR OPERATIVO DIRECCION ADMINISTRATIVA">GESTOR OPERATIVO DIRECCION ADMINISTRATIVA</option>
<option value="BACTERIOLOGA ADMINISTRATIVA Y CALIDAD I">BACTERIOLOGA ADMINISTRATIVA Y CALIDAD I</option>
<option value="AUXILIAR ADMINISTRATIVO DE FACTURACION I">AUXILIAR ADMINISTRATIVO DE FACTURACION I</option>
<option value="QUIMICO FARMACEUTICO DE APOYO">QUIMICO FARMACEUTICO DE APOYO</option>
<option value="BACTERIOLOGO ESPECIALISTA EN MEDICINA NUCLEAR">BACTERIOLOGO ESPECIALISTA EN MEDICINA NUCLEAR</option>
<option value="TERAPISTA">TERAPISTA</option>
<option value="PROFESIONAL EN SALUD DE SERVICIOS MEDICOS">PROFESIONAL EN SALUD DE SERVICIOS MEDICOS</option>
<option value="ONCOPATOLOGO">ONCOPATOLOGO</option>
<option value="COORDINADOR PROGRAMA SEGURIDAD DEL PACIENTE">COORDINADOR PROGRAMA SEGURIDAD DEL PACIENTE</option>
<option value="COORDINADOR DE SERVICIO Y EXPERIENCIA DEL USUARIO">COORDINADOR DE SERVICIO Y EXPERIENCIA DEL USUARIO</option>
<option value="ANALISTA DE PLANEACION Y DESARROLLO">ANALISTA DE PLANEACION Y DESARROLLO</option>
<option value="ESPECIALISTA BIOMEDICO I">ESPECIALISTA BIOMEDICO I</option>
<option value="GESTOR DE SEGURIDAD POR EL PACIENTE">GESTOR DE SEGURIDAD POR EL PACIENTE</option>
<option value="DIRECTOR MEDICO NACIONAL CENTROS AMBULATORIOS">DIRECTOR MEDICO NACIONAL CENTROS AMBULATORIOS</option>
<option value="GERENTE DE COMPRAS DE INFRAESTRUCTURA FISICA, EQUIPO MEDICO Y SUMINISTROS">GERENTE DE COMPRAS DE INFRAESTRUCTURA FISICA, EQUIPO MEDICO Y SUMINISTROS</option>
<option value="JEFE DEL SERVICIO DE CIRUGIA">JEFE DEL SERVICIO DE CIRUGIA</option>
<option value="COORDINADOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO">COORDINADOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO</option>
<option value="LIDER DE GESTION ADMINISTRATIVA Y OPERACIONES">LIDER DE GESTION ADMINISTRATIVA Y OPERACIONES</option>
<option value="ENFERMERA ESPECIALIZADA UNIDAD RENAL">ENFERMERA ESPECIALIZADA UNIDAD RENAL</option>
<option value="COORDINADOR GESTION HOSPITALARIA">COORDINADOR GESTION HOSPITALARIA</option>
<option value="GERENTE DE GESTION DE LA INFORMACION">GERENTE DE GESTION DE LA INFORMACION</option>
<option value="ODONTOLOGO ATENCION PRIMARIA">ODONTOLOGO ATENCION PRIMARIA</option>
<option value="SUBGERENTE DE MARKETING Y COMUNICACIONES">SUBGERENTE DE MARKETING Y COMUNICACIONES</option>
<option value="SUBGERENTE DE ATRACCION">SUBGERENTE DE ATRACCION</option>
<option value="AUXILIAR DATA MASTER">AUXILIAR DATA MASTER</option>
<option value="DIRECTOR DE GESTION DE INFORMACION">DIRECTOR DE GESTION DE INFORMACION</option>
<option value="DIRECTOR MEDICO LABORATORIO CLINICO">DIRECTOR MEDICO LABORATORIO CLINICO</option>
<option value="REGULADOR">REGULADOR</option>
<option value="COORDINADOR DE TERAPIA">COORDINADOR DE TERAPIA</option>
<option value="LIDER DE INGENIERIA BIOMEDICA IMAGENES DIAGNOSTICAS">LIDER DE INGENIERIA BIOMEDICA IMAGENES DIAGNOSTICAS</option>
<option value="ANALISTA CONTROL Y POLITICA CONTABLE">ANALISTA CONTROL Y POLITICA CONTABLE</option>
<option value="DIRECTOR ADMINISTRATIVO CENTRAL DE COMPRAS">DIRECTOR ADMINISTRATIVO CENTRAL DE COMPRAS</option>
<option value="COORDINADOR DE RECAUDO">COORDINADOR DE RECAUDO</option>
<option value="AUXILIAR DE ENFERMERIA GESTION CLINICA">AUXILIAR DE ENFERMERIA GESTION CLINICA</option>
<option value="VICEPRESIDENTE DE GESTION EN SALUD">VICEPRESIDENTE DE GESTION EN SALUD</option>
<option value="ANALISTA DE ARCHIVO Y ESTADISTICA">ANALISTA DE ARCHIVO Y ESTADISTICA</option>
<option value="VICEPRESIDENTE DE OPERACIONES INFRAESTRUCTURA CLINICA">VICEPRESIDENTE DE OPERACIONES INFRAESTRUCTURA CLINICA</option>
<option value="COORDINADOR CLINICAS MEDICAS">COORDINADOR CLINICAS MEDICAS</option>
<option value="MEDICO ESPECIALISTA ORTOPEDISTA DE APOYO">MEDICO ESPECIALISTA ORTOPEDISTA DE APOYO</option>
<option value="MEDICO ESPECIALISTA REUMATOLOGO">MEDICO ESPECIALISTA REUMATOLOGO</option>
<option value="ANALISTA DE TESORERIA I">ANALISTA DE TESORERIA I</option>
<option value="GESTOR EPIDEMIOLOGIA CLINICA">GESTOR EPIDEMIOLOGIA CLINICA</option>
<option value="LIDER DE COMPRAS JUNIOR">LIDER DE COMPRAS JUNIOR</option>
<option value="ANALISTA JUNIOR DE BIENESTAR">ANALISTA JUNIOR DE BIENESTAR</option>
<option value="MEDICO PEDIATRA SUBESPECIALISTA EN MEDICINA DEL DOLOR Y CUIDADO PALIATIVO">MEDICO PEDIATRA SUBESPECIALISTA EN MEDICINA DEL DOLOR Y CUIDADO PALIATIVO</option>
<option value="COORDINADOR DE ENFERMERIA PROGRAMAS PYP Y DEMANDA INDUCIDA">COORDINADOR DE ENFERMERIA PROGRAMAS PYP Y DEMANDA INDUCIDA</option>
<option value="ANALISTA SISTEMA DE GESTION INTEGRADO">ANALISTA SISTEMA DE GESTION INTEGRADO</option>
<option value="JEFE DE NUTRICION Y DIETETICA">JEFE DE NUTRICION Y DIETETICA</option>
<option value="COORDINADOR DE PROYECTOS DE BIENESTAR">COORDINADOR DE PROYECTOS DE BIENESTAR</option>
<option value="ANALISTA DE CONTABILIDAD IV">ANALISTA DE CONTABILIDAD IV</option>
<option value="CONSULTOR DE MEJORA">CONSULTOR DE MEJORA</option>
<option value="DISE ADOR GRAFICO JR">DISE ADOR GRAFICO JR</option>
<option value="SECRETARIA DEL SERVICIO DE IMAGENES">SECRETARIA DEL SERVICIO DE IMAGENES</option>
<option value="ANALISTA DE CUENTAS POR PAGAR I">ANALISTA DE CUENTAS POR PAGAR I</option>
<option value="JEFE DE DEPARTAMENTO DE PATOLOGIA">JEFE DE DEPARTAMENTO DE PATOLOGIA</option>
<option value="ANALISTA FUNCIONAL SENIOR">ANALISTA FUNCIONAL SENIOR</option>
<option value="JEFE NACIONAL DE MEDICINA MATERNO FETAL">JEFE NACIONAL DE MEDICINA MATERNO FETAL</option>
<option value="COORDINADOR DE ENFERMERIA DE EDUCACION">COORDINADOR DE ENFERMERIA DE EDUCACION</option>
<option value="QUIMICO FARMACEUTICO I">QUIMICO FARMACEUTICO I</option>
<option value="JEFE DEL SERVICIO DE GINECOBSTETRICIA CUNC">JEFE DEL SERVICIO DE GINECOBSTETRICIA CUNC</option>
<option value="COORDINADOR DE ENFERMERIA UCI">COORDINADOR DE ENFERMERIA UCI</option>
<option value="JEFE UNIDAD DOCENTE ASISTENCIAL">JEFE UNIDAD DOCENTE ASISTENCIAL</option>
<option value="DIRECTOR NACIONAL DE AUDITORIA MEDICA">DIRECTOR NACIONAL DE AUDITORIA MEDICA</option>
<option value="COORDINADOR DE NEONATOLOGIA CUC">COORDINADOR DE NEONATOLOGIA CUC</option>
<option value="JEFE DE TURNO">JEFE DE TURNO</option>
<option value="COORDINADOR DE TRASPLANTE">COORDINADOR DE TRASPLANTE</option>
<option value="DIRECTOR MEDICO DE FACTURACION Y CONVENIOS">DIRECTOR MEDICO DE FACTURACION Y CONVENIOS</option>
<option value="TECNOLOGO DE APOYO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD I">TECNOLOGO DE APOYO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD I</option>
<option value="MEDICO INTERNISTA PROGRAMAS ESPECIALES">MEDICO INTERNISTA PROGRAMAS ESPECIALES</option>
<option value="GERENTE DE COMPRAS DE EQUIPO MEDICO Y SERVICIOS">GERENTE DE COMPRAS DE EQUIPO MEDICO Y SERVICIOS</option>
<option value="COORDINADOR DE REFERENCIA Y CONTRARREFERENCIA">COORDINADOR DE REFERENCIA Y CONTRARREFERENCIA</option>
<option value="JEFE SEGURIDAD DEL PACIENTE">JEFE SEGURIDAD DEL PACIENTE</option>
<option value="SECRETARIA DE GERENCIA">SECRETARIA DE GERENCIA</option>
<option value="GERENTE DE PROCESOS HOSPITALARIOS">GERENTE DE PROCESOS HOSPITALARIOS</option>
<option value="DIRECTORA DE PLANEACION Y DESARROLLO">DIRECTORA DE PLANEACION Y DESARROLLO</option>
<option value="INFORMADOR CONSULTA EXTERNA">INFORMADOR CONSULTA EXTERNA</option>
<option value="ANALISTA SISTEMAS DE INFORMACION EN SALUD">ANALISTA SISTEMAS DE INFORMACION EN SALUD</option>
<option value="COORDINADOR DE ENFERMERIA CUIDADOS PALIATIVOS">COORDINADOR DE ENFERMERIA CUIDADOS PALIATIVOS</option>
<option value="AUXILIAR INTEGRAL ADMINISTRATIVO DE APOYO">AUXILIAR INTEGRAL ADMINISTRATIVO DE APOYO</option>
<option value="ENFERMERO JEFE PROGRAMA SEGURIDAD DEL PACIENTE">ENFERMERO JEFE PROGRAMA SEGURIDAD DEL PACIENTE</option>
<option value="DIRECTOR DE CALIDAD">DIRECTOR DE CALIDAD</option>
<option value="PROFESIONAL DE CULTURA Y GESTION DEL CAMBIO">PROFESIONAL DE CULTURA Y GESTION DEL CAMBIO</option>
<option value="PSICOLOGO DE APOYO">PSICOLOGO DE APOYO</option>
<option value="ANALISTA GESTION HUMANA">ANALISTA GESTION HUMANA</option>
<option value="CITOHISTOTECNOLOGO DE APOYO">CITOHISTOTECNOLOGO DE APOYO</option>
<option value="ODONTOLOGO DE APOYO">ODONTOLOGO DE APOYO</option>
<option value="AUXILIAR DE ODONTOLOGIA DE APOYO">AUXILIAR DE ODONTOLOGIA DE APOYO</option>
<option value="COORDINADOR OPERATIVO DE TRASPLANTE">COORDINADOR OPERATIVO DE TRASPLANTE</option>
<option value="AUXILIAR DE TRANSITO">AUXILIAR DE TRANSITO</option>
<option value="DIRECTOR NACIONAL DE GRUPOS RELACIONADOS DE DIAGNOSTICO">DIRECTOR NACIONAL DE GRUPOS RELACIONADOS DE DIAGNOSTICO</option>
<option value="JEFE DE EPIDEMIOLOGIA Y SALUD PUBLICA">JEFE DE EPIDEMIOLOGIA Y SALUD PUBLICA</option>
<option value="MEDICO ESPECIALISTA NEUMOLOGO">MEDICO ESPECIALISTA NEUMOLOGO</option>
<option value="ABOGADO LABORAL I">ABOGADO LABORAL I</option>
<option value="COORDINADOR DE ESTERILIZACION">COORDINADOR DE ESTERILIZACION</option>
<option value="PROFESIONAL EN EPIDEMIOLOGIA CLINICA">PROFESIONAL EN EPIDEMIOLOGIA CLINICA</option>
<option value="GESTOR DE VIGILANCIA EN SALUD">GESTOR DE VIGILANCIA EN SALUD</option>
<option value="AUXILIAR ADMINISTRATIVO DESARROLLO HUMANO">AUXILIAR ADMINISTRATIVO DESARROLLO HUMANO</option>
<option value="DIRECTOR DE SQA">DIRECTOR DE SQA</option>
<option value="DIRECTOR COMERCIAL LABORATORIO CLINICO">DIRECTOR COMERCIAL LABORATORIO CLINICO</option>
<option value="AUXILIAR FACTURACION DE APOYO">AUXILIAR FACTURACION DE APOYO</option>
<option value="CONSULTOR FUNCIONAL JUNIOR I">CONSULTOR FUNCIONAL JUNIOR I</option>
<option value="MEDICO PEDIATRA HOSPITALARIO DE APOYO">MEDICO PEDIATRA HOSPITALARIO DE APOYO</option>
<option value="LIDER DE GESTION DE CANALES">LIDER DE GESTION DE CANALES</option>
<option value="GERENTE CLINICA">GERENTE CLINICA</option>
<option value="COORDINADOR OPERATIVO SALAS DE CIRUGIA">COORDINADOR OPERATIVO SALAS DE CIRUGIA</option>
<option value="ANALISTA DE INFORMACION">ANALISTA DE INFORMACION</option>
<option value="LIDER SEGURIDAD Y ELECTRONICA">LIDER SEGURIDAD Y ELECTRONICA</option>
<option value="JEFE CLINICO QUIRURGICO">JEFE CLINICO QUIRURGICO</option>
<option value="MEDICO SERVICIO SOCIAL OBLIGATORIO">MEDICO SERVICIO SOCIAL OBLIGATORIO</option>
<option value="GESTOR DE INFORMACION TECNICA">GESTOR DE INFORMACION TECNICA</option>
<option value="AUXILIAR OPERATIVO DE CAPACITACION">AUXILIAR OPERATIVO DE CAPACITACION</option>
<option value="VICEPRESIDENTE DE CALIDAD Y EXPERIENCIA DEL USUARIO">VICEPRESIDENTE DE CALIDAD Y EXPERIENCIA DEL USUARIO</option>
<option value="VICEPRESIDENTE ADMINISTRATIVO Y FINANCIERO DE INFRAESTRUCTURA">VICEPRESIDENTE ADMINISTRATIVO Y FINANCIERO DE INFRAESTRUCTURA</option>
<option value="GERENTE DE CENTROS AMBULATORIOS">GERENTE DE CENTROS AMBULATORIOS</option>
<option value="PRESIDENTE EJECUTIVO LABORATORIO">PRESIDENTE EJECUTIVO LABORATORIO</option>
<option value="GERENTE FINANCIERO SENIOR INFRAESTRUCTURA CLINICA">GERENTE FINANCIERO SENIOR INFRAESTRUCTURA CLINICA</option>
<option value="GERENTE DE SISTEMAS DE INFORMACION">GERENTE DE SISTEMAS DE INFORMACION</option>
<option value="ABOGADO III">ABOGADO III</option>
<option value="COLOPROCTOLOGO">COLOPROCTOLOGO</option>
<option value="AUXILIAR DE ARCHIVO Y ESTADISTICA">AUXILIAR DE ARCHIVO Y ESTADISTICA</option>
<option value="AYUDANTE DE LAVADO DE APOYO">AYUDANTE DE LAVADO DE APOYO</option>
<option value="ODONTOLOGO REHABILITADOR">ODONTOLOGO REHABILITADOR</option>
<option value="GERENTE COMPRAS DE TECNOLOGIA, SERVICIOS Y SEGUROS">GERENTE COMPRAS DE TECNOLOGIA, SERVICIOS Y SEGUROS</option>
<option value="COORDINADOR ALTO COSTO">COORDINADOR ALTO COSTO</option>
<option value="AUXILIAR DE CARTERA">AUXILIAR DE CARTERA</option>
<option value="JEFE DE SERVICIO Y CALIDAD">JEFE DE SERVICIO Y CALIDAD</option>
<option value="JEFE DE DEPARTAMENTO DE MEDICINA INTERNA">JEFE DE DEPARTAMENTO DE MEDICINA INTERNA</option>
<option value="TECNICO EN RADIOLOGIA DE APOYO">TECNICO EN RADIOLOGIA DE APOYO</option>
<option value="JEFE DEL SERVICIO DE RADIOLOGIA">JEFE DEL SERVICIO DE RADIOLOGIA</option>
<option value="CAMILLERO DE APOYO">CAMILLERO DE APOYO</option>
<option value="GERENTE DE GESTION CLINICA">GERENTE DE GESTION CLINICA</option>
<option value="ABOGADO II">ABOGADO II</option>
<option value="ANALISTA DE DATOS I">ANALISTA DE DATOS I</option>
<option value="ANALISTA DE IMPUESTOS">ANALISTA DE IMPUESTOS</option>
<option value="DIRECTOR DE PATOLOGIA">DIRECTOR DE PATOLOGIA</option>
<option value="SUPERVISOR SERVICIOS GENERALES Y AMBIENTE FISICO">SUPERVISOR SERVICIOS GENERALES Y AMBIENTE FISICO</option>
<option value="VICEPRESIDENTE DE DESARROLLO DE NEGOCIO INFRAESTRUCTURA CLINICA">VICEPRESIDENTE DE DESARROLLO DE NEGOCIO INFRAESTRUCTURA CLINICA</option>
<option value="AUXILIAR DE IMPUESTOS">AUXILIAR DE IMPUESTOS</option>
<option value="CONSULTOR PORTAFOLIO DE PROYECTOS SENIOR">CONSULTOR PORTAFOLIO DE PROYECTOS SENIOR</option>
<option value="AUXILIAR DE CAPACITACION">AUXILIAR DE CAPACITACION</option>
<option value="ESPECIALISTA DE PARTICIPACION CIUDADANA">ESPECIALISTA DE PARTICIPACION CIUDADANA</option>
<option value="AUXILIAR DE ENFERMERIA SOPORTE FACTURACION">AUXILIAR DE ENFERMERIA SOPORTE FACTURACION</option>
<option value="COORDINADOR DE CARTERA">COORDINADOR DE CARTERA</option>
<option value="ANALISTA DE FACTURACION">ANALISTA DE FACTURACION</option>
<option value="COORDINADOR DE EDUCACION">COORDINADOR DE EDUCACION</option>
<option value="ANALISTA JUNIOR DEFENSORIA DEL USUARIO">ANALISTA JUNIOR DEFENSORIA DEL USUARIO</option>
<option value="COORDINADOR DE ACTIVOS FIJOS">COORDINADOR DE ACTIVOS FIJOS</option>
<option value="ANALISTA DE PROYECTOS Y CONTRATOS">ANALISTA DE PROYECTOS Y CONTRATOS</option>
<option value="COORDINADOR DE ENFERMERIA CLINICA DE HERIDAS Y DOLOR">COORDINADOR DE ENFERMERIA CLINICA DE HERIDAS Y DOLOR</option>
<option value="GESTOR DE INFORMACION FARMACEUTICA">GESTOR DE INFORMACION FARMACEUTICA</option>
<option value="OPERADOR DE SOPORTE">OPERADOR DE SOPORTE</option>
<option value="COORDINADOR DE ENFERMERIA CIRUGIA CARDIOVASCULAR">COORDINADOR DE ENFERMERIA CIRUGIA CARDIOVASCULAR</option>
<option value="COORDINADOR FARMACEUTICO DE UNIDADES AMBULATORIAS Y MEDICINA NUCLEAR">COORDINADOR FARMACEUTICO DE UNIDADES AMBULATORIAS Y MEDICINA NUCLEAR</option>
<option value="LIDER NACIONAL CENTRAL DE ESTERILIZACION">LIDER NACIONAL CENTRAL DE ESTERILIZACION</option>
<option value="ADMINISTRADOR DE REDES Y COMUNICACIONES">ADMINISTRADOR DE REDES Y COMUNICACIONES</option>
<option value="ANALISTA DE COMPENSACION">ANALISTA DE COMPENSACION</option>
<option value="LIDER DE EXPERIENCIA AL PACIENTE">LIDER DE EXPERIENCIA AL PACIENTE</option>
<option value="GERENTE DE CALIDAD">GERENTE DE CALIDAD</option>
<option value="DIRECTOR DE ARQUITECTURA">DIRECTOR DE ARQUITECTURA</option>
<option value="GERENTE LABORATORIO CLINICO">GERENTE LABORATORIO CLINICO</option>
<option value="AUXILIAR OPERATIVO MESA DE VALIDACION I">AUXILIAR OPERATIVO MESA DE VALIDACION I</option>
<option value="GESTOR DE SERVICIOS TI I">GESTOR DE SERVICIOS TI I</option>
<option value="SUBGERENTE ASUNTOS LABORALES">SUBGERENTE ASUNTOS LABORALES</option>
<option value="AUXILIAR DE COMUNICACIONES">AUXILIAR DE COMUNICACIONES</option>
<option value="GESTOR DE AMBIENTES FISICOS Y SERVICIOS GENERALES">GESTOR DE AMBIENTES FISICOS Y SERVICIOS GENERALES</option>
<option value="ONCOPATOLOGO I">ONCOPATOLOGO I</option>
<option value="ASISTENTE DE CONTABILIDAD">ASISTENTE DE CONTABILIDAD</option>
<option value="AUXILIAR DE SERVICIOS ASISTENCIALES I DE APOYO">AUXILIAR DE SERVICIOS ASISTENCIALES I DE APOYO</option>
<option value="MEDICO INTENSIVISTA">MEDICO INTENSIVISTA</option>
<option value="GERENTE DE OPERACIONES ECONOMICAS">GERENTE DE OPERACIONES ECONOMICAS</option>
<option value="GESTOR DE AGENDAMIENTO">GESTOR DE AGENDAMIENTO</option>
<option value="GERENTE DE SERVICIO INFRAESTRUCTURA CLINICA">GERENTE DE SERVICIO INFRAESTRUCTURA CLINICA</option>
<option value="LIDER DE FORMACION Y DESARROLLO">LIDER DE FORMACION Y DESARROLLO</option>
<option value="ASISTENTE DE ESTADISTICA">ASISTENTE DE ESTADISTICA</option>
<option value="JEFE DEPARTAMENTO CIRUGIA Y ANESTESIA">JEFE DEPARTAMENTO CIRUGIA Y ANESTESIA</option>
<option value="SECRETARIA COMITE DE INFECCIONES Y MEDICINA INTERNA">SECRETARIA COMITE DE INFECCIONES Y MEDICINA INTERNA</option>
<option value="MEDICO SUBESPECIALISTA NEUROPEDIATRA DE APOYO">MEDICO SUBESPECIALISTA NEUROPEDIATRA DE APOYO</option>
<option value="ANALISTA GESTION OPERATIVA">ANALISTA GESTION OPERATIVA</option>
<option value="ADMINISTRADOR BASE DE DATOS I">ADMINISTRADOR BASE DE DATOS I</option>
<option value="DIRECTOR DE PRESTADORES">DIRECTOR DE PRESTADORES</option>
<option value="AUXILIAR OPERATIVO DESARROLLO HUMANO">AUXILIAR OPERATIVO DESARROLLO HUMANO</option>
<option value="PROFESIONAL EN SALUD PUBLICA">PROFESIONAL EN SALUD PUBLICA</option>
<option value="COORDINADOR SERVICIOS QUIRURGICOS">COORDINADOR SERVICIOS QUIRURGICOS</option>
<option value="GERENTE DE PROYECTOS DIGITALES">GERENTE DE PROYECTOS DIGITALES</option>
<option value="ANALISTA ADMINISTRACION DE SALARIOS JUNIOR DE APOYO">ANALISTA ADMINISTRACION DE SALARIOS JUNIOR DE APOYO</option>
<option value="DIRECTOR DE AUDITORIA EN SALUD">DIRECTOR DE AUDITORIA EN SALUD</option>
<option value="DIRECTOR NACIONAL DEL PROGRAMA CONTIGO CLINICA COLSANITAS">DIRECTOR NACIONAL DEL PROGRAMA CONTIGO CLINICA COLSANITAS</option>
<option value="JEFE DE DEPARTAMENTO SALAS DE CIRUGIA">JEFE DE DEPARTAMENTO SALAS DE CIRUGIA</option>
<option value="GERENTE DE PLANEACION Y DESARROLLO">GERENTE DE PLANEACION Y DESARROLLO</option>
<option value="CONSULTOR FUNCIONAL BI">CONSULTOR FUNCIONAL BI</option>
<option value="LIDER TECNICO">LIDER TECNICO</option>
<option value="AUXILIAR SOPORTE DE FACTURACION DE CUIDADOS PALIATIVOS">AUXILIAR SOPORTE DE FACTURACION DE CUIDADOS PALIATIVOS</option>
<option value="LIDER DE COMPRAS TECNOLOGIA">LIDER DE COMPRAS TECNOLOGIA</option>
<option value="DIRECTOR ADMINISTRATIVO OF INTERNACIONAL">DIRECTOR ADMINISTRATIVO OF INTERNACIONAL</option>
<option value="COORDINADOR SERVICIO IMAGENES DIAGNOSTICAS">COORDINADOR SERVICIO IMAGENES DIAGNOSTICAS</option>
<option value="DIRECTOR DE DOTACION Y SERVICIOS">DIRECTOR DE DOTACION Y SERVICIOS</option>
<option value="DIRECTOR DE CULTURA">DIRECTOR DE CULTURA</option>
<option value="DIRECTOR DE ADMINISTRACION PLANTA DE PERSONAL">DIRECTOR DE ADMINISTRACION PLANTA DE PERSONAL</option>
<option value="COORDINADOR DE COSTOS">COORDINADOR DE COSTOS</option>
<option value="GERENTE COMERCIAL">GERENTE COMERCIAL</option>
<option value="SUBDIRECTOR DE GESTION MEDICA">SUBDIRECTOR DE GESTION MEDICA</option>
<option value="LIDER DE SERVICIO Y RELACIONAMIENTO">LIDER DE SERVICIO Y RELACIONAMIENTO</option>
<option value="ANALISTA GESTION ADMINISTRATIVA">ANALISTA GESTION ADMINISTRATIVA</option>
<option value="BIOLOGO">BIOLOGO</option>
<option value="JEFE DE CALIDAD Y SEGURIDAD DEL PACIENTE">JEFE DE CALIDAD Y SEGURIDAD DEL PACIENTE</option>
<option value="DIRECTOR DE GESTION AMBIENTAL">DIRECTOR DE GESTION AMBIENTAL</option>
<option value="ARQUITECTO DE INFRAESTRUCTURA">ARQUITECTO DE INFRAESTRUCTURA</option>
<option value="COORDINADOR DE ENFERMERIA DE OFICINA INTERNACIONAL">COORDINADOR DE ENFERMERIA DE OFICINA INTERNACIONAL</option>
<option value="ANALISTA SENIOR DE INFORMACION">ANALISTA SENIOR DE INFORMACION</option>
<option value="COORDINADOR DE RADIOLOGIA">COORDINADOR DE RADIOLOGIA</option>
<option value="CONSULTOR DE GESTION COMERCIAL">CONSULTOR DE GESTION COMERCIAL</option>
<option value="ANALISTA ARQUITECTURA DE COMPENSACION">ANALISTA ARQUITECTURA DE COMPENSACION</option>
<option value="JEFE DE CONTABILIDAD">JEFE DE CONTABILIDAD</option>
<option value="COORDINADOR MEDICO GRD">COORDINADOR MEDICO GRD</option>
<option value="LIDER DE GESTION BIOMEDICA">LIDER DE GESTION BIOMEDICA</option>
<option value="SUBGERENTE ADMINISTRATIVO CUC">SUBGERENTE ADMINISTRATIVO CUC</option>
<option value="COORDINADOR DE URGENCIAS CRS">COORDINADOR DE URGENCIAS CRS</option>
<option value="DIRECTOR DE CPAT">DIRECTOR DE CPAT</option>
<option value="SUBGERENTE GESTION DE INFORMACION">SUBGERENTE GESTION DE INFORMACION</option>
<option value="ANALISTA FUNCIONAL DE USABILIDAD">ANALISTA FUNCIONAL DE USABILIDAD</option>
<option value="DIRECTOR CIENTIFICO CLI.COLSANITAS">DIRECTOR CIENTIFICO CLI.COLSANITAS</option>
<option value="COORDINADOR OPERATIVO DE IMAGENES DIAGNOSTICAS">COORDINADOR OPERATIVO DE IMAGENES DIAGNOSTICAS</option>
<option value="PROFESIONAL EN CONTABILIDAD">PROFESIONAL EN CONTABILIDAD</option>
<option value="DIRECTOR DE GESTION DE INFRAESTRUCTURA">DIRECTOR DE GESTION DE INFRAESTRUCTURA</option>
<option value="ANALISTA DE SOPORTE SENIOR II">ANALISTA DE SOPORTE SENIOR II</option>
<option value="ESPECIALISTA DE COMUNICACIONES INTERNAS">ESPECIALISTA DE COMUNICACIONES INTERNAS</option>
<option value="ANALISTA FORMACION VIRTUAL">ANALISTA FORMACION VIRTUAL</option>
<option value="LIDER DE LABORATORIO DE METROLOGIA">LIDER DE LABORATORIO DE METROLOGIA</option>
<option value="JEFE NACIONAL DEL SERVICIO DE URGENCIAS">JEFE NACIONAL DEL SERVICIO DE URGENCIAS</option>
<option value="SUBGERENTE DE COSTOS Y PROYECTOS">SUBGERENTE DE COSTOS Y PROYECTOS</option>
<option value="JEFE SERVICIO DE HEMATOLOGIA Y TRASPLANTE">JEFE SERVICIO DE HEMATOLOGIA Y TRASPLANTE</option>
<option value="COORDINADOR DE ENFERMERIA DE UNIDADES DIAGNOSTICAS AMBULATORIAS">COORDINADOR DE ENFERMERIA DE UNIDADES DIAGNOSTICAS AMBULATORIAS</option>
<option value="RECREADOR">RECREADOR</option>
<option value="GERENTE DE MODELOS DE ATENCION">GERENTE DE MODELOS DE ATENCION</option>
<option value="DIRECTOR DE COMPRAS DE INSUMOS MEDICOS Y LABORATORIO CLINICO">DIRECTOR DE COMPRAS DE INSUMOS MEDICOS Y LABORATORIO CLINICO</option>
<option value="ANALISTA DE BIENESTAR DE USUARIOS">ANALISTA DE BIENESTAR DE USUARIOS</option>
<option value="AMA DE LLAVES">AMA DE LLAVES</option>
<option value="ARQUITECTO DE DATOS">ARQUITECTO DE DATOS</option>
<option value="JEFE SUPERVISORA">JEFE SUPERVISORA</option>
<option value="ANALISTA SEGUIMIENTO PROCESOS ADMINISTRATIVOS">ANALISTA SEGUIMIENTO PROCESOS ADMINISTRATIVOS</option>
<option value="AUXILIAR SOPORTE ADMISIONES Y FACTURACION">AUXILIAR SOPORTE ADMISIONES Y FACTURACION</option>
<option value="LIDER DE ARQUITECTURA">LIDER DE ARQUITECTURA</option>
<option value="DESARROLLADOR DE BI">DESARROLLADOR DE BI</option>
<option value="GESTOR DE SERVICIOS TI II">GESTOR DE SERVICIOS TI II</option>
<option value="CONSULTOR DE CIBERSEGURIDAD">CONSULTOR DE CIBERSEGURIDAD</option>
<option value="ODONTOLOGO CIRUJANO">ODONTOLOGO CIRUJANO</option>
<option value="ANALISTA DE PRESUPUESTO">ANALISTA DE PRESUPUESTO</option>
<option value="GESTOR OPERATIVO DE RECAUDO I">GESTOR OPERATIVO DE RECAUDO I</option>
<option value="DIRECTOR DE PROYECTOS I">DIRECTOR DE PROYECTOS I</option>
<option value="ANALISTA DE CONVENIOS Y TARIFAS">ANALISTA DE CONVENIOS Y TARIFAS</option>
<option value="COORDINADOR DE ENFERMERIA EN PROGRAMA PYP">COORDINADOR DE ENFERMERIA EN PROGRAMA PYP</option>
<option value="MEDICO ESPECIALISTA NEONATOLOGO">MEDICO ESPECIALISTA NEONATOLOGO</option>
<option value="AUXILIAR OPERATIVO OFICINA INTERNACIONAL">AUXILIAR OPERATIVO OFICINA INTERNACIONAL</option>
<option value="COORDINADOR OPERATIVO DE PROGRAMAS ESPECIALES">COORDINADOR OPERATIVO DE PROGRAMAS ESPECIALES</option>
<option value="LIDER DEL MODELO DEL SERVICIO">LIDER DEL MODELO DEL SERVICIO</option>
<option value="COORDINADOR ADMINISTRATIVO PROGRAMAS ESPECIALES">COORDINADOR ADMINISTRATIVO PROGRAMAS ESPECIALES</option>
<option value="ANALISTA SQA SENIOR">ANALISTA SQA SENIOR</option>
<option value="DIRECTOR DE CARTERA">DIRECTOR DE CARTERA</option>
<option value="ADMINISTRADOR DE NUBE PUBLICA AZURE">ADMINISTRADOR DE NUBE PUBLICA AZURE</option>
<option value="DIRECTOR DE NEFROLOGIA">DIRECTOR DE NEFROLOGIA</option>
<option value="DIRECTOR OPERATIVO DE SALAS DE CIRUGIA">DIRECTOR OPERATIVO DE SALAS DE CIRUGIA</option>
<option value="COORDINADOR OPERATIVO DEL SERVICIO DE GASTRO">COORDINADOR OPERATIVO DEL SERVICIO DE GASTRO</option>
<option value="ASISTENTE DE TESORERIA">ASISTENTE DE TESORERIA</option>
<option value="COORDINADOR DE URGENCIAS CUC">COORDINADOR DE URGENCIAS CUC</option>
<option value="COORDINADOR DE VIGILANCIA TECNOLOGICA">COORDINADOR DE VIGILANCIA TECNOLOGICA</option>
<option value="DIRECTOR GESTION TRIBUTARIA DE NOMINA Y REQUERIMIENTOS">DIRECTOR GESTION TRIBUTARIA DE NOMINA Y REQUERIMIENTOS</option>
<option value="ANALISTA DE INFORMACION ADMINISTRACION DE SALARIOS">ANALISTA DE INFORMACION ADMINISTRACION DE SALARIOS</option>
<option value="COORDINADOR DE ESTUDIOS DE INVESTIGACION EN DOLOR Y CUIDADOS PALIATIVOS">COORDINADOR DE ESTUDIOS DE INVESTIGACION EN DOLOR Y CUIDADOS PALIATIVOS</option>
<option value="DIRECTOR DE CLINICAS MEDICAS">DIRECTOR DE CLINICAS MEDICAS</option>
<option value="ENFERMERA DE SALUD PUBLICA">ENFERMERA DE SALUD PUBLICA</option>
<option value="COORDINADOR OPERATIVO Y DE COSTOS SALAS DE CIRUGIA">COORDINADOR OPERATIVO Y DE COSTOS SALAS DE CIRUGIA</option>
<option value="JEFE DE DEPARTAMENTO DE UROLOGIA">JEFE DE DEPARTAMENTO DE UROLOGIA</option>
<option value="COORDINADOR MEDICO PROGRAMAS ESPECIALES">COORDINADOR MEDICO PROGRAMAS ESPECIALES</option>
<option value="ANALISTA DE PROYECTOS">ANALISTA DE PROYECTOS</option>
<option value="MEDICO GENERAL DE CUIDADOS PALIATIVOS DE APOYO">MEDICO GENERAL DE CUIDADOS PALIATIVOS DE APOYO</option>
<option value="SECRETARIA DEPARTAMENTO II">SECRETARIA DEPARTAMENTO II</option>
<option value="GERENTE FINANCIERO INFRAESTRUCTURA">GERENTE FINANCIERO INFRAESTRUCTURA</option>
<option value="GERENTE DE SERVICIOS Y AMBIENTE FISICO">GERENTE DE SERVICIOS Y AMBIENTE FISICO</option>
<option value="JEFE DEL SERVICIO DE PEDIATRIA">JEFE DEL SERVICIO DE PEDIATRIA</option>
<option value="ANALISTA DE SOPORTE JUNIOR">ANALISTA DE SOPORTE JUNIOR</option>
<option value="LIDER DE GESTION DE LA INFORMACION">LIDER DE GESTION DE LA INFORMACION</option>
<option value="DIRECTOR DE GASES MEDICINALES Y SERVICIO FARMACEUTICO">DIRECTOR DE GASES MEDICINALES Y SERVICIO FARMACEUTICO</option>
<option value="ANALISTA DE APLICACIONES SENIOR">ANALISTA DE APLICACIONES SENIOR</option>
<option value="INFORMADOR LABORATORIO DE APOYO">INFORMADOR LABORATORIO DE APOYO</option>
<option value="GERENTE NACIONAL DE ENFERMERIA Y PARAMEDICAS">GERENTE NACIONAL DE ENFERMERIA Y PARAMEDICAS</option>
<option value="DIRECTOR COMPRAS INFRAESTRUCTURA Y MOBILIARIO">DIRECTOR COMPRAS INFRAESTRUCTURA Y MOBILIARIO</option>
<option value="GERENTE CORPORATIVO DE SOLUCIONES TRANSVERSALES">GERENTE CORPORATIVO DE SOLUCIONES TRANSVERSALES</option>
<option value="ASISTENTE DE CARTERA">ASISTENTE DE CARTERA</option>
<option value="COORDINADOR DE ADMISIONES">COORDINADOR DE ADMISIONES</option>
<option value="DIRECTOR NACIONAL DE FACTURACION">DIRECTOR NACIONAL DE FACTURACION</option>
<option value="COORDINADOR DE SERVICIOS AMBULATORIOS">COORDINADOR DE SERVICIOS AMBULATORIOS</option>
<option value="DIRECTOR DE GESTION DE CONTRATOS">DIRECTOR DE GESTION DE CONTRATOS</option>
<option value="LIDER DE MEJORAMIENTO">LIDER DE MEJORAMIENTO</option>
<option value="DIRECTOR DE INVENTARIOS">DIRECTOR DE INVENTARIOS</option>
<option value="DIRECTOR ASEGURAMIENTO DE CALIDAD">DIRECTOR ASEGURAMIENTO DE CALIDAD</option>
<option value="GERENTE DE OPERACIONES">GERENTE DE OPERACIONES</option>
<option value="DIRECTOR TECNICO CENTRAL DE APROVECHAMIENTO">DIRECTOR TECNICO CENTRAL DE APROVECHAMIENTO</option>
<option value="COORDINADOR DEPARTAMENTO NEONATOS">COORDINADOR DEPARTAMENTO NEONATOS</option>
<option value="DIRECTOR REDES Y COMUNICACIONES">DIRECTOR REDES Y COMUNICACIONES</option>
<option value="LIDER DE COMPRAS SERVICIOS Y SEGUROS">LIDER DE COMPRAS SERVICIOS Y SEGUROS</option>
<option value="MEDICO ESPECIALISTA FISIATRA DE CUIDADOS PALIATIVOS">MEDICO ESPECIALISTA FISIATRA DE CUIDADOS PALIATIVOS</option>
<option value="DIRECTOR INTELIGENCIA DE NEGOCIOS">DIRECTOR INTELIGENCIA DE NEGOCIOS</option>
<option value="AUXILIAR ADMINISTRATIVO DE SEGURIDAD">AUXILIAR ADMINISTRATIVO DE SEGURIDAD</option>
<option value="ASESOR DE SERVICIO Y COMERCIAL">ASESOR DE SERVICIO Y COMERCIAL</option>
<option value="COORDINADOR DE ODONTOLOGIA">COORDINADOR DE ODONTOLOGIA</option>
<option value="SUBGERENTE COMERCIAL">SUBGERENTE COMERCIAL</option>
<option value="DIRECTOR DE ODONTOSANITAS">DIRECTOR DE ODONTOSANITAS</option>
<option value="PERIODONCISTA">PERIODONCISTA</option>
<option value="ODONTOLOGO LIDER">ODONTOLOGO LIDER</option>
<option value="GESTOR ADMINISTRATIVO ODONTOSANITAS">GESTOR ADMINISTRATIVO ODONTOSANITAS</option>
<option value="TECNICO DE MANTENIMIENTO ESPECIALISTA III">TECNICO DE MANTENIMIENTO ESPECIALISTA III</option>
<option value="AUXILIAR OPERATIVO DE ODONTOLOGIA">AUXILIAR OPERATIVO DE ODONTOLOGIA</option>
<option value="COORDINADOR COMERCIAL">COORDINADOR COMERCIAL</option>
<option value="SUBGERENTE DE OPERACIONES">SUBGERENTE DE OPERACIONES</option>
<option value="DIRECTOR COMERCIAL CLINICA DENTAL">DIRECTOR COMERCIAL CLINICA DENTAL</option>
<option value="AUXILIAR INTEGRAL DE ADMISIONES II">AUXILIAR INTEGRAL DE ADMISIONES II</option>
<option value="DIRECTOR ADMINISTRATIVO Y FINANCIERO">DIRECTOR ADMINISTRATIVO Y FINANCIERO</option>
<option value="COORDINADOR DE PROYECTOS II">COORDINADOR DE PROYECTOS II</option>
<option value="AUXILIAR LABORATORIO DENTAL">AUXILIAR LABORATORIO DENTAL</option>
<option value="AUXILIAR OPERATIVO ODONTOLOGIA">AUXILIAR OPERATIVO ODONTOLOGIA</option>
<option value="GESTOR DE PROCESOS">GESTOR DE PROCESOS</option>
<option value="TECNICO DENTAL">TECNICO DENTAL</option>
<option value="INGENIERO BIOMEDICO ESPECIALISTA II">INGENIERO BIOMEDICO ESPECIALISTA II</option>
<option value="GERENTE CLINICA DENTAL">GERENTE CLINICA DENTAL</option>
<option value="ODONTOLOGO FACIAL">ODONTOLOGO FACIAL</option>
<option value="GERENTE GLOBAL DE ODONTOLOGIA">GERENTE GLOBAL DE ODONTOLOGIA</option>
<option value="INFORMADOR DE USUARIOS I">INFORMADOR DE USUARIOS I</option>
<option value="ASESOR INTEGRAL DE SERVICIOS MEDICOS I">ASESOR INTEGRAL DE SERVICIOS MEDICOS I</option>
<option value="PRACTICANTE DE INNOVACION">PRACTICANTE DE INNOVACION</option>
<option value="ASESOR INTEGRAL DE SERVICIOS MEDICOS">ASESOR INTEGRAL DE SERVICIOS MEDICOS</option>
<option value="AUXILIAR OPERATIVO DE CUENTAS MEDICAS">AUXILIAR OPERATIVO DE CUENTAS MEDICAS</option>
<option value="ASESOR COMERCIAL JUNIOR I">ASESOR COMERCIAL JUNIOR I</option>
<option value="ASESOR EN FORMACION">ASESOR EN FORMACION</option>
<option value="GERENTE PLAN MEDICO DOMICILIARIO PLUS">GERENTE PLAN MEDICO DOMICILIARIO PLUS</option>
<option value="ASESOR DE USUARIOS SENIOR">ASESOR DE USUARIOS SENIOR</option>
<option value="ASESOR DE SERVICIO CANALES">ASESOR DE SERVICIO CANALES</option>
<option value="DIRECTOR OPERATIVO DE CANAL PRESENCIAL MP I">DIRECTOR OPERATIVO DE CANAL PRESENCIAL MP I</option>
<option value="AUXILIAR DE AFILIACIONES">AUXILIAR DE AFILIACIONES</option>
<option value="EJECUTIVO COMERCIAL MANTENIMIENTO">EJECUTIVO COMERCIAL MANTENIMIENTO</option>
<option value="ASESOR MEDICO">ASESOR MEDICO</option>
<option value="ASESOR DE USUARIOS EN ENTRENAMIENTO">ASESOR DE USUARIOS EN ENTRENAMIENTO</option>
<option value="ANALISTA JUNIOR DE CARTERA Y COBRANZAS">ANALISTA JUNIOR DE CARTERA Y COBRANZAS</option>
<option value="MEDICO BILINGUE EMPRESA">MEDICO BILINGUE EMPRESA</option>
<option value="ASESOR DE USUARIOS JUNIOR">ASESOR DE USUARIOS JUNIOR</option>
<option value="ADMINISTRADOR CENTRO DE COMPUTO">ADMINISTRADOR CENTRO DE COMPUTO</option>
<option value="EJECUTIVO DE CUENTAS CORPORATIVAS JUNIOR">EJECUTIVO DE CUENTAS CORPORATIVAS JUNIOR</option>
<option value="ASISTENTE CONTROL OPERATIVO">ASISTENTE CONTROL OPERATIVO</option>
<option value="ASESOR DE GESTION INTEGRAL SENIOR">ASESOR DE GESTION INTEGRAL SENIOR</option>
<option value="AUXILIAR CUENTAS MEDICAS">AUXILIAR CUENTAS MEDICAS</option>
<option value="ASESOR COMERCIAL MULTIPRODUCTO">ASESOR COMERCIAL MULTIPRODUCTO</option>
<option value="ASESOR DE GESTION INTEGRAL">ASESOR DE GESTION INTEGRAL</option>
<option value="GERENTE DE GESTION Y PROYECTOS">GERENTE DE GESTION Y PROYECTOS</option>
<option value="ANALISTA DATA MASTER I">ANALISTA DATA MASTER I</option>
<option value="DIRECTOR DE INVESTIGACION DE MERCADOS">DIRECTOR DE INVESTIGACION DE MERCADOS</option>
<option value="ENFERMERA SERVICIOS MEDICOS">ENFERMERA SERVICIOS MEDICOS</option>
<option value="ARQUITECTO INTELIGENCIA DE NEGOCIOS">ARQUITECTO INTELIGENCIA DE NEGOCIOS</option>
<option value="AUXILIAR DE INFORMACION COMERCIAL">AUXILIAR DE INFORMACION COMERCIAL</option>
<option value="EJECUTIVO COMERCIAL MANTENIMIENTO JUNIOR">EJECUTIVO COMERCIAL MANTENIMIENTO JUNIOR</option>
<option value="AUXILIAR DE CARTERA Y COBRANZAS">AUXILIAR DE CARTERA Y COBRANZAS</option>
<option value="GESTOR DE CANAL VIRTUAL">GESTOR DE CANAL VIRTUAL</option>
<option value="CONSULTOR FUNCIONAL JUNIOR">CONSULTOR FUNCIONAL JUNIOR</option>
<option value="PROFESIONAL DISE O DE INNOVACION">PROFESIONAL DISE O DE INNOVACION</option>
<option value="ASESOR MESA DE AYUDA A PRESTADORES">ASESOR MESA DE AYUDA A PRESTADORES</option>
<option value="EJECUTIVO COMERCIAL DE REFERIDOS">EJECUTIVO COMERCIAL DE REFERIDOS</option>
<option value="ASESOR MANTENIMIENTO USUARIOS">ASESOR MANTENIMIENTO USUARIOS</option>
<option value="ASESOR DE GESTION INTEGRAL MASTER">ASESOR DE GESTION INTEGRAL MASTER</option>
<option value="EJECUTIVO COMERCIAL COLSANITAS DENTAL">EJECUTIVO COMERCIAL COLSANITAS DENTAL</option>
<option value="ASESOR COMERCIAL JUNIOR II">ASESOR COMERCIAL JUNIOR II</option>
<option value="COORDINADOR CUENTAS MEDICAS">COORDINADOR CUENTAS MEDICAS</option>
<option value="AUDITOR EN SALUD">AUDITOR EN SALUD</option>
<option value="ANALISTA DE MARKETING">ANALISTA DE MARKETING</option>
<option value="CONSULTOR DE PROYECTOS">CONSULTOR DE PROYECTOS</option>
<option value="DIRECTOR DE AFILIACIONES MP">DIRECTOR DE AFILIACIONES MP</option>
<option value="ANALISTA JUNIOR INVESTIGACION DE MERCADOS">ANALISTA JUNIOR INVESTIGACION DE MERCADOS</option>
<option value="ASESOR MEDICO PLANES ESPECIALES">ASESOR MEDICO PLANES ESPECIALES</option>
<option value="ANALISTA SISTEMAS DE INFORMACION">ANALISTA SISTEMAS DE INFORMACION</option>
<option value="GESTOR DE CONCILIACIONES">GESTOR DE CONCILIACIONES</option>
<option value="GESTOR COMERCIAL">GESTOR COMERCIAL</option>
<option value="DIRECTOR OFICINA">DIRECTOR OFICINA</option>
<option value="GERENTE BUSINESS PARTNER DE ASEGURAMIENTO PREMIUM">GERENTE BUSINESS PARTNER DE ASEGURAMIENTO PREMIUM</option>
<option value="ANALISTA JUNIOR EN SISTEMA DE INFORMACION">ANALISTA JUNIOR EN SISTEMA DE INFORMACION</option>
<option value="SUBGERENTE DE GESTION INTERNACIONAL">SUBGERENTE DE GESTION INTERNACIONAL</option>
<option value="PROTECCION">PROTECCION</option>
<option value="SUPERVISOR DE SERVICIOS MEDICOS">SUPERVISOR DE SERVICIOS MEDICOS</option>
<option value="ANALISTA EN SALUD DE CONVENIOS Y TARIFAS">ANALISTA EN SALUD DE CONVENIOS Y TARIFAS</option>
<option value="AUXILIAR DE ASEO Y CAFETERIA">AUXILIAR DE ASEO Y CAFETERIA</option>
<option value="AUXILIAR SERVICIOS VARIOS">AUXILIAR SERVICIOS VARIOS</option>
<option value="JEFE DE OFICINA">JEFE DE OFICINA</option>
<option value="GERENTE CORPORATIVO DE DESARROLLO">GERENTE CORPORATIVO DE DESARROLLO</option>
<option value="SECRETARIA SUBGERENCIA">SECRETARIA SUBGERENCIA</option>
<option value="DIRECTOR DE FORMACION">DIRECTOR DE FORMACION</option>
<option value="EJECUTIVO DE CUENTAS CORPORATIVAS SENIOR">EJECUTIVO DE CUENTAS CORPORATIVAS SENIOR</option>
<option value="ADMINISTRADOR TELEFONIA">ADMINISTRADOR TELEFONIA</option>
<option value="SUPERVISOR DE SEGURIDAD">SUPERVISOR DE SEGURIDAD</option>
<option value="ANALISTA DE RESERVAS">ANALISTA DE RESERVAS</option>
<option value="AUXILIAR DE FARMACIA">AUXILIAR DE FARMACIA</option>
<option value="COORDINADOR INTEGRAL">COORDINADOR INTEGRAL</option>
<option value="ASESOR INTEGRAL CORPORATIVO">ASESOR INTEGRAL CORPORATIVO</option>
<option value="GESTOR DE SALUD MENTAL COLSANITAS">GESTOR DE SALUD MENTAL COLSANITAS</option>
<option value="DIRECTOR DE PROYECTOS DE SERVICIO">DIRECTOR DE PROYECTOS DE SERVICIO</option>
<option value="GESTOR OPERATIVO JUNIOR">GESTOR OPERATIVO JUNIOR</option>
<option value="DIRECTOR DE PROYECTOS COMERCIALES">DIRECTOR DE PROYECTOS COMERCIALES</option>
<option value="SECRETARIA RECEPCIONISTA">SECRETARIA RECEPCIONISTA</option>
<option value="AUXILIAR DE ENFERMERIA EMPRESA">AUXILIAR DE ENFERMERIA EMPRESA</option>
<option value="COORDINADOR DE RELACIONES PUBLICAS Y EVENTOS">COORDINADOR DE RELACIONES PUBLICAS Y EVENTOS</option>
<option value="GERENTE DE AUDITORIA Y CONTRALORIA">GERENTE DE AUDITORIA Y CONTRALORIA</option>
<option value="CONTRALOR MEDICO REGIONAL BOGOTA">CONTRALOR MEDICO REGIONAL BOGOTA</option>
<option value="PROFESIONAL GESTION MEDICA">PROFESIONAL GESTION MEDICA</option>
<option value="ASESOR SERVICIOS MEDICOS JUNIOR">ASESOR SERVICIOS MEDICOS JUNIOR</option>
<option value="COORDINADOR CENTRO DE EVALUACION EN MEDICAMENTOS Y TECNOLOGIA EN SALUD">COORDINADOR CENTRO DE EVALUACION EN MEDICAMENTOS Y TECNOLOGIA EN SALUD</option>
<option value="DIRECTOR DE GESTION DE PORTAFOLIO">DIRECTOR DE GESTION DE PORTAFOLIO</option>
<option value="LIDER DE PROYECTOS">LIDER DE PROYECTOS</option>
<option value="SUPERNUMERARIO">SUPERNUMERARIO</option>
<option value="ANALISTA ADMINISTRATIVO TECNOLOGIA">ANALISTA ADMINISTRATIVO TECNOLOGIA</option>
<option value="GERENTE GESTION DEL CONOCIMIENTO EN SALUD">GERENTE GESTION DEL CONOCIMIENTO EN SALUD</option>
<option value="GERENTE MEDICO DE ASEGURAMIENTO">GERENTE MEDICO DE ASEGURAMIENTO</option>
<option value="DIRECTOR DE SEGURIDAD DE LA INFORMACION">DIRECTOR DE SEGURIDAD DE LA INFORMACION</option>
<option value="ESPECIALISTA DE ANALITICA Y PROYECTOS COMERCIALES">ESPECIALISTA DE ANALITICA Y PROYECTOS COMERCIALES</option>
<option value="REALIZADOR AUDIOVISUAL">REALIZADOR AUDIOVISUAL</option>
<option value="COORDINADOR RED REGIONAL">COORDINADOR RED REGIONAL</option>
<option value="ANALISTA DE COMPENSACION PRESTADORES JUNIOR">ANALISTA DE COMPENSACION PRESTADORES JUNIOR</option>
<option value="GESTOR SISTEMA DE INFORMACION">GESTOR SISTEMA DE INFORMACION</option>
<option value="GERENTE CENTRAL MERCADEO">GERENTE CENTRAL MERCADEO</option>
<option value="GERENTE DE ANALITICA">GERENTE DE ANALITICA</option>
<option value="GERENTE DE ODONTOLOGIA">GERENTE DE ODONTOLOGIA</option>
<option value="ESPECIALISTA EN FORMACION">ESPECIALISTA EN FORMACION</option>
<option value="SUBGERENTE ADMINISTRATIVA EQUIPO DE TENIS">SUBGERENTE ADMINISTRATIVA EQUIPO DE TENIS</option>
<option value="ENTRENADOR DE TENIS EQUIPO COLSANITAS">ENTRENADOR DE TENIS EQUIPO COLSANITAS</option>
<option value="ASESOR MASTER">ASESOR MASTER</option>
<option value="DIRECTOR CENTRAL DE SERVICIOS DOMICILIARIOS">DIRECTOR CENTRAL DE SERVICIOS DOMICILIARIOS</option>
<option value="DIRECTOR COMERCIAL ZONA">DIRECTOR COMERCIAL ZONA</option>
<option value="ANALISTA DE AFILIACIONES">ANALISTA DE AFILIACIONES</option>
<option value="GESTOR DE SEGUIMIENTO COMERCIAL">GESTOR DE SEGUIMIENTO COMERCIAL</option>
<option value="LIDER DE CONVENIOS Y TARIFAS">LIDER DE CONVENIOS Y TARIFAS</option>
<option value="ANALISTA DE INFORMACION Y GESTION JUNIOR">ANALISTA DE INFORMACION Y GESTION JUNIOR</option>
<option value="EJECUTIVO COMERCIAL DE MANTENIMIENTO SENIOR">EJECUTIVO COMERCIAL DE MANTENIMIENTO SENIOR</option>
<option value="PRESIDENTE REGION SUR">PRESIDENTE REGION SUR</option>
<option value="DIRECTOR CORPORATIVO ADMINISTRATIVO DE TECNOLOGIA">DIRECTOR CORPORATIVO ADMINISTRATIVO DE TECNOLOGIA</option>
<option value="ANALISTA FINANCIERO COLOMBIA">ANALISTA FINANCIERO COLOMBIA</option>
<option value="ANALISTA ADMINISTRATIVO I">ANALISTA ADMINISTRATIVO I</option>
<option value="SUBGERENTE DE INVESTIGACION DE MERCADOS">SUBGERENTE DE INVESTIGACION DE MERCADOS</option>
<option value="COORDINADOR DE IMPUESTOS">COORDINADOR DE IMPUESTOS</option>
<option value="VICEPRESIDENTE EJECUTIVO EMPRESAS COMERCIALES">VICEPRESIDENTE EJECUTIVO EMPRESAS COMERCIALES</option>
<option value="ANALISTA TECNICO SENIOR">ANALISTA TECNICO SENIOR</option>
<option value="LIDER REGIONAL DE SERVICIO">LIDER REGIONAL DE SERVICIO</option>
<option value="ANALISTA DE OPERACIONES TI">ANALISTA DE OPERACIONES TI</option>
<option value="DIRECTOR DE POSICIONAMIENTO">DIRECTOR DE POSICIONAMIENTO</option>
<option value="MEDICO EMPRESARIAL">MEDICO EMPRESARIAL</option>
<option value="DIRECTOR DE DESARROLLO CORPORATIVO">DIRECTOR DE DESARROLLO CORPORATIVO</option>
<option value="LIDER DE CONTRATACION">LIDER DE CONTRATACION</option>
<option value="DIRECTOR COMERCIAL">DIRECTOR COMERCIAL</option>
<option value="DIRECTOR DE PROGRAMA MEDICO EMPRESARIAL">DIRECTOR DE PROGRAMA MEDICO EMPRESARIAL</option>
<option value="SUBGERENTE MEDICO REGIONAL">SUBGERENTE MEDICO REGIONAL</option>
<option value="SUBGERENTE OPERATIVO DE PRESTACIONES MP">SUBGERENTE OPERATIVO DE PRESTACIONES MP</option>
<option value="LIDER TECNICO II">LIDER TECNICO II</option>
<option value="SUBGERENTE DE PROYECTOS">SUBGERENTE DE PROYECTOS</option>
<option value="GERENTE DE PLANEACION Y CONTROL FINANCIERO MP">GERENTE DE PLANEACION Y CONTROL FINANCIERO MP</option>
<option value="DIRECTOR DE AGENCIAS">DIRECTOR DE AGENCIAS</option>
<option value="COORDINADOR DE PROTECCION">COORDINADOR DE PROTECCION</option>
<option value="COORDINADOR COMERCIAL DE VENTA DIRECTA">COORDINADOR COMERCIAL DE VENTA DIRECTA</option>
<option value="ANALISTA DE DATOS Y MEJORAMIENTO">ANALISTA DE DATOS Y MEJORAMIENTO</option>
<option value="ESPECIALISTA EN ESTUDIOS FINANCIEROS Y ECONOMICOS">ESPECIALISTA EN ESTUDIOS FINANCIEROS Y ECONOMICOS</option>
<option value="ANALISTA DE SUSCRIPCION DE HERRAMIENTAS">ANALISTA DE SUSCRIPCION DE HERRAMIENTAS</option>
<option value="GESTOR DE PRESTADORES">GESTOR DE PRESTADORES</option>
<option value="ASESOR MEDICO I">ASESOR MEDICO I</option>
<option value="EJECUTIVO DE CUENTAS CORPORATIVAS">EJECUTIVO DE CUENTAS CORPORATIVAS</option>
<option value="SUBGERENTE DE MEDICINA PREVENTIVA">SUBGERENTE DE MEDICINA PREVENTIVA</option>
<option value="DIRECTOR BASE DE DATOS">DIRECTOR BASE DE DATOS</option>
<option value="CONSULTOR PORTAFOLIO DE PROYECTOS JUNIOR">CONSULTOR PORTAFOLIO DE PROYECTOS JUNIOR</option>
<option value="DIRECTOR REGIONAL DE ODONTOLOGIA">DIRECTOR REGIONAL DE ODONTOLOGIA</option>
<option value="SUBGERENTE OPERACION DE CANALES">SUBGERENTE OPERACION DE CANALES</option>
<option value="CIENTIFICO DE DATOS">CIENTIFICO DE DATOS</option>
<option value="ENFERMERA PLANES ESPECIALES">ENFERMERA PLANES ESPECIALES</option>
<option value="ANALISTA FINANCIERO PAISES">ANALISTA FINANCIERO PAISES</option>
<option value="SUBGERENTE DE MEDICAMENTOS">SUBGERENTE DE MEDICAMENTOS</option>
<option value="COORDINADOR DE CARTERA MP">COORDINADOR DE CARTERA MP</option>
<option value="COORDINADOR INTEGRAL COMERCIAL">COORDINADOR INTEGRAL COMERCIAL</option>
<option value="ANALISTA CUENTAS MEDICAS">ANALISTA CUENTAS MEDICAS</option>
<option value="SUPERVISOR ASESORIA EN SALUD MP">SUPERVISOR ASESORIA EN SALUD MP</option>
<option value="TECNICO DE MANTENIMIENTO">TECNICO DE MANTENIMIENTO</option>
<option value="COORDINADOR MEDICO PLANES ESPECIALES">COORDINADOR MEDICO PLANES ESPECIALES</option>
<option value="AUDITOR MEDICO DE PARAMETRIZACION">AUDITOR MEDICO DE PARAMETRIZACION</option>
<option value="DIRECTOR DE GESTION DE CANALES">DIRECTOR DE GESTION DE CANALES</option>
<option value="GESTOR DE MEJORA">GESTOR DE MEJORA</option>
<option value="DIRECTOR DE ANALITICA Y PROYECTOS COMERCIALES">DIRECTOR DE ANALITICA Y PROYECTOS COMERCIALES</option>
<option value="ABOGADO TRIBUTARISTA">ABOGADO TRIBUTARISTA</option>
<option value="LIDER OPERATIVO">LIDER OPERATIVO</option>
<option value="AUDITOR DE GESTION MEDICA">AUDITOR DE GESTION MEDICA</option>
<option value="COORDINADOR DE PRESUPUESTO">COORDINADOR DE PRESUPUESTO</option>
<option value="ESPECIALISTA DE SEGURIDAD">ESPECIALISTA DE SEGURIDAD</option>
<option value="ANALISTA FINANCIERO GRUPO KERALTY">ANALISTA FINANCIERO GRUPO KERALTY</option>
<option value="DIRECTOR COMERCIAL ZONA DELEGADAS">DIRECTOR COMERCIAL ZONA DELEGADAS</option>
<option value="DIRECTOR EXPERIENCIA DE CANALES">DIRECTOR EXPERIENCIA DE CANALES</option>
<option value="DIRECTOR OPERATIVO DE COMUNICACIONES">DIRECTOR OPERATIVO DE COMUNICACIONES</option>
<option value="GERENTE CORPORATIVO DE TECNOLOGIA">GERENTE CORPORATIVO DE TECNOLOGIA</option>
<option value="ABOGADO CORPORATIVO II">ABOGADO CORPORATIVO II</option>
<option value="SUBGERENTE COMERCIAL MEDELLIN">SUBGERENTE COMERCIAL MEDELLIN</option>
<option value="SUBGERENTE DE SISTEMAS Y FORENSE">SUBGERENTE DE SISTEMAS Y FORENSE</option>
<option value="DIRECTOR DE CONTRATACION">DIRECTOR DE CONTRATACION</option>
<option value="ANALISTA ASEGURAMIENTO DE CALIDAD">ANALISTA ASEGURAMIENTO DE CALIDAD</option>
<option value="ANALISTA DE TESORERIA">ANALISTA DE TESORERIA</option>
<option value="ARQUITECTO INTELIGENCIA DE NEGOCIOS I">ARQUITECTO INTELIGENCIA DE NEGOCIOS I</option>
<option value="COORDINADOR PORTAL WEB">COORDINADOR PORTAL WEB</option>
<option value="FORMADOR">FORMADOR</option>
<option value="GERENTE DE ATENCION DOMICILIARIA">GERENTE DE ATENCION DOMICILIARIA</option>
<option value="LIDER DE PROCESOS OPERATIVOS">LIDER DE PROCESOS OPERATIVOS</option>
<option value="VICEPRESIDENTE DE SALUD MEDICINA PREPAGADA">VICEPRESIDENTE DE SALUD MEDICINA PREPAGADA</option>
<option value="ANALISTA SENIOR INVESTIGACION DE MERCADOS">ANALISTA SENIOR INVESTIGACION DE MERCADOS</option>
<option value="COORDINADOR DE OFICINA">COORDINADOR DE OFICINA</option>
<option value="ANALISTA DE RELACIONES PUBLICAS">ANALISTA DE RELACIONES PUBLICAS</option>
<option value="COORDINADOR OPERATIVO COMERCIAL">COORDINADOR OPERATIVO COMERCIAL</option>
<option value="PROFESIONAL DE SEGURIDAD DE LA INFORMACION I">PROFESIONAL DE SEGURIDAD DE LA INFORMACION I</option>
<option value="AUDITOR ODONTOLOGICO">AUDITOR ODONTOLOGICO</option>
<option value="ENFERMERO AUDITOR SENIOR">ENFERMERO AUDITOR SENIOR</option>
<option value="SUBGERENTE DE BUSINESS PARTNER ASEGURAMIENTO PREMIUM">SUBGERENTE DE BUSINESS PARTNER ASEGURAMIENTO PREMIUM</option>
<option value="DISE ADOR GRAFICO">DISE ADOR GRAFICO</option>
<option value="COORDINADOR SERVICIOS MEDICOS">COORDINADOR SERVICIOS MEDICOS</option>
<option value="AUDITOR MEDICO DE APOYO">AUDITOR MEDICO DE APOYO</option>
<option value="GESTOR FUNCIONAL DEL SERVICIO">GESTOR FUNCIONAL DEL SERVICIO</option>
<option value="LIDER UX EXPERIENCIA DE USUARIO">LIDER UX EXPERIENCIA DE USUARIO</option>
<option value="SUBGERENTE MEDICO REGIONAL BTA MEDICINA PREPAGADA">SUBGERENTE MEDICO REGIONAL BTA MEDICINA PREPAGADA</option>
<option value="GESTOR COMPENSACION PRESTADORES">GESTOR COMPENSACION PRESTADORES</option>
<option value="ESPECIALISTA DE SEGURIDAD DE LA INFORMACION">ESPECIALISTA DE SEGURIDAD DE LA INFORMACION</option>
<option value="SECRETARIA GERENCIA REGIONAL">SECRETARIA GERENCIA REGIONAL</option>
<option value="SUBGERENTE DE GESTION EQUIPOS DE SALUD">SUBGERENTE DE GESTION EQUIPOS DE SALUD</option>
<option value="GESTOR DE INFORMACION Y PROYECTOS">GESTOR DE INFORMACION Y PROYECTOS</option>
<option value="JEFE DE GESTION DE PORTAFOLIO">JEFE DE GESTION DE PORTAFOLIO</option>
<option value="ASESOR DE PRESTADORES">ASESOR DE PRESTADORES</option>
<option value="ANALISTA DE PROYECTOS COMERCIALES">ANALISTA DE PROYECTOS COMERCIALES</option>
<option value="SUBGERENTE MEDICO RED DE PRESTADORES">SUBGERENTE MEDICO RED DE PRESTADORES</option>
<option value="GERENTE GESTION INTEGRAL EN SALUD">GERENTE GESTION INTEGRAL EN SALUD</option>
<option value="GERENTE DE CANALES DIGITALES">GERENTE DE CANALES DIGITALES</option>
<option value="ASESOR INTEGRAL DE USUARIOS JUNIOR">ASESOR INTEGRAL DE USUARIOS JUNIOR</option>
<option value="DIRECTOR OPERATIVO DE PRESTACIONES">DIRECTOR OPERATIVO DE PRESTACIONES</option>
<option value="ESPECIALISTA SERVICIOS MEDICOS MP">ESPECIALISTA SERVICIOS MEDICOS MP</option>
<option value="DIRECTOR DE ACTUARIA ASEGURAMIENTO">DIRECTOR DE ACTUARIA ASEGURAMIENTO</option>
<option value="SUBGERENTE DE GESTION COMERCIAL">SUBGERENTE DE GESTION COMERCIAL</option>
<option value="CONTRALOR CUENTAS MEDICAS">CONTRALOR CUENTAS MEDICAS</option>
<option value="LIDER ADMINISTRATIVO DE PROYECTOS">LIDER ADMINISTRATIVO DE PROYECTOS</option>
<option value="ARQUITECTO DE TI">ARQUITECTO DE TI</option>
<option value="ANALISTA DE CONVENIOS Y TARIFAS SENIOR">ANALISTA DE CONVENIOS Y TARIFAS SENIOR</option>
<option value="JEFE DE SEGURIDAD CLINICA REINA SOFIA">JEFE DE SEGURIDAD CLINICA REINA SOFIA</option>
<option value="AUXILIAR DE TESORERIA">AUXILIAR DE TESORERIA</option>
<option value="CONSULTOR GESTION DE PERSONAL">CONSULTOR GESTION DE PERSONAL</option>
<option value="ANALISTA DIGITAL SENIOR">ANALISTA DIGITAL SENIOR</option>
<option value="GESTOR ADMINISTRATIVO ODONTOLOG A">GESTOR ADMINISTRATIVO ODONTOLOG A</option>
<option value="DIRECTOR OPERATIVO DE CANAL PRESENCIAL MP">DIRECTOR OPERATIVO DE CANAL PRESENCIAL MP</option>
<option value="PROFESIONAL SENIOR DE RESERVAS">PROFESIONAL SENIOR DE RESERVAS</option>
<option value="COORDINADOR DE AUTORIZACIONES MP">COORDINADOR DE AUTORIZACIONES MP</option>
<option value="CONSULTOR DE SERVICIO">CONSULTOR DE SERVICIO</option>
<option value="GESTOR DE CUENTAS MEDICAS">GESTOR DE CUENTAS MEDICAS</option>
<option value="COORDINADOR GESTION FARMACEUTICA">COORDINADOR GESTION FARMACEUTICA</option>
<option value="SECRETARIA DE IMPUESTOS">SECRETARIA DE IMPUESTOS</option>
<option value="DIRECTOR CORPORATIVO DE GESTION Y PLANEACION">DIRECTOR CORPORATIVO DE GESTION Y PLANEACION</option>
<option value="BACTERIOLOGO AUDITOR">BACTERIOLOGO AUDITOR</option>
<option value="COORDINADOR REGIONAL DE PROYECTOS COMERCIALES">COORDINADOR REGIONAL DE PROYECTOS COMERCIALES</option>
<option value="LIDER DE GESTION Y PROYECTOS">LIDER DE GESTION Y PROYECTOS</option>
<option value="ASESOR DE ATENCION PERSONALIZADA">ASESOR DE ATENCION PERSONALIZADA</option>
<option value="LIDER DE FORMACION VIRTUAL">LIDER DE FORMACION VIRTUAL</option>
<option value="AUXILIAR OPERATIVO AUDITORIA MEDICA">AUXILIAR OPERATIVO AUDITORIA MEDICA</option>
<option value="COORDINADOR DE CANAL VIRTUAL">COORDINADOR DE CANAL VIRTUAL</option>
<option value="AUXILIAR OPERATIVO MESA DE VALIDACION">AUXILIAR OPERATIVO MESA DE VALIDACION</option>
<option value="ASESOR COMERCIAL SENIOR DE VENTA DIRECTA">ASESOR COMERCIAL SENIOR DE VENTA DIRECTA</option>
<option value="ABOGADO CORPORATIVO I">ABOGADO CORPORATIVO I</option>
<option value="GESTOR DE FORMACION">GESTOR DE FORMACION</option>
<option value="GERENTE REGIONAL BUCARAMANGA">GERENTE REGIONAL BUCARAMANGA</option>
<option value="GERENTE DE DESARROLLO">GERENTE DE DESARROLLO</option>
<option value="ENFERMERO AUDITOR JUNIOR DE APOYO">ENFERMERO AUDITOR JUNIOR DE APOYO</option>
<option value="ESPECIALISTA DE PLANEACION FINANCIERA">ESPECIALISTA DE PLANEACION FINANCIERA</option>
<option value="ANALISTA FUNCIONAL DE EXPERIENCIA">ANALISTA FUNCIONAL DE EXPERIENCIA</option>
<option value="DIRECTOR DE SOLUCIONES ESTRUCTURALES">DIRECTOR DE SOLUCIONES ESTRUCTURALES</option>
<option value="GERENTE REGIONAL CALI">GERENTE REGIONAL CALI</option>
<option value="LIDER DE SOLUCIONES">LIDER DE SOLUCIONES</option>
<option value="SECRETARIA PLANES ESPECIALES">SECRETARIA PLANES ESPECIALES</option>
<option value="DIRECTOR OPERATIVO DE SERVICIOS MEDICOS">DIRECTOR OPERATIVO DE SERVICIOS MEDICOS</option>
<option value="DIRECTOR DIGITAL Y MEDIOS">DIRECTOR DIGITAL Y MEDIOS</option>
<option value="DIRECTOR DE CARTERA Y RECAUDO MP">DIRECTOR DE CARTERA Y RECAUDO MP</option>
<option value="SUBGERENTE DE ASUNTOS REGULATORIOS">SUBGERENTE DE ASUNTOS REGULATORIOS</option>
<option value="LIDER DE SERVICIO TI">LIDER DE SERVICIO TI</option>
<option value="LIDER DE MONITOREO Y CONTROL DE TI">LIDER DE MONITOREO Y CONTROL DE TI</option>
<option value="GERENTE DE GESTION DEL CONOCIMIENTO, CULTURA Y CAMBIO">GERENTE DE GESTION DEL CONOCIMIENTO, CULTURA Y CAMBIO</option>
<option value="DIRECTOR PROYECTOS EN SALUD">DIRECTOR PROYECTOS EN SALUD</option>
<option value="DIRECTOR OPERATIVO DE CANAL TELEFONICO">DIRECTOR OPERATIVO DE CANAL TELEFONICO</option>
<option value="EJECUTIVO COMERCIAL MANTENIMIENTO JUNIOR I">EJECUTIVO COMERCIAL MANTENIMIENTO JUNIOR I</option>
<option value="GERENTE BUSINESS PARTNER REGIONALES Y AREAS TRANSVERSALES">GERENTE BUSINESS PARTNER REGIONALES Y AREAS TRANSVERSALES</option>
<option value="GERENTE REGIONAL CENTRO ORIENTE">GERENTE REGIONAL CENTRO ORIENTE</option>
<option value="GERENTE DE OPERACION DE CANALES">GERENTE DE OPERACION DE CANALES</option>
<option value="GESTOR DE CALIDAD COMERCIAL">GESTOR DE CALIDAD COMERCIAL</option>
<option value="SUPERVISOR DE SERVICIOS Y PROVEEDORES">SUPERVISOR DE SERVICIOS Y PROVEEDORES</option>
<option value="ESPECIALISTA EN SERVICIO">ESPECIALISTA EN SERVICIO</option>
<option value="AUXILIAR DE DEMANDA INDUCIDA">AUXILIAR DE DEMANDA INDUCIDA</option>
<option value="JEFE DE CAPACITACION COMERCIAL REGIONAL">JEFE DE CAPACITACION COMERCIAL REGIONAL</option>
<option value="ANALISTA DE SEGUIMIENTO">ANALISTA DE SEGUIMIENTO</option>
<option value="ANALISTA DE CARTERA MP">ANALISTA DE CARTERA MP</option>
<option value="ADMINISTRADOR DE PLATAFORMAS">ADMINISTRADOR DE PLATAFORMAS</option>
<option value="SECRETARIA PRESIDENCIA">SECRETARIA PRESIDENCIA</option>
<option value="GESTOR DE SERVICIOS TI IV">GESTOR DE SERVICIOS TI IV</option>
<option value="GESTOR MESA DE AYUDA A PRESTADORES">GESTOR MESA DE AYUDA A PRESTADORES</option>
<option value="COORDINADOR DE PROGRAMAS">COORDINADOR DE PROGRAMAS</option>
<option value="GESTOR OPERATIVO DE CANAL DIGITAL">GESTOR OPERATIVO DE CANAL DIGITAL</option>
<option value="LIDER DE PROCESOS OPERATIVOS I">LIDER DE PROCESOS OPERATIVOS I</option>
<option value="GERENTE DE GESTION MEXICO">GERENTE DE GESTION MEXICO</option>
<option value="GERENTE DE GESTION DE OPERACIONES">GERENTE DE GESTION DE OPERACIONES</option>
<option value="RECEPCIONISTA II">RECEPCIONISTA II</option>
<option value="SECRETARIA SERVICIOS MEDICOS">SECRETARIA SERVICIOS MEDICOS</option>
<option value="ANALISTA SENIOR DE CARTERA Y COBRANZAS">ANALISTA SENIOR DE CARTERA Y COBRANZAS</option>
<option value="SUBGERENTE CORPORATIVO DE TECNOLOGIA">SUBGERENTE CORPORATIVO DE TECNOLOGIA</option>
<option value="LIDER REGIONAL DE GESTION COMERCIAL">LIDER REGIONAL DE GESTION COMERCIAL</option>
<option value="COORDINADOR DE GESTION OPERATIVA">COORDINADOR DE GESTION OPERATIVA</option>
<option value="SUBGERENTE COMERCIAL REGIONAL CALI">SUBGERENTE COMERCIAL REGIONAL CALI</option>
<option value="SUBGERENTE DE CONTRALORIA DE CUENTAS MEDICAS">SUBGERENTE DE CONTRALORIA DE CUENTAS MEDICAS</option>
<option value="SUBGERENTE COMERCIAL CERREJON">SUBGERENTE COMERCIAL CERREJON</option>
<option value="ANALISTA DE FIDELIZACION Y MERCADEO">ANALISTA DE FIDELIZACION Y MERCADEO</option>
<option value="ANALISTA DE GESTION">ANALISTA DE GESTION</option>
<option value="GERENTE COMERCIAL FUERZA DE VENTAS INTERNA BTA">GERENTE COMERCIAL FUERZA DE VENTAS INTERNA BTA</option>
<option value="SUBGERENTE COMERCIAL REGIONAL CENTRO ORIENTE">SUBGERENTE COMERCIAL REGIONAL CENTRO ORIENTE</option>
<option value="COORDINADOR DE SERVICIOS DOMICILIARIOS">COORDINADOR DE SERVICIOS DOMICILIARIOS</option>
<option value="SUBGERENTE DE GESTION Y FIDELIZACION DE USUARIOS">SUBGERENTE DE GESTION Y FIDELIZACION DE USUARIOS</option>
<option value="DIRECTOR FINANCIERO PAISES">DIRECTOR FINANCIERO PAISES</option>
<option value="CONTENT MANAGER">CONTENT MANAGER</option>
<option value="SUBGERENTE SERVICIOS MEDICOS">SUBGERENTE SERVICIOS MEDICOS</option>
<option value="SECRETARIA MEDICA">SECRETARIA MEDICA</option>
<option value="DIRECTOR COMERCIAL DELEGADAS">DIRECTOR COMERCIAL DELEGADAS</option>
<option value="SECRETARIA OFICINA">SECRETARIA OFICINA</option>
<option value="ASESOR INTEGRAL COMERCIAL Y SERVICIOS MEDICOS">ASESOR INTEGRAL COMERCIAL Y SERVICIOS MEDICOS</option>
<option value="SUBGERENTE FINANCIERO NACIONAL">SUBGERENTE FINANCIERO NACIONAL</option>
<option value="SUBGERENTE DE PLANEACION Y CONTROL Y CONVENIOS Y TARIFAS">SUBGERENTE DE PLANEACION Y CONTROL Y CONVENIOS Y TARIFAS</option>
<option value="DIRECTOR DE PROYECTOS DE ACTUARIA">DIRECTOR DE PROYECTOS DE ACTUARIA</option>
<option value="DIRECTOR OFICINA DE PRENSA">DIRECTOR OFICINA DE PRENSA</option>
<option value="ASISTENTE GERENCIA COMERCIAL REG. BOGOTA">ASISTENTE GERENCIA COMERCIAL REG. BOGOTA</option>
<option value="DIRECTOR MEDICO NACIONAL">DIRECTOR MEDICO NACIONAL</option>
<option value="COORDINADOR DE ACCESO">COORDINADOR DE ACCESO</option>
<option value="JEFE CONTROL Y POLITICA CONTABLE">JEFE CONTROL Y POLITICA CONTABLE</option>
<option value="DIRECTOR DE GESTION">DIRECTOR DE GESTION</option>
<option value="SECRETARIA DE CONTABILIDAD">SECRETARIA DE CONTABILIDAD</option>
<option value="SUPERNUMERARIO CONTROL Y POLITICA CONTABLE">SUPERNUMERARIO CONTROL Y POLITICA CONTABLE</option>
<option value="GERENTE REGIONAL BARRANQUILLA">GERENTE REGIONAL BARRANQUILLA</option>
<option value="ASESOR DE SEGUIMIENTO">ASESOR DE SEGUIMIENTO</option>
<option value="GERENTE PLANEACION Y GESTION DE RED">GERENTE PLANEACION Y GESTION DE RED</option>
<option value="GERENTE REGIONAL MEDELLIN">GERENTE REGIONAL MEDELLIN</option>
<option value="GERENTE DE RIESGOS">GERENTE DE RIESGOS</option>
<option value="LIDER TECNICO I">LIDER TECNICO I</option>
<option value="LIDER DE MICROINFORMATICA">LIDER DE MICROINFORMATICA</option>
<option value="GERENTE GESTION DEL RIESGO">GERENTE GESTION DEL RIESGO</option>
<option value="GERENTE MEDICO REGIONAL BTA MEDICINA PREPAGADA">GERENTE MEDICO REGIONAL BTA MEDICINA PREPAGADA</option>
<option value="GESTOR DE SERVICIOS Y PROVEEDORES">GESTOR DE SERVICIOS Y PROVEEDORES</option>
<option value="ANALISTA DE GESTION JUNIOR">ANALISTA DE GESTION JUNIOR</option>
<option value="ASESOR DE SERVICIO SENIOR">ASESOR DE SERVICIO SENIOR</option>
<option value="ESPECIALISTA IMPUESTOS PAISES">ESPECIALISTA IMPUESTOS PAISES</option>
<option value="SUBDIRECTOR DE CARTERA Y AFILIACIONES">SUBDIRECTOR DE CARTERA Y AFILIACIONES</option>
<option value="LIDER IMPLEMENTACION">LIDER IMPLEMENTACION</option>
<option value="ANALISTA DE SERVICIO DESARROLLO HUMANO">ANALISTA DE SERVICIO DESARROLLO HUMANO</option>
<option value="COORDINADOR OPERATIVO DE SERVICIOS MEDICOS MP">COORDINADOR OPERATIVO DE SERVICIOS MEDICOS MP</option>
<option value="EJECUTIVO COMERCIAL MANTENIMIENTO REGIONAL CENTRO ORIENTE">EJECUTIVO COMERCIAL MANTENIMIENTO REGIONAL CENTRO ORIENTE</option>
<option value="DIRECTOR DE AUDITORIA">DIRECTOR DE AUDITORIA</option>
<option value="SUBGERENTE GESTION DE RED">SUBGERENTE GESTION DE RED</option>
<option value="ANALISTA TECNICO JUNIOR I">ANALISTA TECNICO JUNIOR I</option>
<option value="DIRECTOR DE ASEGURAMIENTO">DIRECTOR DE ASEGURAMIENTO</option>
<option value="COORDINADOR CONTRATACION MEDICA">COORDINADOR CONTRATACION MEDICA</option>
<option value="SUPERNUMERARIO AREA FINANCIERA">SUPERNUMERARIO AREA FINANCIERA</option>
<option value="CONSULTOR DE ARQUITECTURA TI">CONSULTOR DE ARQUITECTURA TI</option>
<option value="GERENTE REGIONAL BOGOTA">GERENTE REGIONAL BOGOTA</option>
<option value="GESTOR DE ENFERMERIA EMPRESA">GESTOR DE ENFERMERIA EMPRESA</option>
<option value="ASESOR OPERATIVO JUNIOR">ASESOR OPERATIVO JUNIOR</option>
<option value="VICEPRESIDENTE EJECUTIVA MEDICINA PREPAGADA">VICEPRESIDENTE EJECUTIVA MEDICINA PREPAGADA</option>
<option value="PRESIDENTE ASEGURAMIENTO PREMIUM">PRESIDENTE ASEGURAMIENTO PREMIUM</option>
<option value="AUXILIAR DE SERVICIO">AUXILIAR DE SERVICIO</option>
<option value="ANALISTA DE GESTION DOCUMENTAL">ANALISTA DE GESTION DOCUMENTAL</option>
<option value="ANALISTA DIGITAL">ANALISTA DIGITAL</option>
<option value="ANALISTA DE IMPUESTOS I">ANALISTA DE IMPUESTOS I</option>
<option value="LIDER ADMINISTRATIVO EN SALUD">LIDER ADMINISTRATIVO EN SALUD</option>
<option value="DIRECTOR DE ANALISIS FINANCIERO">DIRECTOR DE ANALISIS FINANCIERO</option>
<option value="PENSIONADO">PENSIONADO</option>
<option value="DIRECTOR ADMINISTRATIVO PRESIDENCIA DE SALUD">DIRECTOR ADMINISTRATIVO PRESIDENCIA DE SALUD</option>
<option value="ABOGADO I">ABOGADO I</option>
<option value="GESTOR OPERATIVO CENTROS MEDICOS">GESTOR OPERATIVO CENTROS MEDICOS</option>
<option value="ANALISTA DE CALIDAD SENIOR">ANALISTA DE CALIDAD SENIOR</option>
<option value="SECRETARIA GERENCIA FINANCIERA">SECRETARIA GERENCIA FINANCIERA</option>
<option value="AUXILIAR DE INFORMACION">AUXILIAR DE INFORMACION</option>
<option value="DIRECTOR DE SERVICIO Y GESTION COMERCIAL">DIRECTOR DE SERVICIO Y GESTION COMERCIAL</option>
<option value="GERENTE RED DE PRESTADORES">GERENTE RED DE PRESTADORES</option>
<option value="DIRECTOR CUENTAS POR PAGAR">DIRECTOR CUENTAS POR PAGAR</option>
<option value="GERENTE GESTION COMERCIAL NACIONAL">GERENTE GESTION COMERCIAL NACIONAL</option>
<option value="PROFESIONAL EN SALUD AREA DE MEDICAMENTOS">PROFESIONAL EN SALUD AREA DE MEDICAMENTOS</option>
<option value="SUBGERENTE DE PROYECTOS ESPECIALES EN SALUD">SUBGERENTE DE PROYECTOS ESPECIALES EN SALUD</option>
<option value="ASESOR PAI">ASESOR PAI</option>
<option value="DIRECTOR CENTRAL SERVICIOS DE SALUD">DIRECTOR CENTRAL SERVICIOS DE SALUD</option>
<option value="DIRECTOR DE GESTION DE SERVICIO">DIRECTOR DE GESTION DE SERVICIO</option>
<option value="ANALISTA JUNIOR DE MARKETING">ANALISTA JUNIOR DE MARKETING</option>
<option value="SUBDIRECTOR DE AFILIACIONES">SUBDIRECTOR DE AFILIACIONES</option>
<option value="TECNICO DE COMUNICACIONES">TECNICO DE COMUNICACIONES</option>
<option value="ANALISTA DE FORMACION">ANALISTA DE FORMACION</option>
<option value="AUXILIAR DE SERVICIO Y ADMINISTRATIVO">AUXILIAR DE SERVICIO Y ADMINISTRATIVO</option>
<option value="GERENTE ADMINISTRATIVO">GERENTE ADMINISTRATIVO</option>
<option value="COORDINADOR DE PLANEACION Y CONTROL">COORDINADOR DE PLANEACION Y CONTROL</option>
<option value="ANALISTA DE CONSOLIDACION">ANALISTA DE CONSOLIDACION</option>
<option value="PRACTICANTE COMUNICACIONES INTERNAS">PRACTICANTE COMUNICACIONES INTERNAS</option>
<option value="ABOGADO LABORAL II">ABOGADO LABORAL II</option>
<option value="ASESOR EN SALUD MEDICINA PREPAGADA">ASESOR EN SALUD MEDICINA PREPAGADA</option>
<option value="SUBGERENTE COMERCIAL REGIONAL BUCARAMANGA">SUBGERENTE COMERCIAL REGIONAL BUCARAMANGA</option>
<option value="LIDER PLANES ESPECIALES ODONTOLOGIA">LIDER PLANES ESPECIALES ODONTOLOGIA</option>
<option value="JEFE DE SEGURIDAD REGIONAL BARRANQUILLA">JEFE DE SEGURIDAD REGIONAL BARRANQUILLA</option>
<option value="DIRECTOR GENERAL CENTROS MEDICOS">DIRECTOR GENERAL CENTROS MEDICOS</option>
<option value="VICEPRESIDENTE DE COMPRAS">VICEPRESIDENTE DE COMPRAS</option>
<option value="DIRECTOR DE ASEGURAMIENTO DE OPERACION">DIRECTOR DE ASEGURAMIENTO DE OPERACION</option>
<option value="DIRECTOR PLANES MODULARES">DIRECTOR PLANES MODULARES</option>
<option value="ANALISTA DE GESTION DE PORTAFOLIO">ANALISTA DE GESTION DE PORTAFOLIO</option>
<option value="AUXILIAR DE CARTERA Y COBRANZAS I">AUXILIAR DE CARTERA Y COBRANZAS I</option>
<option value="AUXILIAR ASISTENCIAL DE INFORMACION">AUXILIAR ASISTENCIAL DE INFORMACION</option>
<option value="DIRECTOR DE SERVICIO">DIRECTOR DE SERVICIO</option>
<option value="DIRECTOR CORPORATIVO CONTROL DE PROYECTOS">DIRECTOR CORPORATIVO CONTROL DE PROYECTOS</option>
<option value="GESTOR FORMACION PRESTADORES">GESTOR FORMACION PRESTADORES</option>
<option value="GERENTE COMERCIAL FUERZA DE VENTAS EXTERNA BTA">GERENTE COMERCIAL FUERZA DE VENTAS EXTERNA BTA</option>
<option value="ANALISTA SENIOR DE RETENCION">ANALISTA SENIOR DE RETENCION</option>
<option value="SUBGERENTE OPERATIVO DE VINCULACION MP">SUBGERENTE OPERATIVO DE VINCULACION MP</option>
<option value="DIRECTOR DE INFORMACION Y GESTION">DIRECTOR DE INFORMACION Y GESTION</option>
<option value="PREPARADOR FISICO">PREPARADOR FISICO</option>
<option value="DIRECTOR DE ASEGURAMIENTO EN SALUD">DIRECTOR DE ASEGURAMIENTO EN SALUD</option>
<option value="DIRECTOR DE CALIDAD Y SERVICIO">DIRECTOR DE CALIDAD Y SERVICIO</option>
<option value="SUBGERENTE DE PLANES ESPECIALES">SUBGERENTE DE PLANES ESPECIALES</option>
<option value="GERENTE FINANCIERO KERALTY">GERENTE FINANCIERO KERALTY</option>
<option value="DIRECTOR DE MEDICAMENTOS Y TECNOLOGIA EN SALUD">DIRECTOR DE MEDICAMENTOS Y TECNOLOGIA EN SALUD</option>
<option value="GERENTE ANALITICA DE NEGOCIO">GERENTE ANALITICA DE NEGOCIO</option>
<option value="GERENTE CORPORATIVO DE ARQUITECTURA Y PROCESOS">GERENTE CORPORATIVO DE ARQUITECTURA Y PROCESOS</option>
<option value="DIRECTOR DE OPERACIONES TI">DIRECTOR DE OPERACIONES TI</option>
<option value="GERENTE SALUD Y SEGURIDAD EN EL TRABAJO">GERENTE SALUD Y SEGURIDAD EN EL TRABAJO</option>
<option value="GERENTE DE SERVICIOS Y EQUIPAMIENTO">GERENTE DE SERVICIOS Y EQUIPAMIENTO</option>
<option value="ANALISTA DE AFILIACIONES I">ANALISTA DE AFILIACIONES I</option>
<option value="DIRECTOR FINANCIERO COLOMBIA">DIRECTOR FINANCIERO COLOMBIA</option>
<option value="SUBGERENTE DE GESTION EN SALUD">SUBGERENTE DE GESTION EN SALUD</option>
<option value="DIRECTOR CREATIVO">DIRECTOR CREATIVO</option>
<option value="DIRECTOR CANAL VIRTUAL">DIRECTOR CANAL VIRTUAL</option>
<option value="ANALISTA DE PROYECTOS COMERCIALES SENIOR">ANALISTA DE PROYECTOS COMERCIALES SENIOR</option>
<option value="COORDINADOR DE RED">COORDINADOR DE RED</option>
<option value="LIDER FUNCIONAL DE INTEGRACION">LIDER FUNCIONAL DE INTEGRACION</option>
<option value="ADMINISTRADOR DEL SISTEMA TECNOLOGIA">ADMINISTRADOR DEL SISTEMA TECNOLOGIA</option>
<option value="ESPECIALISTA PRESTACION DEL SERVICIO MP">ESPECIALISTA PRESTACION DEL SERVICIO MP</option>
<option value="JEFE DE SEGURIDAD COMPLEJO SALITRE">JEFE DE SEGURIDAD COMPLEJO SALITRE</option>
<option value="COORDINADOR DE CARTERA Y RECAUDO">COORDINADOR DE CARTERA Y RECAUDO</option>
<option value="GESTOR DE AFILIACIONES Y CARTERA">GESTOR DE AFILIACIONES Y CARTERA</option>
<option value="ANALISTA ADMINISTRADOR DE CASOS">ANALISTA ADMINISTRADOR DE CASOS</option>
<option value="COORDINADOR DE RED DE PROVEEDORES">COORDINADOR DE RED DE PROVEEDORES</option>
<option value="DIRECTOR COMERCIAL OTROS RAMOS">DIRECTOR COMERCIAL OTROS RAMOS</option>
<option value="VICEPRESIDENTE EJECUTIVO SEGUROS COLSANITAS">VICEPRESIDENTE EJECUTIVO SEGUROS COLSANITAS</option>
<option value="LIDER DE PROCESOS Y MEJORA CONTINUA">LIDER DE PROCESOS Y MEJORA CONTINUA</option>
<option value="CONSULTOR COMERCIAL">CONSULTOR COMERCIAL</option>
<option value="DIRECTOR DE CANALES DE ATENCION">DIRECTOR DE CANALES DE ATENCION</option>
<option value="ESPECIALISTA DE PROVEEDORES">ESPECIALISTA DE PROVEEDORES</option>
<option value="ANALISTA DE CONTABILIDAD SEGUROS">ANALISTA DE CONTABILIDAD SEGUROS</option>
<option value="DIRECTOR DE AUDITORIA SEGUROS">DIRECTOR DE AUDITORIA SEGUROS</option>
<option value="OFICIAL DE CUMPLIMIENTO">OFICIAL DE CUMPLIMIENTO</option>
<option value="DIRECTOR MEDICO ARL">DIRECTOR MEDICO ARL</option>
<option value="ESPECIALISTA DE INDEMNIZACIONES DE SEGUROS DE PERSONAS">ESPECIALISTA DE INDEMNIZACIONES DE SEGUROS DE PERSONAS</option>
<option value="ASESOR PORTAFOLIO DE PREVENCION I">ASESOR PORTAFOLIO DE PREVENCION I</option>
<option value="ASESOR PORTAFOLIO DE PREVENCION">ASESOR PORTAFOLIO DE PREVENCION</option>
<option value="ASESOR INTEGRAL DE PREVENCION">ASESOR INTEGRAL DE PREVENCION</option>
<option value="AUXILIAR DE INDEMNIZACIONES">AUXILIAR DE INDEMNIZACIONES</option>
<option value="GERENTE FINANCIERO DE SEGUROS">GERENTE FINANCIERO DE SEGUROS</option>
<option value="LIDER SARLAFT">LIDER SARLAFT</option>
<option value="GERENTE COMERCIAL OTROS RAMOS">GERENTE COMERCIAL OTROS RAMOS</option>
<option value="DIRECTOR VIDA">DIRECTOR VIDA</option>
<option value="VICEPRESIDENTE COMERCIAL COMPA IA DE SEGUROS">VICEPRESIDENTE COMERCIAL COMPA IA DE SEGUROS</option>
<option value="ESPECIALISTA DE SUSCRIPCION DE RAMOS DE PERSONAS">ESPECIALISTA DE SUSCRIPCION DE RAMOS DE PERSONAS</option>
<option value="SUBGERENTE DE GESTION Y PROYECTOS">SUBGERENTE DE GESTION Y PROYECTOS</option>
<option value="WEB MASTER SENIOR">WEB MASTER SENIOR</option>
<option value="GESTOR DE EMISION">GESTOR DE EMISION</option>
<option value="COORDINADOR DE INDEMNIZACIONES">COORDINADOR DE INDEMNIZACIONES</option>
<option value="GERENTE DE ARL">GERENTE DE ARL</option>
<option value="DIRECTOR DE PREVENCION ARL">DIRECTOR DE PREVENCION ARL</option>
<option value="DIRECTOR OPERATIVO SEGUROS">DIRECTOR OPERATIVO SEGUROS</option>
<option value="GESTOR DE PRESTACIONES">GESTOR DE PRESTACIONES</option>
<option value="ASESOR INTEGRAL DE REHABILITACION">ASESOR INTEGRAL DE REHABILITACION</option>
<option value="COORDINADOR DE MEDICINA LABORAL">COORDINADOR DE MEDICINA LABORAL</option>
<option value="DIRECTOR DE PRODUCTO ARL">DIRECTOR DE PRODUCTO ARL</option>
<option value="GERENTE DE SEGUROS DE PERSONAS">GERENTE DE SEGUROS DE PERSONAS</option>
<option value="ANALISTA GESTION DE CONVENIOS">ANALISTA GESTION DE CONVENIOS</option>
<option value="DIRECTOR DE RIESGO SEGUROS">DIRECTOR DE RIESGO SEGUROS</option>
<option value="ASESOR INTEGRAL DE PREVENCION INGENIERO">ASESOR INTEGRAL DE PREVENCION INGENIERO</option>
<option value="ANALISTA DE PRESTACIONES ECONOMICAS">ANALISTA DE PRESTACIONES ECONOMICAS</option>
<option value="SUBGERENTE COMERCIAL OTROS RAMOS">SUBGERENTE COMERCIAL OTROS RAMOS</option>
<option value="ANALISTA DE REASEGUROS">ANALISTA DE REASEGUROS</option>
<option value="ANALISTA DE INDEMNIZACIONES DE SEGUROS DE PERSONAS">ANALISTA DE INDEMNIZACIONES DE SEGUROS DE PERSONAS</option>
<option value="SECRETARIA VICEPRESIDENCIA I">SECRETARIA VICEPRESIDENCIA I</option>
<option value="DIRECTOR COMERCIAL SEGUROS MASIVOS">DIRECTOR COMERCIAL SEGUROS MASIVOS</option>
<option value="ASESOR COMERCIAL ARL">ASESOR COMERCIAL ARL</option>
<option value="ADMINISTRADOR">ADMINISTRADOR</option>
<option value="AUXILIAR SERVICIOS GENERALES">AUXILIAR SERVICIOS GENERALES</option>
<option value="ESTILISTA">ESTILISTA</option>
<option value="PRACTICANTE EDITORIAL">PRACTICANTE EDITORIAL</option>
<option value="EDITOR">EDITOR</option>
<option value="PRACTICANTE REVISTA">PRACTICANTE REVISTA</option>
<option value="REDACTOR I">REDACTOR I</option>
<option value="REDACTOR">REDACTOR</option>
<option value="ESPECIALISTA CREATIVO Y DIGITAL">ESPECIALISTA CREATIVO Y DIGITAL</option>
<option value="DIRECTOR EDITORIAL BIENESTAR">DIRECTOR EDITORIAL BIENESTAR</option>
<option value="PROFESIONAL MANEJO DE COHORTES">PROFESIONAL MANEJO DE COHORTES</option>
<option value="AUXILIAR EXPEDICION DE VOLANTES">AUXILIAR EXPEDICION DE VOLANTES</option>
<option value="ESPECIALISTA COHORTE DE RIESGO">ESPECIALISTA COHORTE DE RIESGO</option>
<option value="ANALISTA IMPLEMENTACION">ANALISTA IMPLEMENTACION</option>
<option value="AUXILIAR PRESTACIONES ECONOMICAS">AUXILIAR PRESTACIONES ECONOMICAS</option>
<option value="EJECUTIVO COMERCIAL EPS">EJECUTIVO COMERCIAL EPS</option>
<option value="ENFERMERO JEFE DE ALTO COSTO">ENFERMERO JEFE DE ALTO COSTO</option>
<option value="EJECUTIVO MULTIPRODUCTO">EJECUTIVO MULTIPRODUCTO</option>
<option value="GESTOR OPERATIVO JUNIOR DE APOYO">GESTOR OPERATIVO JUNIOR DE APOYO</option>
<option value="DINAMIZADOR EN SALUD">DINAMIZADOR EN SALUD</option>
<option value="DEPENDIENTE JUDICIAL I">DEPENDIENTE JUDICIAL I</option>
<option value="MEDICO GENERAL TELEORIENTACION">MEDICO GENERAL TELEORIENTACION</option>
<option value="GESTOR DE AUTOMATIZACION">GESTOR DE AUTOMATIZACION</option>
<option value="SUPERVISOR MEDICINA LABORAL">SUPERVISOR MEDICINA LABORAL</option>
<option value="AUXILIAR DE GESTION DE REFERENCIA Y CONTRAREFERENCIA">AUXILIAR DE GESTION DE REFERENCIA Y CONTRAREFERENCIA</option>
<option value="ANALISTA DE RECOBRO">ANALISTA DE RECOBRO</option>
<option value="COORDINADOR REGIONAL ENTES TERRITORIALES">COORDINADOR REGIONAL ENTES TERRITORIALES</option>
<option value="GERENTE DE GESTION REGIONALES Y MODELO COMUNITARIO">GERENTE DE GESTION REGIONALES Y MODELO COMUNITARIO</option>
<option value="DIRECTOR NACIONAL ASEGURAMIENTO RED">DIRECTOR NACIONAL ASEGURAMIENTO RED</option>
<option value="AUXILIAR DE RADICACION DE REFERENCIA Y CONTRAREFERENCIA">AUXILIAR DE RADICACION DE REFERENCIA Y CONTRAREFERENCIA</option>
<option value="PROFESIONAL SEGUIMIENTO A COHORTES">PROFESIONAL SEGUIMIENTO A COHORTES</option>
<option value="ANALISTA DE GESTION EN SALUD">ANALISTA DE GESTION EN SALUD</option>
<option value="COORDINADOR COMERCIAL MULTIPRODUCTO">COORDINADOR COMERCIAL MULTIPRODUCTO</option>
<option value="ASESOR DE GESTION INTEGRAL DE APOYO">ASESOR DE GESTION INTEGRAL DE APOYO</option>
<option value="SUPERVISOR DE ASIGNACION DE REFERENCIA Y CONTRAREFERENCIA">SUPERVISOR DE ASIGNACION DE REFERENCIA Y CONTRAREFERENCIA</option>
<option value="AUXILIAR OPERATIVO CONTRALORIA CUENTAS MEDICAS">AUXILIAR OPERATIVO CONTRALORIA CUENTAS MEDICAS</option>
<option value="AUXILIAR DE RADICACION">AUXILIAR DE RADICACION</option>
<option value="GESTOR CANAL DE PRESTADORES">GESTOR CANAL DE PRESTADORES</option>
<option value="COORDINADOR DE SERVICIO">COORDINADOR DE SERVICIO</option>
<option value="SECRETARIA SUBGERENCIA SALUD REGIONAL BOGOTA">SECRETARIA SUBGERENCIA SALUD REGIONAL BOGOTA</option>
<option value="ABOGADO TUTELAS III">ABOGADO TUTELAS III</option>
<option value="AUXILIAR OPERATIVO III">AUXILIAR OPERATIVO III</option>
<option value="GERENTE DE RED DE PRESTACION">GERENTE DE RED DE PRESTACION</option>
<option value="ANALISTA DE SOPORTE SENIOR I">ANALISTA DE SOPORTE SENIOR I</option>
<option value="COORDINADOR CANAL SERVICIO A PRESTADORES">COORDINADOR CANAL SERVICIO A PRESTADORES</option>
<option value="CIENTIFICO DE DATOS JUNIOR">CIENTIFICO DE DATOS JUNIOR</option>
<option value="MEDICO ESPECIALISTA FAMILIAR DE APOYO">MEDICO ESPECIALISTA FAMILIAR DE APOYO</option>
<option value="ASESOR INTEGRAL DE SERVICIOS MEDICOS II">ASESOR INTEGRAL DE SERVICIOS MEDICOS II</option>
<option value="DIRECTOR DE VALOR EN SALUD">DIRECTOR DE VALOR EN SALUD</option>
<option value="MEDICO GENERAL DE GESTION FARMACOLOGICA">MEDICO GENERAL DE GESTION FARMACOLOGICA</option>
<option value="EJECUTIVO COMERCIAL PAC-POS">EJECUTIVO COMERCIAL PAC-POS</option>
<option value="CONSULTOR DE TECNOLOGIA JUNIOR">CONSULTOR DE TECNOLOGIA JUNIOR</option>
<option value="AUXILIAR DE GESTION EMPRESA">AUXILIAR DE GESTION EMPRESA</option>
<option value="ASESOR MEDICO ATENCION PRIMARIA">ASESOR MEDICO ATENCION PRIMARIA</option>
<option value="SUBGERENTE DE ATENCION AMBULATORIA">SUBGERENTE DE ATENCION AMBULATORIA</option>
<option value="GERENTE MEDICO PLANES ESPECIALES">GERENTE MEDICO PLANES ESPECIALES</option>
<option value="ANALISTA DE PLANEACION Y CONTROL SENIOR">ANALISTA DE PLANEACION Y CONTROL SENIOR</option>
<option value="ANALISTA SENIOR DEFENSORIA DEL USUARIO">ANALISTA SENIOR DEFENSORIA DEL USUARIO</option>
<option value="COORDINADOR GESTION DE LA DEMANDA">COORDINADOR GESTION DE LA DEMANDA</option>
<option value="ASESOR MEDICO JURIDICO">ASESOR MEDICO JURIDICO</option>
<option value="AUXILIAR DE SALUD FAMILIAR">AUXILIAR DE SALUD FAMILIAR</option>
<option value="DIRECTOR COMERCIAL PRODUCTOS VOLUNTARIOS">DIRECTOR COMERCIAL PRODUCTOS VOLUNTARIOS</option>
<option value="COORDINADOR GESTION DEL RIESGO">COORDINADOR GESTION DEL RIESGO</option>
<option value="LIDER DE PLANEACION">LIDER DE PLANEACION</option>
<option value="DIRECTOR DE EVALUACION DE PROGRAMAS">DIRECTOR DE EVALUACION DE PROGRAMAS</option>
<option value="EJECUTIVO POST VENTA EPS">EJECUTIVO POST VENTA EPS</option>
<option value="DIRECTOR COMERCIAL EPS">DIRECTOR COMERCIAL EPS</option>
<option value="ESPECIALISTA EN CULTURA Y CUIDADO DEL PACIENTE">ESPECIALISTA EN CULTURA Y CUIDADO DEL PACIENTE</option>
<option value="ANALISTA TECNICO SENIOR I GESTION DE LA INFORMACION">ANALISTA TECNICO SENIOR I GESTION DE LA INFORMACION</option>
<option value="ASESOR GESTION DE MEDICAMENTOS">ASESOR GESTION DE MEDICAMENTOS</option>
<option value="GERENTE VALOR EN SALUD">GERENTE VALOR EN SALUD</option>
<option value="DIRECTOR NACIONAL DE SEGURIDAD DEL PACIENTE">DIRECTOR NACIONAL DE SEGURIDAD DEL PACIENTE</option>
<option value="DIRECTOR DE INFORMACION">DIRECTOR DE INFORMACION</option>
<option value="GERENTE SENIOR ENCARGADO DE FINANZAS EPS">GERENTE SENIOR ENCARGADO DE FINANZAS EPS</option>
<option value="DIRECTOR DE GESTION NO PBS">DIRECTOR DE GESTION NO PBS</option>
<option value="SUBGERENTE REGIONAL CENTRO">SUBGERENTE REGIONAL CENTRO</option>
<option value="SUBGERENTE COMERCIAL EPS">SUBGERENTE COMERCIAL EPS</option>
<option value="SUBGERENTE DE GESTION CLINICA">SUBGERENTE DE GESTION CLINICA</option>
<option value="MEDICO LICENCIAS MEDICAS">MEDICO LICENCIAS MEDICAS</option>
<option value="COORDINADOR RED NACIONAL">COORDINADOR RED NACIONAL</option>
<option value="LIDER DESARROLLO BI">LIDER DESARROLLO BI</option>
<option value="ANALISTA SEGUIMIENTO TUTELAS">ANALISTA SEGUIMIENTO TUTELAS</option>
<option value="ESPECIALISTA DE CONTRATACION RED DE PRESTADORES">ESPECIALISTA DE CONTRATACION RED DE PRESTADORES</option>
<option value="COORDINADOR AUDITORIA CUENTAS MEDICAS">COORDINADOR AUDITORIA CUENTAS MEDICAS</option>
<option value="AGENTE INTERVENTOR">AGENTE INTERVENTOR</option>
<option value="CONSULTOR DE SOLUCIONES SENIOR">CONSULTOR DE SOLUCIONES SENIOR</option>
<option value="MEDICO ESPECIALISTA EN MEDICINA LABORAL">MEDICO ESPECIALISTA EN MEDICINA LABORAL</option>
<option value="AUXILIAR DE CONSULTA MEDICINA LABORAL">AUXILIAR DE CONSULTA MEDICINA LABORAL</option>
<option value="ANALISTA DE OPERACIONES">ANALISTA DE OPERACIONES</option>
<option value="ANALISTA DE APLICACIONES SERVICIOS MEDICOS">ANALISTA DE APLICACIONES SERVICIOS MEDICOS</option>
<option value="COORDINADOR COMERCIAL EPS">COORDINADOR COMERCIAL EPS</option>
<option value="ASESOR DE SALUD MENTAL">ASESOR DE SALUD MENTAL</option>
<option value="VICEPRESIDENTE DE RIESGO EN SALUD">VICEPRESIDENTE DE RIESGO EN SALUD</option>
<option value="GESTOR DE ESTADISTICA">GESTOR DE ESTADISTICA</option>
<option value="SECRETARIA EJECUTIVA PRESIDENCIA">SECRETARIA EJECUTIVA PRESIDENCIA</option>
<option value="AUXILIAR DE SERVICIO AL AFILIADO">AUXILIAR DE SERVICIO AL AFILIADO</option>
<option value="GESTOR ADMINISTRATIVO DE SERVICIO">GESTOR ADMINISTRATIVO DE SERVICIO</option>
<option value="COORDINADOR GRABACION DE CUENTAS">COORDINADOR GRABACION DE CUENTAS</option>
<option value="AUXILIAR DE MEDICINA LABORAL">AUXILIAR DE MEDICINA LABORAL</option>
<option value="AUXILIAR DE TUTELAS">AUXILIAR DE TUTELAS</option>
<option value="DIRECTOR DE AUTORIZACION NO POS">DIRECTOR DE AUTORIZACION NO POS</option>
<option value="LIDER DE SOLUCIONES SISTEMAS DE INFORMACION">LIDER DE SOLUCIONES SISTEMAS DE INFORMACION</option>
<option value="SUPERVISOR DE RECOBROS">SUPERVISOR DE RECOBROS</option>
<option value="ASESOR CENTRAL DE LLAMADAS SENIOR II">ASESOR CENTRAL DE LLAMADAS SENIOR II</option>
<option value="SUPERVISOR DE RECAUDO">SUPERVISOR DE RECAUDO</option>
<option value="GESTOR OPERATIVO DE CONVENIOS">GESTOR OPERATIVO DE CONVENIOS</option>
<option value="PROFESIONAL DE INFORMACION ENTES TERRITORIALES">PROFESIONAL DE INFORMACION ENTES TERRITORIALES</option>
<option value="DIRECTOR DE GESTION CON ENTES TERRITORIALES">DIRECTOR DE GESTION CON ENTES TERRITORIALES</option>
<option value="MEDICO ASESOR DE ASUNTOS JUDICIALES Y TUTELAS">MEDICO ASESOR DE ASUNTOS JUDICIALES Y TUTELAS</option>
<option value="GESTOR OPERATIVO SENIOR">GESTOR OPERATIVO SENIOR</option>
<option value="AUXILIAR DE RECOBRO I">AUXILIAR DE RECOBRO I</option>
<option value="GESTOR DE CAMPA A">GESTOR DE CAMPA A</option>
<option value="GERENTE GESTION DE LA DEMANDA">GERENTE GESTION DE LA DEMANDA</option>
<option value="COORDINADOR DE CANAL NO PRESENCIAL">COORDINADOR DE CANAL NO PRESENCIAL</option>
<option value="ANALISTA JUNIOR DE TESORERIA">ANALISTA JUNIOR DE TESORERIA</option>
<option value="GERENTE DE MEDICAMENTOS">GERENTE DE MEDICAMENTOS</option>
<option value="PROFESIONAL COHORTE DE RIESGO">PROFESIONAL COHORTE DE RIESGO</option>
<option value="MEDICO ESPECIALISTA PSIQUIATRA DE APOYO">MEDICO ESPECIALISTA PSIQUIATRA DE APOYO</option>
<option value="AUXILIAR DE CONVENIOS Y TARIFAS">AUXILIAR DE CONVENIOS Y TARIFAS</option>
<option value="SUPERVISOR COMUNITARIO Y SOCIAL REGIONAL">SUPERVISOR COMUNITARIO Y SOCIAL REGIONAL</option>
<option value="COORDINADOR NACIONAL DE REFERENCIA Y CONTRARREFERENCIA">COORDINADOR NACIONAL DE REFERENCIA Y CONTRARREFERENCIA</option>
<option value="MONITOR DE CALIDAD REFERENCIA Y CONTRAREFERENCIA">MONITOR DE CALIDAD REFERENCIA Y CONTRAREFERENCIA</option>
<option value="ESPECIALISTA ALTO COSTO">ESPECIALISTA ALTO COSTO</option>
<option value="COORDINADOR DE CONCILIACIONES">COORDINADOR DE CONCILIACIONES</option>
<option value="ASESOR CENTRAL DE LLAMADAS SENIOR I">ASESOR CENTRAL DE LLAMADAS SENIOR I</option>
<option value="AUXILIAR DE GESTION DE CARTERA">AUXILIAR DE GESTION DE CARTERA</option>
<option value="ANALISTA GESTION DE INFORMACION">ANALISTA GESTION DE INFORMACION</option>
<option value="GESTION DE CITAS INTRAHOSPITALARIAS">GESTION DE CITAS INTRAHOSPITALARIAS</option>
<option value="LIDER DE OPERACIONES">LIDER DE OPERACIONES</option>
<option value="ANALISTA ECONOMICO DE RIESGOS">ANALISTA ECONOMICO DE RIESGOS</option>
<option value="AUXILIAR DE RECOBRO II">AUXILIAR DE RECOBRO II</option>
<option value="LIDER MEDICO DE COHORTES CRITICAS">LIDER MEDICO DE COHORTES CRITICAS</option>
<option value="COORDINADOR CADENA DE SUMINISTROS">COORDINADOR CADENA DE SUMINISTROS</option>
<option value="ANALISTA COMUNITARIO">ANALISTA COMUNITARIO</option>
<option value="COORDINADOR DE MEDICAMENTOS">COORDINADOR DE MEDICAMENTOS</option>
<option value="GERENTE DE CONVENIOS">GERENTE DE CONVENIOS</option>
<option value="LIDER MEDICO DE COHORTES DE HEMOFILIA Y ARTRITIS">LIDER MEDICO DE COHORTES DE HEMOFILIA Y ARTRITIS</option>
<option value="AUXILIAR SERVICIOS MEDICOS">AUXILIAR SERVICIOS MEDICOS</option>
<option value="DIRECTOR DE HUMANIZACION">DIRECTOR DE HUMANIZACION</option>
<option value="ANALISTA OPERATIVO DE RIESGOS">ANALISTA OPERATIVO DE RIESGOS</option>
<option value="DIRECTOR DE PRODUCTO">DIRECTOR DE PRODUCTO</option>
<option value="LIDER ADMINISTRATIVO">LIDER ADMINISTRATIVO</option>
<option value="AUXILIAR VALIDACION DE DERECHOS">AUXILIAR VALIDACION DE DERECHOS</option>
<option value="PRESIDENTE EPS">PRESIDENTE EPS</option>
<option value="AUXILIAR DE CORRESPONDENCIA I">AUXILIAR DE CORRESPONDENCIA I</option>
<option value="ASESOR EN BIOETICA">ASESOR EN BIOETICA</option>
<option value="DIRECTOR EVALUACION DE TECNOLOGIAS Y TRANSFERENCIA DE CONOCIMIENTO">DIRECTOR EVALUACION DE TECNOLOGIAS Y TRANSFERENCIA DE CONOCIMIENTO</option>
<option value="VICEPRESIDENTE DE OPERACIONES EPS">VICEPRESIDENTE DE OPERACIONES EPS</option>
<option value="DIRECTOR DE COMPRAS DE SUMINISTROS">DIRECTOR DE COMPRAS DE SUMINISTROS</option>
<option value="SUBGERENTE REGIONAL EPS">SUBGERENTE REGIONAL EPS</option>
<option value="DIRECTOR DE EXPERIENCIA CANALES DE SERVICIO">DIRECTOR DE EXPERIENCIA CANALES DE SERVICIO</option>
<option value="COORDINADOR EVALUACION DE TECNOLOGIAS Y TRANSFERENCIA DE CONOCIMIENTO">COORDINADOR EVALUACION DE TECNOLOGIAS Y TRANSFERENCIA DE CONOCIMIENTO</option>
<option value="DIRECTOR NACIONAL DE HOSPITALIZACION BASICA">DIRECTOR NACIONAL DE HOSPITALIZACION BASICA</option>
<option value="DIRECTOR NACIONAL DE MODELOS DE CONTRATACION">DIRECTOR NACIONAL DE MODELOS DE CONTRATACION</option>
<option value="ANALISTA DE APLICACIONES SENIOR II">ANALISTA DE APLICACIONES SENIOR II</option>
<option value="ANALISTA DE VINCULACION">ANALISTA DE VINCULACION</option>
<option value="GERENTE DE GESTION NO PBS">GERENTE DE GESTION NO PBS</option>
<option value="DIRECTOR DE DISE O ORGANIZACIONAL">DIRECTOR DE DISE O ORGANIZACIONAL</option>
<option value="PROFESIONAL DE ALTO COSTO">PROFESIONAL DE ALTO COSTO</option>
<option value="ANALISTA OPERATIVO I">ANALISTA OPERATIVO I</option>
<option value="SUPERVISOR OPERATIVO DE REFERENCIA Y CONTRAREFERENCIA">SUPERVISOR OPERATIVO DE REFERENCIA Y CONTRAREFERENCIA</option>
<option value="COORDINADOR MOVILIDAD">COORDINADOR MOVILIDAD</option>
<option value="AUXILIAR DE COMPENSACION">AUXILIAR DE COMPENSACION</option>
<option value="SUBGERENTE DE PROGRAMAS DE CRONICIDAD">SUBGERENTE DE PROGRAMAS DE CRONICIDAD</option>
<option value="ABOGADO TUTELAS I">ABOGADO TUTELAS I</option>
<option value="LIDER DE EDUCACION Y ADHERENCIA">LIDER DE EDUCACION Y ADHERENCIA</option>
<option value="GERENTE ATENCION PRIMARIA EN SALUD">GERENTE ATENCION PRIMARIA EN SALUD</option>
<option value="DIRECTOR NACIONAL DE REFERENCIA">DIRECTOR NACIONAL DE REFERENCIA</option>
<option value="LIDER DE COMUNICACIONES">LIDER DE COMUNICACIONES</option>
<option value="ASESOR DE CUIDADO INTENSIVO ADULTO">ASESOR DE CUIDADO INTENSIVO ADULTO</option>
<option value="COORDINADOR NACIONAL DE ENFOQUE SOCIO COMUNITARIO">COORDINADOR NACIONAL DE ENFOQUE SOCIO COMUNITARIO</option>
<option value="SUBGERENTE DE GESTION CANCER Y ENFERMEDADES HUERFANAS">SUBGERENTE DE GESTION CANCER Y ENFERMEDADES HUERFANAS</option>
<option value="VICEPRESIDENTE EJECUTIVO">VICEPRESIDENTE EJECUTIVO</option>
<option value="COORDINADOR DE RECOBROS">COORDINADOR DE RECOBROS</option>
<option value="DIRECTOR DE GESTION COMUNITARIA">DIRECTOR DE GESTION COMUNITARIA</option>
<option value="DIRECTOR NACIONAL DE PRESTACION HOSPITALARIA">DIRECTOR NACIONAL DE PRESTACION HOSPITALARIA</option>
<option value="DIRECTOR DE COMPRAS DE MEDICAMENTOS">DIRECTOR DE COMPRAS DE MEDICAMENTOS</option>
<option value="GERENTE DE BUSINESS PARTNER ASEGURAMIENTO BASICO Y PUBLICO PRIVADO">GERENTE DE BUSINESS PARTNER ASEGURAMIENTO BASICO Y PUBLICO PRIVADO</option>
<option value="ASISTENTE PRESTACIONES ECONOMICAS">ASISTENTE PRESTACIONES ECONOMICAS</option>
<option value="ABOGADO ASUNTOS TRIBUTARIOS">ABOGADO ASUNTOS TRIBUTARIOS</option>
<option value="DIRECTOR DE GESTION Y EVALUACION CRITICA DE CUENTAS DE ALTO COSTO">DIRECTOR DE GESTION Y EVALUACION CRITICA DE CUENTAS DE ALTO COSTO</option>
<option value="GESTOR DE INFORMACION Y ANALITICA">GESTOR DE INFORMACION Y ANALITICA</option>
<option value="GERENTE DE ANALITICA Y GESTION DE LA INFORMACION">GERENTE DE ANALITICA Y GESTION DE LA INFORMACION</option>
<option value="AUXILIAR OPERATIVO ATEP">AUXILIAR OPERATIVO ATEP</option>
<option value="SUBGERENTE DE ALTO COSTO">SUBGERENTE DE ALTO COSTO</option>
<option value="ASESOR DE ATENCION AL USUARIO DE EPS">ASESOR DE ATENCION AL USUARIO DE EPS</option>
<option value="LIDER DE OPERACIONES EPS">LIDER DE OPERACIONES EPS</option>
<option value="ASESOR FINANCIERO">ASESOR FINANCIERO</option>
<option value="DIRECTOR DE ATENCION PRIMARIA">DIRECTOR DE ATENCION PRIMARIA</option>
<option value="COORDINADOR DE GESTION DE APORTES">COORDINADOR DE GESTION DE APORTES</option>
<option value="ASESOR CIENTIFICO ONCOLOGICO">ASESOR CIENTIFICO ONCOLOGICO</option>
<option value="ANALISTA DE MEDICAMENTOS SENIOR">ANALISTA DE MEDICAMENTOS SENIOR</option>
<option value="DIRECTOR MEDICO PLANES ESPECIALES">DIRECTOR MEDICO PLANES ESPECIALES</option>
<option value="ANALISTA DE ATENCION AL USUARIO">ANALISTA DE ATENCION AL USUARIO</option>
<option value="COORDINADOR NACIONAL DE OFICINAS">COORDINADOR NACIONAL DE OFICINAS</option>
<option value="ANALISTA DE COMPLIANCE I">ANALISTA DE COMPLIANCE I</option>
<option value="COORDINADOR REGIONAL PRESTACIONES ECONOMICAS">COORDINADOR REGIONAL PRESTACIONES ECONOMICAS</option>
<option value="VICEPRESIDENTE DE SALUD EPS">VICEPRESIDENTE DE SALUD EPS</option>
<option value="CONSULTOR DE PROYECTOS DE SERVICIO">CONSULTOR DE PROYECTOS DE SERVICIO</option>
<option value="COORDINADOR CONVENIOS Y TARIFAS EPS">COORDINADOR CONVENIOS Y TARIFAS EPS</option>
<option value="DIRECTOR GRABACION DE CUENTAS MEDICAS">DIRECTOR GRABACION DE CUENTAS MEDICAS</option>
<option value="ANALISTA DE TRASLADOS INTERCIUDADES">ANALISTA DE TRASLADOS INTERCIUDADES</option>
<option value="ESPECIALISTA PRESTACION DEL SERVICIO EPS">ESPECIALISTA PRESTACION DEL SERVICIO EPS</option>
<option value="GESTION DE TRASLADO DE REFERENCIA Y CONTRAREFERENCIA">GESTION DE TRASLADO DE REFERENCIA Y CONTRAREFERENCIA</option>
<option value="ANALISTA DE FIDELIZACION">ANALISTA DE FIDELIZACION</option>
<option value="GESTOR JURIDICO">GESTOR JURIDICO</option>
<option value="ANALISTA DE SERVICIO">ANALISTA DE SERVICIO</option>
<option value="GERENTE DE AUDITORIA">GERENTE DE AUDITORIA</option>
<option value="TECNICO DE COMUNICACIONES I">TECNICO DE COMUNICACIONES I</option>
<option value="ANALISTA SENIOR DE FORMACION VIRTUAL">ANALISTA SENIOR DE FORMACION VIRTUAL</option>
<option value="VICEPRESIDENTE DE CONTROL">VICEPRESIDENTE DE CONTROL</option>
<option value="EJECUTIVO DE ESTRATEGIAS COMERCIALES">EJECUTIVO DE ESTRATEGIAS COMERCIALES</option>
<option value="DIRECTOR MEDICINA LABORAL E INCAPACIDADES">DIRECTOR MEDICINA LABORAL E INCAPACIDADES</option>
<option value="DIRECTOR EVALUACION Y SEGUIMIENTO A RED">DIRECTOR EVALUACION Y SEGUIMIENTO A RED</option>
<option value="DIRECTOR NACIONAL DE ODONTOLOGIA">DIRECTOR NACIONAL DE ODONTOLOGIA</option>
<option value="ASESOR CENTRAL DE LLAMADAS JUNIOR I">ASESOR CENTRAL DE LLAMADAS JUNIOR I</option>
<option value="ANALISTA DE CONVENIOS Y TARIFAS I">ANALISTA DE CONVENIOS Y TARIFAS I</option>
<option value="COORDINADOR MEDICO UAP DE APOYO">COORDINADOR MEDICO UAP DE APOYO</option>
<option value="ADMINISTRADOR DIRECCIONAMIENTO OPORTUNIDAD CX">ADMINISTRADOR DIRECCIONAMIENTO OPORTUNIDAD CX</option>
<option value="DIRECTOR DE COMPRAS DE SERVICIOS OPERACIONALES">DIRECTOR DE COMPRAS DE SERVICIOS OPERACIONALES</option>
<option value="SUBDIRECTOR ADMINISTRATIVO">SUBDIRECTOR ADMINISTRATIVO</option>
<option value="GERENTE DE GESTION DEL RIESGO INDIVIDUAL EN SALUD">GERENTE DE GESTION DEL RIESGO INDIVIDUAL EN SALUD</option>
<option value="ANALISTA ESTADISTICA SERVICIOS MEDICOS">ANALISTA ESTADISTICA SERVICIOS MEDICOS</option>
<option value="MEDICO COORDINADOR DE REFERENCIA">MEDICO COORDINADOR DE REFERENCIA</option>
<option value="SUBGERENTE DE OPERACIONES EN SALUD">SUBGERENTE DE OPERACIONES EN SALUD</option>
<option value="SUBGERENTE DE OPERACIONES NO POS">SUBGERENTE DE OPERACIONES NO POS</option>
<option value="DIRECTOR DE POBLACIONES ESPECIALES">DIRECTOR DE POBLACIONES ESPECIALES</option>
<option value="DIRECTOR REGIONAL DE SERVICIOS MEDICOS">DIRECTOR REGIONAL DE SERVICIOS MEDICOS</option>
<option value="DIRECTOR MEDICO PROGRAMA ATENCION EXTRAMURAL">DIRECTOR MEDICO PROGRAMA ATENCION EXTRAMURAL</option>
<option value="SUPERNUMERARIO AUXILIAR EXPEDICION VOLANTES">SUPERNUMERARIO AUXILIAR EXPEDICION VOLANTES</option>
<option value="SUBGERENTE REGIONAL CENTRO ORIENTE">SUBGERENTE REGIONAL CENTRO ORIENTE</option>
<option value="LIDER DE GESTION DOCUMENTAL">LIDER DE GESTION DOCUMENTAL</option>
<option value="AUXILIAR OPERATIVO SERVICIO">AUXILIAR OPERATIVO SERVICIO</option>
<option value="DIRECTOR MEDICO NACIONAL DE CENTROS MEDICOS">DIRECTOR MEDICO NACIONAL DE CENTROS MEDICOS</option>
<option value="GERENTE DE SERVICIO">GERENTE DE SERVICIO</option>
<option value="DIRECTOR DE CANAL NO PRESENCIAL">DIRECTOR DE CANAL NO PRESENCIAL</option>
<option value="ASESOR INTEGRAL PLANES ESPECIALES">ASESOR INTEGRAL PLANES ESPECIALES</option>
<option value="DIRECTOR DE CANAL SERVICIO A PRESTADORES">DIRECTOR DE CANAL SERVICIO A PRESTADORES</option>
<option value="GESTOR DE SEGUIMIENTO">GESTOR DE SEGUIMIENTO</option>
<option value="GERENTE MEDICO REGIONAL BOGOTA EPS">GERENTE MEDICO REGIONAL BOGOTA EPS</option>
<option value="AUXILIAR DE ENFERMERIA DE ALTO COSTO">AUXILIAR DE ENFERMERIA DE ALTO COSTO</option>
<option value="ANALISTA DE GESTION EN SALUD I">ANALISTA DE GESTION EN SALUD I</option>
<option value="EJECUTIVO OPERATIVO DE INFORMACION Y AFILIACION">EJECUTIVO OPERATIVO DE INFORMACION Y AFILIACION</option>
<option value="GERENTE DE MEJORA">GERENTE DE MEJORA</option>
<option value="GESTOR OPERATIVO SALUD Y SEGURIDAD EN EL TRABAJO">GESTOR OPERATIVO SALUD Y SEGURIDAD EN EL TRABAJO</option>
<option value="ANALISTA DE OPERACIONES I">ANALISTA DE OPERACIONES I</option>
<option value="VICEPRESIDENTE DE RELACIONES INSTITUCIONALES">VICEPRESIDENTE DE RELACIONES INSTITUCIONALES</option>
<option value="GERENTE DE OPERACION DE CANALES EPS">GERENTE DE OPERACION DE CANALES EPS</option>
<option value="CONTRALOR MEDICO REGIONAL CENTRO ORIENTE">CONTRALOR MEDICO REGIONAL CENTRO ORIENTE</option>
<option value="COORDINADOR ADMINISTRATIVO REGIMEN SUBSIDIADO">COORDINADOR ADMINISTRATIVO REGIMEN SUBSIDIADO</option>
<option value="GESTOR DE INFORMACION DE APOYO">GESTOR DE INFORMACION DE APOYO</option>
<option value="ASESOR SENIOR SISTEMAS DE INFORMACION">ASESOR SENIOR SISTEMAS DE INFORMACION</option>
<option value="DIRECTOR MODELO">DIRECTOR MODELO</option>
<option value="COORDINADOR MEDICO TELEORIENTACION">COORDINADOR MEDICO TELEORIENTACION</option>
<option value="DIRECTOR NACIONAL DE CONTRATACION DE RED">DIRECTOR NACIONAL DE CONTRATACION DE RED</option>
<option value="ASESOR DE CUIDADO INTENSIVO NEONATAL">ASESOR DE CUIDADO INTENSIVO NEONATAL</option>
<option value="DIRECTOR COMERCIAL CANAL EXTERNO">DIRECTOR COMERCIAL CANAL EXTERNO</option>
<option value="DISTANCIADOR">DISTANCIADOR</option>
<option value="VICEPRESIDENTE ADMINISTRATIVO Y FINANCIERO DE EPS">VICEPRESIDENTE ADMINISTRATIVO Y FINANCIERO DE EPS</option>
<option value="AUXILIAR DE RECOBRO">AUXILIAR DE RECOBRO</option>
<option value="COORDINADOR OPERATIVO DE RED DE PRESTADORES">COORDINADOR OPERATIVO DE RED DE PRESTADORES</option>
<option value="INGENIERO DE DATOS">INGENIERO DE DATOS</option>
<option value="EJECUTIVO OPERATIVO POST-VENTA">EJECUTIVO OPERATIVO POST-VENTA</option>
<option value="PRESIDENTE GRUPO INTEGRAL DE SALUD EPS">PRESIDENTE GRUPO INTEGRAL DE SALUD EPS</option>
<option value="AUXILIAR GESTION DE OFERTA">AUXILIAR GESTION DE OFERTA</option>
<option value="COORDINADOR NACIONAL DE PRESTACIONES ECONOMICAS">COORDINADOR NACIONAL DE PRESTACIONES ECONOMICAS</option>
<option value="COORDINADOR DE SERVICIO ADMINISTRATIVO">COORDINADOR DE SERVICIO ADMINISTRATIVO</option>
<option value="AUXILIAR EXPEDICION DE VOLANTES DE APOYO">AUXILIAR EXPEDICION DE VOLANTES DE APOYO</option>
<option value="ESPECIALISTA SIAM BDUA">ESPECIALISTA SIAM BDUA</option>
<option value="AUXILIAR OPERATIVO COMERCIAL I">AUXILIAR OPERATIVO COMERCIAL I</option>
<option value="COORDINADOR DE PROYECTOS I">COORDINADOR DE PROYECTOS I</option>
<option value="COORDINADOR DE PROGRAMAS DE SALUD">COORDINADOR DE PROGRAMAS DE SALUD</option>
<option value="GERENTE PLANEACION DE ASEGURAMIENTO">GERENTE PLANEACION DE ASEGURAMIENTO</option>
<option value="SUBGERENTE PLANEACION FINANCIERA EPS">SUBGERENTE PLANEACION FINANCIERA EPS</option>
<option value="DIRECTOR DE PROCESOS I">DIRECTOR DE PROCESOS I</option>
<option value="ASESOR TECNICO CIENTIFICO">ASESOR TECNICO CIENTIFICO</option>
<option value="ASESOR LEGAL">ASESOR LEGAL</option>
<option value="COORDINADOR DE FIDELIZACION">COORDINADOR DE FIDELIZACION</option>
<option value="DIRECTOR PARTICIPACION CIUDADANA">DIRECTOR PARTICIPACION CIUDADANA</option>
<option value="DIRECTOR DE MODELO DE ATENCION">DIRECTOR DE MODELO DE ATENCION</option>
<option value="DIRECTOR MEDICO DE APOYO">DIRECTOR MEDICO DE APOYO</option>
<option value="LIDER DE GESTION DE INFORMACION REGIONALES">LIDER DE GESTION DE INFORMACION REGIONALES</option>
<option value="GESTOR OPERATIVO DE SERVICIOS MEDICOS">GESTOR OPERATIVO DE SERVICIOS MEDICOS</option>
<option value="ANALISTA DE INFORMACION CONVENIOS Y TARIFAS">ANALISTA DE INFORMACION CONVENIOS Y TARIFAS</option>
<option value="AUXILIAR OPERATIVO COMERCIAL">AUXILIAR OPERATIVO COMERCIAL</option>
<option value="ANALISTA DE CIUDADES COMPASIVAS">ANALISTA DE CIUDADES COMPASIVAS</option>
<option value="PROMOTOR COMUNITARIO">PROMOTOR COMUNITARIO</option>
<option value="ASISTENTE ADMINISTRATIVO Y FINANCIERO">ASISTENTE ADMINISTRATIVO Y FINANCIERO</option>
<option value="ANALISTA DE PROGRAMAS SOCIALES">ANALISTA DE PROGRAMAS SOCIALES</option>
<option value="ANALISTA DE REDES COMUNITARIAS">ANALISTA DE REDES COMUNITARIAS</option>
<option value="COORDINADOR DE GESTION">COORDINADOR DE GESTION</option>
<option value="DIRECTOR EJECUTIVO">DIRECTOR EJECUTIVO</option>
<option value="DIRECTOR PROGRAMA COMUNITARIO">DIRECTOR PROGRAMA COMUNITARIO</option>
<option value="DOCENTE DE POSTGRADO">DOCENTE DE POSTGRADO</option>
<option value="TUTOR CLINICO MEDICINA">TUTOR CLINICO MEDICINA</option>
<option value="INSTRUCTOR ASOCIADO">INSTRUCTOR ASOCIADO</option>
<option value="FACILITADOR">FACILITADOR</option>
<option value="LIDER INSTITUCIONAL DE AUTOEVALUACION">LIDER INSTITUCIONAL DE AUTOEVALUACION</option>
<option value="PROFESOR ELECTIVA BALONCESTO">PROFESOR ELECTIVA BALONCESTO</option>
<option value="EXPERTO EN PATOLOGIA">EXPERTO EN PATOLOGIA</option>
<option value="EXPERTO DE ANATOMIA">EXPERTO DE ANATOMIA</option>
<option value="GESTOR DE ESTUDIOS CLINICOS LABORATORIO">GESTOR DE ESTUDIOS CLINICOS LABORATORIO</option>
<option value="ANALISTA ADMINISTRATIVO INSTITUTO DE INVESTIGACION">ANALISTA ADMINISTRATIVO INSTITUTO DE INVESTIGACION</option>
<option value="INSTRUCTOR ASISTENTE">INSTRUCTOR ASISTENTE</option>
<option value="PROFESOR ASISTENTE">PROFESOR ASISTENTE</option>
<option value="DOCENTE FACILITADOR">DOCENTE FACILITADOR</option>
<option value="ANALISTA DE MARKETING UNIVERSIDAD">ANALISTA DE MARKETING UNIVERSIDAD</option>
<option value="GESTOR DE ESTUDIOS CLINICOS">GESTOR DE ESTUDIOS CLINICOS</option>
<option value="AUXILIAR DE ATENCION AL ESTUDIANTE">AUXILIAR DE ATENCION AL ESTUDIANTE</option>
<option value="AUXILIAR DE BIBLIOTECA JUNIOR">AUXILIAR DE BIBLIOTECA JUNIOR</option>
<option value="GESTOR SENIOR DE ESTUDIOS CLINICOS">GESTOR SENIOR DE ESTUDIOS CLINICOS</option>
<option value="COORDINADOR MEDICO DE INVESTIGACION CLINICA">COORDINADOR MEDICO DE INVESTIGACION CLINICA</option>
<option value="PROFESIONAL GESTION DOCUMENTAL">PROFESIONAL GESTION DOCUMENTAL</option>
<option value="DIRECTOR DE VINCULACION-SECTOR EXTERNO">DIRECTOR DE VINCULACION-SECTOR EXTERNO</option>
<option value="PROFESOR ASOCIADO">PROFESOR ASOCIADO</option>
<option value="EXPERTO">EXPERTO</option>
<option value="COORDINADOR DE DEPORTES">COORDINADOR DE DEPORTES</option>
<option value="AUXILIAR DE VINCULACION SECTOR EXTERNO">AUXILIAR DE VINCULACION SECTOR EXTERNO</option>
<option value="DOCENTE TALLER ARTE URBANO Y VISUALES">DOCENTE TALLER ARTE URBANO Y VISUALES</option>
<option value="EXPERTO EN SEMIOLOGIA">EXPERTO EN SEMIOLOGIA</option>
<option value="PROFESOR FORMACION EN SEGUNDA LENGUA">PROFESOR FORMACION EN SEGUNDA LENGUA</option>
<option value="INVESTIGADOR">INVESTIGADOR</option>
<option value="PROFESOR - LECTURA Y ESCRITURA">PROFESOR - LECTURA Y ESCRITURA</option>
<option value="EXPERTO EN CUIDADOS PALIATIVOS">EXPERTO EN CUIDADOS PALIATIVOS</option>
<option value="RECTOR">RECTOR</option>
<option value="FACILITADOR SIMULACIONES CLINICAS">FACILITADOR SIMULACIONES CLINICAS</option>
<option value="ANALISTA ESTUDIOS CLINICOS">ANALISTA ESTUDIOS CLINICOS</option>
<option value="GESTOR DE SALUD PUBLICA">GESTOR DE SALUD PUBLICA</option>
<option value="PROFESOR TITULAR">PROFESOR TITULAR</option>
<option value="PROFESOR DE MUSICA">PROFESOR DE MUSICA</option>
<option value="JOVEN INVESTIGADOR">JOVEN INVESTIGADOR</option>
<option value="DIRECTOR BIENESTAR">DIRECTOR BIENESTAR</option>
<option value="GESTOR DE POSTGRADOS">GESTOR DE POSTGRADOS</option>
<option value="EXPERTO EN BIOTECNOLOGIA">EXPERTO EN BIOTECNOLOGIA</option>
<option value="PROFESOR DANZAS">PROFESOR DANZAS</option>
<option value="EXPERTO EN INVESTIGACION">EXPERTO EN INVESTIGACION</option>
<option value="ARQUITECTO DE INFORMACION">ARQUITECTO DE INFORMACION</option>
<option value="EXPERTO EN MACROCURRICULO">EXPERTO EN MACROCURRICULO</option>
<option value="DECANO FACULTAD DE PSICOLOGIA">DECANO FACULTAD DE PSICOLOGIA</option>
<option value="ASISTENTE DE VICERRECTORIA">ASISTENTE DE VICERRECTORIA</option>
<option value="COORDINADOR EN SEGUNDA LENGUA">COORDINADOR EN SEGUNDA LENGUA</option>
<option value="AUXILIAR DE BIBLIOTECA">AUXILIAR DE BIBLIOTECA</option>
<option value="DIRECTOR DE POSTGRADOS">DIRECTOR DE POSTGRADOS</option>
<option value="AUXILIAR LOGISTICO">AUXILIAR LOGISTICO</option>
<option value="MEDICO DE ESTUDIOS CLINICOS">MEDICO DE ESTUDIOS CLINICOS</option>
<option value="AUXILIAR DE ESTUDIOS CLINICOS">AUXILIAR DE ESTUDIOS CLINICOS</option>
<option value="DOCENTE FACILITADOR FARMACOLOGIA">DOCENTE FACILITADOR FARMACOLOGIA</option>
<option value="ASESOR COMERCIAL PROGRAMAS ACADEMICOS">ASESOR COMERCIAL PROGRAMAS ACADEMICOS</option>
<option value="LIDER INSTITUCIONAL DE CALIDAD">LIDER INSTITUCIONAL DE CALIDAD</option>
<option value="PROFESOR ELECTIVA FUTBOL">PROFESOR ELECTIVA FUTBOL</option>
<option value="PROFESOR ELECTIVA VOLEIBALL">PROFESOR ELECTIVA VOLEIBALL</option>
<option value="AUXILIAR MANTENIMIENTO LABORATORIO">AUXILIAR MANTENIMIENTO LABORATORIO</option>
<option value="GESTOR DE GRADUADOS">GESTOR DE GRADUADOS</option>
<option value="GESTOR DE ENFERMERIA">GESTOR DE ENFERMERIA</option>
<option value="DISE ADOR DE MEDIOS EDUCATIVOS">DISE ADOR DE MEDIOS EDUCATIVOS</option>
<option value="GESTOR DE SALUD Y TRABAJO SOCIAL">GESTOR DE SALUD Y TRABAJO SOCIAL</option>
<option value="GESTOR DE PROYECTOS">GESTOR DE PROYECTOS</option>
<option value="LIDER DE ADMISIONES">LIDER DE ADMISIONES</option>
<option value="GESTOR SISTEMA DE INFORMACION I">GESTOR SISTEMA DE INFORMACION I</option>
<option value="GESTOR SISTEMA DE INFORMACION II">GESTOR SISTEMA DE INFORMACION II</option>
<option value="QUIMICO FARMACEUTICO DE ESTUDIOS CLINICO">QUIMICO FARMACEUTICO DE ESTUDIOS CLINICO</option>
<option value="DOCENTE LIDER DE AUTOEVALUACION Y CALIDAD - MEDICINA">DOCENTE LIDER DE AUTOEVALUACION Y CALIDAD - MEDICINA</option>
<option value="GESTOR DE EDUCACION CONTINUA Y PERMANENTE">GESTOR DE EDUCACION CONTINUA Y PERMANENTE</option>
<option value="PROFESOR DE PILATES">PROFESOR DE PILATES</option>
<option value="AUXILIAR LABORATORIO DE ANATOMIA">AUXILIAR LABORATORIO DE ANATOMIA</option>
<option value="COORDINADOR DE BIBLIOTECA">COORDINADOR DE BIBLIOTECA</option>
<option value="DIRECTOR DE PREGRADO">DIRECTOR DE PREGRADO</option>
<option value="EXPERTO ENFERMERIA COMUNITARIA">EXPERTO ENFERMERIA COMUNITARIA</option>
<option value="DIRECTOR UNIDAD DE INVESTIGACION">DIRECTOR UNIDAD DE INVESTIGACION</option>
<option value="PSICOLOGO BIENESTAR">PSICOLOGO BIENESTAR</option>
<option value="VICERRECTOR">VICERRECTOR</option>
<option value="COORDINADOR DE AUTOEVALUACION Y CALIDAD">COORDINADOR DE AUTOEVALUACION Y CALIDAD</option>
<option value="DECANO FACULTAD DE MEDICINA">DECANO FACULTAD DE MEDICINA</option>
<option value="ASESOR DE ATENCION AL ESTUDIANTE">ASESOR DE ATENCION AL ESTUDIANTE</option>
<option value="DIRECTOR DE ADMISION REGISTRO Y CONTROL">DIRECTOR DE ADMISION REGISTRO Y CONTROL</option>
<option value="GESTOR DE ADMISIONES">GESTOR DE ADMISIONES</option>
<option value="LIDER INSTITUCIONAL DE DOCENCIA">LIDER INSTITUCIONAL DE DOCENCIA</option>
<option value="ECONOMISTA EN SALUD">ECONOMISTA EN SALUD</option>
<option value="DIRECTOR DE ADMISIONES, REGISTRO, CONTROL ACADEMICO Y GRADUADOS">DIRECTOR DE ADMISIONES, REGISTRO, CONTROL ACADEMICO Y GRADUADOS</option>
<option value="LOGISTICA Y SERVICIO AL CLIENTE">LOGISTICA Y SERVICIO AL CLIENTE</option>
<option value="GESTOR DE INNOVACION">GESTOR DE INNOVACION</option>
<option value="COORDINADOR DE GESTION ADMINISTRATIVA">COORDINADOR DE GESTION ADMINISTRATIVA</option>
<option value="DOCENTE FACILITADOR EN MICROBIOLOGIA">DOCENTE FACILITADOR EN MICROBIOLOGIA</option>
<option value="ANALISTA DE PLANEACION ACADEMICA Y EVALUACION">ANALISTA DE PLANEACION ACADEMICA Y EVALUACION</option>
<option value="GESTOR DE ESTUDIOS CLINICOS EN FORMACION">GESTOR DE ESTUDIOS CLINICOS EN FORMACION</option>
<option value="PSICOLOGO BIENESTAR I">PSICOLOGO BIENESTAR I</option>
<option value="SECRETARIO GENERAL">SECRETARIO GENERAL</option>
<option value="DIRECTOR DE INSTITUTO DE SALUD Y GESTION SANITARIA">DIRECTOR DE INSTITUTO DE SALUD Y GESTION SANITARIA</option>
<option value="DIRECTOR DE SERVICIO Y GESTION DEL CAMBIO">DIRECTOR DE SERVICIO Y GESTION DEL CAMBIO</option>
<option value="EXPERTO DE FARMACOLOGIA">EXPERTO DE FARMACOLOGIA</option>
<option value="GESTOR DE PROYECCION SOCIAL">GESTOR DE PROYECCION SOCIAL</option>
<option value="DIRECTOR PREGRADO DE MEDICINA">DIRECTOR PREGRADO DE MEDICINA</option>
<option value="GESTOR DE PRACTICAS FORMATIVAS">GESTOR DE PRACTICAS FORMATIVAS</option>
<option value="LIDER DE TECNOLOGIA">LIDER DE TECNOLOGIA</option>
<option value="GESTOR DE POSTGRADOS I">GESTOR DE POSTGRADOS I</option>
<option value="COORDINADOR DE CONVENIO DOCENCIA SERVICIO E INTERNADO">COORDINADOR DE CONVENIO DOCENCIA SERVICIO E INTERNADO</option>
<option value="COORDINADOR PSICOLOGIA">COORDINADOR PSICOLOGIA</option>
<option value="PSICOLOGO CLINICO Y EDUCATIVO">PSICOLOGO CLINICO Y EDUCATIVO</option>
<option value="GESTOR DE PREGRADO">GESTOR DE PREGRADO</option>
<option value="DECANO FACULTAD DE ENFERMERIA">DECANO FACULTAD DE ENFERMERIA</option>
<option value="GESTOR REGULATORIO ESTUDIOS CLINICOS">GESTOR REGULATORIO ESTUDIOS CLINICOS</option>
<option value="PROCESS LEADER HAOU">PROCESS LEADER HAOU</option>
<option value="COORDINADOR DE GESTION DEL CONOCIMIENTO">COORDINADOR DE GESTION DEL CONOCIMIENTO</option>
<option value="ANALISTA SENIOR DE RESPONSABILIDAD">ANALISTA SENIOR DE RESPONSABILIDAD</option>
<option value="TECNICO SOPORTE SENIOR USA">TECNICO SOPORTE SENIOR USA</option>
<option value="SUBGERENTE DE COMPENSACION Y DISE O ORGANIZACIONAL">SUBGERENTE DE COMPENSACION Y DISE O ORGANIZACIONAL</option>
<option value="MEDICO ESPECIALISTA HEALTH ANALYSIS AND OPTIMIZATION UNIT">MEDICO ESPECIALISTA HEALTH ANALYSIS AND OPTIMIZATION UNIT</option>
<option value="DIRECTOR DE MARKETING MEXICO">DIRECTOR DE MARKETING MEXICO</option>
<option value="PROFESIONAL DE CAPACITACION Y DESARROLLO PAISES">PROFESIONAL DE CAPACITACION Y DESARROLLO PAISES</option>
<option value="LIDER DE COMPRAS PAISES">LIDER DE COMPRAS PAISES</option>
<option value="ANALISTA DE DATOS SENIOR USA">ANALISTA DE DATOS SENIOR USA</option>
<option value="ANALISTA DE PRESUPUESTO USA">ANALISTA DE PRESUPUESTO USA</option>
<option value="ANALISTA DE RIESGOS USA">ANALISTA DE RIESGOS USA</option>
<option value="ANALISTA DE SUSCRIPCION DE COTIZACIONES">ANALISTA DE SUSCRIPCION DE COTIZACIONES</option>
<option value="LIDER GESTION TRIBUTARIA PAISES">LIDER GESTION TRIBUTARIA PAISES</option>
<option value="LIDER DE CONTABILIDAD PAISES">LIDER DE CONTABILIDAD PAISES</option>
<option value="ESPECIALISTA DE COMUNICACIONES INTERNAS PAISES">ESPECIALISTA DE COMUNICACIONES INTERNAS PAISES</option>
<option value="VICEPRESIDENTE ECONOMICO FINANCIERO SENIOR">VICEPRESIDENTE ECONOMICO FINANCIERO SENIOR</option>
<option value="SUBGERENTE DE SOPORTE">SUBGERENTE DE SOPORTE</option>
<option value="DIRECTOR DE PROYECTOS">DIRECTOR DE PROYECTOS</option>
<option value="PROFESIONAL DE ANALITICA DESARROLLO HUMANO">PROFESIONAL DE ANALITICA DESARROLLO HUMANO</option>
<option value="VICEPRESIDENTE DE INFRAESTRUCTURA FISICA">VICEPRESIDENTE DE INFRAESTRUCTURA FISICA</option>
<option value="DIRECTOR FINANCIERO DE SERVICIOS COMPARTIDOS USA">DIRECTOR FINANCIERO DE SERVICIOS COMPARTIDOS USA</option>
<option value="GERENTE DE ACTUARIA">GERENTE DE ACTUARIA</option>
<option value="COORDINADOR DE CUENTAS POR PAGAR USA">COORDINADOR DE CUENTAS POR PAGAR USA</option>
<option value="LIDER DE PRODUCTO">LIDER DE PRODUCTO</option>
<option value="ANALISTA DE REPORTES">ANALISTA DE REPORTES</option>
<option value="INVESTIGADOR PROYECTO SAFE I">INVESTIGADOR PROYECTO SAFE I</option>
<option value="VICEPRESIDENTE DE OPERACIONES Y GESTION SANITARIA">VICEPRESIDENTE DE OPERACIONES Y GESTION SANITARIA</option>
<option value="COORDINADOR DE PROYECTOS ESPECIALES">COORDINADOR DE PROYECTOS ESPECIALES</option>
<option value="GERENTE ECONOMICO Y FINANCIERO PAISES">GERENTE ECONOMICO Y FINANCIERO PAISES</option>
<option value="ESPECIALISTA DESARROLLO CORPORATIVO USA">ESPECIALISTA DESARROLLO CORPORATIVO USA</option>
<option value="ENFERMERA DE GESTION HISTORIA CLINICA">ENFERMERA DE GESTION HISTORIA CLINICA</option>
<option value="GERENTE DE DESARROLLO DE NEGOCIO">GERENTE DE DESARROLLO DE NEGOCIO</option>
<option value="VICEPRESIDENTE DESARROLLO HUMANO KERALTY">VICEPRESIDENTE DESARROLLO HUMANO KERALTY</option>
<option value="GERENTE GENERAL PERU">GERENTE GENERAL PERU</option>
<option value="ESPECIALISTA DE INFRAESTRUCTURA REDES Y COMUNICACIONES">ESPECIALISTA DE INFRAESTRUCTURA REDES Y COMUNICACIONES</option>
<option value="GERENTE DE CONTABILIDAD">GERENTE DE CONTABILIDAD</option>
<option value="GERENTE INTERNACIONAL DE INFRAESTRUCTURA">GERENTE INTERNACIONAL DE INFRAESTRUCTURA</option>
<option value="SUBGERENTE DE ECONOMIA Y FINANZAS">SUBGERENTE DE ECONOMIA Y FINANZAS</option>
<option value="GLOBAL CHIEF INFORMATION OFFICER">GLOBAL CHIEF INFORMATION OFFICER</option>
<option value="GERENTE CENTRAL DE IMPUESTOS">GERENTE CENTRAL DE IMPUESTOS</option>
<option value="GERENTE DE CONTRALORIA INTERNA GLOBAL">GERENTE DE CONTRALORIA INTERNA GLOBAL</option>
<option value="GERENTE DE DESAROLLO HUMANO PAISES">GERENTE DE DESAROLLO HUMANO PAISES</option>
<option value="COMMUNICATION CHANNELS MANAGER">COMMUNICATION CHANNELS MANAGER</option>
<option value="GERENTE KERALTY">GERENTE KERALTY</option>
<option value="VICEPRESIDENTE DE GESTION CLINICA">VICEPRESIDENTE DE GESTION CLINICA</option>
<option value="ANALISTA ADMINISTRATIVO USA">ANALISTA ADMINISTRATIVO USA</option>
<option value="CONSULTOR APIGEE USA">CONSULTOR APIGEE USA</option>
<option value="DIRECTOR DE IMPLEMENTACIONES DE DATOS Y ANALITICA">DIRECTOR DE IMPLEMENTACIONES DE DATOS Y ANALITICA</option>
<option value="GERENTE DE RIESGOS EEUU">GERENTE DE RIESGOS EEUU</option>
<option value="LIDER DE COMPENSACION PAISES">LIDER DE COMPENSACION PAISES</option>
<option value="SUBGERENTE DE COMPENSACION">SUBGERENTE DE COMPENSACION</option>
<option value="GERENTE DE SALUD PERU">GERENTE DE SALUD PERU</option>
<option value="DIRECTOR PLANEACION FISCAL">DIRECTOR PLANEACION FISCAL</option>
<option value="ARQUITECTO DE TI USA">ARQUITECTO DE TI USA</option>
<option value="NATIONAL CLINICAL QUALITY MANAGER">NATIONAL CLINICAL QUALITY MANAGER</option>
<option value="CONSULTOR MASTER DATA MANAGEMENT">CONSULTOR MASTER DATA MANAGEMENT</option>
<option value="GERENTE GESTI N SANITARIA">GERENTE GESTI N SANITARIA</option>
<option value="DIRECTOR DE COMPENSACION">DIRECTOR DE COMPENSACION</option>
<option value="ANALISTA DE CONTABILIDAD BILING E PAISES">ANALISTA DE CONTABILIDAD BILING E PAISES</option>
<option value="ANALISTA DE VIAJES USA">ANALISTA DE VIAJES USA</option>
<option value="GERENTE CORPORATIVO DE SEGURIDAD DE LA INFORMACION">GERENTE CORPORATIVO DE SEGURIDAD DE LA INFORMACION</option>
<option value="VICEPRESIDENTE DE GOBIERNO CORPORATIVO Y COMPLIANCE">VICEPRESIDENTE DE GOBIERNO CORPORATIVO Y COMPLIANCE</option>
<option value="ANALISTA DE TESORERIA USA">ANALISTA DE TESORERIA USA</option>
<option value="GERENTE CENTRAL DE SEGURIDAD">GERENTE CENTRAL DE SEGURIDAD</option>
<option value="ANALISTA DE CUENTAS POR PAGAR SANITAS USA">ANALISTA DE CUENTAS POR PAGAR SANITAS USA</option>
<option value="INVESTIGADOR PROYECTO SAFE">INVESTIGADOR PROYECTO SAFE</option>
<option value="ANALISTA DATA MASTER SENIOR">ANALISTA DATA MASTER SENIOR</option>
<option value="ANALISTA DE SOPORTE SENIOR">ANALISTA DE SOPORTE SENIOR</option>
<option value="VICEPRESIDENTE DE SISTEMAS DE INFORMACION">VICEPRESIDENTE DE SISTEMAS DE INFORMACION</option>
<option value="GERENTE CORPORATIVO DE SOLUCIONES EN SISTEMAS DE INFORMACION">GERENTE CORPORATIVO DE SOLUCIONES EN SISTEMAS DE INFORMACION</option>
<option value="PRESIDENTE GRUPO KERALTY COLOMBIA">PRESIDENTE GRUPO KERALTY COLOMBIA</option>
<option value="GERENTE DE PRESUPUESTO Y ANALISIS FINANCIERO">GERENTE DE PRESUPUESTO Y ANALISIS FINANCIERO</option>
<option value="GERENTE DE RELACIONES PUBLICAS">GERENTE DE RELACIONES PUBLICAS</option>
<option value="DIRECTOR PLAN DE CONTINUIDAD">DIRECTOR PLAN DE CONTINUIDAD</option>
<option value="PROFESIONAL POSTVENTA">PROFESIONAL POSTVENTA</option>
<option value="ANALISTA DATA MASTER">ANALISTA DATA MASTER</option>
<option value="ENFERMERA DE GESTION HISTORICA CLINICA">ENFERMERA DE GESTION HISTORICA CLINICA</option>
<option value="LIDER DE RIESGO">LIDER DE RIESGO</option>
<option value="ADMINISTRADOR DE APLICACIONES USA">ADMINISTRADOR DE APLICACIONES USA</option>
<option value="PROFESIONAL DE CULTURA Y GESTION DEL CAMBIO PAISES">PROFESIONAL DE CULTURA Y GESTION DEL CAMBIO PAISES</option>
<option value="AUDITOR DE SISTEMAS USA">AUDITOR DE SISTEMAS USA</option>
<option value="ADMINISTRADOR DE NUBE PUBLICA">ADMINISTRADOR DE NUBE PUBLICA</option>
<option value="ANALISTA SENIOR DE MARKETING USA">ANALISTA SENIOR DE MARKETING USA</option>
<option value="DIRECTOR PROGRAMA CUIDADORES Y ADULTO MAYOR">DIRECTOR PROGRAMA CUIDADORES Y ADULTO MAYOR</option>
<option value="MEDICO ESPECIALISTA HEATLH ANALYSIS AND OPTIMIZATION UNIT">MEDICO ESPECIALISTA HEATLH ANALYSIS AND OPTIMIZATION UNIT</option>
<option value="DIRECTOR DE IMPUESTOS">DIRECTOR DE IMPUESTOS</option>
<option value="GERENTE DE OPERACIONES DESARROLLO HUMANO">GERENTE DE OPERACIONES DESARROLLO HUMANO</option>
<option value="GERENTE GENERAL VENEZUELA">GERENTE GENERAL VENEZUELA</option>
<option value="GERENTE CORPORATIVO DE PROYECTOS ESPECIALES">GERENTE CORPORATIVO DE PROYECTOS ESPECIALES</option>
<option value="DIRECTOR OF RISK ADJUSTMENT USA">DIRECTOR OF RISK ADJUSTMENT USA</option>
<option value="LIDER DE CONTABILIDAD USA">LIDER DE CONTABILIDAD USA</option>
<option value="GERENTE DATOS Y ANALITICA COLOMBIA">GERENTE DATOS Y ANALITICA COLOMBIA</option>
<option value="DIRECTOR DE PROYECTOS SISTEMAS DE INFORMACION USA">DIRECTOR DE PROYECTOS SISTEMAS DE INFORMACION USA</option>
<option value="DIRECTOR OF MARKETING USA & MEX">DIRECTOR OF MARKETING USA & MEX</option>
<option value="VICEPRESIDENTE JURIDICO">VICEPRESIDENTE JURIDICO</option>
<option value="INGENIERO DE DATOS USA">INGENIERO DE DATOS USA</option>
<option value="PRESIDENTE VERSANIA">PRESIDENTE VERSANIA</option>
<option value="VICEPRESIDENTE DE PLANES ESPECIALES">VICEPRESIDENTE DE PLANES ESPECIALES</option>
<option value="GERENTE DE BIENESTAR Y CALIDAD DE VIDA">GERENTE DE BIENESTAR Y CALIDAD DE VIDA</option>
<option value="GERENTE CORPORATIVO DE SALUD DIGITAL">GERENTE CORPORATIVO DE SALUD DIGITAL</option>
<option value="ANALISTA DE DATOS USA">ANALISTA DE DATOS USA</option>
<option value="CEO GLOBAL KERALTY">CEO GLOBAL KERALTY</option>
<option value="CHRO CAPITAL HUMANO">CHRO CAPITAL HUMANO</option>
<option value="GERENTE DE COMPRAS DE MEDICAMENTOS, INSUMOS MEDICOS Y LABORATORIO">GERENTE DE COMPRAS DE MEDICAMENTOS, INSUMOS MEDICOS Y LABORATORIO</option>
<option value="CHIEF EXECUTIVE OFFICER - TEXAS">CHIEF EXECUTIVE OFFICER - TEXAS</option>
<option value="AUXILIAR OPERATIVO DE COMPENSACION I">AUXILIAR OPERATIVO DE COMPENSACION I</option>
<option value="ESPECIALISTA DE PROGRAMAS Y BENEFICIOS">ESPECIALISTA DE PROGRAMAS Y BENEFICIOS</option>
<option value="ABOGADO CORPORATIVO USA">ABOGADO CORPORATIVO USA</option>
<option value="ABOGADO TRIBUTARISTA Y CAMBIARIO">ABOGADO TRIBUTARISTA Y CAMBIARIO</option>
<option value="HEALTHCARE SERVICES DIRECTOR">HEALTHCARE SERVICES DIRECTOR</option>
<option value="AUXILIAR ADMINISTRATIVO DE INFORMACION">AUXILIAR ADMINISTRATIVO DE INFORMACION</option>
<option value="DISE ADOR GRAFICO USA">DISE ADOR GRAFICO USA</option>
<option value="DIRECTOR DE BIENESTAR Y CALIDAD DE VIDA">DIRECTOR DE BIENESTAR Y CALIDAD DE VIDA</option>
<option value="DIRECTOR UX EXPERIENCIA DE USUARIO">DIRECTOR UX EXPERIENCIA DE USUARIO</option>
<option value="LIDER DE DESARROLLO CORPORATIVO">LIDER DE DESARROLLO CORPORATIVO</option>
<option value="SUBGERENTE PROYECTOS DE INNOVACION">SUBGERENTE PROYECTOS DE INNOVACION</option>
<option value="SECRETARIA PRESIDENCIA II">SECRETARIA PRESIDENCIA II</option>
<option value="SECRETARIA EJECUTIVA">SECRETARIA EJECUTIVA</option>
<option value="PRESIDENTE DE SALUD">PRESIDENTE DE SALUD</option>
<option value="SVP ESTRATEGIA">SVP ESTRATEGIA</option>
<option value="GERENTE DE PROYECTOS Y SOLUCIONES EN SALUD">GERENTE DE PROYECTOS Y SOLUCIONES EN SALUD</option>
<option value="DIRECTOR CREATIVO USA">DIRECTOR CREATIVO USA</option>
<option value="DIRECTOR DE POSICIONAMIENTO USA">DIRECTOR DE POSICIONAMIENTO USA</option>
<option value="DIRECTOR DE NEGOCIACIONES INSUMOS MEDICOS">DIRECTOR DE NEGOCIACIONES INSUMOS MEDICOS</option>
<option value="ANALISTA ADMINISTRATIVO KERALTY">ANALISTA ADMINISTRATIVO KERALTY</option>
<option value="PROFESIONAL DE ANALITICA DESARROLLO HUMANO PAISES">PROFESIONAL DE ANALITICA DESARROLLO HUMANO PAISES</option>
<option value="SR DIRECTOR PRODUCT GROWTH ECONOMICS">SR DIRECTOR PRODUCT GROWTH ECONOMICS</option>
<option value="GERENTE DE PROTECCION DE DATOS PERSONALES">GERENTE DE PROTECCION DE DATOS PERSONALES</option>
<option value="GERENTE GOBIERNO CORPORATIVO Y COMPLIANCE">GERENTE GOBIERNO CORPORATIVO Y COMPLIANCE</option>
<option value="GERENTE HEALTH ANALYSIS AND OPTIMIZATION UNIT">GERENTE HEALTH ANALYSIS AND OPTIMIZATION UNIT</option>
<option value="CHIEF EXECUTIVE OFFICER - TENNESSEE">CHIEF EXECUTIVE OFFICER - TENNESSEE</option>
<option value="PROFESIONAL DE VALOR EN SALUD">PROFESIONAL DE VALOR EN SALUD</option>
<option value="LEGAL RISK & COMPLIANCE COUNSEL">LEGAL RISK & COMPLIANCE COUNSEL</option>
<option value="ESPECIALISTA DE COMPENSACION I">ESPECIALISTA DE COMPENSACION I</option>
<option value="LIDER DE PRESUPUESTO Y PLANEACION USA">LIDER DE PRESUPUESTO Y PLANEACION USA</option>
<option value="CHIEF FINANCIAL OFFICER">CHIEF FINANCIAL OFFICER</option>
<option value="SVP DESARROLLO CORPORATIVO">SVP DESARROLLO CORPORATIVO</option>
<option value="ANALISTA TECNICO SENIOR II GESTION DE LA INFORMACION">ANALISTA TECNICO SENIOR II GESTION DE LA INFORMACION</option>
<option value="ANALISTA ADMINISTRATIVO Y DE FACTURACION">ANALISTA ADMINISTRATIVO Y DE FACTURACION</option>
<option value="ANALISTA SISTEMAS DE INFORMACION SENIOR">ANALISTA SISTEMAS DE INFORMACION SENIOR</option>
<option value="GERENTE DE HOGARES GERIATRICOS">GERENTE DE HOGARES GERIATRICOS</option>
<option value="SUBGERENTE DE VALOR EN SALUD">SUBGERENTE DE VALOR EN SALUD</option>
<option value="SUBGERENTE DE ASUNTOS MEDICOS Y DE TUTELA">SUBGERENTE DE ASUNTOS MEDICOS Y DE TUTELA</option>
<option value="DIRECTOR DE OPERACION Y COMUNICACIONES TI">DIRECTOR DE OPERACION Y COMUNICACIONES TI</option>
<option value="ANALISTA ADMINISTRACION DE SALARIOS SENIOR PAISES">ANALISTA ADMINISTRACION DE SALARIOS SENIOR PAISES</option>
<option value="ESPECIALISTA DE RELACIONES INSTITUCIONALES">ESPECIALISTA DE RELACIONES INSTITUCIONALES</option>
<option value="VICEPRESIDENTE DE DESARROLLO INTERNACIONAL">VICEPRESIDENTE DE DESARROLLO INTERNACIONAL</option>
<option value="SUBGERENTE ASUNTOS PROCESALES">SUBGERENTE ASUNTOS PROCESALES</option>
<option value="HEALTH ANALYTICS DIRECTOR">HEALTH ANALYTICS DIRECTOR</option>
<option value="ASESOR MEDICO DE SISTEMAS DE INFORMACION EN SALUD USA">ASESOR MEDICO DE SISTEMAS DE INFORMACION EN SALUD USA</option>
<option value="GERENTE DE COMUNICACIONES">GERENTE DE COMUNICACIONES</option>
<option value="DATA & ANALYTICS DIRECTOR">DATA & ANALYTICS DIRECTOR</option>
<option value="SUBGERENTE DE PROGRAMAS Y GESTION CLINICA">SUBGERENTE DE PROGRAMAS Y GESTION CLINICA</option>
<option value="DIRECTOR JURIDICO TRIBUTARIO">DIRECTOR JURIDICO TRIBUTARIO</option>
<option value="VICE PRESIDENT HEALTHCARE SERVICES">VICE PRESIDENT HEALTHCARE SERVICES</option>
<option value="MANAGER ASUNTOS CONTRACTUALES USA">MANAGER ASUNTOS CONTRACTUALES USA</option>
<option value="GESTOR AMBIENTAL">GESTOR AMBIENTAL</option>
<option value="ANALISTA DE CUMPLIMIENTO">ANALISTA DE CUMPLIMIENTO</option>
<option value="SUBGERENTE ASUNTOS CORPORATIVOS">SUBGERENTE ASUNTOS CORPORATIVOS</option>
<option value="CONSULTOR FUNCIONAL EBS">CONSULTOR FUNCIONAL EBS</option>
<option value="DIRECTOR DE PRESUPUESTO MEXICO">DIRECTOR DE PRESUPUESTO MEXICO</option>
<option value="SVP DE COMPRAS Y APROVISIONAMIENTO">SVP DE COMPRAS Y APROVISIONAMIENTO</option>
<option value="ANALISTA SQA JUNIOR">ANALISTA SQA JUNIOR</option>
<option value="ESPECIALISTA DE PROYECTOS INMOBILIARIOS">ESPECIALISTA DE PROYECTOS INMOBILIARIOS</option>
<option value="GERENTE DE DESARROLLO CORPORATIVO">GERENTE DE DESARROLLO CORPORATIVO</option>
<option value="DIRECTOR DE GESTION FARMACEUTICA">DIRECTOR DE GESTION FARMACEUTICA</option>
<option value="BUSINESS INTELLIGENCE MANAGER">BUSINESS INTELLIGENCE MANAGER</option>
<option value="GERENTE GLOBAL DE SEGURIDAD">GERENTE GLOBAL DE SEGURIDAD</option>
<option value="MANAGER ASUNTOS CORPORATIVOS USA">MANAGER ASUNTOS CORPORATIVOS USA</option>
<option value="CCO CORPORATIVO">CCO CORPORATIVO</option>
<option value="VP OF OPERATIONS & IT">VP OF OPERATIONS & IT</option>
<option value="SUBGERENTE DE ASUNTOS INTERNACIONALES">SUBGERENTE DE ASUNTOS INTERNACIONALES</option>
<option value="DIRECTOR DE DESARROLLO CORPORATIVO JUNIOR">DIRECTOR DE DESARROLLO CORPORATIVO JUNIOR</option>
<option value="PROVIDER DATABASE & COMMUNICATIONS MANAGER">PROVIDER DATABASE & COMMUNICATIONS MANAGER</option>
<option value="PRESIDENTE DE ASEGURAMIENTO BASICO">PRESIDENTE DE ASEGURAMIENTO BASICO</option>
<option value="ANALISTA DESARROLLO CORPORATIVO">ANALISTA DESARROLLO CORPORATIVO</option>
<option value="PRESIDENTE GRUPO KERALTY">PRESIDENTE GRUPO KERALTY</option>
<option value="ESPECIALISTA DE SERVICIOS TI">ESPECIALISTA DE SERVICIOS TI</option>
<option value="ARQUITECTO DE INFRAESTRUCTURA USA">ARQUITECTO DE INFRAESTRUCTURA USA</option>
<option value="ANALISTA DE IMPUESTOS PAISES">ANALISTA DE IMPUESTOS PAISES</option>
<option value="CONDUCTOR PRESIDENCIA">CONDUCTOR PRESIDENCIA</option>
<option value="GERENTE DE PROYECTOS">GERENTE DE PROYECTOS</option>
<option value="GERENTE DE ADMINISTRACION DE SALARIOS RIESGO Y CALIDAD">GERENTE DE ADMINISTRACION DE SALARIOS RIESGO Y CALIDAD</option>
<option value="CONSULTOR SENIOR DE SEGURIDAD DE LA INFORMACION">CONSULTOR SENIOR DE SEGURIDAD DE LA INFORMACION</option>
<option value="DIRECTOR PORTAFOLIOS DE INVERSION">DIRECTOR PORTAFOLIOS DE INVERSION</option>
<option value="CONSULTOR DE PROYECTOS Y AUTOMATIZACION TI">CONSULTOR DE PROYECTOS Y AUTOMATIZACION TI</option>
<option value="CHIEF EXECUTIVE OFFICER GWS">CHIEF EXECUTIVE OFFICER GWS</option>
<option value="PRESIDENTE VERSANIA GLOBAL">PRESIDENTE VERSANIA GLOBAL</option>
<option value="GERENTE DE OPERACI N SANITARIA">GERENTE DE OPERACI N SANITARIA</option>
<option value="CHIEF INFORMATION OFFICER EUROPE & ASIA">CHIEF INFORMATION OFFICER EUROPE & ASIA</option>
<option value="ENFERMERA EDUCACION VIRTUAL HEALTH ANALYSIS AND OPTIMIZATION UNIT">ENFERMERA EDUCACION VIRTUAL HEALTH ANALYSIS AND OPTIMIZATION UNIT</option>
<option value="DIRECTOR DE ANALITICA CUANTITATIVA PARA RIESGOS">DIRECTOR DE ANALITICA CUANTITATIVA PARA RIESGOS</option>
<option value="MEDICO ESPECIALISTA HEALTH ANALYSIS AND OPTIMIZATION UNIT - SUPPORT">MEDICO ESPECIALISTA HEALTH ANALYSIS AND OPTIMIZATION UNIT - SUPPORT</option>
<option value="COORDINADOR DATA MASTER">COORDINADOR DATA MASTER</option>
<option value="PROFESIONAL SENIOR DE SUSCRIPCION">PROFESIONAL SENIOR DE SUSCRIPCION</option>
<option value="ADMINISTRADOR DE SISTEMAS USA">ADMINISTRADOR DE SISTEMAS USA</option>
<option value="COORDINADOR PLANEACION FISCAL">COORDINADOR PLANEACION FISCAL</option>
<option value="ACOMPA ANTE">ACOMPA ANTE</option>
<option value="COORDINADOR CONECTA">COORDINADOR CONECTA</option>
<option value="FACILITADOR PROGRAMA MANTENIMIENTO FUNCIONAL">FACILITADOR PROGRAMA MANTENIMIENTO FUNCIONAL</option>
<option value="ESPECIALISTA FORMACION EDUCA">ESPECIALISTA FORMACION EDUCA</option>
<option value="AUXILIAR OPERATIVO CONECTA">AUXILIAR OPERATIVO CONECTA</option>
<option value="DIRECTOR PROGRAMA LAZOS HUMANOS">DIRECTOR PROGRAMA LAZOS HUMANOS</option>
<option value="ASISTENTE CENTRAL JURIDICA">ASISTENTE CENTRAL JURIDICA</option>
<option value="ANALISTA DE SUSCRIPCION DE PROGRAMACION">ANALISTA DE SUSCRIPCION DE PROGRAMACION</option>
<option value="DEPENDIENTE JUDICIAL II">DEPENDIENTE JUDICIAL II</option>
<option value="DIRECTOR DE GOBIERNO CORPORATIVO">DIRECTOR DE GOBIERNO CORPORATIVO</option>
<option value="ANALISTA DE COMPLIANCE">ANALISTA DE COMPLIANCE</option>
<option value="DIRECTOR DE SUSCRIPCION">DIRECTOR DE SUSCRIPCION</option>
<option value="ASESOR INTEGRAL SOPORTE A CANALES">ASESOR INTEGRAL SOPORTE A CANALES</option>
<option value="GESTOR OPERATIVO DE INFORMACION">GESTOR OPERATIVO DE INFORMACION</option>
<option value="ANALISTA ADMINISTRATIVO SENIOR KERALTY">ANALISTA ADMINISTRATIVO SENIOR KERALTY</option>
<option value="SUBGERENTE DE GESTION DOCUMENTAL">SUBGERENTE DE GESTION DOCUMENTAL</option>
<option value="SUBGERENTE DE OPERACIONES REGIONAL CENTRO ORIENTE">SUBGERENTE DE OPERACIONES REGIONAL CENTRO ORIENTE</option>
<option value="COORDINADOR PROGRAMA MEDICINA PREVENTIVA">COORDINADOR PROGRAMA MEDICINA PREVENTIVA</option>
<option value="AUXILIAR PLANEACION FISCAL">AUXILIAR PLANEACION FISCAL</option>
<option value="SUBGERENTE DE AUDITORIA MEDICA">SUBGERENTE DE AUDITORIA MEDICA</option>
<option value="VICEPRESIDENTE DE OPERACIONES ASEGURAMIENTO PREMIUM">VICEPRESIDENTE DE OPERACIONES ASEGURAMIENTO PREMIUM</option>
<option value="GERENTE DE BIENESTAR MEDICO">GERENTE DE BIENESTAR MEDICO</option>
<option value="COORDINADOR DE CARTERA Y COBRANZA">COORDINADOR DE CARTERA Y COBRANZA</option>
<option value="SUBGERENTE DE OPERACIONES REGIONAL MEDELLIN">SUBGERENTE DE OPERACIONES REGIONAL MEDELLIN</option>
<option value="ANALISTA DE SOPORTE GESTION TRIBUTARIA">ANALISTA DE SOPORTE GESTION TRIBUTARIA</option>
<option value="DIRECTOR DE AUDITORIA MEDICA REGIONAL BOGOTA">DIRECTOR DE AUDITORIA MEDICA REGIONAL BOGOTA</option>
<option value="SUBGERENTE DE OPERACIONES REGIONAL">SUBGERENTE DE OPERACIONES REGIONAL</option>
<option value="SUBGERENTE DE PLANES MODULARES">SUBGERENTE DE PLANES MODULARES</option>
<option value="DIRECTOR DE OPERACIONES">DIRECTOR DE OPERACIONES</option>
<option value="SUBDIRECTOR CARTERA Y COBRANZAS">SUBDIRECTOR CARTERA Y COBRANZAS</option>
<option value="ESPECIALISTA DE BIENESTAR MEDICO">ESPECIALISTA DE BIENESTAR MEDICO</option>
<option value="ANALISTA JUNIOR DE PROYECTOS">ANALISTA JUNIOR DE PROYECTOS</option>
<option value="COORDINADOR DE CONVENIOS Y TARIFAS">COORDINADOR DE CONVENIOS Y TARIFAS</option>
<option value="VICEPRESIDENTE CORPORATIVO DE OPERACIONES ASEGURAMIENTO">VICEPRESIDENTE CORPORATIVO DE OPERACIONES ASEGURAMIENTO</option>
<option value="COORDINADOR DE AFILIACIONES">COORDINADOR DE AFILIACIONES</option>
<option value="TECNICO DE CONSULTORIO">TECNICO DE CONSULTORIO</option>
<option value="COORDINADOR MEDICO OFTALMOLOGIA">COORDINADOR MEDICO OFTALMOLOGIA</option>
<option value="OPTOMETRA">OPTOMETRA</option>
<option value="GERENTE GENERAL">GERENTE GENERAL</option>
<option value="COORDINADOR LOGISTICO">COORDINADOR LOGISTICO</option>
<option value="AUXILIAR DE VENTAS">AUXILIAR DE VENTAS</option>
<option value="AUXILIAR OPERATIVO DE OPTICA">AUXILIAR OPERATIVO DE OPTICA</option>
<option value="GESTOR DE SEDE">GESTOR DE SEDE</option>
<option value="GESTOR DE SEDE I">GESTOR DE SEDE I</option>
<option value="COORDINADOR DE GESTION COMERCIAL">COORDINADOR DE GESTION COMERCIAL</option>
<option value="COORDINADOR DE ZONA">COORDINADOR DE ZONA</option>
<option value="DIRECTOR FINANCIERO">DIRECTOR FINANCIERO</option>
<option value="AUXILIAR DE BODEGA">AUXILIAR DE BODEGA</option>
<option value="COORDINADOR DE OPTICA">COORDINADOR DE OPTICA</option>
<option value="COORDINADOR DIRECCION CIENTIFICA">COORDINADOR DIRECCION CIENTIFICA</option>
<option value="AUXILIAR DE INVENTARIOS">AUXILIAR DE INVENTARIOS</option>
<option value="GESTOR DE AGENDAMIENTO Y OPORTUNIDAD">GESTOR DE AGENDAMIENTO Y OPORTUNIDAD</option>
<option value="GERENTE DE OPTICA">GERENTE DE OPTICA</option>
<option value="DIRECTOR DE SALUD VISUAL">DIRECTOR DE SALUD VISUAL</option>
<option value="SUBGERENTE DE SALUD">SUBGERENTE DE SALUD</option>
<option value="FISIOTERAPEUTA SALUD OCUPACIONAL">FISIOTERAPEUTA SALUD OCUPACIONAL</option>
<option value="ANALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO II">ANALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO II</option>
<option value="PROMOTOR DE PROGRAMAS EN SALUD">PROMOTOR DE PROGRAMAS EN SALUD</option>
<option value="AUXILIAR DE ADMISIONES I">AUXILIAR DE ADMISIONES I</option>
<option value="ASESOR INTEGRAL DE PREVENCION I">ASESOR INTEGRAL DE PREVENCION I</option>
<option value="ASESOR INTEGRAL DE PREVENCION FISIOTERAPEUTA I">ASESOR INTEGRAL DE PREVENCION FISIOTERAPEUTA I</option>
<option value="AUXILIAR DE PRESTADORES">AUXILIAR DE PRESTADORES</option>
<option value="ASESOR INTEGRAL DE PREVENCION PSICOLOGO">ASESOR INTEGRAL DE PREVENCION PSICOLOGO</option>
<option value="ASESOR INTEGRAL DE PREVENCION FISIOTERAPEUTA">ASESOR INTEGRAL DE PREVENCION FISIOTERAPEUTA</option>
<option value="COORDINADOR DE POSTVENTA">COORDINADOR DE POSTVENTA</option>
<option value="GESTOR DE EMPRESA">GESTOR DE EMPRESA</option>
<option value="COORDINADOR MEDICO SALUD OCUPACIONAL">COORDINADOR MEDICO SALUD OCUPACIONAL</option>
<option value="PROMOTOR DE PROGRAMAS EN SALUD I">PROMOTOR DE PROGRAMAS EN SALUD I</option>
<option value="COORDINADOR ADMINISTRATIVO PROGRAMAS EN SALUD">COORDINADOR ADMINISTRATIVO PROGRAMAS EN SALUD</option>
<option value="AUXILIAR COMERCIAL">AUXILIAR COMERCIAL</option>
<option value="GESTOR DE PROGRAMAS ESPECIALES">GESTOR DE PROGRAMAS ESPECIALES</option>
<option value="ASESOR INTEGRAL DE PREVENCION-TECNOLOGO">ASESOR INTEGRAL DE PREVENCION-TECNOLOGO</option>
<option value="PSICOLOGO ESPECIALISTA EN SALUD OCUPACIONAL">PSICOLOGO ESPECIALISTA EN SALUD OCUPACIONAL</option>
<option value="FONOAUDIOLOGA SALUD OCUPACIONAL">FONOAUDIOLOGA SALUD OCUPACIONAL</option>
<option value="GERENTE GENERAL SO">GERENTE GENERAL SO</option>
<option value="ASESOR INTEGRAL DE PREVENCION INGENIERO I">ASESOR INTEGRAL DE PREVENCION INGENIERO I</option>
<option value="ANALISTA DE ERGONOMIA">ANALISTA DE ERGONOMIA</option>
<option value="ASESOR INTEGRAL DE PREVENCION ENFERMERA">ASESOR INTEGRAL DE PREVENCION ENFERMERA</option>
<option value="TECNOLOGO JUNIOR EN HIGIENE Y SEGURIDAD INDUSTRIAL">TECNOLOGO JUNIOR EN HIGIENE Y SEGURIDAD INDUSTRIAL</option>
<option value="ADMINISTRADOR BASE DE DATOS SO">ADMINISTRADOR BASE DE DATOS SO</option>
<option value="ESPECIALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO">ESPECIALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO</option>
<option value="NO APLICA">NO APLICA</option>
<option value="AUXILIAR LOGISTICO Y ADMINISTRATIVO">AUXILIAR LOGISTICO Y ADMINISTRATIVO</option>
<option value="AUXILIAR DE ADMISIONES Y FACTURACION">AUXILIAR DE ADMISIONES Y FACTURACION</option>
<option value="COORDINADOR DE GESTION MEDICA PRESENTES">COORDINADOR DE GESTION MEDICA PRESENTES</option>
<option value="COUNSELLOR">COUNSELLOR</option>
<option value="GERENTE PRESENTES">GERENTE PRESENTES</option>
<option value="TECNICO EN RESONANCIA MAGNETICA">TECNICO EN RESONANCIA MAGNETICA</option>
<option value="COORDINADOR DE CALL CENTER">COORDINADOR DE CALL CENTER</option>
<option value="FISIOTERAPEUTA NEUROREHABILITACION">FISIOTERAPEUTA NEUROREHABILITACION</option>
<option value="COORDINADOR MEDICO DESARROLLO INFANTIL">COORDINADOR MEDICO DESARROLLO INFANTIL</option>
<option value="GERENTE PRIMERA INFANCIA">GERENTE PRIMERA INFANCIA</option>
<option value="DIRECTOR DE SEDE">DIRECTOR DE SEDE</option>
<option value="GERENTE">GERENTE</option>
<option value="DIRECTOR DE RESIDENCIAS VERSANIA SENIOR">DIRECTOR DE RESIDENCIAS VERSANIA SENIOR</option>
<option value="GERENTE PROTECION DE DATOS PERSONALES">GERENTE PROTECION DE DATOS PERSONALES</option>
<option value="PRESIDENTE DE ASEGURAMIENTO B SICO.">PRESIDENTE DE ASEGURAMIENTO B SICO.</option>
<option value="ABOGADO TRIBUTARISTA INTERNACIONAL">ABOGADO TRIBUTARISTA INTERNACIONAL</option>
<option value="COORDINADOR GESTI N DEL RIESGO">COORDINADOR GESTI N DEL RIESGO</option>
<option value="ADMINISTRADOR DEL SISTEMA JUNIOR">ADMINISTRADOR DEL SISTEMA JUNIOR</option>
<option value="ADMINISTRADOR SISTEMA DE MONITOREO">ADMINISTRADOR SISTEMA DE MONITOREO</option>
<option value="ANALISTA BIOINFORMATICO">ANALISTA BIOINFORMATICO</option>
<option value="ANALISTA CAMPA A">ANALISTA CAMPA A</option>
<option value="ANALISTA DE CALIDAD OPTICA">ANALISTA DE CALIDAD OPTICA</option>
<option value="ANALISTA DE CONTABILIDAD FILIPINAS">ANALISTA DE CONTABILIDAD FILIPINAS</option>
<option value="ANALISTA DE GESTION OPERATIVA">ANALISTA DE GESTION OPERATIVA</option>
<option value="ANALISTA DE INFORMACION INFRAESTRUCTURA">ANALISTA DE INFORMACION INFRAESTRUCTURA</option>
<option value="ANALISTA DE TECNOLOGIA">ANALISTA DE TECNOLOGIA</option>
<option value="ANALISTA DISE O ORGANIZACIONAL I">ANALISTA DISE O ORGANIZACIONAL I</option>
<option value="ANALISTA ESTUDIOS ECONOMICOS">ANALISTA ESTUDIOS ECONOMICOS</option>
<option value="ASESOR SOPORTE PRESTADORES">ASESOR SOPORTE PRESTADORES</option>
<option value="ASISTENTE VINCULACION SECTOR EXTERNO">ASISTENTE VINCULACION SECTOR EXTERNO</option>
<option value="AUXILIAR OPERATIVA">AUXILIAR OPERATIVA</option>
<option value="AUXILIAR OPERATIVO DE COMPENSACION">AUXILIAR OPERATIVO DE COMPENSACION</option>
<option value="BIBLIOTECOLOGO JUNIOR">BIBLIOTECOLOGO JUNIOR</option>
<option value="COORDINADOR ADMINISTRATIVO DE SEDES">COORDINADOR ADMINISTRATIVO DE SEDES</option>
<option value="COORDINADOR ADMINISTRATIVO EPS REGIONAL">COORDINADOR ADMINISTRATIVO EPS REGIONAL</option>
<option value="COORDINADOR DE BIENESTAR Y CALIDAD DE VIDA">COORDINADOR DE BIENESTAR Y CALIDAD DE VIDA</option>
<option value="COORDINADOR DE EDUCACION Y SERVICIO">COORDINADOR DE EDUCACION Y SERVICIO</option>
<option value="COORDINADOR DE ENFERMERIA ONCOLOGIA">COORDINADOR DE ENFERMERIA ONCOLOGIA</option>
<option value="COORDINADOR M DICO URGENCIAS">COORDINADOR M DICO URGENCIAS</option>
<option value="COORDINADORA DE EVALUACION">COORDINADORA DE EVALUACION</option>
<option value="DEPENDIENTE JUDICIAL">DEPENDIENTE JUDICIAL</option>
<option value="DIRECTOR ADMINISTRATIVO CENTROS MEDICOS">DIRECTOR ADMINISTRATIVO CENTROS MEDICOS</option>
<option value="DIRECTOR ADMINISTRATIVO ODONTOSANITAS">DIRECTOR ADMINISTRATIVO ODONTOSANITAS</option>
<option value="DIRECTOR ADMINISTRATIVO UAP">DIRECTOR ADMINISTRATIVO UAP</option>
<option value="DIRECTOR ADMNISTRATIVO Y ANALITICA DESARROLLO HUMANO">DIRECTOR ADMNISTRATIVO Y ANALITICA DESARROLLO HUMANO</option>
<option value="DIRECTOR CONTROL Y POLITICA CONTABLE">DIRECTOR CONTROL Y POLITICA CONTABLE</option>
<option value="DIRECTOR DE ACTUAR A ASEGURAMIENTO">DIRECTOR DE ACTUAR A ASEGURAMIENTO</option>
<option value="DIRECTOR DE AFILIACIONES Y RECAUDO">DIRECTOR DE AFILIACIONES Y RECAUDO</option>
<option value="DIRECTOR DE CENTRO">DIRECTOR DE CENTRO</option>
<option value="DIRECTOR DE COMPRAS TECNOLOGIA Y SUMINISTROS">DIRECTOR DE COMPRAS TECNOLOGIA Y SUMINISTROS</option>
<option value="DIRECTOR DE FIDELIZACION AL USUARIO">DIRECTOR DE FIDELIZACION AL USUARIO</option>
<option value="DIRECTOR DE GESTION TECNICAS DE CONVENIOS">DIRECTOR DE GESTION TECNICAS DE CONVENIOS</option>
<option value="DIRECTOR DE INDEMNIZACIONES ARL">DIRECTOR DE INDEMNIZACIONES ARL</option>
<option value="DIRECTOR DE INFRAESTRUCTURA MEDICA">DIRECTOR DE INFRAESTRUCTURA MEDICA</option>
<option value="DIRECTOR DE OPERACI N Y COMUNICACIONES TI">DIRECTOR DE OPERACI N Y COMUNICACIONES TI</option>
<option value="DIRECTOR DE PORTAFOLIO DE PROYECTOS">DIRECTOR DE PORTAFOLIO DE PROYECTOS</option>
<option value="DIRECTOR DE RED PROPIA">DIRECTOR DE RED PROPIA</option>
<option value="DIRECTOR DE REPORTES">DIRECTOR DE REPORTES</option>
<option value="DIRECTOR DE RESERVAS">DIRECTOR DE RESERVAS</option>
<option value="DIRECTOR DE SALUD MENTAL">DIRECTOR DE SALUD MENTAL</option>
<option value="DIRECTOR DE SERVICIO ARL">DIRECTOR DE SERVICIO ARL</option>
<option value="DIRECTOR DEL SISTEMA">DIRECTOR DEL SISTEMA</option>
<option value="DIRECTOR MODELO DE SERVICIO SUBSIDIADO">DIRECTOR MODELO DE SERVICIO SUBSIDIADO</option>
<option value="DIRECTOR NACIONAL DE AUDITORIA">DIRECTOR NACIONAL DE AUDITORIA</option>
<option value="DIRECTOR OPERATIVO DE VINCULACION MP">DIRECTOR OPERATIVO DE VINCULACION MP</option>
<option value="DIRECTOR OPERATIVO OPTICA">DIRECTOR OPERATIVO OPTICA</option>
<option value="DIRECTOR PRODUCTOS ODONTOLOGICOS">DIRECTOR PRODUCTOS ODONTOLOGICOS</option>
<option value="DIRECTOR PROGRAMA HEMOFILIA Y ARTRITIS">DIRECTOR PROGRAMA HEMOFILIA Y ARTRITIS</option>
<option value="GERENTE CLINICA COLOMBIA">GERENTE CLINICA COLOMBIA</option>
<option value="GERENTE CORPORATIVO CENTRAL DE COMPRAS">GERENTE CORPORATIVO CENTRAL DE COMPRAS</option>
<option value="GERENTE CORPORATIVO DE MEJORA SISTEMAS DE INFORMACION">GERENTE CORPORATIVO DE MEJORA SISTEMAS DE INFORMACION</option>
<option value="GERENTE CORPORATIVO DE SOLUCIONES DE ASEGURAMIENTO Y ASISTENCIAL">GERENTE CORPORATIVO DE SOLUCIONES DE ASEGURAMIENTO Y ASISTENCIAL</option>
<option value="GERENTE CORPORATIVO TRANSFORMACION DIGITAL EN SALUD">GERENTE CORPORATIVO TRANSFORMACION DIGITAL EN SALUD</option>
<option value="GERENTE DE ANALITICA Y PROYECTOS COMERCIALES">GERENTE DE ANALITICA Y PROYECTOS COMERCIALES</option>
<option value="GERENTE DE ATRACCION Y FIDELIZACION">GERENTE DE ATRACCION Y FIDELIZACION</option>
<option value="GERENTE DE CENTROS MEDICOS">GERENTE DE CENTROS MEDICOS</option>
<option value="GERENTE DE COMPENSACION">GERENTE DE COMPENSACION</option>
<option value="GERENTE DE COMPRAS DE INFRAESTRUCTURA Y TECNOLOGIA">GERENTE DE COMPRAS DE INFRAESTRUCTURA Y TECNOLOGIA</option>
<option value="GERENTE DE COMPRAS DE MEDICAMENTOS E INSUMOS MEDICOS">GERENTE DE COMPRAS DE MEDICAMENTOS E INSUMOS MEDICOS</option>
<option value="GERENTE DE CULTURA Y GESTION DEL CAMBIO">GERENTE DE CULTURA Y GESTION DEL CAMBIO</option>
<option value="GERENTE DE EXCELENCIA CLINICA">GERENTE DE EXCELENCIA CLINICA</option>
<option value="GERENTE DE PRESUPUESTO">GERENTE DE PRESUPUESTO</option>
<option value="GERENTE DE PROYECTOS REGIMEN SUBSIDIADO">GERENTE DE PROYECTOS REGIMEN SUBSIDIADO</option>
<option value="GERENTE DE SALUD DE REGIONALES">GERENTE DE SALUD DE REGIONALES</option>
<option value="GERENTE DE SALUD DIGITAL">GERENTE DE SALUD DIGITAL</option>
<option value="GERENTE DE SALUD MEDICINA PREPAGADA">GERENTE DE SALUD MEDICINA PREPAGADA</option>
<option value="GERENTE DE SEGUROS DE VIDA Y OTROS">GERENTE DE SEGUROS DE VIDA Y OTROS</option>
<option value="GERENTE MEDICO REGIONALES EPS">GERENTE MEDICO REGIONALES EPS</option>
<option value="GESTOR DE AUTOEVALUACION">GESTOR DE AUTOEVALUACION</option>
<option value="GESTOR DE LIQUIDACION COMISIONES">GESTOR DE LIQUIDACION COMISIONES</option>
<option value="GESTOR DE RELACIONES PUBLICAS">GESTOR DE RELACIONES PUBLICAS</option>
<option value="GESTOR INSTITUCIONAL DE DOCENCIA">GESTOR INSTITUCIONAL DE DOCENCIA</option>
<option value="GESTOR LOGISTICO LINEA ACOMPA A">GESTOR LOGISTICO LINEA ACOMPA A</option>
<option value="GESTOR MESA DE AYUDA I">GESTOR MESA DE AYUDA I</option>
<option value="INGENIERO LIDER DE CALIDAD">INGENIERO LIDER DE CALIDAD</option>
<option value="INGENIERO SISTEMA DE INFORMACION">INGENIERO SISTEMA DE INFORMACION</option>
<option value="JEFE CENTRAL DE URGENCIAS EPS">JEFE CENTRAL DE URGENCIAS EPS</option>
<option value="JEFE DE CIRUGIA GENERAL">JEFE DE CIRUGIA GENERAL</option>
<option value="JEFE DE CONTROL Y POL TICA CONTABLE">JEFE DE CONTROL Y POL TICA CONTABLE</option>
<option value="JEFE DE EPIDEMIOLOG A Y SALUD P BLICA">JEFE DE EPIDEMIOLOG A Y SALUD P BLICA</option>
<option value="JEFE DE OTORRINOLARINGOLOGIA">JEFE DE OTORRINOLARINGOLOGIA</option>
<option value="LIDER ADMINISTRACION DE COMPENSACION">LIDER ADMINISTRACION DE COMPENSACION</option>
<option value="LIDER DE GESTION AMBIENTAL">LIDER DE GESTION AMBIENTAL</option>
<option value="LIDER DE INFORMACION">LIDER DE INFORMACION</option>
<option value="LIDER DE OPERACIONES ARL">LIDER DE OPERACIONES ARL</option>
<option value="LIDER DESARROLLO BI I">LIDER DESARROLLO BI I</option>
<option value="LIDER GESTION Y CONTROL CONTRATACION Y CUMPLIMIENTO">LIDER GESTION Y CONTROL CONTRATACION Y CUMPLIMIENTO</option>
<option value="LIDER INSTITUCIONAL DE MEJORAMIENTO">LIDER INSTITUCIONAL DE MEJORAMIENTO</option>
<option value="LIDER OPERATIVO DE DESARROLLO CORPORATIVO">LIDER OPERATIVO DE DESARROLLO CORPORATIVO</option>
<option value="LIDER OPERATIVO DESARROLLO OTROS PAISES">LIDER OPERATIVO DESARROLLO OTROS PAISES</option>
<option value="LIDER PROYECTOS DE DOTACION">LIDER PROYECTOS DE DOTACION</option>
<option value="MEDICO CODIFICADOR">MEDICO CODIFICADOR</option>
<option value="MEDICO RADIOLOGA">MEDICO RADIOLOGA</option>
<option value="POPULATION HEALTH LEADER - HEALTH ANALYSIS AND OPTIMIZATION UNIT">POPULATION HEALTH LEADER - HEALTH ANALYSIS AND OPTIMIZATION UNIT</option>
<option value="PRESIDENTE">PRESIDENTE</option>
<option value="PRESIDENTE DE GRUPO KERALTY COLOMBIA">PRESIDENTE DE GRUPO KERALTY COLOMBIA</option>
<option value="PROFESIONAL DE SERVICIO">PROFESIONAL DE SERVICIO</option>
<option value="PROMOTOR DE PROGRAMAS EN SALUD (NUTRICIONISTA)">PROMOTOR DE PROGRAMAS EN SALUD (NUTRICIONISTA)</option>
<option value="SUBDIRECTOR ADMINISTRATIVO CLINICA">SUBDIRECTOR ADMINISTRATIVO CLINICA</option>
<option value="SUBGERENTE DE ATRACCI N">SUBGERENTE DE ATRACCI N</option>
<option value="SUBGERENTE DE BUSINESS PARTNER">SUBGERENTE DE BUSINESS PARTNER</option>
<option value="SUBGERENTE DE DESARROLLO CORPORATIVO">SUBGERENTE DE DESARROLLO CORPORATIVO</option>
<option value="SUBGERENTE DE PLANEACION Y CONTROL FINANCIERO MP">SUBGERENTE DE PLANEACION Y CONTROL FINANCIERO MP</option>
<option value="SUBGERENTE DE REGIONALES">SUBGERENTE DE REGIONALES</option>
<option value="SUBGERENTE GESTION DEL RIESGO">SUBGERENTE GESTION DEL RIESGO</option>
<option value="SUBGERENTE HEALTH ANALYSIS AND OPTIMIZATION UNIT">SUBGERENTE HEALTH ANALYSIS AND OPTIMIZATION UNIT</option>
<option value="SUBGERENTE PLANEACION Y CONTROL">SUBGERENTE PLANEACION Y CONTROL</option>
<option value="SUBGERENTE SERVICIOS CORE CLINICA">SUBGERENTE SERVICIOS CORE CLINICA</option>
<option value="SUPERNUMERARIO AREA ADMON">SUPERNUMERARIO AREA ADMON</option>
<option value="VICEPRESIDENTE COMERCIAL">VICEPRESIDENTE COMERCIAL</option>
<option value="VICEPRESIDENTE COMERCIAL EPS">VICEPRESIDENTE COMERCIAL EPS</option>
<option value="VICEPRESIDENTE COMERCIAL MEDICINA PREPAGADA">VICEPRESIDENTE COMERCIAL MEDICINA PREPAGADA</option>
<option value="VICEPRESIDENTE DE GESTION ADMINISTRATIVA Y OPERACIONES">VICEPRESIDENTE DE GESTION ADMINISTRATIVA Y OPERACIONES</option>
<option value="VICEPRESIDENTE DE OPERACIONES">VICEPRESIDENTE DE OPERACIONES</option>
<option value="VICEPRESIDENTE DE RELACIONES INSTITUCIONALES EPS">VICEPRESIDENTE DE RELACIONES INSTITUCIONALES EPS</option>
<option value="VICEPRESIDENTE DE RIESGO">VICEPRESIDENTE DE RIESGO</option>
<option value="VICEPRESIDENTE EJECUTIVO REGIMEN SUBSIDIADO">VICEPRESIDENTE EJECUTIVO REGIMEN SUBSIDIADO</option>
<option value="VICEPRESIDENTE FINANCIERO EPS">VICEPRESIDENTE FINANCIERO EPS</option>
<option value="ASESOR MEDICO JUNIOR">ASESOR MEDICO JUNIOR</option>
<option value="ANALISTA PLANEACION DE LA DEMANDA">ANALISTA PLANEACION DE LA DEMANDA</option>
<option value="GESTOR OPERATIVO DE VACUNACION">GESTOR OPERATIVO DE VACUNACION</option>
          </select>
          {errors.cargo && <p className="error">{errors.cargo}</p>}
        </div>

        <div className="input-container">
          <label htmlFor="correo">Correo</label>
          <input
            type="text"
            id="correo"
            name="correo"
            placeholder="Correo"
            value={values.correo}
            onChange={(e) => handleChange(e, 'correo')}
          />
          {errors.correo && <p className="error">{errors.correo}</p>}
        </div>

        <div className="input-container">
          <label htmlFor="celular">Celular</label>
          <input
            type="text"
            id="celular"
            name="celular"
            placeholder="Celular"
            value={values.celular}
            onChange={(e) => handleChange(e, 'celular')}
          />
          {errors.celular && <p className="error">{errors.celular}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="tipoPlanta">Tipo de Planta</label>
          <select
            name="tipoPlanta"
            id="tipoPlanta"
            value={values.tipoPlanta}
            onChange={(e) => handleChange(e, 'tipoPlanta')}
          >
            <option value="">- Selecciona un tipo de planta -</option>
            <option value="PLANTA APRENDIZ">PLANTA APRENDIZ</option>
            <option value="PLANTA FIJA COL ">PLANTA FIJA COL</option>
            <option value="PLANTA TEMPORAL"> PLANTA TEMPORAL </option>

          </select>
          {errors.tipoPlanta && <p className="error">{errors.tipoPlanta}</p>}
        </div>

        <div className="input-container">
          <label htmlFor="tiempoContrato">Tiempo del Contrato</label>
          <input
            type="text"
            id="tiempoContrato"
            name="tiempoContrato"
            placeholder="Tiempo del Contrato"
            value={values.tiempoContrato}
            onChange={(e) => handleChange(e, 'tiempoContrato')}
          />
          {errors.tiempoContrato && <p className="error">{errors.tiempoContrato}</p>}
        </div>

                {/* Campo fechaIngreso con DatePicker */}
                <div className="select-container">
          <label htmlFor="fechaEnvioDocumentos">Fecha de Envio de documentos o paso por ch al candidato</label>
          <DatePicker
            selected={values.fechaEnvioDocumentos}
            onChange={(date) => handleDateChange(date, 'fechaEnvioDocumentos')}

            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona la Fecha de Envio de documentos o paso por ch al candidato"
            className="date-picker-input"
          />
          {errors.fechaEnvioDocumentos && <p className="error">{errors.fechaEnvioDocumentos}</p>}
        </div> 

         <div className="select-container">
          <label htmlFor="recepcionDocumentosCandidato">Fecha de Envio de recepción de Documentos por parte del Candidato</label>
          <DatePicker
            selected={values.recepcionDocumentosCandidato}
            onChange={(date) => handleDateChange(date, 'recepcionDocumentosCandidato')}

            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona la Fecha de Envio de recepción de Documentos por parte del Candidato"
            className="date-picker-input"
          />
          {errors.recepcionDocumentosCandidato && <p className="error">{errors.recepcionDocumentosCandidato}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="fechaProgramacionExamen">Fecha de Programacion del Examen Médico</label>
          <DatePicker
            selected={values.fechaProgramacionExamen}
            onChange={(date) => handleDateChange(date, 'fechaProgramacionExamen')}

            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona la Fecha de Programacion del Examen Médico"
            className="date-picker-input"
          />
          {errors.fechaProgramacionExamen && <p className="error">{errors.fechaProgramacionExamen}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="fechaConceptoExamen">Fecha de Concepto del Examen Médico</label>
          <DatePicker
            selected={values.fechaConceptoExamen}
            onChange={(date) => handleDateChange(date, 'fechaConceptoExamen')}

            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona la Fecha de Concepto del Examen Médico"
            className="date-picker-input"
          />
          {errors.fechaConceptoExamen && <p className="error">{errors.fechaConceptoExamen}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="fechaEnvioAYC">Fecha de envío AYC</label>
          <DatePicker
            selected={values.fechaEnvioAYC}
            onChange={(date) => handleDateChange(date, 'fechaEnvioAYC')}

            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona la Fecha de envío AYC"
            className="date-picker-input"
          />
          {errors.fechaEnvioAYC && <p className="error">{errors.fechaEnvioAYC}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="fechaConceptoEstudioSeguridad">Fecha de Concepto del Estudio de Seguridad</label>
          <DatePicker
            selected={values.fechaConceptoEstudioSeguridad}
            onChange={(date) => handleDateChange(date, 'fechaConceptoEstudioSeguridad')}

            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona la Fecha de Concepto del Estudio de Seguridad"
            className="date-picker-input"
          />
          {errors.fechaConceptoEstudioSeguridad && <p className="error">{errors.fechaConceptoEstudioSeguridad}</p>}
        </div>

        <div className="select-container">
          <label htmlFor="fechaAsignacionAnalista">Fecha de Asignación Analista</label>
          <DatePicker
            selected={values.fechaAsignacionAnalista}
            onChange={(date) => handleDateChange(date, 'fechaAsignacionAnalista')}

            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona la fecha de Asignación Analista"
            className="date-picker-input"
          />
          {errors.fechaAsignacionAnalista && <p className="error">{errors.fechaAsignacionAnalista}</p>}
        </div>


        <div className="select-container">
          <label htmlFor="estado">Estado</label>
          <select
            name="estado"
            id="estado"
            value={values.estado}
            onChange={(e) => handleChange(e, 'estado')}
          >
            <option value="">- Selecciona un servicio -</option>
            <option value="EN PROCESO">EN PROCESO</option>
<option value="COMPLETADO">COMPLETADO</option>
<option value="ENVIADO CON NOVEDADES">ENVIADO CON NOVEDADES</option>
<option value="DESISTE">DESISTE</option>
<option value="NO APRUEBA EXAMEN">NO APRUEBA EXAMEN</option>
<option value="NO APRUEBA ESTUDIO">NO APRUEBA ESTUDIO</option>
<option value="NO APRUEBA POR CIFIN">NO APRUEBA POR CIFIN</option>
<option value="NO APRUEBA FAMILIARIDAD">NO APRUEBA FAMILIARIDAD</option>
<option value="PENDIENTE POR CONTRATAR">PENDIENTE POR CONTRATAR</option>
<option value="CANCELADO">CANCELADO</option>

          </select>
          {errors.estado && <p className="error">{errors.estado}</p>}
        </div>
 

  <div className="select-container">
    <label htmlFor="novedadPendiente">Novedad Pendiente</label>
    <select
      name="novedadPendiente"
      id="novedadPendiente"
      value={values.novedadPendiente}
      onChange={(e) => handleChange(e, 'novedadPendiente')}
    >
      <option value="">- Selecciona  -</option>
      <option value="VALIDACION DE TITULOS">VALIDACION DE TITULOS</option>
<option value="EXAMEN">EXAMEN</option>
<option value="INDUCCION">INDUCCION</option>
<option value="CIFIN">CIFIN</option>

    </select>
    {errors.novedadPendiente && <p className="error">{errors.novedadPendiente}</p>}
  </div>

        
        <div className="input-container">
          <label htmlFor="induccion">Inducción</label>
          <input
            type="text"
            id="induccion"
            name="induccion"
            placeholder="Inducción "
            value={values.induccion}
            onChange={(e) => handleChange(e, 'induccion')}
          />
          {errors.induccion && <p className="error">{errors.induccion}</p>}
        </div> 


        {/* Botón de envío */}
        <div className="button-container">
          <button type="submit" className="Guardar">Guardar</button>
          <button type="button" className="Cancelar" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default DatosPersonalesGestion;






