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

  // Convert time to AM/PM format
  const formatTime = time => {
    const date = new Date(`2000-01-01T${time}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`offer-item card mb-4`} style={{ fontFamily: 'Open Sans, sans-serif' }}>
      <div className="card-body">
        <div className="offer-item-content">
          <div className="row">
            <div className="col-md-6">
              <div className="card-title h5">{title}</div>
              <div className="col-md-12 mb-2">
                <div className="card-text">
                  <strong>Status:</strong> {currentStatus}
                </div>
              </div>
              <div className="card-text h6">City: {city}</div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <div className="card-text">
                    <strong>Opening Time:</strong> {formatTime(startTime)}
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <div className="card-text">
                    <strong>Closing Time:</strong> {formatTime(endTime)}
                  </div>
                </div>
                <div className="col-md-12 mb-2">
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
                <div className="col-md-12 text-md-end">
                  <button className="btn btn-primary" onClick={handleViewMenu}>
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantTile;
