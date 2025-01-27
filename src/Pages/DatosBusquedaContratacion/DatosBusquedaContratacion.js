import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { format,parseISO } from 'date-fns';

function DatosBusquedaContratacion() {
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [shouldRefresh, setShouldRefresh] = useState(false);


  useEffect(() => {
    if (shouldRefresh) {
      getUsers(); 
      setShouldRefresh(false); 
    }
  }, [shouldRefresh]);

  
  
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
  const calculateCompletionPercentage = (user) => {
    const fields = [
        user.fechaAsignacion, 
        user.contratador, 
        user.analistaSeleccion, 
        user.auxiliarSeleccion, 
        user.tipoDocumento, 
        user.docTrabajador, 
        user.nombreEmpleado, 
        user.fechaIngreso, 
        user.fechaTermina, 
        user.nombreEmpresa, 
        user.prioridad, 
        user.nombreCargo, 
        user.posicion, 
        user.ciudades, 
        user.regional, 
        user.porcentajeSalario, 
        user.salario, 
        user.jornada, 
        user.tipoPlanta, 
        user.motivo, 
        user.fuente, 
        user.observacionSeleccion, 
        user.responsableSeleccion, 
        user.estado, 
        user.telefono, 
        user.correo, 
        user.estadoCivil, 
        user.fechaNacimiento, 
        user.direccion, 
        user.idIdentidad, 
        user.clausulaAdicional, 
        user.retefuente, 
        user.gen, 
        user.pa40EPS, 
        user.pa40ARP, 
        user.pa40AFP, 
        user.pa40CCF, 
        user.pa40AFC, 
        user.fechaEntregaGestionDocumental, 
        user.estadoProceso, 
        user.causalDevolucion, 
        user.fechaRevision, 
        user.estadoRevision, 
        user.revisadoEnviado, 
        user.fechaContratoEnvioFirmar, 
        user.contratoEnvioFirmar, 
        user.fechaContratoRecibidoFirmado, 
        user.contratoRecibidoFirmado, 
        user.fechaClausulaEnvioFirmar, 
        user.clausulaEnvioFirmar, 
        user.fechaRecibidoClausulaFirmada, 
        user.fechaRecibidoClausulaFirmada, 
        user.fechaPrimerSeguimiento, 
        user.primerSeguimiento, 
        user.fechaSegundoSegumiento, 
        user.segundoSegumiento, 
        user.envioInformeOnboarding, 
        user.fechaPorletRepositorio, 
        user.porletRepositorio, 
        user.recuperadoPor, 
        user.observacionRecuperacionContrato, 
        user.inconsistenciaCuadro, 
        user.tipoFirma, 
        user.fechaRadicadoEPS, 
        user.radicadoEPS, 
        user.fechaRecibidoEPS, 
        user.recibidoEPS, 
        user.fechaRepositorio, 
        user.repositorio, 
        user.fechaPorlet, 
        user.porlet, 
        user.inconsistencia, 
        user.fechaCambioEPS, 
        user.cambioEPS, 
        user.nuevaFechaIngresoEPS, 
        user.fechaRadicadoARL, 
        user.afiliacionARL, 
        user.fechaRepositorio1, 
        user.repositorio1, 
        user.porlet1, 
        user.inconsistencia1, 
        user.fechaCambioARL, 
        user.cambioARL, 
        user.nuevaFechaIngresoARL, 
        user.fechaRadicadoCCF, 
        user.afiliacionCCF, 
        user.fechaRecibidoCCF, 
        user.recibidoCCF, 
        user.fechaRepositorio2, 
        user.repositorio2, 
        user.fechaPorlet2, 
        user.porlet2, 
        user.inconsistencia2, 
        user.fechaCambioCaja, 
        user.cambioCaja, 
        user.nuevaFechaIngresoCaja, 
        user.afiliacionPensionesCesantias, 
        user.fechaPorletRepositorio2, 
        user.porletRepositorio2, 
        user.erroresPA40Contratacion, 
        user.inconsistenciaCuadro2        
    ];
  
    const completedFields = fields.filter(
      (field) => field && field !== "VACIO" && field !== "PENDIENTE" && field !== "0000-00-00"
    ).length;
  
    const totalFields = fields.length;
    return (completedFields / totalFields) * 100;
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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return format(date, 'dd/MM/yyyy');
  };

  const formatDateTime = (dateString, time = null) => {
    if (!dateString) return '';
  
    const date = parseISO(dateString);
  
    if (isNaN(date.getTime())) return '';
  
    if (time) {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59) {
        date.setHours(hours, minutes, seconds);
      } else {
        return 'Invalid time format';
      }
    }
  
    return format(date, 'yyyy-MM-dd HH:mm:ss'); // Formato con fecha y hora
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className='busqueda-propia-container'>
      <div className='Busqueda_Datos_Formacion'>
        <h1>BUSQUEDA PARA DATOS PERSONALES Y ÚNICOS</h1>
        <div className="select-container">
          <label className="estado">Selecciona el periodo *</label>
          <select
            className='select'
            value={selectedTable}
            onChange={handleTableChange}
          >
            <option value="">Selecciona uno</option>
    <option value="JULIO">JULIO 2024</option>
    <option value="AGOSTO">AGOSTO 2024</option>
    <option value="SEPTIEMBRE">SEPTIEMBRE 2024</option>
    <option value="OCTUBRE">OCTUBRE 2024</option>
    <option value="NOVIEMBRE">NOVIEMBRE 2024</option>
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
            <option value="docTrabajador">Búsqueda por cédula</option>
            <option value="nombreEmpresa">Búsqueda por empresa</option>
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
          {search && (
            <TableContainer component={Paper} elevation={5} className="table-container">
              <Table className="table">
                <TableHead>
                  <TableRow>
                  <TableCell>FECHA DE ASIGNACIÓN</TableCell>
<TableCell>CONTRATADOR</TableCell>
<TableCell>ANALISTA DE SELECCIÓN</TableCell>
<TableCell>AUXILIAR DE SELECCIÓN</TableCell>
<TableCell>TIPO DE DOCUMENTO</TableCell>
<TableCell>DOCUMENTO DEL TRABAJADOR</TableCell>
<TableCell>NOMBRE DEL EMPLEADO</TableCell>
<TableCell>FECHA DE INGRESO</TableCell>
<TableCell>FECHA DE TERMINACIÓN</TableCell>
<TableCell>NOMBRE DE LA EMPRESA</TableCell>
<TableCell>PRIORIDAD</TableCell>
<TableCell>NOMBRE DEL CARGO</TableCell>
<TableCell>POSICIÓN</TableCell>
<TableCell>CIUDADES</TableCell>
<TableCell>REGIONAL</TableCell>
<TableCell>PORCENTAJE DE SALARIO</TableCell>
<TableCell>SALARIO</TableCell>
<TableCell>JORNADA</TableCell>
<TableCell>TIPO DE PLANTA</TableCell>
<TableCell>MOTIVO</TableCell>
<TableCell>FUENTE</TableCell>
<TableCell>OBSERVACIÓN DE SELECCIÓN</TableCell>
<TableCell>RESPONSABLE DE SELECCIÓN</TableCell>
<TableCell>ESTADO</TableCell>
<TableCell>TELÉFONO</TableCell>
<TableCell>CORREO</TableCell>
<TableCell>ESTADO CIVIL</TableCell>
<TableCell>FECHA DE NACIMIENTO</TableCell>
<TableCell>DIRECCIÓN</TableCell>
<TableCell>ID DE IDENTIDAD</TableCell>
<TableCell>CLÁUSULA ADICIONAL</TableCell>
<TableCell>RETEFUENTE</TableCell>
<TableCell>GÉNERO</TableCell>
<TableCell>PA40 EPS</TableCell>
<TableCell>PA40 ARP</TableCell>
<TableCell>PA40 AFP</TableCell>
<TableCell>PA40 CCF</TableCell>
<TableCell>PA40 AFC</TableCell>
<TableCell>FECHA DE ENTREGA A GESTIÓN DOCUMENTAL</TableCell>
<TableCell>ESTADO DEL PROCESO</TableCell>
<TableCell>CAUSAL DE DEVOLUCIÓN</TableCell>
<TableCell>FECHA DE REVISIÓN</TableCell>
<TableCell>ESTADO DE REVISIÓN</TableCell>
<TableCell>REVISADO Y ENVIADO</TableCell>
<TableCell>FECHA DE ENVÍO DEL CONTRATO A FIRMAR</TableCell>
<TableCell>CONTRATO ENVIADO A FIRMAR</TableCell>
<TableCell>FECHA DE RECIBIDO DEL CONTRATO FIRMADO</TableCell>
<TableCell>CONTRATO RECIBIDO FIRMADO</TableCell>
<TableCell>FECHA DE ENVÍO DE LA CLÁUSULA A FIRMAR</TableCell>
<TableCell>CLÁUSULA ENVIADA A FIRMAR</TableCell>
<TableCell>FECHA DE RECIBIDO DE LA CLÁUSULA FIRMADA</TableCell>
<TableCell>FECHA DE PRIMER SEGUIMIENTO</TableCell>
<TableCell>PRIMER SEGUIMIENTO</TableCell>
<TableCell>FECHA DE SEGUNDO SEGUIMIENTO</TableCell>
<TableCell>SEGUNDO SEGUIMIENTO</TableCell>
<TableCell>ENVÍO DE INFORME DE ONBOARDING</TableCell>
<TableCell>FECHA DEL PORLET EN REPOSITORIO</TableCell>
<TableCell>PORLET EN REPOSITORIO</TableCell>
<TableCell>RECUPERADO POR</TableCell>
<TableCell>OBSERVACIÓN DE RECUPERACIÓN DEL CONTRATO</TableCell>
<TableCell>INCONSISTENCIA EN EL CUADRO</TableCell>
<TableCell className="table-cell">TIPO DE FIRMA</TableCell>
{(selectedTable  === 'OCTUBRE' || selectedTable === 'NOVIEMBRE'|| selectedTable === 'SEPTIEMBRE') && (
<>
<TableCell>FECHA DE RADICADO EPS</TableCell>
<TableCell>RADICADO EPS</TableCell>
<TableCell>FECHA DE RECIBIDO EPS</TableCell>
<TableCell>RECIBIDO EPS</TableCell>
<TableCell>FECHA DE REPOSITORIO</TableCell>
<TableCell>REPOSITORIO</TableCell>
<TableCell>FECHA DEL PORLET</TableCell>
<TableCell>PORLET</TableCell>
<TableCell>INCONSISTENCIA</TableCell>
<TableCell>FECHA DE CAMBIO DE EPS</TableCell>
<TableCell>CAMBIO DE EPS</TableCell>
<TableCell>NUEVA FECHA DE INGRESO EPS</TableCell>
<TableCell>FECHA DE RADICADO ARL</TableCell>
<TableCell>AFILIACIÓN ARL</TableCell>
<TableCell>FECHA DE REPOSITORIO 1</TableCell>
<TableCell>REPOSITORIO 1</TableCell>
<TableCell>PORLET 1</TableCell>
<TableCell>INCONSISTENCIA 1</TableCell>
<TableCell>FECHA DE CAMBIO ARL</TableCell>
<TableCell>CAMBIO ARL</TableCell>
<TableCell>NUEVA FECHA DE INGRESO ARL</TableCell>
<TableCell>FECHA DE RADICADO CCF</TableCell>
<TableCell>AFILIACIÓN CCF</TableCell>
<TableCell>FECHA DE RECIBIDO CCF</TableCell>
<TableCell>RECIBIDO CCF</TableCell>
<TableCell>FECHA DE REPOSITORIO 2</TableCell>
<TableCell>REPOSITORIO 2</TableCell>
<TableCell>FECHA DEL PORLET 2</TableCell>
<TableCell>PORLET 2</TableCell>
<TableCell>INCONSISTENCIA 2</TableCell>
<TableCell>FECHA DE CAMBIO CAJA</TableCell>
<TableCell>CAMBIO CAJA</TableCell>
<TableCell>NUEVA FECHA DE INGRESO CAJA</TableCell>
<TableCell>AFILIACIÓN PENSIONES Y CESANTÍAS</TableCell>
<TableCell>FECHA DEL PORLET EN REPOSITORIO 2</TableCell>
<TableCell>PORLET EN REPOSITORIO 2</TableCell>
<TableCell>ERRORES PA40 EN CONTRATACIÓN</TableCell>
<TableCell>INCONSISTENCIA EN EL CUADRO 2</TableCell>

</>
)}
<TableCell>PORCENTAJE DE COMPLETADO</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                    <TableRow key={index}>
                     <TableCell>{formatDate(user.fechaAsignacion)}</TableCell>
<TableCell>{user.contratador}</TableCell>
<TableCell>{user.analistaSeleccion}</TableCell>
<TableCell>{user.auxiliarSeleccion}</TableCell>
<TableCell>{user.tipoDocumento}</TableCell>
<TableCell>{user.docTrabajador}</TableCell>
<TableCell>{user.nombreEmpleado}</TableCell>
<TableCell>{formatDate(user.fechaIngreso)}</TableCell>
<TableCell>{formatDate(user.fechaTermina)}</TableCell>
<TableCell>{user.nombreEmpresa}</TableCell>
<TableCell>{user.prioridad}</TableCell>
<TableCell>{user.nombreCargo}</TableCell>
<TableCell>{user.posicion}</TableCell>
<TableCell>{user.ciudades}</TableCell>
<TableCell>{user.regional}</TableCell>
<TableCell>{user.porcentajeSalario}</TableCell>
<TableCell>{user.salario}</TableCell>
<TableCell>{user.jornada}</TableCell>
<TableCell>{user.tipoPlanta}</TableCell>
<TableCell>{user.motivo}</TableCell>
<TableCell>{user.fuente}</TableCell>
<TableCell>{user.observacionSeleccion}</TableCell>
<TableCell>{user.responsableSeleccion}</TableCell>
<TableCell>{user.estado}</TableCell>
<TableCell>{user.telefono}</TableCell>
<TableCell>{user.correo}</TableCell>
<TableCell>{user.estadoCivil}</TableCell>
<TableCell>{formatDate(user.fechaNacimiento)}</TableCell>
<TableCell>{user.direccion}</TableCell>
<TableCell>{user.idIdentidad}</TableCell>
<TableCell>{user.clausulaAdicional}</TableCell>
<TableCell>{user.retefuente}</TableCell>
<TableCell>{user.gen}</TableCell>
<TableCell>{user.pa40EPS}</TableCell>
<TableCell>{user.pa40ARP}</TableCell>
<TableCell>{user.pa40AFP}</TableCell>
<TableCell>{user.pa40CCF}</TableCell>
<TableCell>{user.pa40AFC}</TableCell>
<TableCell>{formatDateTime(user.fechaEntregaGestionDocumental)}</TableCell>
<TableCell>{user.estadoProceso}</TableCell>
<TableCell>{user.causalDevolucion}</TableCell>
<TableCell>{formatDateTime(user.fechaRevision)}</TableCell>
<TableCell>{user.estadoRevision}</TableCell>
<TableCell>{user.revisadoEnviado}</TableCell>
<TableCell>{formatDateTime(user.fechaContratoEnvioFirmar)}</TableCell>
<TableCell>{user.contratoEnvioFirmar}</TableCell>
<TableCell>{formatDateTime(user.fechaContratoRecibidoFirmado)}</TableCell>
<TableCell>{user.contratoRecibidoFirmado}</TableCell>
<TableCell>{formatDateTime(user.fechaClausulaEnvioFirmar)}</TableCell>
<TableCell>{user.clausulaEnvioFirmar}</TableCell>
<TableCell>{formatDateTime(user.fechaRecibidoClausulaFirmada)}</TableCell>
<TableCell>{formatDateTime(user.fechaPrimerSeguimiento)}</TableCell>
<TableCell>{user.primerSeguimiento}</TableCell>
<TableCell>{formatDateTime(user.fechaSegundoSegumiento)}</TableCell>
<TableCell>{user.segundoSegumiento}</TableCell>
<TableCell>{user.envioInformeOnboarding}</TableCell>
<TableCell>{formatDateTime(user.fechaPorletRepositorio)}</TableCell>
<TableCell>{user.porletRepositorio}</TableCell>
<TableCell>{user.recuperadoPor}</TableCell>
<TableCell>{user.observacionRecuperacionContrato}</TableCell>
<TableCell>{user.inconsistenciaCuadro}</TableCell>
<TableCell>{user.tipoFirma}</TableCell>
{(selectedTable  === 'OCTUBRE' || selectedTable === 'NOVIEMBRE'|| selectedTable === 'SEPTIEMBRE') && (
  <>
<TableCell>{formatDateTime(user.fechaRadicadoEPS)}</TableCell>
<TableCell>{user.radicadoEPS}</TableCell>
<TableCell>{formatDate(user.fechaRecibidoEPS)}</TableCell>
<TableCell>{user.recibidoEPS}</TableCell>
<TableCell>{formatDateTime(user.fechaRepositorio)}</TableCell>
<TableCell>{user.repositorio}</TableCell>
<TableCell>{formatDateTime(user.fechaPorlet)}</TableCell>
<TableCell>{user.porlet}</TableCell>
<TableCell>{user.inconsistencia}</TableCell>
<TableCell>{formatDateTime(user.fechaCambioEPS)}</TableCell>
<TableCell>{user.cambioEPS}</TableCell>
<TableCell>{formatDateTime(user.nuevaFechaIngresoEPS)}</TableCell>
<TableCell>{formatDateTime(user.fechaRadicadoARL)}</TableCell>
<TableCell>{user.afiliacionARL}</TableCell>
<TableCell>{formatDateTime(user.fechaRepositorio1)}</TableCell>
<TableCell>{user.repositorio1}</TableCell>
<TableCell>{user.porlet1}</TableCell>
<TableCell>{user.inconsistencia1}</TableCell>
<TableCell>{formatDateTime(user.fechaCambioARL)}</TableCell>
<TableCell>{user.cambioARL}</TableCell>
<TableCell>{formatDateTime(user.nuevaFechaIngresoARL)}</TableCell>
<TableCell>{formatDateTime(user.fechaRadicadoCCF)}</TableCell>
<TableCell>{user.afiliacionCCF}</TableCell>
<TableCell>{formatDateTime(user.fechaRecibidoCCF)}</TableCell>
<TableCell>{user.recibidoCCF}</TableCell>
<TableCell>{formatDateTime(user.fechaRepositorio2)}</TableCell>
<TableCell>{user.repositorio2}</TableCell>
<TableCell>{formatDateTime(user.fechaPorlet2)}</TableCell>
<TableCell>{user.porlet2}</TableCell>
<TableCell>{user.inconsistencia2}</TableCell>
<TableCell>{formatDateTime(user.fechaCambioCaja)}</TableCell>
<TableCell>{user.cambioCaja}</TableCell>
<TableCell>{formatDate(user.nuevaFechaIngresoCaja)}</TableCell>
<TableCell>{user.afiliacionPensionesCesantias}</TableCell>
<TableCell>{formatDateTime(user.fechaPorletRepositorio2)}</TableCell>
<TableCell>{user.porletRepositorio2}</TableCell>
<TableCell>{user.erroresPA40Contratacion}</TableCell>
<TableCell>{user.inconsistenciaCuadro2}</TableCell>
</>
)}
                      <TableCell>{calculateCompletionPercentage(user).toFixed(2)}%</TableCell>
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
    </div>
  );
}

export default DatosBusquedaContratacion;