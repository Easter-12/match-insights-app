// src/components/ConversationScreen.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';

export default function ConversationScreen() {
  const { otherUserId } = useParams(); // Get the other user's ID from the URL
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChat() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .in('sender_id', [user.id, otherUserId])
          .in('receiver_id', [user.id, otherUserId])
          .order('created_at', { ascending: true });

        if (error) console.error('Error fetching messages:', error);
        else setMessages(data);
      }
      setLoading(false);
    }
    loadChat();
  }, [otherUserId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const { error } = await supabase.from('chat_messages').insert([
      { sender_id: currentUser.id, receiver_id: otherUserId, message: newMessage }
    ]);

    if (error) {
      alert('Error sending message: ' + error.message);
    } else {
      // Add the new message to the UI immediately for a better user experience
      setMessages([...messages, { sender_id: currentUser.id, message: newMessage, created_at: new Date().toISOString() }]);
      setNewMessage('');
    }
  };

  const handleReportUser = async () => {
    if (window.confirm('Are you sure you want to report this user for inappropriate behavior?')) {
      const { error } = await supabase.from('reports').insert([
        { reporting_user_id: currentUser.id, reported_user_id: otherUserId, reason: 'User reported from chat.' }
      ]);
      if (error) alert('Error submitting report: ' + error.message);
      else alert('User has been reported. Our team will review the activity.');
    }
  };

  if (loading) return <p>Loading conversation...</p>;

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <button onClick={() => navigate('/chat')}>← Back to Users</button>
        <button onClick={handleReportUser} className="button-danger">Report User</button>
      </div>
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender_id === currentUser.id ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="message-input-area">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}