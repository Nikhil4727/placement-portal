import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search } from 'lucide-react';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Implement search functionality here
  };

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
            <div className="relative">
              <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search..." 
                className="px-2 py-1 rounded-md border text-gray-700" 
              />
              <button 
                onClick={handleSearch} 
                className="absolute right-2 top-2 text-gray-700 hover:text-gray-900"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            
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
