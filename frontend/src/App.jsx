import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css";
import Home from "./pages/Home";
import Flights from "./pages/Flights";
import Houses from "./pages/Houses";
import Cars from "./pages/Cars";
import Bookings from "./pages/Bookings";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
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
    if (
      !user &&
      ["bookings", "add-booking", "dashboard", "profile"].includes(currentPage)
    ) {
      return <Login onAuth={handleAuth} />;
    }

    switch (currentPage) {
      case "home":
        return <Home onNavigate={setCurrentPage} />;
      case "flights":
        return <Flights />;
      case "houses":
        return <Houses />;
      case "cars":
        return <Cars />;
      case "bookings":
        return <Bookings />;
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
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className={`w-full transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-900"}`}>
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
          user={user}
          onLogout={logout}
        />
        <div className="p-6 animate-fadeIn">{renderPage()}</div>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
      </div>
    </div>
  );
};

export default App;
