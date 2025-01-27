import './ModificarDatosLaboral.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { format } from 'date-fns';
import { EditOutlined, DeleteForever as MdDeleteForever } from '@mui/icons-material';
import swal from 'sweetalert';

function ModificarDatosLaboral() {
  const initialState = {
    aprobaciones:'',
    conflictoInteres:'',
    pruebasPsicotecnicas:'',
    entrevistaSeleccion:'',
    informeCorrelacionCargo:'',
    visitaDomiciliaria:'',
    cartaSeguridadSocial:'', 
    infolaft:'',
    fechaConsultaInfolaft:'',
    inhabilidades:'',
    fechaConsultaInhabilidades:'',
    consultaAprendizaje:'',
    cartaPresentacionInstitutoUniversidad:'',
    examenMedicoIngreso:'', 
    reporteCentralesRiesgo:'',
    rethus:'',
    informeFinalEstudioSeguridad:'',
    afiliacionARL:'',
    afilicacionCaja:'',
    afiliacionEPS:'',
    contratoFirmado:'',
    perfilCargoFirmado:'',
    prorroga:'',
    indefinido:'',
    polizaVida:'',
    sustitucionPatronal:'',
    clausulaAdicional:'',
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
      const { data } = await axios.post('http://localhost:3080/EditarLaboral', {
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
      <div className='Busqueda_Datos_Laboral'>
        <h1>MODIFICACIÓN PARA DATOS DE LABORAL</h1>
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
                  <TableCell>APROBACIONES</TableCell>
                    <TableCell> CONFLICTO DE INTERES</TableCell>
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
                    <TableCell>CARTA DE PRESENTACIÓN DEL INSTITUTO O UNIVERISDAD </TableCell>
                    <TableCell>EXAMÉN MÉDICO DE INGRESO</TableCell>
                    <TableCell> REPORTE CENTRALES DE RIESGO</TableCell>
                    <TableCell>RETHUS</TableCell>
                    <TableCell>INFORME FINAL DE ESTUDIO DE SEGURIDAD</TableCell>
                    <TableCell>AFILIACIÓN ARL</TableCell>
                    <TableCell>AFILIACIÓN CAJA</TableCell>
                    <TableCell>AFILIACIÓN EPS</TableCell>
                    <TableCell>CONTRATO FIRMADO</TableCell>
                    <TableCell>PERFIL DEL CARGO FIRMADO</TableCell>
                    <TableCell>PRORROGA</TableCell>
                    <TableCell>INDEFINIDO</TableCell>
                    <TableCell>POLIZA DE VIDA </TableCell>
                    <TableCell>SUSTITUCIÓN PATRONAL</TableCell>
                    <TableCell>CLAÚSULA ADICIONAL</TableCell>
                    <TableCell>ACCIONES</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.documento}</TableCell>
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
                      <TableCell>{user.afilicacionCaja}</TableCell>
                      <TableCell>{user.afiliacionEPS}</TableCell>
                      <TableCell>{user.contratoFirmado}</TableCell>
                      <TableCell>{user.perfilCargoFirmado}</TableCell>
                      <TableCell>{user.prorroga}</TableCell>
                      <TableCell>{user.indefinido}</TableCell>
                      <TableCell>{user.polizaVida}</TableCell>
                      <TableCell>{user.sustitucionPatronal}</TableCell>
                      <TableCell>{user.clausulaAdicional}</TableCell>
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
          <InputLabel>Aprobaciones</InputLabel>
          <Select
            name="aprobaciones"
            value={body.aprobaciones}
            onChange={e => onChange({ target: { name: 'aprobaciones', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Conflicto de Interés */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Conflicto de Interés</InputLabel>
          <Select
            name="conflictoInteres"
            value={body.conflictoInteres}
            onChange={e => onChange({ target: { name: 'conflictoInteres', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Pruebas Psicotécnicas */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Pruebas Psicotécnicas</InputLabel>
          <Select
            name="pruebasPsicotecnicas"
            value={body.pruebasPsicotecnicas}
            onChange={e => onChange({ target: { name: 'pruebasPsicotecnicas', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>

          </Select>
        </FormControl>
      </Grid>

      {/* Entrevista de Selección */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Entrevista de Selección</InputLabel>
          <Select
            name="entrevistaSeleccion"
            value={body.entrevistaSeleccion}
            onChange={e => onChange({ target: { name: 'entrevistaSeleccion', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Informe de Correlación de Cargo */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Informe de Correlación de Cargo</InputLabel>
          <Select
            name="informeCorrelacionCargo"
            value={body.informeCorrelacionCargo}
            onChange={e => onChange({ target: { name: 'informeCorrelacionCargo', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Visita Domiciliaria */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Visita Domiciliaria</InputLabel>
          <Select
            name="visitaDomiciliaria"
            value={body.visitaDomiciliaria}
            onChange={e => onChange({ target: { name: 'visitaDomiciliaria', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Carta de Seguridad Social */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Carta de Seguridad Social</InputLabel>
          <Select
            name="cartaSeguridadSocial"
            value={body.cartaSeguridadSocial}
            onChange={e => onChange({ target: { name: 'cartaSeguridadSocial', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Infolaft */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Infolaft</InputLabel>
          <Select
            name="infolaft"
            value={body.infolaft}
            onChange={e => onChange({ target: { name: 'infolaft', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>

          </Select>
        </FormControl>
      </Grid>

      {/* Fecha de Consulta Infolaft */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <TextField
            type="date"
            label="Fecha Consulta Infolaft"
            name="fechaConsultaInfolaft"
            value={body.fechaConsultaInfolaft}
            onChange={e => onChange({ target: { name: 'fechaConsultaInfolaft', value: e.target.value } })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
      </Grid>

      {/* Inhabilidades */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Inhabilidades</InputLabel>
          <Select
            name="inhabilidades"
            value={body.inhabilidades}
            onChange={e => onChange({ target: { name: 'inhabilidades', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Fecha de Consulta Inhabilidades */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <TextField
            type="date"
            label="Fecha de Consulta Inhabilidades"
            name="fechaConsultaInhabilidades"
            value={body.fechaConsultaInhabilidades}
            onChange={e => onChange({ target: { name: 'fechaConsultaInhabilidades', value: e.target.value } })}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
      </Grid>

      {/* Consulta Aprendizaje */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Consulta Aprendizaje</InputLabel>
          <Select
            name="consultaAprendizaje"
            value={body.consultaAprendizaje}
            onChange={e => onChange({ target: { name: 'consultaAprendizaje', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Carta de Presentación Instituto/Universidad */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Carta de Presentación Instituto/Universidad</InputLabel>
          <Select
            name="cartaPresentacionInstitutoUniversidad"
            value={body.cartaPresentacionInstitutoUniversidad}
            onChange={e => onChange({ target: { name: 'cartaPresentacionInstitutoUniversidad', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Examen Médico de Ingreso */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Examen Médico de Ingreso</InputLabel>
          <Select
            name="examenMedicoIngreso"
            value={body.examenMedicoIngreso}
            onChange={e => onChange({ target: { name: 'examenMedicoIngreso', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Reporte Centrales de Riesgo */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Reporte Centrales de Riesgo</InputLabel>
          <Select
            name="reporteCentralesRiesgo"
            value={body.reporteCentralesRiesgo}
            onChange={e => onChange({ target: { name: 'reporteCentralesRiesgo', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Rethus */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Rethus</InputLabel>
          <Select
            name="rethus"
            value={body.rethus}
            onChange={e => onChange({ target: { name: 'rethus', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Informe Final Estudio de Seguridad */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Informe Final Estudio de Seguridad</InputLabel>
          <Select
            name="informeFinalEstudioSeguridad"
            value={body.informeFinalEstudioSeguridad}
            onChange={e => onChange({ target: { name: 'informeFinalEstudioSeguridad', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Afiliación ARL */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Afiliación ARL</InputLabel>
          <Select
            name="afiliacionARL"
            value={body.afiliacionARL}
            onChange={e => onChange({ target: { name: 'afiliacionARL', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="APRENDIZ LECTIVO">APRENDIZ LECTIVO</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Afiliación Caja */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Afiliación Caja</InputLabel>
          <Select
            name="afilicacionCaja"
            value={body.afilicacionCaja}
            onChange={e => onChange({ target: { name: 'afilicacionCaja', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Afiliación EPS */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Afiliación EPS</InputLabel>
          <Select
            name="afiliacionEPS"
            value={body.afiliacionEPS}
            onChange={e => onChange({ target: { name: 'afiliacionEPS', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>

          </Select>
        </FormControl>
      </Grid>

      {/* Contrato Firmado */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Contrato Firmado</InputLabel>
          <Select
            name="contratoFirmado"
            value={body.contratoFirmado}
            onChange={e => onChange({ target: { name: 'contratoFirmado', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Perfil de Cargo Firmado */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Perfil de Cargo Firmado</InputLabel>
          <Select
            name="perfilCargoFirmado"
            value={body.perfilCargoFirmado}
            onChange={e => onChange({ target: { name: 'perfilCargoFirmado', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Prórroga */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Prórroga</InputLabel>
          <Select
            name="prorroga"
            value={body.prorroga}
            onChange={e => onChange({ target: { name: 'prorroga', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Indefinido */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Indefinido</InputLabel>
          <Select
            name="indefinido"
            value={body.indefinido}
            onChange={e => onChange({ target: { name: 'indefinido', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Póliza de Vida */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Póliza de Vida</InputLabel>
          <Select
            name="polizaVida"
            value={body.polizaVida}
            onChange={e => onChange({ target: { name: 'polizaVida', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Sustitución Patronal */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Sustitución Patronal</InputLabel>
          <Select
            name="sustitucionPatronal"
            value={body.sustitucionPatronal}
            onChange={e => onChange({ target: { name: 'sustitucionPatronal', value: e.target.value } })}
          >
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="ARCHIVADO">ARCHIVADO</MenuItem>
            <MenuItem value="NO APLICA">NO APLICA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Cláusula Adicional */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Cláusula Adicional</InputLabel>
          <Select
            name="clausulaAdicional"
            value={body.clausulaAdicional}
            onChange={e => onChange({ target: { name: 'clausulaAdicional', value: e.target.value } })}
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

export default ModificarDatosLaboral