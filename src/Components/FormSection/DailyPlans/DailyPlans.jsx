import React, { useState, useEffect } from 'react';
import './DailyPlans.css';
import { useItineraryStore } from '../../Hooks/useItineraryStore';

const DailyPlans = () => {
  const { itinerary, updateItinerary } = useItineraryStore();
  const [days, setDays] = useState(itinerary.days);

  // Sync local state with global state when itinerary changes
  useEffect(() => {
    setDays(itinerary.days);
  }, [itinerary.days]);

  const addDay = () => {
    const hasEmptyDays = days.some(day => 
      !day.morning.trim() && !day.afternoon.trim() && !day.evening.trim()
    );

    if (hasEmptyDays) {
      alert('Please fill at least one activity in each day before adding a new day');
      return;
    }

    const newDay = {
      id: days.length + 1,
      morning: '',
      afternoon: '',
      evening: ''
    };
    const newDays = [...days, newDay];
    setDays(newDays);
    updateItinerary({
      ...itinerary,
      days: newDays
    });
  };

  const removeDay = (id) => {
    if (days.length > 1) {
      const updatedDays = days.filter(day => day.id !== id);
      const renumberedDays = updatedDays.map((day, index) => ({
        ...day,
        id: index + 1
      }));
      setDays(renumberedDays);
      updateItinerary({
        ...itinerary,
        days: renumberedDays
      });
    }
  };

  const updateDay = (id, field, value) => {
    const updatedDays = days.map(day => 
      day.id === id ? { ...day, [field]: value } : day
    );
    setDays(updatedDays);
    updateItinerary({
      ...itinerary,
      days: updatedDays
    });
  };

  return (
    <div className="daily-plan">
      <h2>Daily Itinerary</h2>
      
      {days.map((day) => (
        <div key={day.id} className="day-card">
          <div className="day-header">
            <h3>Day {day.id}</h3>
            {days.length > 1 && (
              <button 
                className="delete-day-btn"
                onClick={() => removeDay(day.id)}
              >
                Delete
              </button>
            )}
          </div>
          
          <div className="time-slot">
            <label>Morning</label>
            <textarea 
              placeholder="Morning activities..." 
              rows="3"
              value={day.morning}
              onChange={(e) => updateDay(day.id, 'morning', e.target.value)}
            ></textarea>
          </div>

          <div className="time-slot">
            <label>Afternoon</label>
            <textarea 
              placeholder="Afternoon activities..." 
              rows="3"
              value={day.afternoon}
              onChange={(e) => updateDay(day.id, 'afternoon', e.target.value)}
            ></textarea>
          </div>

          <div className="time-slot">
            <label>Evening</label>
            <textarea 
              placeholder="Evening activities..." 
              rows="3"
              value={day.evening}
              onChange={(e) => updateDay(day.id, 'evening', e.target.value)}
            ></textarea>
          </div>
        </div>
      ))}

      <button className="add-day-btn" onClick={addDay}>
        + Add Another Day
      </button>
    </div>
  );
};

export default DailyPlans;