import React, { useState, useEffect } from 'react';
import RestaurantTile from './C_RestaurentDetailsTile';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestaurantListingPage = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');

        const response = await axios.post(
          'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/getRestaurantData'
        );

        const data = response.data.body;
        console.log(data);
        setRestaurantData(JSON.parse(data));
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
    fetchData();
  }, []);

  const handleReservationClick = () => {
    // Navigate to "/restaurants"
    navigate('/restaurants');
  };

  return (
    <div className="my-5 mx-auto" style={{ maxWidth: '800px' }}>
      <h1 className="text-center mb-5">Restaurant List</h1>
      <div className="row">
        {restaurantData.map(restaurant => (
          <div key={restaurant.id} className="col-md-12 mb-4">
            <RestaurantTile
              restaurantId={restaurant.id}
              email={restaurant.email}
              title={restaurant.name}
              city={restaurant.city}
              startTime={restaurant.openingHours}
              endTime={restaurant.closingHours}
              currentStatus={restaurant.currentStatus}
              availability={restaurant.availability}
            />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-primary btn-lg" onClick={handleReservationClick}>
          Make a Reservation
        </button>
      </div>
    </div>
  );
};

export default RestaurantListingPage;
