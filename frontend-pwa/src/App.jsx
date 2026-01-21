import { useCallback, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { requestNotificationPermission } from './hooks/useNotifications';
import { useSuggestionsSocket } from './hooks/useSuggestionsSocket';

import Login from './components/LoginForm'
import SuggestionForm from './components/SuggestionForm'
import Suggestions from './components/Suggestions'

function App() {
  const [suggestions, setSuggestions] = useState([]);
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));
  useEffect(() => {
    requestNotificationPermission();

  }, []);

  const handleMessage = useCallback((data) => {
    if (Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.body,
        icon: '/favicon.ico',
      });
    }
  }, []);



  useSuggestionsSocket(handleMessage, isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<SuggestionForm />} />
        <Route path="*" element={<SuggestionForm />} />
        <Route path="/suggestions" element={<Suggestions />} />
      </Routes>
    </Router>

  )
}

export default App
