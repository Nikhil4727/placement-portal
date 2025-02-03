import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8" />
            <span className="font-bold text-xl">PlacementPortal</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/placements" className="hover:text-indigo-200 transition">Placements</Link>
            <Link to="/training" className="hover:text-indigo-200 transition">Training</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;