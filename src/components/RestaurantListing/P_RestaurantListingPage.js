import React from 'react';
import RestaurantTile from './C_RestaurentDetailsTile.js';
import './App.css'; 

const restaurantListingPage = () => {
  return (
    <div>
      <h1>Restaurant Display App</h1>
      <RestaurantTile
        imageSrc="path/to/restaurant-image.jpg"
        title="Awesome Restaurant"
        startTime="10:00 AM"
        endTime="8:00 PM"
      />
    </div>
  );
};

export default restaurantListingPage;
