// src/components/HomeScreen.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export default function HomeScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('is_completed', false)
        .order('kickoff_time', { ascending: true });

      if (error) {
        console.error('Error fetching matches:', error);
      } else {
        setMatches(data);
      }
      setLoading(false);
    }
    fetchMatches();
  }, []);

  if (loading) {
    return <p>Loading matches...</p>;
  }

  return (
    <div>
      {/* The button has been removed from this header */}
      <div className="home-header">
        <h2>Free Matches</h2>
      </div>

      {matches.length === 0 ? (
        <p>Match dropping soon, please check back later.</p>
      ) : (
        <div className="match-list-container">
          {matches.map(match => (
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
          ))}
        </div>
      )}
    </div>
  );
}