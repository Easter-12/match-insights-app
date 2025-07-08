import React from 'react';
import { supabase } from '../supabaseClient.js';
export default function ProfileScreen() {
  return (
    <div>
      <h2>Profile</h2>
      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  );
}