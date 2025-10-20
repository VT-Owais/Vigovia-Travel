import jsPDF from 'jspdf';

// Preload image function
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const generatePDF = async (itineraryData) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Color palette matching your design
  const colors = {
    lightBlue: [135, 206, 235],
    purple: [147, 112, 219],
    darkPurple: [91, 44, 111],
    white: [255, 255, 255],
    darkText: [44, 62, 80],
    lightGray: [245, 245, 245],
    borderGray: [220, 220, 220],
    tableHeader: [91, 44, 111]
  };

  // Preload logo
  let logoImg = null;
  try {
    logoImg = await loadImage('/src/assets/Images/logo-png.png');
  } catch (error) {
    console.warn('Logo not loaded, will use fallback');
  }

  // Function to add footer on every page
  const addFooter = () => {
    const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
    const totalPages = doc.internal.getNumberOfPages();

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    // Company info (left side)
    doc.setFont("helvetica", "bold");
    doc.text('Vigovia Tech Pvt. Ltd', margin, pageHeight - 20);
    doc.setFont("helvetica", "normal");
    doc.text('Registered Office: H4-109 Gibraltar Hills, Links Business Park, Karnataka, India.', margin, pageHeight - 15);
    doc.text('Phone: +91 9504061112 | Email: Utkransh@Vigovia.Com | CIN: U79119KA2023PTC191890', margin, pageHeight - 10);

    // Logo (right side)
    const logoSize = 15;
    const logoX = pageWidth - margin - logoSize - 5;
    const logoY = pageHeight - 25;

    try {
      if (logoImg) {
        doc.addImage(logoImg, 'PNG', logoX, logoY, logoSize, logoSize);
      } else {
        throw new Error('No logo loaded');
      }
    } catch (error) {
      // Simple fallback
      doc.setFillColor(...colors.darkPurple);
      doc.rect(logoX, logoY, logoSize, logoSize, 'F');
    }

    // Page number
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
  };

  // Function to check if new page is needed
  const checkNewPage = (requiredSpace) => {
    if (yPosition + requiredSpace > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
      addFooter();
      return true;
    }
    return false;
  };



// HEADER SECTION
// Create left-to-right gradient effect for the greeting area
const gradientSteps = 20;
const gradientWidth = pageWidth * 0.8; 
const gradientStartX = (pageWidth - gradientWidth) / 2; 
const gradientHeight = 40;
const gradientY = 60;
const stepWidth = gradientWidth / gradientSteps;

for (let i = 0; i < gradientSteps; i++) {
  const ratio = i / (gradientSteps - 1);
  
  // Interpolate between blue and purple (left to right)
  const r = Math.round(110 + (138 - 110) * ratio);
  const g = Math.round(203 + (109 - 203) * ratio);
  const b = Math.round(245 + (241 - 245) * ratio);
  
  doc.setFillColor(r, g, b);
  doc.rect(gradientStartX + i * stepWidth, gradientY, stepWidth + 1, gradientHeight, 'F');
}

// Logo at top center
const logoWidth = 35;  
const logoHeight = 25; 
const logoX = (pageWidth - logoWidth) / 2;
const logoY = 25;

try {
  if (logoImg) {
    doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } else {
    throw new Error('No logo loaded');
  }
} catch (error) {
  
  doc.setFillColor(...colors.white);  
  doc.roundedRect(logoX, logoY, logoWidth, logoHeight, 5, 5, 'F');
  doc.setFontSize(16);
  doc.setTextColor(...colors.darkPurple); 
  doc.setFont("helvetica", "bold");
  doc.text('V', logoX + logoWidth/2 - 2, logoY + logoHeight/2 + 3);
}

// Tagline
doc.setFontSize(10);
doc.setFont("helvetica", "normal");
const taglineWidth = doc.getTextWidth('PLAN.PACK.GO!');
doc.text('PLAN.PACK.GO!', (pageWidth - taglineWidth) / 2, 55);

// Traveler greeting 
doc.setFontSize(20);
doc.setFont("helvetica", "bold");
const travelerName = itineraryData.travelerName || 'Traveler';
const hiWidth = doc.getTextWidth(`Hi, ${travelerName}!`);
doc.setTextColor(...colors.white); 
doc.text(`Hi, ${travelerName}!`, (pageWidth - hiWidth) / 2, 75);

