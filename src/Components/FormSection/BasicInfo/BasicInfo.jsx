import React from 'react';
import './BasicInfo.css';
import { useItineraryStore } from '../../Hooks/useItineraryStore';

const BasicInfo = () => {
  const { itinerary, updateItinerary } = useItineraryStore();

  console.log('Current itinerary:', itinerary);

  const handleInputChange = (field, value) => {
    console.log('Updating:', field, value);
    updateItinerary({
      ...itinerary,
      [field]: value
    });
  };

  return (
    <div className="basic-info">
      <h2>Basic Information</h2>

        <div className="input-group">
          <label>Traveler Name</label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={itinerary.travelerName || ''}
            onChange={(e) => handleInputChange('travelerName', e.target.value)}
          />
        </div>
      <div className="form-grid">
        <div className="input-group">
          <label>Trip Title</label>
          <input
            type="text"
            placeholder="e.g., Singapore Vacation"
            value={itinerary.tripTitle || ''}
            onChange={(e) => handleInputChange('tripTitle', e.target.value)}
          />
        </div>


        <div className="input-group">
          <label>Travelers</label>
          <input
            type="number"
            placeholder="2"
            value={itinerary.travelers || 1}
            onChange={(e) => handleInputChange('travelers', parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="input-group">
          <label>Departure Date</label>
          <input
            type="date"
            value={itinerary.departureDate || ''}
            onChange={(e) => handleInputChange('departureDate', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Return Date</label>
          <input
            type="date"
            value={itinerary.returnDate || ''}
            onChange={(e) => handleInputChange('returnDate', e.target.value)}
          />
        </div>

        <div className="input-group full-width">
          <label>Destination</label>
          <input
            type="text"
            placeholder="e.g., Singapore"
            value={itinerary.destination || ''}
            onChange={(e) => handleInputChange('destination', e.target.value)}
          />
        </div>

        <div className="input-group full-width">
          <label>Departure From</label>
          <input
            type="text"
            placeholder="e.g., Delhi"
            value={itinerary.departureFrom || ''}
            onChange={(e) => handleInputChange('departureFrom', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;