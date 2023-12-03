import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const MenuItemComponent = ({
  restaurantId: initialRestaurantId,
  id: initialId,
  name: initialName,
  price: initialPrice,
  availability: InitialAvailability,
}) => {
  const navigate = useNavigate();

  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPrice);
  const [availability, setAvailability] = useState(InitialAvailability);
  const [id, setId] = useState(initialId);
  const [restaurantId, setRestaurantId] = useState(initialRestaurantId);
  const [editMode, setEditMode] = useState(false);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.post(
        'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/addMenuData',
        {
          id,
          restaurantid: restaurantId,
          name,
          price,
          availability,
        }
      );

      setEditMode(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      console.log(id + '<------------------------>' + restaurantId);
      const response = await axios.post(
        'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/removeMenuData',
        {
          data: {
            id,
            restaurantid: restaurantId,
          },
        }
      );
      console.log(response);

      // Additional actions after successful deletion if needed

      // Reload the page after deletion
      window.location.reload();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <div className={`menu-item card ${editMode ? 'edit-mode' : ''}`}>
      <div className="card-body">
        {editMode ? (
          <div className="menu-item-content text-center">
            <div className="row align-items-center">
              <div className="col-md-4 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Price"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
              <div className="col-md-2 mb-2">
                <select
                  className="form-select"
                  value={availability}
                  onChange={e => setAvailability(e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div className="col-md-2 mb-2">
                <button className="btn btn-primary me-2" onClick={handleSaveClick}>
                  Save
                </button>
                <button className="btn btn-danger" onClick={handleDeleteClick}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="menu-item-content text-center">
            <div className="row">
              <div className="col-md-4 mb-2">
                <div className="card-title">{name}</div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="card-text">${price}</div>
              </div>
              <div className="col-md-2 mb-2">
                <div className="card-text">{availability}</div>
              </div>
              <div className="col-md-2 mb-2">
                <button className="btn btn-primary me-2" onClick={handleEditClick}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

MenuItemComponent.propTypes = {
  initialName: PropTypes.string.isRequired,
  initialPrice: PropTypes.number.isRequired,
};

export default MenuItemComponent;
