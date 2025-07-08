// src/components/AppLayout.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomeScreen from './HomeScreen.jsx';
import HistoryScreen from './HistoryScreen.jsx';
import ProfileScreen from './ProfileScreen.jsx';
import CalculatorScreen from './CalculatorScreen.jsx';
import ChatScreen from './ChatScreen.jsx';
import ConversationScreen from './ConversationScreen.jsx';
import VipScreen from './VipScreen.jsx';
import AdBanner from './AdBanner.jsx'; // Import the new component
import { supabase } from '../supabaseClient.js';

export default function AppLayout() {
  const user = supabase.auth.getUser();
  const userEmail = user?.data?.user?.email || '';
  const profileLetter = userEmail.charAt(0).toUpperCase();

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h3>Match Insights</h3>
          <div className="profile-circle">{profileLetter}</div>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/calculator" element={<CalculatorScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/chat/:otherUserId" element={<ConversationScreen />} />
            <Route path="/vip" element={<VipScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        </main>

        {/* Ad Banner is placed here, above the navigation */}
        <AdBanner />

        <nav className="app-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
          <NavLink to="/calculator" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Calculator</NavLink>
          <NavLink to="/chat" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Chat</NavLink>
          <NavLink to="/vip" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>🔥 VIP</NavLink>
          <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>History</NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Profile</NavLink>
        </nav>
      </div>
    </Router>
  );
}