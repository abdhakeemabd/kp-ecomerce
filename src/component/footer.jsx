import React from 'react'
import Logo from '../assets/images/logo/logo.png';
import { MdLocationOn } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";


import { Link } from 'react-router-dom'
function Footer() {
  return (
    <footer className='bg-gray-500 text-white'>
        <div className="container">
            <div className='flex flex-wrap'>
                <div className='w-full lg:w-1/4 md:w-1/3 sm:w-1/2 ps-3 lg:pe-6 pe-3 mb-3 lg:mb-0'>
                    <img className='max-w-30' src={Logo} alt="Logo" />
                    <div className='font-medium text-justify text-white'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam ducimus veniam quod eius voluptatibus illo libero, distinctio fuga consectetur reprehenderit eveniet molestiae, ullam architecto laborum obcaecati sit exercitationem ut debitis!
                    </div>
                </div>
                <div className='w-full lg:w-1/4 md:w-1/3 sm:w-1/2 lg:px-5 px-3 mt-2 mb-3 lg:mb-0'>
                    <div className='poppins-semibold text-xl text-white'>Quick links</div>
                    <ul className=''>
                        <li className="hover:font-medium transition duration-200 my-3">
                          <Link to="/about" className="text-base text-white hover:text-amber-500">
                            About
                          </Link>
                        </li>
                        <li className="hover:font-medium transition duration-200 my-3">
                          <Link to="/product" className="text-base text-white hover:text-amber-500">
                            Product
                          </Link>
                        </li>
                        <li className="hover:font-medium transition duration-200 my-3">
                          <Link to="/contact" className="text-base text-white hover:text-amber-500">
                            Contact
                          </Link>
                        </li>
                        <li className="hover:font-medium transition duration-200 my-3">
                          <Link to="/faq" className="text-base text-white hover:text-amber-500">
                            Faq
                          </Link>
                        </li>
                    </ul>
                </div>
                <div className='w-full lg:w-1/4 md:w-1/3 sm:w-1/2 lg:px-5 px-3 mt-2 mb-3 lg:mb-0'>
                    <div className="poppins-semibold text-xl text-white">Categories</div>
                    <ul className=''>
                        <li className="hover:font-medium transition duration-200 my-3">
                          <Link to="/about" className="text-base text-white hover:text-amber-500">
                            Chair
                          </Link>
                        </li>
                        <li className="hover:font-medium transition duration-200 my-3">
                          <Link to="/product" className="text-base text-white hover:text-amber-500">
                            Stool
                          </Link>
                        </li>
                        <li className="hover:font-medium transition duration-200 my-3">
                          <Link to="/contact" className="text-base text-white hover:text-amber-500">
                            Table
                          </Link>
                        </li>
                        <li className="hover:font-medium transition duration-200 my-3">
                          <Link to="/faq" className="text-base text-white hover:text-amber-500">
                            Cupboard
                          </Link>
                        </li>
                    </ul>
                </div>
                <div className='w-full lg:w-1/4 md:w-1/3 sm:w-1/2 lg:px-5 px-3 mt-2'>
                    <div className="poppins-semibold text-xl text-white">Address</div>
                    <ul>
                        <li className='flex mt-3 gap-3'>
                           <div className='mt-1 text-xl'> <MdLocationOn/></div>
                            <div className='text-1xl'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis maiores blanditiis ab impedit corporis deserunt delectus nihil veniam rem nam.</div>
                        </li>
                        <li className="flex mt-3 gap-3 content-start">
                            <div className='mt-1 text-xl'><FaPhone/></div>
                            <a className='text-1xl text-base text-white hover:text-amber-500' href="tel:8606065001">+91 8606065001</a>
                        </li>
                         <li className="flex mt-3 gap-3 content-start">
                            <div className='mt-1 text-xl'><IoIosMail/></div>
                            <a className='text-1xl text-base text-white hover:text-amber-500' href="mailto:admin@kppcs.com">admin@kppcs.com</a>
                        </li>
                    </ul>
                </div>
                
            </div>
        </div>
    </footer>
  )
}

export default Footer