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
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentPage("home");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentPage("home");
  };

  const renderPage = () => {
    if (!user && ["bookings", "add-booking", "dashboard", "profile"].includes(currentPage)) {
      return <Login onAuth={handleAuth} />;
    }

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
      case "login":
        return <Login onAuth={handleAuth} />;
      case "register":
        return <Register onAuth={handleAuth} />;
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
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onNavigate={setCurrentPage}
          user={user}
          onLogout={logout}
        />
        <div className="p-6">{renderPage()}</div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
