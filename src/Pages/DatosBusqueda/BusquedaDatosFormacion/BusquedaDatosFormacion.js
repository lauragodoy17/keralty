import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button, IconButton, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { format } from 'date-fns';
import './BusquedaDatosFormacion.css';

function BusquedaDatosFormacion() {
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
      user.aprobaciones,
      user.conflictoInteres,
      user.pruebasPsicotecnicas,
      user.entrevistaSeleccion,
      user.informeCorrelacionCargo,
      user.visitaDomiciliaria,
      user.cartaSeguridadSocial, 
      user.infolaft,
      user.fechaConsultaInfolaft,
      user.inhabilidades,
      user.fechaConsultaInhabilidades,
      user.consultaAprendizaje,
      user.cartaPresentacionInstitutoUniversidad,
      user.examenMedicoIngreso, 
      user.reporteCentralesRiesgo,
      user.rethus,
      user.informeFinalEstudioSeguridad,
      user.afiliacionARL,
      user.afilicacionCaja,
      user.afiliacionEPS,
      user.contratoFirmado,
      user.perfilCargoFirmado,
      user.prorroga,
      user.indefinido,
      user.polizaVida,
      user.sustitucionPatronal,
      user.clausulaAdicional,
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
        <h1>BUSQUEDA PARA DATOS DE ÍNDOLE LABORAL </h1>
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
                    <TableCell>APROBACIONES</TableCell>
                    <TableCell>CONFLICTO DE INTERES</TableCell>
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
                    <TableCell>CARTA DE PRESENTACIÓN DEL INSTITUTO O UNIVERSIDAD</TableCell>
                    <TableCell>EXAMÉN MÉDICO DE INGRESO</TableCell>
                    <TableCell>REPORTE CENTRALES DE RIESGO</TableCell>
                    <TableCell>RETHUS</TableCell>
                    <TableCell>INFORME FINAL DE ESTUDIO DE SEGURIDAD</TableCell>
                    <TableCell>AFILIACIÓN ARL</TableCell>
                    <TableCell>AFILIACIÓN CAJA</TableCell>
                    <TableCell>AFILIACIÓN EPS</TableCell>
                    <TableCell>CONTRATO FIRMADO</TableCell>
                    <TableCell>PERFIL DEL CARGO FIRMADO</TableCell>
                    <TableCell>PRORROGA</TableCell>
                    <TableCell>INDEFINIDO</TableCell>
                    <TableCell>POLIZA DE VIDA</TableCell>
                    <TableCell>SUSTITUCIÓN PATRONAL</TableCell>
                    <TableCell>CLAÚSULA ADICIONAL</TableCell>
                    <TableCell>PORCENTAJE DE COMPLETADO</TableCell>
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
                      <TableCell>{user.afiliacionCaja}</TableCell>
                      <TableCell>{user.afiliacionEPS}</TableCell>
                      <TableCell>{user.contratoFirmado}</TableCell>
                      <TableCell>{user.perfilCargoFirmado}</TableCell>
                      <TableCell>{user.prorroga}</TableCell>
                      <TableCell>{user.indefinido}</TableCell>
                      <TableCell>{user.polizaVida}</TableCell>
                      <TableCell>{user.sustitucionPatronal}</TableCell>
                      <TableCell>{user.clausulaAdicional}</TableCell>
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

export default BusquedaDatosFormacion;
