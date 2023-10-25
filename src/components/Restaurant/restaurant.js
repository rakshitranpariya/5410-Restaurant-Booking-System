import React, { useState, useEffect } from 'react';
import firebase from '../../helpers/firebase-config';
import { auth, db, provider } from '../../helpers/firebase-config';
import './restaurant.css';

const Restaurant = () => {
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: 1,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = firebase.auth().currentUser;
      const db = firebase.firestore();
      const data = await db.collection('reservations').where('userId', '==', user.uid).get();
      setReservations(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const canEditOrDelete = (reservationDate, reservationTime) => {
    const currentTime = new Date();
    const reservationDateTime = new Date(`${reservationDate}T${reservationTime}`);
    const diffHours = (reservationDateTime - currentTime) / 1000 / 60 / 60;
    return diffHours > 1;
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const db = firebase.firestore();

    if (isEditing) {
      await db.collection('reservations').doc(currentEditId).set(formData);
      setIsEditing(false);
      setCurrentEditId(null);
    } else {
      await db.collection('reservations').add({
        ...formData,
        userId: firebase.auth().currentUser.uid,
      });
    }

    fetchData();
  };

  const handleEdit = reservation => {
    setIsEditing(true);
    setCurrentEditId(reservation.id);
    setFormData(reservation);
  };

  const handleDelete = async reservationId => {
    const db = firebase.firestore();
    await db.collection('reservations').doc(reservationId).delete();
    fetchData();
  };

  return (
    <div className="restaurant-container">
      {/* Reservation Form */}
      <form onSubmit={handleSubmit}>
        <input
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
          placeholder="Customer Name"
        />
        <input
          type="date"
          name="reservationDate"
          value={formData.reservationDate}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="reservationTime"
          value={formData.reservationTime}
          onChange={handleInputChange}
        />
        <input
          type="number"
          min="1"
          name="numberOfGuests"
          value={formData.numberOfGuests}
          onChange={handleInputChange}
        />
        <button type="submit">{isEditing ? 'Update' : 'Book'}</button>
      </form>

      {/* List of Reservations */}
      {reservations.map(reservation => (
        <div key={reservation.id} className="reservation-item">
          <p>Name: {reservation.customerName}</p>
          <p>Date: {reservation.reservationDate}</p>
          <p>Time: {reservation.reservationTime}</p>
          <p>Guests: {reservation.numberOfGuests}</p>
          {canEditOrDelete(reservation.reservationDate, reservation.reservationTime) && (
            <>
              <button onClick={() => handleEdit(reservation)}>Edit</button>
              <button onClick={() => handleDelete(reservation.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Restaurant;
