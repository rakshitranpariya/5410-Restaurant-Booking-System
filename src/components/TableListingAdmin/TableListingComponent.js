import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const TableItemComponent = ({
  restaurantId: initialRestaurantId,
  id: initialId,
  typeName: initialTypeName,
  personCapacity: initialPersonCapacity,
  availableTable: initialAvailableTable,
  totalTable: initialTotalTable,
}) => {
  const navigate = useNavigate();

  const [typeName, setTypeName] = useState(initialTypeName);
  const [personCapacity, setPersonCapacity] = useState(initialPersonCapacity);
  const [availableTable, setAvailableTable] = useState(initialAvailableTable);
  const [totalTable, setTotalTable] = useState(initialTotalTable);
  const [id, setId] = useState(initialId);
  const [restaurantId, setRestaurantId] = useState(initialRestaurantId);
  const [editMode, setEditMode] = useState(false);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      console.log('typeName:', typeName);
      console.log('personCapacity:', personCapacity);
      console.log('availableTable:', availableTable);
      console.log('totalTable:', totalTable);
      console.log('id:', id);
      console.log('restaurantId:', restaurantId);
      const response = await axios.post(
        'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/addTableData',
        {
          id,
          restaurantid: restaurantId,
          typeName,
          personCapacity,
          availableTable,
          totalTable,
        }
      );
      console.log(response);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving table item:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.post(
        'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/removeTableData',
        {
          data: {
            id,
            restaurantid: restaurantId,
          },
        }
      );

      // Additional actions after successful deletion if needed

      // Reload the page after deletion
      window.location.reload();
    } catch (error) {
      console.error('Error deleting table item:', error);
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
                  placeholder="Type Name"
                  value={typeName}
                  onChange={e => setTypeName(e.target.value)}
                />
              </div>
              <div className="col-md-2 mb-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Person Capacity"
                  value={personCapacity}
                  onChange={e => setPersonCapacity(e.target.value)}
                />
              </div>
              <div className="col-md-2 mb-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Available Tables"
                  value={availableTable}
                  onChange={e => setAvailableTable(e.target.value)}
                />
              </div>
              <div className="col-md-2 mb-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Tables"
                  value={totalTable}
                  onChange={e => setTotalTable(e.target.value)}
                />
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
                <div className="card-title">{typeName}</div>
              </div>
              <div className="col-md-2 mb-2">
                <div className="card-text">Capacity: {personCapacity}</div>
              </div>
              <div className="col-md-2 mb-2">
                <div className="card-text">Available: {availableTable}</div>
              </div>
              <div className="col-md-2 mb-2">
                <div className="card-text">Total: {totalTable}</div>
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

TableItemComponent.propTypes = {
  initialTypeName: PropTypes.string.isRequired,
  initialPersonCapacity: PropTypes.number.isRequired,
  initialAvailableTable: PropTypes.number.isRequired,
  initialTotalTable: PropTypes.number.isRequired,
};

export default TableItemComponent;
