import React, { useState } from "react";
import {
  IoAirplaneOutline,
  IoCarSportOutline,
  IoHomeOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoPersonCircleOutline,
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
            className={`text-sm text-gray-900 transition-all duration-300 hover:scale-105 ${isMobile ? "w-full justify-start" : ""} ${
              active ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" : "hover:bg-gray-50 hover:text-blue-600"
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
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-md transition-all duration-300">
      <div className="w-full flex h-16 items-center justify-between px-4">
        <button
          onClick={() => handleNavigate("home")}
          className="flex items-center gap-2 text-lg font-bold text-gray-900 transition-all duration-300 hover:scale-105"
        >
          <IoAirplaneOutline className="text-2xl transition-transform duration-300 hover:rotate-12" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
                className="text-sm text-gray-900 transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:text-blue-600"
              >
                <IoLogInOutline className="mr-2 text-base" /> Login
              </Button>
              <Button 
                variant="default" 
                size="default"
                onClick={() => handleNavigate("register")}
                className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl"
              >
                Create account
              </Button>
            </>
          )}
          {user && (
            <>
              <span className="whitespace-nowrap rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-900 transition-all duration-300">
                Hi, {getFirstName(user.name)}
              </span>
              <Button 
                variant="ghost" 
                size="default"
                onClick={onLogout}
                className="text-sm text-gray-900 transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:text-red-600"
              >
                <IoLogOutOutline className="mr-2 text-base" /> Logout
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobile}
            className="text-gray-800 transition-all duration-300 hover:scale-110"
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
        <div className="border-t border-gray-200 bg-white px-4 pb-4 transition-all duration-300 animate-slideDown md:hidden">
          <div className="flex flex-col gap-2 py-4">
            {renderNavItems(true)}
            {!user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavigate("login")} 
                  className="justify-start text-base text-gray-800 transition-all duration-300 hover:bg-gray-50 hover:text-blue-600"
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
                <div className="rounded-lg bg-gray-50 px-3 py-2 text-base font-semibold text-gray-800">
                  Hi, {getFirstName(user.name)}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={onLogout} 
                  className="justify-start text-base text-red-600 transition-all duration-300 hover:bg-red-50 hover:text-red-700"
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
