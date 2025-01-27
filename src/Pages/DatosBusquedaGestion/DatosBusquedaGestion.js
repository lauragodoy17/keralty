import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { format } from 'date-fns';
import { MdDeleteForever } from 'react-icons/md';
import { EditOutlined } from '@mui/icons-material';

function DatosBusquedaGestion() {
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
        user.auxiliares, 
        user.analista, 
        user.fechaInicioProcesoAnalista, 
        user.idRequisicion, 
        user.fechaAsignacionCH, 
        user.tipoProceso, 
        user.empresa, 
        user.nuevoReingreso ,
        user.ciudad, 
        user.fechaExpedicionCedula, 
        user.cedula, 
        user.nombreCandidato, 
        user.cargo, 
        user.correo, 
        user.celular, 
        user.tipoPlanta, 
        user.tiempoContrato, 
        user.fechaEnvioDocumentos, 
        user.recepcionDocumentosCandidato, 
        user.fechaProgramacionExamen, 
        user.fechaConceptoExamen, 
        user.fechaEnvioAYC, 
        user.fechaConceptoEstudioSeguridad, 
        user.fechaAsignacionAnalista, 
        user.estado, 
        user.novedadPendiente ,
        user.induccion 
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
          <label className="estado">Selecciona el auxiliar operativo *</label>
          <select
            className='select'
            value={selectedTable}
            onChange={handleTableChange}
          >
            <option value="">Selecciona uno</option>
            <option value="ANA_CESPEDES">ANA MARIA CESPEDES</option>
<option value="LAURA_BELEÑO">LAURA BELEÑO</option>
<option value="JUAN_NOVA">JUAN ANDRES NOVA</option>
<option value="NINI_SILVA">NINI JOHANA SILVA</option>
<option value="ANDREA_PENA">ANDREA PEÑA</option>
<option value="DAYANA_PINEDA">DAYANA PINEDA</option>
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
                  <TableCell>Auxiliares</TableCell>
<TableCell>Analista</TableCell>
<TableCell>Fecha Inicio Proceso Analista</TableCell>
<TableCell>id Requisicion</TableCell>
<TableCell>Fecha Asignacion CH</TableCell>
<TableCell>Tipo Proceso</TableCell>
<TableCell>Empresa</TableCell>
<TableCell>Nuevo o Reingreso</TableCell>
<TableCell>Ciudad</TableCell>
<TableCell>Fecha Expedición Cédula</TableCell>
<TableCell>Cédula</TableCell>
<TableCell>Nombre Candidato</TableCell>
<TableCell>Cargo</TableCell>
<TableCell>Correo</TableCell>
<TableCell>Celular</TableCell>
<TableCell>Tipo de Planta</TableCell>
<TableCell>Tiempo Contrato</TableCell>
<TableCell>Fecha Envio Documentos</TableCell>
<TableCell>Recepción Documentos Candidato</TableCell>
<TableCell>Fecha Programación Examen</TableCell>
<TableCell>Fecha Concepto Examen</TableCell>
<TableCell>Fecha Envio AYC</TableCell>
<TableCell>Fecha Concepto Estudio Seguridad</TableCell>
<TableCell>Fecha Asignacion Analista</TableCell>
<TableCell>Estado</TableCell>
<TableCell>Novedad Pendiente</TableCell>
<TableCell>Inducción</TableCell>
<TableCell>PORCENTAJE DE COMPLETADO</TableCell>


                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                    <TableRow key={index}>
<TableCell>{user.auxiliares}</TableCell>
<TableCell>{user.analista}</TableCell>
<TableCell>{formatDate(user.fechaInicioProcesoAnalista)}</TableCell>
<TableCell>{user.idRequisicion}</TableCell>
<TableCell>{formatDate(user.fechaAsignacionCH)}</TableCell>
<TableCell>{user.tipoProceso}</TableCell>
<TableCell>{user.empresa}</TableCell>
<TableCell>{user.nuevoReingreso}</TableCell>
<TableCell>{user.ciudad}</TableCell>
<TableCell>{formatDate(user.fechaExpedicionCedula)}</TableCell>
<TableCell>{user.cedula}</TableCell>
<TableCell>{user.nombreCandidato}</TableCell>
<TableCell>{user.cargo}</TableCell>
<TableCell>{user.correo}</TableCell>
<TableCell>{user.celular}</TableCell>
<TableCell>{user.tipoPlanta}</TableCell>
<TableCell>{user.tiempoContrato}</TableCell>
<TableCell>{formatDate(user.fechaEnvioDocumentos)}</TableCell>
<TableCell>{formatDate(user.recepcionDocumentosCandidato)}</TableCell>
<TableCell>{formatDate(user.fechaProgramacionExamen)}</TableCell>
<TableCell>{formatDate(user.fechaConceptoExamen)}</TableCell>
<TableCell>{formatDate(user.fechaEnvioAYC)}</TableCell>
<TableCell>{formatDate(user.fechaConceptoEstudioSeguridad)}</TableCell>
<TableCell>{formatDate(user.fechaAsignacionAnalista)}</TableCell>
<TableCell>{user.estado}</TableCell>
<TableCell>{user.novedadPendiente}</TableCell>
<TableCell>{user.induccion}</TableCell>

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

export default DatosBusquedaGestion;