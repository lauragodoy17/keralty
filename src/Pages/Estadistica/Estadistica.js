import './Estadistica.css'
import BusquedaPropia from '../DatosBusqueda/BusquedaPropia/BusquedaPropia'
import MainWrapper from '../../Components/MainWrapper';
import axios from 'axios';
import api from '../../Utils/Api';
import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { format, parseISO } from 'date-fns'
import * as XLSX from 'xlsx';


function Estadistica() {
  const [auth,setAuth]= useState(false);
  const [message, setMessage]=useState('')
  const [cedula, setCedula]= useState(' ')
  const navigate= useNavigate()
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [body, setBody] = useState({});
  const [data, setData]= useState([]);
  const [initialState, setInitialState] = useState({});
  const [mensaje, setMensaje] = useState({ message: '', type: '' });

    useEffect(()=> {
      axios.get(`${api}`)
      .then(res=> {
          if (res.data.Status === "Success"){
              setAuth(true)
              setCedula(res.data.cedula)
          } else{
              setAuth(false)
              setMessage(res.data.Error)
              navigate('/Inicio')
          }
      })
      .then(err=> console.log(err));
    },[])
  const handleDelete= ()=>{
    axios.get(`${api}/logout`)
    .then(res=> {
        window.location.reload(true);
    }).catch(err=>console.log(err));
  }
  const getUsers = async () => {
    if (!selectedTable) return;

    try {
      const response = await axios.get('http://localhost:3080/datos', {
        params: { tabla: selectedTable }
      });
      if (response.data.rows) {
        setUserList(response.data.rows);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [selectedTable]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
  };

  const filteredResults = !search
    ? userList
    : userList.filter(user => {
        const searchValue = search.toLowerCase();
        const userValue = user[selectedFilter] ? user[selectedFilter].toString().toLowerCase() : '';

        return userValue.includes(searchValue);
      });

      const formatDate = (dateString) => {
        if (!dateString) return '';
    
        const date = parseISO(dateString);
        
        if (isNaN(date.getTime())) return '';
    
        return format(date, 'yyyy-MM-dd'); // format to match <TextField> date format
      };


  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const onChange = (e) => {
    setBody({ ...body, [e.target.name]: e.target.value });
  };

  const onEdit = async () => {
    try {
      await axios.post('http://localhost:3080/Editar', { tabla: selectedTable, ...body });
      setMensaje({ message: 'Registro actualizado con éxito.', type: 'success' });
      getUsers(); // Refrescar la lista después de editar
      handleDialog(); // Cerrar el diálogo
    } catch (error) {
      setMensaje({ message: 'Error al actualizar el registro.', type: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
    XLSX.writeFile(workbook, 'reporte.xlsx');
  };
  

  return (
<div className='busqueda-propia-container'>
      <div className='Generar_reporte'>
        <h1>GENERAR REPORTE </h1>
        <div className="select-container">
          <label className="estado">Selecciona el periodo *</label>
          <select
            className='select'
            value={selectedTable}
            onChange={handleTableChange}
          >
            <option value="">Selecciona uno</option>

            <option value="consolidado">Consolidado</option>

          </select>
        </div>
        <div className="select-container">
          <label className="estado">Selecciona el campo para búsqueda *</label>
          <select
            className='select'
            name="estado"
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <option value="">- Selecciona uno -</option>
            <option value="documento">Búsqueda por cédula</option>
            <option value="empresa">Búsqueda por empresa</option>
            <option value="regional">Búsqueda por regional</option>
            <option value="posicion">Búsqueda por posición</option>
          </select>
        </div>
        <div className='input-container-filtro'>
          <input
            value={search}
            onChange={handleSearchChange}
            type='text'
            placeholder='Ingresa el dato a buscar'
          />
                    <Button variant="contained" color="primary" onClick={exportToExcel}>
            Exportar a Excel
          </Button>
          {search && (
            <TableContainer component={Paper} elevation={5} className="table-container">
              <Table className="table">
                <TableHead>
                  <TableRow>
                  <TableCell>AUXILIAR DE SELECCION</TableCell>
                  <TableCell>DOCUMENTO</TableCell>
                  <TableCell>NOMBRE COMPLETO</TableCell>
                    <TableCell>FECHA INGRESO</TableCell>
                    <TableCell>FECHA TERMINACION</TableCell>
                    <TableCell>REGIONAL</TableCell>
                    <TableCell>EMPRESA</TableCell>
                    <TableCell>CARGO</TableCell>
                    <TableCell>POSICION</TableCell>
                    <TableCell>TIPO GASTO</TableCell>
                    <TableCell>CENTRO COSTO</TableCell>
                    <TableCell>TIPO PLANTA</TableCell>
                    <TableCell>TIPO INGRESO</TableCell>
                    <TableCell>ANALISTA SELECCION</TableCell>
                    <TableCell>ESTADO</TableCell>
                    <TableCell>FOTOCOPIA DEL DOCUMENTO</TableCell>
                    <TableCell> HOJA DE VIDA</TableCell>
                    <TableCell>CERTIFICADOS LABORALES</TableCell>
                    <TableCell>FOTOCOPIA DE LA TARJETA PROFESIONAL</TableCell>
                    <TableCell>DIPLOMA O ACTA DE BACHILLER</TableCell>
                    <TableCell>DIPLOMA O ACTA DE TECNICO O TECNOLOGO</TableCell>
                    <TableCell>DIPLOMA O ACTA PROFESIONAL</TableCell>
                    <TableCell>DIPLOMA O ACTA DE ESPECIALIZACIÓN</TableCell>
                    <TableCell>CERTIFICADO DE ESTUDIOS</TableCell>
                    <TableCell>CERTIFICADO DE EPS</TableCell>
                    <TableCell>FECHA DE CERTIFICADO DE EPS</TableCell>
                    <TableCell>CERTIFICADO FONDO DE PENSIONES</TableCell>
                    <TableCell>FECHA CERTIFICADO FONDO DE PENSIONES</TableCell>
                    <TableCell>CERTIFICADO DE CESANTIAS</TableCell>
                    <TableCell> FECHA CERTIFICADO DE CESANTIAS</TableCell>
                    <TableCell>CERTIFICADO DE CUENTA BANCARIA</TableCell>
                    <TableCell> FECHA CERTIFICADO DE CUENTA BANCARIA</TableCell>
                    <TableCell>TARJETA OTORGADA POR LA SECRETARIA DE SALUD</TableCell>
                    <TableCell>RESOLUCION DE LA SECRETARIA DE SALUD</TableCell>
                    <TableCell>CARNET DE VACUNAS</TableCell>
                    <TableCell>APROBACIONES</TableCell>
                    <TableCell>CONFLICTO DE INTERES</TableCell>
                    <TableCell>PRUEBAS PSICOTÉCNICAS</TableCell>
                    <TableCell>ENTREVISTA DE SELECCIÓN</TableCell>
                    <TableCell>INFORME DE CORRELACIÓN DE CARGO</TableCell>
                    <TableCell>VISITA DOMICILIARIA</TableCell>
                    <TableCell>CARTA DE SEGURIDAD SOCIAL</TableCell>
                    <TableCell>INFOLAFT</TableCell>
                    <TableCell>FECHA CONSULTA DE INFOLAFT</TableCell>
                    <TableCell>INHABILIDADES</TableCell>
                    <TableCell>FECHA CONSULTA DE INHABILIDADES</TableCell>
                    <TableCell>CONSULTA DE APRENDIZAJE</TableCell>
                    <TableCell>CARTA DE PRESENTACIÓN DEL INSTITUTO O UNIVERSIDAD</TableCell>
                    <TableCell>EXAMÉN MÉDICO DE INGRESO</TableCell>
                    <TableCell>REPORTE CENTRALES DE RIESGO</TableCell>
                    <TableCell>RETHUS</TableCell>
                    <TableCell>INFORME FINAL DE ESTUDIO DE SEGURIDAD</TableCell>
                    <TableCell>AFILIACIÓN ARL</TableCell>
                    <TableCell>AFILIACIÓN CAJA</TableCell>
                    <TableCell>AFILIACIÓN EPS</TableCell>
                    <TableCell>CONTRATO FIRMADO</TableCell>
                    <TableCell>PERFIL DEL CARGO FIRMADO</TableCell>
                    <TableCell>PRORROGA</TableCell>
                    <TableCell>INDEFINIDO</TableCell>
                    <TableCell>POLIZA DE VIDA</TableCell>
                    <TableCell>SUSTITUCIÓN PATRONAL</TableCell>
                    <TableCell>CLAÚSULA ADICIONAL</TableCell>
                    <TableCell>COPIA DEL CERTIFICADO SOPORTE VITAL BASICO</TableCell>
                    <TableCell> FECHA VENCIMIENTO BLS</TableCell>
                    <TableCell>CERTIFICADO DEL SOPORTE VITAL AVANZADO VIGENTE</TableCell>
                    <TableCell>FECHA VENCIMIENTO ACLS</TableCell>
                    <TableCell>CURSO DE ATENCIÓN INTEGRAL PARA VICTIMAS DE VIOLENCIA DE GÉNERO</TableCell>
                    <TableCell>CURSO PALS</TableCell>
                    <TableCell>FECHA DE VENCIMIENTO DEL CURSO PALS</TableCell>
                    <TableCell>CURSO NALS</TableCell>
                    <TableCell>FECHA DE VENCIMIENTO DEL CURSO NALS</TableCell>
                    <TableCell>TOMA DE MUESTRAS DE LABORATORIO</TableCell>
                    <TableCell>CURSO DE PRIMEROS AUXILIOS O PRIMER RESPONDIENTE</TableCell>
                    <TableCell>CURSO DE CAMILLERO</TableCell>
                    <TableCell>INDUCCIÓN CORPORATIVA DE KERALTY</TableCell>
                    <TableCell>CURSO MANEJO DEL DUELO</TableCell>
                    <TableCell> CURSO PARA VICTIMAS DE ATAQUES CON AGENTES QUÍMICOS</TableCell>
                    <TableCell>CURSO DE DONACIÓN DE ÓRGANOS</TableCell>
                    <TableCell>CARTA DE PERSONAL RETIRADO</TableCell>
                    <TableCell>CARTA DE EXAMEN MEDICO DE EGRESO</TableCell>
                    <TableCell> CARTA DE ENTREGA DE SOPORTES DE PAGOS SGSS</TableCell>
                    <TableCell>CARTA RETIRO DE CESANTIAS </TableCell>
                    <TableCell>CARTA ACEPTACIÓN DE RENUNCIA</TableCell>
                    <TableCell>CARTA DE FASE FINAL</TableCell>
                    <TableCell>CERTIFICADO DE APORTE DE 3 MESES</TableCell>
                    <TableCell>LIQUIDACION</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.auxiliarSeleccion}</TableCell>
                      <TableCell>{user.documento}</TableCell>
                      <TableCell>{user.nombreCompleto}</TableCell>
                      <TableCell>{formatDate(user.fechaIngreso)}</TableCell>
                      <TableCell>{formatDate(user.fechaTerminacion)}</TableCell>
                      <TableCell>{user.regional}</TableCell>
                      <TableCell>{user.empresa}</TableCell>
                      <TableCell>{user.cargo}</TableCell>
                      <TableCell>{user.posicion}</TableCell>
                      <TableCell>{user.tipoGasto}</TableCell>
                      <TableCell>{user.centroCosto}</TableCell>
                      <TableCell>{user.tipoPlanta}</TableCell>
                      <TableCell>{user.tipoIngreso}</TableCell>
                      <TableCell>{user.analistaSeleccion}</TableCell>
                      <TableCell>{user.estado}</TableCell>   
                      <TableCell>{user.fotocopiaDocumento}</TableCell>
                      <TableCell>{user.hojaVida}</TableCell>
                      <TableCell>{user.certificadosLaborales}</TableCell>
                      <TableCell>{user.fotocopiaTarjetaProfesional}</TableCell>
                      <TableCell>{user.diplomaActaBachiller}</TableCell>
                      <TableCell>{user.diplomaActaTecnicoTecnologo}</TableCell>
                      <TableCell>{user.diplomaActaProfesional}</TableCell>
                      <TableCell>{user.diplomaActaEspecializacion}</TableCell>
                      <TableCell>{user.certificadoEstudios}</TableCell>
                      <TableCell>{user.certificadoEPS}</TableCell>
                      <TableCell>{formatDate(user.fechaCertificadoEPS)}</TableCell>
                      <TableCell>{user.certificadoFondoPensiones}</TableCell>
                      <TableCell>{formatDate(user.fechaCertificadoFondoPensiones)}</TableCell>
                      <TableCell>{user.certificadoFondoCesantias}</TableCell>
                      <TableCell>{formatDate(user.fechaCertificadoFondoCesantias)}</TableCell>
                      <TableCell>{user.certificadoCuentaBancaria}</TableCell>
                      <TableCell>{formatDate(user.fechaCertificadoCuentaBancaria)}</TableCell>
                      <TableCell>{user.tarjetaOtorgadaSecretariaSalud}</TableCell>
                      <TableCell>{user.resolucionSecretariaSalud}</TableCell>
                      <TableCell>{user.carnetVacunas}</TableCell>
                      <TableCell>{user.aprobaciones}</TableCell>
                      <TableCell>{user.conflictoInteres}</TableCell>
                      <TableCell>{user.pruebasPsicotecnicas}</TableCell>
                      <TableCell>{user.entrevistaSeleccion}</TableCell>
                      <TableCell>{user.informeCorrelacionCargo}</TableCell>
                      <TableCell>{user.visitaDomiciliaria}</TableCell>
                      <TableCell>{user.cartaSeguridadSocial}</TableCell>
                      <TableCell>{user.infolaft}</TableCell>
                      <TableCell>{formatDate(user.fechaConsultaInfolaft)}</TableCell>
                      <TableCell>{user.inhabilidades}</TableCell>
                      <TableCell>{formatDate(user.fechaConsultaInhabilidades)}</TableCell>
                      <TableCell>{user.consultaAprendizaje}</TableCell>
                      <TableCell>{user.cartaPresentacionInstitutoUniversidad}</TableCell>
                      <TableCell>{user.examenMedicoIngreso}</TableCell>
                      <TableCell>{user.reporteCentralesRiesgo}</TableCell>
                      <TableCell>{user.rethus}</TableCell>
                      <TableCell>{user.informeFinalEstudioSeguridad}</TableCell>
                      <TableCell>{user.afiliacionARL}</TableCell>
                      <TableCell>{user.afiliacionCaja}</TableCell>
                      <TableCell>{user.afiliacionEPS}</TableCell>
                      <TableCell>{user.contratoFirmado}</TableCell>
                      <TableCell>{user.perfilCargoFirmado}</TableCell>
                      <TableCell>{user.prorroga}</TableCell>
                      <TableCell>{user.indefinido}</TableCell>
                      <TableCell>{user.polizaVida}</TableCell>
                      <TableCell>{user.sustitucionPatronal}</TableCell>
                      <TableCell>{user.clausulaAdicional}</TableCell>
                      <TableCell>{user.copiaCertificadoSoporteVitalBasico}</TableCell>
                      <TableCell>{formatDate(user.fechaVencimientoBLS)}</TableCell>
                      <TableCell>{user.certificadoSoporteVitalAvanzadoVigente}</TableCell>
                      <TableCell>{formatDate(user.fechaVencimientoACLS)}</TableCell>
                      <TableCell>{user.cursoAtencionIntegralVictimasViolenciaGenero}</TableCell>
                      <TableCell>{user.cursoPALS}</TableCell>
                      <TableCell>{formatDate(user.fechaVencimientoCursoPALS)}</TableCell>
                      <TableCell>{user.cursoNALS}</TableCell>
                      <TableCell>{formatDate(user.fechaVencimientoCursoNALS)}</TableCell>
                      <TableCell>{user.tomaMuestrasLaboratorio}</TableCell>
                      <TableCell>{user.cursoPrimerosAuxilios}</TableCell>
                      <TableCell>{user.cursoCamillero}</TableCell>
                      <TableCell>{user.induccionCorporativaKeralty}</TableCell>
                      <TableCell>{user.cursoManejoDuelo}</TableCell>
                      <TableCell>{user.cursoVictimasAtaquesAgentesQuimicos}</TableCell>
                      <TableCell>{user.cursoDonacionOrganos}</TableCell>
                      <TableCell>{user.cartaPersonalRetirado}</TableCell>
                      <TableCell>{user.cartaExamenMedicoEgreso}</TableCell>
                      <TableCell>{user.cartaEntregaSoportesPagosSGSS}</TableCell>
                      <TableCell>{user.cartaRetiroCesantias}</TableCell>
                      <TableCell>{user.cartaAceptacionRenuncia}</TableCell>
                      <TableCell>{user.cartaFaseFinal}</TableCell>
                      <TableCell>{user.certificadoAportesTresMeses}</TableCell>
                      <TableCell>{user.liquidacion}</TableCell>


                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredResults.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleDialog}>
        <DialogTitle>Editar Registro</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {Object.keys(initialState).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={key}
                  name={key}
                  value={body[key] || ''}
                  onChange={onChange}
                  type={key.includes('fecha') ? 'date' : 'text'}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={onEdit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      {mensaje.message && (
        <div className={`alert ${mensaje.type}`}>
          <p>{mensaje.message}</p>
        </div>
      )}
                    <button className='boton_salir' onClick={handleDelete} >Cerrar sesión</button>

    </div>
  )
}

export default Estadistica