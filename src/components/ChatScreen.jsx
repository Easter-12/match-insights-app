// src/components/ChatScreen.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { supabase } from '../supabaseClient.js';

export default function ChatScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    async function loadInitialData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, email')
          .not('id', 'eq', user.id);
        if (error) console.error('Error fetching users:', error);
        else setUsers(data);
      }
      setLoading(false);
    }
    loadInitialData();
  }, []);

  // UPDATED FUNCTION
  const handleStartChat = (userId) => {
    navigate(`/chat/${userId}`); // Navigate to the specific conversation
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>Start a Conversation</h2>
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-list-item">
            <div className="user-info">
              <div className="profile-circle-small">{user.email.charAt(0).toUpperCase()}</div>
              <span>{user.username || user.email}</span>
            </div>
            <button onClick={() => handleStartChat(user.id)} className="button-primary">
              Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}