import './ModificarDatosNomina.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { format } from 'date-fns';
import { EditOutlined, DeleteForever as MdDeleteForever } from '@mui/icons-material';
import swal from 'sweetalert';

function ModificarDatosNomina() {
  const initialState = {
    cartaPersonalRetirado: '',
    cartaExamenMedicoEgreso:'',
    cartaEntregaSoportesPagosSGSS:'',
    cartaRetiroCesantias:'',
    cartaAceptacionRenuncia:'',
    cartaFaseFinal:'',
    certificadoAporteTresMeses: '', 
    liquidacion: '',    
  };

  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [body, setBody] = useState(initialState);
  const [openDialog, setOpenDialog] = useState(false);
  const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getUsers = async () => {
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
    if (selectedTable) {
      getUsers();
    }
  }, [selectedTable]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return format(date, 'dd/MM/yyyy');
  };

  const handleDialog = () => {
    setOpenDialog(prev => !prev);
  };

  const onChange = ({ target }) => {
    const { name, value } = target;
    setBody({
      ...body,
      [name]: value
    });
  };

  const onEdit = async () => {
    try {
      const { data } = await axios.post('http://localhost:3080/EditarNomina', {
        ...body,
        tabla: selectedTable
      });
  
      setMensaje({
        ident: new Date().getTime(),
        message: data.message,
        type: 'success'
      });
  
      getUsers();
      handleDialog();
      setBody(initialState);
    } catch (error) {
      console.error('Error updating data:', error);
      setMensaje({
        ident: new Date().getTime(),
        message: error.response ? error.response.data.Error : 'Error al actualizar los datos',
        type: 'error'
      });
    }
  };
  
  
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const filteredResults = !search
    ? userList
    : userList.filter(user => {
        const searchValue = search.toLowerCase();
        const userValue = user[selectedFilter] ? user[selectedFilter].toString().toLowerCase() : '';

        return userValue.includes(searchValue);
    });

  const handleEditClick = (user) => {
    setBody(user);
    handleDialog();
  };

  const handleDeleteClick = (id) => {
    swal({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      buttons: ['Cancelar', 'Sí, eliminar'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        onDelete(id).then(() => {
          swal('Eliminado!', 'El elemento ha sido eliminado.', 'success');
        }).catch((err) => {
          console.error(err);
          swal('Error', 'Hubo un problema al eliminar el elemento.', 'error');
        });
      }
    });
  };

  const onDelete = async (id) => {
    try {
      const { data } = await axios.post('http://localhost:3080/Eliminar', { id });
      console.log(data.message);

      setUserList(prevList => prevList.filter(user => user.id !== id));
    } catch (err) {
      console.log(err);
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
      <div className='Busqueda_Datos_Formacion'>
        <h1>MODIFICACIÓN PARA DATOS DE NÓMINA</h1>
        <div className="select-container">
          <label className="estado">Selecciona el periodo *</label>
          <select
            className='select'
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="">Selecciona uno</option>           
            <option value="noviembre_diciembre_2023">Noviembre-Diciembre 2023</option>
            <option value="enero_marzo_2024">Enero-Marzo 2024</option>
            <option value="abril_junio">Abril-Junio 2024</option>
            <option value="julio_septiembre">Julio-Septiembre 2024</option>


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
                    <TableCell>CARTA DE PERSONAL RETIRADO</TableCell>
                    <TableCell>CARTA DE EXAMEN MEDICO DE EGRESO</TableCell>
                    <TableCell> CARTA DE ENTREGA DE SOPORTES DE PAGOS SGSS</TableCell>
                    <TableCell>CARTA RETIRO DE CESANTIAS </TableCell>
                    <TableCell>CARTA ACEPTACIÓN DE RENUNCIA</TableCell>
                    <TableCell>CARTA DE FASE FINAL</TableCell>
                    <TableCell>CERTIFICADO DE APORTE DE 3 MESES</TableCell>
                    <TableCell>LIQUIDACION</TableCell>
                    <TableCell>ACCIONES</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.documento}</TableCell>
                      <TableCell>{user.cartaPersonalRetirado}</TableCell>
                      <TableCell>{user.cartaExamenMedicoEgreso}</TableCell>
                      <TableCell>{user.cartaEntregaSoportesPagosSGSS}</TableCell>
                      <TableCell>{user.cartaRetiroCesantias}</TableCell>
                      <TableCell>{user.cartaAceptacionRenuncia}</TableCell>
                      <TableCell>{user.cartaFaseFinal}</TableCell>
                      <TableCell>{user.certificadoAportesTresMeses}</TableCell>
                      <TableCell>{user.liquidacion}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEditClick(user)}
                          startIcon={<EditOutlined />}
                        >
                          Editar
                        </Button>
                        <IconButton color='secondary' onClick={() => handleDeleteClick(user.id)}>
                          <MdDeleteForever />
                        </IconButton>
                      </TableCell>
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

      <Dialog open={openDialog} onClose={handleDialog} maxWidth="md">
          <DialogTitle>Modificar Datos Personales</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
       <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Carta Personal Retirado</InputLabel>
          <Select
            name="cartaPersonalRetirado"
            value={body.cartaPersonalRetirado}
            onChange={e => onChange({ target: { name: 'cartaPersonalRetirado', value: e.target.value } })}
          >
            <MenuItem value="VACIO">VACIO</MenuItem>
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
            <MenuItem value="INGRESO ERRADO">INGRESO ERRADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Carta Examen Médico de Egreso */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Carta Examen Médico de Egreso</InputLabel>
          <Select
            name="cartaExamenMedicoEgreso"
            value={body.cartaExamenMedicoEgreso}
            onChange={e => onChange({ target: { name: 'cartaExamenMedicoEgreso', value: e.target.value } })}
          >
            <MenuItem value="VACIO">VACIO</MenuItem>
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
            <MenuItem value="INGRESO ERRADO">INGRESO ERRADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Carta Entrega Soportes Pagos SGSS */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Carta Entrega Soportes Pagos SGSS</InputLabel>
          <Select
            name="cartaEntregaSoportesPagosSGSS"
            value={body.cartaEntregaSoportesPagosSGSS}
            onChange={e => onChange({ target: { name: 'cartaEntregaSoportesPagosSGSS', value: e.target.value } })}
          >
            <MenuItem value="VACIO">VACIO</MenuItem>
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
            <MenuItem value="INGRESO ERRADO">INGRESO ERRADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Carta Retiro Cesantías */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Carta Retiro Cesantías</InputLabel>
          <Select
            name="cartaRetiroCesantias"
            value={body.cartaRetiroCesantias}
            onChange={e => onChange({ target: { name: 'cartaRetiroCesantias', value: e.target.value } })}
          >
            <MenuItem value="VACIO">VACIO</MenuItem>
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
            <MenuItem value="INGRESO ERRADO">INGRESO ERRADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Carta Aceptación Renuncia */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Carta Aceptación Renuncia</InputLabel>
          <Select
            name="cartaAceptacionRenuncia"
            value={body.cartaAceptacionRenuncia}
            onChange={e => onChange({ target: { name: 'cartaAceptacionRenuncia', value: e.target.value } })}
          >
            <MenuItem value="VACIO">VACIO</MenuItem>
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
            <MenuItem value="INGRESO ERRADO">INGRESO ERRADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Carta Fase Final */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Carta Fase Final</InputLabel>
          <Select
            name="cartaFaseFinal"
            value={body.cartaFaseFinal}
            onChange={e => onChange({ target: { name: 'cartaFaseFinal', value: e.target.value } })}
          >
            <MenuItem value="VACIO">VACIO</MenuItem>
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
            <MenuItem value="INGRESO ERRADO">INGRESO ERRADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Certificado Aporte Tres Meses */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Certificado Aporte Tres Meses</InputLabel>
          <Select
            name="certificadoAporteTresMeses"
            value={body.certificadoAporteTresMeses}
            onChange={e => onChange({ target: { name: 'certificadoAporteTresMeses', value: e.target.value } })}
          >
            <MenuItem value="VACIO">VACIO</MenuItem>
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
            <MenuItem value="INGRESO ERRADO">INGRESO ERRADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Liquidación */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Liquidación</InputLabel>
          <Select
            name="liquidacion"
            value={body.liquidacion}
            onChange={e => onChange({ target: { name: 'liquidacion', value: e.target.value } })}
          >
            <MenuItem value="VACIO">VACIO</MenuItem>
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
            <MenuItem value="INGRESO ERRADO">INGRESO ERRADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>
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

export default ModificarDatosNomina
