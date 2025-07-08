// src/components/Auth.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else if (data.user) {
      // Requirement: Auto-generate username from email
      const username = email.split('@')[0];
      // Update the user's profile with the new username
      await supabase.from('profiles').update({ username: username }).eq('id', data.user.id);
      alert('Registration successful! Please check your email to verify your account.');
    }
    setLoading(false);
  };

  const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' },
    form: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    header: { fontSize: '2rem', marginBottom: '10px', fontWeight: 'bold' },
    description: { color: '#B3B3B3', marginBottom: '30px' },
    input: { padding: '12px', margin: '8px 0', width: '280px', backgroundColor: '#2A2A2A', color: 'white', border: '1px solid #555', borderRadius: '5px', fontSize: '1rem' },
    button: { padding: '12px 20px', width: '308px', margin: '10px 0', cursor: 'pointer', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '1rem' },
    signInButton: { backgroundColor: '#007BFF', color: 'white' },
    signUpButton: { backgroundColor: 'transparent', border: '1px solid #007BFF', color: 'white' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Match Insights</h1>
      <p style={styles.description}>Sign in or create an account</p>
      <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input style={styles.input} type="email" placeholder="email@address.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button style={{...styles.button, ...styles.signInButton}} onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <button style={{...styles.button, ...styles.signUpButton}} onClick={handleSignup} disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}