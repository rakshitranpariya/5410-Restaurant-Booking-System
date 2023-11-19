import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MenuPage = () => {
  const { restaurantId } = useParams();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMounted = useRef(true); // Use useRef to track whether the component is mounted

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          `https://l1j6zvbe7c.execute-api.us-east-1.amazonaws.com/individualmenulist`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              restaurantid: restaurantId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch menu');
        }

        const menuData = await response.json();
        setMenu(menuData);
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
      // Set isMounted to false when the component is unmounted
      isMounted.current = false;
    };
  }, [restaurantId]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-4">Menu for Restaurant</h2>

      {!loading && ( // Render only when loading is false
        <ul className="list-group">
          {menu.map(item => (
            <li key={item.menuitemid} className="list-group-item">
              <div className="row">
                <div className="col-md-6">
                  <strong style={{ fontSize: '1.5em' }}>{item.Name}</strong>
                </div>
                <div className="col-md-3" style={{ fontSize: '1.5em' }}>
                  ${item.Price}
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
