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
    awayTeam: '',
    awayAvgGoalsScored: '',
    awayAvgGoalsConceded: '',
    awayLast5Form: '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ===================================================================
  // NEW SMARTER PREDICTION LOGIC
  // ===================================================================
  const getSmarterPrediction = () => {
    setLoading(true);
    setPrediction(null);

    // Helper function to calculate a team's form score (W=3, D=1, L=0)
    const getFormScore = (formString) => {
      let score = 0;
      for (const char of formString.toUpperCase()) {
        if (char === 'W') score += 3;
        if (char === 'D') score += 1;
      }
      return score;
    };

    // Calculate Power Ratings
    const homeFormScore = getFormScore(formData.homeLast5Form);
    const awayFormScore = getFormScore(formData.awayLast5Form);

    const homePower = (parseFloat(formData.homeAvgGoalsScored) * 1.5) - parseFloat(formData.homeAvgGoalsConceded) + (homeFormScore * 0.2);
    const awayPower = (parseFloat(formData.awayAvgGoalsScored) * 1.5) - parseFloat(formData.awayAvgGoalsConceded) + (awayFormScore * 0.2);

    // Simulate a delay for analysis
    setTimeout(() => {
      const outcomes = [];
      const expectedGoals = parseFloat(formData.homeAvgGoalsScored) + parseFloat(formData.awayAvgGoalsScored);

      // 1. Predict Over/Under
      if (expectedGoals > 2.8) {
        outcomes.push({ market: 'Total Goals', outcome: 'Over 2.5 (High Confidence)' });
      } else if (expectedGoals > 2.3) {
        outcomes.push({ market: 'Total Goals', outcome: 'Over 2.5 (Likely)' });
      } else {
        outcomes.push({ market: 'Total Goals', outcome: 'Under 2.5' });
      }

      // 2. Predict Both Teams To Score (GG/NG)
      if (formData.homeAvgGoalsScored >= 1.0 && formData.awayAvgGoalsScored >= 1.0) {
        outcomes.push({ market: 'Both Teams To Score', outcome: 'Yes (GG)' });
      } else if (formData.homeAvgGoalsScored < 0.6 || formData.awayAvgGoalsScored < 0.6) {
        outcomes.push({ market: 'Both Teams To Score', outcome: 'No (NG)' });
      } else {
        outcomes.push({ market: 'Both Teams To Score', outcome: 'Possible, but not certain' });
      }

      // 3. Predict Match Winner
      const powerDifference = homePower - awayPower;
      if (powerDifference > 1.0) {
        outcomes.push({ market: 'Match Winner', outcome: `${formData.homeTeam || 'Home Team'} to Win` });
      } else if (powerDifference < -1.0) {
        outcomes.push({ market: 'Match Winner', outcome: `${formData.awayTeam || 'Away Team'} to Win` });
      } else {
        outcomes.push({ market: 'Match Winner', outcome: 'Draw or Close Result' });
      }

      setPrediction(outcomes);
      setLoading(false);
    }, 1500); // Increased delay for "analysis" feel
  };

  return (
    <div>
      <h2>Prediction Calculator</h2>
      <p>Enter offline stats to get a match outcome prediction.</p>

      <div className="calculator-form">
        <div className="team-section">
          <h4>Home Team</h4>
          <input placeholder="Home Team Name" value={formData.homeTeam} onChange={(e) => handleChange('homeTeam', e.target.value)} />
          <input type="number" placeholder="Avg. Goals Scored" value={formData.homeAvgGoalsScored} onChange={(e) => handleChange('homeAvgGoalsScored', e.target.value)} />
          <input type="number" placeholder="Avg. Goals Conceded" value={formData.homeAvgGoalsConceded} onChange={(e) => handleChange('homeAvgGoalsConceded', e.target.value)} />
          <input placeholder="Last 5 Form (e.g., WDWLD)" maxLength="5" value={formData.homeLast5Form} onChange={(e) => handleChange('homeLast5Form', e.target.value)} />
        </div>

        <div className="team-section">
          <h4>Away Team</h4>
          <input placeholder="Away Team Name" value={formData.awayTeam} onChange={(e) => handleChange('awayTeam', e.target.value)} />
          <input type="number" placeholder="Avg. Goals Scored" value={formData.awayAvgGoalsScored} onChange={(e) => handleChange('awayAvgGoalsScored', e.target.value)} />
          <input type="number" placeholder="Avg. Goals Conceded" value={formData.awayAvgGoalsConceded} onChange={(e) => handleChange('awayAvgGoalsConceded', e.target.value)} />
          <input placeholder="Last 5 Form (e.g., WDWLD)" maxLength="5" value={formData.awayLast5Form} onChange={(e) => handleChange('awayLast5Form', e.target.value)} />
        </div>
      </div>

      <button onClick={getSmarterPrediction} disabled={loading} className="button-primary predict-button">
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