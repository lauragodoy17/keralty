import './ModificarDatosFormacion.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { EditOutlined, DeleteForever as MdDeleteForever } from '@mui/icons-material';
import swal from 'sweetalert';


function ModificarDatosFormacion() {
  const initialState = {
    copiaCertificadoSoporteVitalBasico:'',
    fechaVencimientoBLS:'',
    certificadoSoporteVitalAvanzadoVigente:'',
    fechaVencimientoACLS:'',
    cursoAtencionIntegralVictimasViolenciaGenero:'',
    cursoPALS:'',
    fechaVencimientoCursoPALS:'', 
    cursoNALS:'',
    fechaVencimientoCursoNALS:'',
    tomaMuestrasLaboratorio:'',
    cursoPrimerosAuxilios:'',
    cursoCamillero:'',
    induccionCorporativaKeralty:'',
    cursoManejoDuelo:'', 
    cursoVictimasAtaquesAgentesQuimicos:'',
    cursoDonacionOrganos:''
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

    const date = parseISO(dateString);
    
    if (isNaN(date.getTime())) return '';

    return format(date, 'yyyy-MM-dd'); // format to match <TextField> date format
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
      const { data } = await axios.post('http://localhost:3080/EditarFormacion', {
        ...body,
        tabla: selectedTable
      });
  
      setMensaje({
        ident: new Date().getTime(),
        message: data.message,
        type: 'success'
      });
  
      setUserList(prevList => prevList.map(user =>
        user.id === body.id ? { ...user, ...body } : user
      ));
  
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

      // Remove deleted item from userList
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
        <h1>MODIFICACIÓN PARA DATOS DE FORMACIÓN</h1>
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
                    <TableCell>ACCIONES</TableCell>

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
    <InputLabel>Copia certificado Soporte Vital Básico</InputLabel>
    <Select
      name="copiaCertificadoSoporteVitalBasico"
      value={body.copiaCertificadoSoporteVitalBasico}
      onChange={e => onChange({ target: { name: 'copiaCertificadoSoporteVitalBasico', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO APLICA">NO APLICA</MenuItem>

    </Select>
  </FormControl>
</Grid>


      <Grid item xs={12} sm={6}>
        <TextField
          name="fechaVencimientoBLS"
          label="Fecha Vencimiento BLS"
          type="date"
          value={formatDate(body.fechaVencimientoBLS)}
          onChange={e => onChange({ target: { name: 'fechaVencimientoBLS', value: e.target.value } })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Certificado Soporte Vital Avanzado Vigente</InputLabel>
          <Select
            name="certificadoSoporteVitalAvanzadoVigente"
            value={body.certificadoSoporteVitalAvanzadoVigente}
            onChange={e => onChange({ target: { name: 'certificadoSoporteVitalAvanzadoVigente', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="fechaVencimientoACLS"
          label="Fecha Vencimiento ACLS"
          type="date"
          value={formatDate(body.fechaVencimientoACLS)}
          onChange={e => onChange({ target: { name: 'fechaVencimientoACLS', value: e.target.value } })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Curso Atención Integral Víctimas Violencia Género</InputLabel>
          <Select
            name="cursoAtencionIntegralVictimasViolenciaGenero"
            value={body.cursoAtencionIntegralVictimasViolenciaGenero}
            onChange={e => onChange({ target: { name: 'cursoAtencionIntegralVictimasViolenciaGenero', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Curso PALS</InputLabel>
          <Select
            name="cursoPALS"
            value={body.cursoPALS}
            onChange={e => onChange({ target: { name: 'cursoPALS', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="fechaVencimientoCursoPALS"
          label="Fecha Vencimiento Curso PALS"
          type="date"
          value={formatDate(body.fechaVencimientoCursoPALS)}
          onChange={e => onChange({ target: { name: 'fechaVencimientoCursoPALS', value: e.target.value } })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Curso NALS</InputLabel>
          <Select
            name="cursoNALS"
            value={body.cursoNALS}
            onChange={e => onChange({ target: { name: 'cursoNALS', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="fechaVencimientoCursoNALS"
          label="Fecha Vencimiento Curso NALS"
          type="date"
          value={formatDate(body.fechaVencimientoCursoNALS)}
          onChange={e => onChange({ target: { name: 'fechaVencimientoCursoNALS', value: e.target.value } })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Toma Muestras Laboratorio</InputLabel>
          <Select
            name="tomaMuestrasLaboratorio"
            value={body.tomaMuestrasLaboratorio}
            onChange={e => onChange({ target: { name: 'tomaMuestrasLaboratorio', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Curso Primeros Auxilios</InputLabel>
          <Select
            name="cursoPrimerosAuxilios"
            value={body.cursoPrimerosAuxilios}
            onChange={e => onChange({ target: { name: 'cursoPrimerosAuxilios', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Curso Camillero</InputLabel>
          <Select
            name="cursoCamillero"
            value={body.cursoCamillero}
            onChange={e => onChange({ target: { name: 'cursoCamillero', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Inducción Corporativa Keralty</InputLabel>
          <Select
            name="induccionCorporativaKeralty"
            value={body.induccionCorporativaKeralty}
            onChange={e => onChange({ target: { name: 'induccionCorporativaKeralty', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Curso Manejo del Duelo</InputLabel>
          <Select
            name="cursoManejoDuelo"
            value={body.cursoManejoDuelo}
            onChange={e => onChange({ target: { name: 'cursoManejoDuelo', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Curso Víctimas Ataques Agentes Químicos</InputLabel>
          <Select
            name="cursoVictimasAtaquesAgentesQuimicos"
            value={body.cursoVictimasAtaquesAgentesQuimicos}
            onChange={e => onChange({ target: { name: 'cursoVictimasAtaquesAgentesQuimicos', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Curso Donación de Órganos</InputLabel>
          <Select
            name="cursoDonacionOrganos"
            value={body.cursoDonacionOrganos}
            onChange={e => onChange({ target: { name: 'cursoDonacionOrganos', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
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
export default ModificarDatosFormacion