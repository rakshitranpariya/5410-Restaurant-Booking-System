import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
const NewRestaurantListing = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    openingHours: "",
    closingHours: "",
    availability: "",
    city: "",
    currentStatus: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/addRestaurantData",
        formData
      );

      console.log("Response:", response.data);
      // Handle the response as needed
    } catch (error) {
      console.error("Error:", error);
      // Handle errors
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Restaurant Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">ID:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Opening Hours:</label>
          <input
            type="text"
            name="openingHours"
            value={formData.openingHours}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Closing Hours:</label>
          <input
            type="text"
            name="closingHours"
            value={formData.closingHours}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Availability:</label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Current Status:</label>
          <div className="form-check">
            <input
              type="radio"
              name="currentStatus"
              id="opened"
              value="Opened"
              checked={formData.currentStatus === "Opened"}
              onChange={handleChange}
              className="form-check-input"
            />
            <label htmlFor="opened" className="form-check-label">
              Opened
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              name="currentStatus"
              id="closed"
              value="Closed"
              checked={formData.currentStatus === "Closed"}
              onChange={handleChange}
              className="form-check-input"
            />
            <label htmlFor="closed" className="form-check-label">
              Closed
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewRestaurantListing;
