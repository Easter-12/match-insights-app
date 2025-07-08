// src/components/PredictionForm.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient.js';

// The 'onClose' prop is a function we'll pass in to close the form
export default function PredictionForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    avg_goals_scored: '',
    avg_goals_conceded: '',
    last_5_form: '',
    last_5_goal_totals: '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to submit a prediction.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('user_predictions').insert([
      { ...formData, user_id: user.id }
    ]);

    if (error) {
      alert('Error submitting prediction: ' + error.message);
    } else {
      alert('Prediction submitted successfully!');
      onClose(); // Close the form on success
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Submit Your Prediction</h2>
        <form>
          <label>Average Goals Scored</label>
          <input type="number" step="0.1" value={formData.avg_goals_scored} onChange={(e) => handleChange('avg_goals_scored', e.target.value)} />

          <label>Average Goals Conceded</label>
          <input type="number" step="0.1" value={formData.avg_goals_conceded} onChange={(e) => handleChange('avg_goals_conceded', e.target.value)} />

          <label>Last 5 Match Form (e.g., WDLWD)</label>
          <input type="text" maxLength="5" value={formData.last_5_form} onChange={(e) => handleChange('last_5_form', e.target.value)} />

          <label>Last 5 Match Goal Totals (e.g., 3,1,2,0,4)</label>
          <input type="text" value={formData.last_5_goal_totals} onChange={(e) => handleChange('last_5_goal_totals', e.target.value)} />

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
            <button type="button" onClick={handleSubmit} disabled={loading} className="button-primary">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}