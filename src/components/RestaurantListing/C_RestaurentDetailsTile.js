import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './C_RestaurentDetailsTile.css';

const RestaurantTile = ({ title, city, startTime, endTime, restaurantId }) => {
  const navigate = useNavigate();

  const handleViewMenu = () => {
    console.log('loginnnnnnnnnnnnnnnnnnnnnn', restaurantId);
    if (restaurantId) {
      console.log('Navigating to menu with restaurantId:', restaurantId);
      navigate(`/menu/${restaurantId}`);
    } else {
      console.error('restaurantId is undefined');
    }
  };

  return (
    <div className="card mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
      <div className="card-body">
        <h2 className="card-title mb-3">{title}</h2>
        <p className="card-text mb-2">City: {city}</p>
        <div className="mb-2">
          <p className="card-text">
            <strong>Opening Time:</strong> {startTime}
          </p>
        </div>
        <div className="mb-3">
          <p className="card-text">
            <strong>Closing Time:</strong> {endTime}
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleViewMenu}>
          View Menu
        </button>
      </div>
    </div>
  );
};

export default RestaurantTile;
