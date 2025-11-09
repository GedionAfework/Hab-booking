import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 bg-black text-white text-center p-4 dark:bg-slate-900 dark:text-gray-200">
      <p>&copy; {new Date().getFullYear()} Hab Booking. All rights reserved.</p>
      <div>
        <a href="/privacy" className="hover:text-gray-400 dark:hover:text-gray-300">
          Privacy Policy
        </a>
        <span className="mx-2">|</span>
        <a href="/terms" className="hover:text-gray-400 dark:hover:text-gray-300">
          Terms of Service
        </a>
      </div>
      <div>Eng</div>
    </footer>
  );
};

export default Footer;
