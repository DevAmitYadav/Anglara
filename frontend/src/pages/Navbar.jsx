import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { LogOut, User, Settings, Briefcase, Home, Search, ClipboardList, LogIn, UserPlus } from 'lucide-react';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust threshold as needed
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Change background color based on scroll state
  const navbarBg = scrolled ? "#000" : "#1a1a1a";

  return (
    <nav
      style={{
        backgroundColor: navbarBg,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 100,
      }}
      className="shadow-md transition-colors duration-300"
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Left: Modern Logo and Navigation Links */}
        <div className="flex items-center space-x-8">
          {/* Modern Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* Custom SVG Icon with golden gradient */}
            <span className="text-2xl font-bold text-[#f5f5f5] hover:text-[#ffd700]">
              ANGLARA
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center text-[#f5f5f5] hover:text-[#ffd700] hover:underline">
              <Home size={18} className="mr-1" />
              Home
            </Link>
          </div>
        </div>

        {/* Right: Action Links & Profile Dropdown */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="flex items-center px-4 py-2 bg-[#333] text-[#f5f5f5] rounded hover:bg-[#444] transition-colors"
          >
            <LogIn size={16} className="mr-1" />
            Login
          </Link>
          <Link
            to="/register"
            className="flex items-center px-4 py-2 border border-[#333] text-[#f5f5f5] rounded hover:bg-[#444] transition-colors"
          >
            <UserPlus size={16} className="mr-1" />
            Sign Up
          </Link>
          <Popover>
            <PopoverTrigger className="flex items-center focus:outline-none">
              <User size={24} className="text-[#f5f5f5] hover:text-[#ffd700]" />
            </PopoverTrigger>
            <PopoverContent className="bg-[#333] shadow-md rounded-md w-48 p-2 border border-[#444] mt-5">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 text-[#f5f5f5] hover:bg-[#444] transition-colors"
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 px-4 py-2 text-[#f5f5f5] hover:bg-[#444] transition-colors"
              >
                <Settings size={18} />
                <span>Admin Panel</span>
              </Link>

              {isLoggedIn && (
                <>
                  <hr className="my-2 border-[#444]" />
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-[#444] text-[#ff5f5f] w-full text-left transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
