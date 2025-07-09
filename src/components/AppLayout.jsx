// src/components/AppLayout.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomeScreen from './HomeScreen.jsx';
import HistoryScreen from './HistoryScreen.jsx';
import CalculatorScreen from './CalculatorScreen.jsx';
import ChatScreen from './ChatScreen.jsx';
import ConversationScreen from './ConversationScreen.jsx';
import VipScreen from './VipScreen.jsx';
import AdBanner from './AdBanner.jsx';
import { supabase } from '../supabaseClient.js';

export default function AppLayout() {
  const [showSignOut, setShowSignOut] = useState(false);
  const user = supabase.auth.getUser();
  const userEmail = user?.data?.user?.email || '';
  const profileLetter = userEmail.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowSignOut(false);
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h3>Match Insights</h3>
          <div className="profile-container">
            <div className="profile-circle" onClick={() => setShowSignOut(!showSignOut)}>
              {profileLetter}
            </div>
            {showSignOut && (
              <div className="signout-menu">
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        </header>
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/calculator" element={<CalculatorScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/chat/:otherUserId" element={<ConversationScreen />} />
            <Route path="/vip" element={<VipScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
          </Routes>
        </main>

        <AdBanner />

        <nav className="app-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
          <NavLink to="/calculator" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Calculator</NavLink>
          <NavLink to="/chat" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Chat</NavLink>
          <NavLink to="/vip" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>🔥 VIP</NavLink>
          <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>History</NavLink>
        </nav>
      </div>
    </Router>
  );
}