// Trip Title
doc.setFontSize(16);
const tripText = `${itineraryData.destination || 'Your Destination'} Itinerary`;
const tripWidth = doc.getTextWidth(tripText);
doc.text(tripText, (pageWidth - tripWidth) / 2, 88);

// Duration
doc.setFontSize(12);
doc.setFont("helvetica", "normal");
const daysCount = itineraryData.days?.length || 0;
const nightsText = `${daysCount} Days ${daysCount - 1} Nights`;
const nightsWidth = doc.getTextWidth(nightsText);
doc.text(nightsText, (pageWidth - nightsWidth) / 2, 96);

yPosition = 115;

  //footer to first page
  addFooter();

  // TRAVEL SUMMARY TABLE
  doc.setFillColor(...colors.lightGray);
  doc.roundedRect(margin, yPosition, contentWidth, 35, 3, 3, 'F');
  doc.setDrawColor(...colors.borderGray);
  doc.roundedRect(margin, yPosition, contentWidth, 35, 3, 3, 'S');

  doc.setFontSize(10);
  doc.setTextColor(...colors.darkText);
  doc.setFont("helvetica", "bold");

  // Table data
  const tableY = yPosition + 10;
  const col1 = margin + 5;
  const col2 = margin + 70;
  const col3 = margin + 140;

  doc.text('Departure From:', col1, tableY);
  doc.text('Departure:', col2, tableY);
  doc.text('Arrival:', col3, tableY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(itineraryData.departureFrom || 'Mumbai', col1, tableY + 6);
  doc.text(itineraryData.departureDate || '31/10/2025', col2, tableY + 6);
  doc.text(itineraryData.returnDate || '01/11/2025', col3, tableY + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text('Destination:', col1, tableY + 16);
  doc.text('No. Of Travelers:', col2, tableY + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(itineraryData.destination || 'Singapore', col1, tableY + 22);
  doc.text((itineraryData.travelers || 4).toString(), col2 + 35, tableY + 22);

  yPosition += 50;

  // DAILY ITINERARY SECTION
  checkNewPage(100);

  doc.setFontSize(14);
  doc.setTextColor(...colors.darkText);
  doc.setFont("helvetica", "bold");
  doc.text('Daily Itinerary', margin, yPosition);
  yPosition += 12;

  (itineraryData.days || []).forEach((day, index) => {
    const dayCardHeight = 95;
    checkNewPage(dayCardHeight);

    // Day card with rounded corners
    doc.setFillColor(252, 252, 255);
    doc.roundedRect(margin, yPosition, contentWidth, dayCardHeight, 3, 3, 'F');
    doc.setDrawColor(...colors.borderGray);
    doc.roundedRect(margin, yPosition, contentWidth, dayCardHeight, 3, 3, 'S');

    // Day sidebar
    doc.setFillColor(...colors.darkPurple);
    doc.roundedRect(margin + 10, yPosition, 18, dayCardHeight, 3, 3, 'F');

    // Day number rotated
    doc.setTextColor(...colors.white);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Day ${index + 1}`, margin + 15, yPosition + 50, { angle: 90 });

    // Day image placeholder
    const imgX = margin + 50;
    const imgY = yPosition + 25;
    doc.setFillColor(200, 200, 200);
    doc.circle(imgX, imgY, 18, 'F');

    // Date below image
    doc.setFontSize(9);
    doc.setTextColor(...colors.darkText);
    doc.setFont("helvetica", "bold");
    const dateText = day.date || '27th November';
    doc.text(dateText, imgX - doc.getTextWidth(dateText) / 2, yPosition + 50);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const locationText = day.location || 'Location';
    doc.text(locationText, imgX - doc.getTextWidth(locationText) / 2, yPosition + 55);

    // Activities column
    const activityX = margin + 85;
    let activityY = yPosition + 15;

    doc.setFontSize(9);
    doc.setTextColor(...colors.darkText);

    // Morning
    if (day.morning) {
      doc.setFont("helvetica", "bold");
      doc.text('Morning', activityX, activityY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const morningLines = doc.splitTextToSize(day.morning, contentWidth - 90);
      doc.text(morningLines, activityX + 3, activityY + 5);
      activityY += 5 + morningLines.length * 4;
    }

    // Afternoon
    if (day.afternoon) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text('Afternoon', activityX, activityY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const afternoonLines = doc.splitTextToSize(day.afternoon, contentWidth - 90);
      doc.text(afternoonLines, activityX + 3, activityY + 5);
      activityY += 5 + afternoonLines.length * 4;
    }

    // Evening
    if (day.evening) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text('Evening', activityX, activityY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const eveningLines = doc.splitTextToSize(day.evening, contentWidth - 90);
      doc.text(eveningLines, activityX + 3, activityY + 5);
    }

    yPosition += dayCardHeight + 8;
  });

  // FLIGHT SUMMARY SECTION
  if (itineraryData.flights && itineraryData.flights.length > 0) {
    checkNewPage(80);

    doc.setFontSize(14);
    doc.setTextColor(...colors.darkPurple);
    doc.setFont("helvetica", "bold");
    doc.text('Flight Summary', margin, yPosition);
    yPosition += 12;

    itineraryData.flights.forEach((flight, idx) => {
      checkNewPage(25);

      // Flight card
      doc.setFillColor(250, 248, 255);
      doc.roundedRect(margin, yPosition, contentWidth, 20, 2, 2, 'F');
      doc.setDrawColor(...colors.borderGray);
      doc.roundedRect(margin, yPosition, contentWidth, 20, 2, 2, 'S');

      doc.setFontSize(9);
      doc.setTextColor(...colors.darkText);
      doc.setFont("helvetica", "normal");

      doc.text(flight.date || 'Thu 10 Jan 24', margin + 5, yPosition + 8);
      doc.setFont("helvetica", "bold");
      const flightText = `Fly ${flight.airline || 'Air India'} (${flight.flightNumber || 'AX-123'})`;
      doc.text(flightText, margin + 45, yPosition + 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`From ${flight.from || 'Delhi'} (DEL) To ${flight.to || 'Singapore'} (SIN)`, margin + 45, yPosition + 14);

      yPosition += 25;
    });

    yPosition += 5;
  }

  // HOTEL BOOKINGS SECTION
  if (itineraryData.hotels && itineraryData.hotels.length > 0) {
    checkNewPage(100);

    doc.setFontSize(14);
    doc.setTextColor(...colors.darkPurple);
    doc.setFont("helvetica", "bold");
    doc.text('Hotel Bookings', margin, yPosition);
    yPosition += 12;

    // Table header
    doc.setFillColor(...colors.darkPurple);
    doc.rect(margin, yPosition, contentWidth, 10, 'F');

    doc.setFontSize(9);
    doc.setTextColor(...colors.white);
    doc.setFont("helvetica", "bold");
    doc.text('City', margin + 5, yPosition + 7);
    doc.text('Check In', margin + 40, yPosition + 7);
    doc.text('Check Out', margin + 75, yPosition + 7);
    doc.text('Nights', margin + 110, yPosition + 7);
    doc.text('Hotel Name', margin + 135, yPosition + 7);

    yPosition += 10;

    // Table rows
    itineraryData.hotels.forEach((hotel, idx) => {
      checkNewPage(12);

      doc.setFillColor(idx % 2 === 0 ? 252 : 248, idx % 2 === 0 ? 252 : 248, idx % 2 === 0 ? 255 : 253);
      doc.rect(margin, yPosition, contentWidth, 10, 'F');

      doc.setFontSize(8);
      doc.setTextColor(...colors.darkText);
      doc.setFont("helvetica", "normal");

      doc.text(hotel.city || 'Singapore', margin + 5, yPosition + 7);
      doc.text(hotel.checkIn || '24/02/2024', margin + 40, yPosition + 7);
      doc.text(hotel.checkOut || '24/02/2024', margin + 75, yPosition + 7);
      doc.text((hotel.nights || 2).toString(), margin + 115, yPosition + 7);
      const hotelName = doc.splitTextToSize(hotel.name || 'Hotel Name', 50);
      doc.text(hotelName[0], margin + 135, yPosition + 7);

      yPosition += 10;
    });

    yPosition += 10;
  }

  // PAYMENT PLAN SECTION
  if (itineraryData.paymentPlan) {
    checkNewPage(80);

    doc.setFontSize(14);
    doc.setTextColor(...colors.darkPurple);
    doc.setFont("helvetica", "bold");
    doc.text('Payment Plan', margin, yPosition);
    yPosition += 12;

    // Total amount box
    doc.setFillColor(250, 248, 255);
    doc.roundedRect(margin, yPosition, contentWidth, 15, 2, 2, 'F');
    doc.setDrawColor(...colors.borderGray);
    doc.roundedRect(margin, yPosition, contentWidth, 15, 2, 2, 'S');

    doc.setFontSize(10);
    doc.setTextColor(...colors.darkText);
    doc.setFont("helvetica", "bold");
    doc.text('Total Amount', margin + 5, yPosition + 10);
    doc.text(`₹ ${itineraryData.paymentPlan.totalAmount || '0,00,000'}`, margin + 90, yPosition + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text('(Inclusive Of GST)', margin + 130, yPosition + 10);

    yPosition += 20;

    // Installment table
    if (itineraryData.paymentPlan.installments) {
      doc.setFillColor(...colors.darkPurple);
      doc.rect(margin, yPosition, contentWidth, 10, 'F');

      doc.setFontSize(9);
      doc.setTextColor(...colors.white);
      doc.setFont("helvetica", "bold");
      doc.text('Installment', margin + 5, yPosition + 7);
      doc.text('Amount', margin + 80, yPosition + 7);
      doc.text('Due Date', margin + 135, yPosition + 7);

      yPosition += 10;

      itineraryData.paymentPlan.installments.forEach((inst, idx) => {
        checkNewPage(12);

        doc.setFillColor(idx % 2 === 0 ? 252 : 248, idx % 2 === 0 ? 252 : 248, idx % 2 === 0 ? 255 : 253);
        doc.rect(margin, yPosition, contentWidth, 10, 'F');

        doc.setFontSize(8);
        doc.setTextColor(...colors.darkText);
        doc.setFont("helvetica", "normal");

        doc.text(inst.name || `Installment ${idx + 1}`, margin + 5, yPosition + 7);
        doc.text(inst.amount || '₹0', margin + 80, yPosition + 7);
        doc.text(inst.dueDate || 'TBD', margin + 135, yPosition + 7);

        yPosition += 10;
      });
    }
  }

  // Save PDF
  const filename = `${itineraryData.destination || 'travel'}-itinerary.pdf`;
  doc.save(filename);
};

// Example usage with sample data
const sampleItineraryData = {
  travelerName: 'Rahul',
  destination: 'Singapore',
  departureFrom: 'Mumbai',
  departureDate: '31/10/2025',
  returnDate: '01/11/2025',
  travelers: 4,
  days: [
    {
      date: '31st October',
      location: 'Singapore',
      morning: 'Arrive in Singapore. Transfer From Airport To Hotel.',
      afternoon: 'Free time to explore the city at your own pace.',
      evening: 'Dinner at Marina Bay Sands'
    },
    {
      date: '1st November',
      location: 'Singapore',
      morning: 'Visit Gardens by the Bay',
      afternoon: 'Explore Sentosa Island',
      evening: 'Night Safari experience'
    }
  ],
  flights: [
    {
      date: 'Thu 31 Oct 25',
      airline: 'Singapore Airlines',
      flightNumber: 'SQ-422',
      from: 'Mumbai',
      to: 'Singapore'
    }
  ],
  hotels: [
    {
      city: 'Singapore',
      checkIn: '31/10/2025',
      checkOut: '03/11/2025',
      nights: 3,
      name: 'Marina Bay Sands'
    }
  ],
  paymentPlan: {
    totalAmount: '75,000',
    installments: [
      { name: 'First Installment', amount: '₹25,000', dueDate: '15/09/2025' },
      { name: 'Second Installment', amount: '₹50,000', dueDate: '15/10/2025' }
    ]
  }
};

