import React, { useState } from "react";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";

export default function Navbar({ darkMode, toggleDarkMode, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="text-xl p-4 flex justify-between items-center shadow-md bg-cover bg-center transition-all duration-500 text-yellow-100">
      <h1 className="text-xl font-bold">Hab Booking</h1>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>{isOpen ? "X" : "☰"}</button>
      </div>

      {/* Navigation */}
      <div
        className={`flex-col md:flex-row md:flex gap-4 ${
          isOpen ? "flex" : "hidden"
        } md:gap-4 md:items-center`}
      >
        <button onClick={() => onNavigate("home")}>Home</button>
        <button onClick={() => onNavigate("flights")}>Flights</button>
        <button onClick={() => onNavigate("houses")}>Houses</button>
        <button onClick={() => onNavigate("cars")}>Cars</button>
        <button onClick={() => onNavigate("bookings")}>Bookings</button>
        <button onClick={() => onNavigate("add-booking")}>Add Booking</button>
        <button onClick={() => onNavigate("dashboard")}>Dashboard</button>
        <button onClick={() => onNavigate("profile")}>Profile</button>

        {/* Dark/Light Mode Switch */}
        <div
          onClick={toggleDarkMode}
          className="cursor-pointer w-16 h-8 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300"
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transform transition-transform duration-300 ${
              darkMode
                ? "translate-x-0 bg-gray-800 text-white"
                : "translate-x-8 bg-yellow-400 text-black"
            }`}
          >
            {darkMode ? <FaMoon size={14} /> : <FaSun size={14} />}
          </div>
        </div>
      </div>
    </nav>
  );
}
