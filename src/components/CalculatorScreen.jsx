// src/components/CalculatorScreen.jsx
import React, { useState } from 'react';

export default function CalculatorScreen() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    homeTeam: '',
    homeAvgGoalsScored: '',
    homeAvgGoalsConceded: '',
    homeLast5Form: '',
    homeLast5Goals: '',
    awayTeam: '',
    awayAvgGoalsScored: '',
    awayAvgGoalsConceded: '',
    awayLast5Form: '',
    awayLast5Goals: '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // This is a placeholder for the ML model logic.
  const getPrediction = () => {
    setLoading(true);
    setTimeout(() => {
      const outcomes = [];
      const totalAvgGoals = parseFloat(formData.homeAvgGoalsScored) + parseFloat(formData.awayAvgGoalsScored);

      if (totalAvgGoals > 2.5) {
        outcomes.push({ market: 'Total Goals', outcome: 'Over 2.5' });
      } else {
        outcomes.push({ market: 'Total Goals', outcome: 'Under 2.5' });
      }

      if (formData.homeAvgGoalsScored > 0.8 && formData.awayAvgGoalsScored > 0.8) {
        outcomes.push({ market: 'Both Teams To Score', outcome: 'Yes (GG)' });
      } else {
        outcomes.push({ market: 'Both Teams To Score', outcome: 'No (NG)' });
      }

      if (formData.homeAvgGoalsScored > formData.awayAvgGoalsConceded + 0.5) {
        outcomes.push({ market: 'Match Winner', outcome: `${formData.homeTeam || 'Home Team'} to Win` });
      } else if (formData.awayAvgGoalsScored > formData.homeAvgGoalsConceded + 0.5) {
        outcomes.push({ market: 'Match Winner', outcome: `${formData.awayTeam || 'Away Team'} to Win` });
      } else {
        outcomes.push({ market: 'Match Winner', outcome: 'Draw' });
      }

      setPrediction(outcomes);
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <h2>Prediction Calculator</h2>
      <p>Enter offline stats to get a match outcome prediction.</p>

      <div className="calculator-form">
        {/* --- HOME TEAM INPUTS --- */}
        <div className="team-section">
          <h4>Home Team</h4>
          <input placeholder="Home Team Name" value={formData.homeTeam} onChange={(e) => handleChange('homeTeam', e.target.value)} />
          <input type="number" placeholder="Avg. Goals Scored" value={formData.homeAvgGoalsScored} onChange={(e) => handleChange('homeAvgGoalsScored', e.target.value)} />
          <input type="number" placeholder="Avg. Goals Conceded" value={formData.homeAvgGoalsConceded} onChange={(e) => handleChange('homeAvgGoalsConceded', e.target.value)} />
          <input placeholder="Last 5 Form (e.g., WDWLD)" maxLength="5" value={formData.homeLast5Form} onChange={(e) => handleChange('homeLast5Form', e.target.value)} />
          <input placeholder="Last 5 Goal Totals (e.g., 2,1,3,0,1)" value={formData.homeLast5Goals} onChange={(e) => handleChange('homeLast5Goals', e.target.value)} />
        </div>

        {/* --- AWAY TEAM INPUTS --- */}
        <div className="team-section">
          <h4>Away Team</h4>
          <input placeholder="Away Team Name" value={formData.awayTeam} onChange={(e) => handleChange('awayTeam', e.target.value)} />
          <input type="number" placeholder="Avg. Goals Scored" value={formData.awayAvgGoalsScored} onChange={(e) => handleChange('awayAvgGoalsScored', e.target.value)} />
          <input type="number" placeholder="Avg. Goals Conceded" value={formData.awayAvgGoalsConceded} onChange={(e) => handleChange('awayAvgGoalsConceded', e.target.value)} />
          <input placeholder="Last 5 Form (e.g., WDWLD)" maxLength="5" value={formData.awayLast5Form} onChange={(e) => handleChange('awayLast5Form', e.target.value)} />
          <input placeholder="Last 5 Goal Totals (e.g., 2,1,3,0,1)" value={formData.awayLast5Goals} onChange={(e) => handleChange('awayLast5Goals', e.target.value)} />
        </div>
      </div>

      <button onClick={getPrediction} disabled={loading} className="button-primary predict-button">
        {loading ? 'Analyzing...' : 'Predict Match'}
      </button>

      {prediction && (
        <div className="prediction-results">
          <h3>Prediction for {formData.homeTeam || 'Home'} vs {formData.awayTeam || 'Away'}</h3>
          <ul>
            {prediction.map((item, index) => (
              <li key={index}>
                <strong>{item.market}:</strong> {item.outcome}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}