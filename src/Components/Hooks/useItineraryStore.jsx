import React, { createContext, useContext, useState } from 'react';

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
  const [itinerary, setItinerary] = useState({
    tripTitle: '',
    travelers: 1,
    departureDate: '',
    returnDate: '',
    destination: '',
    departureFrom: '',
    days: [{ id: 1, morning: '', afternoon: '', evening: '' }],
    flights: [{ id: 1, date: '', airline: '', from: '', to: '' }],
    hotels: [{ id: 1, city: '', checkIn: '', checkOut: '', nights: '', name: '' }],
    payments: [{ id: 1, installment: '', amount: '', dueDate: '' }]
  });

  const updateItinerary = (newData) => {
    setItinerary(newData);
  };

  return (
    <ItineraryContext.Provider value={{ itinerary, updateItinerary }}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItineraryStore = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItineraryStore must be used within ItineraryProvider');
  }
  return context;
};