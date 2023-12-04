import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MenuPage = () => {
  const { restaurantId } = useParams();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMounted = useRef(true); // Use useRef to track whether the component is mounted

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.post(
          'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/getMenuDataPerRestaurantId',
          {
            restaurantid: restaurantId,
          }
        );

        console.log(response);
        console.log(JSON.parse(response.data.body).menuItems);
        setMenu(JSON.parse(response.data.body).menuItems);
      } catch (error) {
        console.error('Error fetching menu:', error);
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
  }, [restaurantId]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container-fluid mt-4">
      <div className={`offer-item card mb-5`} style={{ fontFamily: 'Open Sans, sans-serif' }}>
        <div className="card-body mx-auto">
          <div className="offer-item-content text-center">
            <h2 className="mb-4">Menu for Restaurant</h2>

            {!loading && (
              <ul className="list-group">
                {menu.map(item => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong className="fs-4">{item.name}</strong>
                    </div>
                    <div className="fs-4">${item.price}</div>
                  </li>
                ))}
              </ul>
            )}

            <button className="btn btn-secondary mt-4" onClick={goBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
