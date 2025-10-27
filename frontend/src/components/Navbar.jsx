import { useState } from "react";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className="text-xl p-4 flex justify-between items-center shadow-md
                 text-black dark:text-blue-400
                 bg-cover bg-center transition-all duration-500"
    >
      <h1 className="text-xl font-bold">Hab Booking</h1>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Navigation + Toggle */}
      <div
        className={`flex-col md:flex-row md:flex gap-4 ${
          isOpen ? "flex" : "hidden"
        } md:gap-4 md:items-center`}
      >
        <a href="/" className="hover:text-blue-600 dark:hover:text-blue-300">
          Home
        </a>
        <a
          href="/bookings"
          className="hover:text-blue-600 dark:hover:text-blue-300"
        >
          Bookings
        </a>
        <a
          href="/add-booking"
          className="hover:text-blue-600 dark:hover:text-blue-300"
        >
          Add Booking
        </a>
        <a
          href="/dashboard"
          className="hover:text-blue-600 dark:hover:text-blue-300"
        >
          Dashboard
        </a>
        <a
          href="/profile"
          className="hover:text-blue-600 dark:hover:text-blue-300"
        >
          Profile
        </a>

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