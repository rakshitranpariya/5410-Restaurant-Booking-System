import React, { useEffect, useState } from 'react';
import { Layout, Table, Tooltip } from 'antd';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../helpers/firebase-config';
import Approve from '../../assets/check.png';
import Reject from '../../assets/delete-button.png';
import Loader from '../../shared/loader';
import './reservationListing.css';

const { Content } = Layout;

const reservationCollectionRef = collection(db, 'reservations');

const data = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const ReservationListing = () => {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.auth);

  const getData = async () => {
    try {
      setIsLoading(true);
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
      const data = localStorage.getItem('reservations');

      setAllData(JSON.parse(data));
      // await getData();
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
    // {
    //   title: 'Tags',
    //   dataIndex: 'tags',
    //   key: 'tags',
    //   render: tags => (
    //     <>
    //       {tags.map(tag => (
    //         <Tag color="blue" key={tag}>
    //           {tag}
    //         </Tag>
    //       ))}
    //     </>
    //   ),
    // },
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
