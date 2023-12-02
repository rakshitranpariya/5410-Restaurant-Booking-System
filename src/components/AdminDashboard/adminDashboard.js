import React, { useEffect, useState } from 'react';
import { Layout, Table, Tag, Tooltip } from 'antd';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../helpers/firebase-config';
import Approve from '../../assets/check.png';
import Reject from '../../assets/delete-button.png';
import Loader from '../../shared/loader';
import ApiUtils from '../../helpers/APIUtils';

const api = () => new ApiUtils();
const { Content } = Layout;

const AdminDashboard = () => {
    const [allData, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector(state => state.auth);

    return (
        <Layout style={{ flex: 1, overflow: 'hidden' }}>
            {isLoading && <Loader />}
            <Content style={{ padding: '24px', overflow: 'auto' }}>
                <h1>Admin</h1>
            </Content>
        </Layout>
    );
};

export default AdminDashboard;
