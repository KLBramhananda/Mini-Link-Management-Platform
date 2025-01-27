import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/entering-page/login";
import Signup from "./pages/entering-page/signup";
import MainLayout from './components/MainLayout';
import Dashboard from './components/dashboard-page/Dashboard';
import Links from './components/links-page/Links';
import Analytics from './components/analytics-page/Analytics';
import Settings from './components/settings-page/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="links" element={<Links />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;