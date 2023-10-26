import React, { useState, useEffect } from 'react';
import RestaurantTile from './C_RestaurentDetailsTile';

const RestaurantListingPage = () => {
  const [restaurantData, setRestaurantData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch(
          'https://l1j6zvbe7c.execute-api.us-east-1.amazonaws.com/restaurantlist'
        );

        if (!response.ok) {
          console.error('Failed to fetch data:', response.statusText);
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('Data received:', data);
        setRestaurantData(data);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="m-5">Restaurant List</h1>
      <div className="container">
        <div className="row">
          {restaurantData.map(restaurant => (
            <div key={restaurant.restaurantid} className="col-md-4">
              <RestaurantTile
                restaurantId={restaurant.restaurantid}
                title={restaurant.name || restaurant.restaurantname || 'Unnamed Restaurant'}
                city={restaurant.city}
                startTime={restaurant.openinghours || 'Not specified'}
                endTime={restaurant.closinghours || 'Not specified'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantListingPage;
