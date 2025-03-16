import React from "react";

const Footer = () => {
  return (
    <footer className="relative w-full px-6 py-10 bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand */}
          <div>
            <h5 className="text-2xl font-semibold tracking-wide text-white">
              Anglara
            </h5>
            <p className="mt-2 text-sm text-zinc-400">
              Multi-Level Category Management
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <ul>
              <p className="mb-2 text-sm font-medium text-zinc-300">Product</p>
              <li>
                <a href="#" className="block text-zinc-400 hover:text-white text-sm transition">
                  Overview
                </a>
              </li>
              <li>
                <a href="#" className="block text-zinc-400 hover:text-white text-sm transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="block text-zinc-400 hover:text-white text-sm transition">
                  Solutions
                </a>
              </li>
            </ul>

            <ul>
              <p className="mb-2 text-sm font-medium text-zinc-300">Company</p>
              <li>
                <a href="#" className="block text-zinc-400 hover:text-white text-sm transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="block text-zinc-400 hover:text-white text-sm transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="block text-zinc-400 hover:text-white text-sm transition">
                  Blog
                </a>
              </li>
            </ul>

            <ul>
              <p className="mb-2 text-sm font-medium text-zinc-300">Support</p>
              <li>
                <a href="#" className="block text-zinc-400 hover:text-white text-sm transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="block text-zinc-400 hover:text-white text-sm transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="block text-zinc-400 hover:text-white text-sm transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 border-t border-zinc-800 pt-4">
          <p className="text-sm text-zinc-500 text-center md:text-left">
            © {new Date().getFullYear()} Anglara. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-zinc-400 hover:text-white transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
