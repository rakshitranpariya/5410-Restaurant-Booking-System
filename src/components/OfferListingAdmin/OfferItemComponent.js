import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const OfferItemComponent = ({
  id: initialId,
  item: initialItem,
  offerNumber: initialOfferNumber,
  offerType: initialOfferType,
  restaurantId: initialRestaurantId,
  refreshOffers, // Function to refresh offers after deletion
}) => {
  const [id, setId] = useState(initialId);
  const [item, setItem] = useState(initialItem);
  const [offerNumber, setOfferNumber] = useState(initialOfferNumber);
  const [offerType, setOfferType] = useState(initialOfferType);
  const [restaurantId, setRestaurantId] = useState(initialRestaurantId);

  const handleDeleteClick = async () => {
    try {
      const response = await axios.post(
        'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/deleteOfferData',
        {
          id,
        }
      );

      console.log(response);
      window.location.reload();
      //   location.reload();
    } catch (error) {
      console.error('Error deleting offer item:', error);
    }
  };

  return (
    <div className={`offer-item card`}>
      <div className="card-body">
        <div className="offer-item-content text-center">
          <div className="row align-items-center">
            <div className="col-md-3 mb-2">
              <div className="card-title">Item: {item}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="card-text"> {offerNumber}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="card-text"> {offerType}</div>
            </div>
            <div className="col-md-3 mb-2 text-md-end">
              <button className="btn btn-primary" onClick={handleDeleteClick}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

OfferItemComponent.propTypes = {
  initialId: PropTypes.string.isRequired,
  initialItem: PropTypes.string.isRequired,
  initialOfferNumber: PropTypes.string.isRequired,
  initialOfferType: PropTypes.string.isRequired,
  initialRestaurantId: PropTypes.string.isRequired,
  refreshOffers: PropTypes.func.isRequired,
};

export default OfferItemComponent;
