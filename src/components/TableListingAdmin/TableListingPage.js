import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import TableItemComponent from './TableListingComponent'; // Make sure to replace with the appropriate component
import { useNavigate } from 'react-router-dom';

const RestaurantTablesPage = () => {
  const [tables, setTables] = useState([]);
  const [restaurantId, setRestaurantId] = useState('123456');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.post(
          'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/getTableDataPerRestaurantId',
          {
            restaurantId: restaurantId,
          }
        );
        console.log(response);
        const parsedTables = JSON.parse(response.data.body);
        setTables(parsedTables);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    fetchTableData();
  }, [restaurantId]);

  const handleAddTableClick = () => {
    // Logic for adding a new table
    navigate('/addTableDetails'); // Update the route based on your setup
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Restaurant Tables</h1>
        </div>
        <div className="col-12">
          <ul className="list-group overflow-auto" style={{ maxHeight: '400px' }}>
            {tables.map(table => (
              <li key={table.id} className="list-group-item mb-3">
                <TableItemComponent
                  restaurantId={restaurantId}
                  id={table.id}
                  typeName={table.typeName}
                  personCapacity={table.personCapacity}
                  availableTable={table.availableTable}
                  totalTable={table.totalTable}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="col-12 mt-3">
          <button className="btn btn-primary" onClick={handleAddTableClick}>
            Add Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantTablesPage;
