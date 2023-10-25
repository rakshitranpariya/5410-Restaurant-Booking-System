import React from 'react';
import './RestaurantTile.css';

const RestaurantTile = ({ imageSrc, title, startTime, endTime }) => {
  return (
    <div className="tile-container">
      <div className="image-container">
        <img src={imageSrc} alt="Restaurant" className="image" />
      </div>
      <div className="details-container">
        <h2 className="title">{title}</h2>
        <div className="time-container">
          <p className="time-text">Start Time: {startTime}</p>
          <p className="time-text">End Time: {endTime}</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantTile;
