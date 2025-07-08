// src/components/VipScreen.jsx
import React from 'react';

export default function VipScreen() {
  const styles = {
    container: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      border: '1px solid #333',
    },
    icon: {
      fontSize: '48px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#FFD700', // Gold color for VIP
      margin: 0,
    },
    subtitle: {
      fontSize: '16px',
      color: '#B3B3B3',
    }
  };

  return (
    <div>
      <h2>VIP Access</h2>
      <div style={styles.container}>
        <div style={styles.icon}>🔥</div>
        <h3 style={styles.title}>VIP 5 Odds</h3>
        <p style={styles.subtitle}>Coming Soon</p>
      </div>
    </div>
  );
}