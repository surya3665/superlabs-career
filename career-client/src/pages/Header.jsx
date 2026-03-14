import React, { useState } from "react"
import logo from "../assets/logo.png"


const Navbar = () => {


  return (
    <nav className='bg-white h-16 px-6 py-3 flex items-center justify-between shadow-md relative'>
      <div className='flex items-center space-x-4'>
        <a
          href='https://superlabs.co/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <img src={logo} alt='superlabs-logo' className='w-32 h-auto' />
        </a>
      </div>

      {/* <ul className='hidden lg:flex space-x-6 text-gray-700 font-semibold'>
        <li>Work</li>
        <li>Services</li>
        <li>Strategy</li>
        <li>Careers</li>
      </ul> */}

      {/* <div className='lg:hidden'>
        <button onClick={toggleMenu} className='focus:outline-none'>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className='absolute top-full left-0 w-full bg-white shadow-lg lg:hidden z-10'>
          <ul className='flex flex-col items-start space-y-4 p-4 text-gray-700 font-medium'>
            <li onClick={toggleMenu}>Work</li>
            <li onClick={toggleMenu}>Services</li>
            <li onClick={toggleMenu}>Strategy</li>
            <li onClick={toggleMenu}>Careers</li>
          </ul>
        </div>
      )} */}
    </nav>
  )
}

export default Navbar


