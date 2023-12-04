import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './C_RestaurentDetailsTile.css';

const RestaurantTile = ({
  title,
  city,
  startTime,
  endTime,
  restaurantId,
  email,
  currentStatus,
  availability,
}) => {
  const navigate = useNavigate();

  const handleViewMenu = useCallback(() => {
    if (restaurantId) {
      restaurantId = '123456';
      console.log('Navigating to menu with restaurantId:', restaurantId);
      navigate(`/menu/${restaurantId}`);
    } else {
      console.error('restaurantId is undefined');
    }
  }, [navigate, restaurantId]);

  return (
    <div className={`offer-item card mb-4`} style={{ fontFamily: 'Open Sans, sans-serif' }}>
      <div className="card-body">
        <div className="offer-item-content text-center">
          <div className="row align-items-center">
            <div className="col-md-3 mb-2">
              <div className="card-title">Title: {title}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="card-text">City: {city}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="card-text">
                <strong>Opening Time:</strong> {startTime}
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="card-text">
                <strong>Closing Time:</strong> {endTime}
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="card-text">
                <strong>Email:</strong> {email}
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="card-text">
                <strong>Status:</strong> {currentStatus}
              </div>
            </div>
            <div className="col-md-3 mb-2">
              {availability === 'available' ? (
                <div className="card-text">
                  <strong className="text-success">Available</strong>
                </div>
              ) : (
                <div className="card-text">
                  <strong className="text-danger">
                    This restaurant is not available for booking.
                  </strong>
                </div>
              )}
            </div>
            <div className="col-md-3 text-md-end">
              <button className="btn btn-primary" onClick={handleViewMenu}>
                View Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantTile;
