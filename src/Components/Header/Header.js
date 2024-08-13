import React from 'react'
import './Header.css'
import logo_keralty_final from '../../Assets/logo_keralty_final.png'
import { Link, Outlet } from "react-router-dom";

export default function Header() {

  return (
    <div className='header'>
        <img src= {logo_keralty_final} alt='' className='logo'/>

        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/inicio">Iniciar</Link>
            </li>
            <li>
                <Link to="/registro">Registro</Link>
            </li>
        </ul>
    <hr/>
    <Outlet/>
    </div>
  )
}
