// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminSignup from './pages/AdminSignup';
import Login from './pages/Login';
import Placements from './pages/Placements';
import Training from './pages/Training';
import PerformanceCard from './pages/PerformanceCard';

const AppWrapper = () => {
  const { checkLoginStatus } = useAuth();

  // Check login status when the app loads
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/placements" element={<Placements />} />
            <Route path="/training" element={<Training />} />
            <Route path="/PerformanceCard" element={<PerformanceCard/>} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
}

export default App;