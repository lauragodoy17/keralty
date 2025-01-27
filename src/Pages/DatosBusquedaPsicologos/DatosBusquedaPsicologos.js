import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { format } from 'date-fns';
import { MdDeleteForever } from 'react-icons/md';
import { EditOutlined } from '@mui/icons-material';

function DatosBusquedaPsicologos() {
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [body, setBody] = useState({});
  const [initialState, setInitialState] = useState({});
  const [mensaje, setMensaje] = useState({ message: '', type: '' });

  const getUsers = async () => {
    if (!selectedTable) return;
  
    try {
      const response = await axios.get('http://localhost:3080/datos', {
        params: { tabla: selectedTable }
      });
      
      console.log('Datos recibidos del servidor:', response.data.rows); // Verificar datos
      if (response.data.rows) {
        setUserList(response.data.rows);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  const calculateCompletionPercentage = (user) => {
    const fields = [
        user.fechaInicioProcesoAnalista,
        user.idRequisicion,
        user.fechaAsignacionConexionAuxOperativo,
        user.tipoIngreso,
        user.empresa,
        user.servicio,
        user.posicion,
        user.nuevoReingreso,
        user.ciudad,
        user.teletrabajo,
        user.fechaExpedicionCedula,
        user.cedula,
        user.nombreCandidato,
        user.cargo,
        user.correo,
        user.celular,
        user.tipoPlanta,
        user.tiempoContrato,
        user.fechaEnvioDocumentos,
        user.solicitudExamenMedico,
        user.fechaProgramacionExamenMedico,
        user.fechaConceptoExamenMedico,
        user.fechaProgramacionEstudioAYC,
        user.fechaConceptoEstudioSeguridad,
        user.fechaAsignacionAnalista,
        user.hojaVidaKeralty,
        user.cedulaPapel,
        user.infolaft,
        user.inhabilidades,
        user.certificadoBancario,
        user.certificadoEPS,
        user.certificadoPension,
        user.certificadoCesantias,
        user.certificadosLaborales,
        user.diplomaBachiller,
        user.actaBachiller,
        user.diplomaPregado,
        user.actaPregado,
        user.diplomaPosgrado,
        user.actaPosgrado,
        user.resolucionSecretariaSalud,
        user.tarjetaProfesional,
        user.rethus,
        user.violenciaSexual,
        user.gestionDuelo,
        user.ataquesQuimicos,
        user.donacionOrganos,
        user.tomaMuestrasCitologia,
        user.soporteVitalBasico,
        user.soporteVitalAvanzado,
        user.PALS,
        user.NALS,
        user.vacunasCovid,
        user.vacunasHepatitis,
        user.conceptoMedico,
        user.conceptoInformeFinal,
        user.sintesis,
        user.certificadoInduccion,
        user.cargaInhabilidades,
        user.observacionesAuxOperativo,
        user.fechaIngreso,
        user.estado
        
    ];
  
    const completedFields = fields.filter(
      (field) => field && field !== " "  && field !== "0000-00-00"
    ).length;
  
    const totalFields = fields.length;
    return (completedFields / totalFields) * 100;
  };
  useEffect(() => {
    if (selectedTable) {
      getUsers();
    }
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
      // Asegurarse de que el valor del filtro seleccionado está presente en el objeto `user`
      const userValue = user[selectedFilter] ? user[selectedFilter].toString().toLowerCase() : '';

      // Realizar la búsqueda
      return userValue.includes(searchValue);
  });


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return format(date, 'dd/MM/yyyy');
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
      getUsers(); 
      handleDialog(); 
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

  return (
    <div className='busqueda-propia-container'>
      <div className='Busqueda_Datos_Personal'>
        <h1>BUSQUEDA PARA DATOS PERSONALES Y ÚNICOS</h1>
        <div className="select-container">
          <label className="estado">Selecciona el psicólogo *</label>
          <select
            className='select'
            value={selectedTable}
            onChange={handleTableChange}
          >
            <option value="">Selecciona uno</option>

            <option value="TIBI">TIBI</option>
            <option value="JESSI">JESSI</option>
            <option value="ROS">ROS</option>
            <option value="ALE">ALE DUQUE</option>
            <option value="ANDRE">ANDRE</option>
            <option value="ELE">ELE</option>
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
            <option value="cedula">Búsqueda por cédula</option>
            <option value="empresa">Búsqueda por empresa</option>

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
                  <TableCell>fecha Inicio Proceso Analista</TableCell>
<TableCell>id Requisicion</TableCell>
<TableCell>fecha Asignacion Conexion Aux Operativo</TableCell>
<TableCell>tipo Ingreso</TableCell>
<TableCell>empresa</TableCell>
<TableCell>servicio</TableCell>
<TableCell>posicion</TableCell>
<TableCell>nuevo o Reingreso</TableCell>
<TableCell>ciudad</TableCell>
<TableCell>teletrabajo</TableCell>
<TableCell>fecha Expedicion Cedula</TableCell>
<TableCell>cedula</TableCell>
<TableCell>nombre Candidato</TableCell>
<TableCell>cargo</TableCell>
<TableCell>correo</TableCell>
<TableCell>celular</TableCell>
<TableCell>tipo Planta</TableCell>
<TableCell>tiempo Contrato</TableCell>
<TableCell>fecha Envio Documentos</TableCell>
<TableCell>solicitud Examen Medico</TableCell>
<TableCell>fecha Programacion Examen Medico</TableCell>
<TableCell>fecha Concepto Examen Medico</TableCell>
<TableCell>fecha Programacion Estudio AYC</TableCell>
<TableCell>fecha Concepto Estudio Seguridad</TableCell>
<TableCell>fecha Asignacion Analista</TableCell>
<TableCell>hoja Vida Keralty</TableCell>
<TableCell>cedula Papel</TableCell>
<TableCell>infolaft</TableCell>
<TableCell>inhabilidades</TableCell>
<TableCell>certificado Bancario</TableCell>
<TableCell>certificado EPS</TableCell>
<TableCell>certificado Pension</TableCell>
<TableCell>certificado Cesantias</TableCell>
<TableCell>certificados Laborales</TableCell>
<TableCell>diploma Bachiller</TableCell>
<TableCell>actaBachiller</TableCell>
<TableCell>diploma Pregado</TableCell>
<TableCell>acta Pregado</TableCell>
<TableCell>diploma Posgrado</TableCell>
<TableCell>acta Posgrado</TableCell>
<TableCell>resolucion Secretaria Salud</TableCell>
<TableCell>tarjeta Profesional</TableCell>
<TableCell>rethus</TableCell>
<TableCell>violencia Sexual</TableCell>
<TableCell>gestion Duelo</TableCell>
<TableCell>ataques Quimicos</TableCell>
<TableCell>donacion Organos</TableCell>
<TableCell>toma Muestras Citologia</TableCell>
<TableCell>soporte Vital Basico</TableCell>
<TableCell>soporte Vital Avanzado</TableCell>
<TableCell>PALS</TableCell>
<TableCell>NALS</TableCell>
<TableCell>vacunas Covid</TableCell>
<TableCell>Vacunas Hepatitis</TableCell>
<TableCell>Concepto médico</TableCell>
<TableCell>Concepto informe final</TableCell>
<TableCell>Sintesis</TableCell>
<TableCell>Certificado Inducción</TableCell>
<TableCell>Carga Inhabilidades</TableCell>
<TableCell>Observaciones Auxiliar Operativo</TableCell>
<TableCell>Fecha Ingreso</TableCell>
<TableCell>Estado</TableCell>
<TableCell>PORCENTAJE DE COMPLETADO</TableCell>



                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                    <TableRow key={index}>
<TableCell>{formatDate(user.fechaInicioProcesoAnalista)}</TableCell>
<TableCell>{user.idRequisicion}</TableCell>
<TableCell>{formatDate(user.fechaAsignacionConexionAuxOperativo)}</TableCell>
<TableCell>{user.tipoIngreso}</TableCell>
<TableCell>{user.empresa}</TableCell>
<TableCell>{user.servicio}</TableCell>
<TableCell>{user.posicion}</TableCell>
<TableCell>{user.nuevoReingreso}</TableCell>
<TableCell>{user.ciudad}</TableCell>
<TableCell>{user.teletrabajo}</TableCell>
<TableCell>{formatDate(user.fechaExpedicionCedula)}</TableCell>
<TableCell>{user.cedula}</TableCell>
<TableCell>{user.nombreCandidato}</TableCell>
<TableCell>{user.cargo}</TableCell>
<TableCell>{user.correo}</TableCell>
<TableCell>{user.celular}</TableCell>
<TableCell>{user.tipoPlanta}</TableCell>
<TableCell>{user.tiempoContrato}</TableCell>
<TableCell>{formatDate(user.fechaEnvioDocumentos)}</TableCell>
<TableCell>{formatDate(user.solicitudExamenMedico)}</TableCell>
<TableCell>{formatDate(user.fechaProgramacionExamenMedico)}</TableCell>
<TableCell>{formatDate(user.fechaConceptoExamenMedico)}</TableCell>
<TableCell>{formatDate(user.fechaProgramacionEstudioAYC)}</TableCell>
<TableCell>{formatDate(user.fechaConceptoEstudioSeguridad)}</TableCell>
<TableCell>{formatDate(user.fechaAsignacionAnalista)}</TableCell>
<TableCell>{user.hojaVidaKeralty}</TableCell>
<TableCell>{user.cedulaPapel}</TableCell>
<TableCell>{user.infolaft}</TableCell>
<TableCell>{user.inhabilidades}</TableCell>
<TableCell>{user.certificadoBancario}</TableCell>
<TableCell>{user.certificadoEPS}</TableCell>
<TableCell>{user.certificadoPension}</TableCell>
<TableCell>{user.certificadoCesantias}</TableCell>
<TableCell>{user.certificadosLaborales}</TableCell>
<TableCell>{user.diplomaBachiller}</TableCell>
<TableCell>{user.actaBachiller}</TableCell>
<TableCell>{user.diplomaPregado}</TableCell>
<TableCell>{user.actaPregado}</TableCell>
<TableCell>{user.diplomaPosgrado}</TableCell>
<TableCell>{user.actaPosgrado}</TableCell>
<TableCell>{user.resolucionSecretariaSalud}</TableCell>
<TableCell>{user.tarjetaProfesional}</TableCell>
<TableCell>{user.rethus}</TableCell>
<TableCell>{user.violenciaSexual}</TableCell>
<TableCell>{user.gestionDuelo}</TableCell>
<TableCell>{user.ataquesQuimicos}</TableCell>
<TableCell>{user.donacionOrganos}</TableCell>
<TableCell>{user.tomaMuestrasCitologia}</TableCell>
<TableCell>{user.soporteVitalBasico}</TableCell>
<TableCell>{user.soporteVitalAvanzado}</TableCell>
<TableCell>{user.PALS}</TableCell>
<TableCell>{user.NALS}</TableCell>
<TableCell>{user.vacunasCovid}</TableCell>
<TableCell>{user.vacunasHepatitis}</TableCell>
<TableCell>{user.conceptoMedico}</TableCell>
<TableCell>{user.conceptoInformeFinal}</TableCell>
<TableCell>{user.sintesis}</TableCell>
<TableCell>{user.certificadoInduccion}</TableCell>
<TableCell>{user.cargaInhabilidades}</TableCell>
<TableCell>{user.observacionesAuxOperativo}</TableCell>
<TableCell>{formatDate(user.fechaIngreso)}</TableCell>
<TableCell>{user.estado}</TableCell>
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
    </div>
  );
}

export default DatosBusquedaPsicologos;