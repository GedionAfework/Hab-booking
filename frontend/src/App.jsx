import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './index.css';
import lightBg from './assets/light-theme-background-4.jpg'; 
import darkBg from './assets/dark-theme-background-3.jpeg'; 
import MainSection from "./components/MainSection";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
      <div
        className="min-h-screen bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url(${darkMode ? darkBg : lightBg})`,
        }}
      >
        <div className="w-full text-black dark:text-white">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Footer />
        </div>
      </div>
  );
};

export default App;