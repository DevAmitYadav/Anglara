// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-4">
      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-md rounded-lg shadow-xl p-10 max-w-xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-800 to-pink-600 bg-clip-text text-transparent">
          Multi-Level Category Management API
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Empower your digital experience with a seamless, scalable, and secure API
          designed for modern category management.
        </p>
        <button
      onClick={() => navigate("/register")}
      className="px-6 py-3 bg-gradient-to-r from-indigo-800 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition duration-200"
    >
      Get Started
    </button>
      </div>
    </div>
  );
};

export default Home;
