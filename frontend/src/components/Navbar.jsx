import React, { useState } from "react";
import {
  IoAirplaneOutline,
  IoCarSportOutline,
  IoHomeOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoMoonOutline,
  IoPersonCircleOutline,
  IoSunnyOutline,
  IoCloseOutline,
  IoCalendarOutline,
  IoSpeedometerOutline,
} from "react-icons/io5";
import { Button } from "./ui";

const navItems = [
  { key: "home", label: "Home", icon: IoHomeOutline },
  { key: "flights", label: "Flights", icon: IoAirplaneOutline },
  { key: "houses", label: "Houses", icon: IoHomeOutline },
  { key: "cars", label: "Cars", icon: IoCarSportOutline },
  { key: "bookings", label: "Bookings", icon: IoCalendarOutline },
  { key: "dashboard", label: "Dashboard", icon: IoSpeedometerOutline },
  { key: "profile", label: "Profile", icon: IoPersonCircleOutline },
];

export default function Navbar({
  darkMode,
  toggleDarkMode,
  onNavigate,
  currentPage = "home",
  user,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const handleNavigate = (page) => {
    onNavigate?.(page);
    setMobileOpen(false);
  };

  const renderNavItems = (isMobile = false) => (
    navItems
      .filter((item) =>
        user ? true : ["home", "flights", "houses", "cars", "login", "register"].includes(item.key)
      )
      .map((item) => {
        const Icon = item.icon;
        const active = currentPage === item.key;
        return (
          <Button
            key={item.key}
            variant={active ? "outline" : "ghost"}
            size="default"
            className={`text-sm transition-all duration-300 hover:scale-105 ${isMobile ? "w-full justify-start" : ""} ${
              active 
                ? darkMode 
                  ? "bg-gray-800 text-white border-gray-700 shadow-md" 
                  : "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                : darkMode
                ? "text-white hover:text-gray-200 hover:bg-gray-800"
                : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
            }`}
            onClick={() => handleNavigate(item.key)}
          >
            <Icon className={`mr-2 text-base transition-transform duration-300 ${active ? "scale-110 rotate-3" : "hover:rotate-6"}`} />
            {item.label}
          </Button>
        );
      })
  );

  const getFirstName = (fullName) => {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  };

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      darkMode 
        ? "bg-gray-900 border-gray-800 shadow-lg shadow-gray-900/50" 
        : "bg-white border-gray-200 shadow-md"
    }`}>
      <div className="w-full flex h-16 items-center justify-between px-4">
        <button
          onClick={() => handleNavigate("home")}
          className={`flex items-center gap-2 text-lg font-bold transition-all duration-300 hover:scale-105 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <IoAirplaneOutline className="text-2xl transition-transform duration-300 hover:rotate-12" />
          <span className={`bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300`}>
            Hab Booking
          </span>
        </button>

        <div className="hidden items-center gap-4 md:flex">
          {renderNavItems()}
          {!user && (
            <>
              <Button 
                variant="ghost" 
                size="default"
                onClick={() => handleNavigate("login")}
                className={`text-sm transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? "text-white hover:text-gray-200 hover:bg-gray-800" 
                    : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <IoLogInOutline className="mr-2 text-base" /> Login
              </Button>
              <Button 
                variant="default" 
                size="default"
                onClick={() => handleNavigate("register")}
                className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create account
              </Button>
            </>
          )}
          {user && (
            <>
              <span className={`text-sm font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? "text-white bg-gray-800" 
                  : "text-gray-900 bg-gray-50"
              }`}>
                Hi, {getFirstName(user.name)}
              </span>
              <Button 
                variant="ghost" 
                size="default"
                onClick={onLogout}
                className={`text-sm transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? "text-white hover:text-gray-200 hover:bg-gray-800" 
                    : "text-gray-900 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                <IoLogOutOutline className="mr-2 text-base" /> Logout
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            className={`transition-all duration-300 hover:scale-110 hover:rotate-12 ${
              darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-gray-800 hover:text-gray-900"
            }`}
          >
            {darkMode ? <IoSunnyOutline className="text-2xl" /> : <IoMoonOutline className="text-2xl" />}
          </Button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            className={`transition-all duration-300 hover:scale-110 ${
              darkMode ? "text-yellow-400" : "text-gray-600"
            }`}
          >
            {darkMode ? <IoSunnyOutline className="text-2xl" /> : <IoMoonOutline className="text-2xl" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobile}
            className={`transition-all duration-300 hover:scale-110 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {mobileOpen ? (
              <IoCloseOutline className="text-2xl transition-transform duration-300 rotate-90" />
            ) : (
              <IoMenuOutline className="text-2xl" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className={`border-t transition-all duration-300 animate-slideDown ${
          darkMode 
            ? "border-gray-800 bg-gray-900" 
            : "border-gray-200 bg-white"
        } px-4 pb-4 md:hidden`}>
          <div className="flex flex-col gap-2 py-4">
            {renderNavItems(true)}
            {!user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavigate("login")} 
                  className={`justify-start text-base transition-all duration-300 ${
                    darkMode 
                      ? "text-white hover:text-gray-200 hover:bg-gray-800" 
                      : "text-gray-800 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <IoLogInOutline className="mr-2 text-lg" /> Login
                </Button>
                <Button 
                  onClick={() => handleNavigate("register")} 
                  className="justify-start text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
                >
                  Create account
                </Button>
              </>
            ) : (
              <>
                <div className={`px-3 py-2 text-base font-semibold rounded-lg ${
                  darkMode 
                    ? "text-white bg-gray-800" 
                    : "text-gray-800 bg-gray-50"
                }`}>
                  Hi, {getFirstName(user.name)}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={onLogout} 
                  className={`justify-start text-base transition-all duration-300 ${
                    darkMode 
                      ? "text-red-400 hover:text-red-300 hover:bg-gray-800" 
                      : "text-red-600 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  <IoLogOutOutline className="mr-2 text-lg" /> Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
