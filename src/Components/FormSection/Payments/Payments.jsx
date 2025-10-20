import React, { useState, useEffect } from 'react';
import './Payments.css';
import { useItineraryStore } from '../../Hooks/useItineraryStore';

const Payments = () => {
  const { itinerary, updateItinerary } = useItineraryStore();
  const [payments, setPayments] = useState(itinerary.payments);

  // Sync local state with global state
  useEffect(() => {
    setPayments(itinerary.payments);
  }, [itinerary.payments]);

  const addPayment = () => {
    // Check if at least one field is filled in all payments
    const hasEmptyPayments = payments.some(payment => 
      !payment.installment && !payment.amount.trim() && !payment.dueDate
    );

    if (hasEmptyPayments) {
      alert('Please fill at least one field in each payment before adding a new one');
      return;
    }

    const newPayment = {
      id: payments.length + 1,
      installment: '',
      amount: '',
      dueDate: ''
    };
    const newPayments = [...payments, newPayment];
    setPayments(newPayments);
    updateItinerary({
      ...itinerary,
      payments: newPayments
    });
  };

  const removePayment = (id) => {
    if (payments.length > 1) {
      const updatedPayments = payments.filter(payment => payment.id !== id);
      const renumberedPayments = updatedPayments.map((payment, index) => ({
        ...payment,
        id: index + 1
      }));
      setPayments(renumberedPayments);
      updateItinerary({
        ...itinerary,
        payments: renumberedPayments
      });
    }
  };

  const updatePayment = (id, field, value) => {
    const updatedPayments = payments.map(payment => 
      payment.id === id ? { ...payment, [field]: value } : payment
    );
    setPayments(updatedPayments);
    updateItinerary({
      ...itinerary,
      payments: updatedPayments
    });
  };

  return (
    <div className="payment">
      <h2>Payment Plan</h2>
      
      {payments.map((payment) => (
        <div key={payment.id} className="payment-card">
          <div className="payment-header">
            <h3>Payment {payment.id}</h3>
            {payments.length > 1 && (
              <button 
                className="delete-payment-btn"
                onClick={() => removePayment(payment.id)}
              >
                Delete
              </button>
            )}
          </div>

          <div className="payment-row">
            <div className="input-group">
              <label>Installment</label>
              <input 
                type="number" 
                placeholder="1" 
                value={payment.installment}
                onChange={(e) => updatePayment(payment.id, 'installment', e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label>Amount</label>
              <input 
                type="text" 
                placeholder="e.g., ₹10,000" 
                value={payment.amount}
                onChange={(e) => updatePayment(payment.id, 'amount', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Due Date</label>
              <input 
                type="date" 
                value={payment.dueDate}
                onChange={(e) => updatePayment(payment.id, 'dueDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button className="add-payment-btn" onClick={addPayment}>
        + Add Another Payment
      </button>
    </div>
  );
};

export default Payments;