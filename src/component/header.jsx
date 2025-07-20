import React, { useState } from 'react';
import Logo from '../assets/images/logo/logo.png';
import { FaRegUser } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { IoMenuOutline } from "react-icons/io5";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-md py-4 relative z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">        
        <div className="md:hidden">
          <button className='border-1 p-2 rounded-full' onClick={() => setMenuOpen(true)}>
            <IoMenuOutline size={24} />
          </button>
        </div>
        <div>
          <img className="h-10" src={Logo} alt="Logo" />
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="/" className="text-white-700 hover:text-blue-600">Home</a>
          <a href="/prodcut" className="text-white-700 hover:text-blue-600">Product</a>
          <a href="/contact" className="text-white-700 hover:text-blue-600">Contact</a>
        </nav>
        <div>
          <button
            className="hidden md:inline-block border-1 p-3 rounded-full"
            onClick={() => setUserMenuOpen(true)}>
            <FaRegUser size={22} />
          </button>
          <span className="inline-block md:hidden border-1 p-3 rounded-full">
            <FaRegUser size={22} />
          </span>
        </div>
      </div>
      <div className={`fixed top-0 left-0 h-full w-2/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end p-4">
          <button className='text-black' onClick={() => setMenuOpen(false)}>
            <IoCloseOutline size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-6 px-6">
          <a href="/" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/prodcut" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Product</a>
          <a href="/contact" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </div>
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out hidden md:block ${userMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end p-4">
          <button className='text-black' onClick={() => setUserMenuOpen(false)}>
            <IoCloseOutline size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-4 px-6">
          <a href="" className="text-gray-700 hover:text-blue-600" onClick={() => setUserMenuOpen(false)}>Login</a>
          <a href="" className="text-gray-700 hover:text-blue-600" onClick={() => setUserMenuOpen(false)}>Register</a>
          <a href="" className="text-gray-700 hover:text-blue-600" onClick={() => setUserMenuOpen(false)}>My Account</a>
        </div>
      </div>
    </header>
  );
}

export default Header;
