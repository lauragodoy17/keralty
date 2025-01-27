import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { format,parseISO } from 'date-fns';
import { EditOutlined, DeleteForever as MdDeleteForever } from '@mui/icons-material';
import swal from 'sweetalert';

const ModificarDatosPersonalesPsicologos = () => {
  const initialState = {
    fechaInicioProcesoAnalista: null,
    idRequisicion: ' ',
    fechaAsignacionConexionAuxOperativo: null,
    tipoIngreso: ' ',
    empresa: ' ',
    servicio: ' ',
    posicion: ' ',
    nuevoReingreso: ' ',
    ciudad: ' ',
    teletrabajo: ' ',
    fechaExpedicionCedula: ' ',
    cedula: ' ',
    nombreCandidato: ' ',
    cargo: ' ',
    correo: ' ',
    celular: ' ',
    tipoPlanta: ' ',
    tiempoContrato: ' ',
    fechaEnvioDocumentos: null,
    solicitudExamenMedico: null,
    fechaProgramacionExamenMedico: null,
    fechaConceptoExamenMedico: null,
    fechaProgramacionEstudioAYC: null,
    fechaConceptoEstudioSeguridad: null,
    fechaAsignacionAnalista: null,
    hojaVidaKeralty: ' ',
    cedulaPapel: ' ',
    infolaft: ' ',
    inhabilidades: ' ',
    certificadoBancario: ' ',
    certificadoEPS: ' ',
    certificadoPension: ' ',
    certificadoCesantias: ' ',
    certificadosLaborales: ' ',
    diplomaBachiller: ' ',
    actaBachiller: ' ',
    diplomaPregado: ' ',
    actaPregado: ' ',
    diplomaPosgrado: ' ',
    actaPosgrado: ' ',
    resolucionSecretariaSalud: ' ',
    tarjetaProfesional: ' ',
    rethus: ' ',
    violenciaSexual: ' ',
    gestionDuelo: ' ',
    ataquesQuimicos: ' ',
    donacionOrganos: ' ',
    tomaMuestrasCitologia: ' ',
    soporteVitalBasico: ' ',
    soporteVitalAvanzado: ' ',
    PALS: ' ',
    NALS: ' ',
    vacunasCovid: ' ',
    vacunasHepatitis: ' ',
    conceptoMedico: ' ',
    conceptoInformeFinal: ' ',
    sintesis: ' ',
    certificadoInduccion: ' ',
    cargaInhabilidades: ' ',
    observacionesAuxOperativo: ' ',
    fechaIngreso:null,
    estado: ' '
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
      const requestData = {
        ...body,
        tabla: selectedTable
      };
  
      console.log('Sending data:', requestData);
  
      const { data } = await axios.post('http://localhost:3080/EditarPsicologos', requestData);
  
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
      console.error('Error editing data:', error.response ? error.response.data : error.message);
      setMensaje({
        ident: new Date().getTime(),
        message: error.response ? error.response.data.sqlMessage || error.response.data.message : 'Error desconocido',
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
            onDelete(id)
                .then(() => {
                    swal('Eliminado!', 'El elemento ha sido eliminado.', 'success');
                })
                .catch((err) => {
                    console.error(err);
                    swal('Error', 'Hubo un problema al eliminar el elemento.', 'error');
                });
        }
    });
};

const onDelete = async (id) => {
    try {
        const { data } = await axios.post('http://localhost:3080/Eliminar', {
            id,
            nombreTabla: selectedTable // Envía también el nombre de la tabla seleccionada
        });
        console.log(data.message);

        // Actualiza la lista de usuarios eliminando el usuario cuyo id coincide
        setUserList(prevList => prevList.filter(user => user.id !== id));
    } catch (err) {
        console.log(err);
        throw err; // Lanza el error para manejarlo en handleDeleteClick
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
        <h1>MODIFICACIÓN PARA DATOS PERSONALES Y ÚNICOS</h1>
        <div className="select-container">
          <label className="estado">Selecciona el psicologo *</label>
          <select
            className='select'
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
                        <option value="">- Selecciona uno -</option>

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
                  <TableCell>FECHA INICIO PROCESO ANALISTA</TableCell>
                  <TableCell>ID REQUISICIÓN</TableCell>
<TableCell>FECHA ASIGNACIÓN CONEXIÓN AUX OPERATIVO</TableCell>
<TableCell>TIPO DE INGRESO</TableCell>
<TableCell>EMPRESA</TableCell>
<TableCell>SERVICIO</TableCell>
<TableCell>POSICIÓN</TableCell>
<TableCell>NUEVO/REINGRESO</TableCell>
<TableCell>CIUDAD</TableCell>
<TableCell>TELETRABAJO</TableCell>
<TableCell>FECHA DE EXPEDICIÓN CÉDULA</TableCell>
<TableCell>CÉDULA</TableCell>
<TableCell>NOMBRE DEL CANDIDATO</TableCell>
<TableCell>CARGO</TableCell>
<TableCell>CORREO</TableCell>
<TableCell>CELULAR</TableCell>
<TableCell>TIPO DE PLANTA</TableCell>
<TableCell>TIEMPO DE CONTRATO</TableCell>
<TableCell>FECHA ENVÍO DE DOCUMENTOS</TableCell>
<TableCell>SOLICITUD EXAMEN MÉDICO</TableCell>
<TableCell>FECHA PROGRAMACIÓN EXAMEN MÉDICO</TableCell>
<TableCell>FECHA CONCEPTO EXAMEN MÉDICO</TableCell>
<TableCell>FECHA PROGRAMACIÓN ESTUDIO AYC</TableCell>
<TableCell>FECHA CONCEPTO ESTUDIO SEGURIDAD</TableCell>
<TableCell>FECHA ASIGNACIÓN ANALISTA</TableCell>
<TableCell>HOJA DE VIDA KERALTY</TableCell>
<TableCell>CÉDULA EN PAPEL</TableCell>
<TableCell>INFOLAFT</TableCell>
<TableCell>INHABILIDADES</TableCell>
<TableCell>CERTIFICADO BANCARIO</TableCell>
<TableCell>CERTIFICADO EPS</TableCell>
<TableCell>CERTIFICADO PENSIÓN</TableCell>
<TableCell>CERTIFICADO CESANTÍAS</TableCell>
<TableCell>CERTIFICADOS LABORALES</TableCell>
<TableCell>DIPLOMA DE BACHILLER</TableCell>
<TableCell>ACTA DE BACHILLER</TableCell>
<TableCell>DIPLOMA DE PREGRADO</TableCell>
<TableCell>ACTA DE PREGRADO</TableCell>
<TableCell>DIPLOMA DE POSGRADO</TableCell>
<TableCell>ACTA DE POSGRADO</TableCell>
<TableCell>RESOLUCIÓN SECRETARÍA DE SALUD</TableCell>
<TableCell>TARJETA PROFESIONAL</TableCell>
<TableCell>RETHUS</TableCell>
<TableCell>VIOLENCIA SEXUAL</TableCell>
<TableCell>GESTIÓN DE DUELO</TableCell>
<TableCell>ATAQUES QUÍMICOS</TableCell>
<TableCell>DONACIÓN DE ÓRGANOS</TableCell>
<TableCell>TOMA DE MUESTRAS CITOLOGÍA</TableCell>
<TableCell>SOPORTE VITAL BÁSICO</TableCell>
<TableCell>SOPORTE VITAL AVANZADO</TableCell>
<TableCell>PALS</TableCell>
<TableCell>NALS</TableCell>
<TableCell>VACUNAS COVID</TableCell>
<TableCell>VACUNAS HEPATITIS</TableCell>
<TableCell>CONCEPTO MÉDICO</TableCell>
<TableCell>CONCEPTO INFORME FINAL</TableCell>
<TableCell>SÍNTESIS</TableCell>
<TableCell>CERTIFICADO INDUCCIÓN</TableCell>
<TableCell>CARGA DE INHABILIDADES</TableCell>
<TableCell>OBSERVACIONES AUX OPERATIVO</TableCell>
<TableCell>FECHA DE INGRESO</TableCell>
<TableCell>ESTADO</TableCell>

                    <TableCell>ACCIONES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <TableRow key={user.id}>
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

                      <TableCell>
                        <IconButton onClick={() => handleEditClick(user)}>
                          <EditOutlined />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(user.id)}>
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

      <Dialog open={openDialog} onClose={handleDialog}>
        <DialogTitle>Editar Datos</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      
      
    <Grid item xs={12} sm={30}>
              <TextField
                name="fechaInicioProcesoAnalista"
                label="Fecha Inicio Proceso Analista"
                type="date"
                value={formatDate(body.fechaInicioProcesoAnalista)}
                onChange={e => onChange({ target: { name: 'fechaInicioProcesoAnalista', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={6}>
  <TextField
    name="idRequisicion"
    label="idRequisicion"
    type="text"
    value={body.idRequisicion}
    onChange={onChange}
    fullWidth
    InputLabelProps={{
      shrink: body.idRequisicion !== '', // El label se moverá solo cuando haya un valor
    }}
  />
</Grid>
<Grid item xs={12} sm={30}>
              <TextField
                name="fechaAsignacionConexionAuxOperativo"
                label="Fecha Asignación Conexión Auxiliar Operativo"
                type="date"
                value={formatDate(body.fechaAsignacionConexionAuxOperativo)}
                onChange={e => onChange({ target: { name: 'fechaAsignacionConexionAuxOperativo', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>


  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Empresa</InputLabel>
      <Select
        name="empresa"
        value={body.empresa}
        onChange={onChange}
        fullWidth
      >
        <MenuItem value="CENTRO DE CIRUGIA MINIMA INVASIVA S.A.S">CENTRO DE CIRUGIA MINIMA INVASIVA S.A.S</MenuItem>
        <MenuItem value="CENTROS MEDICOS COLSANITAS SAS">CENTROS MEDICOS COLSANITAS SAS</MenuItem>
        <MenuItem value="CLINICA CAMPO ABIERTO ORGANIZACION SANITAS INTER.">CLINICA CAMPO ABIERTO ORGANIZACION SANITAS INTER.</MenuItem>
        <MenuItem value="CLINICA COLSANITAS S.A.">CLINICA COLSANITAS S.A.</MenuItem>
        <MenuItem value="CLINICA DENTAL KERALTY SAS">CLINICA DENTAL KERALTY SAS</MenuItem>
        <MenuItem value="COMPAÑIA DE MEDICINA PREPAGADA COLSANITAS S.A.">COMPAÑIA DE MEDICINA PREPAGADA COLSANITAS S.A.</MenuItem>
        <MenuItem value="COMPAÑIA DE SEGUROS COLSANITAS S.A.">COMPAÑIA DE SEGUROS COLSANITAS S.A.</MenuItem>
        <MenuItem value="OFTALMOSANITAS SAS">OFTALMOSANITAS SAS</MenuItem>
        <MenuItem value="CORPORACION SOCIAL MEDICA SANITAS">CORPORACION SOCIAL MEDICA SANITAS</MenuItem>
        <MenuItem value="EDITORIAL BIENESTAR S A S">EDITORIAL BIENESTAR S A S</MenuItem>
        <MenuItem value="ENTIDAD PROMOTORA DE SALUD SANITAS S.A.S.">ENTIDAD PROMOTORA DE SALUD SANITAS S.A.S.</MenuItem>
        <MenuItem value="FUNDACION KERALTY">FUNDACION KERALTY</MenuItem>
        <MenuItem value="FUNDACION UNIVERSITARIA SANITAS">FUNDACION UNIVERSITARIA SANITAS</MenuItem>
        <MenuItem value="KERALTY S.A.S">KERALTY S.A.S</MenuItem>
        <MenuItem value="LAZOS HUMANOS SAS">LAZOS HUMANOS SAS</MenuItem>
        <MenuItem value="MEDICINA NUCLEAR PALERMO ORGANIZACION SANITAS INTERNACIONAL">MEDICINA NUCLEAR PALERMO ORGANIZACION SANITAS INTERNACIONAL</MenuItem>
        <MenuItem value="MEDISANITAS S.A.S. COMPAÑIA DE MEDICINA PREPAGADA">MEDISANITAS S.A.S. COMPAÑIA DE MEDICINA PREPAGADA</MenuItem>
        <MenuItem value="OFTALMOSANITAS CALI SAS">OFTALMOSANITAS CALI SAS</MenuItem>
        <MenuItem value="OPTICA COLSANITAS SAS">OPTICA COLSANITAS SAS</MenuItem>
        <MenuItem value="PROMOTORA INMOBILIARIA SANITAS LTDA.">PROMOTORA INMOBILIARIA SANITAS LTDA.</MenuItem>
        <MenuItem value="SALUD OCUPACIONAL SANITAS SAS">SALUD OCUPACIONAL SANITAS SAS</MenuItem>
        <MenuItem value="SOCIEDAD CLINICA IBEROAMERICA S.A.S">SOCIEDAD CLINICA IBEROAMERICA S.A.S</MenuItem>
        <MenuItem value="UNIDAD DE CUIDADOS PALIATIVOS PRESENTES SAS">UNIDAD DE CUIDADOS PALIATIVOS PRESENTES SAS</MenuItem>
        <MenuItem value="VERSANIA PRIMERA INFANCIA SAS">VERSANIA PRIMERA INFANCIA SAS</MenuItem>
        <MenuItem value="VERSANIA PSICOSOCIAL ITA S.A.S.">VERSANIA PSICOSOCIAL ITA S.A.S.</MenuItem>
        <MenuItem value="ASOCIACION DE USUARIOS DE SANITAS">ASOCIACION DE USUARIOS DE SANITAS</MenuItem>
        <MenuItem value="UNIDAD DE IMAGENES AVANZADAS SAS">UNIDAD DE IMAGENES AVANZADAS SAS</MenuItem>
        <MenuItem value="VERSANIA SENIOR S.A.S">VERSANIA SENIOR S.A.S</MenuItem>

      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6}>
  <FormControl fullWidth>
      <InputLabel>Servicio</InputLabel>
      <Select
        name="servicio"
        value={body.servicio}
        onChange={e => onChange({ target: { name: 'servicio', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="GINECOBSTETRICIA">GINECOBSTETRICIA</MenuItem>
<MenuItem value="TRABAJO DE PARTO TPR">TRABAJO DE PARTO TPR</MenuItem>
<MenuItem value="MATERNOFETAL">MATERNOFETAL</MenuItem>
<MenuItem value="UNIDAD DE CUIDADO INTERMEDIO ADULTO">UNIDAD DE CUIDADO INTERMEDIO ADULTO</MenuItem>
<MenuItem value="UNIDAD DE CUIDADO INTENSIVO ADULTO">UNIDAD DE CUIDADO INTENSIVO ADULTO</MenuItem>
<MenuItem value="UNIDAD DE CUIDADO INTERMEDIO PEDIATRICO O NEONATA">UNIDAD DE CUIDADO INTERMEDIO PEDIATRICO O NEONATA</MenuItem>
<MenuItem value="UNIDAD DE CUIDADO INTERMEDIO PEDIATRICO O NEONATAL">UNIDAD DE CUIDADO INTERMEDIO PEDIATRICO O NEONATAL</MenuItem>
<MenuItem value="URGENCIAS">URGENCIAS</MenuItem>
<MenuItem value="PREHOSPITALARIO - APH">PREHOSPITALARIO - APH</MenuItem>
<MenuItem value="SALAS DE CIRUGIA">SALAS DE CIRUGIA</MenuItem>
<MenuItem value="PEDIATRIA">PEDIATRIA</MenuItem>
<MenuItem value="NEONATOS">NEONATOS</MenuItem>
<MenuItem value="CUIDADO PALIATIVO">CUIDADO PALIATIVO</MenuItem>
<MenuItem value="IMAGENES DIAGNOSTICAS">IMAGENES DIAGNOSTICAS</MenuItem>
<MenuItem value="LABORATORIO">LABORATORIO</MenuItem>
<MenuItem value="OPTOMETRAS">OPTOMETRAS</MenuItem>
<MenuItem value="ADMINISTRATIVO">ADMINISTRATIVO</MenuItem>
<MenuItem value="CONSULTA EXTERNA">CONSULTA EXTERNA</MenuItem>
<MenuItem value="UNIDAD RENAL">UNIDAD RENAL</MenuItem>
<MenuItem value="HOSPITALIZACION">HOSPITALIZACION</MenuItem>
<MenuItem value="TERAPEUTICO">TERAPEUTICO</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6}>
  <TextField
    name="posicion"
    label="Posición"
    type="text"
    value={body.posicion}
    onChange={onChange}
    fullWidth
    InputLabelProps={{
      shrink: body.posicion !== '', // El label se moverá solo cuando haya un valor
    }}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth>
      <InputLabel>Nuevo o Reingreso</InputLabel>
      <Select
        name="nuevoReingreso"
        value={body.nuevoReingreso}
        onChange={e => onChange({ target: { name: 'nuevoReingreso', value: e.target.value } })}
        fullWidth
      >
        <MenuItem value="NUEVO "> NUEVO</MenuItem>
        <MenuItem value=" REINGRESO">REINGRESO</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  
  <Grid item xs={12} sm={6}>
  <FormControl fullWidth>
      <InputLabel>Ciudad</InputLabel>
      <Select
        name="ciudad"
        value={body.ciudad}
        onChange={e => onChange({ target: { name: 'ciudad', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="ACACÍAS">ACACÍAS</MenuItem>
<MenuItem value="AGUACHICA">AGUACHICA</MenuItem>
<MenuItem value="AGUAZUL">AGUAZUL</MenuItem>
<MenuItem value="ALBANIA">ALBANIA</MenuItem>
<MenuItem value="ALTO BAUDÓ">ALTO BAUDÓ</MenuItem>
<MenuItem value="ARAUCA">ARAUCA</MenuItem>
<MenuItem value="ARAUQUITA">ARAUQUITA</MenuItem>
<MenuItem value="ATACO - TOLIMA">ATACO - TOLIMA</MenuItem>
<MenuItem value="ARMENIA">ARMENIA</MenuItem>
<MenuItem value="BARRANCABERMEJA">BARRANCABERMEJA</MenuItem>
<MenuItem value="BARRANCAS">BARRANCAS</MenuItem>
<MenuItem value="BARRANQUILLA">BARRANQUILLA</MenuItem>
<MenuItem value="BOGOTÁ, D.C.">BOGOTÁ, D.C.</MenuItem>
<MenuItem value="BUCARAMANGA">BUCARAMANGA</MenuItem>
<MenuItem value="BUENAVENTURA">BUENAVENTURA</MenuItem>
<MenuItem value="CAJICÁ">CAJICÁ</MenuItem>
<MenuItem value="CALI">CALI</MenuItem>
<MenuItem value="CARTAGENA">CARTAGENA</MenuItem>
<MenuItem value="CARTAGO">CARTAGO</MenuItem>
<MenuItem value="CHÍA">CHÍA</MenuItem>
<MenuItem value="CHIQUINQUIRÁ">CHIQUINQUIRÁ</MenuItem>
<MenuItem value="CHITAGÁ">CHITAGÁ</MenuItem>
<MenuItem value="CÚCUTA">CÚCUTA</MenuItem>
<MenuItem value="DIBULLA">DIBULLA</MenuItem>
<MenuItem value="DUITAMA">DUITAMA</MenuItem>
<MenuItem value="FACATATIVÁ">FACATATIVÁ</MenuItem>
<MenuItem value="FLORENCIA">FLORENCIA</MenuItem>
<MenuItem value="FONSECA">FONSECA</MenuItem>
<MenuItem value="FORTUL">FORTUL</MenuItem>
<MenuItem value="FUSAGASUGÁ">FUSAGASUGÁ</MenuItem>
<MenuItem value="GARZÓN">GARZÓN</MenuItem>
<MenuItem value="GIRARDOT">GIRARDOT</MenuItem>
<MenuItem value="GUACA">GUACA</MenuItem>
<MenuItem value="GUADALUPE">GUADALUPE</MenuItem>
<MenuItem value="HONDA">HONDA</MenuItem>
<MenuItem value="IBAGUÉ">IBAGUÉ</MenuItem>
<MenuItem value="IPIALES">IPIALES</MenuItem>
<MenuItem value="ISNOS">ISNOS</MenuItem>
<MenuItem value="ISTMINA">ISTMINA</MenuItem>
<MenuItem value="LA CALERA">LA CALERA</MenuItem>
<MenuItem value="LA PLATA">LA PLATA</MenuItem>
<MenuItem value="LETICIA">LETICIA</MenuItem>
<MenuItem value="MAICAO">MAICAO</MenuItem>
<MenuItem value="MÁLAGA">MÁLAGA</MenuItem>
<MenuItem value="MANIZALES">MANIZALES</MenuItem>
<MenuItem value="MEDELLÍN">MEDELLÍN</MenuItem>
<MenuItem value="MONTELÍBANO">MONTELÍBANO</MenuItem>
<MenuItem value="MONTERÍA">MONTERÍA</MenuItem>
<MenuItem value="NEIVA">NEIVA</MenuItem>
<MenuItem value="OCAÑA">OCAÑA</MenuItem>
<MenuItem value="PALESTINA">PALESTINA</MenuItem>
<MenuItem value="PALMIRA">PALMIRA</MenuItem>
<MenuItem value="PASTO">PASTO</MenuItem>
<MenuItem value="BOGOTÁ, D.C.">BOGOTÁ, D.C.</MenuItem>
<MenuItem value="PEREIRA">PEREIRA</MenuItem>
<MenuItem value="PIENDAMÓ">PIENDAMÓ</MenuItem>
<MenuItem value="PITALITO">PITALITO</MenuItem>
<MenuItem value="POPAYÁN">POPAYÁN</MenuItem>
<MenuItem value="QUIBDÓ">QUIBDÓ</MenuItem>
<MenuItem value="RIOHACHA">RIOHACHA</MenuItem>
<MenuItem value="RIONEGRO">RIONEGRO</MenuItem>
<MenuItem value="SAN ANDRÉS">SAN ANDRÉS</MenuItem>
<MenuItem value="SAN GIL">SAN GIL</MenuItem>
<MenuItem value="SAN JUAN DEL CESAR">SAN JUAN DEL CESAR</MenuItem>
<MenuItem value="SANTA MARTA">SANTA MARTA</MenuItem>
<MenuItem value="SANTANDER DE QUILICHAO">SANTANDER DE QUILICHAO</MenuItem>
<MenuItem value="SARDINATA">SARDINATA</MenuItem>
<MenuItem value="SINCELEJO">SINCELEJO</MenuItem>
<MenuItem value="SOACHA">SOACHA</MenuItem>
<MenuItem value="SOGAMOSO">SOGAMOSO</MenuItem>
<MenuItem value="SOLEDAD">SOLEDAD</MenuItem>
<MenuItem value="TAME">TAME</MenuItem>
<MenuItem value="TULUÁ">TULUÁ</MenuItem>
<MenuItem value="TUNJA">TUNJA</MenuItem>
<MenuItem value="URIBIA">URIBIA</MenuItem>
<MenuItem value="VALLEDUPAR">VALLEDUPAR</MenuItem>
<MenuItem value="VILLANUEVA">VILLANUEVA</MenuItem>
<MenuItem value="VILLAVICENCIO">VILLAVICENCIO</MenuItem>
<MenuItem value="VILLETA">VILLETA</MenuItem>
<MenuItem value="YOPAL">YOPAL</MenuItem>
<MenuItem value="ZIPAQUIRÁ">ZIPAQUIRÁ</MenuItem>
<MenuItem value="TAURAMENA">TAURAMENA</MenuItem>
<MenuItem value="CHAPARRAL">CHAPARRAL</MenuItem>
<MenuItem value="CAMPOALEGRE">CAMPOALEGRE</MenuItem>
<MenuItem value="MONTERREY">MONTERREY</MenuItem>
<MenuItem value="PAZ DE ARIPORO">PAZ DE ARIPORO</MenuItem>
<MenuItem value="USA">USA</MenuItem>
<MenuItem value="MONGUA">MONGUA</MenuItem>
<MenuItem value="GIGANTE">GIGANTE</MenuItem>
<MenuItem value="SORA - CUCAITA">SORA - CUCAITA</MenuItem>
<MenuItem value="TINJACA">TINJACA</MenuItem>
<MenuItem value="JUNIN">JUNIN</MenuItem>
<MenuItem value="NIMAIMA">NIMAIMA</MenuItem>
<MenuItem value="FLORIDABLANCA">FLORIDABLANCA</MenuItem>

      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6}>
  <FormControl fullWidth>
      <InputLabel>Teletrabajo</InputLabel>
      <Select
        name="teletrabajo"
        value={body.teletrabajo}
        onChange={e => onChange({ target: { name: 'teletrabajo', value: e.target.value } })}
        fullWidth
      >
        <MenuItem value="SÍ "> SÍ</MenuItem>
        <MenuItem value=" NO">NO</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6}>
              <TextField
                name="fechaExpedicionCedula"
                label="Fecha Expedición Cédula"
                type="date"
                value={formatDate(body.fechaExpedicionCedula)}
                onChange={e => onChange({ target: { name: 'fechaExpedicionCedula', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
  <TextField
    name="cedula"
    label="Cédula"
    type="text"
    value={body.cedula}
    onChange={onChange}
    fullWidth
    InputLabelProps={{
      shrink: body.cedula !== '', // El label se moverá solo cuando haya un valor
    }}
  />
</Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                name="nombreCandidato"
                label="Nombre Candidato"
                value={body.nombreCandidato}
                onChange={onChange}
                fullWidth
              />
            </Grid>

            
  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Cargo</InputLabel>
      <Select
        name="cargo"
        value={body.cargo}
        onChange={onChange}
        fullWidth
      >
       <MenuItem value="AUXILIAR ADMINISTRATIVO">AUXILIAR ADMINISTRATIVO</MenuItem>
<MenuItem value="DIRECTORA EJECUTIVA">DIRECTORA EJECUTIVA</MenuItem>
<MenuItem value="RECEPCIONISTA I">RECEPCIONISTA I</MenuItem>
<MenuItem value="FONOAUDIOLOGO">FONOAUDIOLOGO</MenuItem>
<MenuItem value="AUXILIAR DE FACTURACION">AUXILIAR DE FACTURACION</MenuItem>
<MenuItem value="BACTERIOLOGO II">BACTERIOLOGO II</MenuItem>
<MenuItem value="AUXILIAR DE SALAS DE CIRUGIA">AUXILIAR DE SALAS DE CIRUGIA</MenuItem>
<MenuItem value="ENFERMERA JEFE">ENFERMERA JEFE</MenuItem>
<MenuItem value="APRENDIZ">APRENDIZ</MenuItem>
<MenuItem value="COORDINADOR SALAS DE CIRUGIA">COORDINADOR SALAS DE CIRUGIA</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA">AUXILIAR DE ENFERMERIA</MenuItem>
<MenuItem value="TECNICO EN RADIOLOGIA">TECNICO EN RADIOLOGIA</MenuItem>
<MenuItem value="AUXILIAR DE ODONTOLOGIA">AUXILIAR DE ODONTOLOGIA</MenuItem>
<MenuItem value="MEDICO GENERAL">MEDICO GENERAL</MenuItem>
<MenuItem value="RECEPCIONISTA">RECEPCIONISTA</MenuItem>
<MenuItem value="REHABILITADOR ORAL">REHABILITADOR ORAL</MenuItem>
<MenuItem value="COORDINADOR ADMINISTRATIVO">COORDINADOR ADMINISTRATIVO</MenuItem>
<MenuItem value="ENDODONCISTA">ENDODONCISTA</MenuItem>
<MenuItem value="COORDINADOR DE MANTENIMIENTO">COORDINADOR DE MANTENIMIENTO</MenuItem>
<MenuItem value="INSTRUMENTADOR QUIRURGICO">INSTRUMENTADOR QUIRURGICO</MenuItem>
<MenuItem value="MENSAJERO">MENSAJERO</MenuItem>
<MenuItem value="ODONTOLOGO">ODONTOLOGO</MenuItem>
<MenuItem value="SECRETARIA">SECRETARIA</MenuItem>
<MenuItem value="COORDINADORA DE ATENCION AL USUARIO Y MERCADEO">COORDINADORA DE ATENCION AL USUARIO Y MERCADEO</MenuItem>
<MenuItem value="COORDINADOR DE CONSULTA EXTERNA">COORDINADOR DE CONSULTA EXTERNA</MenuItem>
<MenuItem value="QUIMICO FARMACEUTICO">QUIMICO FARMACEUTICO</MenuItem>
<MenuItem value="ASESOR COMERCIAL">ASESOR COMERCIAL</MenuItem>
<MenuItem value="COORDINADOR APOYO DIAGNOSTICO Y CONSULTA PRIORITARIA">COORDINADOR APOYO DIAGNOSTICO Y CONSULTA PRIORITARIA</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO">DIRECTOR OPERATIVO</MenuItem>
<MenuItem value="AUXILIAR DE MANTENIMIENTO">AUXILIAR DE MANTENIMIENTO</MenuItem>
<MenuItem value="AUXILIAR CONTABLE">AUXILIAR CONTABLE</MenuItem>
<MenuItem value="CAJERO">CAJERO</MenuItem>
<MenuItem value="CAJERO II">CAJERO II</MenuItem>
<MenuItem value="ORTODONCISTA">ORTODONCISTA</MenuItem>
<MenuItem value="ENFERMERA ESPECIALISTA">ENFERMERA ESPECIALISTA</MenuItem>
<MenuItem value="GERENTE CECIMIN">GERENTE CECIMIN</MenuItem>
<MenuItem value="PROMOTORA DE VENTAS">PROMOTORA DE VENTAS</MenuItem>
<MenuItem value="CAJERO I">CAJERO I</MenuItem>
<MenuItem value="TECNICO DE SOPORTE TI">TECNICO DE SOPORTE TI</MenuItem>
<MenuItem value="AUXILIAR DE TESORERIA Y CARTERA">AUXILIAR DE TESORERIA Y CARTERA</MenuItem>
<MenuItem value="ODONTOPEDIATRA">ODONTOPEDIATRA</MenuItem>
<MenuItem value="AUXILIAR DE LABORATORIO">AUXILIAR DE LABORATORIO</MenuItem>
<MenuItem value="TERAPEUTA RESPIRATORIA">TERAPEUTA RESPIRATORIA</MenuItem>
<MenuItem value="AUXILIAR CONTABLE I">AUXILIAR CONTABLE I</MenuItem>
<MenuItem value="MEDICO QUIRURGICO">MEDICO QUIRURGICO</MenuItem>
<MenuItem value="FISIOTERAPEUTA">FISIOTERAPEUTA</MenuItem>
<MenuItem value="ANALISTA ADMINISTRATIVO">ANALISTA ADMINISTRATIVO</MenuItem>
<MenuItem value="HIGIENISTA ORAL">HIGIENISTA ORAL</MenuItem>
<MenuItem value="ANALISTA DE CONTABILIDAD">ANALISTA DE CONTABILIDAD</MenuItem>
<MenuItem value="GESTOR DE FACTURACION">GESTOR DE FACTURACION</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO Y CONTABLE">DIRECTOR ADMINISTRATIVO Y CONTABLE</MenuItem>
<MenuItem value="COORDINADOR DE CALIDAD">COORDINADOR DE CALIDAD</MenuItem>
<MenuItem value="CIRUJANO ORAL MAXILOFACIAL">CIRUJANO ORAL MAXILOFACIAL</MenuItem>
<MenuItem value="CONTADOR">CONTADOR</MenuItem>
<MenuItem value="SECRETARIA TRANSCRIPTORA">SECRETARIA TRANSCRIPTORA</MenuItem>
<MenuItem value="AUXILIAR INTEGRAL DE ADMISIONES">AUXILIAR INTEGRAL DE ADMISIONES</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO CENTRO MEDICO">COORDINADOR OPERATIVO CENTRO MEDICO</MenuItem>
<MenuItem value="NUTRICIONISTA">NUTRICIONISTA</MenuItem>
<MenuItem value="PSICOLOGO">PSICOLOGO</MenuItem>
<MenuItem value="TRABAJADOR SOCIAL">TRABAJADOR SOCIAL</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO">AUXILIAR OPERATIVO</MenuItem>
<MenuItem value="ANALISTA ADMINISTRACION DE SALARIOS SENIOR">ANALISTA ADMINISTRACION DE SALARIOS SENIOR</MenuItem>
<MenuItem value="TECNOLOGO EN RADIOLOGIA CONVENCIONAL">TECNOLOGO EN RADIOLOGIA CONVENCIONAL</MenuItem>
<MenuItem value="SECRETARIA ADMINISTRATIVA">SECRETARIA ADMINISTRATIVA</MenuItem>
<MenuItem value="DIGITADOR">DIGITADOR</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO">COORDINADOR OPERATIVO</MenuItem>
<MenuItem value="ANALISTA DE CALIDAD">ANALISTA DE CALIDAD</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA PEDIATRA">MEDICO ESPECIALISTA PEDIATRA</MenuItem>
<MenuItem value="COORDINADOR TI">COORDINADOR TI</MenuItem>
<MenuItem value="AUXILIAR DE SEGUIMIENTO EN SALUD">AUXILIAR DE SEGUIMIENTO EN SALUD</MenuItem>
<MenuItem value="INFORMADOR DE USUARIOS">INFORMADOR DE USUARIOS</MenuItem>
<MenuItem value="TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD">TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD</MenuItem>
<MenuItem value="TECNOLOGO EN RADIOLOGIA ESTUDIOS ESPECIALES">TECNOLOGO EN RADIOLOGIA ESTUDIOS ESPECIALES</MenuItem>
<MenuItem value="AUXILIAR COMPENSACION PRESTADORES">AUXILIAR COMPENSACION PRESTADORES</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA FAMILIAR">MEDICO ESPECIALISTA FAMILIAR</MenuItem>
<MenuItem value="TERAPEUTA OCUPACIONAL">TERAPEUTA OCUPACIONAL</MenuItem>
<MenuItem value="ANALISTA DE RECAUDO">ANALISTA DE RECAUDO</MenuItem>
<MenuItem value="GESTOR DE INFORMACION Y SERVICIO">GESTOR DE INFORMACION Y SERVICIO</MenuItem>
<MenuItem value="MEDICO GENERAL DE APOYO">MEDICO GENERAL DE APOYO</MenuItem>
<MenuItem value="DIRECTOR MEDICO">DIRECTOR MEDICO</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO UAP">COORDINADOR OPERATIVO UAP</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA ENDOCRINOLOGO">MEDICO SUBESPECIALISTA ENDOCRINOLOGO</MenuItem>
<MenuItem value="LIDER AREA POLISOMNOGRAFIA">LIDER AREA POLISOMNOGRAFIA</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA OTORRINOLARINGOLOGO">MEDICO ESPECIALISTA OTORRINOLARINGOLOGO</MenuItem>
<MenuItem value="ANALISTA DE CAPACITACION Y DESARROLLO JUNIOR">ANALISTA DE CAPACITACION Y DESARROLLO JUNIOR</MenuItem>
<MenuItem value="TECNOLOGO EN POLISOMNOGRAFIA">TECNOLOGO EN POLISOMNOGRAFIA</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA GINECOBSTETRA">MEDICO ESPECIALISTA GINECOBSTETRA</MenuItem>
<MenuItem value="ENFERMERA JEFE DE APOYO">ENFERMERA JEFE DE APOYO</MenuItem>
<MenuItem value="GESTOR DE EQUIPAMIENTO">GESTOR DE EQUIPAMIENTO</MenuItem>
<MenuItem value="DIGITADOR I">DIGITADOR I</MenuItem>
<MenuItem value="CONSULTOR DE MEJORA SENIOR">CONSULTOR DE MEJORA SENIOR</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA PSIQUIATRA">MEDICO ESPECIALISTA PSIQUIATRA</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA CIRUJANO">MEDICO ESPECIALISTA CIRUJANO</MenuItem>
<MenuItem value="GESTOR DE CONVENIOS Y TARIFAS">GESTOR DE CONVENIOS Y TARIFAS</MenuItem>
<MenuItem value="COORDINADOR MEDICO UAP I">COORDINADOR MEDICO UAP I</MenuItem>
<MenuItem value="ANALISTA DE COMUNICACIONES SENIOR">ANALISTA DE COMUNICACIONES SENIOR</MenuItem>
<MenuItem value="AUXILIAR DE TERAPIA RESPIRATORIA">AUXILIAR DE TERAPIA RESPIRATORIA</MenuItem>
<MenuItem value="REGENTE DE FARMACIA">REGENTE DE FARMACIA</MenuItem>
<MenuItem value="AUXILIAR INTEGRAL DE ADMISIONES I">AUXILIAR INTEGRAL DE ADMISIONES I</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA DE APOYO">AUXILIAR DE ENFERMERIA DE APOYO</MenuItem>
<MenuItem value="ANALISTA ADMINISTRATIVO JUNIOR">ANALISTA ADMINISTRATIVO JUNIOR</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA INTERNISTA">MEDICO ESPECIALISTA INTERNISTA</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA NEUROLOGO">MEDICO ESPECIALISTA NEUROLOGO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA DERMATOLOGO">MEDICO ESPECIALISTA DERMATOLOGO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA FISIATRA">MEDICO ESPECIALISTA FISIATRA</MenuItem>
<MenuItem value="AUXILIAR DE FACTURACION I">AUXILIAR DE FACTURACION I</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA PEDIATRA DE APOYO">MEDICO ESPECIALISTA PEDIATRA DE APOYO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA MEDICINA FAMILIAR">MEDICO ESPECIALISTA MEDICINA FAMILIAR</MenuItem>
<MenuItem value="RADIOPERADORA">RADIOPERADORA</MenuItem>
<MenuItem value="DIRECTOR DE COMPRAS EQUIPOS MEDICOS Y DE APOYO">DIRECTOR DE COMPRAS EQUIPOS MEDICOS Y DE APOYO</MenuItem>
<MenuItem value="DIRECTOR DE COMPRAS SERVICIOS Y SEGUROS">DIRECTOR DE COMPRAS SERVICIOS Y SEGUROS</MenuItem>
<MenuItem value="COORDINADOR MEDICO UAP">COORDINADOR MEDICO UAP</MenuItem>
<MenuItem value="GERENTE DE URGENCIAS">GERENTE DE URGENCIAS</MenuItem>
<MenuItem value="ANALISTA DE RIESGOS">ANALISTA DE RIESGOS</MenuItem>
<MenuItem value="DIRECTOR DE PROYECTOS SISTEMAS DE INFORMACION">DIRECTOR DE PROYECTOS SISTEMAS DE INFORMACION</MenuItem>
<MenuItem value="ENFERMERA JEFE DE CUIDADOS PALIATIVOS">ENFERMERA JEFE DE CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA FAMILIAR VIH">MEDICO ESPECIALISTA FAMILIAR VIH</MenuItem>
<MenuItem value="BUSINESS PARTNER">BUSINESS PARTNER</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO II">AUXILIAR OPERATIVO II</MenuItem>
<MenuItem value="ANALISTA GESTION DE PROYECTOS">ANALISTA GESTION DE PROYECTOS</MenuItem>
<MenuItem value="MEDICO GENERAL GRADO 3">MEDICO GENERAL GRADO 3</MenuItem>
<MenuItem value="MEDICO EXPERTO PROGRAMA VIH">MEDICO EXPERTO PROGRAMA VIH</MenuItem>
<MenuItem value="LIDER DE SOPORTE APLICACIONES TI">LIDER DE SOPORTE APLICACIONES TI</MenuItem>
<MenuItem value="ANALISTA DE CUENTAS POR PAGAR">ANALISTA DE CUENTAS POR PAGAR</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA">COORDINADOR DE ENFERMERIA</MenuItem>
<MenuItem value="AUXILIAR SOPORTE VACUNACION">AUXILIAR SOPORTE VACUNACION</MenuItem>
<MenuItem value="TRABAJADOR SOCIAL DE CUIDADOS PALIATIVOS">TRABAJADOR SOCIAL DE CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA ENDOCRINOLOGO PEDIATRICO">MEDICO SUBESPECIALISTA ENDOCRINOLOGO PEDIATRICO</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA REUMATOLOGO">MEDICO SUBESPECIALISTA REUMATOLOGO</MenuItem>
<MenuItem value="COORDINADOR DE ENTES DE CONTROL">COORDINADOR DE ENTES DE CONTROL</MenuItem>
<MenuItem value="ANALISTA DE PLANEACION Y CONTROL">ANALISTA DE PLANEACION Y CONTROL</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA ORTOPEDISTA">MEDICO ESPECIALISTA ORTOPEDISTA</MenuItem>
<MenuItem value="REACCION">REACCION</MenuItem>
<MenuItem value="DIRECTOR CLINICO">DIRECTOR CLINICO</MenuItem>
<MenuItem value="COORDINADOR NACIONAL DE ENFERMERIA NUTRICION Y TERAPIAS">COORDINADOR NACIONAL DE ENFERMERIA NUTRICION Y TERAPIAS</MenuItem>
<MenuItem value="COORDINADOR ADMINISTRATIVO REGIONALES">COORDINADOR ADMINISTRATIVO REGIONALES</MenuItem>
<MenuItem value="COORDINADOR MEDICO">COORDINADOR MEDICO</MenuItem>
<MenuItem value="ABOGADO PROCESAL III">ABOGADO PROCESAL III</MenuItem>
<MenuItem value="DIRECTOR DE PLANEACION Y CONTROL">DIRECTOR DE PLANEACION Y CONTROL</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO I">AUXILIAR OPERATIVO I</MenuItem>
<MenuItem value="DIRECTOR MEDICO DE PROGRAMAS">DIRECTOR MEDICO DE PROGRAMAS</MenuItem>
<MenuItem value="ANALISTA DE SELECCION">ANALISTA DE SELECCION</MenuItem>
<MenuItem value="COORDINADOR MEDICO REGIONAL ATENCION SECUNDARIA">COORDINADOR MEDICO REGIONAL ATENCION SECUNDARIA</MenuItem>
<MenuItem value="COORDINADOR ADMINISTRATIVO REGIONAL BOGOTA">COORDINADOR ADMINISTRATIVO REGIONAL BOGOTA</MenuItem>
<MenuItem value="RECLUTADOR">RECLUTADOR</MenuItem>
<MenuItem value="ANALISTA ADMINISTRACION DE SALARIOS JUNIOR">ANALISTA ADMINISTRACION DE SALARIOS JUNIOR</MenuItem>
<MenuItem value="COORDINADOR DE SEGURIDAD">COORDINADOR DE SEGURIDAD</MenuItem>
<MenuItem value="MEDICO GENERAL DOMICILIARIO">MEDICO GENERAL DOMICILIARIO</MenuItem>
<MenuItem value="INFORMADOR DE ATENCION AL USUARIO">INFORMADOR DE ATENCION AL USUARIO</MenuItem>
<MenuItem value="MEDICO GENERAL DE CUIDADOS PALIATIVOS">MEDICO GENERAL DE CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="COORDINADOR ADMINISTRATIVO Y DE RECAUDO">COORDINADOR ADMINISTRATIVO Y DE RECAUDO</MenuItem>
<MenuItem value="PSICOLOGO DE CUIDADOS PALIATIVOS">PSICOLOGO DE CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE CONTRATACION">AUXILIAR OPERATIVO DE CONTRATACION</MenuItem>
<MenuItem value="AUXILIAR INTEGRAL DE ADMISIONES DE CUIDADOS PALIATIVOS">AUXILIAR INTEGRAL DE ADMISIONES DE CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="JEFE DE UROLOGIA">JEFE DE UROLOGIA</MenuItem>
<MenuItem value="PROFESIONAL DE ATENCION AL USUARIO">PROFESIONAL DE ATENCION AL USUARIO</MenuItem>
<MenuItem value="AUXILIAR LOGISTICO DE MEDICAMENTOS">AUXILIAR LOGISTICO DE MEDICAMENTOS</MenuItem>
<MenuItem value="DIRECTOR DE CONVENIOS Y TARIFAS CM">DIRECTOR DE CONVENIOS Y TARIFAS CM</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA UROLOGO">MEDICO ESPECIALISTA UROLOGO</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA NEUROPEDIATRA">MEDICO SUBESPECIALISTA NEUROPEDIATRA</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE SELECCION">AUXILIAR OPERATIVO DE SELECCION</MenuItem>
<MenuItem value="ADMINISTRADOR REGENTE DE DROGUERIA">ADMINISTRADOR REGENTE DE DROGUERIA</MenuItem>
<MenuItem value="SUPERVISOR DE MANTENIMIENTO">SUPERVISOR DE MANTENIMIENTO</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO SERVICIO DE URGENCIAS">COORDINADOR OPERATIVO SERVICIO DE URGENCIAS</MenuItem>
<MenuItem value="ENFERMERA ESPECIALISTA DE APOYO">ENFERMERA ESPECIALISTA DE APOYO</MenuItem>
<MenuItem value="DIRECTOR DE GESTION FINANCIERA">DIRECTOR DE GESTION FINANCIERA</MenuItem>
<MenuItem value="ANALISTA FUNCIONAL JUNIOR I">ANALISTA FUNCIONAL JUNIOR I</MenuItem>
<MenuItem value="COORDINADOR INTEGRAL I">COORDINADOR INTEGRAL I</MenuItem>
<MenuItem value="ESPECIALISTA I">ESPECIALISTA I</MenuItem>
<MenuItem value="ADMINISTRADOR DEL SISTEMA">ADMINISTRADOR DEL SISTEMA</MenuItem>
<MenuItem value="ENFERMERA GESTION DE CASOS">ENFERMERA GESTION DE CASOS</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA EN MEDICINA ALTERNATIVA">MEDICO ESPECIALISTA EN MEDICINA ALTERNATIVA</MenuItem>
<MenuItem value="GESTOR DE SERVICIO">GESTOR DE SERVICIO</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA URGENCIAS">COORDINADOR DE ENFERMERIA URGENCIAS</MenuItem>
<MenuItem value="GERENTE DE SALUD">GERENTE DE SALUD</MenuItem>
<MenuItem value="PROFESIONAL DE GESTION EN SALUD">PROFESIONAL DE GESTION EN SALUD</MenuItem>
<MenuItem value="AUXILIAR DE PARQUEADERO">AUXILIAR DE PARQUEADERO</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA PSIQUIATRA INFANTIL">MEDICO SUBESPECIALISTA PSIQUIATRA INFANTIL</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA EN NEUROPEDIATRIA">MEDICO SUBESPECIALISTA EN NEUROPEDIATRIA</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO">DIRECTOR ADMINISTRATIVO</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE CONTRATACION I">AUXILIAR OPERATIVO DE CONTRATACION I</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA DEL DOLOR">MEDICO ESPECIALISTA DEL DOLOR</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA EMERGENCIOLOGO">MEDICO ESPECIALISTA EMERGENCIOLOGO</MenuItem>
<MenuItem value="ANALISTA OPERATIVO">ANALISTA OPERATIVO</MenuItem>
<MenuItem value="DIRECTOR DE PROCESOS">DIRECTOR DE PROCESOS</MenuItem>
<MenuItem value="LIDER NACIONAL DIRECCION MEDICA">LIDER NACIONAL DIRECCION MEDICA</MenuItem>
<MenuItem value="ANALISTA DE INFRAESTRUCTURA">ANALISTA DE INFRAESTRUCTURA</MenuItem>
<MenuItem value="DIRECTOR DE PROGRAMAS">DIRECTOR DE PROGRAMAS</MenuItem>
<MenuItem value="DIRECTOR DE CONTABILIDAD">DIRECTOR DE CONTABILIDAD</MenuItem>
<MenuItem value="AUXILIAR DE SEGURIDAD">AUXILIAR DE SEGURIDAD</MenuItem>
<MenuItem value="GERENTE FINANCIERO DE CENTROS MEDICOS">GERENTE FINANCIERO DE CENTROS MEDICOS</MenuItem>
<MenuItem value="PRESIDENTE CENTROS MEDICOS">PRESIDENTE CENTROS MEDICOS</MenuItem>
<MenuItem value="AUXILIAR DE FACTURACION II">AUXILIAR DE FACTURACION II</MenuItem>
<MenuItem value="SUBGERENTE GESTION BIOMEDICA">SUBGERENTE GESTION BIOMEDICA</MenuItem>
<MenuItem value="COORDINADOR DE PROGRAMAS CENTROS MEDICOS">COORDINADOR DE PROGRAMAS CENTROS MEDICOS</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA OFTALMOLOGIA">MEDICO ESPECIALISTA OFTALMOLOGIA</MenuItem>
<MenuItem value="AUXILIAR DE APOYO DIAGNOSTICO">AUXILIAR DE APOYO DIAGNOSTICO</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO NACIONAL">DIRECTOR ADMINISTRATIVO NACIONAL</MenuItem>
<MenuItem value="GESTOR OPERATIVO ADMINISTRACION PLANTA PERSONAL">GESTOR OPERATIVO ADMINISTRACION PLANTA PERSONAL</MenuItem>
<MenuItem value="INGENIERO DE GESTION CLINICA">INGENIERO DE GESTION CLINICA</MenuItem>
<MenuItem value="ASESOR CENTRAL DE LLAMADAS">ASESOR CENTRAL DE LLAMADAS</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO DE SALARIOS">DIRECTOR OPERATIVO DE SALARIOS</MenuItem>
<MenuItem value="ABOGADO LABORAL III">ABOGADO LABORAL III</MenuItem>
<MenuItem value="APRENDIZ PRACTICANTE">APRENDIZ PRACTICANTE</MenuItem>
<MenuItem value="JEFE DE DERMATOLOGIA">JEFE DE DERMATOLOGIA</MenuItem>
<MenuItem value="AUXILIAR INTEGRAL ATENCION PRIMARIA">AUXILIAR INTEGRAL ATENCION PRIMARIA</MenuItem>
<MenuItem value="COORDINADOR DE SEGURIDAD DEL PACIENTE Y SALUD PUBLICA">COORDINADOR DE SEGURIDAD DEL PACIENTE Y SALUD PUBLICA</MenuItem>
<MenuItem value="AUXILIAR DE CONTABILIDAD">AUXILIAR DE CONTABILIDAD</MenuItem>
<MenuItem value="ESPECIALISTA BIOMEDICO III">ESPECIALISTA BIOMEDICO III</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA GERIATRA">MEDICO ESPECIALISTA GERIATRA</MenuItem>
<MenuItem value="COORDINADOR DE OPERACIONES">COORDINADOR DE OPERACIONES</MenuItem>
<MenuItem value="ESPECIALISTA II">ESPECIALISTA II</MenuItem>
<MenuItem value="ANALISTA SOPORTE IMAGENOLOGIA">ANALISTA SOPORTE IMAGENOLOGIA</MenuItem>
<MenuItem value="AUXILIAR DE CANAL VIRTUAL">AUXILIAR DE CANAL VIRTUAL</MenuItem>
<MenuItem value="ANALISTA DISE O ORGANIZACIONAL">ANALISTA DISE O ORGANIZACIONAL</MenuItem>
<MenuItem value="DIRECTOR DE GESTION DE DATOS">DIRECTOR DE GESTION DE DATOS</MenuItem>
<MenuItem value="VICEPRESIDENTE EJECUTIVO DE PRESTACION CENTROS MEDICOS">VICEPRESIDENTE EJECUTIVO DE PRESTACION CENTROS MEDICOS</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA NEUMOLOGO">MEDICO SUBESPECIALISTA NEUMOLOGO</MenuItem>
<MenuItem value="JEFE DE MEDICINA INTERNA">JEFE DE MEDICINA INTERNA</MenuItem>
<MenuItem value="AUXILIAR DE CUENTAS POR PAGAR">AUXILIAR DE CUENTAS POR PAGAR</MenuItem>
<MenuItem value="JEFE DE GINECOLOGIA">JEFE DE GINECOLOGIA</MenuItem>
<MenuItem value="AUXILIAR DE SERVICIOS DE APOYO">AUXILIAR DE SERVICIOS DE APOYO</MenuItem>
<MenuItem value="TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD DE APOYO">TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD DE APOYO</MenuItem>
<MenuItem value="SUBGERENTE DE CALIDAD">SUBGERENTE DE CALIDAD</MenuItem>
<MenuItem value="DIRECTOR DE SELECCION">DIRECTOR DE SELECCION</MenuItem>
<MenuItem value="COORDINADOR DE CUENTAS DE ALTO COSTO">COORDINADOR DE CUENTAS DE ALTO COSTO</MenuItem>
<MenuItem value="JEFE DE ORTOPEDIA">JEFE DE ORTOPEDIA</MenuItem>
<MenuItem value="LIDER SICOF">LIDER SICOF</MenuItem>
<MenuItem value="COORDINADOR DE INFRAESTRUCTURA">COORDINADOR DE INFRAESTRUCTURA</MenuItem>
<MenuItem value="INTERPRETE LENGUAJE DE SE AS">INTERPRETE LENGUAJE DE SE AS</MenuItem>
<MenuItem value="DIRECTOR SERVICIOS NO PRESENCIALES">DIRECTOR SERVICIOS NO PRESENCIALES</MenuItem>
<MenuItem value="LIDER DE COMPRAS">LIDER DE COMPRAS</MenuItem>
<MenuItem value="COORDINADOR MEDICO URGENCIAS">COORDINADOR MEDICO URGENCIAS</MenuItem>
<MenuItem value="AUXILIAR INTEGRAL ADMINISTRATIVO">AUXILIAR INTEGRAL ADMINISTRATIVO</MenuItem>
<MenuItem value="JEFE DE OBSTETRICIA">JEFE DE OBSTETRICIA</MenuItem>
<MenuItem value="JEFE DE RIAS">JEFE DE RIAS</MenuItem>
<MenuItem value="COMPRADOR">COMPRADOR</MenuItem>
<MenuItem value="DIRECTOR DE INVESTIGACION, DESARROLLO E INNOVACION">DIRECTOR DE INVESTIGACION, DESARROLLO E INNOVACION</MenuItem>
<MenuItem value="DIRECTOR MEDICO NACIONAL DE ATENCION COMPLEMENTARIA">DIRECTOR MEDICO NACIONAL DE ATENCION COMPLEMENTARIA</MenuItem>
<MenuItem value="COORDINADOR NACIONAL GESTION DE INFORMACION">COORDINADOR NACIONAL GESTION DE INFORMACION</MenuItem>
<MenuItem value="AUXILIAR DE SERVICIOS ASISTENCIALES">AUXILIAR DE SERVICIOS ASISTENCIALES</MenuItem>
<MenuItem value="GERENTE DE OPERACIONES CENTROS MEDICOS">GERENTE DE OPERACIONES CENTROS MEDICOS</MenuItem>
<MenuItem value="ESPECIALISTA III">ESPECIALISTA III</MenuItem>
<MenuItem value="AUXILIAR DE METROLOGIA">AUXILIAR DE METROLOGIA</MenuItem>
<MenuItem value="MEDICO GENETISTA">MEDICO GENETISTA</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA INFECTOLOGO">MEDICO SUBESPECIALISTA INFECTOLOGO</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA GASTROENTEROLOGO PEDIATRA">MEDICO SUBESPECIALISTA GASTROENTEROLOGO PEDIATRA</MenuItem>
<MenuItem value="COORDINADOR NACIONAL DE DEMANDA INDUCIDA">COORDINADOR NACIONAL DE DEMANDA INDUCIDA</MenuItem>
<MenuItem value="COORDINADOR">COORDINADOR</MenuItem>
<MenuItem value="DIRECTOR MEDICO DE PRESTACION PREMIUM">DIRECTOR MEDICO DE PRESTACION PREMIUM</MenuItem>
<MenuItem value="DIRECTOR DE GESTION Y PROYECTOS">DIRECTOR DE GESTION Y PROYECTOS</MenuItem>
<MenuItem value="SUBGERENTE BUSINESS PARTNER">SUBGERENTE BUSINESS PARTNER</MenuItem>
<MenuItem value="AUDITOR DE SISTEMAS">AUDITOR DE SISTEMAS</MenuItem>
<MenuItem value="COORDINADOR MEDICO REGIONAL DE ATENCION PRIMARIA">COORDINADOR MEDICO REGIONAL DE ATENCION PRIMARIA</MenuItem>
<MenuItem value="ANALISTA DE COMUNICACIONES JUNIOR">ANALISTA DE COMUNICACIONES JUNIOR</MenuItem>
<MenuItem value="GERENTE DE PRESTACION ASEGURAMIENTO BASICO">GERENTE DE PRESTACION ASEGURAMIENTO BASICO</MenuItem>
<MenuItem value="DIRECTOR DE CALIDAD CENTROS MEDICOS">DIRECTOR DE CALIDAD CENTROS MEDICOS</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA EN CUIDADOS PALIATIVOS">MEDICO ESPECIALISTA EN CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="JEFE DE PSIQUIATRIA">JEFE DE PSIQUIATRIA</MenuItem>
<MenuItem value="COORDINADOR DE VACUNACION">COORDINADOR DE VACUNACION</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA CARDIOLOGO">MEDICO SUBESPECIALISTA CARDIOLOGO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA EN GASTROENTEROLOGIA">MEDICO ESPECIALISTA EN GASTROENTEROLOGIA</MenuItem>
<MenuItem value="ESPECIALISTA DISE O ORGANIZACIONAL">ESPECIALISTA DISE O ORGANIZACIONAL</MenuItem>
<MenuItem value="DIRECTOR PROGRAMAS ESPECIALES">DIRECTOR PROGRAMAS ESPECIALES</MenuItem>
<MenuItem value="DIRECTOR PROGRAMA DE SEGURIDAD DEL PACIENTE">DIRECTOR PROGRAMA DE SEGURIDAD DEL PACIENTE</MenuItem>
<MenuItem value="ADMINISTRADOR BASE DE DATOS">ADMINISTRADOR BASE DE DATOS</MenuItem>
<MenuItem value="ANALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO">ANALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO</MenuItem>
<MenuItem value="JEFE NACIONAL DE ENFERMERIA NUTRICION Y TERAPIAS">JEFE NACIONAL DE ENFERMERIA NUTRICION Y TERAPIAS</MenuItem>
<MenuItem value="PROFESIONAL DE SEGURIDAD DE LA INFORMACION">PROFESIONAL DE SEGURIDAD DE LA INFORMACION</MenuItem>
<MenuItem value="COORDINADOR COMERCIAL CONVENIOS">COORDINADOR COMERCIAL CONVENIOS</MenuItem>
<MenuItem value="SUBGERENTE DE SERVICIO CENTROS MEDICOS">SUBGERENTE DE SERVICIO CENTROS MEDICOS</MenuItem>
<MenuItem value="AUXILIAR INTEGRAL DE ADMISIONES DE APOYO">AUXILIAR INTEGRAL DE ADMISIONES DE APOYO</MenuItem>
<MenuItem value="EPIDEMIOLOGO">EPIDEMIOLOGO</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA HEMATOLOGO">MEDICO SUBESPECIALISTA HEMATOLOGO</MenuItem>
<MenuItem value="GERENTE ADMINISTRATIVO Y FINANCIERO">GERENTE ADMINISTRATIVO Y FINANCIERO</MenuItem>
<MenuItem value="ANALISTA GESTION DE PROYECTOS I">ANALISTA GESTION DE PROYECTOS I</MenuItem>
<MenuItem value="MEDICO EMPRESA">MEDICO EMPRESA</MenuItem>
<MenuItem value="JEFE DE PEDIATRIA">JEFE DE PEDIATRIA</MenuItem>
<MenuItem value="COORDINADOR BIOMEDICO">COORDINADOR BIOMEDICO</MenuItem>
<MenuItem value="GERENTE DE PRESTACION">GERENTE DE PRESTACION</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA DE CUIDADOS PALIATIVOS">AUXILIAR DE ENFERMERIA DE CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="ENFERMERA JEFE EXTRAMURAL">ENFERMERA JEFE EXTRAMURAL</MenuItem>
<MenuItem value="AUXILIAR DE SERVICIO DESARROLLO HUMANO">AUXILIAR DE SERVICIO DESARROLLO HUMANO</MenuItem>
<MenuItem value="DIRECTOR REQUERIMIENTOS DE ENTES DE CONTROL">DIRECTOR REQUERIMIENTOS DE ENTES DE CONTROL</MenuItem>
<MenuItem value="CONSULTOR FUNCIONAL SENIOR">CONSULTOR FUNCIONAL SENIOR</MenuItem>
<MenuItem value="CONSEJERO ESPIRITUAL">CONSEJERO ESPIRITUAL</MenuItem>
<MenuItem value="AUXILIAR DE ADMISIONES">AUXILIAR DE ADMISIONES</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA FAMILIAR HEMOFILIA">MEDICO ESPECIALISTA FAMILIAR HEMOFILIA</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA DEPORTOLOGO">MEDICO ESPECIALISTA DEPORTOLOGO</MenuItem>
<MenuItem value="COORDINADOR DE URGENCIAS">COORDINADOR DE URGENCIAS</MenuItem>
<MenuItem value="BUSINESS PARTNER SENIOR">BUSINESS PARTNER SENIOR</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE ENFERMERIA">DIRECTOR NACIONAL DE ENFERMERIA</MenuItem>
<MenuItem value="DIRECTOR DE FORMACION CONTINUA">DIRECTOR DE FORMACION CONTINUA</MenuItem>
<MenuItem value="JEFE DE DEPARTAMENTO DE MANTENIMIENTO">JEFE DE DEPARTAMENTO DE MANTENIMIENTO</MenuItem>
<MenuItem value="AUDITOR INTERNO">AUDITOR INTERNO</MenuItem>
<MenuItem value="LIDER DE PRESUPUESTO Y PLANEACION">LIDER DE PRESUPUESTO Y PLANEACION</MenuItem>
<MenuItem value="GERENTE DE PRESTACION MP">GERENTE DE PRESTACION MP</MenuItem>
<MenuItem value="INGENIERO DE MEJORAMIENTO">INGENIERO DE MEJORAMIENTO</MenuItem>
<MenuItem value="DIRECTOR MEDICO CIENTIFICO">DIRECTOR MEDICO CIENTIFICO</MenuItem>
<MenuItem value="AUXILIAR DE SERVICIOS VARIOS">AUXILIAR DE SERVICIOS VARIOS</MenuItem>
<MenuItem value="INFORMADOR LABORATORIO">INFORMADOR LABORATORIO</MenuItem>
<MenuItem value="CAMILLERO">CAMILLERO</MenuItem>
<MenuItem value="ASESOR DE TRATAMIENTOS DENTALES">ASESOR DE TRATAMIENTOS DENTALES</MenuItem>
<MenuItem value="ASESOR DE SERVICIO">ASESOR DE SERVICIO</MenuItem>
<MenuItem value="AUXILIAR DE LABORATORIO DE APOYO">AUXILIAR DE LABORATORIO DE APOYO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA ANESTESIOLOGO">MEDICO ESPECIALISTA ANESTESIOLOGO</MenuItem>
<MenuItem value="TERAPEUTA DE LENGUAJE">TERAPEUTA DE LENGUAJE</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA SOPORTE NUTRICIONAL">COORDINADOR DE ENFERMERIA SOPORTE NUTRICIONAL</MenuItem>
<MenuItem value="GESTOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO">GESTOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO</MenuItem>
<MenuItem value="AUXILIAR LACTARIO">AUXILIAR LACTARIO</MenuItem>
<MenuItem value="CITOHISTOTECNOLOGO">CITOHISTOTECNOLOGO</MenuItem>
<MenuItem value="ASESOR DE SERVICIO SUPERNUMERARIO">ASESOR DE SERVICIO SUPERNUMERARIO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA INTENSIVISTA">MEDICO ESPECIALISTA INTENSIVISTA</MenuItem>
<MenuItem value="JEFE DE MANTENIMIENTO">JEFE DE MANTENIMIENTO</MenuItem>
<MenuItem value="ESPECIALISTA DE COMPENSACION">ESPECIALISTA DE COMPENSACION</MenuItem>
<MenuItem value="BACTERIOLOGO II DE APOYO">BACTERIOLOGO II DE APOYO</MenuItem>
<MenuItem value="ANALISTA DE CONTABILIDAD I">ANALISTA DE CONTABILIDAD I</MenuItem>
<MenuItem value="ASISTENTE ADMINISTRATIVO">ASISTENTE ADMINISTRATIVO</MenuItem>
<MenuItem value="MEDICO GENERAL HOSPITALARIO">MEDICO GENERAL HOSPITALARIO</MenuItem>
<MenuItem value="ENFERMERA ESPECIALISTA ONCOLOGIA">ENFERMERA ESPECIALISTA ONCOLOGIA</MenuItem>
<MenuItem value="TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD I">TECNOLOGO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD I</MenuItem>
<MenuItem value="PATOLOGO">PATOLOGO</MenuItem>
<MenuItem value="TECNOLOGO EN MEDICINA NUCLEAR">TECNOLOGO EN MEDICINA NUCLEAR</MenuItem>
<MenuItem value="AUXILIAR DE SERVICIOS ASISTENCIALES I">AUXILIAR DE SERVICIOS ASISTENCIALES I</MenuItem>
<MenuItem value="MEDICO PEDIATRA NEONATOS CUC">MEDICO PEDIATRA NEONATOS CUC</MenuItem>
<MenuItem value="GESTOR DE TRABAJO SOCIAL DEL PROGRAMA CONTIGO">GESTOR DE TRABAJO SOCIAL DEL PROGRAMA CONTIGO</MenuItem>
<MenuItem value="AUXILIAR DE TERAPIA">AUXILIAR DE TERAPIA</MenuItem>
<MenuItem value="BACTERIOLOGA ADMINISTRATIVA Y CALIDAD">BACTERIOLOGA ADMINISTRATIVA Y CALIDAD</MenuItem>
<MenuItem value="GESTOR OPERATIVO DE RECAUDO">GESTOR OPERATIVO DE RECAUDO</MenuItem>
<MenuItem value="AYUDANTE DE LAVADO">AYUDANTE DE LAVADO</MenuItem>
<MenuItem value="ADMINISTRADOR DE PARQUEADERO">ADMINISTRADOR DE PARQUEADERO</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO DE ADMISIONES">COORDINADOR OPERATIVO DE ADMISIONES</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA APH">AUXILIAR DE ENFERMERIA APH</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA DE EPIDEMIOLOGIA">AUXILIAR DE ENFERMERIA DE EPIDEMIOLOGIA</MenuItem>
<MenuItem value="ENFERMERO CODIFICADOR">ENFERMERO CODIFICADOR</MenuItem>
<MenuItem value="MEDICO PEDIATRA URGENCIAS">MEDICO PEDIATRA URGENCIAS</MenuItem>
<MenuItem value="MEDICO PEDIATRA URG CUC">MEDICO PEDIATRA URG CUC</MenuItem>
<MenuItem value="COORDINADOR SERVICIOS GENERALES">COORDINADOR SERVICIOS GENERALES</MenuItem>
<MenuItem value="SUBGERENTE DE BIENESTAR">SUBGERENTE DE BIENESTAR</MenuItem>
<MenuItem value="MEDICO PEDIATRA HOSPITALARIO">MEDICO PEDIATRA HOSPITALARIO</MenuItem>
<MenuItem value="PATOLOGO SUBESPECIALISTA">PATOLOGO SUBESPECIALISTA</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA DE APOYO APH">AUXILIAR DE ENFERMERIA DE APOYO APH</MenuItem>
<MenuItem value="ASESOR MEDICO HISTORIA CLINICA">ASESOR MEDICO HISTORIA CLINICA</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA PEDIATRA URG PEDIATRICO">MEDICO ESPECIALISTA PEDIATRA URG PEDIATRICO</MenuItem>
<MenuItem value="AUXILIAR DE FACTURACION III">AUXILIAR DE FACTURACION III</MenuItem>
<MenuItem value="MEDICO RADIOLOGO">MEDICO RADIOLOGO</MenuItem>
<MenuItem value="SUPERVISOR(A) DE ENFERMERIA">SUPERVISOR(A) DE ENFERMERIA</MenuItem>
<MenuItem value="AUXILIAR ENFERMERA SOPORTE FACTURACION">AUXILIAR ENFERMERA SOPORTE FACTURACION</MenuItem>
<MenuItem value="SUPERVISOR DE SEGURIDAD I">SUPERVISOR DE SEGURIDAD I</MenuItem>
<MenuItem value="COORDINADOR DE PATOLOGIA">COORDINADOR DE PATOLOGIA</MenuItem>
<MenuItem value="AUXILIAR ARCHIVO Y ESTADISTICA">AUXILIAR ARCHIVO Y ESTADISTICA</MenuItem>
<MenuItem value="GESTOR CLINICO">GESTOR CLINICO</MenuItem>
<MenuItem value="MEDICO PEDIATRA NEONATOLOGA">MEDICO PEDIATRA NEONATOLOGA</MenuItem>
<MenuItem value="COORDINADOR MEDICO UCI PEDIATRA">COORDINADOR MEDICO UCI PEDIATRA</MenuItem>
<MenuItem value="TELEFONISTA-RECEPCIONISTA">TELEFONISTA-RECEPCIONISTA</MenuItem>
<MenuItem value="DIRECTOR DE SALUD Y SEGURIDAD EN EL TRABAJO">DIRECTOR DE SALUD Y SEGURIDAD EN EL TRABAJO</MenuItem>
<MenuItem value="ARQUITECTO DISE ADOR">ARQUITECTO DISE ADOR</MenuItem>
<MenuItem value="COORDINADOR DE NEONATOLOGIA CRS">COORDINADOR DE NEONATOLOGIA CRS</MenuItem>
<MenuItem value="MEDICO PEDIATRA NEONATOS SEBASTIAN">MEDICO PEDIATRA NEONATOS SEBASTIAN</MenuItem>
<MenuItem value="JEFE DE DEPARTAMENTO">JEFE DE DEPARTAMENTO</MenuItem>
<MenuItem value="ENFERMERO AUDITOR JUNIOR">ENFERMERO AUDITOR JUNIOR</MenuItem>
<MenuItem value="ESPECIALISTA DE CIBERSEGURIDAD">ESPECIALISTA DE CIBERSEGURIDAD</MenuItem>
<MenuItem value="ESPECIALISTA EN PROYECTOS">ESPECIALISTA EN PROYECTOS</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL INFRAESTRUCTURA CLINICA">DIRECTOR COMERCIAL INFRAESTRUCTURA CLINICA</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA NEONATOLOGO CRS">MEDICO SUBESPECIALISTA NEONATOLOGO CRS</MenuItem>
<MenuItem value="DIRECTOR DE DESARROLLO">DIRECTOR DE DESARROLLO</MenuItem>
<MenuItem value="ANALISTA DE CONTRATACION">ANALISTA DE CONTRATACION</MenuItem>
<MenuItem value="JEFE DE TURNO - MEDICO CIRUJANO">JEFE DE TURNO - MEDICO CIRUJANO</MenuItem>
<MenuItem value="LIDER DE EXPERIENCIA AL PACIENTE CUC">LIDER DE EXPERIENCIA AL PACIENTE CUC</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA GENETISTA">MEDICO SUBESPECIALISTA GENETISTA</MenuItem>
<MenuItem value="SUBGERENTE DE CONVENIOS, TARIFAS Y PARAMETRIZACION">SUBGERENTE DE CONVENIOS, TARIFAS Y PARAMETRIZACION</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA CIRUGIA PEDIATRICA">MEDICO ESPECIALISTA CIRUGIA PEDIATRICA</MenuItem>
<MenuItem value="ANALISTA TECNICO SENIOR II">ANALISTA TECNICO SENIOR II</MenuItem>
<MenuItem value="MEDICO NEONATOLOGO">MEDICO NEONATOLOGO</MenuItem>
<MenuItem value="COORDINADOR DE IMAGENOLOGIA">COORDINADOR DE IMAGENOLOGIA</MenuItem>
<MenuItem value="HEMATOPATOLOGO">HEMATOPATOLOGO</MenuItem>
<MenuItem value="MEDICO PEDIATRA URG CUC DE APOYO">MEDICO PEDIATRA URG CUC DE APOYO</MenuItem>
<MenuItem value="DIRECTOR DE HOSPITALIZACION">DIRECTOR DE HOSPITALIZACION</MenuItem>
<MenuItem value="DIRECTOR DE CIBERSEGURIDAD">DIRECTOR DE CIBERSEGURIDAD</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA CARDIOLOGO">MEDICO ESPECIALISTA CARDIOLOGO</MenuItem>
<MenuItem value="COMMUNITY MANAGER">COMMUNITY MANAGER</MenuItem>
<MenuItem value="ENFERMERA ESPECIALISTA DE CALIDAD">ENFERMERA ESPECIALISTA DE CALIDAD</MenuItem>
<MenuItem value="GESTOR DE INFORMACION">GESTOR DE INFORMACION</MenuItem>
<MenuItem value="MEDICO INTENSIVISTA PEDIATRA">MEDICO INTENSIVISTA PEDIATRA</MenuItem>
<MenuItem value="COORDINADOR DE SERVICIO Y EXPERIENCIA DEL USUARIO I">COORDINADOR DE SERVICIO Y EXPERIENCIA DEL USUARIO I</MenuItem>
<MenuItem value="ANALISTA GESTION FINANCIERA">ANALISTA GESTION FINANCIERA</MenuItem>
<MenuItem value="ANALISTA TECNICO JUNIOR">ANALISTA TECNICO JUNIOR</MenuItem>
<MenuItem value="LIDER FINANCIERO">LIDER FINANCIERO</MenuItem>
<MenuItem value="NUTRICIONISTA DE APOYO">NUTRICIONISTA DE APOYO</MenuItem>
<MenuItem value="SECRETARIA DEPARTAMENTO I">SECRETARIA DEPARTAMENTO I</MenuItem>
<MenuItem value="BACTERIOLOGO COORDINADOR">BACTERIOLOGO COORDINADOR</MenuItem>
<MenuItem value="COORDINADOR DE NUTRICION">COORDINADOR DE NUTRICION</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA GINECOONCOLOGO">MEDICO SUBESPECIALISTA GINECOONCOLOGO</MenuItem>
<MenuItem value="CONDUCTOR">CONDUCTOR</MenuItem>
<MenuItem value="DIRECTOR MEDICO PHD">DIRECTOR MEDICO PHD</MenuItem>
<MenuItem value="JEFE DE CARDIOLOGIA">JEFE DE CARDIOLOGIA</MenuItem>
<MenuItem value="SECRETARIA - AUXILIAR DE LABORATORIO">SECRETARIA - AUXILIAR DE LABORATORIO</MenuItem>
<MenuItem value="SUBGERENTE DE MANTENIMIENTO LOCATIVO">SUBGERENTE DE MANTENIMIENTO LOCATIVO</MenuItem>
<MenuItem value="JEFE DE DEPARTAMENTO DE RADIOLOGIA">JEFE DE DEPARTAMENTO DE RADIOLOGIA</MenuItem>
<MenuItem value="ASESOR JUNIOR SISTEMAS DE INFORMACION">ASESOR JUNIOR SISTEMAS DE INFORMACION</MenuItem>
<MenuItem value="GERENTE DE GESTI N FARMAC UTICA">GERENTE DE GESTI N FARMAC UTICA</MenuItem>
<MenuItem value="CONSULTOR FUNCIONAL SENIOR II">CONSULTOR FUNCIONAL SENIOR II</MenuItem>
<MenuItem value="AUXILIAR DE ARCHIVO">AUXILIAR DE ARCHIVO</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA ENFERMEDADES INFECCIOSAS">COORDINADOR DE ENFERMERIA ENFERMEDADES INFECCIOSAS</MenuItem>
<MenuItem value="MEDICO GENERAL HOSPITALARIO DE APOYO">MEDICO GENERAL HOSPITALARIO DE APOYO</MenuItem>
<MenuItem value="GESTOR LOGISTICO Y ADMINISTRATIVO">GESTOR LOGISTICO Y ADMINISTRATIVO</MenuItem>
<MenuItem value="ADMINISTRADOR DEL SISTEMA DE IMAGENES">ADMINISTRADOR DEL SISTEMA DE IMAGENES</MenuItem>
<MenuItem value="MEDICO PEDIATRA HOSPITALARIO CUC">MEDICO PEDIATRA HOSPITALARIO CUC</MenuItem>
<MenuItem value="ANALISTA GESTION DEL CAMBIO SENIOR">ANALISTA GESTION DEL CAMBIO SENIOR</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA INTERNISTA DE APOYO">MEDICO ESPECIALISTA INTERNISTA DE APOYO</MenuItem>
<MenuItem value="SECRETARIA TRANSCRIPTORA I">SECRETARIA TRANSCRIPTORA I</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA UNIDAD DE UROLOGIA">AUXILIAR DE ENFERMERIA UNIDAD DE UROLOGIA</MenuItem>
<MenuItem value="DOCTOR EN BIOLOGIA">DOCTOR EN BIOLOGIA</MenuItem>
<MenuItem value="ANALISTA DE DATOS">ANALISTA DE DATOS</MenuItem>
<MenuItem value="PROMOTOR DE SERVICIOS">PROMOTOR DE SERVICIOS</MenuItem>
<MenuItem value="AUXILIAR DE SERVICIOS ASISTENCIALES DE APOYO">AUXILIAR DE SERVICIOS ASISTENCIALES DE APOYO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA EN MEDICINA DEL DOLOR Y CUIDADO PALIATIVO">MEDICO ESPECIALISTA EN MEDICINA DEL DOLOR Y CUIDADO PALIATIVO</MenuItem>
<MenuItem value="ANALISTA RECURSOS FISICOS">ANALISTA RECURSOS FISICOS</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA NEUMOLOGO PEDIATRA">MEDICO SUBESPECIALISTA NEUMOLOGO PEDIATRA</MenuItem>
<MenuItem value="LIDER DE CALIDAD Y TECNOVIGILANCIA">LIDER DE CALIDAD Y TECNOVIGILANCIA</MenuItem>
<MenuItem value="AUXILIAR ADMINISTRATIVO DE FACTURACION">AUXILIAR ADMINISTRATIVO DE FACTURACION</MenuItem>
<MenuItem value="JEFE DE DEPARTAMENTO QUIRURGICO">JEFE DE DEPARTAMENTO QUIRURGICO</MenuItem>
<MenuItem value="ANALISTA BUSINESS PARTNER">ANALISTA BUSINESS PARTNER</MenuItem>
<MenuItem value="MEDICO PEDIATRA NEONATOS CRS">MEDICO PEDIATRA NEONATOS CRS</MenuItem>
<MenuItem value="BACTERIOLOGO">BACTERIOLOGO</MenuItem>
<MenuItem value="TERAPEUTA RESPIRATORIA DE APOYO">TERAPEUTA RESPIRATORIA DE APOYO</MenuItem>
<MenuItem value="GERENTE DE INGENIERIA HOSPITALARIA">GERENTE DE INGENIERIA HOSPITALARIA</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA PROGRAMA DE SEGURIDAD DEL PACIENTE">COORDINADOR DE ENFERMERIA PROGRAMA DE SEGURIDAD DEL PACIENTE</MenuItem>
<MenuItem value="PROFESIONAL DE DESARROLLO DE TALENTO">PROFESIONAL DE DESARROLLO DE TALENTO</MenuItem>
<MenuItem value="COORDINADOR COMITE INFECCIONES">COORDINADOR COMITE INFECCIONES</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE ENFERMERIA">AUXILIAR OPERATIVO DE ENFERMERIA</MenuItem>
<MenuItem value="GERENTE DE CANALES">GERENTE DE CANALES</MenuItem>
<MenuItem value="MEDICO RADIOLOGO I">MEDICO RADIOLOGO I</MenuItem>
<MenuItem value="SECRETARIA GRUPO DE TRASPLANTES">SECRETARIA GRUPO DE TRASPLANTES</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA HEMODINAMIA Y CARDIOLOGIA">COORDINADOR DE ENFERMERIA HEMODINAMIA Y CARDIOLOGIA</MenuItem>
<MenuItem value="LIDER DE PROYECTOS DE OBRA">LIDER DE PROYECTOS DE OBRA</MenuItem>
<MenuItem value="SECRETARIA VICEPRESIDENCIA">SECRETARIA VICEPRESIDENCIA</MenuItem>
<MenuItem value="GESTOR DE SERVICIOS TI">GESTOR DE SERVICIOS TI</MenuItem>
<MenuItem value="ABOGADO CORPORATIVO III">ABOGADO CORPORATIVO III</MenuItem>
<MenuItem value="AUXILIAR CONTRATACION DE PRESTADORES">AUXILIAR CONTRATACION DE PRESTADORES</MenuItem>
<MenuItem value="ESPECIALISTA IV">ESPECIALISTA IV</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO CENTRAL DE REFERENCIA">COORDINADOR OPERATIVO CENTRAL DE REFERENCIA</MenuItem>
<MenuItem value="ENFERMERA JEFE ONCOLOGIA">ENFERMERA JEFE ONCOLOGIA</MenuItem>
<MenuItem value="MEDICO INVESTIGADOR">MEDICO INVESTIGADOR</MenuItem>
<MenuItem value="GESTOR DE ATENCION AL USUARIO I">GESTOR DE ATENCION AL USUARIO I</MenuItem>
<MenuItem value="GERENTE DE OPERACIONES EN SALUD">GERENTE DE OPERACIONES EN SALUD</MenuItem>
<MenuItem value="AUXILIAR SOPORTE DE IMAGENOLOGIA">AUXILIAR SOPORTE DE IMAGENOLOGIA</MenuItem>
<MenuItem value="TECNOLOGO EN RADIOLOGIA CONVENCIONAL DE APOYO">TECNOLOGO EN RADIOLOGIA CONVENCIONAL DE APOYO</MenuItem>
<MenuItem value="SECRETARIA DEPARTAMENTO SERVICIOS GENERALES">SECRETARIA DEPARTAMENTO SERVICIOS GENERALES</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA NEONATOLOGO CUC">MEDICO SUBESPECIALISTA NEONATOLOGO CUC</MenuItem>
<MenuItem value="AUXILIAR DE ESTERILIZACION">AUXILIAR DE ESTERILIZACION</MenuItem>
<MenuItem value="COORDINADOR DE CONTABILIDAD">COORDINADOR DE CONTABILIDAD</MenuItem>
<MenuItem value="ANALISTA DE COMPENSACION PRESTADORES">ANALISTA DE COMPENSACION PRESTADORES</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA PROGRAMAS ESPECIALES">COORDINADOR DE ENFERMERIA PROGRAMAS ESPECIALES</MenuItem>
<MenuItem value="JEFE DE SOPORTE EMOCIONAL">JEFE DE SOPORTE EMOCIONAL</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA REHABILITADOR CARDIACO">MEDICO ESPECIALISTA REHABILITADOR CARDIACO</MenuItem>
<MenuItem value="MEDICO DPTO VIG Y CONT ENF INFECCIOSAS">MEDICO DPTO VIG Y CONT ENF INFECCIOSAS</MenuItem>
<MenuItem value="GESTOR CLINICO PHD">GESTOR CLINICO PHD</MenuItem>
<MenuItem value="MEDICO PEDIATRA DPTO VIG CONT ENF INFECC">MEDICO PEDIATRA DPTO VIG CONT ENF INFECC</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA EN MEDICINA NUCLEAR">MEDICO ESPECIALISTA EN MEDICINA NUCLEAR</MenuItem>
<MenuItem value="SECRETARIA TRANSCRIPTORA DE APOYO">SECRETARIA TRANSCRIPTORA DE APOYO</MenuItem>
<MenuItem value="ANALISTA DE BIENESTAR">ANALISTA DE BIENESTAR</MenuItem>
<MenuItem value="GERENTE PROYECTOS DE INFRAESTRUCTURA">GERENTE PROYECTOS DE INFRAESTRUCTURA</MenuItem>
<MenuItem value="DIRECTOR DE COMPRAS DE TECNOLOGIA INFORMATICA">DIRECTOR DE COMPRAS DE TECNOLOGIA INFORMATICA</MenuItem>
<MenuItem value="REGENTE DE FARMACIA DE APOYO">REGENTE DE FARMACIA DE APOYO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA CIRUJANO DE APOYO">MEDICO ESPECIALISTA CIRUJANO DE APOYO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA INFECTOLOGO">MEDICO ESPECIALISTA INFECTOLOGO</MenuItem>
<MenuItem value="GESTOR MEDICO PROGRAMA CONTIGO PHD">GESTOR MEDICO PROGRAMA CONTIGO PHD</MenuItem>
<MenuItem value="INFORMADOR DE ATENCION AL USUARIO DE APOYO">INFORMADOR DE ATENCION AL USUARIO DE APOYO</MenuItem>
<MenuItem value="SECRETARIA DEPARTAMENTO">SECRETARIA DEPARTAMENTO</MenuItem>
<MenuItem value="JEFE COMITE INFECCIONES">JEFE COMITE INFECCIONES</MenuItem>
<MenuItem value="PATOLOGO DE APOYO">PATOLOGO DE APOYO</MenuItem>
<MenuItem value="MEDICO PEDIATRA URGENCIAS DE APOYO">MEDICO PEDIATRA URGENCIAS DE APOYO</MenuItem>
<MenuItem value="AUXILIAR DE ADMISIONES Y FACTURACION DE APOYO">AUXILIAR DE ADMISIONES Y FACTURACION DE APOYO</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA UNIDAD DE EPIDEMIOLOGIA">COORDINADOR DE ENFERMERIA UNIDAD DE EPIDEMIOLOGIA</MenuItem>
<MenuItem value="COORDINADOR MEDICO UCI">COORDINADOR MEDICO UCI</MenuItem>
<MenuItem value="LIDER DE MANTENIMIENTO">LIDER DE MANTENIMIENTO</MenuItem>
<MenuItem value="ANALISTA DE ESTADISTICA">ANALISTA DE ESTADISTICA</MenuItem>
<MenuItem value="LIDER TRABAJO SOCIAL">LIDER TRABAJO SOCIAL</MenuItem>
<MenuItem value="GESTOR DE SALUD MENTAL">GESTOR DE SALUD MENTAL</MenuItem>
<MenuItem value="JEFE DEL SERVICIO DE RADIOLOGIA CUNC.">JEFE DEL SERVICIO DE RADIOLOGIA CUNC.</MenuItem>
<MenuItem value="GESTOR DE ATENCION AL USUARIO">GESTOR DE ATENCION AL USUARIO</MenuItem>
<MenuItem value="GESTOR OPERATIVO DE SEGURIDAD">GESTOR OPERATIVO DE SEGURIDAD</MenuItem>
<MenuItem value="GESTOR OPERATIVO">GESTOR OPERATIVO</MenuItem>
<MenuItem value="ESPECIALISTA BIOMEDICO II">ESPECIALISTA BIOMEDICO II</MenuItem>
<MenuItem value="JEFE DEPARTAMENTO DE ENFERMERIA">JEFE DEPARTAMENTO DE ENFERMERIA</MenuItem>
<MenuItem value="PROFESIONAL MODELOS DE INFORMACION">PROFESIONAL MODELOS DE INFORMACION</MenuItem>
<MenuItem value="VICEPRESIDENTE CIENTIFICO E INVESTIGACION">VICEPRESIDENTE CIENTIFICO E INVESTIGACION</MenuItem>
<MenuItem value="SECRETARIA DEPARTAMENTO DE ENFERMERIA">SECRETARIA DEPARTAMENTO DE ENFERMERIA</MenuItem>
<MenuItem value="BACTERIOLOGO COORDINADOR REGIONAL">BACTERIOLOGO COORDINADOR REGIONAL</MenuItem>
<MenuItem value="BACTERIOLOGO ADMINISTRATIVO">BACTERIOLOGO ADMINISTRATIVO</MenuItem>
<MenuItem value="BACTERIOLOGO DE CALIDAD">BACTERIOLOGO DE CALIDAD</MenuItem>
<MenuItem value="RECLUTADOR INVESTIGACION">RECLUTADOR INVESTIGACION</MenuItem>
<MenuItem value="ANALISTA DE DESARROLLO HUMANO">ANALISTA DE DESARROLLO HUMANO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA EN MEDICINA DEL DOLOR">MEDICO ESPECIALISTA EN MEDICINA DEL DOLOR</MenuItem>
<MenuItem value="JEFE NACIONAL DE RADIOLOGIA">JEFE NACIONAL DE RADIOLOGIA</MenuItem>
<MenuItem value="AUXILIAR DE CORRESPONDENCIA">AUXILIAR DE CORRESPONDENCIA</MenuItem>
<MenuItem value="GESTOR ASEGURAMIENTO DE LA CALIDAD">GESTOR ASEGURAMIENTO DE LA CALIDAD</MenuItem>
<MenuItem value="COORDINADOR DE CAMPA A">COORDINADOR DE CAMPA A</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA CONSULTA EXTERNA">COORDINADOR DE ENFERMERIA CONSULTA EXTERNA</MenuItem>
<MenuItem value="COORDINADOR DE FACTURACION">COORDINADOR DE FACTURACION</MenuItem>
<MenuItem value="COORDINADOR DE EPIDEMIOLOGIA Y SALUD PUBLICA">COORDINADOR DE EPIDEMIOLOGIA Y SALUD PUBLICA</MenuItem>
<MenuItem value="COORDINADOR DE CUENTAS POR PAGAR">COORDINADOR DE CUENTAS POR PAGAR</MenuItem>
<MenuItem value="DIRECTOR CIENTIFICO">DIRECTOR CIENTIFICO</MenuItem>
<MenuItem value="GESTOR INTEGRAL DE ATENCION">GESTOR INTEGRAL DE ATENCION</MenuItem>
<MenuItem value="SUBGERENTE DE SOLUCIONES UNIDAD DE NEGOCIO">SUBGERENTE DE SOLUCIONES UNIDAD DE NEGOCIO</MenuItem>
<MenuItem value="CONSULTOR TECNICO DE ARQUITECTURA">CONSULTOR TECNICO DE ARQUITECTURA</MenuItem>
<MenuItem value="LIDER DE COMPENSACION">LIDER DE COMPENSACION</MenuItem>
<MenuItem value="SUBGERENTE DE SISTEMA DE ACREDITACION">SUBGERENTE DE SISTEMA DE ACREDITACION</MenuItem>
<MenuItem value="COORDINADOR DE TESORERIA">COORDINADOR DE TESORERIA</MenuItem>
<MenuItem value="LIDER OPERATIVO NACIONAL RADIOLOGIA">LIDER OPERATIVO NACIONAL RADIOLOGIA</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA NEFROLOGO PEDIATRA">MEDICO SUBESPECIALISTA NEFROLOGO PEDIATRA</MenuItem>
<MenuItem value="COORDINADOR BUSINESS PARTNER REGIONAL">COORDINADOR BUSINESS PARTNER REGIONAL</MenuItem>
<MenuItem value="AUDITOR MEDICO">AUDITOR MEDICO</MenuItem>
<MenuItem value="SUBDIRECTOR MEDICO DE CALIDAD">SUBDIRECTOR MEDICO DE CALIDAD</MenuItem>
<MenuItem value="LIDER DE INGENIERIA BIOMEDICA">LIDER DE INGENIERIA BIOMEDICA</MenuItem>
<MenuItem value="ESPECIALISTA DE GESTION DE LA INFORMACION">ESPECIALISTA DE GESTION DE LA INFORMACION</MenuItem>
<MenuItem value="DIRECTOR DE SEGUROS">DIRECTOR DE SEGUROS</MenuItem>
<MenuItem value="JEFE DEL SERVICIO DE TERAPIA">JEFE DEL SERVICIO DE TERAPIA</MenuItem>
<MenuItem value="ANALISTA TECNICO SENIOR I">ANALISTA TECNICO SENIOR I</MenuItem>
<MenuItem value="ADMINISTRADOR DEL SISTEMA I">ADMINISTRADOR DEL SISTEMA I</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA OTORRINOLARINGOLOGO DE APOYO">MEDICO ESPECIALISTA OTORRINOLARINGOLOGO DE APOYO</MenuItem>
<MenuItem value="SECRETARIA DEPARTAMENTO DE URGENCIAS">SECRETARIA DEPARTAMENTO DE URGENCIAS</MenuItem>
<MenuItem value="INSTRUMENTADOR QUIRURGICO DE APOYO">INSTRUMENTADOR QUIRURGICO DE APOYO</MenuItem>
<MenuItem value="FISIOTERAPEUTA DE APOYO">FISIOTERAPEUTA DE APOYO</MenuItem>
<MenuItem value="GESTOR CLINICO PROGRAMA CONTIGO">GESTOR CLINICO PROGRAMA CONTIGO</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA NEONATOLOGO PEDIATRA">MEDICO SUBESPECIALISTA NEONATOLOGO PEDIATRA</MenuItem>
<MenuItem value="CONSULTOR FUNCIONAL SENIOR I">CONSULTOR FUNCIONAL SENIOR I</MenuItem>
<MenuItem value="TECNOLOGO EN MEDICINA NUCLEAR DE APOYO">TECNOLOGO EN MEDICINA NUCLEAR DE APOYO</MenuItem>
<MenuItem value="ANALISTA BIOINFORMATICO JUNIOR">ANALISTA BIOINFORMATICO JUNIOR</MenuItem>
<MenuItem value="AUXILIAR DE DIETAS">AUXILIAR DE DIETAS</MenuItem>
<MenuItem value="COORDINADOR DE ESTUDIOS">COORDINADOR DE ESTUDIOS</MenuItem>
<MenuItem value="PSICOPEDAGOGA">PSICOPEDAGOGA</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA GINECOBSTETRA DE APOYO">MEDICO ESPECIALISTA GINECOBSTETRA DE APOYO</MenuItem>
<MenuItem value="ANALISTA FUNCIONAL JUNIOR">ANALISTA FUNCIONAL JUNIOR</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA SERVICIO">AUXILIAR DE ENFERMERIA SERVICIO</MenuItem>
<MenuItem value="ANALISTA DE CARTERA">ANALISTA DE CARTERA</MenuItem>
<MenuItem value="SECRETARIA INGENIERIA Y MANTENIMIENTO">SECRETARIA INGENIERIA Y MANTENIMIENTO</MenuItem>
<MenuItem value="ENFERMERA JEFE DE RADIOLOGIA">ENFERMERA JEFE DE RADIOLOGIA</MenuItem>
<MenuItem value="COORDINADOR DE BIOINFORMATICA">COORDINADOR DE BIOINFORMATICA</MenuItem>
<MenuItem value="ANALISTA DE COSTOS">ANALISTA DE COSTOS</MenuItem>
<MenuItem value="MEDICO GINECOBSTETRA">MEDICO GINECOBSTETRA</MenuItem>
<MenuItem value="ANALISTA DE SOPORTE JUNIOR I">ANALISTA DE SOPORTE JUNIOR I</MenuItem>
<MenuItem value="AUXILIAR ADMINISTRATIVO I">AUXILIAR ADMINISTRATIVO I</MenuItem>
<MenuItem value="LIDER DE SELECCION">LIDER DE SELECCION</MenuItem>
<MenuItem value="AUXILIAR DE ADMINISTRACION DE SALARIOS">AUXILIAR DE ADMINISTRACION DE SALARIOS</MenuItem>
<MenuItem value="GESTOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO DE APOYO">GESTOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO DE APOYO</MenuItem>
<MenuItem value="GERENTE DE BUSINESS PARTNER INFRAESTRUCTURA DE SALUD">GERENTE DE BUSINESS PARTNER INFRAESTRUCTURA DE SALUD</MenuItem>
<MenuItem value="ANALISTA ADMINISTRATIVO DE APOYO">ANALISTA ADMINISTRATIVO DE APOYO</MenuItem>
<MenuItem value="ABOGADO PROCESAL II">ABOGADO PROCESAL II</MenuItem>
<MenuItem value="PRESIDENTE DE INFRAESTRUCTURA CLINICA">PRESIDENTE DE INFRAESTRUCTURA CLINICA</MenuItem>
<MenuItem value="COORDINADOR DE SALUD MENTAL">COORDINADOR DE SALUD MENTAL</MenuItem>
<MenuItem value="JEFE DE SERVICIOS AMBULATORIOS">JEFE DE SERVICIOS AMBULATORIOS</MenuItem>
<MenuItem value="MEDICO RADIOLOGO DE APOYO">MEDICO RADIOLOGO DE APOYO</MenuItem>
<MenuItem value="JEFE DEL SERVICIO DE ORTOPEDIA CUNC">JEFE DEL SERVICIO DE ORTOPEDIA CUNC</MenuItem>
<MenuItem value="DIRECTOR DE TESORERIA">DIRECTOR DE TESORERIA</MenuItem>
<MenuItem value="JEFE DE SEGURIDAD CLINICA">JEFE DE SEGURIDAD CLINICA</MenuItem>
<MenuItem value="ANALISTA WEB">ANALISTA WEB</MenuItem>
<MenuItem value="DIRECTORA DE BIENESTAR Y CALIDAD DE VIDA">DIRECTORA DE BIENESTAR Y CALIDAD DE VIDA</MenuItem>
<MenuItem value="JEFE DE AMBIENTES FISICOS Y SERVICIOS GENERALES">JEFE DE AMBIENTES FISICOS Y SERVICIOS GENERALES</MenuItem>
<MenuItem value="ANALISTA DE CAPACITACION Y DESARROLLO SENIOR">ANALISTA DE CAPACITACION Y DESARROLLO SENIOR</MenuItem>
<MenuItem value="ANALISTA FUNCIONAL SENIOR I">ANALISTA FUNCIONAL SENIOR I</MenuItem>
<MenuItem value="SECRETARIA DIRECCION CIENTIFICA">SECRETARIA DIRECCION CIENTIFICA</MenuItem>
<MenuItem value="CAPELLAN">CAPELLAN</MenuItem>
<MenuItem value="AUXILIAR DE LAVANDERIA">AUXILIAR DE LAVANDERIA</MenuItem>
<MenuItem value="ALMACENISTA">ALMACENISTA</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA SALUD OCUPACIONAL">MEDICO ESPECIALISTA SALUD OCUPACIONAL</MenuItem>
<MenuItem value="COORDINADOR DE INVESTIGACION">COORDINADOR DE INVESTIGACION</MenuItem>
<MenuItem value="ESPECIALISTA DE BIENESTAR Y CALIDAD">ESPECIALISTA DE BIENESTAR Y CALIDAD</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE COMPENSACION PRESTADORES">AUXILIAR OPERATIVO DE COMPENSACION PRESTADORES</MenuItem>
<MenuItem value="ENFERMERA SOPORTE FACTURACION">ENFERMERA SOPORTE FACTURACION</MenuItem>
<MenuItem value="ESPECIALISTA DE PROTECCION RADIOLOGICA">ESPECIALISTA DE PROTECCION RADIOLOGICA</MenuItem>
<MenuItem value="TELEFONISTA-RECEPCIONISTA I">TELEFONISTA-RECEPCIONISTA I</MenuItem>
<MenuItem value="COORDINADOR DE FACTURACION CUC">COORDINADOR DE FACTURACION CUC</MenuItem>
<MenuItem value="JEFE DE MANTENIMIENTO REGIONAL">JEFE DE MANTENIMIENTO REGIONAL</MenuItem>
<MenuItem value="AUXILIAR DE CONTRATACION">AUXILIAR DE CONTRATACION</MenuItem>
<MenuItem value="SUPERVISOR DE RADIOLOGIA">SUPERVISOR DE RADIOLOGIA</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE FACTURACION">AUXILIAR OPERATIVO DE FACTURACION</MenuItem>
<MenuItem value="COORDINADOR DE FISIOTERAPIA">COORDINADOR DE FISIOTERAPIA</MenuItem>
<MenuItem value="GESTOR DE COMPRAS">GESTOR DE COMPRAS</MenuItem>
<MenuItem value="ENFERMERA GESTORA CLINICA">ENFERMERA GESTORA CLINICA</MenuItem>
<MenuItem value="AUXILIAR DE COMPRAS">AUXILIAR DE COMPRAS</MenuItem>
<MenuItem value="GESTOR ADMINISTRATIVO">GESTOR ADMINISTRATIVO</MenuItem>
<MenuItem value="ESPECIALISTA DE COMUNICACIONES EXTERNAS">ESPECIALISTA DE COMUNICACIONES EXTERNAS</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO NACIONAL CENTROS AMBULATORIOS">DIRECTOR ADMINISTRATIVO NACIONAL CENTROS AMBULATORIOS</MenuItem>
<MenuItem value="ENFERMERA ESPECIALISTA DE CUIDADOS PALIATIVOS">ENFERMERA ESPECIALISTA DE CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="GESTOR OPERATIVO DIRECCION ADMINISTRATIVA">GESTOR OPERATIVO DIRECCION ADMINISTRATIVA</MenuItem>
<MenuItem value="BACTERIOLOGA ADMINISTRATIVA Y CALIDAD I">BACTERIOLOGA ADMINISTRATIVA Y CALIDAD I</MenuItem>
<MenuItem value="AUXILIAR ADMINISTRATIVO DE FACTURACION I">AUXILIAR ADMINISTRATIVO DE FACTURACION I</MenuItem>
<MenuItem value="QUIMICO FARMACEUTICO DE APOYO">QUIMICO FARMACEUTICO DE APOYO</MenuItem>
<MenuItem value="BACTERIOLOGO ESPECIALISTA EN MEDICINA NUCLEAR">BACTERIOLOGO ESPECIALISTA EN MEDICINA NUCLEAR</MenuItem>
<MenuItem value="TERAPISTA">TERAPISTA</MenuItem>
<MenuItem value="PROFESIONAL EN SALUD DE SERVICIOS MEDICOS">PROFESIONAL EN SALUD DE SERVICIOS MEDICOS</MenuItem>
<MenuItem value="ONCOPATOLOGO">ONCOPATOLOGO</MenuItem>
<MenuItem value="COORDINADOR PROGRAMA SEGURIDAD DEL PACIENTE">COORDINADOR PROGRAMA SEGURIDAD DEL PACIENTE</MenuItem>
<MenuItem value="COORDINADOR DE SERVICIO Y EXPERIENCIA DEL USUARIO">COORDINADOR DE SERVICIO Y EXPERIENCIA DEL USUARIO</MenuItem>
<MenuItem value="ANALISTA DE PLANEACION Y DESARROLLO">ANALISTA DE PLANEACION Y DESARROLLO</MenuItem>
<MenuItem value="ESPECIALISTA BIOMEDICO I">ESPECIALISTA BIOMEDICO I</MenuItem>
<MenuItem value="GESTOR DE SEGURIDAD POR EL PACIENTE">GESTOR DE SEGURIDAD POR EL PACIENTE</MenuItem>
<MenuItem value="DIRECTOR MEDICO NACIONAL CENTROS AMBULATORIOS">DIRECTOR MEDICO NACIONAL CENTROS AMBULATORIOS</MenuItem>
<MenuItem value="GERENTE DE COMPRAS DE INFRAESTRUCTURA FISICA, EQUIPO MEDICO Y SUMINISTROS">GERENTE DE COMPRAS DE INFRAESTRUCTURA FISICA, EQUIPO MEDICO Y SUMINISTROS</MenuItem>
<MenuItem value="JEFE DEL SERVICIO DE CIRUGIA">JEFE DEL SERVICIO DE CIRUGIA</MenuItem>
<MenuItem value="COORDINADOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO">COORDINADOR DE TRABAJO SOCIAL Y ATENCION AL USUARIO</MenuItem>
<MenuItem value="LIDER DE GESTION ADMINISTRATIVA Y OPERACIONES">LIDER DE GESTION ADMINISTRATIVA Y OPERACIONES</MenuItem>
<MenuItem value="ENFERMERA ESPECIALIZADA UNIDAD RENAL">ENFERMERA ESPECIALIZADA UNIDAD RENAL</MenuItem>
<MenuItem value="COORDINADOR GESTION HOSPITALARIA">COORDINADOR GESTION HOSPITALARIA</MenuItem>
<MenuItem value="GERENTE DE GESTION DE LA INFORMACION">GERENTE DE GESTION DE LA INFORMACION</MenuItem>
<MenuItem value="ODONTOLOGO ATENCION PRIMARIA">ODONTOLOGO ATENCION PRIMARIA</MenuItem>
<MenuItem value="SUBGERENTE DE MARKETING Y COMUNICACIONES">SUBGERENTE DE MARKETING Y COMUNICACIONES</MenuItem>
<MenuItem value="SUBGERENTE DE ATRACCION">SUBGERENTE DE ATRACCION</MenuItem>
<MenuItem value="AUXILIAR DATA MASTER">AUXILIAR DATA MASTER</MenuItem>
<MenuItem value="DIRECTOR DE GESTION DE INFORMACION">DIRECTOR DE GESTION DE INFORMACION</MenuItem>
<MenuItem value="DIRECTOR MEDICO LABORATORIO CLINICO">DIRECTOR MEDICO LABORATORIO CLINICO</MenuItem>
<MenuItem value="REGULADOR">REGULADOR</MenuItem>
<MenuItem value="COORDINADOR DE TERAPIA">COORDINADOR DE TERAPIA</MenuItem>
<MenuItem value="LIDER DE INGENIERIA BIOMEDICA IMAGENES DIAGNOSTICAS">LIDER DE INGENIERIA BIOMEDICA IMAGENES DIAGNOSTICAS</MenuItem>
<MenuItem value="ANALISTA CONTROL Y POLITICA CONTABLE">ANALISTA CONTROL Y POLITICA CONTABLE</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO CENTRAL DE COMPRAS">DIRECTOR ADMINISTRATIVO CENTRAL DE COMPRAS</MenuItem>
<MenuItem value="COORDINADOR DE RECAUDO">COORDINADOR DE RECAUDO</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA GESTION CLINICA">AUXILIAR DE ENFERMERIA GESTION CLINICA</MenuItem>
<MenuItem value="VICEPRESIDENTE DE GESTION EN SALUD">VICEPRESIDENTE DE GESTION EN SALUD</MenuItem>
<MenuItem value="ANALISTA DE ARCHIVO Y ESTADISTICA">ANALISTA DE ARCHIVO Y ESTADISTICA</MenuItem>
<MenuItem value="VICEPRESIDENTE DE OPERACIONES INFRAESTRUCTURA CLINICA">VICEPRESIDENTE DE OPERACIONES INFRAESTRUCTURA CLINICA</MenuItem>
<MenuItem value="COORDINADOR CLINICAS MEDICAS">COORDINADOR CLINICAS MEDICAS</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA ORTOPEDISTA DE APOYO">MEDICO ESPECIALISTA ORTOPEDISTA DE APOYO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA REUMATOLOGO">MEDICO ESPECIALISTA REUMATOLOGO</MenuItem>
<MenuItem value="ANALISTA DE TESORERIA I">ANALISTA DE TESORERIA I</MenuItem>
<MenuItem value="GESTOR EPIDEMIOLOGIA CLINICA">GESTOR EPIDEMIOLOGIA CLINICA</MenuItem>
<MenuItem value="LIDER DE COMPRAS JUNIOR">LIDER DE COMPRAS JUNIOR</MenuItem>
<MenuItem value="ANALISTA JUNIOR DE BIENESTAR">ANALISTA JUNIOR DE BIENESTAR</MenuItem>
<MenuItem value="MEDICO PEDIATRA SUBESPECIALISTA EN MEDICINA DEL DOLOR Y CUIDADO PALIATIVO">MEDICO PEDIATRA SUBESPECIALISTA EN MEDICINA DEL DOLOR Y CUIDADO PALIATIVO</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA PROGRAMAS PYP Y DEMANDA INDUCIDA">COORDINADOR DE ENFERMERIA PROGRAMAS PYP Y DEMANDA INDUCIDA</MenuItem>
<MenuItem value="ANALISTA SISTEMA DE GESTION INTEGRADO">ANALISTA SISTEMA DE GESTION INTEGRADO</MenuItem>
<MenuItem value="JEFE DE NUTRICION Y DIETETICA">JEFE DE NUTRICION Y DIETETICA</MenuItem>
<MenuItem value="COORDINADOR DE PROYECTOS DE BIENESTAR">COORDINADOR DE PROYECTOS DE BIENESTAR</MenuItem>
<MenuItem value="ANALISTA DE CONTABILIDAD IV">ANALISTA DE CONTABILIDAD IV</MenuItem>
<MenuItem value="CONSULTOR DE MEJORA">CONSULTOR DE MEJORA</MenuItem>
<MenuItem value="DISE ADOR GRAFICO JR">DISE ADOR GRAFICO JR</MenuItem>
<MenuItem value="SECRETARIA DEL SERVICIO DE IMAGENES">SECRETARIA DEL SERVICIO DE IMAGENES</MenuItem>
<MenuItem value="ANALISTA DE CUENTAS POR PAGAR I">ANALISTA DE CUENTAS POR PAGAR I</MenuItem>
<MenuItem value="JEFE DE DEPARTAMENTO DE PATOLOGIA">JEFE DE DEPARTAMENTO DE PATOLOGIA</MenuItem>
<MenuItem value="ANALISTA FUNCIONAL SENIOR">ANALISTA FUNCIONAL SENIOR</MenuItem>
<MenuItem value="JEFE NACIONAL DE MEDICINA MATERNO FETAL">JEFE NACIONAL DE MEDICINA MATERNO FETAL</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA DE EDUCACION">COORDINADOR DE ENFERMERIA DE EDUCACION</MenuItem>
<MenuItem value="QUIMICO FARMACEUTICO I">QUIMICO FARMACEUTICO I</MenuItem>
<MenuItem value="JEFE DEL SERVICIO DE GINECOBSTETRICIA CUNC">JEFE DEL SERVICIO DE GINECOBSTETRICIA CUNC</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA UCI">COORDINADOR DE ENFERMERIA UCI</MenuItem>
<MenuItem value="JEFE UNIDAD DOCENTE ASISTENCIAL">JEFE UNIDAD DOCENTE ASISTENCIAL</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE AUDITORIA MEDICA">DIRECTOR NACIONAL DE AUDITORIA MEDICA</MenuItem>
<MenuItem value="COORDINADOR DE NEONATOLOGIA CUC">COORDINADOR DE NEONATOLOGIA CUC</MenuItem>
<MenuItem value="JEFE DE TURNO">JEFE DE TURNO</MenuItem>
<MenuItem value="COORDINADOR DE TRASPLANTE">COORDINADOR DE TRASPLANTE</MenuItem>
<MenuItem value="DIRECTOR MEDICO DE FACTURACION Y CONVENIOS">DIRECTOR MEDICO DE FACTURACION Y CONVENIOS</MenuItem>
<MenuItem value="TECNOLOGO DE APOYO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD I">TECNOLOGO DE APOYO EN RADIOLOGIA MAQUINAS ALTA COMPLEJIDAD I</MenuItem>
<MenuItem value="MEDICO INTERNISTA PROGRAMAS ESPECIALES">MEDICO INTERNISTA PROGRAMAS ESPECIALES</MenuItem>
<MenuItem value="GERENTE DE COMPRAS DE EQUIPO MEDICO Y SERVICIOS">GERENTE DE COMPRAS DE EQUIPO MEDICO Y SERVICIOS</MenuItem>
<MenuItem value="COORDINADOR DE REFERENCIA Y CONTRARREFERENCIA">COORDINADOR DE REFERENCIA Y CONTRARREFERENCIA</MenuItem>
<MenuItem value="JEFE SEGURIDAD DEL PACIENTE">JEFE SEGURIDAD DEL PACIENTE</MenuItem>
<MenuItem value="SECRETARIA DE GERENCIA">SECRETARIA DE GERENCIA</MenuItem>
<MenuItem value="GERENTE DE PROCESOS HOSPITALARIOS">GERENTE DE PROCESOS HOSPITALARIOS</MenuItem>
<MenuItem value="DIRECTORA DE PLANEACION Y DESARROLLO">DIRECTORA DE PLANEACION Y DESARROLLO</MenuItem>
<MenuItem value="INFORMADOR CONSULTA EXTERNA">INFORMADOR CONSULTA EXTERNA</MenuItem>
<MenuItem value="ANALISTA SISTEMAS DE INFORMACION EN SALUD">ANALISTA SISTEMAS DE INFORMACION EN SALUD</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA CUIDADOS PALIATIVOS">COORDINADOR DE ENFERMERIA CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="AUXILIAR INTEGRAL ADMINISTRATIVO DE APOYO">AUXILIAR INTEGRAL ADMINISTRATIVO DE APOYO</MenuItem>
<MenuItem value="ENFERMERO JEFE PROGRAMA SEGURIDAD DEL PACIENTE">ENFERMERO JEFE PROGRAMA SEGURIDAD DEL PACIENTE</MenuItem>
<MenuItem value="DIRECTOR DE CALIDAD">DIRECTOR DE CALIDAD</MenuItem>
<MenuItem value="PROFESIONAL DE CULTURA Y GESTION DEL CAMBIO">PROFESIONAL DE CULTURA Y GESTION DEL CAMBIO</MenuItem>
<MenuItem value="PSICOLOGO DE APOYO">PSICOLOGO DE APOYO</MenuItem>
<MenuItem value="ANALISTA GESTION HUMANA">ANALISTA GESTION HUMANA</MenuItem>
<MenuItem value="CITOHISTOTECNOLOGO DE APOYO">CITOHISTOTECNOLOGO DE APOYO</MenuItem>
<MenuItem value="ODONTOLOGO DE APOYO">ODONTOLOGO DE APOYO</MenuItem>
<MenuItem value="AUXILIAR DE ODONTOLOGIA DE APOYO">AUXILIAR DE ODONTOLOGIA DE APOYO</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO DE TRASPLANTE">COORDINADOR OPERATIVO DE TRASPLANTE</MenuItem>
<MenuItem value="AUXILIAR DE TRANSITO">AUXILIAR DE TRANSITO</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE GRUPOS RELACIONADOS DE DIAGNOSTICO">DIRECTOR NACIONAL DE GRUPOS RELACIONADOS DE DIAGNOSTICO</MenuItem>
<MenuItem value="JEFE DE EPIDEMIOLOGIA Y SALUD PUBLICA">JEFE DE EPIDEMIOLOGIA Y SALUD PUBLICA</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA NEUMOLOGO">MEDICO ESPECIALISTA NEUMOLOGO</MenuItem>
<MenuItem value="ABOGADO LABORAL I">ABOGADO LABORAL I</MenuItem>
<MenuItem value="COORDINADOR DE ESTERILIZACION">COORDINADOR DE ESTERILIZACION</MenuItem>
<MenuItem value="PROFESIONAL EN EPIDEMIOLOGIA CLINICA">PROFESIONAL EN EPIDEMIOLOGIA CLINICA</MenuItem>
<MenuItem value="GESTOR DE VIGILANCIA EN SALUD">GESTOR DE VIGILANCIA EN SALUD</MenuItem>
<MenuItem value="AUXILIAR ADMINISTRATIVO DESARROLLO HUMANO">AUXILIAR ADMINISTRATIVO DESARROLLO HUMANO</MenuItem>
<MenuItem value="DIRECTOR DE SQA">DIRECTOR DE SQA</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL LABORATORIO CLINICO">DIRECTOR COMERCIAL LABORATORIO CLINICO</MenuItem>
<MenuItem value="AUXILIAR FACTURACION DE APOYO">AUXILIAR FACTURACION DE APOYO</MenuItem>
<MenuItem value="CONSULTOR FUNCIONAL JUNIOR I">CONSULTOR FUNCIONAL JUNIOR I</MenuItem>
<MenuItem value="MEDICO PEDIATRA HOSPITALARIO DE APOYO">MEDICO PEDIATRA HOSPITALARIO DE APOYO</MenuItem>
<MenuItem value="LIDER DE GESTION DE CANALES">LIDER DE GESTION DE CANALES</MenuItem>
<MenuItem value="GERENTE CLINICA">GERENTE CLINICA</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO SALAS DE CIRUGIA">COORDINADOR OPERATIVO SALAS DE CIRUGIA</MenuItem>
<MenuItem value="ANALISTA DE INFORMACION">ANALISTA DE INFORMACION</MenuItem>
<MenuItem value="LIDER SEGURIDAD Y ELECTRONICA">LIDER SEGURIDAD Y ELECTRONICA</MenuItem>
<MenuItem value="JEFE CLINICO QUIRURGICO">JEFE CLINICO QUIRURGICO</MenuItem>
<MenuItem value="MEDICO SERVICIO SOCIAL OBLIGATORIO">MEDICO SERVICIO SOCIAL OBLIGATORIO</MenuItem>
<MenuItem value="GESTOR DE INFORMACION TECNICA">GESTOR DE INFORMACION TECNICA</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE CAPACITACION">AUXILIAR OPERATIVO DE CAPACITACION</MenuItem>
<MenuItem value="VICEPRESIDENTE DE CALIDAD Y EXPERIENCIA DEL USUARIO">VICEPRESIDENTE DE CALIDAD Y EXPERIENCIA DEL USUARIO</MenuItem>
<MenuItem value="VICEPRESIDENTE ADMINISTRATIVO Y FINANCIERO DE INFRAESTRUCTURA">VICEPRESIDENTE ADMINISTRATIVO Y FINANCIERO DE INFRAESTRUCTURA</MenuItem>
<MenuItem value="GERENTE DE CENTROS AMBULATORIOS">GERENTE DE CENTROS AMBULATORIOS</MenuItem>
<MenuItem value="PRESIDENTE EJECUTIVO LABORATORIO">PRESIDENTE EJECUTIVO LABORATORIO</MenuItem>
<MenuItem value="GERENTE FINANCIERO SENIOR INFRAESTRUCTURA CLINICA">GERENTE FINANCIERO SENIOR INFRAESTRUCTURA CLINICA</MenuItem>
<MenuItem value="GERENTE DE SISTEMAS DE INFORMACION">GERENTE DE SISTEMAS DE INFORMACION</MenuItem>
<MenuItem value="ABOGADO III">ABOGADO III</MenuItem>
<MenuItem value="COLOPROCTOLOGO">COLOPROCTOLOGO</MenuItem>
<MenuItem value="AUXILIAR DE ARCHIVO Y ESTADISTICA">AUXILIAR DE ARCHIVO Y ESTADISTICA</MenuItem>
<MenuItem value="AYUDANTE DE LAVADO DE APOYO">AYUDANTE DE LAVADO DE APOYO</MenuItem>
<MenuItem value="ODONTOLOGO REHABILITADOR">ODONTOLOGO REHABILITADOR</MenuItem>
<MenuItem value="GERENTE COMPRAS DE TECNOLOGIA, SERVICIOS Y SEGUROS">GERENTE COMPRAS DE TECNOLOGIA, SERVICIOS Y SEGUROS</MenuItem>
<MenuItem value="COORDINADOR ALTO COSTO">COORDINADOR ALTO COSTO</MenuItem>
<MenuItem value="AUXILIAR DE CARTERA">AUXILIAR DE CARTERA</MenuItem>
<MenuItem value="JEFE DE SERVICIO Y CALIDAD">JEFE DE SERVICIO Y CALIDAD</MenuItem>
<MenuItem value="JEFE DE DEPARTAMENTO DE MEDICINA INTERNA">JEFE DE DEPARTAMENTO DE MEDICINA INTERNA</MenuItem>
<MenuItem value="TECNICO EN RADIOLOGIA DE APOYO">TECNICO EN RADIOLOGIA DE APOYO</MenuItem>
<MenuItem value="JEFE DEL SERVICIO DE RADIOLOGIA">JEFE DEL SERVICIO DE RADIOLOGIA</MenuItem>
<MenuItem value="CAMILLERO DE APOYO">CAMILLERO DE APOYO</MenuItem>
<MenuItem value="GERENTE DE GESTION CLINICA">GERENTE DE GESTION CLINICA</MenuItem>
<MenuItem value="ABOGADO II">ABOGADO II</MenuItem>
<MenuItem value="ANALISTA DE DATOS I">ANALISTA DE DATOS I</MenuItem>
<MenuItem value="ANALISTA DE IMPUESTOS">ANALISTA DE IMPUESTOS</MenuItem>
<MenuItem value="DIRECTOR DE PATOLOGIA">DIRECTOR DE PATOLOGIA</MenuItem>
<MenuItem value="SUPERVISOR SERVICIOS GENERALES Y AMBIENTE FISICO">SUPERVISOR SERVICIOS GENERALES Y AMBIENTE FISICO</MenuItem>
<MenuItem value="VICEPRESIDENTE DE DESARROLLO DE NEGOCIO INFRAESTRUCTURA CLINICA">VICEPRESIDENTE DE DESARROLLO DE NEGOCIO INFRAESTRUCTURA CLINICA</MenuItem>
<MenuItem value="AUXILIAR DE IMPUESTOS">AUXILIAR DE IMPUESTOS</MenuItem>
<MenuItem value="CONSULTOR PORTAFOLIO DE PROYECTOS SENIOR">CONSULTOR PORTAFOLIO DE PROYECTOS SENIOR</MenuItem>
<MenuItem value="AUXILIAR DE CAPACITACION">AUXILIAR DE CAPACITACION</MenuItem>
<MenuItem value="ESPECIALISTA DE PARTICIPACION CIUDADANA">ESPECIALISTA DE PARTICIPACION CIUDADANA</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA SOPORTE FACTURACION">AUXILIAR DE ENFERMERIA SOPORTE FACTURACION</MenuItem>
<MenuItem value="COORDINADOR DE CARTERA">COORDINADOR DE CARTERA</MenuItem>
<MenuItem value="ANALISTA DE FACTURACION">ANALISTA DE FACTURACION</MenuItem>
<MenuItem value="COORDINADOR DE EDUCACION">COORDINADOR DE EDUCACION</MenuItem>
<MenuItem value="ANALISTA JUNIOR DEFENSORIA DEL USUARIO">ANALISTA JUNIOR DEFENSORIA DEL USUARIO</MenuItem>
<MenuItem value="COORDINADOR DE ACTIVOS FIJOS">COORDINADOR DE ACTIVOS FIJOS</MenuItem>
<MenuItem value="ANALISTA DE PROYECTOS Y CONTRATOS">ANALISTA DE PROYECTOS Y CONTRATOS</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA CLINICA DE HERIDAS Y DOLOR">COORDINADOR DE ENFERMERIA CLINICA DE HERIDAS Y DOLOR</MenuItem>
<MenuItem value="GESTOR DE INFORMACION FARMACEUTICA">GESTOR DE INFORMACION FARMACEUTICA</MenuItem>
<MenuItem value="OPERADOR DE SOPORTE">OPERADOR DE SOPORTE</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA CIRUGIA CARDIOVASCULAR">COORDINADOR DE ENFERMERIA CIRUGIA CARDIOVASCULAR</MenuItem>
<MenuItem value="COORDINADOR FARMACEUTICO DE UNIDADES AMBULATORIAS Y MEDICINA NUCLEAR">COORDINADOR FARMACEUTICO DE UNIDADES AMBULATORIAS Y MEDICINA NUCLEAR</MenuItem>
<MenuItem value="LIDER NACIONAL CENTRAL DE ESTERILIZACION">LIDER NACIONAL CENTRAL DE ESTERILIZACION</MenuItem>
<MenuItem value="ADMINISTRADOR DE REDES Y COMUNICACIONES">ADMINISTRADOR DE REDES Y COMUNICACIONES</MenuItem>
<MenuItem value="ANALISTA DE COMPENSACION">ANALISTA DE COMPENSACION</MenuItem>
<MenuItem value="LIDER DE EXPERIENCIA AL PACIENTE">LIDER DE EXPERIENCIA AL PACIENTE</MenuItem>
<MenuItem value="GERENTE DE CALIDAD">GERENTE DE CALIDAD</MenuItem>
<MenuItem value="DIRECTOR DE ARQUITECTURA">DIRECTOR DE ARQUITECTURA</MenuItem>
<MenuItem value="GERENTE LABORATORIO CLINICO">GERENTE LABORATORIO CLINICO</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO MESA DE VALIDACION I">AUXILIAR OPERATIVO MESA DE VALIDACION I</MenuItem>
<MenuItem value="GESTOR DE SERVICIOS TI I">GESTOR DE SERVICIOS TI I</MenuItem>
<MenuItem value="SUBGERENTE ASUNTOS LABORALES">SUBGERENTE ASUNTOS LABORALES</MenuItem>
<MenuItem value="AUXILIAR DE COMUNICACIONES">AUXILIAR DE COMUNICACIONES</MenuItem>
<MenuItem value="GESTOR DE AMBIENTES FISICOS Y SERVICIOS GENERALES">GESTOR DE AMBIENTES FISICOS Y SERVICIOS GENERALES</MenuItem>
<MenuItem value="ONCOPATOLOGO I">ONCOPATOLOGO I</MenuItem>
<MenuItem value="ASISTENTE DE CONTABILIDAD">ASISTENTE DE CONTABILIDAD</MenuItem>
<MenuItem value="AUXILIAR DE SERVICIOS ASISTENCIALES I DE APOYO">AUXILIAR DE SERVICIOS ASISTENCIALES I DE APOYO</MenuItem>
<MenuItem value="MEDICO INTENSIVISTA">MEDICO INTENSIVISTA</MenuItem>
<MenuItem value="GERENTE DE OPERACIONES ECONOMICAS">GERENTE DE OPERACIONES ECONOMICAS</MenuItem>
<MenuItem value="GESTOR DE AGENDAMIENTO">GESTOR DE AGENDAMIENTO</MenuItem>
<MenuItem value="GERENTE DE SERVICIO INFRAESTRUCTURA CLINICA">GERENTE DE SERVICIO INFRAESTRUCTURA CLINICA</MenuItem>
<MenuItem value="LIDER DE FORMACION Y DESARROLLO">LIDER DE FORMACION Y DESARROLLO</MenuItem>
<MenuItem value="ASISTENTE DE ESTADISTICA">ASISTENTE DE ESTADISTICA</MenuItem>
<MenuItem value="JEFE DEPARTAMENTO CIRUGIA Y ANESTESIA">JEFE DEPARTAMENTO CIRUGIA Y ANESTESIA</MenuItem>
<MenuItem value="SECRETARIA COMITE DE INFECCIONES Y MEDICINA INTERNA">SECRETARIA COMITE DE INFECCIONES Y MEDICINA INTERNA</MenuItem>
<MenuItem value="MEDICO SUBESPECIALISTA NEUROPEDIATRA DE APOYO">MEDICO SUBESPECIALISTA NEUROPEDIATRA DE APOYO</MenuItem>
<MenuItem value="ANALISTA GESTION OPERATIVA">ANALISTA GESTION OPERATIVA</MenuItem>
<MenuItem value="ADMINISTRADOR BASE DE DATOS I">ADMINISTRADOR BASE DE DATOS I</MenuItem>
<MenuItem value="DIRECTOR DE PRESTADORES">DIRECTOR DE PRESTADORES</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DESARROLLO HUMANO">AUXILIAR OPERATIVO DESARROLLO HUMANO</MenuItem>
<MenuItem value="PROFESIONAL EN SALUD PUBLICA">PROFESIONAL EN SALUD PUBLICA</MenuItem>
<MenuItem value="COORDINADOR SERVICIOS QUIRURGICOS">COORDINADOR SERVICIOS QUIRURGICOS</MenuItem>
<MenuItem value="GERENTE DE PROYECTOS DIGITALES">GERENTE DE PROYECTOS DIGITALES</MenuItem>
<MenuItem value="ANALISTA ADMINISTRACION DE SALARIOS JUNIOR DE APOYO">ANALISTA ADMINISTRACION DE SALARIOS JUNIOR DE APOYO</MenuItem>
<MenuItem value="DIRECTOR DE AUDITORIA EN SALUD">DIRECTOR DE AUDITORIA EN SALUD</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DEL PROGRAMA CONTIGO CLINICA COLSANITAS">DIRECTOR NACIONAL DEL PROGRAMA CONTIGO CLINICA COLSANITAS</MenuItem>
<MenuItem value="JEFE DE DEPARTAMENTO SALAS DE CIRUGIA">JEFE DE DEPARTAMENTO SALAS DE CIRUGIA</MenuItem>
<MenuItem value="GERENTE DE PLANEACION Y DESARROLLO">GERENTE DE PLANEACION Y DESARROLLO</MenuItem>
<MenuItem value="CONSULTOR FUNCIONAL BI">CONSULTOR FUNCIONAL BI</MenuItem>
<MenuItem value="LIDER TECNICO">LIDER TECNICO</MenuItem>
<MenuItem value="AUXILIAR SOPORTE DE FACTURACION DE CUIDADOS PALIATIVOS">AUXILIAR SOPORTE DE FACTURACION DE CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="LIDER DE COMPRAS TECNOLOGIA">LIDER DE COMPRAS TECNOLOGIA</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO OF INTERNACIONAL">DIRECTOR ADMINISTRATIVO OF INTERNACIONAL</MenuItem>
<MenuItem value="COORDINADOR SERVICIO IMAGENES DIAGNOSTICAS">COORDINADOR SERVICIO IMAGENES DIAGNOSTICAS</MenuItem>
<MenuItem value="DIRECTOR DE DOTACION Y SERVICIOS">DIRECTOR DE DOTACION Y SERVICIOS</MenuItem>
<MenuItem value="DIRECTOR DE CULTURA">DIRECTOR DE CULTURA</MenuItem>
<MenuItem value="DIRECTOR DE ADMINISTRACION PLANTA DE PERSONAL">DIRECTOR DE ADMINISTRACION PLANTA DE PERSONAL</MenuItem>
<MenuItem value="COORDINADOR DE COSTOS">COORDINADOR DE COSTOS</MenuItem>
<MenuItem value="GERENTE COMERCIAL">GERENTE COMERCIAL</MenuItem>
<MenuItem value="SUBDIRECTOR DE GESTION MEDICA">SUBDIRECTOR DE GESTION MEDICA</MenuItem>
<MenuItem value="LIDER DE SERVICIO Y RELACIONAMIENTO">LIDER DE SERVICIO Y RELACIONAMIENTO</MenuItem>
<MenuItem value="ANALISTA GESTION ADMINISTRATIVA">ANALISTA GESTION ADMINISTRATIVA</MenuItem>
<MenuItem value="BIOLOGO">BIOLOGO</MenuItem>
<MenuItem value="JEFE DE CALIDAD Y SEGURIDAD DEL PACIENTE">JEFE DE CALIDAD Y SEGURIDAD DEL PACIENTE</MenuItem>
<MenuItem value="DIRECTOR DE GESTION AMBIENTAL">DIRECTOR DE GESTION AMBIENTAL</MenuItem>
<MenuItem value="ARQUITECTO DE INFRAESTRUCTURA">ARQUITECTO DE INFRAESTRUCTURA</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA DE OFICINA INTERNACIONAL">COORDINADOR DE ENFERMERIA DE OFICINA INTERNACIONAL</MenuItem>
<MenuItem value="ANALISTA SENIOR DE INFORMACION">ANALISTA SENIOR DE INFORMACION</MenuItem>
<MenuItem value="COORDINADOR DE RADIOLOGIA">COORDINADOR DE RADIOLOGIA</MenuItem>
<MenuItem value="CONSULTOR DE GESTION COMERCIAL">CONSULTOR DE GESTION COMERCIAL</MenuItem>
<MenuItem value="ANALISTA ARQUITECTURA DE COMPENSACION">ANALISTA ARQUITECTURA DE COMPENSACION</MenuItem>
<MenuItem value="JEFE DE CONTABILIDAD">JEFE DE CONTABILIDAD</MenuItem>
<MenuItem value="COORDINADOR MEDICO GRD">COORDINADOR MEDICO GRD</MenuItem>
<MenuItem value="LIDER DE GESTION BIOMEDICA">LIDER DE GESTION BIOMEDICA</MenuItem>
<MenuItem value="SUBGERENTE ADMINISTRATIVO CUC">SUBGERENTE ADMINISTRATIVO CUC</MenuItem>
<MenuItem value="COORDINADOR DE URGENCIAS CRS">COORDINADOR DE URGENCIAS CRS</MenuItem>
<MenuItem value="DIRECTOR DE CPAT">DIRECTOR DE CPAT</MenuItem>
<MenuItem value="SUBGERENTE GESTION DE INFORMACION">SUBGERENTE GESTION DE INFORMACION</MenuItem>
<MenuItem value="ANALISTA FUNCIONAL DE USABILIDAD">ANALISTA FUNCIONAL DE USABILIDAD</MenuItem>
<MenuItem value="DIRECTOR CIENTIFICO CLI.COLSANITAS">DIRECTOR CIENTIFICO CLI.COLSANITAS</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO DE IMAGENES DIAGNOSTICAS">COORDINADOR OPERATIVO DE IMAGENES DIAGNOSTICAS</MenuItem>
<MenuItem value="PROFESIONAL EN CONTABILIDAD">PROFESIONAL EN CONTABILIDAD</MenuItem>
<MenuItem value="DIRECTOR DE GESTION DE INFRAESTRUCTURA">DIRECTOR DE GESTION DE INFRAESTRUCTURA</MenuItem>
<MenuItem value="ANALISTA DE SOPORTE SENIOR II">ANALISTA DE SOPORTE SENIOR II</MenuItem>
<MenuItem value="ESPECIALISTA DE COMUNICACIONES INTERNAS">ESPECIALISTA DE COMUNICACIONES INTERNAS</MenuItem>
<MenuItem value="ANALISTA FORMACION VIRTUAL">ANALISTA FORMACION VIRTUAL</MenuItem>
<MenuItem value="LIDER DE LABORATORIO DE METROLOGIA">LIDER DE LABORATORIO DE METROLOGIA</MenuItem>
<MenuItem value="JEFE NACIONAL DEL SERVICIO DE URGENCIAS">JEFE NACIONAL DEL SERVICIO DE URGENCIAS</MenuItem>
<MenuItem value="SUBGERENTE DE COSTOS Y PROYECTOS">SUBGERENTE DE COSTOS Y PROYECTOS</MenuItem>
<MenuItem value="JEFE SERVICIO DE HEMATOLOGIA Y TRASPLANTE">JEFE SERVICIO DE HEMATOLOGIA Y TRASPLANTE</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA DE UNIDADES DIAGNOSTICAS AMBULATORIAS">COORDINADOR DE ENFERMERIA DE UNIDADES DIAGNOSTICAS AMBULATORIAS</MenuItem>
<MenuItem value="RECREADOR">RECREADOR</MenuItem>
<MenuItem value="GERENTE DE MODELOS DE ATENCION">GERENTE DE MODELOS DE ATENCION</MenuItem>
<MenuItem value="DIRECTOR DE COMPRAS DE INSUMOS MEDICOS Y LABORATORIO CLINICO">DIRECTOR DE COMPRAS DE INSUMOS MEDICOS Y LABORATORIO CLINICO</MenuItem>
<MenuItem value="ANALISTA DE BIENESTAR DE USUARIOS">ANALISTA DE BIENESTAR DE USUARIOS</MenuItem>
<MenuItem value="AMA DE LLAVES">AMA DE LLAVES</MenuItem>
<MenuItem value="ARQUITECTO DE DATOS">ARQUITECTO DE DATOS</MenuItem>
<MenuItem value="JEFE SUPERVISORA">JEFE SUPERVISORA</MenuItem>
<MenuItem value="ANALISTA SEGUIMIENTO PROCESOS ADMINISTRATIVOS">ANALISTA SEGUIMIENTO PROCESOS ADMINISTRATIVOS</MenuItem>
<MenuItem value="AUXILIAR SOPORTE ADMISIONES Y FACTURACION">AUXILIAR SOPORTE ADMISIONES Y FACTURACION</MenuItem>
<MenuItem value="LIDER DE ARQUITECTURA">LIDER DE ARQUITECTURA</MenuItem>
<MenuItem value="DESARROLLADOR DE BI">DESARROLLADOR DE BI</MenuItem>
<MenuItem value="GESTOR DE SERVICIOS TI II">GESTOR DE SERVICIOS TI II</MenuItem>
<MenuItem value="CONSULTOR DE CIBERSEGURIDAD">CONSULTOR DE CIBERSEGURIDAD</MenuItem>
<MenuItem value="ODONTOLOGO CIRUJANO">ODONTOLOGO CIRUJANO</MenuItem>
<MenuItem value="ANALISTA DE PRESUPUESTO">ANALISTA DE PRESUPUESTO</MenuItem>
<MenuItem value="GESTOR OPERATIVO DE RECAUDO I">GESTOR OPERATIVO DE RECAUDO I</MenuItem>
<MenuItem value="DIRECTOR DE PROYECTOS I">DIRECTOR DE PROYECTOS I</MenuItem>
<MenuItem value="ANALISTA DE CONVENIOS Y TARIFAS">ANALISTA DE CONVENIOS Y TARIFAS</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA EN PROGRAMA PYP">COORDINADOR DE ENFERMERIA EN PROGRAMA PYP</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA NEONATOLOGO">MEDICO ESPECIALISTA NEONATOLOGO</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO OFICINA INTERNACIONAL">AUXILIAR OPERATIVO OFICINA INTERNACIONAL</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO DE PROGRAMAS ESPECIALES">COORDINADOR OPERATIVO DE PROGRAMAS ESPECIALES</MenuItem>
<MenuItem value="LIDER DEL MODELO DEL SERVICIO">LIDER DEL MODELO DEL SERVICIO</MenuItem>
<MenuItem value="COORDINADOR ADMINISTRATIVO PROGRAMAS ESPECIALES">COORDINADOR ADMINISTRATIVO PROGRAMAS ESPECIALES</MenuItem>
<MenuItem value="ANALISTA SQA SENIOR">ANALISTA SQA SENIOR</MenuItem>
<MenuItem value="DIRECTOR DE CARTERA">DIRECTOR DE CARTERA</MenuItem>
<MenuItem value="ADMINISTRADOR DE NUBE PUBLICA AZURE">ADMINISTRADOR DE NUBE PUBLICA AZURE</MenuItem>
<MenuItem value="DIRECTOR DE NEFROLOGIA">DIRECTOR DE NEFROLOGIA</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO DE SALAS DE CIRUGIA">DIRECTOR OPERATIVO DE SALAS DE CIRUGIA</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO DEL SERVICIO DE GASTRO">COORDINADOR OPERATIVO DEL SERVICIO DE GASTRO</MenuItem>
<MenuItem value="ASISTENTE DE TESORERIA">ASISTENTE DE TESORERIA</MenuItem>
<MenuItem value="COORDINADOR DE URGENCIAS CUC">COORDINADOR DE URGENCIAS CUC</MenuItem>
<MenuItem value="COORDINADOR DE VIGILANCIA TECNOLOGICA">COORDINADOR DE VIGILANCIA TECNOLOGICA</MenuItem>
<MenuItem value="DIRECTOR GESTION TRIBUTARIA DE NOMINA Y REQUERIMIENTOS">DIRECTOR GESTION TRIBUTARIA DE NOMINA Y REQUERIMIENTOS</MenuItem>
<MenuItem value="ANALISTA DE INFORMACION ADMINISTRACION DE SALARIOS">ANALISTA DE INFORMACION ADMINISTRACION DE SALARIOS</MenuItem>
<MenuItem value="COORDINADOR DE ESTUDIOS DE INVESTIGACION EN DOLOR Y CUIDADOS PALIATIVOS">COORDINADOR DE ESTUDIOS DE INVESTIGACION EN DOLOR Y CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="DIRECTOR DE CLINICAS MEDICAS">DIRECTOR DE CLINICAS MEDICAS</MenuItem>
<MenuItem value="ENFERMERA DE SALUD PUBLICA">ENFERMERA DE SALUD PUBLICA</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO Y DE COSTOS SALAS DE CIRUGIA">COORDINADOR OPERATIVO Y DE COSTOS SALAS DE CIRUGIA</MenuItem>
<MenuItem value="JEFE DE DEPARTAMENTO DE UROLOGIA">JEFE DE DEPARTAMENTO DE UROLOGIA</MenuItem>
<MenuItem value="COORDINADOR MEDICO PROGRAMAS ESPECIALES">COORDINADOR MEDICO PROGRAMAS ESPECIALES</MenuItem>
<MenuItem value="ANALISTA DE PROYECTOS">ANALISTA DE PROYECTOS</MenuItem>
<MenuItem value="MEDICO GENERAL DE CUIDADOS PALIATIVOS DE APOYO">MEDICO GENERAL DE CUIDADOS PALIATIVOS DE APOYO</MenuItem>
<MenuItem value="SECRETARIA DEPARTAMENTO II">SECRETARIA DEPARTAMENTO II</MenuItem>
<MenuItem value="GERENTE FINANCIERO INFRAESTRUCTURA">GERENTE FINANCIERO INFRAESTRUCTURA</MenuItem>
<MenuItem value="GERENTE DE SERVICIOS Y AMBIENTE FISICO">GERENTE DE SERVICIOS Y AMBIENTE FISICO</MenuItem>
<MenuItem value="JEFE DEL SERVICIO DE PEDIATRIA">JEFE DEL SERVICIO DE PEDIATRIA</MenuItem>
<MenuItem value="ANALISTA DE SOPORTE JUNIOR">ANALISTA DE SOPORTE JUNIOR</MenuItem>
<MenuItem value="LIDER DE GESTION DE LA INFORMACION">LIDER DE GESTION DE LA INFORMACION</MenuItem>
<MenuItem value="DIRECTOR DE GASES MEDICINALES Y SERVICIO FARMACEUTICO">DIRECTOR DE GASES MEDICINALES Y SERVICIO FARMACEUTICO</MenuItem>
<MenuItem value="ANALISTA DE APLICACIONES SENIOR">ANALISTA DE APLICACIONES SENIOR</MenuItem>
<MenuItem value="INFORMADOR LABORATORIO DE APOYO">INFORMADOR LABORATORIO DE APOYO</MenuItem>
<MenuItem value="GERENTE NACIONAL DE ENFERMERIA Y PARAMEDICAS">GERENTE NACIONAL DE ENFERMERIA Y PARAMEDICAS</MenuItem>
<MenuItem value="DIRECTOR COMPRAS INFRAESTRUCTURA Y MOBILIARIO">DIRECTOR COMPRAS INFRAESTRUCTURA Y MOBILIARIO</MenuItem>
<MenuItem value="GERENTE CORPORATIVO DE SOLUCIONES TRANSVERSALES">GERENTE CORPORATIVO DE SOLUCIONES TRANSVERSALES</MenuItem>
<MenuItem value="ASISTENTE DE CARTERA">ASISTENTE DE CARTERA</MenuItem>
<MenuItem value="COORDINADOR DE ADMISIONES">COORDINADOR DE ADMISIONES</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE FACTURACION">DIRECTOR NACIONAL DE FACTURACION</MenuItem>
<MenuItem value="COORDINADOR DE SERVICIOS AMBULATORIOS">COORDINADOR DE SERVICIOS AMBULATORIOS</MenuItem>
<MenuItem value="DIRECTOR DE GESTION DE CONTRATOS">DIRECTOR DE GESTION DE CONTRATOS</MenuItem>
<MenuItem value="LIDER DE MEJORAMIENTO">LIDER DE MEJORAMIENTO</MenuItem>
<MenuItem value="DIRECTOR DE INVENTARIOS">DIRECTOR DE INVENTARIOS</MenuItem>
<MenuItem value="DIRECTOR ASEGURAMIENTO DE CALIDAD">DIRECTOR ASEGURAMIENTO DE CALIDAD</MenuItem>
<MenuItem value="GERENTE DE OPERACIONES">GERENTE DE OPERACIONES</MenuItem>
<MenuItem value="DIRECTOR TECNICO CENTRAL DE APROVECHAMIENTO">DIRECTOR TECNICO CENTRAL DE APROVECHAMIENTO</MenuItem>
<MenuItem value="COORDINADOR DEPARTAMENTO NEONATOS">COORDINADOR DEPARTAMENTO NEONATOS</MenuItem>
<MenuItem value="DIRECTOR REDES Y COMUNICACIONES">DIRECTOR REDES Y COMUNICACIONES</MenuItem>
<MenuItem value="LIDER DE COMPRAS SERVICIOS Y SEGUROS">LIDER DE COMPRAS SERVICIOS Y SEGUROS</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA FISIATRA DE CUIDADOS PALIATIVOS">MEDICO ESPECIALISTA FISIATRA DE CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="DIRECTOR INTELIGENCIA DE NEGOCIOS">DIRECTOR INTELIGENCIA DE NEGOCIOS</MenuItem>
<MenuItem value="AUXILIAR ADMINISTRATIVO DE SEGURIDAD">AUXILIAR ADMINISTRATIVO DE SEGURIDAD</MenuItem>
<MenuItem value="ASESOR DE SERVICIO Y COMERCIAL">ASESOR DE SERVICIO Y COMERCIAL</MenuItem>
<MenuItem value="COORDINADOR DE ODONTOLOGIA">COORDINADOR DE ODONTOLOGIA</MenuItem>
<MenuItem value="SUBGERENTE COMERCIAL">SUBGERENTE COMERCIAL</MenuItem>
<MenuItem value="DIRECTOR DE ODONTOSANITAS">DIRECTOR DE ODONTOSANITAS</MenuItem>
<MenuItem value="PERIODONCISTA">PERIODONCISTA</MenuItem>
<MenuItem value="ODONTOLOGO LIDER">ODONTOLOGO LIDER</MenuItem>
<MenuItem value="GESTOR ADMINISTRATIVO ODONTOSANITAS">GESTOR ADMINISTRATIVO ODONTOSANITAS</MenuItem>
<MenuItem value="TECNICO DE MANTENIMIENTO ESPECIALISTA III">TECNICO DE MANTENIMIENTO ESPECIALISTA III</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE ODONTOLOGIA">AUXILIAR OPERATIVO DE ODONTOLOGIA</MenuItem>
<MenuItem value="COORDINADOR COMERCIAL">COORDINADOR COMERCIAL</MenuItem>
<MenuItem value="SUBGERENTE DE OPERACIONES">SUBGERENTE DE OPERACIONES</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL CLINICA DENTAL">DIRECTOR COMERCIAL CLINICA DENTAL</MenuItem>
<MenuItem value="AUXILIAR INTEGRAL DE ADMISIONES II">AUXILIAR INTEGRAL DE ADMISIONES II</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO Y FINANCIERO">DIRECTOR ADMINISTRATIVO Y FINANCIERO</MenuItem>
<MenuItem value="COORDINADOR DE PROYECTOS II">COORDINADOR DE PROYECTOS II</MenuItem>
<MenuItem value="AUXILIAR LABORATORIO DENTAL">AUXILIAR LABORATORIO DENTAL</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO ODONTOLOGIA">AUXILIAR OPERATIVO ODONTOLOGIA</MenuItem>
<MenuItem value="GESTOR DE PROCESOS">GESTOR DE PROCESOS</MenuItem>
<MenuItem value="TECNICO DENTAL">TECNICO DENTAL</MenuItem>
<MenuItem value="INGENIERO BIOMEDICO ESPECIALISTA II">INGENIERO BIOMEDICO ESPECIALISTA II</MenuItem>
<MenuItem value="GERENTE CLINICA DENTAL">GERENTE CLINICA DENTAL</MenuItem>
<MenuItem value="ODONTOLOGO FACIAL">ODONTOLOGO FACIAL</MenuItem>
<MenuItem value="GERENTE GLOBAL DE ODONTOLOGIA">GERENTE GLOBAL DE ODONTOLOGIA</MenuItem>
<MenuItem value="INFORMADOR DE USUARIOS I">INFORMADOR DE USUARIOS I</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE SERVICIOS MEDICOS I">ASESOR INTEGRAL DE SERVICIOS MEDICOS I</MenuItem>
<MenuItem value="PRACTICANTE DE INNOVACION">PRACTICANTE DE INNOVACION</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE SERVICIOS MEDICOS">ASESOR INTEGRAL DE SERVICIOS MEDICOS</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE CUENTAS MEDICAS">AUXILIAR OPERATIVO DE CUENTAS MEDICAS</MenuItem>
<MenuItem value="ASESOR COMERCIAL JUNIOR I">ASESOR COMERCIAL JUNIOR I</MenuItem>
<MenuItem value="ASESOR EN FORMACION">ASESOR EN FORMACION</MenuItem>
<MenuItem value="GERENTE PLAN MEDICO DOMICILIARIO PLUS">GERENTE PLAN MEDICO DOMICILIARIO PLUS</MenuItem>
<MenuItem value="ASESOR DE USUARIOS SENIOR">ASESOR DE USUARIOS SENIOR</MenuItem>
<MenuItem value="ASESOR DE SERVICIO CANALES">ASESOR DE SERVICIO CANALES</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO DE CANAL PRESENCIAL MP I">DIRECTOR OPERATIVO DE CANAL PRESENCIAL MP I</MenuItem>
<MenuItem value="AUXILIAR DE AFILIACIONES">AUXILIAR DE AFILIACIONES</MenuItem>
<MenuItem value="EJECUTIVO COMERCIAL MANTENIMIENTO">EJECUTIVO COMERCIAL MANTENIMIENTO</MenuItem>
<MenuItem value="ASESOR MEDICO">ASESOR MEDICO</MenuItem>
<MenuItem value="ASESOR DE USUARIOS EN ENTRENAMIENTO">ASESOR DE USUARIOS EN ENTRENAMIENTO</MenuItem>
<MenuItem value="ANALISTA JUNIOR DE CARTERA Y COBRANZAS">ANALISTA JUNIOR DE CARTERA Y COBRANZAS</MenuItem>
<MenuItem value="MEDICO BILINGUE EMPRESA">MEDICO BILINGUE EMPRESA</MenuItem>
<MenuItem value="ASESOR DE USUARIOS JUNIOR">ASESOR DE USUARIOS JUNIOR</MenuItem>
<MenuItem value="ADMINISTRADOR CENTRO DE COMPUTO">ADMINISTRADOR CENTRO DE COMPUTO</MenuItem>
<MenuItem value="EJECUTIVO DE CUENTAS CORPORATIVAS JUNIOR">EJECUTIVO DE CUENTAS CORPORATIVAS JUNIOR</MenuItem>
<MenuItem value="ASISTENTE CONTROL OPERATIVO">ASISTENTE CONTROL OPERATIVO</MenuItem>
<MenuItem value="ASESOR DE GESTION INTEGRAL SENIOR">ASESOR DE GESTION INTEGRAL SENIOR</MenuItem>
<MenuItem value="AUXILIAR CUENTAS MEDICAS">AUXILIAR CUENTAS MEDICAS</MenuItem>
<MenuItem value="ASESOR COMERCIAL MULTIPRODUCTO">ASESOR COMERCIAL MULTIPRODUCTO</MenuItem>
<MenuItem value="ASESOR DE GESTION INTEGRAL">ASESOR DE GESTION INTEGRAL</MenuItem>
<MenuItem value="GERENTE DE GESTION Y PROYECTOS">GERENTE DE GESTION Y PROYECTOS</MenuItem>
<MenuItem value="ANALISTA DATA MASTER I">ANALISTA DATA MASTER I</MenuItem>
<MenuItem value="DIRECTOR DE INVESTIGACION DE MERCADOS">DIRECTOR DE INVESTIGACION DE MERCADOS</MenuItem>
<MenuItem value="ENFERMERA SERVICIOS MEDICOS">ENFERMERA SERVICIOS MEDICOS</MenuItem>
<MenuItem value="ARQUITECTO INTELIGENCIA DE NEGOCIOS">ARQUITECTO INTELIGENCIA DE NEGOCIOS</MenuItem>
<MenuItem value="AUXILIAR DE INFORMACION COMERCIAL">AUXILIAR DE INFORMACION COMERCIAL</MenuItem>
<MenuItem value="EJECUTIVO COMERCIAL MANTENIMIENTO JUNIOR">EJECUTIVO COMERCIAL MANTENIMIENTO JUNIOR</MenuItem>
<MenuItem value="AUXILIAR DE CARTERA Y COBRANZAS">AUXILIAR DE CARTERA Y COBRANZAS</MenuItem>
<MenuItem value="GESTOR DE CANAL VIRTUAL">GESTOR DE CANAL VIRTUAL</MenuItem>
<MenuItem value="CONSULTOR FUNCIONAL JUNIOR">CONSULTOR FUNCIONAL JUNIOR</MenuItem>
<MenuItem value="PROFESIONAL DISE O DE INNOVACION">PROFESIONAL DISE O DE INNOVACION</MenuItem>
<MenuItem value="ASESOR MESA DE AYUDA A PRESTADORES">ASESOR MESA DE AYUDA A PRESTADORES</MenuItem>
<MenuItem value="EJECUTIVO COMERCIAL DE REFERIDOS">EJECUTIVO COMERCIAL DE REFERIDOS</MenuItem>
<MenuItem value="ASESOR MANTENIMIENTO USUARIOS">ASESOR MANTENIMIENTO USUARIOS</MenuItem>
<MenuItem value="ASESOR DE GESTION INTEGRAL MASTER">ASESOR DE GESTION INTEGRAL MASTER</MenuItem>
<MenuItem value="EJECUTIVO COMERCIAL COLSANITAS DENTAL">EJECUTIVO COMERCIAL COLSANITAS DENTAL</MenuItem>
<MenuItem value="ASESOR COMERCIAL JUNIOR II">ASESOR COMERCIAL JUNIOR II</MenuItem>
<MenuItem value="COORDINADOR CUENTAS MEDICAS">COORDINADOR CUENTAS MEDICAS</MenuItem>
<MenuItem value="AUDITOR EN SALUD">AUDITOR EN SALUD</MenuItem>
<MenuItem value="ANALISTA DE MARKETING">ANALISTA DE MARKETING</MenuItem>
<MenuItem value="CONSULTOR DE PROYECTOS">CONSULTOR DE PROYECTOS</MenuItem>
<MenuItem value="DIRECTOR DE AFILIACIONES MP">DIRECTOR DE AFILIACIONES MP</MenuItem>
<MenuItem value="ANALISTA JUNIOR INVESTIGACION DE MERCADOS">ANALISTA JUNIOR INVESTIGACION DE MERCADOS</MenuItem>
<MenuItem value="ASESOR MEDICO PLANES ESPECIALES">ASESOR MEDICO PLANES ESPECIALES</MenuItem>
<MenuItem value="ANALISTA SISTEMAS DE INFORMACION">ANALISTA SISTEMAS DE INFORMACION</MenuItem>
<MenuItem value="GESTOR DE CONCILIACIONES">GESTOR DE CONCILIACIONES</MenuItem>
<MenuItem value="GESTOR COMERCIAL">GESTOR COMERCIAL</MenuItem>
<MenuItem value="DIRECTOR OFICINA">DIRECTOR OFICINA</MenuItem>
<MenuItem value="GERENTE BUSINESS PARTNER DE ASEGURAMIENTO PREMIUM">GERENTE BUSINESS PARTNER DE ASEGURAMIENTO PREMIUM</MenuItem>
<MenuItem value="ANALISTA JUNIOR EN SISTEMA DE INFORMACION">ANALISTA JUNIOR EN SISTEMA DE INFORMACION</MenuItem>
<MenuItem value="SUBGERENTE DE GESTION INTERNACIONAL">SUBGERENTE DE GESTION INTERNACIONAL</MenuItem>
<MenuItem value="PROTECCION">PROTECCION</MenuItem>
<MenuItem value="SUPERVISOR DE SERVICIOS MEDICOS">SUPERVISOR DE SERVICIOS MEDICOS</MenuItem>
<MenuItem value="ANALISTA EN SALUD DE CONVENIOS Y TARIFAS">ANALISTA EN SALUD DE CONVENIOS Y TARIFAS</MenuItem>
<MenuItem value="AUXILIAR DE ASEO Y CAFETERIA">AUXILIAR DE ASEO Y CAFETERIA</MenuItem>
<MenuItem value="AUXILIAR SERVICIOS VARIOS">AUXILIAR SERVICIOS VARIOS</MenuItem>
<MenuItem value="JEFE DE OFICINA">JEFE DE OFICINA</MenuItem>
<MenuItem value="GERENTE CORPORATIVO DE DESARROLLO">GERENTE CORPORATIVO DE DESARROLLO</MenuItem>
<MenuItem value="SECRETARIA SUBGERENCIA">SECRETARIA SUBGERENCIA</MenuItem>
<MenuItem value="DIRECTOR DE FORMACION">DIRECTOR DE FORMACION</MenuItem>
<MenuItem value="EJECUTIVO DE CUENTAS CORPORATIVAS SENIOR">EJECUTIVO DE CUENTAS CORPORATIVAS SENIOR</MenuItem>
<MenuItem value="ADMINISTRADOR TELEFONIA">ADMINISTRADOR TELEFONIA</MenuItem>
<MenuItem value="SUPERVISOR DE SEGURIDAD">SUPERVISOR DE SEGURIDAD</MenuItem>
<MenuItem value="ANALISTA DE RESERVAS">ANALISTA DE RESERVAS</MenuItem>
<MenuItem value="AUXILIAR DE FARMACIA">AUXILIAR DE FARMACIA</MenuItem>
<MenuItem value="COORDINADOR INTEGRAL">COORDINADOR INTEGRAL</MenuItem>
<MenuItem value="ASESOR INTEGRAL CORPORATIVO">ASESOR INTEGRAL CORPORATIVO</MenuItem>
<MenuItem value="GESTOR DE SALUD MENTAL COLSANITAS">GESTOR DE SALUD MENTAL COLSANITAS</MenuItem>
<MenuItem value="DIRECTOR DE PROYECTOS DE SERVICIO">DIRECTOR DE PROYECTOS DE SERVICIO</MenuItem>
<MenuItem value="GESTOR OPERATIVO JUNIOR">GESTOR OPERATIVO JUNIOR</MenuItem>
<MenuItem value="DIRECTOR DE PROYECTOS COMERCIALES">DIRECTOR DE PROYECTOS COMERCIALES</MenuItem>
<MenuItem value="SECRETARIA RECEPCIONISTA">SECRETARIA RECEPCIONISTA</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA EMPRESA">AUXILIAR DE ENFERMERIA EMPRESA</MenuItem>
<MenuItem value="COORDINADOR DE RELACIONES PUBLICAS Y EVENTOS">COORDINADOR DE RELACIONES PUBLICAS Y EVENTOS</MenuItem>
<MenuItem value="GERENTE DE AUDITORIA Y CONTRALORIA">GERENTE DE AUDITORIA Y CONTRALORIA</MenuItem>
<MenuItem value="CONTRALOR MEDICO REGIONAL BOGOTA">CONTRALOR MEDICO REGIONAL BOGOTA</MenuItem>
<MenuItem value="PROFESIONAL GESTION MEDICA">PROFESIONAL GESTION MEDICA</MenuItem>
<MenuItem value="ASESOR SERVICIOS MEDICOS JUNIOR">ASESOR SERVICIOS MEDICOS JUNIOR</MenuItem>
<MenuItem value="COORDINADOR CENTRO DE EVALUACION EN MEDICAMENTOS Y TECNOLOGIA EN SALUD">COORDINADOR CENTRO DE EVALUACION EN MEDICAMENTOS Y TECNOLOGIA EN SALUD</MenuItem>
<MenuItem value="DIRECTOR DE GESTION DE PORTAFOLIO">DIRECTOR DE GESTION DE PORTAFOLIO</MenuItem>
<MenuItem value="LIDER DE PROYECTOS">LIDER DE PROYECTOS</MenuItem>
<MenuItem value="SUPERNUMERARIO">SUPERNUMERARIO</MenuItem>
<MenuItem value="ANALISTA ADMINISTRATIVO TECNOLOGIA">ANALISTA ADMINISTRATIVO TECNOLOGIA</MenuItem>
<MenuItem value="GERENTE GESTION DEL CONOCIMIENTO EN SALUD">GERENTE GESTION DEL CONOCIMIENTO EN SALUD</MenuItem>
<MenuItem value="GERENTE MEDICO DE ASEGURAMIENTO">GERENTE MEDICO DE ASEGURAMIENTO</MenuItem>
<MenuItem value="DIRECTOR DE SEGURIDAD DE LA INFORMACION">DIRECTOR DE SEGURIDAD DE LA INFORMACION</MenuItem>
<MenuItem value="ESPECIALISTA DE ANALITICA Y PROYECTOS COMERCIALES">ESPECIALISTA DE ANALITICA Y PROYECTOS COMERCIALES</MenuItem>
<MenuItem value="REALIZADOR AUDIOVISUAL">REALIZADOR AUDIOVISUAL</MenuItem>
<MenuItem value="COORDINADOR RED REGIONAL">COORDINADOR RED REGIONAL</MenuItem>
<MenuItem value="ANALISTA DE COMPENSACION PRESTADORES JUNIOR">ANALISTA DE COMPENSACION PRESTADORES JUNIOR</MenuItem>
<MenuItem value="GESTOR SISTEMA DE INFORMACION">GESTOR SISTEMA DE INFORMACION</MenuItem>
<MenuItem value="GERENTE CENTRAL MERCADEO">GERENTE CENTRAL MERCADEO</MenuItem>
<MenuItem value="GERENTE DE ANALITICA">GERENTE DE ANALITICA</MenuItem>
<MenuItem value="GERENTE DE ODONTOLOGIA">GERENTE DE ODONTOLOGIA</MenuItem>
<MenuItem value="ESPECIALISTA EN FORMACION">ESPECIALISTA EN FORMACION</MenuItem>
<MenuItem value="SUBGERENTE ADMINISTRATIVA EQUIPO DE TENIS">SUBGERENTE ADMINISTRATIVA EQUIPO DE TENIS</MenuItem>
<MenuItem value="ENTRENADOR DE TENIS EQUIPO COLSANITAS">ENTRENADOR DE TENIS EQUIPO COLSANITAS</MenuItem>
<MenuItem value="ASESOR MASTER">ASESOR MASTER</MenuItem>
<MenuItem value="DIRECTOR CENTRAL DE SERVICIOS DOMICILIARIOS">DIRECTOR CENTRAL DE SERVICIOS DOMICILIARIOS</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL ZONA">DIRECTOR COMERCIAL ZONA</MenuItem>
<MenuItem value="ANALISTA DE AFILIACIONES">ANALISTA DE AFILIACIONES</MenuItem>
<MenuItem value="GESTOR DE SEGUIMIENTO COMERCIAL">GESTOR DE SEGUIMIENTO COMERCIAL</MenuItem>
<MenuItem value="LIDER DE CONVENIOS Y TARIFAS">LIDER DE CONVENIOS Y TARIFAS</MenuItem>
<MenuItem value="ANALISTA DE INFORMACION Y GESTION JUNIOR">ANALISTA DE INFORMACION Y GESTION JUNIOR</MenuItem>
<MenuItem value="EJECUTIVO COMERCIAL DE MANTENIMIENTO SENIOR">EJECUTIVO COMERCIAL DE MANTENIMIENTO SENIOR</MenuItem>
<MenuItem value="PRESIDENTE REGION SUR">PRESIDENTE REGION SUR</MenuItem>
<MenuItem value="DIRECTOR CORPORATIVO ADMINISTRATIVO DE TECNOLOGIA">DIRECTOR CORPORATIVO ADMINISTRATIVO DE TECNOLOGIA</MenuItem>
<MenuItem value="ANALISTA FINANCIERO COLOMBIA">ANALISTA FINANCIERO COLOMBIA</MenuItem>
<MenuItem value="ANALISTA ADMINISTRATIVO I">ANALISTA ADMINISTRATIVO I</MenuItem>
<MenuItem value="SUBGERENTE DE INVESTIGACION DE MERCADOS">SUBGERENTE DE INVESTIGACION DE MERCADOS</MenuItem>
<MenuItem value="COORDINADOR DE IMPUESTOS">COORDINADOR DE IMPUESTOS</MenuItem>
<MenuItem value="VICEPRESIDENTE EJECUTIVO EMPRESAS COMERCIALES">VICEPRESIDENTE EJECUTIVO EMPRESAS COMERCIALES</MenuItem>
<MenuItem value="ANALISTA TECNICO SENIOR">ANALISTA TECNICO SENIOR</MenuItem>
<MenuItem value="LIDER REGIONAL DE SERVICIO">LIDER REGIONAL DE SERVICIO</MenuItem>
<MenuItem value="ANALISTA DE OPERACIONES TI">ANALISTA DE OPERACIONES TI</MenuItem>
<MenuItem value="DIRECTOR DE POSICIONAMIENTO">DIRECTOR DE POSICIONAMIENTO</MenuItem>
<MenuItem value="MEDICO EMPRESARIAL">MEDICO EMPRESARIAL</MenuItem>
<MenuItem value="DIRECTOR DE DESARROLLO CORPORATIVO">DIRECTOR DE DESARROLLO CORPORATIVO</MenuItem>
<MenuItem value="LIDER DE CONTRATACION">LIDER DE CONTRATACION</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL">DIRECTOR COMERCIAL</MenuItem>
<MenuItem value="DIRECTOR DE PROGRAMA MEDICO EMPRESARIAL">DIRECTOR DE PROGRAMA MEDICO EMPRESARIAL</MenuItem>
<MenuItem value="SUBGERENTE MEDICO REGIONAL">SUBGERENTE MEDICO REGIONAL</MenuItem>
<MenuItem value="SUBGERENTE OPERATIVO DE PRESTACIONES MP">SUBGERENTE OPERATIVO DE PRESTACIONES MP</MenuItem>
<MenuItem value="LIDER TECNICO II">LIDER TECNICO II</MenuItem>
<MenuItem value="SUBGERENTE DE PROYECTOS">SUBGERENTE DE PROYECTOS</MenuItem>
<MenuItem value="GERENTE DE PLANEACION Y CONTROL FINANCIERO MP">GERENTE DE PLANEACION Y CONTROL FINANCIERO MP</MenuItem>
<MenuItem value="DIRECTOR DE AGENCIAS">DIRECTOR DE AGENCIAS</MenuItem>
<MenuItem value="COORDINADOR DE PROTECCION">COORDINADOR DE PROTECCION</MenuItem>
<MenuItem value="COORDINADOR COMERCIAL DE VENTA DIRECTA">COORDINADOR COMERCIAL DE VENTA DIRECTA</MenuItem>
<MenuItem value="ANALISTA DE DATOS Y MEJORAMIENTO">ANALISTA DE DATOS Y MEJORAMIENTO</MenuItem>
<MenuItem value="ESPECIALISTA EN ESTUDIOS FINANCIEROS Y ECONOMICOS">ESPECIALISTA EN ESTUDIOS FINANCIEROS Y ECONOMICOS</MenuItem>
<MenuItem value="ANALISTA DE SUSCRIPCION DE HERRAMIENTAS">ANALISTA DE SUSCRIPCION DE HERRAMIENTAS</MenuItem>
<MenuItem value="GESTOR DE PRESTADORES">GESTOR DE PRESTADORES</MenuItem>
<MenuItem value="ASESOR MEDICO I">ASESOR MEDICO I</MenuItem>
<MenuItem value="EJECUTIVO DE CUENTAS CORPORATIVAS">EJECUTIVO DE CUENTAS CORPORATIVAS</MenuItem>
<MenuItem value="SUBGERENTE DE MEDICINA PREVENTIVA">SUBGERENTE DE MEDICINA PREVENTIVA</MenuItem>
<MenuItem value="DIRECTOR BASE DE DATOS">DIRECTOR BASE DE DATOS</MenuItem>
<MenuItem value="CONSULTOR PORTAFOLIO DE PROYECTOS JUNIOR">CONSULTOR PORTAFOLIO DE PROYECTOS JUNIOR</MenuItem>
<MenuItem value="DIRECTOR REGIONAL DE ODONTOLOGIA">DIRECTOR REGIONAL DE ODONTOLOGIA</MenuItem>
<MenuItem value="SUBGERENTE OPERACION DE CANALES">SUBGERENTE OPERACION DE CANALES</MenuItem>
<MenuItem value="CIENTIFICO DE DATOS">CIENTIFICO DE DATOS</MenuItem>
<MenuItem value="ENFERMERA PLANES ESPECIALES">ENFERMERA PLANES ESPECIALES</MenuItem>
<MenuItem value="ANALISTA FINANCIERO PAISES">ANALISTA FINANCIERO PAISES</MenuItem>
<MenuItem value="SUBGERENTE DE MEDICAMENTOS">SUBGERENTE DE MEDICAMENTOS</MenuItem>
<MenuItem value="COORDINADOR DE CARTERA MP">COORDINADOR DE CARTERA MP</MenuItem>
<MenuItem value="COORDINADOR INTEGRAL COMERCIAL">COORDINADOR INTEGRAL COMERCIAL</MenuItem>
<MenuItem value="ANALISTA CUENTAS MEDICAS">ANALISTA CUENTAS MEDICAS</MenuItem>
<MenuItem value="SUPERVISOR ASESORIA EN SALUD MP">SUPERVISOR ASESORIA EN SALUD MP</MenuItem>
<MenuItem value="TECNICO DE MANTENIMIENTO">TECNICO DE MANTENIMIENTO</MenuItem>
<MenuItem value="COORDINADOR MEDICO PLANES ESPECIALES">COORDINADOR MEDICO PLANES ESPECIALES</MenuItem>
<MenuItem value="AUDITOR MEDICO DE PARAMETRIZACION">AUDITOR MEDICO DE PARAMETRIZACION</MenuItem>
<MenuItem value="DIRECTOR DE GESTION DE CANALES">DIRECTOR DE GESTION DE CANALES</MenuItem>
<MenuItem value="GESTOR DE MEJORA">GESTOR DE MEJORA</MenuItem>
<MenuItem value="DIRECTOR DE ANALITICA Y PROYECTOS COMERCIALES">DIRECTOR DE ANALITICA Y PROYECTOS COMERCIALES</MenuItem>
<MenuItem value="ABOGADO TRIBUTARISTA">ABOGADO TRIBUTARISTA</MenuItem>
<MenuItem value="LIDER OPERATIVO">LIDER OPERATIVO</MenuItem>
<MenuItem value="AUDITOR DE GESTION MEDICA">AUDITOR DE GESTION MEDICA</MenuItem>
<MenuItem value="COORDINADOR DE PRESUPUESTO">COORDINADOR DE PRESUPUESTO</MenuItem>
<MenuItem value="ESPECIALISTA DE SEGURIDAD">ESPECIALISTA DE SEGURIDAD</MenuItem>
<MenuItem value="ANALISTA FINANCIERO GRUPO KERALTY">ANALISTA FINANCIERO GRUPO KERALTY</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL ZONA DELEGADAS">DIRECTOR COMERCIAL ZONA DELEGADAS</MenuItem>
<MenuItem value="DIRECTOR EXPERIENCIA DE CANALES">DIRECTOR EXPERIENCIA DE CANALES</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO DE COMUNICACIONES">DIRECTOR OPERATIVO DE COMUNICACIONES</MenuItem>
<MenuItem value="GERENTE CORPORATIVO DE TECNOLOGIA">GERENTE CORPORATIVO DE TECNOLOGIA</MenuItem>
<MenuItem value="ABOGADO CORPORATIVO II">ABOGADO CORPORATIVO II</MenuItem>
<MenuItem value="SUBGERENTE COMERCIAL MEDELLIN">SUBGERENTE COMERCIAL MEDELLIN</MenuItem>
<MenuItem value="SUBGERENTE DE SISTEMAS Y FORENSE">SUBGERENTE DE SISTEMAS Y FORENSE</MenuItem>
<MenuItem value="DIRECTOR DE CONTRATACION">DIRECTOR DE CONTRATACION</MenuItem>
<MenuItem value="ANALISTA ASEGURAMIENTO DE CALIDAD">ANALISTA ASEGURAMIENTO DE CALIDAD</MenuItem>
<MenuItem value="ANALISTA DE TESORERIA">ANALISTA DE TESORERIA</MenuItem>
<MenuItem value="ARQUITECTO INTELIGENCIA DE NEGOCIOS I">ARQUITECTO INTELIGENCIA DE NEGOCIOS I</MenuItem>
<MenuItem value="COORDINADOR PORTAL WEB">COORDINADOR PORTAL WEB</MenuItem>
<MenuItem value="FORMADOR">FORMADOR</MenuItem>
<MenuItem value="GERENTE DE ATENCION DOMICILIARIA">GERENTE DE ATENCION DOMICILIARIA</MenuItem>
<MenuItem value="LIDER DE PROCESOS OPERATIVOS">LIDER DE PROCESOS OPERATIVOS</MenuItem>
<MenuItem value="VICEPRESIDENTE DE SALUD MEDICINA PREPAGADA">VICEPRESIDENTE DE SALUD MEDICINA PREPAGADA</MenuItem>
<MenuItem value="ANALISTA SENIOR INVESTIGACION DE MERCADOS">ANALISTA SENIOR INVESTIGACION DE MERCADOS</MenuItem>
<MenuItem value="COORDINADOR DE OFICINA">COORDINADOR DE OFICINA</MenuItem>
<MenuItem value="ANALISTA DE RELACIONES PUBLICAS">ANALISTA DE RELACIONES PUBLICAS</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO COMERCIAL">COORDINADOR OPERATIVO COMERCIAL</MenuItem>
<MenuItem value="PROFESIONAL DE SEGURIDAD DE LA INFORMACION I">PROFESIONAL DE SEGURIDAD DE LA INFORMACION I</MenuItem>
<MenuItem value="AUDITOR ODONTOLOGICO">AUDITOR ODONTOLOGICO</MenuItem>
<MenuItem value="ENFERMERO AUDITOR SENIOR">ENFERMERO AUDITOR SENIOR</MenuItem>
<MenuItem value="SUBGERENTE DE BUSINESS PARTNER ASEGURAMIENTO PREMIUM">SUBGERENTE DE BUSINESS PARTNER ASEGURAMIENTO PREMIUM</MenuItem>
<MenuItem value="DISE ADOR GRAFICO">DISE ADOR GRAFICO</MenuItem>
<MenuItem value="COORDINADOR SERVICIOS MEDICOS">COORDINADOR SERVICIOS MEDICOS</MenuItem>
<MenuItem value="AUDITOR MEDICO DE APOYO">AUDITOR MEDICO DE APOYO</MenuItem>
<MenuItem value="GESTOR FUNCIONAL DEL SERVICIO">GESTOR FUNCIONAL DEL SERVICIO</MenuItem>
<MenuItem value="LIDER UX EXPERIENCIA DE USUARIO">LIDER UX EXPERIENCIA DE USUARIO</MenuItem>
<MenuItem value="SUBGERENTE MEDICO REGIONAL BTA MEDICINA PREPAGADA">SUBGERENTE MEDICO REGIONAL BTA MEDICINA PREPAGADA</MenuItem>
<MenuItem value="GESTOR COMPENSACION PRESTADORES">GESTOR COMPENSACION PRESTADORES</MenuItem>
<MenuItem value="ESPECIALISTA DE SEGURIDAD DE LA INFORMACION">ESPECIALISTA DE SEGURIDAD DE LA INFORMACION</MenuItem>
<MenuItem value="SECRETARIA GERENCIA REGIONAL">SECRETARIA GERENCIA REGIONAL</MenuItem>
<MenuItem value="SUBGERENTE DE GESTION EQUIPOS DE SALUD">SUBGERENTE DE GESTION EQUIPOS DE SALUD</MenuItem>
<MenuItem value="GESTOR DE INFORMACION Y PROYECTOS">GESTOR DE INFORMACION Y PROYECTOS</MenuItem>
<MenuItem value="JEFE DE GESTION DE PORTAFOLIO">JEFE DE GESTION DE PORTAFOLIO</MenuItem>
<MenuItem value="ASESOR DE PRESTADORES">ASESOR DE PRESTADORES</MenuItem>
<MenuItem value="ANALISTA DE PROYECTOS COMERCIALES">ANALISTA DE PROYECTOS COMERCIALES</MenuItem>
<MenuItem value="SUBGERENTE MEDICO RED DE PRESTADORES">SUBGERENTE MEDICO RED DE PRESTADORES</MenuItem>
<MenuItem value="GERENTE GESTION INTEGRAL EN SALUD">GERENTE GESTION INTEGRAL EN SALUD</MenuItem>
<MenuItem value="GERENTE DE CANALES DIGITALES">GERENTE DE CANALES DIGITALES</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE USUARIOS JUNIOR">ASESOR INTEGRAL DE USUARIOS JUNIOR</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO DE PRESTACIONES">DIRECTOR OPERATIVO DE PRESTACIONES</MenuItem>
<MenuItem value="ESPECIALISTA SERVICIOS MEDICOS MP">ESPECIALISTA SERVICIOS MEDICOS MP</MenuItem>
<MenuItem value="DIRECTOR DE ACTUARIA ASEGURAMIENTO">DIRECTOR DE ACTUARIA ASEGURAMIENTO</MenuItem>
<MenuItem value="SUBGERENTE DE GESTION COMERCIAL">SUBGERENTE DE GESTION COMERCIAL</MenuItem>
<MenuItem value="CONTRALOR CUENTAS MEDICAS">CONTRALOR CUENTAS MEDICAS</MenuItem>
<MenuItem value="LIDER ADMINISTRATIVO DE PROYECTOS">LIDER ADMINISTRATIVO DE PROYECTOS</MenuItem>
<MenuItem value="ARQUITECTO DE TI">ARQUITECTO DE TI</MenuItem>
<MenuItem value="ANALISTA DE CONVENIOS Y TARIFAS SENIOR">ANALISTA DE CONVENIOS Y TARIFAS SENIOR</MenuItem>
<MenuItem value="JEFE DE SEGURIDAD CLINICA REINA SOFIA">JEFE DE SEGURIDAD CLINICA REINA SOFIA</MenuItem>
<MenuItem value="AUXILIAR DE TESORERIA">AUXILIAR DE TESORERIA</MenuItem>
<MenuItem value="CONSULTOR GESTION DE PERSONAL">CONSULTOR GESTION DE PERSONAL</MenuItem>
<MenuItem value="ANALISTA DIGITAL SENIOR">ANALISTA DIGITAL SENIOR</MenuItem>
<MenuItem value="GESTOR ADMINISTRATIVO ODONTOLOG A">GESTOR ADMINISTRATIVO ODONTOLOG A</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO DE CANAL PRESENCIAL MP">DIRECTOR OPERATIVO DE CANAL PRESENCIAL MP</MenuItem>
<MenuItem value="PROFESIONAL SENIOR DE RESERVAS">PROFESIONAL SENIOR DE RESERVAS</MenuItem>
<MenuItem value="COORDINADOR DE AUTORIZACIONES MP">COORDINADOR DE AUTORIZACIONES MP</MenuItem>
<MenuItem value="CONSULTOR DE SERVICIO">CONSULTOR DE SERVICIO</MenuItem>
<MenuItem value="GESTOR DE CUENTAS MEDICAS">GESTOR DE CUENTAS MEDICAS</MenuItem>
<MenuItem value="COORDINADOR GESTION FARMACEUTICA">COORDINADOR GESTION FARMACEUTICA</MenuItem>
<MenuItem value="SECRETARIA DE IMPUESTOS">SECRETARIA DE IMPUESTOS</MenuItem>
<MenuItem value="DIRECTOR CORPORATIVO DE GESTION Y PLANEACION">DIRECTOR CORPORATIVO DE GESTION Y PLANEACION</MenuItem>
<MenuItem value="BACTERIOLOGO AUDITOR">BACTERIOLOGO AUDITOR</MenuItem>
<MenuItem value="COORDINADOR REGIONAL DE PROYECTOS COMERCIALES">COORDINADOR REGIONAL DE PROYECTOS COMERCIALES</MenuItem>
<MenuItem value="LIDER DE GESTION Y PROYECTOS">LIDER DE GESTION Y PROYECTOS</MenuItem>
<MenuItem value="ASESOR DE ATENCION PERSONALIZADA">ASESOR DE ATENCION PERSONALIZADA</MenuItem>
<MenuItem value="LIDER DE FORMACION VIRTUAL">LIDER DE FORMACION VIRTUAL</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO AUDITORIA MEDICA">AUXILIAR OPERATIVO AUDITORIA MEDICA</MenuItem>
<MenuItem value="COORDINADOR DE CANAL VIRTUAL">COORDINADOR DE CANAL VIRTUAL</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO MESA DE VALIDACION">AUXILIAR OPERATIVO MESA DE VALIDACION</MenuItem>
<MenuItem value="ASESOR COMERCIAL SENIOR DE VENTA DIRECTA">ASESOR COMERCIAL SENIOR DE VENTA DIRECTA</MenuItem>
<MenuItem value="ABOGADO CORPORATIVO I">ABOGADO CORPORATIVO I</MenuItem>
<MenuItem value="GESTOR DE FORMACION">GESTOR DE FORMACION</MenuItem>
<MenuItem value="GERENTE REGIONAL BUCARAMANGA">GERENTE REGIONAL BUCARAMANGA</MenuItem>
<MenuItem value="GERENTE DE DESARROLLO">GERENTE DE DESARROLLO</MenuItem>
<MenuItem value="ENFERMERO AUDITOR JUNIOR DE APOYO">ENFERMERO AUDITOR JUNIOR DE APOYO</MenuItem>
<MenuItem value="ESPECIALISTA DE PLANEACION FINANCIERA">ESPECIALISTA DE PLANEACION FINANCIERA</MenuItem>
<MenuItem value="ANALISTA FUNCIONAL DE EXPERIENCIA">ANALISTA FUNCIONAL DE EXPERIENCIA</MenuItem>
<MenuItem value="DIRECTOR DE SOLUCIONES ESTRUCTURALES">DIRECTOR DE SOLUCIONES ESTRUCTURALES</MenuItem>
<MenuItem value="GERENTE REGIONAL CALI">GERENTE REGIONAL CALI</MenuItem>
<MenuItem value="LIDER DE SOLUCIONES">LIDER DE SOLUCIONES</MenuItem>
<MenuItem value="SECRETARIA PLANES ESPECIALES">SECRETARIA PLANES ESPECIALES</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO DE SERVICIOS MEDICOS">DIRECTOR OPERATIVO DE SERVICIOS MEDICOS</MenuItem>
<MenuItem value="DIRECTOR DIGITAL Y MEDIOS">DIRECTOR DIGITAL Y MEDIOS</MenuItem>
<MenuItem value="DIRECTOR DE CARTERA Y RECAUDO MP">DIRECTOR DE CARTERA Y RECAUDO MP</MenuItem>
<MenuItem value="SUBGERENTE DE ASUNTOS REGULATORIOS">SUBGERENTE DE ASUNTOS REGULATORIOS</MenuItem>
<MenuItem value="LIDER DE SERVICIO TI">LIDER DE SERVICIO TI</MenuItem>
<MenuItem value="LIDER DE MONITOREO Y CONTROL DE TI">LIDER DE MONITOREO Y CONTROL DE TI</MenuItem>
<MenuItem value="GERENTE DE GESTION DEL CONOCIMIENTO, CULTURA Y CAMBIO">GERENTE DE GESTION DEL CONOCIMIENTO, CULTURA Y CAMBIO</MenuItem>
<MenuItem value="DIRECTOR PROYECTOS EN SALUD">DIRECTOR PROYECTOS EN SALUD</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO DE CANAL TELEFONICO">DIRECTOR OPERATIVO DE CANAL TELEFONICO</MenuItem>
<MenuItem value="EJECUTIVO COMERCIAL MANTENIMIENTO JUNIOR I">EJECUTIVO COMERCIAL MANTENIMIENTO JUNIOR I</MenuItem>
<MenuItem value="GERENTE BUSINESS PARTNER REGIONALES Y AREAS TRANSVERSALES">GERENTE BUSINESS PARTNER REGIONALES Y AREAS TRANSVERSALES</MenuItem>
<MenuItem value="GERENTE REGIONAL CENTRO ORIENTE">GERENTE REGIONAL CENTRO ORIENTE</MenuItem>
<MenuItem value="GERENTE DE OPERACION DE CANALES">GERENTE DE OPERACION DE CANALES</MenuItem>
<MenuItem value="GESTOR DE CALIDAD COMERCIAL">GESTOR DE CALIDAD COMERCIAL</MenuItem>
<MenuItem value="SUPERVISOR DE SERVICIOS Y PROVEEDORES">SUPERVISOR DE SERVICIOS Y PROVEEDORES</MenuItem>
<MenuItem value="ESPECIALISTA EN SERVICIO">ESPECIALISTA EN SERVICIO</MenuItem>
<MenuItem value="AUXILIAR DE DEMANDA INDUCIDA">AUXILIAR DE DEMANDA INDUCIDA</MenuItem>
<MenuItem value="JEFE DE CAPACITACION COMERCIAL REGIONAL">JEFE DE CAPACITACION COMERCIAL REGIONAL</MenuItem>
<MenuItem value="ANALISTA DE SEGUIMIENTO">ANALISTA DE SEGUIMIENTO</MenuItem>
<MenuItem value="ANALISTA DE CARTERA MP">ANALISTA DE CARTERA MP</MenuItem>
<MenuItem value="ADMINISTRADOR DE PLATAFORMAS">ADMINISTRADOR DE PLATAFORMAS</MenuItem>
<MenuItem value="SECRETARIA PRESIDENCIA">SECRETARIA PRESIDENCIA</MenuItem>
<MenuItem value="GESTOR DE SERVICIOS TI IV">GESTOR DE SERVICIOS TI IV</MenuItem>
<MenuItem value="GESTOR MESA DE AYUDA A PRESTADORES">GESTOR MESA DE AYUDA A PRESTADORES</MenuItem>
<MenuItem value="COORDINADOR DE PROGRAMAS">COORDINADOR DE PROGRAMAS</MenuItem>
<MenuItem value="GESTOR OPERATIVO DE CANAL DIGITAL">GESTOR OPERATIVO DE CANAL DIGITAL</MenuItem>
<MenuItem value="LIDER DE PROCESOS OPERATIVOS I">LIDER DE PROCESOS OPERATIVOS I</MenuItem>
<MenuItem value="GERENTE DE GESTION MEXICO">GERENTE DE GESTION MEXICO</MenuItem>
<MenuItem value="GERENTE DE GESTION DE OPERACIONES">GERENTE DE GESTION DE OPERACIONES</MenuItem>
<MenuItem value="RECEPCIONISTA II">RECEPCIONISTA II</MenuItem>
<MenuItem value="SECRETARIA SERVICIOS MEDICOS">SECRETARIA SERVICIOS MEDICOS</MenuItem>
<MenuItem value="ANALISTA SENIOR DE CARTERA Y COBRANZAS">ANALISTA SENIOR DE CARTERA Y COBRANZAS</MenuItem>
<MenuItem value="SUBGERENTE CORPORATIVO DE TECNOLOGIA">SUBGERENTE CORPORATIVO DE TECNOLOGIA</MenuItem>
<MenuItem value="LIDER REGIONAL DE GESTION COMERCIAL">LIDER REGIONAL DE GESTION COMERCIAL</MenuItem>
<MenuItem value="COORDINADOR DE GESTION OPERATIVA">COORDINADOR DE GESTION OPERATIVA</MenuItem>
<MenuItem value="SUBGERENTE COMERCIAL REGIONAL CALI">SUBGERENTE COMERCIAL REGIONAL CALI</MenuItem>
<MenuItem value="SUBGERENTE DE CONTRALORIA DE CUENTAS MEDICAS">SUBGERENTE DE CONTRALORIA DE CUENTAS MEDICAS</MenuItem>
<MenuItem value="SUBGERENTE COMERCIAL CERREJON">SUBGERENTE COMERCIAL CERREJON</MenuItem>
<MenuItem value="ANALISTA DE FIDELIZACION Y MERCADEO">ANALISTA DE FIDELIZACION Y MERCADEO</MenuItem>
<MenuItem value="ANALISTA DE GESTION">ANALISTA DE GESTION</MenuItem>
<MenuItem value="GERENTE COMERCIAL FUERZA DE VENTAS INTERNA BTA">GERENTE COMERCIAL FUERZA DE VENTAS INTERNA BTA</MenuItem>
<MenuItem value="SUBGERENTE COMERCIAL REGIONAL CENTRO ORIENTE">SUBGERENTE COMERCIAL REGIONAL CENTRO ORIENTE</MenuItem>
<MenuItem value="COORDINADOR DE SERVICIOS DOMICILIARIOS">COORDINADOR DE SERVICIOS DOMICILIARIOS</MenuItem>
<MenuItem value="SUBGERENTE DE GESTION Y FIDELIZACION DE USUARIOS">SUBGERENTE DE GESTION Y FIDELIZACION DE USUARIOS</MenuItem>
<MenuItem value="DIRECTOR FINANCIERO PAISES">DIRECTOR FINANCIERO PAISES</MenuItem>
<MenuItem value="CONTENT MANAGER">CONTENT MANAGER</MenuItem>
<MenuItem value="SUBGERENTE SERVICIOS MEDICOS">SUBGERENTE SERVICIOS MEDICOS</MenuItem>
<MenuItem value="SECRETARIA MEDICA">SECRETARIA MEDICA</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL DELEGADAS">DIRECTOR COMERCIAL DELEGADAS</MenuItem>
<MenuItem value="SECRETARIA OFICINA">SECRETARIA OFICINA</MenuItem>
<MenuItem value="ASESOR INTEGRAL COMERCIAL Y SERVICIOS MEDICOS">ASESOR INTEGRAL COMERCIAL Y SERVICIOS MEDICOS</MenuItem>
<MenuItem value="SUBGERENTE FINANCIERO NACIONAL">SUBGERENTE FINANCIERO NACIONAL</MenuItem>
<MenuItem value="SUBGERENTE DE PLANEACION Y CONTROL Y CONVENIOS Y TARIFAS">SUBGERENTE DE PLANEACION Y CONTROL Y CONVENIOS Y TARIFAS</MenuItem>
<MenuItem value="DIRECTOR DE PROYECTOS DE ACTUARIA">DIRECTOR DE PROYECTOS DE ACTUARIA</MenuItem>
<MenuItem value="DIRECTOR OFICINA DE PRENSA">DIRECTOR OFICINA DE PRENSA</MenuItem>
<MenuItem value="ASISTENTE GERENCIA COMERCIAL REG. BOGOTA">ASISTENTE GERENCIA COMERCIAL REG. BOGOTA</MenuItem>
<MenuItem value="DIRECTOR MEDICO NACIONAL">DIRECTOR MEDICO NACIONAL</MenuItem>
<MenuItem value="COORDINADOR DE ACCESO">COORDINADOR DE ACCESO</MenuItem>
<MenuItem value="JEFE CONTROL Y POLITICA CONTABLE">JEFE CONTROL Y POLITICA CONTABLE</MenuItem>
<MenuItem value="DIRECTOR DE GESTION">DIRECTOR DE GESTION</MenuItem>
<MenuItem value="SECRETARIA DE CONTABILIDAD">SECRETARIA DE CONTABILIDAD</MenuItem>
<MenuItem value="SUPERNUMERARIO CONTROL Y POLITICA CONTABLE">SUPERNUMERARIO CONTROL Y POLITICA CONTABLE</MenuItem>
<MenuItem value="GERENTE REGIONAL BARRANQUILLA">GERENTE REGIONAL BARRANQUILLA</MenuItem>
<MenuItem value="ASESOR DE SEGUIMIENTO">ASESOR DE SEGUIMIENTO</MenuItem>
<MenuItem value="GERENTE PLANEACION Y GESTION DE RED">GERENTE PLANEACION Y GESTION DE RED</MenuItem>
<MenuItem value="GERENTE REGIONAL MEDELLIN">GERENTE REGIONAL MEDELLIN</MenuItem>
<MenuItem value="GERENTE DE RIESGOS">GERENTE DE RIESGOS</MenuItem>
<MenuItem value="LIDER TECNICO I">LIDER TECNICO I</MenuItem>
<MenuItem value="LIDER DE MICROINFORMATICA">LIDER DE MICROINFORMATICA</MenuItem>
<MenuItem value="GERENTE GESTION DEL RIESGO">GERENTE GESTION DEL RIESGO</MenuItem>
<MenuItem value="GERENTE MEDICO REGIONAL BTA MEDICINA PREPAGADA">GERENTE MEDICO REGIONAL BTA MEDICINA PREPAGADA</MenuItem>
<MenuItem value="GESTOR DE SERVICIOS Y PROVEEDORES">GESTOR DE SERVICIOS Y PROVEEDORES</MenuItem>
<MenuItem value="ANALISTA DE GESTION JUNIOR">ANALISTA DE GESTION JUNIOR</MenuItem>
<MenuItem value="ASESOR DE SERVICIO SENIOR">ASESOR DE SERVICIO SENIOR</MenuItem>
<MenuItem value="ESPECIALISTA IMPUESTOS PAISES">ESPECIALISTA IMPUESTOS PAISES</MenuItem>
<MenuItem value="SUBDIRECTOR DE CARTERA Y AFILIACIONES">SUBDIRECTOR DE CARTERA Y AFILIACIONES</MenuItem>
<MenuItem value="LIDER IMPLEMENTACION">LIDER IMPLEMENTACION</MenuItem>
<MenuItem value="ANALISTA DE SERVICIO DESARROLLO HUMANO">ANALISTA DE SERVICIO DESARROLLO HUMANO</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO DE SERVICIOS MEDICOS MP">COORDINADOR OPERATIVO DE SERVICIOS MEDICOS MP</MenuItem>
<MenuItem value="EJECUTIVO COMERCIAL MANTENIMIENTO REGIONAL CENTRO ORIENTE">EJECUTIVO COMERCIAL MANTENIMIENTO REGIONAL CENTRO ORIENTE</MenuItem>
<MenuItem value="DIRECTOR DE AUDITORIA">DIRECTOR DE AUDITORIA</MenuItem>
<MenuItem value="SUBGERENTE GESTION DE RED">SUBGERENTE GESTION DE RED</MenuItem>
<MenuItem value="ANALISTA TECNICO JUNIOR I">ANALISTA TECNICO JUNIOR I</MenuItem>
<MenuItem value="DIRECTOR DE ASEGURAMIENTO">DIRECTOR DE ASEGURAMIENTO</MenuItem>
<MenuItem value="COORDINADOR CONTRATACION MEDICA">COORDINADOR CONTRATACION MEDICA</MenuItem>
<MenuItem value="SUPERNUMERARIO AREA FINANCIERA">SUPERNUMERARIO AREA FINANCIERA</MenuItem>
<MenuItem value="CONSULTOR DE ARQUITECTURA TI">CONSULTOR DE ARQUITECTURA TI</MenuItem>
<MenuItem value="GERENTE REGIONAL BOGOTA">GERENTE REGIONAL BOGOTA</MenuItem>
<MenuItem value="GESTOR DE ENFERMERIA EMPRESA">GESTOR DE ENFERMERIA EMPRESA</MenuItem>
<MenuItem value="ASESOR OPERATIVO JUNIOR">ASESOR OPERATIVO JUNIOR</MenuItem>
<MenuItem value="VICEPRESIDENTE EJECUTIVA MEDICINA PREPAGADA">VICEPRESIDENTE EJECUTIVA MEDICINA PREPAGADA</MenuItem>
<MenuItem value="PRESIDENTE ASEGURAMIENTO PREMIUM">PRESIDENTE ASEGURAMIENTO PREMIUM</MenuItem>
<MenuItem value="AUXILIAR DE SERVICIO">AUXILIAR DE SERVICIO</MenuItem>
<MenuItem value="ANALISTA DE GESTION DOCUMENTAL">ANALISTA DE GESTION DOCUMENTAL</MenuItem>
<MenuItem value="ANALISTA DIGITAL">ANALISTA DIGITAL</MenuItem>
<MenuItem value="ANALISTA DE IMPUESTOS I">ANALISTA DE IMPUESTOS I</MenuItem>
<MenuItem value="LIDER ADMINISTRATIVO EN SALUD">LIDER ADMINISTRATIVO EN SALUD</MenuItem>
<MenuItem value="DIRECTOR DE ANALISIS FINANCIERO">DIRECTOR DE ANALISIS FINANCIERO</MenuItem>
<MenuItem value="PENSIONADO">PENSIONADO</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO PRESIDENCIA DE SALUD">DIRECTOR ADMINISTRATIVO PRESIDENCIA DE SALUD</MenuItem>
<MenuItem value="ABOGADO I">ABOGADO I</MenuItem>
<MenuItem value="GESTOR OPERATIVO CENTROS MEDICOS">GESTOR OPERATIVO CENTROS MEDICOS</MenuItem>
<MenuItem value="ANALISTA DE CALIDAD SENIOR">ANALISTA DE CALIDAD SENIOR</MenuItem>
<MenuItem value="SECRETARIA GERENCIA FINANCIERA">SECRETARIA GERENCIA FINANCIERA</MenuItem>
<MenuItem value="AUXILIAR DE INFORMACION">AUXILIAR DE INFORMACION</MenuItem>
<MenuItem value="DIRECTOR DE SERVICIO Y GESTION COMERCIAL">DIRECTOR DE SERVICIO Y GESTION COMERCIAL</MenuItem>
<MenuItem value="GERENTE RED DE PRESTADORES">GERENTE RED DE PRESTADORES</MenuItem>
<MenuItem value="DIRECTOR CUENTAS POR PAGAR">DIRECTOR CUENTAS POR PAGAR</MenuItem>
<MenuItem value="GERENTE GESTION COMERCIAL NACIONAL">GERENTE GESTION COMERCIAL NACIONAL</MenuItem>
<MenuItem value="PROFESIONAL EN SALUD AREA DE MEDICAMENTOS">PROFESIONAL EN SALUD AREA DE MEDICAMENTOS</MenuItem>
<MenuItem value="SUBGERENTE DE PROYECTOS ESPECIALES EN SALUD">SUBGERENTE DE PROYECTOS ESPECIALES EN SALUD</MenuItem>
<MenuItem value="ASESOR PAI">ASESOR PAI</MenuItem>
<MenuItem value="DIRECTOR CENTRAL SERVICIOS DE SALUD">DIRECTOR CENTRAL SERVICIOS DE SALUD</MenuItem>
<MenuItem value="DIRECTOR DE GESTION DE SERVICIO">DIRECTOR DE GESTION DE SERVICIO</MenuItem>
<MenuItem value="ANALISTA JUNIOR DE MARKETING">ANALISTA JUNIOR DE MARKETING</MenuItem>
<MenuItem value="SUBDIRECTOR DE AFILIACIONES">SUBDIRECTOR DE AFILIACIONES</MenuItem>
<MenuItem value="TECNICO DE COMUNICACIONES">TECNICO DE COMUNICACIONES</MenuItem>
<MenuItem value="ANALISTA DE FORMACION">ANALISTA DE FORMACION</MenuItem>
<MenuItem value="AUXILIAR DE SERVICIO Y ADMINISTRATIVO">AUXILIAR DE SERVICIO Y ADMINISTRATIVO</MenuItem>
<MenuItem value="GERENTE ADMINISTRATIVO">GERENTE ADMINISTRATIVO</MenuItem>
<MenuItem value="COORDINADOR DE PLANEACION Y CONTROL">COORDINADOR DE PLANEACION Y CONTROL</MenuItem>
<MenuItem value="ANALISTA DE CONSOLIDACION">ANALISTA DE CONSOLIDACION</MenuItem>
<MenuItem value="PRACTICANTE COMUNICACIONES INTERNAS">PRACTICANTE COMUNICACIONES INTERNAS</MenuItem>
<MenuItem value="ABOGADO LABORAL II">ABOGADO LABORAL II</MenuItem>
<MenuItem value="ASESOR EN SALUD MEDICINA PREPAGADA">ASESOR EN SALUD MEDICINA PREPAGADA</MenuItem>
<MenuItem value="SUBGERENTE COMERCIAL REGIONAL BUCARAMANGA">SUBGERENTE COMERCIAL REGIONAL BUCARAMANGA</MenuItem>
<MenuItem value="LIDER PLANES ESPECIALES ODONTOLOGIA">LIDER PLANES ESPECIALES ODONTOLOGIA</MenuItem>
<MenuItem value="JEFE DE SEGURIDAD REGIONAL BARRANQUILLA">JEFE DE SEGURIDAD REGIONAL BARRANQUILLA</MenuItem>
<MenuItem value="DIRECTOR GENERAL CENTROS MEDICOS">DIRECTOR GENERAL CENTROS MEDICOS</MenuItem>
<MenuItem value="VICEPRESIDENTE DE COMPRAS">VICEPRESIDENTE DE COMPRAS</MenuItem>
<MenuItem value="DIRECTOR DE ASEGURAMIENTO DE OPERACION">DIRECTOR DE ASEGURAMIENTO DE OPERACION</MenuItem>
<MenuItem value="DIRECTOR PLANES MODULARES">DIRECTOR PLANES MODULARES</MenuItem>
<MenuItem value="ANALISTA DE GESTION DE PORTAFOLIO">ANALISTA DE GESTION DE PORTAFOLIO</MenuItem>
<MenuItem value="AUXILIAR DE CARTERA Y COBRANZAS I">AUXILIAR DE CARTERA Y COBRANZAS I</MenuItem>
<MenuItem value="AUXILIAR ASISTENCIAL DE INFORMACION">AUXILIAR ASISTENCIAL DE INFORMACION</MenuItem>
<MenuItem value="DIRECTOR DE SERVICIO">DIRECTOR DE SERVICIO</MenuItem>
<MenuItem value="DIRECTOR CORPORATIVO CONTROL DE PROYECTOS">DIRECTOR CORPORATIVO CONTROL DE PROYECTOS</MenuItem>
<MenuItem value="GESTOR FORMACION PRESTADORES">GESTOR FORMACION PRESTADORES</MenuItem>
<MenuItem value="GERENTE COMERCIAL FUERZA DE VENTAS EXTERNA BTA">GERENTE COMERCIAL FUERZA DE VENTAS EXTERNA BTA</MenuItem>
<MenuItem value="ANALISTA SENIOR DE RETENCION">ANALISTA SENIOR DE RETENCION</MenuItem>
<MenuItem value="SUBGERENTE OPERATIVO DE VINCULACION MP">SUBGERENTE OPERATIVO DE VINCULACION MP</MenuItem>
<MenuItem value="DIRECTOR DE INFORMACION Y GESTION">DIRECTOR DE INFORMACION Y GESTION</MenuItem>
<MenuItem value="PREPARADOR FISICO">PREPARADOR FISICO</MenuItem>
<MenuItem value="DIRECTOR DE ASEGURAMIENTO EN SALUD">DIRECTOR DE ASEGURAMIENTO EN SALUD</MenuItem>
<MenuItem value="DIRECTOR DE CALIDAD Y SERVICIO">DIRECTOR DE CALIDAD Y SERVICIO</MenuItem>
<MenuItem value="SUBGERENTE DE PLANES ESPECIALES">SUBGERENTE DE PLANES ESPECIALES</MenuItem>
<MenuItem value="GERENTE FINANCIERO KERALTY">GERENTE FINANCIERO KERALTY</MenuItem>
<MenuItem value="DIRECTOR DE MEDICAMENTOS Y TECNOLOGIA EN SALUD">DIRECTOR DE MEDICAMENTOS Y TECNOLOGIA EN SALUD</MenuItem>
<MenuItem value="GERENTE ANALITICA DE NEGOCIO">GERENTE ANALITICA DE NEGOCIO</MenuItem>
<MenuItem value="GERENTE CORPORATIVO DE ARQUITECTURA Y PROCESOS">GERENTE CORPORATIVO DE ARQUITECTURA Y PROCESOS</MenuItem>
<MenuItem value="DIRECTOR DE OPERACIONES TI">DIRECTOR DE OPERACIONES TI</MenuItem>
<MenuItem value="GERENTE SALUD Y SEGURIDAD EN EL TRABAJO">GERENTE SALUD Y SEGURIDAD EN EL TRABAJO</MenuItem>
<MenuItem value="GERENTE DE SERVICIOS Y EQUIPAMIENTO">GERENTE DE SERVICIOS Y EQUIPAMIENTO</MenuItem>
<MenuItem value="ANALISTA DE AFILIACIONES I">ANALISTA DE AFILIACIONES I</MenuItem>
<MenuItem value="DIRECTOR FINANCIERO COLOMBIA">DIRECTOR FINANCIERO COLOMBIA</MenuItem>
<MenuItem value="SUBGERENTE DE GESTION EN SALUD">SUBGERENTE DE GESTION EN SALUD</MenuItem>
<MenuItem value="DIRECTOR CREATIVO">DIRECTOR CREATIVO</MenuItem>
<MenuItem value="DIRECTOR CANAL VIRTUAL">DIRECTOR CANAL VIRTUAL</MenuItem>
<MenuItem value="ANALISTA DE PROYECTOS COMERCIALES SENIOR">ANALISTA DE PROYECTOS COMERCIALES SENIOR</MenuItem>
<MenuItem value="COORDINADOR DE RED">COORDINADOR DE RED</MenuItem>
<MenuItem value="LIDER FUNCIONAL DE INTEGRACION">LIDER FUNCIONAL DE INTEGRACION</MenuItem>
<MenuItem value="ADMINISTRADOR DEL SISTEMA TECNOLOGIA">ADMINISTRADOR DEL SISTEMA TECNOLOGIA</MenuItem>
<MenuItem value="ESPECIALISTA PRESTACION DEL SERVICIO MP">ESPECIALISTA PRESTACION DEL SERVICIO MP</MenuItem>
<MenuItem value="JEFE DE SEGURIDAD COMPLEJO SALITRE">JEFE DE SEGURIDAD COMPLEJO SALITRE</MenuItem>
<MenuItem value="COORDINADOR DE CARTERA Y RECAUDO">COORDINADOR DE CARTERA Y RECAUDO</MenuItem>
<MenuItem value="GESTOR DE AFILIACIONES Y CARTERA">GESTOR DE AFILIACIONES Y CARTERA</MenuItem>
<MenuItem value="ANALISTA ADMINISTRADOR DE CASOS">ANALISTA ADMINISTRADOR DE CASOS</MenuItem>
<MenuItem value="COORDINADOR DE RED DE PROVEEDORES">COORDINADOR DE RED DE PROVEEDORES</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL OTROS RAMOS">DIRECTOR COMERCIAL OTROS RAMOS</MenuItem>
<MenuItem value="VICEPRESIDENTE EJECUTIVO SEGUROS COLSANITAS">VICEPRESIDENTE EJECUTIVO SEGUROS COLSANITAS</MenuItem>
<MenuItem value="LIDER DE PROCESOS Y MEJORA CONTINUA">LIDER DE PROCESOS Y MEJORA CONTINUA</MenuItem>
<MenuItem value="CONSULTOR COMERCIAL">CONSULTOR COMERCIAL</MenuItem>
<MenuItem value="DIRECTOR DE CANALES DE ATENCION">DIRECTOR DE CANALES DE ATENCION</MenuItem>
<MenuItem value="ESPECIALISTA DE PROVEEDORES">ESPECIALISTA DE PROVEEDORES</MenuItem>
<MenuItem value="ANALISTA DE CONTABILIDAD SEGUROS">ANALISTA DE CONTABILIDAD SEGUROS</MenuItem>
<MenuItem value="DIRECTOR DE AUDITORIA SEGUROS">DIRECTOR DE AUDITORIA SEGUROS</MenuItem>
<MenuItem value="OFICIAL DE CUMPLIMIENTO">OFICIAL DE CUMPLIMIENTO</MenuItem>
<MenuItem value="DIRECTOR MEDICO ARL">DIRECTOR MEDICO ARL</MenuItem>
<MenuItem value="ESPECIALISTA DE INDEMNIZACIONES DE SEGUROS DE PERSONAS">ESPECIALISTA DE INDEMNIZACIONES DE SEGUROS DE PERSONAS</MenuItem>
<MenuItem value="ASESOR PORTAFOLIO DE PREVENCION I">ASESOR PORTAFOLIO DE PREVENCION I</MenuItem>
<MenuItem value="ASESOR PORTAFOLIO DE PREVENCION">ASESOR PORTAFOLIO DE PREVENCION</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE PREVENCION">ASESOR INTEGRAL DE PREVENCION</MenuItem>
<MenuItem value="AUXILIAR DE INDEMNIZACIONES">AUXILIAR DE INDEMNIZACIONES</MenuItem>
<MenuItem value="GERENTE FINANCIERO DE SEGUROS">GERENTE FINANCIERO DE SEGUROS</MenuItem>
<MenuItem value="LIDER SARLAFT">LIDER SARLAFT</MenuItem>
<MenuItem value="GERENTE COMERCIAL OTROS RAMOS">GERENTE COMERCIAL OTROS RAMOS</MenuItem>
<MenuItem value="DIRECTOR VIDA">DIRECTOR VIDA</MenuItem>
<MenuItem value="VICEPRESIDENTE COMERCIAL COMPA IA DE SEGUROS">VICEPRESIDENTE COMERCIAL COMPA IA DE SEGUROS</MenuItem>
<MenuItem value="ESPECIALISTA DE SUSCRIPCION DE RAMOS DE PERSONAS">ESPECIALISTA DE SUSCRIPCION DE RAMOS DE PERSONAS</MenuItem>
<MenuItem value="SUBGERENTE DE GESTION Y PROYECTOS">SUBGERENTE DE GESTION Y PROYECTOS</MenuItem>
<MenuItem value="WEB MASTER SENIOR">WEB MASTER SENIOR</MenuItem>
<MenuItem value="GESTOR DE EMISION">GESTOR DE EMISION</MenuItem>
<MenuItem value="COORDINADOR DE INDEMNIZACIONES">COORDINADOR DE INDEMNIZACIONES</MenuItem>
<MenuItem value="GERENTE DE ARL">GERENTE DE ARL</MenuItem>
<MenuItem value="DIRECTOR DE PREVENCION ARL">DIRECTOR DE PREVENCION ARL</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO SEGUROS">DIRECTOR OPERATIVO SEGUROS</MenuItem>
<MenuItem value="GESTOR DE PRESTACIONES">GESTOR DE PRESTACIONES</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE REHABILITACION">ASESOR INTEGRAL DE REHABILITACION</MenuItem>
<MenuItem value="COORDINADOR DE MEDICINA LABORAL">COORDINADOR DE MEDICINA LABORAL</MenuItem>
<MenuItem value="DIRECTOR DE PRODUCTO ARL">DIRECTOR DE PRODUCTO ARL</MenuItem>
<MenuItem value="GERENTE DE SEGUROS DE PERSONAS">GERENTE DE SEGUROS DE PERSONAS</MenuItem>
<MenuItem value="ANALISTA GESTION DE CONVENIOS">ANALISTA GESTION DE CONVENIOS</MenuItem>
<MenuItem value="DIRECTOR DE RIESGO SEGUROS">DIRECTOR DE RIESGO SEGUROS</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE PREVENCION INGENIERO">ASESOR INTEGRAL DE PREVENCION INGENIERO</MenuItem>
<MenuItem value="ANALISTA DE PRESTACIONES ECONOMICAS">ANALISTA DE PRESTACIONES ECONOMICAS</MenuItem>
<MenuItem value="SUBGERENTE COMERCIAL OTROS RAMOS">SUBGERENTE COMERCIAL OTROS RAMOS</MenuItem>
<MenuItem value="ANALISTA DE REASEGUROS">ANALISTA DE REASEGUROS</MenuItem>
<MenuItem value="ANALISTA DE INDEMNIZACIONES DE SEGUROS DE PERSONAS">ANALISTA DE INDEMNIZACIONES DE SEGUROS DE PERSONAS</MenuItem>
<MenuItem value="SECRETARIA VICEPRESIDENCIA I">SECRETARIA VICEPRESIDENCIA I</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL SEGUROS MASIVOS">DIRECTOR COMERCIAL SEGUROS MASIVOS</MenuItem>
<MenuItem value="ASESOR COMERCIAL ARL">ASESOR COMERCIAL ARL</MenuItem>
<MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
<MenuItem value="AUXILIAR SERVICIOS GENERALES">AUXILIAR SERVICIOS GENERALES</MenuItem>
<MenuItem value="ESTILISTA">ESTILISTA</MenuItem>
<MenuItem value="PRACTICANTE EDITORIAL">PRACTICANTE EDITORIAL</MenuItem>
<MenuItem value="EDITOR">EDITOR</MenuItem>
<MenuItem value="PRACTICANTE REVISTA">PRACTICANTE REVISTA</MenuItem>
<MenuItem value="REDACTOR I">REDACTOR I</MenuItem>
<MenuItem value="REDACTOR">REDACTOR</MenuItem>
<MenuItem value="ESPECIALISTA CREATIVO Y DIGITAL">ESPECIALISTA CREATIVO Y DIGITAL</MenuItem>
<MenuItem value="DIRECTOR EDITORIAL BIENESTAR">DIRECTOR EDITORIAL BIENESTAR</MenuItem>
<MenuItem value="PROFESIONAL MANEJO DE COHORTES">PROFESIONAL MANEJO DE COHORTES</MenuItem>
<MenuItem value="AUXILIAR EXPEDICION DE VOLANTES">AUXILIAR EXPEDICION DE VOLANTES</MenuItem>
<MenuItem value="ESPECIALISTA COHORTE DE RIESGO">ESPECIALISTA COHORTE DE RIESGO</MenuItem>
<MenuItem value="ANALISTA IMPLEMENTACION">ANALISTA IMPLEMENTACION</MenuItem>
<MenuItem value="AUXILIAR PRESTACIONES ECONOMICAS">AUXILIAR PRESTACIONES ECONOMICAS</MenuItem>
<MenuItem value="EJECUTIVO COMERCIAL EPS">EJECUTIVO COMERCIAL EPS</MenuItem>
<MenuItem value="ENFERMERO JEFE DE ALTO COSTO">ENFERMERO JEFE DE ALTO COSTO</MenuItem>
<MenuItem value="EJECUTIVO MULTIPRODUCTO">EJECUTIVO MULTIPRODUCTO</MenuItem>
<MenuItem value="GESTOR OPERATIVO JUNIOR DE APOYO">GESTOR OPERATIVO JUNIOR DE APOYO</MenuItem>
<MenuItem value="DINAMIZADOR EN SALUD">DINAMIZADOR EN SALUD</MenuItem>
<MenuItem value="DEPENDIENTE JUDICIAL I">DEPENDIENTE JUDICIAL I</MenuItem>
<MenuItem value="MEDICO GENERAL TELEORIENTACION">MEDICO GENERAL TELEORIENTACION</MenuItem>
<MenuItem value="GESTOR DE AUTOMATIZACION">GESTOR DE AUTOMATIZACION</MenuItem>
<MenuItem value="SUPERVISOR MEDICINA LABORAL">SUPERVISOR MEDICINA LABORAL</MenuItem>
<MenuItem value="AUXILIAR DE GESTION DE REFERENCIA Y CONTRAREFERENCIA">AUXILIAR DE GESTION DE REFERENCIA Y CONTRAREFERENCIA</MenuItem>
<MenuItem value="ANALISTA DE RECOBRO">ANALISTA DE RECOBRO</MenuItem>
<MenuItem value="COORDINADOR REGIONAL ENTES TERRITORIALES">COORDINADOR REGIONAL ENTES TERRITORIALES</MenuItem>
<MenuItem value="GERENTE DE GESTION REGIONALES Y MODELO COMUNITARIO">GERENTE DE GESTION REGIONALES Y MODELO COMUNITARIO</MenuItem>
<MenuItem value="DIRECTOR NACIONAL ASEGURAMIENTO RED">DIRECTOR NACIONAL ASEGURAMIENTO RED</MenuItem>
<MenuItem value="AUXILIAR DE RADICACION DE REFERENCIA Y CONTRAREFERENCIA">AUXILIAR DE RADICACION DE REFERENCIA Y CONTRAREFERENCIA</MenuItem>
<MenuItem value="PROFESIONAL SEGUIMIENTO A COHORTES">PROFESIONAL SEGUIMIENTO A COHORTES</MenuItem>
<MenuItem value="ANALISTA DE GESTION EN SALUD">ANALISTA DE GESTION EN SALUD</MenuItem>
<MenuItem value="COORDINADOR COMERCIAL MULTIPRODUCTO">COORDINADOR COMERCIAL MULTIPRODUCTO</MenuItem>
<MenuItem value="ASESOR DE GESTION INTEGRAL DE APOYO">ASESOR DE GESTION INTEGRAL DE APOYO</MenuItem>
<MenuItem value="SUPERVISOR DE ASIGNACION DE REFERENCIA Y CONTRAREFERENCIA">SUPERVISOR DE ASIGNACION DE REFERENCIA Y CONTRAREFERENCIA</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO CONTRALORIA CUENTAS MEDICAS">AUXILIAR OPERATIVO CONTRALORIA CUENTAS MEDICAS</MenuItem>
<MenuItem value="AUXILIAR DE RADICACION">AUXILIAR DE RADICACION</MenuItem>
<MenuItem value="GESTOR CANAL DE PRESTADORES">GESTOR CANAL DE PRESTADORES</MenuItem>
<MenuItem value="COORDINADOR DE SERVICIO">COORDINADOR DE SERVICIO</MenuItem>
<MenuItem value="SECRETARIA SUBGERENCIA SALUD REGIONAL BOGOTA">SECRETARIA SUBGERENCIA SALUD REGIONAL BOGOTA</MenuItem>
<MenuItem value="ABOGADO TUTELAS III">ABOGADO TUTELAS III</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO III">AUXILIAR OPERATIVO III</MenuItem>
<MenuItem value="GERENTE DE RED DE PRESTACION">GERENTE DE RED DE PRESTACION</MenuItem>
<MenuItem value="ANALISTA DE SOPORTE SENIOR I">ANALISTA DE SOPORTE SENIOR I</MenuItem>
<MenuItem value="COORDINADOR CANAL SERVICIO A PRESTADORES">COORDINADOR CANAL SERVICIO A PRESTADORES</MenuItem>
<MenuItem value="CIENTIFICO DE DATOS JUNIOR">CIENTIFICO DE DATOS JUNIOR</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA FAMILIAR DE APOYO">MEDICO ESPECIALISTA FAMILIAR DE APOYO</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE SERVICIOS MEDICOS II">ASESOR INTEGRAL DE SERVICIOS MEDICOS II</MenuItem>
<MenuItem value="DIRECTOR DE VALOR EN SALUD">DIRECTOR DE VALOR EN SALUD</MenuItem>
<MenuItem value="MEDICO GENERAL DE GESTION FARMACOLOGICA">MEDICO GENERAL DE GESTION FARMACOLOGICA</MenuItem>
<MenuItem value="EJECUTIVO COMERCIAL PAC-POS">EJECUTIVO COMERCIAL PAC-POS</MenuItem>
<MenuItem value="CONSULTOR DE TECNOLOGIA JUNIOR">CONSULTOR DE TECNOLOGIA JUNIOR</MenuItem>
<MenuItem value="AUXILIAR DE GESTION EMPRESA">AUXILIAR DE GESTION EMPRESA</MenuItem>
<MenuItem value="ASESOR MEDICO ATENCION PRIMARIA">ASESOR MEDICO ATENCION PRIMARIA</MenuItem>
<MenuItem value="SUBGERENTE DE ATENCION AMBULATORIA">SUBGERENTE DE ATENCION AMBULATORIA</MenuItem>
<MenuItem value="GERENTE MEDICO PLANES ESPECIALES">GERENTE MEDICO PLANES ESPECIALES</MenuItem>
<MenuItem value="ANALISTA DE PLANEACION Y CONTROL SENIOR">ANALISTA DE PLANEACION Y CONTROL SENIOR</MenuItem>
<MenuItem value="ANALISTA SENIOR DEFENSORIA DEL USUARIO">ANALISTA SENIOR DEFENSORIA DEL USUARIO</MenuItem>
<MenuItem value="COORDINADOR GESTION DE LA DEMANDA">COORDINADOR GESTION DE LA DEMANDA</MenuItem>
<MenuItem value="ASESOR MEDICO JURIDICO">ASESOR MEDICO JURIDICO</MenuItem>
<MenuItem value="AUXILIAR DE SALUD FAMILIAR">AUXILIAR DE SALUD FAMILIAR</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL PRODUCTOS VOLUNTARIOS">DIRECTOR COMERCIAL PRODUCTOS VOLUNTARIOS</MenuItem>
<MenuItem value="COORDINADOR GESTION DEL RIESGO">COORDINADOR GESTION DEL RIESGO</MenuItem>
<MenuItem value="LIDER DE PLANEACION">LIDER DE PLANEACION</MenuItem>
<MenuItem value="DIRECTOR DE EVALUACION DE PROGRAMAS">DIRECTOR DE EVALUACION DE PROGRAMAS</MenuItem>
<MenuItem value="EJECUTIVO POST VENTA EPS">EJECUTIVO POST VENTA EPS</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL EPS">DIRECTOR COMERCIAL EPS</MenuItem>
<MenuItem value="ESPECIALISTA EN CULTURA Y CUIDADO DEL PACIENTE">ESPECIALISTA EN CULTURA Y CUIDADO DEL PACIENTE</MenuItem>
<MenuItem value="ANALISTA TECNICO SENIOR I GESTION DE LA INFORMACION">ANALISTA TECNICO SENIOR I GESTION DE LA INFORMACION</MenuItem>
<MenuItem value="ASESOR GESTION DE MEDICAMENTOS">ASESOR GESTION DE MEDICAMENTOS</MenuItem>
<MenuItem value="GERENTE VALOR EN SALUD">GERENTE VALOR EN SALUD</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE SEGURIDAD DEL PACIENTE">DIRECTOR NACIONAL DE SEGURIDAD DEL PACIENTE</MenuItem>
<MenuItem value="DIRECTOR DE INFORMACION">DIRECTOR DE INFORMACION</MenuItem>
<MenuItem value="GERENTE SENIOR ENCARGADO DE FINANZAS EPS">GERENTE SENIOR ENCARGADO DE FINANZAS EPS</MenuItem>
<MenuItem value="DIRECTOR DE GESTION NO PBS">DIRECTOR DE GESTION NO PBS</MenuItem>
<MenuItem value="SUBGERENTE REGIONAL CENTRO">SUBGERENTE REGIONAL CENTRO</MenuItem>
<MenuItem value="SUBGERENTE COMERCIAL EPS">SUBGERENTE COMERCIAL EPS</MenuItem>
<MenuItem value="SUBGERENTE DE GESTION CLINICA">SUBGERENTE DE GESTION CLINICA</MenuItem>
<MenuItem value="MEDICO LICENCIAS MEDICAS">MEDICO LICENCIAS MEDICAS</MenuItem>
<MenuItem value="COORDINADOR RED NACIONAL">COORDINADOR RED NACIONAL</MenuItem>
<MenuItem value="LIDER DESARROLLO BI">LIDER DESARROLLO BI</MenuItem>
<MenuItem value="ANALISTA SEGUIMIENTO TUTELAS">ANALISTA SEGUIMIENTO TUTELAS</MenuItem>
<MenuItem value="ESPECIALISTA DE CONTRATACION RED DE PRESTADORES">ESPECIALISTA DE CONTRATACION RED DE PRESTADORES</MenuItem>
<MenuItem value="COORDINADOR AUDITORIA CUENTAS MEDICAS">COORDINADOR AUDITORIA CUENTAS MEDICAS</MenuItem>
<MenuItem value="AGENTE INTERVENTOR">AGENTE INTERVENTOR</MenuItem>
<MenuItem value="CONSULTOR DE SOLUCIONES SENIOR">CONSULTOR DE SOLUCIONES SENIOR</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA EN MEDICINA LABORAL">MEDICO ESPECIALISTA EN MEDICINA LABORAL</MenuItem>
<MenuItem value="AUXILIAR DE CONSULTA MEDICINA LABORAL">AUXILIAR DE CONSULTA MEDICINA LABORAL</MenuItem>
<MenuItem value="ANALISTA DE OPERACIONES">ANALISTA DE OPERACIONES</MenuItem>
<MenuItem value="ANALISTA DE APLICACIONES SERVICIOS MEDICOS">ANALISTA DE APLICACIONES SERVICIOS MEDICOS</MenuItem>
<MenuItem value="COORDINADOR COMERCIAL EPS">COORDINADOR COMERCIAL EPS</MenuItem>
<MenuItem value="ASESOR DE SALUD MENTAL">ASESOR DE SALUD MENTAL</MenuItem>
<MenuItem value="VICEPRESIDENTE DE RIESGO EN SALUD">VICEPRESIDENTE DE RIESGO EN SALUD</MenuItem>
<MenuItem value="GESTOR DE ESTADISTICA">GESTOR DE ESTADISTICA</MenuItem>
<MenuItem value="SECRETARIA EJECUTIVA PRESIDENCIA">SECRETARIA EJECUTIVA PRESIDENCIA</MenuItem>
<MenuItem value="AUXILIAR DE SERVICIO AL AFILIADO">AUXILIAR DE SERVICIO AL AFILIADO</MenuItem>
<MenuItem value="GESTOR ADMINISTRATIVO DE SERVICIO">GESTOR ADMINISTRATIVO DE SERVICIO</MenuItem>
<MenuItem value="COORDINADOR GRABACION DE CUENTAS">COORDINADOR GRABACION DE CUENTAS</MenuItem>
<MenuItem value="AUXILIAR DE MEDICINA LABORAL">AUXILIAR DE MEDICINA LABORAL</MenuItem>
<MenuItem value="AUXILIAR DE TUTELAS">AUXILIAR DE TUTELAS</MenuItem>
<MenuItem value="DIRECTOR DE AUTORIZACION NO POS">DIRECTOR DE AUTORIZACION NO POS</MenuItem>
<MenuItem value="LIDER DE SOLUCIONES SISTEMAS DE INFORMACION">LIDER DE SOLUCIONES SISTEMAS DE INFORMACION</MenuItem>
<MenuItem value="SUPERVISOR DE RECOBROS">SUPERVISOR DE RECOBROS</MenuItem>
<MenuItem value="ASESOR CENTRAL DE LLAMADAS SENIOR II">ASESOR CENTRAL DE LLAMADAS SENIOR II</MenuItem>
<MenuItem value="SUPERVISOR DE RECAUDO">SUPERVISOR DE RECAUDO</MenuItem>
<MenuItem value="GESTOR OPERATIVO DE CONVENIOS">GESTOR OPERATIVO DE CONVENIOS</MenuItem>
<MenuItem value="PROFESIONAL DE INFORMACION ENTES TERRITORIALES">PROFESIONAL DE INFORMACION ENTES TERRITORIALES</MenuItem>
<MenuItem value="DIRECTOR DE GESTION CON ENTES TERRITORIALES">DIRECTOR DE GESTION CON ENTES TERRITORIALES</MenuItem>
<MenuItem value="MEDICO ASESOR DE ASUNTOS JUDICIALES Y TUTELAS">MEDICO ASESOR DE ASUNTOS JUDICIALES Y TUTELAS</MenuItem>
<MenuItem value="GESTOR OPERATIVO SENIOR">GESTOR OPERATIVO SENIOR</MenuItem>
<MenuItem value="AUXILIAR DE RECOBRO I">AUXILIAR DE RECOBRO I</MenuItem>
<MenuItem value="GESTOR DE CAMPA A">GESTOR DE CAMPA A</MenuItem>
<MenuItem value="GERENTE GESTION DE LA DEMANDA">GERENTE GESTION DE LA DEMANDA</MenuItem>
<MenuItem value="COORDINADOR DE CANAL NO PRESENCIAL">COORDINADOR DE CANAL NO PRESENCIAL</MenuItem>
<MenuItem value="ANALISTA JUNIOR DE TESORERIA">ANALISTA JUNIOR DE TESORERIA</MenuItem>
<MenuItem value="GERENTE DE MEDICAMENTOS">GERENTE DE MEDICAMENTOS</MenuItem>
<MenuItem value="PROFESIONAL COHORTE DE RIESGO">PROFESIONAL COHORTE DE RIESGO</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA PSIQUIATRA DE APOYO">MEDICO ESPECIALISTA PSIQUIATRA DE APOYO</MenuItem>
<MenuItem value="AUXILIAR DE CONVENIOS Y TARIFAS">AUXILIAR DE CONVENIOS Y TARIFAS</MenuItem>
<MenuItem value="SUPERVISOR COMUNITARIO Y SOCIAL REGIONAL">SUPERVISOR COMUNITARIO Y SOCIAL REGIONAL</MenuItem>
<MenuItem value="COORDINADOR NACIONAL DE REFERENCIA Y CONTRARREFERENCIA">COORDINADOR NACIONAL DE REFERENCIA Y CONTRARREFERENCIA</MenuItem>
<MenuItem value="MONITOR DE CALIDAD REFERENCIA Y CONTRAREFERENCIA">MONITOR DE CALIDAD REFERENCIA Y CONTRAREFERENCIA</MenuItem>
<MenuItem value="ESPECIALISTA ALTO COSTO">ESPECIALISTA ALTO COSTO</MenuItem>
<MenuItem value="COORDINADOR DE CONCILIACIONES">COORDINADOR DE CONCILIACIONES</MenuItem>
<MenuItem value="ASESOR CENTRAL DE LLAMADAS SENIOR I">ASESOR CENTRAL DE LLAMADAS SENIOR I</MenuItem>
<MenuItem value="AUXILIAR DE GESTION DE CARTERA">AUXILIAR DE GESTION DE CARTERA</MenuItem>
<MenuItem value="ANALISTA GESTION DE INFORMACION">ANALISTA GESTION DE INFORMACION</MenuItem>
<MenuItem value="GESTION DE CITAS INTRAHOSPITALARIAS">GESTION DE CITAS INTRAHOSPITALARIAS</MenuItem>
<MenuItem value="LIDER DE OPERACIONES">LIDER DE OPERACIONES</MenuItem>
<MenuItem value="ANALISTA ECONOMICO DE RIESGOS">ANALISTA ECONOMICO DE RIESGOS</MenuItem>
<MenuItem value="AUXILIAR DE RECOBRO II">AUXILIAR DE RECOBRO II</MenuItem>
<MenuItem value="LIDER MEDICO DE COHORTES CRITICAS">LIDER MEDICO DE COHORTES CRITICAS</MenuItem>
<MenuItem value="COORDINADOR CADENA DE SUMINISTROS">COORDINADOR CADENA DE SUMINISTROS</MenuItem>
<MenuItem value="ANALISTA COMUNITARIO">ANALISTA COMUNITARIO</MenuItem>
<MenuItem value="COORDINADOR DE MEDICAMENTOS">COORDINADOR DE MEDICAMENTOS</MenuItem>
<MenuItem value="GERENTE DE CONVENIOS">GERENTE DE CONVENIOS</MenuItem>
<MenuItem value="LIDER MEDICO DE COHORTES DE HEMOFILIA Y ARTRITIS">LIDER MEDICO DE COHORTES DE HEMOFILIA Y ARTRITIS</MenuItem>
<MenuItem value="AUXILIAR SERVICIOS MEDICOS">AUXILIAR SERVICIOS MEDICOS</MenuItem>
<MenuItem value="DIRECTOR DE HUMANIZACION">DIRECTOR DE HUMANIZACION</MenuItem>
<MenuItem value="ANALISTA OPERATIVO DE RIESGOS">ANALISTA OPERATIVO DE RIESGOS</MenuItem>
<MenuItem value="DIRECTOR DE PRODUCTO">DIRECTOR DE PRODUCTO</MenuItem>
<MenuItem value="LIDER ADMINISTRATIVO">LIDER ADMINISTRATIVO</MenuItem>
<MenuItem value="AUXILIAR VALIDACION DE DERECHOS">AUXILIAR VALIDACION DE DERECHOS</MenuItem>
<MenuItem value="PRESIDENTE EPS">PRESIDENTE EPS</MenuItem>
<MenuItem value="AUXILIAR DE CORRESPONDENCIA I">AUXILIAR DE CORRESPONDENCIA I</MenuItem>
<MenuItem value="ASESOR EN BIOETICA">ASESOR EN BIOETICA</MenuItem>
<MenuItem value="DIRECTOR EVALUACION DE TECNOLOGIAS Y TRANSFERENCIA DE CONOCIMIENTO">DIRECTOR EVALUACION DE TECNOLOGIAS Y TRANSFERENCIA DE CONOCIMIENTO</MenuItem>
<MenuItem value="VICEPRESIDENTE DE OPERACIONES EPS">VICEPRESIDENTE DE OPERACIONES EPS</MenuItem>
<MenuItem value="DIRECTOR DE COMPRAS DE SUMINISTROS">DIRECTOR DE COMPRAS DE SUMINISTROS</MenuItem>
<MenuItem value="SUBGERENTE REGIONAL EPS">SUBGERENTE REGIONAL EPS</MenuItem>
<MenuItem value="DIRECTOR DE EXPERIENCIA CANALES DE SERVICIO">DIRECTOR DE EXPERIENCIA CANALES DE SERVICIO</MenuItem>
<MenuItem value="COORDINADOR EVALUACION DE TECNOLOGIAS Y TRANSFERENCIA DE CONOCIMIENTO">COORDINADOR EVALUACION DE TECNOLOGIAS Y TRANSFERENCIA DE CONOCIMIENTO</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE HOSPITALIZACION BASICA">DIRECTOR NACIONAL DE HOSPITALIZACION BASICA</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE MODELOS DE CONTRATACION">DIRECTOR NACIONAL DE MODELOS DE CONTRATACION</MenuItem>
<MenuItem value="ANALISTA DE APLICACIONES SENIOR II">ANALISTA DE APLICACIONES SENIOR II</MenuItem>
<MenuItem value="ANALISTA DE VINCULACION">ANALISTA DE VINCULACION</MenuItem>
<MenuItem value="GERENTE DE GESTION NO PBS">GERENTE DE GESTION NO PBS</MenuItem>
<MenuItem value="DIRECTOR DE DISE O ORGANIZACIONAL">DIRECTOR DE DISE O ORGANIZACIONAL</MenuItem>
<MenuItem value="PROFESIONAL DE ALTO COSTO">PROFESIONAL DE ALTO COSTO</MenuItem>
<MenuItem value="ANALISTA OPERATIVO I">ANALISTA OPERATIVO I</MenuItem>
<MenuItem value="SUPERVISOR OPERATIVO DE REFERENCIA Y CONTRAREFERENCIA">SUPERVISOR OPERATIVO DE REFERENCIA Y CONTRAREFERENCIA</MenuItem>
<MenuItem value="COORDINADOR MOVILIDAD">COORDINADOR MOVILIDAD</MenuItem>
<MenuItem value="AUXILIAR DE COMPENSACION">AUXILIAR DE COMPENSACION</MenuItem>
<MenuItem value="SUBGERENTE DE PROGRAMAS DE CRONICIDAD">SUBGERENTE DE PROGRAMAS DE CRONICIDAD</MenuItem>
<MenuItem value="ABOGADO TUTELAS I">ABOGADO TUTELAS I</MenuItem>
<MenuItem value="LIDER DE EDUCACION Y ADHERENCIA">LIDER DE EDUCACION Y ADHERENCIA</MenuItem>
<MenuItem value="GERENTE ATENCION PRIMARIA EN SALUD">GERENTE ATENCION PRIMARIA EN SALUD</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE REFERENCIA">DIRECTOR NACIONAL DE REFERENCIA</MenuItem>
<MenuItem value="LIDER DE COMUNICACIONES">LIDER DE COMUNICACIONES</MenuItem>
<MenuItem value="ASESOR DE CUIDADO INTENSIVO ADULTO">ASESOR DE CUIDADO INTENSIVO ADULTO</MenuItem>
<MenuItem value="COORDINADOR NACIONAL DE ENFOQUE SOCIO COMUNITARIO">COORDINADOR NACIONAL DE ENFOQUE SOCIO COMUNITARIO</MenuItem>
<MenuItem value="SUBGERENTE DE GESTION CANCER Y ENFERMEDADES HUERFANAS">SUBGERENTE DE GESTION CANCER Y ENFERMEDADES HUERFANAS</MenuItem>
<MenuItem value="VICEPRESIDENTE EJECUTIVO">VICEPRESIDENTE EJECUTIVO</MenuItem>
<MenuItem value="COORDINADOR DE RECOBROS">COORDINADOR DE RECOBROS</MenuItem>
<MenuItem value="DIRECTOR DE GESTION COMUNITARIA">DIRECTOR DE GESTION COMUNITARIA</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE PRESTACION HOSPITALARIA">DIRECTOR NACIONAL DE PRESTACION HOSPITALARIA</MenuItem>
<MenuItem value="DIRECTOR DE COMPRAS DE MEDICAMENTOS">DIRECTOR DE COMPRAS DE MEDICAMENTOS</MenuItem>
<MenuItem value="GERENTE DE BUSINESS PARTNER ASEGURAMIENTO BASICO Y PUBLICO PRIVADO">GERENTE DE BUSINESS PARTNER ASEGURAMIENTO BASICO Y PUBLICO PRIVADO</MenuItem>
<MenuItem value="ASISTENTE PRESTACIONES ECONOMICAS">ASISTENTE PRESTACIONES ECONOMICAS</MenuItem>
<MenuItem value="ABOGADO ASUNTOS TRIBUTARIOS">ABOGADO ASUNTOS TRIBUTARIOS</MenuItem>
<MenuItem value="DIRECTOR DE GESTION Y EVALUACION CRITICA DE CUENTAS DE ALTO COSTO">DIRECTOR DE GESTION Y EVALUACION CRITICA DE CUENTAS DE ALTO COSTO</MenuItem>
<MenuItem value="GESTOR DE INFORMACION Y ANALITICA">GESTOR DE INFORMACION Y ANALITICA</MenuItem>
<MenuItem value="GERENTE DE ANALITICA Y GESTION DE LA INFORMACION">GERENTE DE ANALITICA Y GESTION DE LA INFORMACION</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO ATEP">AUXILIAR OPERATIVO ATEP</MenuItem>
<MenuItem value="SUBGERENTE DE ALTO COSTO">SUBGERENTE DE ALTO COSTO</MenuItem>
<MenuItem value="ASESOR DE ATENCION AL USUARIO DE EPS">ASESOR DE ATENCION AL USUARIO DE EPS</MenuItem>
<MenuItem value="LIDER DE OPERACIONES EPS">LIDER DE OPERACIONES EPS</MenuItem>
<MenuItem value="ASESOR FINANCIERO">ASESOR FINANCIERO</MenuItem>
<MenuItem value="DIRECTOR DE ATENCION PRIMARIA">DIRECTOR DE ATENCION PRIMARIA</MenuItem>
<MenuItem value="COORDINADOR DE GESTION DE APORTES">COORDINADOR DE GESTION DE APORTES</MenuItem>
<MenuItem value="ASESOR CIENTIFICO ONCOLOGICO">ASESOR CIENTIFICO ONCOLOGICO</MenuItem>
<MenuItem value="ANALISTA DE MEDICAMENTOS SENIOR">ANALISTA DE MEDICAMENTOS SENIOR</MenuItem>
<MenuItem value="DIRECTOR MEDICO PLANES ESPECIALES">DIRECTOR MEDICO PLANES ESPECIALES</MenuItem>
<MenuItem value="ANALISTA DE ATENCION AL USUARIO">ANALISTA DE ATENCION AL USUARIO</MenuItem>
<MenuItem value="COORDINADOR NACIONAL DE OFICINAS">COORDINADOR NACIONAL DE OFICINAS</MenuItem>
<MenuItem value="ANALISTA DE COMPLIANCE I">ANALISTA DE COMPLIANCE I</MenuItem>
<MenuItem value="COORDINADOR REGIONAL PRESTACIONES ECONOMICAS">COORDINADOR REGIONAL PRESTACIONES ECONOMICAS</MenuItem>
<MenuItem value="VICEPRESIDENTE DE SALUD EPS">VICEPRESIDENTE DE SALUD EPS</MenuItem>
<MenuItem value="CONSULTOR DE PROYECTOS DE SERVICIO">CONSULTOR DE PROYECTOS DE SERVICIO</MenuItem>
<MenuItem value="COORDINADOR CONVENIOS Y TARIFAS EPS">COORDINADOR CONVENIOS Y TARIFAS EPS</MenuItem>
<MenuItem value="DIRECTOR GRABACION DE CUENTAS MEDICAS">DIRECTOR GRABACION DE CUENTAS MEDICAS</MenuItem>
<MenuItem value="ANALISTA DE TRASLADOS INTERCIUDADES">ANALISTA DE TRASLADOS INTERCIUDADES</MenuItem>
<MenuItem value="ESPECIALISTA PRESTACION DEL SERVICIO EPS">ESPECIALISTA PRESTACION DEL SERVICIO EPS</MenuItem>
<MenuItem value="GESTION DE TRASLADO DE REFERENCIA Y CONTRAREFERENCIA">GESTION DE TRASLADO DE REFERENCIA Y CONTRAREFERENCIA</MenuItem>
<MenuItem value="ANALISTA DE FIDELIZACION">ANALISTA DE FIDELIZACION</MenuItem>
<MenuItem value="GESTOR JURIDICO">GESTOR JURIDICO</MenuItem>
<MenuItem value="ANALISTA DE SERVICIO">ANALISTA DE SERVICIO</MenuItem>
<MenuItem value="GERENTE DE AUDITORIA">GERENTE DE AUDITORIA</MenuItem>
<MenuItem value="TECNICO DE COMUNICACIONES I">TECNICO DE COMUNICACIONES I</MenuItem>
<MenuItem value="ANALISTA SENIOR DE FORMACION VIRTUAL">ANALISTA SENIOR DE FORMACION VIRTUAL</MenuItem>
<MenuItem value="VICEPRESIDENTE DE CONTROL">VICEPRESIDENTE DE CONTROL</MenuItem>
<MenuItem value="EJECUTIVO DE ESTRATEGIAS COMERCIALES">EJECUTIVO DE ESTRATEGIAS COMERCIALES</MenuItem>
<MenuItem value="DIRECTOR MEDICINA LABORAL E INCAPACIDADES">DIRECTOR MEDICINA LABORAL E INCAPACIDADES</MenuItem>
<MenuItem value="DIRECTOR EVALUACION Y SEGUIMIENTO A RED">DIRECTOR EVALUACION Y SEGUIMIENTO A RED</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE ODONTOLOGIA">DIRECTOR NACIONAL DE ODONTOLOGIA</MenuItem>
<MenuItem value="ASESOR CENTRAL DE LLAMADAS JUNIOR I">ASESOR CENTRAL DE LLAMADAS JUNIOR I</MenuItem>
<MenuItem value="ANALISTA DE CONVENIOS Y TARIFAS I">ANALISTA DE CONVENIOS Y TARIFAS I</MenuItem>
<MenuItem value="COORDINADOR MEDICO UAP DE APOYO">COORDINADOR MEDICO UAP DE APOYO</MenuItem>
<MenuItem value="ADMINISTRADOR DIRECCIONAMIENTO OPORTUNIDAD CX">ADMINISTRADOR DIRECCIONAMIENTO OPORTUNIDAD CX</MenuItem>
<MenuItem value="DIRECTOR DE COMPRAS DE SERVICIOS OPERACIONALES">DIRECTOR DE COMPRAS DE SERVICIOS OPERACIONALES</MenuItem>
<MenuItem value="SUBDIRECTOR ADMINISTRATIVO">SUBDIRECTOR ADMINISTRATIVO</MenuItem>
<MenuItem value="GERENTE DE GESTION DEL RIESGO INDIVIDUAL EN SALUD">GERENTE DE GESTION DEL RIESGO INDIVIDUAL EN SALUD</MenuItem>
<MenuItem value="ANALISTA ESTADISTICA SERVICIOS MEDICOS">ANALISTA ESTADISTICA SERVICIOS MEDICOS</MenuItem>
<MenuItem value="MEDICO COORDINADOR DE REFERENCIA">MEDICO COORDINADOR DE REFERENCIA</MenuItem>
<MenuItem value="SUBGERENTE DE OPERACIONES EN SALUD">SUBGERENTE DE OPERACIONES EN SALUD</MenuItem>
<MenuItem value="SUBGERENTE DE OPERACIONES NO POS">SUBGERENTE DE OPERACIONES NO POS</MenuItem>
<MenuItem value="DIRECTOR DE POBLACIONES ESPECIALES">DIRECTOR DE POBLACIONES ESPECIALES</MenuItem>
<MenuItem value="DIRECTOR REGIONAL DE SERVICIOS MEDICOS">DIRECTOR REGIONAL DE SERVICIOS MEDICOS</MenuItem>
<MenuItem value="DIRECTOR MEDICO PROGRAMA ATENCION EXTRAMURAL">DIRECTOR MEDICO PROGRAMA ATENCION EXTRAMURAL</MenuItem>
<MenuItem value="SUPERNUMERARIO AUXILIAR EXPEDICION VOLANTES">SUPERNUMERARIO AUXILIAR EXPEDICION VOLANTES</MenuItem>
<MenuItem value="SUBGERENTE REGIONAL CENTRO ORIENTE">SUBGERENTE REGIONAL CENTRO ORIENTE</MenuItem>
<MenuItem value="LIDER DE GESTION DOCUMENTAL">LIDER DE GESTION DOCUMENTAL</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO SERVICIO">AUXILIAR OPERATIVO SERVICIO</MenuItem>
<MenuItem value="DIRECTOR MEDICO NACIONAL DE CENTROS MEDICOS">DIRECTOR MEDICO NACIONAL DE CENTROS MEDICOS</MenuItem>
<MenuItem value="GERENTE DE SERVICIO">GERENTE DE SERVICIO</MenuItem>
<MenuItem value="DIRECTOR DE CANAL NO PRESENCIAL">DIRECTOR DE CANAL NO PRESENCIAL</MenuItem>
<MenuItem value="ASESOR INTEGRAL PLANES ESPECIALES">ASESOR INTEGRAL PLANES ESPECIALES</MenuItem>
<MenuItem value="DIRECTOR DE CANAL SERVICIO A PRESTADORES">DIRECTOR DE CANAL SERVICIO A PRESTADORES</MenuItem>
<MenuItem value="GESTOR DE SEGUIMIENTO">GESTOR DE SEGUIMIENTO</MenuItem>
<MenuItem value="GERENTE MEDICO REGIONAL BOGOTA EPS">GERENTE MEDICO REGIONAL BOGOTA EPS</MenuItem>
<MenuItem value="AUXILIAR DE ENFERMERIA DE ALTO COSTO">AUXILIAR DE ENFERMERIA DE ALTO COSTO</MenuItem>
<MenuItem value="ANALISTA DE GESTION EN SALUD I">ANALISTA DE GESTION EN SALUD I</MenuItem>
<MenuItem value="EJECUTIVO OPERATIVO DE INFORMACION Y AFILIACION">EJECUTIVO OPERATIVO DE INFORMACION Y AFILIACION</MenuItem>
<MenuItem value="GERENTE DE MEJORA">GERENTE DE MEJORA</MenuItem>
<MenuItem value="GESTOR OPERATIVO SALUD Y SEGURIDAD EN EL TRABAJO">GESTOR OPERATIVO SALUD Y SEGURIDAD EN EL TRABAJO</MenuItem>
<MenuItem value="ANALISTA DE OPERACIONES I">ANALISTA DE OPERACIONES I</MenuItem>
<MenuItem value="VICEPRESIDENTE DE RELACIONES INSTITUCIONALES">VICEPRESIDENTE DE RELACIONES INSTITUCIONALES</MenuItem>
<MenuItem value="GERENTE DE OPERACION DE CANALES EPS">GERENTE DE OPERACION DE CANALES EPS</MenuItem>
<MenuItem value="CONTRALOR MEDICO REGIONAL CENTRO ORIENTE">CONTRALOR MEDICO REGIONAL CENTRO ORIENTE</MenuItem>
<MenuItem value="COORDINADOR ADMINISTRATIVO REGIMEN SUBSIDIADO">COORDINADOR ADMINISTRATIVO REGIMEN SUBSIDIADO</MenuItem>
<MenuItem value="GESTOR DE INFORMACION DE APOYO">GESTOR DE INFORMACION DE APOYO</MenuItem>
<MenuItem value="ASESOR SENIOR SISTEMAS DE INFORMACION">ASESOR SENIOR SISTEMAS DE INFORMACION</MenuItem>
<MenuItem value="DIRECTOR MODELO">DIRECTOR MODELO</MenuItem>
<MenuItem value="COORDINADOR MEDICO TELEORIENTACION">COORDINADOR MEDICO TELEORIENTACION</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE CONTRATACION DE RED">DIRECTOR NACIONAL DE CONTRATACION DE RED</MenuItem>
<MenuItem value="ASESOR DE CUIDADO INTENSIVO NEONATAL">ASESOR DE CUIDADO INTENSIVO NEONATAL</MenuItem>
<MenuItem value="DIRECTOR COMERCIAL CANAL EXTERNO">DIRECTOR COMERCIAL CANAL EXTERNO</MenuItem>
<MenuItem value="DISTANCIADOR">DISTANCIADOR</MenuItem>
<MenuItem value="VICEPRESIDENTE ADMINISTRATIVO Y FINANCIERO DE EPS">VICEPRESIDENTE ADMINISTRATIVO Y FINANCIERO DE EPS</MenuItem>
<MenuItem value="AUXILIAR DE RECOBRO">AUXILIAR DE RECOBRO</MenuItem>
<MenuItem value="COORDINADOR OPERATIVO DE RED DE PRESTADORES">COORDINADOR OPERATIVO DE RED DE PRESTADORES</MenuItem>
<MenuItem value="INGENIERO DE DATOS">INGENIERO DE DATOS</MenuItem>
<MenuItem value="EJECUTIVO OPERATIVO POST-VENTA">EJECUTIVO OPERATIVO POST-VENTA</MenuItem>
<MenuItem value="PRESIDENTE GRUPO INTEGRAL DE SALUD EPS">PRESIDENTE GRUPO INTEGRAL DE SALUD EPS</MenuItem>
<MenuItem value="AUXILIAR GESTION DE OFERTA">AUXILIAR GESTION DE OFERTA</MenuItem>
<MenuItem value="COORDINADOR NACIONAL DE PRESTACIONES ECONOMICAS">COORDINADOR NACIONAL DE PRESTACIONES ECONOMICAS</MenuItem>
<MenuItem value="COORDINADOR DE SERVICIO ADMINISTRATIVO">COORDINADOR DE SERVICIO ADMINISTRATIVO</MenuItem>
<MenuItem value="AUXILIAR EXPEDICION DE VOLANTES DE APOYO">AUXILIAR EXPEDICION DE VOLANTES DE APOYO</MenuItem>
<MenuItem value="ESPECIALISTA SIAM BDUA">ESPECIALISTA SIAM BDUA</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO COMERCIAL I">AUXILIAR OPERATIVO COMERCIAL I</MenuItem>
<MenuItem value="COORDINADOR DE PROYECTOS I">COORDINADOR DE PROYECTOS I</MenuItem>
<MenuItem value="COORDINADOR DE PROGRAMAS DE SALUD">COORDINADOR DE PROGRAMAS DE SALUD</MenuItem>
<MenuItem value="GERENTE PLANEACION DE ASEGURAMIENTO">GERENTE PLANEACION DE ASEGURAMIENTO</MenuItem>
<MenuItem value="SUBGERENTE PLANEACION FINANCIERA EPS">SUBGERENTE PLANEACION FINANCIERA EPS</MenuItem>
<MenuItem value="DIRECTOR DE PROCESOS I">DIRECTOR DE PROCESOS I</MenuItem>
<MenuItem value="ASESOR TECNICO CIENTIFICO">ASESOR TECNICO CIENTIFICO</MenuItem>
<MenuItem value="ASESOR LEGAL">ASESOR LEGAL</MenuItem>
<MenuItem value="COORDINADOR DE FIDELIZACION">COORDINADOR DE FIDELIZACION</MenuItem>
<MenuItem value="DIRECTOR PARTICIPACION CIUDADANA">DIRECTOR PARTICIPACION CIUDADANA</MenuItem>
<MenuItem value="DIRECTOR DE MODELO DE ATENCION">DIRECTOR DE MODELO DE ATENCION</MenuItem>
<MenuItem value="DIRECTOR MEDICO DE APOYO">DIRECTOR MEDICO DE APOYO</MenuItem>
<MenuItem value="LIDER DE GESTION DE INFORMACION REGIONALES">LIDER DE GESTION DE INFORMACION REGIONALES</MenuItem>
<MenuItem value="GESTOR OPERATIVO DE SERVICIOS MEDICOS">GESTOR OPERATIVO DE SERVICIOS MEDICOS</MenuItem>
<MenuItem value="ANALISTA DE INFORMACION CONVENIOS Y TARIFAS">ANALISTA DE INFORMACION CONVENIOS Y TARIFAS</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO COMERCIAL">AUXILIAR OPERATIVO COMERCIAL</MenuItem>
<MenuItem value="ANALISTA DE CIUDADES COMPASIVAS">ANALISTA DE CIUDADES COMPASIVAS</MenuItem>
<MenuItem value="PROMOTOR COMUNITARIO">PROMOTOR COMUNITARIO</MenuItem>
<MenuItem value="ASISTENTE ADMINISTRATIVO Y FINANCIERO">ASISTENTE ADMINISTRATIVO Y FINANCIERO</MenuItem>
<MenuItem value="ANALISTA DE PROGRAMAS SOCIALES">ANALISTA DE PROGRAMAS SOCIALES</MenuItem>
<MenuItem value="ANALISTA DE REDES COMUNITARIAS">ANALISTA DE REDES COMUNITARIAS</MenuItem>
<MenuItem value="COORDINADOR DE GESTION">COORDINADOR DE GESTION</MenuItem>
<MenuItem value="DIRECTOR EJECUTIVO">DIRECTOR EJECUTIVO</MenuItem>
<MenuItem value="DIRECTOR PROGRAMA COMUNITARIO">DIRECTOR PROGRAMA COMUNITARIO</MenuItem>
<MenuItem value="DOCENTE DE POSTGRADO">DOCENTE DE POSTGRADO</MenuItem>
<MenuItem value="TUTOR CLINICO MEDICINA">TUTOR CLINICO MEDICINA</MenuItem>
<MenuItem value="INSTRUCTOR ASOCIADO">INSTRUCTOR ASOCIADO</MenuItem>
<MenuItem value="FACILITADOR">FACILITADOR</MenuItem>
<MenuItem value="LIDER INSTITUCIONAL DE AUTOEVALUACION">LIDER INSTITUCIONAL DE AUTOEVALUACION</MenuItem>
<MenuItem value="PROFESOR ELECTIVA BALONCESTO">PROFESOR ELECTIVA BALONCESTO</MenuItem>
<MenuItem value="EXPERTO EN PATOLOGIA">EXPERTO EN PATOLOGIA</MenuItem>
<MenuItem value="EXPERTO DE ANATOMIA">EXPERTO DE ANATOMIA</MenuItem>
<MenuItem value="GESTOR DE ESTUDIOS CLINICOS LABORATORIO">GESTOR DE ESTUDIOS CLINICOS LABORATORIO</MenuItem>
<MenuItem value="ANALISTA ADMINISTRATIVO INSTITUTO DE INVESTIGACION">ANALISTA ADMINISTRATIVO INSTITUTO DE INVESTIGACION</MenuItem>
<MenuItem value="INSTRUCTOR ASISTENTE">INSTRUCTOR ASISTENTE</MenuItem>
<MenuItem value="PROFESOR ASISTENTE">PROFESOR ASISTENTE</MenuItem>
<MenuItem value="DOCENTE FACILITADOR">DOCENTE FACILITADOR</MenuItem>
<MenuItem value="ANALISTA DE MARKETING UNIVERSIDAD">ANALISTA DE MARKETING UNIVERSIDAD</MenuItem>
<MenuItem value="GESTOR DE ESTUDIOS CLINICOS">GESTOR DE ESTUDIOS CLINICOS</MenuItem>
<MenuItem value="AUXILIAR DE ATENCION AL ESTUDIANTE">AUXILIAR DE ATENCION AL ESTUDIANTE</MenuItem>
<MenuItem value="AUXILIAR DE BIBLIOTECA JUNIOR">AUXILIAR DE BIBLIOTECA JUNIOR</MenuItem>
<MenuItem value="GESTOR SENIOR DE ESTUDIOS CLINICOS">GESTOR SENIOR DE ESTUDIOS CLINICOS</MenuItem>
<MenuItem value="COORDINADOR MEDICO DE INVESTIGACION CLINICA">COORDINADOR MEDICO DE INVESTIGACION CLINICA</MenuItem>
<MenuItem value="PROFESIONAL GESTION DOCUMENTAL">PROFESIONAL GESTION DOCUMENTAL</MenuItem>
<MenuItem value="DIRECTOR DE VINCULACION-SECTOR EXTERNO">DIRECTOR DE VINCULACION-SECTOR EXTERNO</MenuItem>
<MenuItem value="PROFESOR ASOCIADO">PROFESOR ASOCIADO</MenuItem>
<MenuItem value="EXPERTO">EXPERTO</MenuItem>
<MenuItem value="COORDINADOR DE DEPORTES">COORDINADOR DE DEPORTES</MenuItem>
<MenuItem value="AUXILIAR DE VINCULACION SECTOR EXTERNO">AUXILIAR DE VINCULACION SECTOR EXTERNO</MenuItem>
<MenuItem value="DOCENTE TALLER ARTE URBANO Y VISUALES">DOCENTE TALLER ARTE URBANO Y VISUALES</MenuItem>
<MenuItem value="EXPERTO EN SEMIOLOGIA">EXPERTO EN SEMIOLOGIA</MenuItem>
<MenuItem value="PROFESOR FORMACION EN SEGUNDA LENGUA">PROFESOR FORMACION EN SEGUNDA LENGUA</MenuItem>
<MenuItem value="INVESTIGADOR">INVESTIGADOR</MenuItem>
<MenuItem value="PROFESOR - LECTURA Y ESCRITURA">PROFESOR - LECTURA Y ESCRITURA</MenuItem>
<MenuItem value="EXPERTO EN CUIDADOS PALIATIVOS">EXPERTO EN CUIDADOS PALIATIVOS</MenuItem>
<MenuItem value="RECTOR">RECTOR</MenuItem>
<MenuItem value="FACILITADOR SIMULACIONES CLINICAS">FACILITADOR SIMULACIONES CLINICAS</MenuItem>
<MenuItem value="ANALISTA ESTUDIOS CLINICOS">ANALISTA ESTUDIOS CLINICOS</MenuItem>
<MenuItem value="GESTOR DE SALUD PUBLICA">GESTOR DE SALUD PUBLICA</MenuItem>
<MenuItem value="PROFESOR TITULAR">PROFESOR TITULAR</MenuItem>
<MenuItem value="PROFESOR DE MUSICA">PROFESOR DE MUSICA</MenuItem>
<MenuItem value="JOVEN INVESTIGADOR">JOVEN INVESTIGADOR</MenuItem>
<MenuItem value="DIRECTOR BIENESTAR">DIRECTOR BIENESTAR</MenuItem>
<MenuItem value="GESTOR DE POSTGRADOS">GESTOR DE POSTGRADOS</MenuItem>
<MenuItem value="EXPERTO EN BIOTECNOLOGIA">EXPERTO EN BIOTECNOLOGIA</MenuItem>
<MenuItem value="PROFESOR DANZAS">PROFESOR DANZAS</MenuItem>
<MenuItem value="EXPERTO EN INVESTIGACION">EXPERTO EN INVESTIGACION</MenuItem>
<MenuItem value="ARQUITECTO DE INFORMACION">ARQUITECTO DE INFORMACION</MenuItem>
<MenuItem value="EXPERTO EN MACROCURRICULO">EXPERTO EN MACROCURRICULO</MenuItem>
<MenuItem value="DECANO FACULTAD DE PSICOLOGIA">DECANO FACULTAD DE PSICOLOGIA</MenuItem>
<MenuItem value="ASISTENTE DE VICERRECTORIA">ASISTENTE DE VICERRECTORIA</MenuItem>
<MenuItem value="COORDINADOR EN SEGUNDA LENGUA">COORDINADOR EN SEGUNDA LENGUA</MenuItem>
<MenuItem value="AUXILIAR DE BIBLIOTECA">AUXILIAR DE BIBLIOTECA</MenuItem>
<MenuItem value="DIRECTOR DE POSTGRADOS">DIRECTOR DE POSTGRADOS</MenuItem>
<MenuItem value="AUXILIAR LOGISTICO">AUXILIAR LOGISTICO</MenuItem>
<MenuItem value="MEDICO DE ESTUDIOS CLINICOS">MEDICO DE ESTUDIOS CLINICOS</MenuItem>
<MenuItem value="AUXILIAR DE ESTUDIOS CLINICOS">AUXILIAR DE ESTUDIOS CLINICOS</MenuItem>
<MenuItem value="DOCENTE FACILITADOR FARMACOLOGIA">DOCENTE FACILITADOR FARMACOLOGIA</MenuItem>
<MenuItem value="ASESOR COMERCIAL PROGRAMAS ACADEMICOS">ASESOR COMERCIAL PROGRAMAS ACADEMICOS</MenuItem>
<MenuItem value="LIDER INSTITUCIONAL DE CALIDAD">LIDER INSTITUCIONAL DE CALIDAD</MenuItem>
<MenuItem value="PROFESOR ELECTIVA FUTBOL">PROFESOR ELECTIVA FUTBOL</MenuItem>
<MenuItem value="PROFESOR ELECTIVA VOLEIBALL">PROFESOR ELECTIVA VOLEIBALL</MenuItem>
<MenuItem value="AUXILIAR MANTENIMIENTO LABORATORIO">AUXILIAR MANTENIMIENTO LABORATORIO</MenuItem>
<MenuItem value="GESTOR DE GRADUADOS">GESTOR DE GRADUADOS</MenuItem>
<MenuItem value="GESTOR DE ENFERMERIA">GESTOR DE ENFERMERIA</MenuItem>
<MenuItem value="DISE ADOR DE MEDIOS EDUCATIVOS">DISE ADOR DE MEDIOS EDUCATIVOS</MenuItem>
<MenuItem value="GESTOR DE SALUD Y TRABAJO SOCIAL">GESTOR DE SALUD Y TRABAJO SOCIAL</MenuItem>
<MenuItem value="GESTOR DE PROYECTOS">GESTOR DE PROYECTOS</MenuItem>
<MenuItem value="LIDER DE ADMISIONES">LIDER DE ADMISIONES</MenuItem>
<MenuItem value="GESTOR SISTEMA DE INFORMACION I">GESTOR SISTEMA DE INFORMACION I</MenuItem>
<MenuItem value="GESTOR SISTEMA DE INFORMACION II">GESTOR SISTEMA DE INFORMACION II</MenuItem>
<MenuItem value="QUIMICO FARMACEUTICO DE ESTUDIOS CLINICO">QUIMICO FARMACEUTICO DE ESTUDIOS CLINICO</MenuItem>
<MenuItem value="DOCENTE LIDER DE AUTOEVALUACION Y CALIDAD - MEDICINA">DOCENTE LIDER DE AUTOEVALUACION Y CALIDAD - MEDICINA</MenuItem>
<MenuItem value="GESTOR DE EDUCACION CONTINUA Y PERMANENTE">GESTOR DE EDUCACION CONTINUA Y PERMANENTE</MenuItem>
<MenuItem value="PROFESOR DE PILATES">PROFESOR DE PILATES</MenuItem>
<MenuItem value="AUXILIAR LABORATORIO DE ANATOMIA">AUXILIAR LABORATORIO DE ANATOMIA</MenuItem>
<MenuItem value="COORDINADOR DE BIBLIOTECA">COORDINADOR DE BIBLIOTECA</MenuItem>
<MenuItem value="DIRECTOR DE PREGRADO">DIRECTOR DE PREGRADO</MenuItem>
<MenuItem value="EXPERTO ENFERMERIA COMUNITARIA">EXPERTO ENFERMERIA COMUNITARIA</MenuItem>
<MenuItem value="DIRECTOR UNIDAD DE INVESTIGACION">DIRECTOR UNIDAD DE INVESTIGACION</MenuItem>
<MenuItem value="PSICOLOGO BIENESTAR">PSICOLOGO BIENESTAR</MenuItem>
<MenuItem value="VICERRECTOR">VICERRECTOR</MenuItem>
<MenuItem value="COORDINADOR DE AUTOEVALUACION Y CALIDAD">COORDINADOR DE AUTOEVALUACION Y CALIDAD</MenuItem>
<MenuItem value="DECANO FACULTAD DE MEDICINA">DECANO FACULTAD DE MEDICINA</MenuItem>
<MenuItem value="ASESOR DE ATENCION AL ESTUDIANTE">ASESOR DE ATENCION AL ESTUDIANTE</MenuItem>
<MenuItem value="DIRECTOR DE ADMISION REGISTRO Y CONTROL">DIRECTOR DE ADMISION REGISTRO Y CONTROL</MenuItem>
<MenuItem value="GESTOR DE ADMISIONES">GESTOR DE ADMISIONES</MenuItem>
<MenuItem value="LIDER INSTITUCIONAL DE DOCENCIA">LIDER INSTITUCIONAL DE DOCENCIA</MenuItem>
<MenuItem value="ECONOMISTA EN SALUD">ECONOMISTA EN SALUD</MenuItem>
<MenuItem value="DIRECTOR DE ADMISIONES, REGISTRO, CONTROL ACADEMICO Y GRADUADOS">DIRECTOR DE ADMISIONES, REGISTRO, CONTROL ACADEMICO Y GRADUADOS</MenuItem>
<MenuItem value="LOGISTICA Y SERVICIO AL CLIENTE">LOGISTICA Y SERVICIO AL CLIENTE</MenuItem>
<MenuItem value="GESTOR DE INNOVACION">GESTOR DE INNOVACION</MenuItem>
<MenuItem value="COORDINADOR DE GESTION ADMINISTRATIVA">COORDINADOR DE GESTION ADMINISTRATIVA</MenuItem>
<MenuItem value="DOCENTE FACILITADOR EN MICROBIOLOGIA">DOCENTE FACILITADOR EN MICROBIOLOGIA</MenuItem>
<MenuItem value="ANALISTA DE PLANEACION ACADEMICA Y EVALUACION">ANALISTA DE PLANEACION ACADEMICA Y EVALUACION</MenuItem>
<MenuItem value="GESTOR DE ESTUDIOS CLINICOS EN FORMACION">GESTOR DE ESTUDIOS CLINICOS EN FORMACION</MenuItem>
<MenuItem value="PSICOLOGO BIENESTAR I">PSICOLOGO BIENESTAR I</MenuItem>
<MenuItem value="SECRETARIO GENERAL">SECRETARIO GENERAL</MenuItem>
<MenuItem value="DIRECTOR DE INSTITUTO DE SALUD Y GESTION SANITARIA">DIRECTOR DE INSTITUTO DE SALUD Y GESTION SANITARIA</MenuItem>
<MenuItem value="DIRECTOR DE SERVICIO Y GESTION DEL CAMBIO">DIRECTOR DE SERVICIO Y GESTION DEL CAMBIO</MenuItem>
<MenuItem value="EXPERTO DE FARMACOLOGIA">EXPERTO DE FARMACOLOGIA</MenuItem>
<MenuItem value="GESTOR DE PROYECCION SOCIAL">GESTOR DE PROYECCION SOCIAL</MenuItem>
<MenuItem value="DIRECTOR PREGRADO DE MEDICINA">DIRECTOR PREGRADO DE MEDICINA</MenuItem>
<MenuItem value="GESTOR DE PRACTICAS FORMATIVAS">GESTOR DE PRACTICAS FORMATIVAS</MenuItem>
<MenuItem value="LIDER DE TECNOLOGIA">LIDER DE TECNOLOGIA</MenuItem>
<MenuItem value="GESTOR DE POSTGRADOS I">GESTOR DE POSTGRADOS I</MenuItem>
<MenuItem value="COORDINADOR DE CONVENIO DOCENCIA SERVICIO E INTERNADO">COORDINADOR DE CONVENIO DOCENCIA SERVICIO E INTERNADO</MenuItem>
<MenuItem value="COORDINADOR PSICOLOGIA">COORDINADOR PSICOLOGIA</MenuItem>
<MenuItem value="PSICOLOGO CLINICO Y EDUCATIVO">PSICOLOGO CLINICO Y EDUCATIVO</MenuItem>
<MenuItem value="GESTOR DE PREGRADO">GESTOR DE PREGRADO</MenuItem>
<MenuItem value="DECANO FACULTAD DE ENFERMERIA">DECANO FACULTAD DE ENFERMERIA</MenuItem>
<MenuItem value="GESTOR REGULATORIO ESTUDIOS CLINICOS">GESTOR REGULATORIO ESTUDIOS CLINICOS</MenuItem>
<MenuItem value="PROCESS LEADER HAOU">PROCESS LEADER HAOU</MenuItem>
<MenuItem value="COORDINADOR DE GESTION DEL CONOCIMIENTO">COORDINADOR DE GESTION DEL CONOCIMIENTO</MenuItem>
<MenuItem value="ANALISTA SENIOR DE RESPONSABILIDAD">ANALISTA SENIOR DE RESPONSABILIDAD</MenuItem>
<MenuItem value="TECNICO SOPORTE SENIOR USA">TECNICO SOPORTE SENIOR USA</MenuItem>
<MenuItem value="SUBGERENTE DE COMPENSACION Y DISE O ORGANIZACIONAL">SUBGERENTE DE COMPENSACION Y DISE O ORGANIZACIONAL</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA HEALTH ANALYSIS AND OPTIMIZATION UNIT">MEDICO ESPECIALISTA HEALTH ANALYSIS AND OPTIMIZATION UNIT</MenuItem>
<MenuItem value="DIRECTOR DE MARKETING MEXICO">DIRECTOR DE MARKETING MEXICO</MenuItem>
<MenuItem value="PROFESIONAL DE CAPACITACION Y DESARROLLO PAISES">PROFESIONAL DE CAPACITACION Y DESARROLLO PAISES</MenuItem>
<MenuItem value="LIDER DE COMPRAS PAISES">LIDER DE COMPRAS PAISES</MenuItem>
<MenuItem value="ANALISTA DE DATOS SENIOR USA">ANALISTA DE DATOS SENIOR USA</MenuItem>
<MenuItem value="ANALISTA DE PRESUPUESTO USA">ANALISTA DE PRESUPUESTO USA</MenuItem>
<MenuItem value="ANALISTA DE RIESGOS USA">ANALISTA DE RIESGOS USA</MenuItem>
<MenuItem value="ANALISTA DE SUSCRIPCION DE COTIZACIONES">ANALISTA DE SUSCRIPCION DE COTIZACIONES</MenuItem>
<MenuItem value="LIDER GESTION TRIBUTARIA PAISES">LIDER GESTION TRIBUTARIA PAISES</MenuItem>
<MenuItem value="LIDER DE CONTABILIDAD PAISES">LIDER DE CONTABILIDAD PAISES</MenuItem>
<MenuItem value="ESPECIALISTA DE COMUNICACIONES INTERNAS PAISES">ESPECIALISTA DE COMUNICACIONES INTERNAS PAISES</MenuItem>
<MenuItem value="VICEPRESIDENTE ECONOMICO FINANCIERO SENIOR">VICEPRESIDENTE ECONOMICO FINANCIERO SENIOR</MenuItem>
<MenuItem value="SUBGERENTE DE SOPORTE">SUBGERENTE DE SOPORTE</MenuItem>
<MenuItem value="DIRECTOR DE PROYECTOS">DIRECTOR DE PROYECTOS</MenuItem>
<MenuItem value="PROFESIONAL DE ANALITICA DESARROLLO HUMANO">PROFESIONAL DE ANALITICA DESARROLLO HUMANO</MenuItem>
<MenuItem value="VICEPRESIDENTE DE INFRAESTRUCTURA FISICA">VICEPRESIDENTE DE INFRAESTRUCTURA FISICA</MenuItem>
<MenuItem value="DIRECTOR FINANCIERO DE SERVICIOS COMPARTIDOS USA">DIRECTOR FINANCIERO DE SERVICIOS COMPARTIDOS USA</MenuItem>
<MenuItem value="GERENTE DE ACTUARIA">GERENTE DE ACTUARIA</MenuItem>
<MenuItem value="COORDINADOR DE CUENTAS POR PAGAR USA">COORDINADOR DE CUENTAS POR PAGAR USA</MenuItem>
<MenuItem value="LIDER DE PRODUCTO">LIDER DE PRODUCTO</MenuItem>
<MenuItem value="ANALISTA DE REPORTES">ANALISTA DE REPORTES</MenuItem>
<MenuItem value="INVESTIGADOR PROYECTO SAFE I">INVESTIGADOR PROYECTO SAFE I</MenuItem>
<MenuItem value="VICEPRESIDENTE DE OPERACIONES Y GESTION SANITARIA">VICEPRESIDENTE DE OPERACIONES Y GESTION SANITARIA</MenuItem>
<MenuItem value="COORDINADOR DE PROYECTOS ESPECIALES">COORDINADOR DE PROYECTOS ESPECIALES</MenuItem>
<MenuItem value="GERENTE ECONOMICO Y FINANCIERO PAISES">GERENTE ECONOMICO Y FINANCIERO PAISES</MenuItem>
<MenuItem value="ESPECIALISTA DESARROLLO CORPORATIVO USA">ESPECIALISTA DESARROLLO CORPORATIVO USA</MenuItem>
<MenuItem value="ENFERMERA DE GESTION HISTORIA CLINICA">ENFERMERA DE GESTION HISTORIA CLINICA</MenuItem>
<MenuItem value="GERENTE DE DESARROLLO DE NEGOCIO">GERENTE DE DESARROLLO DE NEGOCIO</MenuItem>
<MenuItem value="VICEPRESIDENTE DESARROLLO HUMANO KERALTY">VICEPRESIDENTE DESARROLLO HUMANO KERALTY</MenuItem>
<MenuItem value="GERENTE GENERAL PERU">GERENTE GENERAL PERU</MenuItem>
<MenuItem value="ESPECIALISTA DE INFRAESTRUCTURA REDES Y COMUNICACIONES">ESPECIALISTA DE INFRAESTRUCTURA REDES Y COMUNICACIONES</MenuItem>
<MenuItem value="GERENTE DE CONTABILIDAD">GERENTE DE CONTABILIDAD</MenuItem>
<MenuItem value="GERENTE INTERNACIONAL DE INFRAESTRUCTURA">GERENTE INTERNACIONAL DE INFRAESTRUCTURA</MenuItem>
<MenuItem value="SUBGERENTE DE ECONOMIA Y FINANZAS">SUBGERENTE DE ECONOMIA Y FINANZAS</MenuItem>
<MenuItem value="GLOBAL CHIEF INFORMATION OFFICER">GLOBAL CHIEF INFORMATION OFFICER</MenuItem>
<MenuItem value="GERENTE CENTRAL DE IMPUESTOS">GERENTE CENTRAL DE IMPUESTOS</MenuItem>
<MenuItem value="GERENTE DE CONTRALORIA INTERNA GLOBAL">GERENTE DE CONTRALORIA INTERNA GLOBAL</MenuItem>
<MenuItem value="GERENTE DE DESAROLLO HUMANO PAISES">GERENTE DE DESAROLLO HUMANO PAISES</MenuItem>
<MenuItem value="COMMUNICATION CHANNELS MANAGER">COMMUNICATION CHANNELS MANAGER</MenuItem>
<MenuItem value="GERENTE KERALTY">GERENTE KERALTY</MenuItem>
<MenuItem value="VICEPRESIDENTE DE GESTION CLINICA">VICEPRESIDENTE DE GESTION CLINICA</MenuItem>
<MenuItem value="ANALISTA ADMINISTRATIVO USA">ANALISTA ADMINISTRATIVO USA</MenuItem>
<MenuItem value="CONSULTOR APIGEE USA">CONSULTOR APIGEE USA</MenuItem>
<MenuItem value="DIRECTOR DE IMPLEMENTACIONES DE DATOS Y ANALITICA">DIRECTOR DE IMPLEMENTACIONES DE DATOS Y ANALITICA</MenuItem>
<MenuItem value="GERENTE DE RIESGOS EEUU">GERENTE DE RIESGOS EEUU</MenuItem>
<MenuItem value="LIDER DE COMPENSACION PAISES">LIDER DE COMPENSACION PAISES</MenuItem>
<MenuItem value="SUBGERENTE DE COMPENSACION">SUBGERENTE DE COMPENSACION</MenuItem>
<MenuItem value="GERENTE DE SALUD PERU">GERENTE DE SALUD PERU</MenuItem>
<MenuItem value="DIRECTOR PLANEACION FISCAL">DIRECTOR PLANEACION FISCAL</MenuItem>
<MenuItem value="ARQUITECTO DE TI USA">ARQUITECTO DE TI USA</MenuItem>
<MenuItem value="NATIONAL CLINICAL QUALITY MANAGER">NATIONAL CLINICAL QUALITY MANAGER</MenuItem>
<MenuItem value="CONSULTOR MASTER DATA MANAGEMENT">CONSULTOR MASTER DATA MANAGEMENT</MenuItem>
<MenuItem value="GERENTE GESTI N SANITARIA">GERENTE GESTI N SANITARIA</MenuItem>
<MenuItem value="DIRECTOR DE COMPENSACION">DIRECTOR DE COMPENSACION</MenuItem>
<MenuItem value="ANALISTA DE CONTABILIDAD BILING E PAISES">ANALISTA DE CONTABILIDAD BILING E PAISES</MenuItem>
<MenuItem value="ANALISTA DE VIAJES USA">ANALISTA DE VIAJES USA</MenuItem>
<MenuItem value="GERENTE CORPORATIVO DE SEGURIDAD DE LA INFORMACION">GERENTE CORPORATIVO DE SEGURIDAD DE LA INFORMACION</MenuItem>
<MenuItem value="VICEPRESIDENTE DE GOBIERNO CORPORATIVO Y COMPLIANCE">VICEPRESIDENTE DE GOBIERNO CORPORATIVO Y COMPLIANCE</MenuItem>
<MenuItem value="ANALISTA DE TESORERIA USA">ANALISTA DE TESORERIA USA</MenuItem>
<MenuItem value="GERENTE CENTRAL DE SEGURIDAD">GERENTE CENTRAL DE SEGURIDAD</MenuItem>
<MenuItem value="ANALISTA DE CUENTAS POR PAGAR SANITAS USA">ANALISTA DE CUENTAS POR PAGAR SANITAS USA</MenuItem>
<MenuItem value="INVESTIGADOR PROYECTO SAFE">INVESTIGADOR PROYECTO SAFE</MenuItem>
<MenuItem value="ANALISTA DATA MASTER SENIOR">ANALISTA DATA MASTER SENIOR</MenuItem>
<MenuItem value="ANALISTA DE SOPORTE SENIOR">ANALISTA DE SOPORTE SENIOR</MenuItem>
<MenuItem value="VICEPRESIDENTE DE SISTEMAS DE INFORMACION">VICEPRESIDENTE DE SISTEMAS DE INFORMACION</MenuItem>
<MenuItem value="GERENTE CORPORATIVO DE SOLUCIONES EN SISTEMAS DE INFORMACION">GERENTE CORPORATIVO DE SOLUCIONES EN SISTEMAS DE INFORMACION</MenuItem>
<MenuItem value="PRESIDENTE GRUPO KERALTY COLOMBIA">PRESIDENTE GRUPO KERALTY COLOMBIA</MenuItem>
<MenuItem value="GERENTE DE PRESUPUESTO Y ANALISIS FINANCIERO">GERENTE DE PRESUPUESTO Y ANALISIS FINANCIERO</MenuItem>
<MenuItem value="GERENTE DE RELACIONES PUBLICAS">GERENTE DE RELACIONES PUBLICAS</MenuItem>
<MenuItem value="DIRECTOR PLAN DE CONTINUIDAD">DIRECTOR PLAN DE CONTINUIDAD</MenuItem>
<MenuItem value="PROFESIONAL POSTVENTA">PROFESIONAL POSTVENTA</MenuItem>
<MenuItem value="ANALISTA DATA MASTER">ANALISTA DATA MASTER</MenuItem>
<MenuItem value="ENFERMERA DE GESTION HISTORICA CLINICA">ENFERMERA DE GESTION HISTORICA CLINICA</MenuItem>
<MenuItem value="LIDER DE RIESGO">LIDER DE RIESGO</MenuItem>
<MenuItem value="ADMINISTRADOR DE APLICACIONES USA">ADMINISTRADOR DE APLICACIONES USA</MenuItem>
<MenuItem value="PROFESIONAL DE CULTURA Y GESTION DEL CAMBIO PAISES">PROFESIONAL DE CULTURA Y GESTION DEL CAMBIO PAISES</MenuItem>
<MenuItem value="AUDITOR DE SISTEMAS USA">AUDITOR DE SISTEMAS USA</MenuItem>
<MenuItem value="ADMINISTRADOR DE NUBE PUBLICA">ADMINISTRADOR DE NUBE PUBLICA</MenuItem>
<MenuItem value="ANALISTA SENIOR DE MARKETING USA">ANALISTA SENIOR DE MARKETING USA</MenuItem>
<MenuItem value="DIRECTOR PROGRAMA CUIDADORES Y ADULTO MAYOR">DIRECTOR PROGRAMA CUIDADORES Y ADULTO MAYOR</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA HEATLH ANALYSIS AND OPTIMIZATION UNIT">MEDICO ESPECIALISTA HEATLH ANALYSIS AND OPTIMIZATION UNIT</MenuItem>
<MenuItem value="DIRECTOR DE IMPUESTOS">DIRECTOR DE IMPUESTOS</MenuItem>
<MenuItem value="GERENTE DE OPERACIONES DESARROLLO HUMANO">GERENTE DE OPERACIONES DESARROLLO HUMANO</MenuItem>
<MenuItem value="GERENTE GENERAL VENEZUELA">GERENTE GENERAL VENEZUELA</MenuItem>
<MenuItem value="GERENTE CORPORATIVO DE PROYECTOS ESPECIALES">GERENTE CORPORATIVO DE PROYECTOS ESPECIALES</MenuItem>
<MenuItem value="DIRECTOR OF RISK ADJUSTMENT USA">DIRECTOR OF RISK ADJUSTMENT USA</MenuItem>
<MenuItem value="LIDER DE CONTABILIDAD USA">LIDER DE CONTABILIDAD USA</MenuItem>
<MenuItem value="GERENTE DATOS Y ANALITICA COLOMBIA">GERENTE DATOS Y ANALITICA COLOMBIA</MenuItem>
<MenuItem value="DIRECTOR DE PROYECTOS SISTEMAS DE INFORMACION USA">DIRECTOR DE PROYECTOS SISTEMAS DE INFORMACION USA</MenuItem>
<MenuItem value="DIRECTOR OF MARKETING USA & MEX">DIRECTOR OF MARKETING USA & MEX</MenuItem>
<MenuItem value="VICEPRESIDENTE JURIDICO">VICEPRESIDENTE JURIDICO</MenuItem>
<MenuItem value="INGENIERO DE DATOS USA">INGENIERO DE DATOS USA</MenuItem>
<MenuItem value="PRESIDENTE VERSANIA">PRESIDENTE VERSANIA</MenuItem>
<MenuItem value="VICEPRESIDENTE DE PLANES ESPECIALES">VICEPRESIDENTE DE PLANES ESPECIALES</MenuItem>
<MenuItem value="GERENTE DE BIENESTAR Y CALIDAD DE VIDA">GERENTE DE BIENESTAR Y CALIDAD DE VIDA</MenuItem>
<MenuItem value="GERENTE CORPORATIVO DE SALUD DIGITAL">GERENTE CORPORATIVO DE SALUD DIGITAL</MenuItem>
<MenuItem value="ANALISTA DE DATOS USA">ANALISTA DE DATOS USA</MenuItem>
<MenuItem value="CEO GLOBAL KERALTY">CEO GLOBAL KERALTY</MenuItem>
<MenuItem value="CHRO CAPITAL HUMANO">CHRO CAPITAL HUMANO</MenuItem>
<MenuItem value="GERENTE DE COMPRAS DE MEDICAMENTOS, INSUMOS MEDICOS Y LABORATORIO">GERENTE DE COMPRAS DE MEDICAMENTOS, INSUMOS MEDICOS Y LABORATORIO</MenuItem>
<MenuItem value="CHIEF EXECUTIVE OFFICER - TEXAS">CHIEF EXECUTIVE OFFICER - TEXAS</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE COMPENSACION I">AUXILIAR OPERATIVO DE COMPENSACION I</MenuItem>
<MenuItem value="ESPECIALISTA DE PROGRAMAS Y BENEFICIOS">ESPECIALISTA DE PROGRAMAS Y BENEFICIOS</MenuItem>
<MenuItem value="ABOGADO CORPORATIVO USA">ABOGADO CORPORATIVO USA</MenuItem>
<MenuItem value="ABOGADO TRIBUTARISTA Y CAMBIARIO">ABOGADO TRIBUTARISTA Y CAMBIARIO</MenuItem>
<MenuItem value="HEALTHCARE SERVICES DIRECTOR">HEALTHCARE SERVICES DIRECTOR</MenuItem>
<MenuItem value="AUXILIAR ADMINISTRATIVO DE INFORMACION">AUXILIAR ADMINISTRATIVO DE INFORMACION</MenuItem>
<MenuItem value="DISE ADOR GRAFICO USA">DISE ADOR GRAFICO USA</MenuItem>
<MenuItem value="DIRECTOR DE BIENESTAR Y CALIDAD DE VIDA">DIRECTOR DE BIENESTAR Y CALIDAD DE VIDA</MenuItem>
<MenuItem value="DIRECTOR UX EXPERIENCIA DE USUARIO">DIRECTOR UX EXPERIENCIA DE USUARIO</MenuItem>
<MenuItem value="LIDER DE DESARROLLO CORPORATIVO">LIDER DE DESARROLLO CORPORATIVO</MenuItem>
<MenuItem value="SUBGERENTE PROYECTOS DE INNOVACION">SUBGERENTE PROYECTOS DE INNOVACION</MenuItem>
<MenuItem value="SECRETARIA PRESIDENCIA II">SECRETARIA PRESIDENCIA II</MenuItem>
<MenuItem value="SECRETARIA EJECUTIVA">SECRETARIA EJECUTIVA</MenuItem>
<MenuItem value="PRESIDENTE DE SALUD">PRESIDENTE DE SALUD</MenuItem>
<MenuItem value="SVP ESTRATEGIA">SVP ESTRATEGIA</MenuItem>
<MenuItem value="GERENTE DE PROYECTOS Y SOLUCIONES EN SALUD">GERENTE DE PROYECTOS Y SOLUCIONES EN SALUD</MenuItem>
<MenuItem value="DIRECTOR CREATIVO USA">DIRECTOR CREATIVO USA</MenuItem>
<MenuItem value="DIRECTOR DE POSICIONAMIENTO USA">DIRECTOR DE POSICIONAMIENTO USA</MenuItem>
<MenuItem value="DIRECTOR DE NEGOCIACIONES INSUMOS MEDICOS">DIRECTOR DE NEGOCIACIONES INSUMOS MEDICOS</MenuItem>
<MenuItem value="ANALISTA ADMINISTRATIVO KERALTY">ANALISTA ADMINISTRATIVO KERALTY</MenuItem>
<MenuItem value="PROFESIONAL DE ANALITICA DESARROLLO HUMANO PAISES">PROFESIONAL DE ANALITICA DESARROLLO HUMANO PAISES</MenuItem>
<MenuItem value="SR DIRECTOR PRODUCT GROWTH ECONOMICS">SR DIRECTOR PRODUCT GROWTH ECONOMICS</MenuItem>
<MenuItem value="GERENTE DE PROTECCION DE DATOS PERSONALES">GERENTE DE PROTECCION DE DATOS PERSONALES</MenuItem>
<MenuItem value="GERENTE GOBIERNO CORPORATIVO Y COMPLIANCE">GERENTE GOBIERNO CORPORATIVO Y COMPLIANCE</MenuItem>
<MenuItem value="GERENTE HEALTH ANALYSIS AND OPTIMIZATION UNIT">GERENTE HEALTH ANALYSIS AND OPTIMIZATION UNIT</MenuItem>
<MenuItem value="CHIEF EXECUTIVE OFFICER - TENNESSEE">CHIEF EXECUTIVE OFFICER - TENNESSEE</MenuItem>
<MenuItem value="PROFESIONAL DE VALOR EN SALUD">PROFESIONAL DE VALOR EN SALUD</MenuItem>
<MenuItem value="LEGAL RISK & COMPLIANCE COUNSEL">LEGAL RISK & COMPLIANCE COUNSEL</MenuItem>
<MenuItem value="ESPECIALISTA DE COMPENSACION I">ESPECIALISTA DE COMPENSACION I</MenuItem>
<MenuItem value="LIDER DE PRESUPUESTO Y PLANEACION USA">LIDER DE PRESUPUESTO Y PLANEACION USA</MenuItem>
<MenuItem value="CHIEF FINANCIAL OFFICER">CHIEF FINANCIAL OFFICER</MenuItem>
<MenuItem value="SVP DESARROLLO CORPORATIVO">SVP DESARROLLO CORPORATIVO</MenuItem>
<MenuItem value="ANALISTA TECNICO SENIOR II GESTION DE LA INFORMACION">ANALISTA TECNICO SENIOR II GESTION DE LA INFORMACION</MenuItem>
<MenuItem value="ANALISTA ADMINISTRATIVO Y DE FACTURACION">ANALISTA ADMINISTRATIVO Y DE FACTURACION</MenuItem>
<MenuItem value="ANALISTA SISTEMAS DE INFORMACION SENIOR">ANALISTA SISTEMAS DE INFORMACION SENIOR</MenuItem>
<MenuItem value="GERENTE DE HOGARES GERIATRICOS">GERENTE DE HOGARES GERIATRICOS</MenuItem>
<MenuItem value="SUBGERENTE DE VALOR EN SALUD">SUBGERENTE DE VALOR EN SALUD</MenuItem>
<MenuItem value="SUBGERENTE DE ASUNTOS MEDICOS Y DE TUTELA">SUBGERENTE DE ASUNTOS MEDICOS Y DE TUTELA</MenuItem>
<MenuItem value="DIRECTOR DE OPERACION Y COMUNICACIONES TI">DIRECTOR DE OPERACION Y COMUNICACIONES TI</MenuItem>
<MenuItem value="ANALISTA ADMINISTRACION DE SALARIOS SENIOR PAISES">ANALISTA ADMINISTRACION DE SALARIOS SENIOR PAISES</MenuItem>
<MenuItem value="ESPECIALISTA DE RELACIONES INSTITUCIONALES">ESPECIALISTA DE RELACIONES INSTITUCIONALES</MenuItem>
<MenuItem value="VICEPRESIDENTE DE DESARROLLO INTERNACIONAL">VICEPRESIDENTE DE DESARROLLO INTERNACIONAL</MenuItem>
<MenuItem value="SUBGERENTE ASUNTOS PROCESALES">SUBGERENTE ASUNTOS PROCESALES</MenuItem>
<MenuItem value="HEALTH ANALYTICS DIRECTOR">HEALTH ANALYTICS DIRECTOR</MenuItem>
<MenuItem value="ASESOR MEDICO DE SISTEMAS DE INFORMACION EN SALUD USA">ASESOR MEDICO DE SISTEMAS DE INFORMACION EN SALUD USA</MenuItem>
<MenuItem value="GERENTE DE COMUNICACIONES">GERENTE DE COMUNICACIONES</MenuItem>
<MenuItem value="DATA & ANALYTICS DIRECTOR">DATA & ANALYTICS DIRECTOR</MenuItem>
<MenuItem value="SUBGERENTE DE PROGRAMAS Y GESTION CLINICA">SUBGERENTE DE PROGRAMAS Y GESTION CLINICA</MenuItem>
<MenuItem value="DIRECTOR JURIDICO TRIBUTARIO">DIRECTOR JURIDICO TRIBUTARIO</MenuItem>
<MenuItem value="VICE PRESIDENT HEALTHCARE SERVICES">VICE PRESIDENT HEALTHCARE SERVICES</MenuItem>
<MenuItem value="MANAGER ASUNTOS CONTRACTUALES USA">MANAGER ASUNTOS CONTRACTUALES USA</MenuItem>
<MenuItem value="GESTOR AMBIENTAL">GESTOR AMBIENTAL</MenuItem>
<MenuItem value="ANALISTA DE CUMPLIMIENTO">ANALISTA DE CUMPLIMIENTO</MenuItem>
<MenuItem value="SUBGERENTE ASUNTOS CORPORATIVOS">SUBGERENTE ASUNTOS CORPORATIVOS</MenuItem>
<MenuItem value="CONSULTOR FUNCIONAL EBS">CONSULTOR FUNCIONAL EBS</MenuItem>
<MenuItem value="DIRECTOR DE PRESUPUESTO MEXICO">DIRECTOR DE PRESUPUESTO MEXICO</MenuItem>
<MenuItem value="SVP DE COMPRAS Y APROVISIONAMIENTO">SVP DE COMPRAS Y APROVISIONAMIENTO</MenuItem>
<MenuItem value="ANALISTA SQA JUNIOR">ANALISTA SQA JUNIOR</MenuItem>
<MenuItem value="ESPECIALISTA DE PROYECTOS INMOBILIARIOS">ESPECIALISTA DE PROYECTOS INMOBILIARIOS</MenuItem>
<MenuItem value="GERENTE DE DESARROLLO CORPORATIVO">GERENTE DE DESARROLLO CORPORATIVO</MenuItem>
<MenuItem value="DIRECTOR DE GESTION FARMACEUTICA">DIRECTOR DE GESTION FARMACEUTICA</MenuItem>
<MenuItem value="BUSINESS INTELLIGENCE MANAGER">BUSINESS INTELLIGENCE MANAGER</MenuItem>
<MenuItem value="GERENTE GLOBAL DE SEGURIDAD">GERENTE GLOBAL DE SEGURIDAD</MenuItem>
<MenuItem value="MANAGER ASUNTOS CORPORATIVOS USA">MANAGER ASUNTOS CORPORATIVOS USA</MenuItem>
<MenuItem value="CCO CORPORATIVO">CCO CORPORATIVO</MenuItem>
<MenuItem value="VP OF OPERATIONS & IT">VP OF OPERATIONS & IT</MenuItem>
<MenuItem value="SUBGERENTE DE ASUNTOS INTERNACIONALES">SUBGERENTE DE ASUNTOS INTERNACIONALES</MenuItem>
<MenuItem value="DIRECTOR DE DESARROLLO CORPORATIVO JUNIOR">DIRECTOR DE DESARROLLO CORPORATIVO JUNIOR</MenuItem>
<MenuItem value="PROVIDER DATABASE & COMMUNICATIONS MANAGER">PROVIDER DATABASE & COMMUNICATIONS MANAGER</MenuItem>
<MenuItem value="PRESIDENTE DE ASEGURAMIENTO BASICO">PRESIDENTE DE ASEGURAMIENTO BASICO</MenuItem>
<MenuItem value="ANALISTA DESARROLLO CORPORATIVO">ANALISTA DESARROLLO CORPORATIVO</MenuItem>
<MenuItem value="PRESIDENTE GRUPO KERALTY">PRESIDENTE GRUPO KERALTY</MenuItem>
<MenuItem value="ESPECIALISTA DE SERVICIOS TI">ESPECIALISTA DE SERVICIOS TI</MenuItem>
<MenuItem value="ARQUITECTO DE INFRAESTRUCTURA USA">ARQUITECTO DE INFRAESTRUCTURA USA</MenuItem>
<MenuItem value="ANALISTA DE IMPUESTOS PAISES">ANALISTA DE IMPUESTOS PAISES</MenuItem>
<MenuItem value="CONDUCTOR PRESIDENCIA">CONDUCTOR PRESIDENCIA</MenuItem>
<MenuItem value="GERENTE DE PROYECTOS">GERENTE DE PROYECTOS</MenuItem>
<MenuItem value="GERENTE DE ADMINISTRACION DE SALARIOS RIESGO Y CALIDAD">GERENTE DE ADMINISTRACION DE SALARIOS RIESGO Y CALIDAD</MenuItem>
<MenuItem value="CONSULTOR SENIOR DE SEGURIDAD DE LA INFORMACION">CONSULTOR SENIOR DE SEGURIDAD DE LA INFORMACION</MenuItem>
<MenuItem value="DIRECTOR PORTAFOLIOS DE INVERSION">DIRECTOR PORTAFOLIOS DE INVERSION</MenuItem>
<MenuItem value="CONSULTOR DE PROYECTOS Y AUTOMATIZACION TI">CONSULTOR DE PROYECTOS Y AUTOMATIZACION TI</MenuItem>
<MenuItem value="CHIEF EXECUTIVE OFFICER GWS">CHIEF EXECUTIVE OFFICER GWS</MenuItem>
<MenuItem value="PRESIDENTE VERSANIA GLOBAL">PRESIDENTE VERSANIA GLOBAL</MenuItem>
<MenuItem value="GERENTE DE OPERACI N SANITARIA">GERENTE DE OPERACI N SANITARIA</MenuItem>
<MenuItem value="CHIEF INFORMATION OFFICER EUROPE & ASIA">CHIEF INFORMATION OFFICER EUROPE & ASIA</MenuItem>
<MenuItem value="ENFERMERA EDUCACION VIRTUAL HEALTH ANALYSIS AND OPTIMIZATION UNIT">ENFERMERA EDUCACION VIRTUAL HEALTH ANALYSIS AND OPTIMIZATION UNIT</MenuItem>
<MenuItem value="DIRECTOR DE ANALITICA CUANTITATIVA PARA RIESGOS">DIRECTOR DE ANALITICA CUANTITATIVA PARA RIESGOS</MenuItem>
<MenuItem value="MEDICO ESPECIALISTA HEALTH ANALYSIS AND OPTIMIZATION UNIT - SUPPORT">MEDICO ESPECIALISTA HEALTH ANALYSIS AND OPTIMIZATION UNIT - SUPPORT</MenuItem>
<MenuItem value="COORDINADOR DATA MASTER">COORDINADOR DATA MASTER</MenuItem>
<MenuItem value="PROFESIONAL SENIOR DE SUSCRIPCION">PROFESIONAL SENIOR DE SUSCRIPCION</MenuItem>
<MenuItem value="ADMINISTRADOR DE SISTEMAS USA">ADMINISTRADOR DE SISTEMAS USA</MenuItem>
<MenuItem value="COORDINADOR PLANEACION FISCAL">COORDINADOR PLANEACION FISCAL</MenuItem>
<MenuItem value="ACOMPA ANTE">ACOMPA ANTE</MenuItem>
<MenuItem value="COORDINADOR CONECTA">COORDINADOR CONECTA</MenuItem>
<MenuItem value="FACILITADOR PROGRAMA MANTENIMIENTO FUNCIONAL">FACILITADOR PROGRAMA MANTENIMIENTO FUNCIONAL</MenuItem>
<MenuItem value="ESPECIALISTA FORMACION EDUCA">ESPECIALISTA FORMACION EDUCA</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO CONECTA">AUXILIAR OPERATIVO CONECTA</MenuItem>
<MenuItem value="DIRECTOR PROGRAMA LAZOS HUMANOS">DIRECTOR PROGRAMA LAZOS HUMANOS</MenuItem>
<MenuItem value="ASISTENTE CENTRAL JURIDICA">ASISTENTE CENTRAL JURIDICA</MenuItem>
<MenuItem value="ANALISTA DE SUSCRIPCION DE PROGRAMACION">ANALISTA DE SUSCRIPCION DE PROGRAMACION</MenuItem>
<MenuItem value="DEPENDIENTE JUDICIAL II">DEPENDIENTE JUDICIAL II</MenuItem>
<MenuItem value="DIRECTOR DE GOBIERNO CORPORATIVO">DIRECTOR DE GOBIERNO CORPORATIVO</MenuItem>
<MenuItem value="ANALISTA DE COMPLIANCE">ANALISTA DE COMPLIANCE</MenuItem>
<MenuItem value="DIRECTOR DE SUSCRIPCION">DIRECTOR DE SUSCRIPCION</MenuItem>
<MenuItem value="ASESOR INTEGRAL SOPORTE A CANALES">ASESOR INTEGRAL SOPORTE A CANALES</MenuItem>
<MenuItem value="GESTOR OPERATIVO DE INFORMACION">GESTOR OPERATIVO DE INFORMACION</MenuItem>
<MenuItem value="ANALISTA ADMINISTRATIVO SENIOR KERALTY">ANALISTA ADMINISTRATIVO SENIOR KERALTY</MenuItem>
<MenuItem value="SUBGERENTE DE GESTION DOCUMENTAL">SUBGERENTE DE GESTION DOCUMENTAL</MenuItem>
<MenuItem value="SUBGERENTE DE OPERACIONES REGIONAL CENTRO ORIENTE">SUBGERENTE DE OPERACIONES REGIONAL CENTRO ORIENTE</MenuItem>
<MenuItem value="COORDINADOR PROGRAMA MEDICINA PREVENTIVA">COORDINADOR PROGRAMA MEDICINA PREVENTIVA</MenuItem>
<MenuItem value="AUXILIAR PLANEACION FISCAL">AUXILIAR PLANEACION FISCAL</MenuItem>
<MenuItem value="SUBGERENTE DE AUDITORIA MEDICA">SUBGERENTE DE AUDITORIA MEDICA</MenuItem>
<MenuItem value="VICEPRESIDENTE DE OPERACIONES ASEGURAMIENTO PREMIUM">VICEPRESIDENTE DE OPERACIONES ASEGURAMIENTO PREMIUM</MenuItem>
<MenuItem value="GERENTE DE BIENESTAR MEDICO">GERENTE DE BIENESTAR MEDICO</MenuItem>
<MenuItem value="COORDINADOR DE CARTERA Y COBRANZA">COORDINADOR DE CARTERA Y COBRANZA</MenuItem>
<MenuItem value="SUBGERENTE DE OPERACIONES REGIONAL MEDELLIN">SUBGERENTE DE OPERACIONES REGIONAL MEDELLIN</MenuItem>
<MenuItem value="ANALISTA DE SOPORTE GESTION TRIBUTARIA">ANALISTA DE SOPORTE GESTION TRIBUTARIA</MenuItem>
<MenuItem value="DIRECTOR DE AUDITORIA MEDICA REGIONAL BOGOTA">DIRECTOR DE AUDITORIA MEDICA REGIONAL BOGOTA</MenuItem>
<MenuItem value="SUBGERENTE DE OPERACIONES REGIONAL">SUBGERENTE DE OPERACIONES REGIONAL</MenuItem>
<MenuItem value="SUBGERENTE DE PLANES MODULARES">SUBGERENTE DE PLANES MODULARES</MenuItem>
<MenuItem value="DIRECTOR DE OPERACIONES">DIRECTOR DE OPERACIONES</MenuItem>
<MenuItem value="SUBDIRECTOR CARTERA Y COBRANZAS">SUBDIRECTOR CARTERA Y COBRANZAS</MenuItem>
<MenuItem value="ESPECIALISTA DE BIENESTAR MEDICO">ESPECIALISTA DE BIENESTAR MEDICO</MenuItem>
<MenuItem value="ANALISTA JUNIOR DE PROYECTOS">ANALISTA JUNIOR DE PROYECTOS</MenuItem>
<MenuItem value="COORDINADOR DE CONVENIOS Y TARIFAS">COORDINADOR DE CONVENIOS Y TARIFAS</MenuItem>
<MenuItem value="VICEPRESIDENTE CORPORATIVO DE OPERACIONES ASEGURAMIENTO">VICEPRESIDENTE CORPORATIVO DE OPERACIONES ASEGURAMIENTO</MenuItem>
<MenuItem value="COORDINADOR DE AFILIACIONES">COORDINADOR DE AFILIACIONES</MenuItem>
<MenuItem value="TECNICO DE CONSULTORIO">TECNICO DE CONSULTORIO</MenuItem>
<MenuItem value="COORDINADOR MEDICO OFTALMOLOGIA">COORDINADOR MEDICO OFTALMOLOGIA</MenuItem>
<MenuItem value="OPTOMETRA">OPTOMETRA</MenuItem>
<MenuItem value="GERENTE GENERAL">GERENTE GENERAL</MenuItem>
<MenuItem value="COORDINADOR LOGISTICO">COORDINADOR LOGISTICO</MenuItem>
<MenuItem value="AUXILIAR DE VENTAS">AUXILIAR DE VENTAS</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE OPTICA">AUXILIAR OPERATIVO DE OPTICA</MenuItem>
<MenuItem value="GESTOR DE SEDE">GESTOR DE SEDE</MenuItem>
<MenuItem value="GESTOR DE SEDE I">GESTOR DE SEDE I</MenuItem>
<MenuItem value="COORDINADOR DE GESTION COMERCIAL">COORDINADOR DE GESTION COMERCIAL</MenuItem>
<MenuItem value="COORDINADOR DE ZONA">COORDINADOR DE ZONA</MenuItem>
<MenuItem value="DIRECTOR FINANCIERO">DIRECTOR FINANCIERO</MenuItem>
<MenuItem value="AUXILIAR DE BODEGA">AUXILIAR DE BODEGA</MenuItem>
<MenuItem value="COORDINADOR DE OPTICA">COORDINADOR DE OPTICA</MenuItem>
<MenuItem value="COORDINADOR DIRECCION CIENTIFICA">COORDINADOR DIRECCION CIENTIFICA</MenuItem>
<MenuItem value="AUXILIAR DE INVENTARIOS">AUXILIAR DE INVENTARIOS</MenuItem>
<MenuItem value="GESTOR DE AGENDAMIENTO Y OPORTUNIDAD">GESTOR DE AGENDAMIENTO Y OPORTUNIDAD</MenuItem>
<MenuItem value="GERENTE DE OPTICA">GERENTE DE OPTICA</MenuItem>
<MenuItem value="DIRECTOR DE SALUD VISUAL">DIRECTOR DE SALUD VISUAL</MenuItem>
<MenuItem value="SUBGERENTE DE SALUD">SUBGERENTE DE SALUD</MenuItem>
<MenuItem value="FISIOTERAPEUTA SALUD OCUPACIONAL">FISIOTERAPEUTA SALUD OCUPACIONAL</MenuItem>
<MenuItem value="ANALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO II">ANALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO II</MenuItem>
<MenuItem value="PROMOTOR DE PROGRAMAS EN SALUD">PROMOTOR DE PROGRAMAS EN SALUD</MenuItem>
<MenuItem value="AUXILIAR DE ADMISIONES I">AUXILIAR DE ADMISIONES I</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE PREVENCION I">ASESOR INTEGRAL DE PREVENCION I</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE PREVENCION FISIOTERAPEUTA I">ASESOR INTEGRAL DE PREVENCION FISIOTERAPEUTA I</MenuItem>
<MenuItem value="AUXILIAR DE PRESTADORES">AUXILIAR DE PRESTADORES</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE PREVENCION PSICOLOGO">ASESOR INTEGRAL DE PREVENCION PSICOLOGO</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE PREVENCION FISIOTERAPEUTA">ASESOR INTEGRAL DE PREVENCION FISIOTERAPEUTA</MenuItem>
<MenuItem value="COORDINADOR DE POSTVENTA">COORDINADOR DE POSTVENTA</MenuItem>
<MenuItem value="GESTOR DE EMPRESA">GESTOR DE EMPRESA</MenuItem>
<MenuItem value="COORDINADOR MEDICO SALUD OCUPACIONAL">COORDINADOR MEDICO SALUD OCUPACIONAL</MenuItem>
<MenuItem value="PROMOTOR DE PROGRAMAS EN SALUD I">PROMOTOR DE PROGRAMAS EN SALUD I</MenuItem>
<MenuItem value="COORDINADOR ADMINISTRATIVO PROGRAMAS EN SALUD">COORDINADOR ADMINISTRATIVO PROGRAMAS EN SALUD</MenuItem>
<MenuItem value="AUXILIAR COMERCIAL">AUXILIAR COMERCIAL</MenuItem>
<MenuItem value="GESTOR DE PROGRAMAS ESPECIALES">GESTOR DE PROGRAMAS ESPECIALES</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE PREVENCION-TECNOLOGO">ASESOR INTEGRAL DE PREVENCION-TECNOLOGO</MenuItem>
<MenuItem value="PSICOLOGO ESPECIALISTA EN SALUD OCUPACIONAL">PSICOLOGO ESPECIALISTA EN SALUD OCUPACIONAL</MenuItem>
<MenuItem value="FONOAUDIOLOGA SALUD OCUPACIONAL">FONOAUDIOLOGA SALUD OCUPACIONAL</MenuItem>
<MenuItem value="GERENTE GENERAL SO">GERENTE GENERAL SO</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE PREVENCION INGENIERO I">ASESOR INTEGRAL DE PREVENCION INGENIERO I</MenuItem>
<MenuItem value="ANALISTA DE ERGONOMIA">ANALISTA DE ERGONOMIA</MenuItem>
<MenuItem value="ASESOR INTEGRAL DE PREVENCION ENFERMERA">ASESOR INTEGRAL DE PREVENCION ENFERMERA</MenuItem>
<MenuItem value="TECNOLOGO JUNIOR EN HIGIENE Y SEGURIDAD INDUSTRIAL">TECNOLOGO JUNIOR EN HIGIENE Y SEGURIDAD INDUSTRIAL</MenuItem>
<MenuItem value="ADMINISTRADOR BASE DE DATOS SO">ADMINISTRADOR BASE DE DATOS SO</MenuItem>
<MenuItem value="ESPECIALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO">ESPECIALISTA DE SALUD Y SEGURIDAD EN EL TRABAJO</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="AUXILIAR LOGISTICO Y ADMINISTRATIVO">AUXILIAR LOGISTICO Y ADMINISTRATIVO</MenuItem>
<MenuItem value="AUXILIAR DE ADMISIONES Y FACTURACION">AUXILIAR DE ADMISIONES Y FACTURACION</MenuItem>
<MenuItem value="COORDINADOR DE GESTION MEDICA PRESENTES">COORDINADOR DE GESTION MEDICA PRESENTES</MenuItem>
<MenuItem value="COUNSELLOR">COUNSELLOR</MenuItem>
<MenuItem value="GERENTE PRESENTES">GERENTE PRESENTES</MenuItem>
<MenuItem value="TECNICO EN RESONANCIA MAGNETICA">TECNICO EN RESONANCIA MAGNETICA</MenuItem>
<MenuItem value="COORDINADOR DE CALL CENTER">COORDINADOR DE CALL CENTER</MenuItem>
<MenuItem value="FISIOTERAPEUTA NEUROREHABILITACION">FISIOTERAPEUTA NEUROREHABILITACION</MenuItem>
<MenuItem value="COORDINADOR MEDICO DESARROLLO INFANTIL">COORDINADOR MEDICO DESARROLLO INFANTIL</MenuItem>
<MenuItem value="GERENTE PRIMERA INFANCIA">GERENTE PRIMERA INFANCIA</MenuItem>
<MenuItem value="DIRECTOR DE SEDE">DIRECTOR DE SEDE</MenuItem>
<MenuItem value="GERENTE">GERENTE</MenuItem>
<MenuItem value="DIRECTOR DE RESIDENCIAS VERSANIA SENIOR">DIRECTOR DE RESIDENCIAS VERSANIA SENIOR</MenuItem>
<MenuItem value="GERENTE PROTECION DE DATOS PERSONALES">GERENTE PROTECION DE DATOS PERSONALES</MenuItem>
<MenuItem value="PRESIDENTE DE ASEGURAMIENTO B SICO.">PRESIDENTE DE ASEGURAMIENTO B SICO.</MenuItem>
<MenuItem value="ABOGADO TRIBUTARISTA INTERNACIONAL">ABOGADO TRIBUTARISTA INTERNACIONAL</MenuItem>
<MenuItem value="COORDINADOR GESTI N DEL RIESGO">COORDINADOR GESTI N DEL RIESGO</MenuItem>
<MenuItem value="ADMINISTRADOR DEL SISTEMA JUNIOR">ADMINISTRADOR DEL SISTEMA JUNIOR</MenuItem>
<MenuItem value="ADMINISTRADOR SISTEMA DE MONITOREO">ADMINISTRADOR SISTEMA DE MONITOREO</MenuItem>
<MenuItem value="ANALISTA BIOINFORMATICO">ANALISTA BIOINFORMATICO</MenuItem>
<MenuItem value="ANALISTA CAMPA A">ANALISTA CAMPA A</MenuItem>
<MenuItem value="ANALISTA DE CALIDAD OPTICA">ANALISTA DE CALIDAD OPTICA</MenuItem>
<MenuItem value="ANALISTA DE CONTABILIDAD FILIPINAS">ANALISTA DE CONTABILIDAD FILIPINAS</MenuItem>
<MenuItem value="ANALISTA DE GESTION OPERATIVA">ANALISTA DE GESTION OPERATIVA</MenuItem>
<MenuItem value="ANALISTA DE INFORMACION INFRAESTRUCTURA">ANALISTA DE INFORMACION INFRAESTRUCTURA</MenuItem>
<MenuItem value="ANALISTA DE TECNOLOGIA">ANALISTA DE TECNOLOGIA</MenuItem>
<MenuItem value="ANALISTA DISE O ORGANIZACIONAL I">ANALISTA DISE O ORGANIZACIONAL I</MenuItem>
<MenuItem value="ANALISTA ESTUDIOS ECONOMICOS">ANALISTA ESTUDIOS ECONOMICOS</MenuItem>
<MenuItem value="ASESOR SOPORTE PRESTADORES">ASESOR SOPORTE PRESTADORES</MenuItem>
<MenuItem value="ASISTENTE VINCULACION SECTOR EXTERNO">ASISTENTE VINCULACION SECTOR EXTERNO</MenuItem>
<MenuItem value="AUXILIAR OPERATIVA">AUXILIAR OPERATIVA</MenuItem>
<MenuItem value="AUXILIAR OPERATIVO DE COMPENSACION">AUXILIAR OPERATIVO DE COMPENSACION</MenuItem>
<MenuItem value="BIBLIOTECOLOGO JUNIOR">BIBLIOTECOLOGO JUNIOR</MenuItem>
<MenuItem value="COORDINADOR ADMINISTRATIVO DE SEDES">COORDINADOR ADMINISTRATIVO DE SEDES</MenuItem>
<MenuItem value="COORDINADOR ADMINISTRATIVO EPS REGIONAL">COORDINADOR ADMINISTRATIVO EPS REGIONAL</MenuItem>
<MenuItem value="COORDINADOR DE BIENESTAR Y CALIDAD DE VIDA">COORDINADOR DE BIENESTAR Y CALIDAD DE VIDA</MenuItem>
<MenuItem value="COORDINADOR DE EDUCACION Y SERVICIO">COORDINADOR DE EDUCACION Y SERVICIO</MenuItem>
<MenuItem value="COORDINADOR DE ENFERMERIA ONCOLOGIA">COORDINADOR DE ENFERMERIA ONCOLOGIA</MenuItem>
<MenuItem value="COORDINADOR M DICO URGENCIAS">COORDINADOR M DICO URGENCIAS</MenuItem>
<MenuItem value="COORDINADORA DE EVALUACION">COORDINADORA DE EVALUACION</MenuItem>
<MenuItem value="DEPENDIENTE JUDICIAL">DEPENDIENTE JUDICIAL</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO CENTROS MEDICOS">DIRECTOR ADMINISTRATIVO CENTROS MEDICOS</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO ODONTOSANITAS">DIRECTOR ADMINISTRATIVO ODONTOSANITAS</MenuItem>
<MenuItem value="DIRECTOR ADMINISTRATIVO UAP">DIRECTOR ADMINISTRATIVO UAP</MenuItem>
<MenuItem value="DIRECTOR ADMNISTRATIVO Y ANALITICA DESARROLLO HUMANO">DIRECTOR ADMNISTRATIVO Y ANALITICA DESARROLLO HUMANO</MenuItem>
<MenuItem value="DIRECTOR CONTROL Y POLITICA CONTABLE">DIRECTOR CONTROL Y POLITICA CONTABLE</MenuItem>
<MenuItem value="DIRECTOR DE ACTUAR A ASEGURAMIENTO">DIRECTOR DE ACTUAR A ASEGURAMIENTO</MenuItem>
<MenuItem value="DIRECTOR DE AFILIACIONES Y RECAUDO">DIRECTOR DE AFILIACIONES Y RECAUDO</MenuItem>
<MenuItem value="DIRECTOR DE CENTRO">DIRECTOR DE CENTRO</MenuItem>
<MenuItem value="DIRECTOR DE COMPRAS TECNOLOGIA Y SUMINISTROS">DIRECTOR DE COMPRAS TECNOLOGIA Y SUMINISTROS</MenuItem>
<MenuItem value="DIRECTOR DE FIDELIZACION AL USUARIO">DIRECTOR DE FIDELIZACION AL USUARIO</MenuItem>
<MenuItem value="DIRECTOR DE GESTION TECNICAS DE CONVENIOS">DIRECTOR DE GESTION TECNICAS DE CONVENIOS</MenuItem>
<MenuItem value="DIRECTOR DE INDEMNIZACIONES ARL">DIRECTOR DE INDEMNIZACIONES ARL</MenuItem>
<MenuItem value="DIRECTOR DE INFRAESTRUCTURA MEDICA">DIRECTOR DE INFRAESTRUCTURA MEDICA</MenuItem>
<MenuItem value="DIRECTOR DE OPERACI N Y COMUNICACIONES TI">DIRECTOR DE OPERACI N Y COMUNICACIONES TI</MenuItem>
<MenuItem value="DIRECTOR DE PORTAFOLIO DE PROYECTOS">DIRECTOR DE PORTAFOLIO DE PROYECTOS</MenuItem>
<MenuItem value="DIRECTOR DE RED PROPIA">DIRECTOR DE RED PROPIA</MenuItem>
<MenuItem value="DIRECTOR DE REPORTES">DIRECTOR DE REPORTES</MenuItem>
<MenuItem value="DIRECTOR DE RESERVAS">DIRECTOR DE RESERVAS</MenuItem>
<MenuItem value="DIRECTOR DE SALUD MENTAL">DIRECTOR DE SALUD MENTAL</MenuItem>
<MenuItem value="DIRECTOR DE SERVICIO ARL">DIRECTOR DE SERVICIO ARL</MenuItem>
<MenuItem value="DIRECTOR DEL SISTEMA">DIRECTOR DEL SISTEMA</MenuItem>
<MenuItem value="DIRECTOR MODELO DE SERVICIO SUBSIDIADO">DIRECTOR MODELO DE SERVICIO SUBSIDIADO</MenuItem>
<MenuItem value="DIRECTOR NACIONAL DE AUDITORIA">DIRECTOR NACIONAL DE AUDITORIA</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO DE VINCULACION MP">DIRECTOR OPERATIVO DE VINCULACION MP</MenuItem>
<MenuItem value="DIRECTOR OPERATIVO OPTICA">DIRECTOR OPERATIVO OPTICA</MenuItem>
<MenuItem value="DIRECTOR PRODUCTOS ODONTOLOGICOS">DIRECTOR PRODUCTOS ODONTOLOGICOS</MenuItem>
<MenuItem value="DIRECTOR PROGRAMA HEMOFILIA Y ARTRITIS">DIRECTOR PROGRAMA HEMOFILIA Y ARTRITIS</MenuItem>
<MenuItem value="GERENTE CLINICA COLOMBIA">GERENTE CLINICA COLOMBIA</MenuItem>
<MenuItem value="GERENTE CORPORATIVO CENTRAL DE COMPRAS">GERENTE CORPORATIVO CENTRAL DE COMPRAS</MenuItem>
<MenuItem value="GERENTE CORPORATIVO DE MEJORA SISTEMAS DE INFORMACION">GERENTE CORPORATIVO DE MEJORA SISTEMAS DE INFORMACION</MenuItem>
<MenuItem value="GERENTE CORPORATIVO DE SOLUCIONES DE ASEGURAMIENTO Y ASISTENCIAL">GERENTE CORPORATIVO DE SOLUCIONES DE ASEGURAMIENTO Y ASISTENCIAL</MenuItem>
<MenuItem value="GERENTE CORPORATIVO TRANSFORMACION DIGITAL EN SALUD">GERENTE CORPORATIVO TRANSFORMACION DIGITAL EN SALUD</MenuItem>
<MenuItem value="GERENTE DE ANALITICA Y PROYECTOS COMERCIALES">GERENTE DE ANALITICA Y PROYECTOS COMERCIALES</MenuItem>
<MenuItem value="GERENTE DE ATRACCION Y FIDELIZACION">GERENTE DE ATRACCION Y FIDELIZACION</MenuItem>
<MenuItem value="GERENTE DE CENTROS MEDICOS">GERENTE DE CENTROS MEDICOS</MenuItem>
<MenuItem value="GERENTE DE COMPENSACION">GERENTE DE COMPENSACION</MenuItem>
<MenuItem value="GERENTE DE COMPRAS DE INFRAESTRUCTURA Y TECNOLOGIA">GERENTE DE COMPRAS DE INFRAESTRUCTURA Y TECNOLOGIA</MenuItem>
<MenuItem value="GERENTE DE COMPRAS DE MEDICAMENTOS E INSUMOS MEDICOS">GERENTE DE COMPRAS DE MEDICAMENTOS E INSUMOS MEDICOS</MenuItem>
<MenuItem value="GERENTE DE CULTURA Y GESTION DEL CAMBIO">GERENTE DE CULTURA Y GESTION DEL CAMBIO</MenuItem>
<MenuItem value="GERENTE DE EXCELENCIA CLINICA">GERENTE DE EXCELENCIA CLINICA</MenuItem>
<MenuItem value="GERENTE DE PRESUPUESTO">GERENTE DE PRESUPUESTO</MenuItem>
<MenuItem value="GERENTE DE PROYECTOS REGIMEN SUBSIDIADO">GERENTE DE PROYECTOS REGIMEN SUBSIDIADO</MenuItem>
<MenuItem value="GERENTE DE SALUD DE REGIONALES">GERENTE DE SALUD DE REGIONALES</MenuItem>
<MenuItem value="GERENTE DE SALUD DIGITAL">GERENTE DE SALUD DIGITAL</MenuItem>
<MenuItem value="GERENTE DE SALUD MEDICINA PREPAGADA">GERENTE DE SALUD MEDICINA PREPAGADA</MenuItem>
<MenuItem value="GERENTE DE SEGUROS DE VIDA Y OTROS">GERENTE DE SEGUROS DE VIDA Y OTROS</MenuItem>
<MenuItem value="GERENTE MEDICO REGIONALES EPS">GERENTE MEDICO REGIONALES EPS</MenuItem>
<MenuItem value="GESTOR DE AUTOEVALUACION">GESTOR DE AUTOEVALUACION</MenuItem>
<MenuItem value="GESTOR DE LIQUIDACION COMISIONES">GESTOR DE LIQUIDACION COMISIONES</MenuItem>
<MenuItem value="GESTOR DE RELACIONES PUBLICAS">GESTOR DE RELACIONES PUBLICAS</MenuItem>
<MenuItem value="GESTOR INSTITUCIONAL DE DOCENCIA">GESTOR INSTITUCIONAL DE DOCENCIA</MenuItem>
<MenuItem value="GESTOR LOGISTICO LINEA ACOMPA A">GESTOR LOGISTICO LINEA ACOMPA A</MenuItem>
<MenuItem value="GESTOR MESA DE AYUDA I">GESTOR MESA DE AYUDA I</MenuItem>
<MenuItem value="INGENIERO LIDER DE CALIDAD">INGENIERO LIDER DE CALIDAD</MenuItem>
<MenuItem value="INGENIERO SISTEMA DE INFORMACION">INGENIERO SISTEMA DE INFORMACION</MenuItem>
<MenuItem value="JEFE CENTRAL DE URGENCIAS EPS">JEFE CENTRAL DE URGENCIAS EPS</MenuItem>
<MenuItem value="JEFE DE CIRUGIA GENERAL">JEFE DE CIRUGIA GENERAL</MenuItem>
<MenuItem value="JEFE DE CONTROL Y POL TICA CONTABLE">JEFE DE CONTROL Y POL TICA CONTABLE</MenuItem>
<MenuItem value="JEFE DE EPIDEMIOLOG A Y SALUD P BLICA">JEFE DE EPIDEMIOLOG A Y SALUD P BLICA</MenuItem>
<MenuItem value="JEFE DE OTORRINOLARINGOLOGIA">JEFE DE OTORRINOLARINGOLOGIA</MenuItem>
<MenuItem value="LIDER ADMINISTRACION DE COMPENSACION">LIDER ADMINISTRACION DE COMPENSACION</MenuItem>
<MenuItem value="LIDER DE GESTION AMBIENTAL">LIDER DE GESTION AMBIENTAL</MenuItem>
<MenuItem value="LIDER DE INFORMACION">LIDER DE INFORMACION</MenuItem>
<MenuItem value="LIDER DE OPERACIONES ARL">LIDER DE OPERACIONES ARL</MenuItem>
<MenuItem value="LIDER DESARROLLO BI I">LIDER DESARROLLO BI I</MenuItem>
<MenuItem value="LIDER GESTION Y CONTROL CONTRATACION Y CUMPLIMIENTO">LIDER GESTION Y CONTROL CONTRATACION Y CUMPLIMIENTO</MenuItem>
<MenuItem value="LIDER INSTITUCIONAL DE MEJORAMIENTO">LIDER INSTITUCIONAL DE MEJORAMIENTO</MenuItem>
<MenuItem value="LIDER OPERATIVO DE DESARROLLO CORPORATIVO">LIDER OPERATIVO DE DESARROLLO CORPORATIVO</MenuItem>
<MenuItem value="LIDER OPERATIVO DESARROLLO OTROS PAISES">LIDER OPERATIVO DESARROLLO OTROS PAISES</MenuItem>
<MenuItem value="LIDER PROYECTOS DE DOTACION">LIDER PROYECTOS DE DOTACION</MenuItem>
<MenuItem value="MEDICO CODIFICADOR">MEDICO CODIFICADOR</MenuItem>
<MenuItem value="MEDICO RADIOLOGA">MEDICO RADIOLOGA</MenuItem>
<MenuItem value="POPULATION HEALTH LEADER - HEALTH ANALYSIS AND OPTIMIZATION UNIT">POPULATION HEALTH LEADER - HEALTH ANALYSIS AND OPTIMIZATION UNIT</MenuItem>
<MenuItem value="PRESIDENTE">PRESIDENTE</MenuItem>
<MenuItem value="PRESIDENTE DE GRUPO KERALTY COLOMBIA">PRESIDENTE DE GRUPO KERALTY COLOMBIA</MenuItem>
<MenuItem value="PROFESIONAL DE SERVICIO">PROFESIONAL DE SERVICIO</MenuItem>
<MenuItem value="PROMOTOR DE PROGRAMAS EN SALUD (NUTRICIONISTA)">PROMOTOR DE PROGRAMAS EN SALUD (NUTRICIONISTA)</MenuItem>
<MenuItem value="SUBDIRECTOR ADMINISTRATIVO CLINICA">SUBDIRECTOR ADMINISTRATIVO CLINICA</MenuItem>
<MenuItem value="SUBGERENTE DE ATRACCI N">SUBGERENTE DE ATRACCI N</MenuItem>
<MenuItem value="SUBGERENTE DE BUSINESS PARTNER">SUBGERENTE DE BUSINESS PARTNER</MenuItem>
<MenuItem value="SUBGERENTE DE DESARROLLO CORPORATIVO">SUBGERENTE DE DESARROLLO CORPORATIVO</MenuItem>
<MenuItem value="SUBGERENTE DE PLANEACION Y CONTROL FINANCIERO MP">SUBGERENTE DE PLANEACION Y CONTROL FINANCIERO MP</MenuItem>
<MenuItem value="SUBGERENTE DE REGIONALES">SUBGERENTE DE REGIONALES</MenuItem>
<MenuItem value="SUBGERENTE GESTION DEL RIESGO">SUBGERENTE GESTION DEL RIESGO</MenuItem>
<MenuItem value="SUBGERENTE HEALTH ANALYSIS AND OPTIMIZATION UNIT">SUBGERENTE HEALTH ANALYSIS AND OPTIMIZATION UNIT</MenuItem>
<MenuItem value="SUBGERENTE PLANEACION Y CONTROL">SUBGERENTE PLANEACION Y CONTROL</MenuItem>
<MenuItem value="SUBGERENTE SERVICIOS CORE CLINICA">SUBGERENTE SERVICIOS CORE CLINICA</MenuItem>
<MenuItem value="SUPERNUMERARIO AREA ADMON">SUPERNUMERARIO AREA ADMON</MenuItem>
<MenuItem value="VICEPRESIDENTE COMERCIAL">VICEPRESIDENTE COMERCIAL</MenuItem>
<MenuItem value="VICEPRESIDENTE COMERCIAL EPS">VICEPRESIDENTE COMERCIAL EPS</MenuItem>
<MenuItem value="VICEPRESIDENTE COMERCIAL MEDICINA PREPAGADA">VICEPRESIDENTE COMERCIAL MEDICINA PREPAGADA</MenuItem>
<MenuItem value="VICEPRESIDENTE DE GESTION ADMINISTRATIVA Y OPERACIONES">VICEPRESIDENTE DE GESTION ADMINISTRATIVA Y OPERACIONES</MenuItem>
<MenuItem value="VICEPRESIDENTE DE OPERACIONES">VICEPRESIDENTE DE OPERACIONES</MenuItem>
<MenuItem value="VICEPRESIDENTE DE RELACIONES INSTITUCIONALES EPS">VICEPRESIDENTE DE RELACIONES INSTITUCIONALES EPS</MenuItem>
<MenuItem value="VICEPRESIDENTE DE RIESGO">VICEPRESIDENTE DE RIESGO</MenuItem>
<MenuItem value="VICEPRESIDENTE EJECUTIVO REGIMEN SUBSIDIADO">VICEPRESIDENTE EJECUTIVO REGIMEN SUBSIDIADO</MenuItem>
<MenuItem value="VICEPRESIDENTE FINANCIERO EPS">VICEPRESIDENTE FINANCIERO EPS</MenuItem>
<MenuItem value="ASESOR MEDICO JUNIOR">ASESOR MEDICO JUNIOR</MenuItem>
<MenuItem value="ANALISTA PLANEACION DE LA DEMANDA">ANALISTA PLANEACION DE LA DEMANDA</MenuItem>
<MenuItem value="GESTOR OPERATIVO DE VACUNACION">GESTOR OPERATIVO DE VACUNACION</MenuItem>

          </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6}>
              <TextField
                name="correo"
                label="Correo"
                type="text"
                value={body.correo}
                onChange={onChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="celular"
                label="Celular"
                type="text"
                value={body.celular}
                onChange={onChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
  <FormControl fullWidth>
      <InputLabel>Tipo de Planta</InputLabel>
      <Select
        name="tipoPlanta"
        value={body.tipoPlanta}
        onChange={e => onChange({ target: { name: 'tipoPlanta', value: e.target.value } })}
        fullWidth
      >
 <MenuItem value="PLANTA APRENDIZ">PLANTA APRENDIZ</MenuItem>
    <MenuItem value="PLANTA FIJA COL">PLANTA FIJA COL</MenuItem>
    <MenuItem value="PLANTA TEMPORAL COL">PLANTA TEMPORAL COL</MenuItem>

      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6}>
  <TextField
    name="tiempoContrato"
    label="Tiempo del contrato"
    type="text"
    value={body.tiempoContrato}
    onChange={onChange}
    fullWidth
    InputLabelProps={{
      shrink: body.tiempoContrato !== '', // El label se moverá solo cuando haya un valor
    }}
  />
</Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="fechaEnvioDocumentos"
                label="Fecha Envio Documentos"
                type="date"
                value={formatDate(body.fechaEnvioDocumentos)}
                onChange={e => onChange({ target: { name: 'fechaEnvioDocumentos', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="solicitudExamenMedico"
                label="Solicitud Examén Médico"
                type="date"
                value={formatDate(body.solicitudExamenMedico)}
                onChange={e => onChange({ target: { name: 'solicitudExamenMedico', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="fechaProgramacionExamenMedico"
                label="Fecha Programación Examén Médico"
                type="date"
                value={formatDate(body.fechaProgramacionExamenMedico)}
                onChange={e => onChange({ target: { name: 'fechaProgramacionExamenMedico', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="fechaConceptoExamenMedico"
                label="Fecha Concepto Examén Médico"
                type="date"
                value={formatDate(body.fechaConceptoExamenMedico)}
                onChange={e => onChange({ target: { name: 'fechaConceptoExamenMedico', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            
            <Grid item xs={12} sm={6}>
              <TextField
                name="fechaProgramacionEstudioAYC"
                label="Fecha Programaciónn Estudio AYC"
                type="date"
                value={formatDate(body.fechaProgramacionEstudioAYC)}
                onChange={e => onChange({ target: { name: 'fechaProgramacionEstudioAYC', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="fechaConceptoEstudioSeguridad"
                label="Fecha Concepto Estudio Seguridad"
                type="date"
                value={formatDate(body.fechaConceptoEstudioSeguridad)}
                onChange={e => onChange({ target: { name: 'fechaConceptoEstudioSeguridad', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="fechaAsignacionAnalista"
                label="Fecha Asignación Analista"
                type="date"
                value={formatDate(body.fechaAsignacionAnalista)}
                onChange={e => onChange({ target: { name: 'fechaAsignacionAnalista', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Hoja de Vida Keralty</InputLabel>
      <Select
        name="hojaVidaKeralty"
        value={body.hojaVidaKeralty}
        onChange={e => onChange({ target: { name: 'hojaVidaKeralty', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid>
           
  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Cédula</InputLabel>
      <Select
        name="cedulaPapel"
        value={body.cedulaPapel}
        onChange={e => onChange({ target: { name: 'cedulaPapel', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Infolaft</InputLabel>
      <Select
        name="infolaft"
        value={body.infolaft}
        onChange={e => onChange({ target: { name: 'infolaft', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Inhabilidades</InputLabel>
      <Select
        name="Inhabilidades"
        value={body.inhabilidades}
        onChange={e => onChange({ target: { name: 'inhabilidades', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Certificado Bancario</InputLabel>
      <Select
        name="certificadoBancario"
        value={body.certificadoBancario}
        onChange={e => onChange({ target: { name: 'certificadoBancario', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
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
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Certificado Pensión</InputLabel>
      <Select
        name="certificadoPension"
        value={body.certificadoPension}
        onChange={e => onChange({ target: { name: 'certificadoPension', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Certificado Cesantías</InputLabel>
      <Select
        name="certificadoCesantias"
        value={body.certificadoCesantias}
        onChange={e => onChange({ target: { name: 'certificadoCesantias', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
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
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Diploma Bachiller</InputLabel>
      <Select
        name="diplomaBachiller"
        value={body.diplomaBachiller}
        onChange={e => onChange({ target: { name: 'diplomaBachiller', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Acta Bachiller</InputLabel>
      <Select
        name="actaBachiller"
        value={body.actaBachiller}
        onChange={e => onChange({ target: { name: 'actaBachiller', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Diploma Pregado</InputLabel>
      <Select
        name="diplomaPregado"
        value={body.actaBadiplomaPregadochiller}
        onChange={e => onChange({ target: { name: 'diplomaPregado', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Acta Pregado</InputLabel>
      <Select
        name="actaPregado"
        value={body.actaPregado}
        onChange={e => onChange({ target: { name: 'actaPregado', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Diploma Posgrado</InputLabel>
      <Select
        name="diplomaPosgrado"
        value={body.diplomaPosgrado}
        onChange={e => onChange({ target: { name: 'diplomaPosgrado', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Acta Posgrado</InputLabel>
      <Select
        name="actaPosgrado"
        value={body.actaPosgrado}
        onChange={e => onChange({ target: { name: 'actaPosgrado', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Resolución de la Secretaria Salud</InputLabel>
      <Select
        name="resolucionSecretariaSalud"
        value={body.resolucionSecretariaSalud}
        onChange={e => onChange({ target: { name: 'resolucionSecretariaSalud', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Tarjeta Profesional</InputLabel>
      <Select
        name="tarjetaProfesional"
        value={body.tarjetaProfesional}
        onChange={e => onChange({ target: { name: 'tarjetaProfesional', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Rethus</InputLabel>
      <Select
        name="rethus"
        value={body.rethus}
        onChange={e => onChange({ target: { name: 'rethus', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Violencia Sexual</InputLabel>
      <Select
        name="violenciaSexual"
        value={body.violenciaSexual}
        onChange={e => onChange({ target: { name: 'violenciaSexual', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Gestión Duelo</InputLabel>
      <Select
        name="gestionDuelo"
        value={body.gestionDuelo}
        onChange={e => onChange({ target: { name: 'gestionDuelo', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Ataques Químicos</InputLabel>
      <Select
        name="ataquesQuimicos"
        value={body.ataquesQuimicos}
        onChange={e => onChange({ target: { name: 'ataquesQuimicos', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Donación Organos</InputLabel>
      <Select
        name="donacionOrganos"
        value={body.donacionOrganos}
        onChange={e => onChange({ target: { name: 'donacionOrganos', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Toma de muestras/ toma citología</InputLabel>
      <Select
        name="tomaMuestrasCitologia"
        value={body.tomaMuestrasCitologia}
        onChange={e => onChange({ target: { name: 'tomaMuestrasCitologia', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Soporte Vital Básico</InputLabel>
      <Select
        name="soporteVitalBasico"
        value={body.soporteVitalBasico}
        onChange={e => onChange({ target: { name: 'soporteVitalBasico', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Soporte Vital Avanzado</InputLabel>
      <Select
        name="soporteVitalAvanzado"
        value={body.soporteVitalAvanzado}
        onChange={e => onChange({ target: { name: 'soporteVitalAvanzado', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>PALS</InputLabel>
      <Select
        name="PALS"
        value={body.PALS}
        onChange={e => onChange({ target: { name: 'PALS', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>NALS</InputLabel>
      <Select
        name="NALS"
        value={body.NALS}
        onChange={e => onChange({ target: { name: 'NALS', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Vacunas Covid</InputLabel>
      <Select
        name="vacunasCovid"
        value={body.vacunasCovid}
        onChange={e => onChange({ target: { name: 'vacunasCovid', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Vacunas Hepatitis</InputLabel>
      <Select
        name="vacunasHepatitis"
        value={body.vacunasHepatitis}
        onChange={e => onChange({ target: { name: 'vacunasHepatitis', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Concepto Médico</InputLabel>
      <Select
        name="conceptoMedico"
        value={body.conceptoMedico}
        onChange={e => onChange({ target: { name: 'conceptoMedico', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid> 

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Concepto Informe Final/ Validación de títulos AYC</InputLabel>
      <Select
        name="conceptoInformeFinal"
        value={body.conceptoInformeFinal}
        onChange={e => onChange({ target: { name: 'conceptoInformeFinal', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  
  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Sintesis</InputLabel>
      <Select
        name="sintesis"
        value={body.sintesis}
        onChange={e => onChange({ target: { name: 'sintesis', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Certificado Inducción</InputLabel>
      <Select
        name="certificadoInduccion"
        value={body.certificadoInduccion}
        onChange={e => onChange({ target: { name: 'certificadoInduccion', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Carga Inhabilidades</InputLabel>
      <Select
        name="cargaInhabilidades"
        value={body.cargaInhabilidades}
        onChange={e => onChange({ target: { name: 'cargaInhabilidades', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="OK">OK</MenuItem>
<MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
<MenuItem value="NO APLICA">NO APLICA</MenuItem>
<MenuItem value="PRELIMINAR">PRELIMINAR</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6}>
              <TextField
                name="observacionesAuxOperativo"
                label="Observaciones Auxiliar Operativo"
                type="text"
                value={body.observacionesAuxOperativo}
                onChange={onChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="fechaIngreso"
                label="Fecha Ingreso"
                type="date"
                value={formatDate(body.fechaIngreso)}
                onChange={e => onChange({ target: { name: 'fechaIngreso', value: e.target.value } })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
      <InputLabel>Estado</InputLabel>
      <Select
        name="estado"
        value={body.estado}
        onChange={e => onChange({ target: { name: 'estado', value: e.target.value } })}
        fullWidth
      >
<MenuItem value="EN PROCESO">EN PROCESO</MenuItem>
<MenuItem value="COMPLETADO">COMPLETADO</MenuItem>
<MenuItem value="ENVIADO CON NOVEDADES">ENVIADO CON NOVEDADES</MenuItem>
<MenuItem value="NO PASA FASE DEL PROCESO">NO PASA FASE DEL PROCESO</MenuItem>
<MenuItem value="DESISTE">DESISTE</MenuItem>

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
    </div>
  );
};

export default ModificarDatosPersonalesPsicologos;









