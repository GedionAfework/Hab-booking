import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css";
import lightBg from "./assets/light-theme-background-4.jpg";
import darkBg from "./assets/dark-theme-background-3.jpeg";
import Home from "./pages/Home";
import Flights from "./pages/Flights";
import Houses from "./pages/Houses";
import Cars from "./pages/Cars";
import Bookings from "./pages/Bookings";
import AddBooking from "./pages/AddBooking";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [currentPage, setCurrentPage] = useState("home"); // Track current page

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Function to render the current page
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "flights":
        return <Flights />;
      case "houses":
        return <Houses />;
      case "cars":
        return <Cars />;
      case "bookings":
        return <Bookings />;
      case "add-booking":
        return <AddBooking />;
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${darkMode ? darkBg : lightBg})` }}
    >
      <div className="w-full text-black dark:text-white">
        {/* Pass setCurrentPage to Navbar to handle navigation */}
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onNavigate={setCurrentPage}
        />

        <div className="p-6">{renderPage()}</div>

        <Footer />
      </div>
    </div>
  );
};

export default App;
