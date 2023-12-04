import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OfferItemComponent from './OfferItemComponent';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OfferPage = () => {
  const { user } = useSelector(state => state.auth);
  const [offers, setOffers] = useState([]);
  const [restaurantId, setRestaurantId] = useState(user.id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        const response = await axios.post(
          'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/getOfferDataPerRestaurantid',
          {
            restaurantId: restaurantId,
          }
        );
        const parsedOffers = JSON.parse(response.data.body);
        console.log(parsedOffers);
        setOffers(parsedOffers);
      } catch (error) {
        console.error('Error fetching offer data:', error);
      }
    };

    fetchOfferData();
  }, [restaurantId]);

  const handleAddOfferClick = () => {
    // Logic for adding a new offer
    navigate('/addOfferDetails'); // Update the route based on your setup
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Restaurant Offers</h1>
        </div>
        <div className="col-12">
          <ul className="list-group overflow-auto" style={{ maxHeight: '400px' }}>
            {offers.map(offer => (
              <li key={offer.id} className="list-group-item mb-3">
                <OfferItemComponent
                  id={offer.id}
                  item={offer.item}
                  offerNumber={offer.offernumber}
                  offerType={offer.offertype}
                  restaurantId={offer.restaurantid}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="col-12 mt-3">
          <button className="btn btn-primary" onClick={handleAddOfferClick}>
            Add Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferPage;
