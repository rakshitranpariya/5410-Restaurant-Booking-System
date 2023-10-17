// App.js

import React from 'react';
import RestaurantTile from './RestaurantTile'; // Adjust the path accordingly
import './App.css'; // You can create an App.css file for general styles

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
      {/* Add more RestaurantTile components as needed */}
    </div>
  );
};

export default restaurantListingPage;
