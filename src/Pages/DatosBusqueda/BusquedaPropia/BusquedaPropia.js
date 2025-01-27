import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { format } from 'date-fns';
import { MdDeleteForever } from 'react-icons/md';
import { EditOutlined } from '@mui/icons-material';
import './BusquedaPropia.css'; 

function BusquedaPropia() {
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
  const calculateCompletionPercentage = (user) => {
    const fields = [
      user.auxiliarSeleccion,
      user.documento,
      user.nombreCompleto,
      user.fechaIngreso,
      user.fechaTerminacion,
      user.regional,
      user.empresa,
      user.cargo,
      user.posicion,
      user.tipoGasto,
      user.centroCosto,
      user.tipoPlanta,
      user.tipoIngreso,
      user.analistaSeleccion,
      user.estado
    ];
  
    const completedFields = fields.filter(
      (field) => field && field !== "VACIO" && field !== "PENDIENTE" && field !== "0000-00-00"
    ).length;
  
    const totalFields = fields.length;
    return (completedFields / totalFields) * 100;
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

  return (
    <div className='busqueda-propia-container'>
      <div className='Busqueda_Datos_Personal'>
        <h1>BUSQUEDA PARA DATOS PERSONALES Y ÚNICOS</h1>
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
                    <TableCell>PORCENTAJE DE COMPLETADO</TableCell>

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

export default BusquedaPropia;








