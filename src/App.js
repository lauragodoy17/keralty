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
import IngresoSeleccion from './Pages/IngresoSeleccion/IngresoSeleccion';
import BusquedaPsicologos from './Pages/BusquedaPsicologos/BusquedaPsicologos';
import ModificarDatosPersonalesPsicologos from './Pages/ModificarDatosPersonalesPsicologos/ModificarDatosPersonalesPsicologos';
import ModificarPsicologos from './Pages/ModificarPsicologos/ModificarPsicologos';
import PerfilContratador from './Pages/PerfilContratador/PerfilContratador';
import IngresoContratador from './Pages/IngresoContratador/IngresoContratador';
import PerfilGestion from './Pages/PerfilGestion/PerfilGestion';
import IngresoGestion from './Pages/IngresoGestion/IngresoGestion';
import ModificarGestion from './Pages/ModificarGestion/ModificarGestion';
import PerfilSeleccion from './Pages/PerfilSeleccion/PerfilSeleccion';
import BusquedaGestion from './Pages/BusquedaGestion/BusquedaGestion';
import DatosPersonalesGestion from './Pages/DatosPersonalesGestion/DatosPersonalesGestion';
import ModificarContratador from './Pages/ModificarContratador/ModificarContratador';
import BusquedaContratacion from './Pages/BusquedaContratacion/BusquedaContratacion';

function AppContent() {
  const location = useLocation();

  const headerRoutes = ['/home', '/inicio', '/registro','/'];
  const navbarRoutes=['/selecciona', '/busqueda', '/busquedaPropia', '/modificar', '/registrarbus', '/perfilcinco', '/perfilseis', '/perfilsiete', '/estadistica','/registrar', '/perfilseleccion', '/ingresoseleccion', '/busquedapsicologos', '/modificarpsicologos', '/perfilcontratador', '/ingresocontratador', '/perfilgestion', '/ingresogestion', '/modificargestion', '/busquedagestion', '/modificarcontratador', '/busquedacontratacion',]
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
              <Route path='PerfilGestion' element={<PerfilGestion/>}/>
              <Route path='PerfilSeleccion' element={<PerfilSeleccion/>}/>


              <Route path='Estadistica' element={<Estadistica/>}/>
              <Route path='RegistrarDatosUnicos' element={<DatosRegistroPersonales/>}/>
              <Route path='PerfilContratador' element={<PerfilContratador/>}/>
              <Route path='PerfilSelecciPerfilContratadoron' element={<PerfilSeleccion/>}/>

              <Route path='IngresoSeleccion' element={<IngresoSeleccion/>}/>
              <Route path='IngresoContratador' element={<IngresoContratador/>}/>
              <Route path='IngresoGestion' element={<IngresoGestion/>}/>


              <Route path='BusquedaPsicologos' element={<BusquedaPsicologos />} />
              <Route path='ModificarDatosPersonalesPsicologos' element={<ModificarDatosPersonalesPsicologos />} />
              <Route path='ModificarPsicologos' element={<ModificarPsicologos/>}/>
              <Route path='ModificarGestion' element={<ModificarGestion/>}/>
              <Route path='ModificarContratador' element={<ModificarContratador/>}/>


              <Route path='DatosPersonalesGestion' element={<DatosPersonalesGestion/>}/>



              <Route path='Busqueda' element={<Busqueda />} />
              <Route path='BusquedaPropia' element={<BusquedaPropia />} />
              <Route path='BusquedaGestion' element={<BusquedaGestion />} />
              <Route path='BusquedaContratacion' element={<BusquedaContratacion />} />



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

