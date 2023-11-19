import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MenuPage = () => {
  const { restaurantId } = useParams();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMounted = useRef(true); // Use useRef to track whether the component is mounted

  useEffect(() => {
    console.log(restaurantId);
    const fetchMenu = async () => {
      try {
        const response = await axios.post(
          "https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/getMenuDataPerRestaurantId",
          {
            restaurantid: restaurantId,
          }
        );

        // if (!response.ok) {
        //   throw new Error("Failed to fetch menu");
        // }
        console.log(response);

        console.log(JSON.parse(response.data.body).menuItems);
        setMenu(JSON.parse(response.data.body).menuItems);
        console.log(menu);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchMenu();

    return () => {
      isMounted.current = false;
    };
  }, [restaurantId]); // Empty dependency array to run the effect only once on mount

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-4">Menu for Restaurant</h2>

      {!loading && ( // Render only when loading is false
        <ul className="list-group">
          {menu.map((item) => (
            <li key={item.id} className="list-group-item">
              <div className="row">
                <div className="col-md-6">
                  <strong style={{ fontSize: "1.5em" }}>{item.name}</strong>
                </div>
                <div className="col-md-3" style={{ fontSize: "1.5em" }}>
                  ${item.price}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button className="btn btn-secondary mt-4" onClick={goBack}>
        Back
      </button>
    </div>
  );
};

export default MenuPage;
