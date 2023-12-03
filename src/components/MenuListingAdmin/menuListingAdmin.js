import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuItemComponent from './menuListingAdminComponent';
import { useNavigate } from 'react-router-dom';

const RestaurantMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState('rest_123');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.post(
          'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/getMenuDataPerRestaurantId',
          {
            params: {
              restaurantid: restaurantId,
            },
          }
        );
        console.log(response);
        const parsedMenuItems = JSON.parse(response.data.body).menuItems;
        setMenuItems(parsedMenuItems);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMenuData();
  }, [restaurantId]);

  const handleAddMenuItemClick = () => {
    // Logic for adding a new menu item
    navigate('/addMenuDetails');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Restaurant Menu</h1>
        </div>
        <div className="col-12">
          <ul className="list-group overflow-auto" style={{ maxHeight: '400px' }}>
            {menuItems.map(menuItem => (
              <li key={menuItem.id} className="list-group-item mb-3">
                <MenuItemComponent
                  restaurantId={restaurantId}
                  id={menuItem.id}
                  name={menuItem.name}
                  price={menuItem.price}
                  availability={menuItem.availability}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="col-12 mt-3">
          <button className="btn btn-primary" onClick={handleAddMenuItemClick}>
            Add Menu Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenuPage;
