import React from 'react'
import './Navbar.css'
import logo_keralty_final from '../../Assets/logo_keralty_final.png'
import { Link, Outlet } from "react-router-dom";

export default function Navbar() {

  return (
    <div className='navbar'>
        <img src= {logo_keralty_final} alt='' className='logo'/>
        <div>
            <button className='boton_salir'>Cerrar sesión</button>
          </div>
    <Outlet/>
    </div>
  )
}