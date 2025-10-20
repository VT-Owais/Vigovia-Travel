import React from 'react';
import './HomePage.css';
import logo from '../../assets/Images/logo-png.png';
import BasicInfo from '../../Components/FormSection/BasicInfo/BasicInfo';
import DailyPlans from '../../Components/FormSection/DailyPlans/DailyPlans';
import Flights from '../../Components/FormSection/Flights/Flights';
import Hotels from '../../Components/FormSection/Hotels/Hotels';
import Payments from '../../Components/FormSection/Payments/Payments';
import PDFBuilder from '../../Components/PDF/PDFBuilder/PDFBuilder';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="header">
        <div className="header-content">
          <h1>Itinerary Builder</h1>
          <p>Create your travel plan</p>
        </div>
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <div className="content">
        <div className="form-area">
          <BasicInfo />
          <DailyPlans />
          <Flights />
          <Hotels />
          <Payments />
        </div>

        <div className="pdf-area">
          <PDFBuilder />
        </div>
      </div>
    </div>
  );
};

export default HomePage;