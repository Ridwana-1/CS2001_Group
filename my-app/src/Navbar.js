import React , {useState} from 'react'

import './App.css'
import logo from '../src/Logo.png';

const Navbar = () => {
  return (
    
       <nav>
        
            <img src={logo} alt=""/>
            <ul>
            <li>Home</li>
            <li>Sign Up</li>
            <li>Explore</li>
            <li>Contact Us</li>
            </ul>

       </nav>

       
       

    
  )
}

export default Navbar