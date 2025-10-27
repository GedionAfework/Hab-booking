import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center p-4 mt-10">
      <p>&copy; {new Date().getFullYear()} Hab Booking. All rights reserved.</p>
      <div>
        <a href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-300">
          Privacy Policy
        </a>
        <span className="mx-2">|</span>
        <a href="/terms" className="hover:text-blue-600 dark:hover:text-blue-300">
          Terms of Service
        </a>
      </div>
      <div>Eng</div>
    </footer>
  );
};

export default Footer;
