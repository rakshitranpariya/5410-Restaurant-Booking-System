import React, { useEffect, useState } from 'react';
import { Layout, Table, Tag, Tooltip } from 'antd';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../helpers/firebase-config';
import Approve from '../../assets/check.png';
import Reject from '../../assets/delete-button.png';
import Loader from '../../shared/loader';
import './reservationListing.css';
import ApiUtils from '../../helpers/APIUtils';

const api = () => new ApiUtils();
const { Content } = Layout;

const reservationCollectionRef = collection(db, 'reservations');
const ReservationListing = () => {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.auth);

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await api().getTableData({ restaurantId: user.id });
      console.log(res);
      const searchQuery = await query(
        reservationCollectionRef,
        where('restaurantid', '==', user.id)
      );
      const searchData = await getDocs(searchQuery);

      const dataArray = searchData.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      console.log(dataArray);

      setAllData(dataArray);
      localStorage.setItem('reservations', JSON.stringify(dataArray));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleStatus = async (status, record) => {
    try {
      setIsLoading(true);
      const docRef = doc(reservationCollectionRef, record.id);

      await updateDoc(docRef, {
        status: status,
      });

      await getData();

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Guests',
      dataIndex: 'numberOfGuests',
      key: 'numberOfGuests',
    },
    {
      title: 'Reservation Date',
      dataIndex: 'reservationDate',
      key: 'reservationDate',
    },
    {
      title: 'Reservation Time',
      dataIndex: 'reservationTime',
      key: 'reservationTime',
    },
    {
      title: 'Menu Items',
      dataIndex: 'menuitemid',
      key: 'menuitemid',
      render: tags => (
        <>
          {tags.map(tag => (
            <Tag color="blue" key={tag.menuitemid}>
              {tag.itemName}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="action">
          {record.status.toLowerCase() === 'pending' ? (
            <>
              <Tooltip placement="topLeft" title="Approve">
                <img
                  className="icons"
                  role="presentation"
                  onClick={() => handleStatus('approve', record)}
                  src={Approve}
                  style={{ width: '20px', marginRight: '10px' }}
                  alt="#"
                />
              </Tooltip>
              <Tooltip placement="topLeft" title="Reject">
                <img
                  role="presentation"
                  onClick={() => handleStatus('reject', record)}
                  src={Reject}
                  style={{ width: '20px' }}
                  alt="#"
                />
              </Tooltip>
            </>
          ) : (
            <span
              className="status-text"
              style={{ color: record.status === 'reject' ? 'red' : 'green' }}
            >
              {record.status}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      {isLoading && <Loader />}
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <Table dataSource={allData} columns={columns} />
      </Content>
    </Layout>
  );
};

export default ReservationListing;
