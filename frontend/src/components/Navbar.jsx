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
            size="sm"
            className={`${isMobile ? "w-full justify-start" : ""} ${active ? "bg-white/90" : ""}`}
            onClick={() => handleNavigate(item.key)}
          >
            <Icon className="mr-2 text-lg" />
            {item.label}
          </Button>
        );
      })
  );

  return (
    <nav className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <button
          onClick={() => handleNavigate("home")}
          className="flex items-center gap-2 text-lg font-semibold text-blue-700"
        >
          <IoAirplaneOutline className="text-2xl" />
          Hab Booking
        </button>

        <div className="hidden items-center gap-2 md:flex">
          {renderNavItems()}
          {!user && (
            <>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate("login")}
                className="text-gray-600">
                <IoLogInOutline className="mr-2 text-lg" /> Login
              </Button>
              <Button variant="default" size="sm" onClick={() => handleNavigate("register")}
                className="bg-blue-600 text-white hover:bg-blue-500">
                Create account
              </Button>
            </>
          )}
          {user && (
            <>
              <span className="text-sm font-semibold text-gray-600">Hi, {user.name}</span>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <IoLogOutOutline className="mr-2 text-lg" /> Logout
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-gray-500">
            {darkMode ? <IoSunnyOutline className="text-lg" /> : <IoMoonOutline className="text-lg" />}
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-gray-500">
            {darkMode ? <IoSunnyOutline className="text-lg" /> : <IoMoonOutline className="text-lg" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMobile}>
            {mobileOpen ? <IoCloseOutline className="text-xl" /> : <IoMenuOutline className="text-xl" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/20 bg-white/95 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-2 py-4">
            {renderNavItems(true)}
            {!user ? (
              <>
                <Button variant="ghost" onClick={() => handleNavigate("login")} className="justify-start">
                  <IoLogInOutline className="mr-2 text-lg" /> Login
                </Button>
                <Button onClick={() => handleNavigate("register")} className="justify-start bg-blue-600 text-white hover:bg-blue-500">
                  Create account
                </Button>
              </>
            ) : (
              <Button variant="ghost" onClick={onLogout} className="justify-start text-rose-600">
                <IoLogOutOutline className="mr-2 text-lg" /> Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
