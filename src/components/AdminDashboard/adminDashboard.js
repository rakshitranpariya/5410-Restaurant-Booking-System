import React, { useState } from 'react';
import { Layout, Tabs } from 'antd';
import { useSelector } from 'react-redux';
import Loader from '../../shared/loader';
import ApiUtils from '../../helpers/APIUtils';
import ReviewFilters from './ReviewFilters';
import TopCustomers from './TopCustomers';
<<<<<<< HEAD
import Top10Time from './Top10Time';
import Top10Restaurants from './Top10Restaurant';
=======
import Top10Time from "./Top10Time";
import TopFoodItems from "./Top10FoodItems";

>>>>>>> development
const { Content } = Layout;
const { TabPane } = Tabs;

const api = () => new ApiUtils();

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1'); // State to keep track of the active tab
  const { user } = useSelector(state => state.auth);

  const handletabClick = tabKey => {
    console.log(`Clicked on tab ${tabKey}`);
    setActiveTab(tabKey);
  };

  const tabs = [
    { name: 'Tab 2', content: <div>Content for Tab 2</div> },
    { name: 'Tab 10 Time for Food Order', content: <Top10Time /> },
<<<<<<< HEAD
    { name: 'Top 10 Restaurant for Food Ordering', content: <Top10Restaurant /> },

=======
    { name: 'Tab 10 Food items', content: <TopFoodItems /> },
>>>>>>> development
    { name: 'Top 10 Customers', content: <TopCustomers /> },
    { name: 'Filter Reviews', content: <ReviewFilters /> },
  ];

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      {isLoading && <Loader />}
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <Tabs activeKey={activeTab} onChange={handletabClick} style={{ marginBottom: 16 }}>
          {tabs.map((tab, index) => (
            <TabPane tab={tab.name} key={`${index + 1}`}>
              {activeTab === `${index + 1}` && <div>{tab.content}</div>}
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
