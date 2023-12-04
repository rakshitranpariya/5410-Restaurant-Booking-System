import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const RestaurantTableForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    restaurantId: user.id,
    id: '',
    typeName: '',
    personCapacity: '',
    availableTable: '',
    totalTable: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newId = uuidv4();

    try {
      const response = await axios.post(
        'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/addTableData',
        { ...formData, id: newId }
      );

      console.log('Response:', response.data);
      navigate('/tableListingAdmin');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-12 offset-md-2">
          <h1 className="text-center mb-4">Add Dining Table</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Table Type:</label>
              <input
                type="text"
                name="typeName"
                value={formData.typeName}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Person Capacity:</label>
              <input
                type="text"
                name="personCapacity"
                value={formData.personCapacity}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Available Tables:</label>
              <input
                type="text"
                name="availableTable"
                value={formData.availableTable}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Total Tables:</label>
              <input
                type="text"
                name="totalTable"
                value={formData.totalTable}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="d-flex">
              <button type="submit" className="btn btn-primary btn-block mt-4">
                Submit
              </button>
              <button className="btn btn-secondary mt-4 ms-3" onClick={goBack}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantTableForm;
