// src/components/VipScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient.js';

// This is the content that VIP members will see.
const VipContent = () => {
  const [vipMatches, setVipMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVipMatches() {
      const { data, error } = await supabase
        .from('vip_matches')
        .select('*')
        .order('kickoff_time', { ascending: false });

      if (error) {
        console.error('Could not fetch VIP matches:', error.message);
      } else {
        setVipMatches(data);
      }
      setLoading(false);
    }
    fetchVipMatches();
  }, []);

  const activeVipMatches = vipMatches.filter(m => !m.is_completed);
  const vipMatchHistory = vipMatches.filter(m => m.is_completed);

  if (loading) {
    return <p>Loading VIP matches...</p>;
  }

  return (
    <div className="vip-content">
      <h4>Active VIP Predictions</h4>
      {activeVipMatches.length === 0 ? (
        <p>New VIP match dropping soon. Please check back.</p>
      ) : (
        activeVipMatches.map(match => (
          <div key={match.id} className="match-card">
            <div className="match-card-header">
              <span>{match.league}, {match.country}</span>
              <span>{new Date(match.kickoff_time).toLocaleDateString()}</span>
            </div>
            <div className="match-card-body">
              <p className="teams">{match.home_team} vs {match.away_team}</p>
              <p className="prediction">Prediction: <span>{match.prediction_text}</span></p>
            </div>
            <div className="match-card-footer">
              <span>Kickoff: {new Date(match.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="odds">Odds: {match.odds || 'N/A'}</span>
            </div>
          </div>
        ))
      )}

      <h4 style={{ marginTop: '40px' }}>VIP Match History</h4>
      {vipMatchHistory.length === 0 ? (
        <p>No completed VIP matches yet.</p>
      ) : (
        vipMatchHistory.map(match => (
          <div key={match.id} className="history-card">
            <div className="history-card-header">
              <span className="history-card-teams">{match.home_team} vs {match.away_team}</span>
              <span className="history-card-date">{new Date(match.kickoff_time).toLocaleDateString()}</span>
            </div>
            <div className="history-card-body">
              <p>Prediction: <span>{match.prediction_text}</span></p>
              <p>Odds: <span>{match.odds || 'N/A'}</span></p>
              <p>Final Score: <span>{match.result}</span></p>
            </div>
            <div className={`history-card-status status-${match.status?.toLowerCase()}`}>
              {match.status}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// This is what non-VIP members will see.
const SubscribePrompt = ({ onRefresh }) => {
  // The link has been updated with your new LIVE URL.
  const paystackLink = "https://paystack.shop/pay/c0uehcy59w"; // <-- UPDATED LIVE LINK

  return (
    <div className="subscribe-prompt">
      <div className="icon">🔥</div>
      <h3>Unlock VIP Access</h3>
      <p>Get exclusive high-odds predictions by subscribing now.</p>
      <a href={paystackLink} className="button-primary subscribe-button" target="_blank" rel="noopener noreferrer">
        Subscribe Now
      </a>
      <p style={{ fontSize: '12px', color: '#888', marginTop: '20px' }}>
        After subscribing, click the button below to update your status.
      </p>
      <button onClick={onRefresh} className="button-secondary">Refresh Status</button>
    </div>
  );
};

// The main component logic remains the same.
export default function VipScreen() {
  const [isVip, setIsVip] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkVipStatus = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile, error } = await supabase.from('profiles').select('is_vip').eq('id', user.id).single();
      if (error) console.error('Error fetching VIP status:', error);
      else if (profile) setIsVip(profile.is_vip);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkVipStatus();
  }, [checkVipStatus]);

  if (loading) {
    return <p>Checking your VIP status...</p>;
  }

  return (
    <div>
      <h2>VIP 5 Odds</h2>
      {isVip ? <VipContent /> : <SubscribePrompt onRefresh={checkVipStatus} />}
    </div>
  );
}