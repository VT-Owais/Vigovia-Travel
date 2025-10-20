import React, { useState, useEffect } from 'react';
import './Hotels.css';
import { useItineraryStore } from '../../Hooks/useItineraryStore';

const Hotels = () => {
  const { itinerary, updateItinerary } = useItineraryStore();
  const [hotels, setHotels] = useState(itinerary.hotels);

  // Sync local state with global state
  useEffect(() => {
    setHotels(itinerary.hotels);
  }, [itinerary.hotels]);

  const addHotel = () => {
    // Check if at least one field is filled in all hotels
    const hasEmptyHotels = hotels.some(hotel => 
      !hotel.city.trim() && !hotel.checkIn && !hotel.checkOut && !hotel.nights && !hotel.name.trim()
    );

    if (hasEmptyHotels) {
      alert('Please fill at least one field in each hotel before adding a new one');
      return;
    }

    const newHotel = {
      id: hotels.length + 1,
      city: '',
      checkIn: '',
      checkOut: '',
      nights: '',
      name: ''
    };
    const newHotels = [...hotels, newHotel];
    setHotels(newHotels);
    updateItinerary({
      ...itinerary,
      hotels: newHotels
    });
  };

  const removeHotel = (id) => {
    if (hotels.length > 1) {
      const updatedHotels = hotels.filter(hotel => hotel.id !== id);
      const renumberedHotels = updatedHotels.map((hotel, index) => ({
        ...hotel,
        id: index + 1
      }));
      setHotels(renumberedHotels);
      updateItinerary({
        ...itinerary,
        hotels: renumberedHotels
      });
    }
  };

  const updateHotel = (id, field, value) => {
    const updatedHotels = hotels.map(hotel => 
      hotel.id === id ? { ...hotel, [field]: value } : hotel
    );
    setHotels(updatedHotels);
    updateItinerary({
      ...itinerary,
      hotels: updatedHotels
    });
  };

  return (
    <div className="hotels">
      <h2>Hotel Bookings</h2>
      
      {hotels.map((hotel) => (
        <div key={hotel.id} className="hotel-card">
          <div className="hotel-header">
            <h3>Hotel {hotel.id}</h3>
            {hotels.length > 1 && (
              <button 
                className="delete-hotel-btn"
                onClick={() => removeHotel(hotel.id)}
              >
                Delete
              </button>
            )}
          </div>

          <div className="hotel-row">
            <div className="input-group">
              <label>City</label>
              <input 
                type="text" 
                placeholder="e.g., Singapore" 
                value={hotel.city}
                onChange={(e) => updateHotel(hotel.id, 'city', e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label>Check-in Date</label>
              <input 
                type="date" 
                value={hotel.checkIn}
                onChange={(e) => updateHotel(hotel.id, 'checkIn', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Check-out Date</label>
              <input 
                type="date" 
                value={hotel.checkOut}
                onChange={(e) => updateHotel(hotel.id, 'checkOut', e.target.value)}
              />
            </div>
          </div>

          <div className="hotel-row">
            <div className="input-group">
              <label>Nights</label>
              <input 
                type="number" 
                placeholder="2" 
                value={hotel.nights}
                onChange={(e) => updateHotel(hotel.id, 'nights', e.target.value)}
              />
            </div>
            
            <div className="input-group full-width">
              <label>Hotel Name</label>
              <input 
                type="text" 
                placeholder="e.g., Super Townhouse Oak" 
                value={hotel.name}
                onChange={(e) => updateHotel(hotel.id, 'name', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button className="add-hotel-btn" onClick={addHotel}>
        + Add Another Hotel
      </button>
    </div>
  );
};

export default Hotels;