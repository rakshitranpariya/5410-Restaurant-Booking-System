// MenuPage.js
import React, { useEffect, useState } from 'react';

const MenuPage = ({ restaurantId }) => {
  console.log('RESTAURANTiD:', restaurantId);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    // Make API call to fetch menu data
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
      }
    };

    fetchMenu();
  }, [restaurantId]);

  return (
    <div>
      <h2>Menu for Restaurant</h2>
      {/* Render menu items here */}
      <ul>
        {menu.map(item => (
          <li key={item.itemId}>
            {item.itemName} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuPage;
