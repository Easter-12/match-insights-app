// src/components/AdBanner.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export default function AdBanner() {
  const [adConfigLoaded, setAdConfigLoaded] = useState(false);

  useEffect(() => {
    async function fetchAdConfig() {
      const { data, error } = await supabase
        .from('config')
        .select('key')
        .like('key', 'admob_%')
        .limit(1);

      if (!error && data.length > 0) {
        setAdConfigLoaded(true);
      }
    }
    fetchAdConfig();
  }, []);

  return (
    <div className="ad-banner-container">
      {/* This is a placeholder image for a banner ad */}
      <img 
        src="https://via.placeholder.com/728x90.png?text=Simulated+Advertisement" 
        alt="Simulated Ad" 
        className="ad-banner-image"
      />
      <p className="ad-status-text">
        {adConfigLoaded ? 'Ad config loaded successfully.' : 'Ad config not found.'}
      </p>
    </div>
  );
}