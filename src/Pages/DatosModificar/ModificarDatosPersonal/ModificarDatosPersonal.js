import './ModificarDatosPersonal.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, FormControl, InputLabel, Select, MenuItem  } from '@mui/material';
import { format, parseISO} from 'date-fns';
import { EditOutlined, DeleteForever as MdDeleteForever } from '@mui/icons-material';
import swal from 'sweetalert';


function ModificarDatosPersonal() {
  const initialState = {
    fotocopiaDocumento: '',
    hojaVida:'',
    certificadosLaborales:'',
    fotocopiaTarjetaProfesional:'',
    diplomaActaBachiller:'',
    diplomaActaProfesional:'',
    diplomaActaEspecializacion: '', 
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
    resolucionSecretariaSalud:'',
    carnetVacunas:''  
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
      const { data } = await axios.post('http://localhost:3080/EditarPersonal', {
        ...body,
        tabla: selectedTable
      });
  
      setMensaje({
        ident: new Date().getTime(),
        message: data.message,
        type: 'success'
      });
  
      // Actualiza la lista de usuarios con los datos editados
      setUserList(prevList => prevList.map(user =>
        user.id === body.id ? { ...user, ...body } : user
      ));
  
      // Cerrar el diálogo después de guardar los cambios
      handleDialog();
      
      // Restablecer el formulario al estado inicial
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
      <div className='Busqueda_Datos_Personal_BD'>
        <h1>MODIFICACIÓN PARA DATOS PERSONALES</h1>
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
                    <TableCell>ACCIONES</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.documento}</TableCell>
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
    <InputLabel>Fotocopia Documento</InputLabel>
    <Select
      name="fotocopiaDocumento"
      value={body.fotocopiaDocumento}
      onChange={e => onChange({ target: { name: 'fotocopiaDocumento', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>


    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Hoja de Vida</InputLabel>
    <Select
      name="hojaVida"
      value={body.hojaVida}
      onChange={e => onChange({ target: { name: 'hojaVida', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>

    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Certificados Laborales</InputLabel>
    <Select
      name="certificadosLaborales"
      value={body.certificadosLaborales}
      onChange={e => onChange({ target: { name: 'certificadosLaborales', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO APLICA">NO APLICA</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Fotocopia Tarjeta Profesional</InputLabel>
    <Select
      name="fotocopiaTarjetaProfesional"
      value={body.fotocopiaTarjetaProfesional}
      onChange={e => onChange({ target: { name: 'fotocopiaTarjetaProfesional', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO APLICA">NO APLICA</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Diploma Acta Bachiller</InputLabel>
    <Select
      name="diplomaActaBachiller"
      value={body.diplomaActaBachiller}
      onChange={e => onChange({ target: { name: 'diplomaActaBachiller', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO APLICA">NO APLICA</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Diploma Acta Profesional</InputLabel>
    <Select
      name="diplomaActaProfesional"
      value={body.diplomaActaProfesional}
      onChange={e => onChange({ target: { name: 'diplomaActaProfesional', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO APLICA">NO APLICA</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Diploma Acta Especialización</InputLabel>
    <Select
      name="diplomaActaEspecializacion"
      value={body.diplomaActaEspecializacion}
      onChange={e => onChange({ target: { name: 'diplomaActaEspecializacion', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO APLICA">NO APLICA</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Certificado Estudios</InputLabel>
    <Select
      name="certificadoEstudios"
      value={body.certificadoEstudios}
      onChange={e => onChange({ target: { name: 'certificadoEstudios', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO APLICA">NO APLICA</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Certificado EPS</InputLabel>
    <Select
      name="certificadoEPS"
      value={body.certificadoEPS}
      onChange={e => onChange({ target: { name: 'certificadoEPS', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO COTIZA">NO COTIZA</MenuItem>

    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
              <TextField
                name="fechaCertificadoEPS"
                label="Fecha Certificado EPS"
                type="date"
                value={formatDate(body.fechaCertificadoEPS)}
                onChange={e => onChange({ target: { name: 'fechaCertificadoEPS', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Certificado Fondo Pensiones</InputLabel>
    <Select
      name="certificadoFondoPensiones"
      value={body.certificadoFondoPensiones}
      onChange={e => onChange({ target: { name: 'certificadoFondoPensiones', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO COTIZA">NO COTIZA</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
              <TextField
                name="fechaCertificadoFondoPensiones"
                label="Fecha Certificado Fondo de Pensiones"
                type="date"
                value={formatDate(body.fechaCertificadoFondoPensiones)}
                onChange={e => onChange({ target: { name: 'fechaCertificadoFondoPensiones', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Certificado Fondo Cesantías</InputLabel>
    <Select
      name="certificadoFondoCesantias"
      value={body.certificadoFondoCesantias}
      onChange={e => onChange({ target: { name: 'certificadoFondoCesantias', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO COTIZA">NO COTIZA</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
              <TextField
                name="fechaCertificadoFondoCesantias"
                label="Fecha Certificado Fondo de Cesantias"
                type="date"
                value={formatDate(body.fechaCertificadoFondoCesantias)}
                onChange={e => onChange({ target: { name: 'fechaCertificadoFondoCesantias', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Certificado Cuenta Bancaria</InputLabel>
    <Select
      name="certificadoCuentaBancaria"
      value={body.certificadoCuentaBancaria}
      onChange={e => onChange({ target: { name: 'certificadoCuentaBancaria', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>

    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
              <TextField
                name="fechaCertificadoCuentaBancaria"
                label="Fecha Certificado Cuenta Bancaria"
                type="date"
                value={formatDate(body.fechaCertificadoCuentaBancaria)}
                onChange={e => onChange({ target: { name: 'fechaCertificadoCuentaBancaria', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Tarjeta Secretaria de Salud</InputLabel>
    <Select
      name="tarjetaOtorgadaSecretariaSalud"
      value={body.tarjetaOtorgadaSecretariaSalud}
      onChange={e => onChange({ target: { name: 'tarjetaOtorgadaSecretariaSalud', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO APLICA">NO APLICA</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Resolución Secretaria de Salud</InputLabel>
    <Select
      name="resolucionSecretariaSalud"
      value={body.resolucionSecretariaSalud}
      onChange={e => onChange({ target: { name: 'resolucionSecretariaSalud', value: e.target.value } })}
    >
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
      <MenuItem value="NO APLICA">NO APLICA</MenuItem>

    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>Carnet Vacunas</InputLabel>
    <Select
      name="carnetVacunas"
      value={body.carnetVacunas}
      onChange={e => onChange({ target: { name: 'carnetVacunas', value: e.target.value } })}
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

export default ModificarDatosPersonal