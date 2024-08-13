import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import RequireAuth from './Components/RequireAuth';
import Layout from './Components/Layout';
import { AuthProvider } from './Context/AuthProvider';
import Header from './Components/Header/Header';
import Inicio from './Pages/Inicio/Inicio';
import Registro from './Pages/Registro/Registro';
import Selecciona from './Pages/Selecciona/Selecciona';
import Busqueda from './Pages/Busqueda/Busqueda';
import BusquedaPropia from './Pages/DatosBusqueda/BusquedaPropia/BusquedaPropia';
import ModificarDatosPersonales from './Pages/DatosModificar/ModificarDatosPersonales/ModificarDatosPersonales';
import Registrar from './Pages/Registrar/Registrar';
import Home from './Pages/Home/Home'
import Modificar from './Pages/Modificar/Modificar';
import NoAutorizado from './Pages/NoAutorizado/NoAutorizado';
import PerfilCinco from './Pages/PerfilCinco/PerfilCinco';
import PerfilSeis from './Pages/PerfilSeis/PerfilSeis';
import PerfilSiete from './Pages/PerfilSiete/PerfilSiete';
import Navbar from './Components/Navbar/Navbar';
import Estadistica from './Pages/Estadistica/Estadistica';
import DatosRegistroPersonales from './Pages/DatosRegistro/DatosRegistroPersonales';

function AppContent() {
  const location = useLocation();

  const headerRoutes = ['/home', '/inicio', '/registro','/'];
  const navbarRoutes=['/selecciona', '/busqueda', '/busquedaPropia', '/modificar', '/registrarbus', '/perfilcinco', '/perfilseis', '/perfilsiete', '/estadistica','/registrar']
  return (
    <div>
      {headerRoutes.includes(location.pathname.toLowerCase()) && <Header />}
      {navbarRoutes.includes(location.pathname.toLowerCase()) && <Navbar />}

      <Routes>
          <Route path='/' element={<Layout />}>
            {/* Rutas públicas */}
            <Route path='/' element={<Home />} />
            <Route path='Inicio' element={<Inicio />} />
            <Route path='Registro' element={<Registro />} />
            <Route path='NoAutorizado' element={<NoAutorizado/>}/>
            {/* Rutas privadas - Admin */}

              <Route path='Selecciona' element={<Selecciona />} />
              <Route path='Busqueda' element={<Busqueda />} />
              <Route path='BusquedaPropia' element={<BusquedaPropia />} />
              <Route path='Modificar' element={<Modificar/>}/>
              <Route path='ModificarDatosPersonales' element={<ModificarDatosPersonales />} />
              <Route path='Registrar' element={<Registrar />} />
              <Route path='PerfilCinco' element={<PerfilCinco/>}/>
              <Route path='PerfilSeis' element={<PerfilSeis/>}/>
              <Route path='PerfilSiete' element={<PerfilSiete/>}/>
              <Route path='Estadistica' element={<Estadistica/>}/>
              <Route path='RegistrarDatosUnicos' element={<DatosRegistroPersonales/>}/>

              <Route path='Busqueda' element={<Busqueda />} />
              <Route path='BusquedaPropia' element={<BusquedaPropia />} />

          </Route>
      </Routes>
    </div>
  );
}
function App() {

  return (
    
      <Router>
        <AppContent />

      </Router>
  );
}

export default App;

