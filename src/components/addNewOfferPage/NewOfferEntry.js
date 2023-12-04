import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NewOfferEntry = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: uuidv4(),
    restaurantId: user.id,
    item: '',
    offerNumber: '',
    offerType: '',
  });

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        var data = {
          restaurantid: user.id,
        };
        const response = await axios.post(
          'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/getMenuDataPerRestaurantId',
          data
        );
        setMenuItems(JSON.parse(response.data.body).menuItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, [user.id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newId = uuidv4();

    try {
      const response = await axios.post(
        'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/insertOfferData',
        { ...formData, id: newId }
      );

      console.log('Response:', response.data);

      navigate('/offerListingADMIN');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <h1 className="mb-4 text-center">Offer Entry Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Item:</label>
              <select
                name="item"
                value={formData.item}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select Item</option>
                {menuItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Offer Number:</label>
              <input
                type="text"
                name="offerNumber"
                value={formData.offerNumber}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Offer Type:</label>
              <div className="form-check">
                <input
                  type="radio"
                  name="offerType"
                  id="flatDiscount"
                  value="flatDiscount"
                  checked={formData.offerType === 'flatDiscount'}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="flatDiscount" className="form-check-label">
                  Flat Discount
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  name="offerType"
                  id="percentDiscount"
                  value="percentDiscount"
                  checked={formData.offerType === 'percentDiscount'}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="percentDiscount" className="form-check-label">
                  Percent Discount
                </label>
              </div>
            </div>

            <div className="d-flex">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>

              <button className="btn btn-secondary ms-3" onClick={goBack}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewOfferEntry;
