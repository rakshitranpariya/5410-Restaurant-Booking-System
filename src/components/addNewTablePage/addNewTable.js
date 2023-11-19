import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "bootstrap/dist/css/bootstrap.min.css";

const RestaurantTableForm = () => {
  const [formData, setFormData] = useState({
    restaurantId: "123", // Assuming you need restaurantId for the Lambda function
    id: "",
    typeName: "",
    personCapacity: "",
    availableTable: "",
    totalTable: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newId = uuidv4();

    try {
      const response = await axios.post(
        "https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/addTableData",
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
      <h1 className="mb-4">Restaurant Table Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Table Type:</label>
          <input
            type="text"
            name="typeName"
            value={formData.typeName}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Person Capacity:</label>
          <input
            type="text"
            name="personCapacity"
            value={formData.personCapacity}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Available Tables:</label>
          <input
            type="text"
            name="availableTable"
            value={formData.availableTable}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Total Tables:</label>
          <input
            type="text"
            name="totalTable"
            value={formData.totalTable}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RestaurantTableForm;
