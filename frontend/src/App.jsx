import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './index.css';
import lightBg from './assets/light-theme-background-4.jpg'; // Adjusted path
import darkBg from './assets/dark-theme-background.jpg'; // Adjusted path
// import ProtectedRoute from "./components/ProtectedRoute";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Bookings from "./pages/Bookings";
// import AddBooking from "./pages/AddBooking";
// import BookingDetails from "./pages/BookingDetails";
// import Profile from "./pages/Profile";
// import Dashboard from "./pages/Dashboard";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    // Toggle the 'dark' class on <html> and save preference to localStorage
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
        <div className="w-full">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

          {/* Uncomment when ready to use routes */}
          {/* <main className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-booking"
                element={
                  <ProtectedRoute>
                    <AddBooking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/:id"
                element={
                  <ProtectedRoute>
                    <BookingDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main> */}

          <Footer />
        </div>
      </div>
  );
};

export default App;