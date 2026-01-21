import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo/logo.png';
import { FaRegUser } from "react-icons/fa6";
import { IoCloseOutline, IoMenuOutline } from "react-icons/io5";
import Modal from 'react-modal';
import OtpInput from 'react-otp-input';
import Product1 from '../assets/images/img/1.webp';

Modal.setAppElement('#root');

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalOpenAnimation, setModalOpenAnimation] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const userMenuRef = useRef();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Modal controls
  const openModal = () => setIsOpen(true);
  const afterOpenModal = () => setTimeout(() => setModalOpenAnimation(true), 10);
  const closeModal = () => {
    setIsOpen(false);
    setModalOpenAnimation(false);
    setIsOtpMode(false);
    setPhone('');
    setOtp('');
  };

  const handleRequestOtp = () => {
    const indianPhoneRegex = /^[1-9][0-9]{9}$/;
    if (indianPhoneRegex.test(phone)) {
      setIsOtpMode(true);
    } else {
      alert("Please enter a valid 10-digit Indian phone number that doesn't start with 0.");
    }
  };

  return (
    <header className="bg-white shadow-md py-4 relative z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="border p-2 rounded-full" onClick={() => setMenuOpen(true)}>
            <IoMenuOutline size={24} />
          </button>
        </div>

        {/* Logo */}
        <Link to="/">
          <img className="h-10" src={Logo} alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-white hover:text-orange-500">Home</Link>
          <Link to="/product" className="text-white hover:text-orange-500">Product</Link>
          <Link to="/contact" className="text-white hover:text-orange-500">Contact</Link>
        </nav>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button className="border p-2 md:p-3 rounded-full" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <FaRegUser size={22} />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="flex flex-col gap-2 p-4">
                <button onClick={() => { openModal(); setUserMenuOpen(false); }} className="text-left text-gray-700 hover:text-orange-500">Login</button>
                <button onClick={() => { openModal(); setUserMenuOpen(false); }} className="text-left text-gray-700 hover:text-orange-500">Register</button>
                <Link
                  to="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="text-left text-gray-700 hover:text-orange-500"
                >
                  My Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Side Drawer */}
      <div className={`fixed top-0 left-0 h-full w-2/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end p-4">
          <button className="text-black" onClick={() => setMenuOpen(false)}>
            <IoCloseOutline size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-6 px-6">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-500">Home</Link>
          <Link to="/product" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-500">Product</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-500">Contact</Link>
        </nav>
      </div>

      {/* Modal for Login / OTP */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => {
          setModalOpenAnimation(false);
          setTimeout(closeModal, 300);
        }}
        className={`relative w-full max-w-4xl mx-auto p-0 bg-white rounded-lg shadow-lg transform transition-all duration-300 ease-out overflow-hidden ${modalOpenAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        contentLabel="Login Modal"
      >
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:block md:w-1/2 bg-gray-200">
            <img src={Product1} alt="Modal Visual" className="w-full h-full object-cover" />
          </div>
          <div className="w-full md:w-1/2 p-6 relative">
            <button
              className="absolute right-3 top-3 text-black hover:text-gray-600"
              onClick={() => {
                setModalOpenAnimation(false);
                setTimeout(closeModal, 300);
              }}
            >
              <IoCloseOutline className="text-2xl" />
            </button>

            {!isOtpMode ? (
              <>
                <h2 className="text-xl font-semibold mb-2 mt-6">Hello, Welcome back!</h2>
                <p className="text-md mb-4">We will send you a confirmation code to your phone number</p>
                <label htmlFor="phone-number" className="block mb-1 font-medium">WhatsApp Number</label>
                <input
                  id="phone-number"
                  className="border border-gray-300 p-2 w-full rounded mb-4"
                  placeholder="Enter your phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg w-full"
                  onClick={handleRequestOtp}
                >
                  Request OTP
                </button>
              </>
            ) : (
              <>
                <p className="text-md mb-2 font-semibold mt-6">
                  We are automatically detecting a SMS sent to your WhatsApp number ******{phone.slice(-4)}
                </p>
                <h3 className="text-lg font-semibold mb-2">Enter Verification Code</h3>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => <input {...props} />}
                  inputStyle={{
                    width: "2.5rem",
                    height: "2.5rem",
                    margin: "0 0.25rem",
                    fontSize: "1.25rem",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                  containerStyle="justify-center mb-4"
                />
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded w-full mt-2"
                  type="button"
                  onClick={() => alert("OTP Submitted: " + otp)}
                >
                  Verify OTP
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </header>
  );
}

export default Header;
