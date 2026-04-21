import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScanInterface from './Components/scanner/ScanInterface';
import AdminLogin from './Components/admin/AdminLogin';
import AdminDashboard from './Components/admin/AdminDashboard';

function AdminRoute() {
  const [admin, setAdmin] = useState(() => {
    const saved = sessionStorage.getItem('admin');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (data) => {
    sessionStorage.setItem('admin', JSON.stringify(data));
    setAdmin(data);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin');
    setAdmin(null);
  };

  if (!admin) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard admin={admin} onLogout={handleLogout} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScanInterface />} />
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
