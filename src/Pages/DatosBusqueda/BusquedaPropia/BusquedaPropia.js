import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody } from '@mui/material';
import { format } from 'date-fns';
import './BusquedaPropia.css';

function BusquedaPropia() {
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3080/Registrar');
        if (response.data.rows) {
          setUserList(response.data.rows);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    let filtered = userList;

    if (search) {
      filtered = userList.filter(user => {
        switch (selectedFilter) {
          case 'documento':
            return user.documento.toString().toLowerCase().includes(search.toLowerCase());
          case 'empresa':
            return user.empresa.toLowerCase().includes(search.toLowerCase());
          case 'regional':
            return user.regional.toLowerCase().includes(search.toLowerCase());
          case 'cargo':
            return user.cargo.toLowerCase().includes(search.toLowerCase());
          default:
            return user.documento.toString().toLowerCase().includes(search.toLowerCase()) ||
              user.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
              user.empresa.toLowerCase().includes(search.toLowerCase()) ||
              user.regional.toLowerCase().includes(search.toLowerCase()) ||
              user.cargo.toLowerCase().includes(search.toLowerCase());
        }
      });
    } else {
      filtered = []; 
    }

    setFilteredUsers(filtered);
  }, [search, selectedFilter, userList]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <div className='busqueda-propia-container'>
      <div className='Busqueda_Datos_Personal'>
        <h1>BUSQUEDA PARA DATOS PERSONALES Y ÚNICOS</h1>
        <div className="select-container">
          <label className="estado">Selecciona el campo para búsqueda *</label>
          <select
            className='select'
            name="estado"
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <option value="">- Selecciona uno - </option>
            <option value="documento"> Búsqueda por cédula </option>
            <option value="empresa"> Búsqueda por empresa </option>
            <option value="regional"> Búsqueda por regional </option>
            <option value="cargo"> Búsqueda por cargo </option>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <TableRow key={index}>
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} align="center">
                        No se encontraron resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusquedaPropia;




