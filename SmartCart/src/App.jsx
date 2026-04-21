import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScanInterface from './Components/scanner/ScanInterface';
import AdminLogin from './Components/admin/AdminLogin';
import AdminDashboard from './Components/admin/AdminDashboard';

function AdminRoute() {
  const [admin, setAdmin] = useState(null);

  if (!admin) return <AdminLogin onLogin={setAdmin} />;
  return <AdminDashboard admin={admin} onLogout={() => setAdmin(null)} />;
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
