import React from 'react';
import './PDFBuilder.css';
import { generatePDF } from '../../Utils/pdfGenerator';
import { useItineraryStore } from '../../Hooks/useItineraryStore';

const PDFBuilder = () => {
  const { itinerary } = useItineraryStore();

  const handleGeneratePDF = () => {
    generatePDF(itinerary);
  };

  return (
    <div className="pdf-builder">
      <h3>Generate Itinerary</h3>
      <p>Fill all details and generate your PDF itinerary</p>
      <button className="generate-btn" onClick={handleGeneratePDF}>
        Generate PDF
      </button>
    </div>
  );
};

export default PDFBuilder;