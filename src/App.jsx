// src/App.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient.js';
import Auth from './components/Auth.jsx';
import AppLayout from './components/AppLayout.jsx';
import './App.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session when the app first loads
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getInitialSession();

    // Listen for changes in authentication state (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // Show a loading message while we check for a session
  if (loading) {
    return <div className="loading-screen">Authenticating...</div>;
  }

  return (
    <div className="App">
      {session && session.user ? <AppLayout /> : <Auth />}
    </div>
  );
}