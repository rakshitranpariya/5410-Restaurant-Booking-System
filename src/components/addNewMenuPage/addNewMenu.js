import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";

// import { useNavigate } from "react-router-dom";
const NewMenuEntry = () => {
  //   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    restaurantid: "",
    name: "",
    price: "",
    availability: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  //   const handleViewMenu = (e) => {
  //     navigate("/new-route");
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newId = uuidv4();

    try {
      const response = await axios.post(
        "YOUR_LAMBDA_FUNCTION_ENDPOINT", // Replace with your actual Lambda function endpoint
        { ...formData, id: newId }
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
      <h1 className="mb-4">Menu Entry Form</h1>
      <form onSubmit={handleSubmit}>
        {/* <div className="mb-3">
          <label className="form-label">ID:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="form-control"
          />
        </div> */}

        <div className="mb-3">
          <label className="form-label">Restaurant ID:</label>
          <input
            type="text"
            name="restaurantid"
            value={formData.restaurantid}
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
          <label className="form-label">Price:</label>
          <input
            type="text"
            name="price"
            value={formData.price}
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

        <div className="d-flex">
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>

          {/* <button
            type="button"
            className="btn btn-success"
            onClick={handleViewMenu}
          >
            View Menu
          </button> */}
        </div>
      </form>
    </div>
  );
};

export default NewMenuEntry;
