import React, { useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../store";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isConnected = useStore((state) => state.isConnected);
  const contractAddress = useStore((state) => state.contractAddress);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getLinkClasses = (path) => {
    const baseClasses =
      "flex items-center space-x-2 text-base font-medium px-4 py-2 rounded-xl transition-all duration-300";
    const isActive = window.location.pathname === path;
    return `${baseClasses} ${
      isActive
        ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-md"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`;
  };

  const navItems = [
    {
      text: "Home",
      path: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      requiresConnection: false,
      requiresContract: false,
    },
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      requiresConnection: true,
      requiresContract: true,
    },
    {
      text: "New Transaction",
      path: "/new-transaction",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      requiresConnection: true,
      requiresContract: true,
    },
    {
      text: "Transactions",
      path: "/list-transactions",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      requiresConnection: true,
      requiresContract: true,
    },
  ];

  return (
    <header className="bg-gray-900/95 backdrop-blur-md text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 hover:scale-105 transition-transform"
        >
          MultiSig DApp
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-3">
          {navItems.map((item) => {
            const shouldRender =
              (!item.requiresConnection || isConnected) &&
              (!item.requiresContract || contractAddress);

            return (
              shouldRender && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClasses(item.path)}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </Link>
              )
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden bg-gray-800/95 backdrop-blur-lg mt-2 mx-3 rounded-xl shadow-lg animate-fade-in">
          {navItems.map((item) => {
            const shouldRender =
              (!item.requiresConnection || isConnected) &&
              (!item.requiresContract || contractAddress);

            return (
              shouldRender && (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-5 py-3 text-base text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-300"
                  onClick={toggleMenu}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </Link>
              )
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default Header;
