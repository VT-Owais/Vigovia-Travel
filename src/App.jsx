import React from 'react';
import HomePage from './Pages/HomePage/HomePage';
import { ItineraryProvider } from './Components/Hooks/useItineraryStore';
import './App.css';

function App() {
  return (
    <ItineraryProvider>
      <div className="app">
        <HomePage />
      </div>
    </ItineraryProvider>
  );
}

export default App;