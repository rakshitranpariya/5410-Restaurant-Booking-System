import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NewMenuEntry = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: uuidv4(),
    restaurantid: user.id,
    name: '',
    price: '',
    availability: '',
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
        'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/addMenuData', // Replace with your actual Lambda function endpoint
        { ...formData, id: newId }
      );

      console.log('Response:', response.data);
      // Handle the response as needed

      navigate('/menuListingADMIN');
    } catch (error) {
      console.error('Error:', error);
      // Handle errors
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <h1 className="mb-4 text-center">Menu Entry Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Price:</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3 d-flex">
              <label className="form-label">Availability :</label>
              <div className="form-check ms-2">
                <input
                  type="radio"
                  name="availability"
                  id="available"
                  value="available"
                  checked={formData.availability === 'available'}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="available" className="form-check-label">
                  Available
                </label>
              </div>
              <div className="form-check ms-2">
                <input
                  type="radio"
                  name="availability"
                  id="notavailable"
                  value="notavailable"
                  checked={formData.availability === 'notavailable'}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="notavailable" className="form-check-label">
                  Not Available
                </label>
              </div>
            </div>

            <div className="d-flex  ">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>

              <button className="btn btn-secondary  ms-3" onClick={goBack}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMenuEntry;
