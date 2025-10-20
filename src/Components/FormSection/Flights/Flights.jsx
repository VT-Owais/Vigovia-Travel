import React, { useState, useEffect } from 'react';
import './Flights.css';
import { useItineraryStore } from '../../Hooks/useItineraryStore';

const Flights = () => {
  const { itinerary, updateItinerary } = useItineraryStore();
  const [flights, setFlights] = useState(itinerary.flights);

  // Sync local state with global state
  useEffect(() => {
    setFlights(itinerary.flights);
  }, [itinerary.flights]);

  const addFlight = () => {
    // Check if at least one field is filled in all flights
    const hasEmptyFlights = flights.some(flight => 
      !flight.date && !flight.airline.trim() && !flight.from.trim() && !flight.to.trim()
    );

    if (hasEmptyFlights) {
      alert('Please fill at least one field in each flight before adding a new one');
      return;
    }

    const newFlight = {
      id: flights.length + 1,
      date: '',
      airline: '',
      from: '',
      to: ''
    };
    const newFlights = [...flights, newFlight];
    setFlights(newFlights);
    updateItinerary({
      ...itinerary,
      flights: newFlights
    });
  };

  const removeFlight = (id) => {
    if (flights.length > 1) {
      const updatedFlights = flights.filter(flight => flight.id !== id);
      const renumberedFlights = updatedFlights.map((flight, index) => ({
        ...flight,
        id: index + 1
      }));
      setFlights(renumberedFlights);
      updateItinerary({
        ...itinerary,
        flights: renumberedFlights
      });
    }
  };

  const updateFlight = (id, field, value) => {
    const updatedFlights = flights.map(flight => 
      flight.id === id ? { ...flight, [field]: value } : flight
    );
    setFlights(updatedFlights);
    updateItinerary({
      ...itinerary,
      flights: updatedFlights
    });
  };

  return (
    <div className="flights">
      <h2>Flight Information</h2>
      
      {flights.map((flight) => (
        <div key={flight.id} className="flight-card">
          <div className="flight-header">
            <h3>Flight {flight.id}</h3>
            {flights.length > 1 && (
              <button 
                className="delete-flight-btn"
                onClick={() => removeFlight(flight.id)}
              >
                Delete
              </button>
            )}
          </div>

          <div className="flight-row">
            <div className="input-group">
              <label>Date</label>
              <input 
                type="date" 
                value={flight.date}
                onChange={(e) => updateFlight(flight.id, 'date', e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label>Airline & Flight</label>
              <input 
                type="text" 
                placeholder="e.g., Air India (AX-123)" 
                value={flight.airline}
                onChange={(e) => updateFlight(flight.id, 'airline', e.target.value)}
              />
            </div>
          </div>

          <div className="flight-row">
            <div className="input-group">
              <label>From</label>
              <input 
                type="text" 
                placeholder="e.g., Delhi (DEL)" 
                value={flight.from}
                onChange={(e) => updateFlight(flight.id, 'from', e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label>To</label>
              <input 
                type="text" 
                placeholder="e.g., Singapore (SIN)" 
                value={flight.to}
                onChange={(e) => updateFlight(flight.id, 'to', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button className="add-flight-btn" onClick={addFlight}>
        + Add Another Flight
      </button>
    </div>
  );
};

export default Flights;