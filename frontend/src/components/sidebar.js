import React, { useState } from "react";
import {House} from 'lucide-react'

function Sidebar({ isMinimized, toggleSidebar}) {
  

  return (
    <nav
      className={`w-full bg-white-100 text-white ${
        isMinimized ? "w-20" : "w-64"
      } transition-all relative`}
    >
      <ul className="flex mt-16 text-white flex-col items-center space-y-10">
        <li className="bg-indigo-500 rounded w-full h-12 transition-colors">
          <a
            href="#home"
            className="block px-4 py-2 rounded hover:bg-indigo-700 h-full"
          >
            Home
          </a>
        </li>
        <li className="rounded bg-indigo-500 w-full h-12">
          <a
            href="#about"
            className="block px-4 py-2 rounded hover:bg-indigo-700 h-full"
          >
            About
          </a>
        </li>
        <li className="rounded bg-indigo-500 w-full h-12">
          <a
            href="#contact"
            className="block px-4 py-2 rounded hover:bg-indigo-700 h-full"
          >
            Contact
          </a>
        </li>
      </ul>
      <button
        onClick={toggleSidebar}
        className="absolute bottom-4 left-2 p-2 bg-indigo-500 rounded-full text-white"
      >
        {isMinimized ? <House size={24} /> : <House size={24} />}
      </button>
    </nav>
  );
}

export default Sidebar;
