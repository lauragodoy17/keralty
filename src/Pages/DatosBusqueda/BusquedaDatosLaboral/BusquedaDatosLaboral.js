import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { format } from 'date-fns';import { InputCard } from '../../../Components/InputCard';
import './BusquedaDatosLaboral.css'
import InputComponent from '../../../Components/InputCedula';

function BusquedaDatosLaboral() {
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
  const calculateCompletionPercentage = (user) => {
    const fields = [
      user.copiaCertificadoSoporteVitalBasico,
      user.fechaVencimientoBLS,
      user.certificadoSoporteVitalAvanzadoVigente,
      user.fechaVencimientoACLS,
      user.cursoAtencionIntegralVictimasViolenciaGenero,
      user.cursoPALS,
      user.fechaVencimientoCursoPALS, 
      user.cursoNALS,
      user.fechaVencimientoCursoNALS,
      user.tomaMuestrasLaboratorio,
      user.cursoPrimerosAuxilios,
      user.cursoCamillero,
      user.induccionCorporativaKeralty,
      user.cursoManejoDuelo, 
      user.cursoVictimasAtaquesAgentesQuimicos,
      user.cursoDonacionOrganos
    ];
  
    const completedFields = fields.filter(
      (field) => field && field !== "VACIO" && field !== "PENDIENTE" && field !== "0000-00-00"
    ).length;
  
    const totalFields = fields.length;
    return (completedFields / totalFields) * 100;
  };


  return (
    <div className='busqueda-propia-container'>
      <div className='Busqueda_Datos_Laboral'>
        <h1>BUSQUEDA PARA DATOS DE FORMACIÓN </h1>
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
          {search && (
            <TableContainer component={Paper} elevation={5} className="table-container">
              <Table className="table">
                <TableHead>
                  <TableRow>
                    <TableCell>DOCUMENTO</TableCell>
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
                    <TableCell>PORCENTAJE DE COMPLETADO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.documento}</TableCell>
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

export default BusquedaDatosLaboral