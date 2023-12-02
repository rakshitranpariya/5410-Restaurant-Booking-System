import React, { useState } from 'react';
import { Layout, Card, Tabs } from 'antd';
import { useSelector } from 'react-redux';
import Loader from '../../shared/loader';
import ApiUtils from '../../helpers/APIUtils';

const { Content } = Layout;
const { TabPane } = Tabs;

const api = () => new ApiUtils();

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleCardClick = (cardName) => {
    // You can add logic based on the cardName, for example, show different content
    console.log(`Clicked on ${cardName} card`);
    // You can also conditionally set the iframe source based on the cardName
  };

  const handleFilterReviewsClick = () => {
    // You can add logic for filtering reviews
    console.log('Filter Reviews clicked');
    // You can set the iframe source or trigger other actions
  };

  const cards = [
    { name: 'Card 1', content: 'Content for Card 1' },
    { name: 'Card 2', content: 'Content for Card 2' },
    { name: 'Card 3', content: 'Content for Card 3' },
    { name: 'Card 4', content: 'Content for Card 4' },
    { name: 'Filter Reviews', onClick: handleFilterReviewsClick },
  ];

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      {isLoading && <Loader />}
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <Tabs defaultActiveKey="1" style={{ marginBottom: 16 }}>
          {cards.map((card, index) => (
            <TabPane tab={card.name} key={`${index + 1}`}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
              </div>
            </TabPane>
          ))}
        </Tabs>
        <iframe
          title="Food Order Report"
          width="100%"
          height="1000"
          src="https://lookerstudio.google.com/embed/reporting/051a3f6d-b42a-4249-9c56-1d95ec1f379e/page/tEnnC"
          style={{ border: 0, marginTop: '20px' }}
          allowFullScreen
        ></iframe>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
