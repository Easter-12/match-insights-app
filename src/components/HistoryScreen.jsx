// src/components/HistoryScreen.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export default function HistoryScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('is_completed', true)
        .order('kickoff_time', { ascending: false });

      if (error) {
        console.error('Error fetching match history:', error);
      } else {
        setMatches(data);
      }
      setLoading(false);
    }
    fetchHistory();
  }, []);

  if (loading) {
    return <p>Loading match history...</p>;
  }

  return (
    <div>
      <h2>Match History</h2>
      {matches.length === 0 ? (
        <p>No completed matches yet.</p>
      ) : (
        <div className="match-list-container">
          {matches.map(match => (
            <div key={match.id} className="history-card">
              <div className="history-card-header">
                <span className="history-card-teams">{match.home_team} vs {match.away_team}</span>
                {/* THIS IS THE MISSING DATE */}
                <span className="history-card-date">{new Date(match.kickoff_time).toLocaleDateString()}</span>
              </div>
              <div className="history-card-body">
                <p>Prediction: <span>{match.prediction_text}</span></p>
                <p>Final Score: <span>{match.result}</span></p>
              </div>
              <div className={`history-card-status status-${match.status?.toLowerCase()}`}>
                {match.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}