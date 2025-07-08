// src/components/AdBanner.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export default function AdBanner() {
  const [adConfig, setAdConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdConfig() {
      // Fetch the AdMob keys from the backend
      const { data, error } = await supabase
        .from('config')
        .select('key, value')
        .like('key', 'admob_%'); // Get all keys starting with 'admob_'

      if (error) {
        console.error('Error fetching ad config:', error);
      } else {
        setAdConfig(data);
      }
      setLoading(false);
    }
    fetchAdConfig();
  }, []);

  const styles = {
    banner: {
      padding: '10px',
      margin: '20px 0',
      backgroundColor: '#333',
      textAlign: 'center',
      borderRadius: '8px',
      border: '1px solid #555',
    },
    text: {
      color: '#aaa',
      fontSize: '14px',
      margin: 0,
    }
  };

  if (loading) {
    return <div style={styles.banner}><p style={styles.text}>Ad loading...</p></div>;
  }

  return (
    <div style={styles.banner}>
      <p style={styles.text}>- Simulated Banner Ad -</p>
      {adConfig && adConfig.length > 0 ? (
        <p style={{...styles.text, color: 'green', fontSize: '10px'}}>Ad config loaded successfully.</p>
      ) : (
        <p style={{...styles.text, color: 'red', fontSize: '10px'}}>Ad config not found in backend.</p>
      )}
    </div>
  );
}