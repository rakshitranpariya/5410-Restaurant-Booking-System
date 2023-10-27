import React, { useState, useEffect } from 'react';
import { auth, db, provider } from '../../helpers/firebase-config';
import './restaurant.css';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
// import { Button, notification } from 'antd';
import { message } from 'antd';
// import { Modal } from 'antd';
import { useSelector } from 'react-redux'
import { Table, Button, Modal, ModalBody, ModalFooter, ModalHeader, Card, CardBody, CardHeader, Input } from "reactstrap"
import { BiEdit } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import axios from 'axios';
import { any } from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const Restaurant = () => {
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: 1,
    restaurantid: ""
  });
  const userEmail = localStorage.getItem("userEmail")
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [DeletereservationsId, SetDeletereservationsId] = useState(null);

  const [isShowAddReservation, setisShowAddReservation] = useState(false);
  const [restaurentData, setRestaurentData] = useState([]);
  // const [restaurantid, setrestaurantid] = useState(null);



  useEffect(() => {
    fetchData();
    
    getResturenrData()
  }, []);

  const fetchData = async () => {
    try {

      

      let url = "https://nsbbk26x0l.execute-api.us-east-1.amazonaws.com/getall"
      
      let data = await axios.get(url)
      // let response = data.json()
      console.log("data", data.data);
      let filterData=data?.data.filter((f)=>f.data.userId==userEmail)
      console.log("filterData",filterData)
      // let sorData = data?.data?.sort((a, b) => new Date(a?.data?.reservationDate) < new Date(b?.data?.reservationDate))
      setReservations(filterData)

      // setReservations(data.map(doc => ({ ...doc.data, id: doc.id })));

      // setReservations(arr);
    } catch (error) {
      console.error('Error fetcdatadatadatahing data:', error);
      // console.error('datadatadata:', error);
    }
  };

  const getResturenrData = async () => {

    let url = "https://l1j6zvbe7c.execute-api.us-east-1.amazonaws.com/restaurantlist"
    let data = await axios.get(url)
    let response = data?.data
    console.log("data", response)
    setRestaurentData(response)

  }

  const canEditOrDelete = (reservationDate, reservationTime) => {
    
    var currentDate = new Date();

    // Add 1 hour to the current date
    currentDate.setHours(currentDate.getHours() + 1);
    const reservationDateTime = new Date(`${reservationDate}T${reservationTime}`);
    // const diffHours = (reservationDateTime -currentDate) / 1000 / 60 / 60;
    const diffHours = (reservationDateTime > currentDate)
    // alert(diffHours)

    // console.log("diffHours", diffHours)
    return diffHours
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    if (name == "reservationTime") {

      const minDate = restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.openinghours
      const minTime = new Date(`20-10-2023T${minDate}`);
      const  getValue=new Date(`20-10-2023T${value}`)

      const maxDate = restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.closinghours
      const maxTime = new Date(`${formData.reservationDate}T${maxDate}`);
      const currenttime = new Date(`${formData.reservationDate}T${value}`);

      var currentDate1 = new Date();

      // Add 1 hour to the current date
      currentDate1.setHours(currentDate1.getHours());
      const reservationDateTime1 = new Date()
      reservationDateTime1.setHours(value);
console.log("test",reservationDateTime1,currentDate1)
let minDateFinal=moment(minDate,'HH:mm a').format('HH:mm a')
let maxDateFinal=moment(maxDate,'HH:mm a').format('HH:mm a')
let valueDateFinal=moment(value,'HH:mm a').format('HH:mm a')


      // console.log("minDate", moment(minDate,'HH:mm a').format('HH:mm a')<moment(value,'HH:mm a').format('HH:mm a'),moment(maxDate,'HH:mm a').format('HH:mm a')>moment(value,'HH:mm a').format('HH:mm a') , minDate,value,maxDate,getValue)
      // console.log("minDate",typeof minDate,typeof  value,typeof maxDate)
      // console.log("maxTime > currenttime > minTime", maxTime > currenttime && currenttime > minTime)

      if (valueDateFinal>=minDateFinal && valueDateFinal<=maxDateFinal ) {
        setFormData(prevState => ({
          ...prevState,
          [name]: value,
        }));
      } else {
        setFormData(prevState => ({
          ...prevState,
          [name]: "",
        }));
      }


    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));

    }


  };

  const handleSubmit = async event => {
    event.preventDefault();
    console.log("formData", formData)
  
    let formDataArray = Object.values(formData)
    let checkValidation = formDataArray.some((e) => e == "")
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // this might not be necessary if CORS is correctly setup on the server
      }
    };
  
    if (checkValidation) {
      toast.error("Please enter all required fields.")
      // messageApi.open({
      //   type: 'error',
      //   content: 'Please enter all required fields.',
      //   duration: 5,
      //   style: { float: "right" }
      // });
      // window.scrollTo({
      //   top: 0,
      //   behavior: "smooth", // for smoothly scrolling
      // });
  
      return false
    }

    if (isEditing) {
      
      // let url = "https://nsbbk26x0l.execute-api.us-east-1.amazonaws.com/update";
      let url="https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/reservation/updatereservation"
      let setData = {
        "pathParameters": {
          id: currentEditId
        },
        "body": {
          ...formData,
          userId: userEmail,


        }

      }
      // let setData={
      //   ...formData,
      //   userId: userEmail,
      //   id: currentEditId

      // }
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/reservation/createreservation',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : setData
      };
      let data = await axios.post(url, config.data, config.headers)
      // await updateDoc(washingtonRef, {
      //   ...formData,
      //   userId: userEmail,

      // });
      console.log("data", data)

      messageApi.open({
        type: 'success',
        content: 'Booking updated successfully!',
        duration: 6,
        style: { float: "right" }
      });

      setIsEditing(false);
      setCurrentEditId(null);
      // setFormData({})
    } else {

      
      // let url = "https://nsbbk26x0l.execute-api.us-east-1.amazonaws.com/create";
      let setData = {
        ...formData,
        userId: userEmail,
      }
      // let data = JSON.stringify({
      //   "customerName": "Jinal Dave",
      //   "reservationDate": "2023-05-15",
      //   "reservationTime": "18:02",
      //   "numberOfGuests": 1,
      //   "restaurantid": 1
      // });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/reservation/createreservation',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : setData
      };
      
      // let data = await axios.post(config.url,config.data)
      let data = await axios.post(config.url,config.data,config.headers)
      // await setDoc(doc(reservationsRef), {
      //   ...formData,
      //   userId: userEmail,

      // });
      console.log("data", data)
      messageApi.open({
        type: 'success',
        content: 'Thank you! your booking is successful.',
        duration: 6,
        style: { float: "right" }
      });
      // alert("hi")

    }
    setFormData({
      customerName: '',
      reservationDate: '',
      reservationTime: '',
      numberOfGuests: 1,
      restaurantid: ""
    })
    fetchData();
    setisShowAddReservation(false)


  };

  const handleEdit = async(reservation) => {
    let url="https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/reservation/editreservation"
    let setData={
      
        "pathParameters": {
            "id": reservation?.id
        }
    
    }
    let response= await axios.post(url,setData,{
      headers:{
        "Content-Type":"application/json"
      }
    })
    console.log("response",response)

    // if(response?.)

    setisShowAddReservation(true)
    setIsEditing(true);
    setCurrentEditId(reservation?.id);
    setFormData(response?.data);
    try{

    }catch(error){
      console.log("error",error)
    }
    
    
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    // let url = "https://nsbbk26x0l.execute-api.us-east-1.amazonaws.com/delete";
    let url="https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/reservation/deletereservation"
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Adding CORS headers
      },
      data: { // Including the data you want to send as request body
        "pathParameters": {
          id: DeletereservationsId
        }
      }
    };
  
    try {
      let response = await axios.post(url, config.data,config.headers); // Using axios.delete() method here
      console.log("data", response.data);
      
      messageApi.open({
        type: 'success',
        content: 'Booking deleted successfully!',
        duration: 10,
        style: { float: "right" }
      });
  
      setIsModalOpen(false);
      SetDeletereservationsId(null);
      fetchData();
  
    } catch (error) {
      console.error('An error occurred while deleting the reservation:', error);
    }
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    SetDeletereservationsId(null);



  };
  const handleDelete = reservationId => {
    setIsModalOpen(true);
    SetDeletereservationsId(reservationId)

    
  };
  const handleCancelReservationModal = () => {
    setisShowAddReservation(false)
    setFormData({
      customerName: '',
      reservationDate: '',
      reservationTime: '',
      numberOfGuests: 1,
      restaurantid: ""
    })
    setIsEditing(false);
    setCurrentEditId(null);
  }

  return (
    <div className="restaurant-container">
      {/* <div className=""> */}
      {contextHolder}
      <ToastContainer />
      {/* <Modal title="Confirm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Yes, I want to delete this record.</p>

      </Modal> */}
      {/* toggle={handleCancel} */}
      <Modal isOpen={isModalOpen} >
        <ModalHeader >Confirm</ModalHeader>
        <ModalBody>
          <p>Yes, I want to delete this record.</p>
        </ModalBody>
        <ModalFooter>
          <Button className='bg-secondary' onClick={handleCancel} >Cancel</Button>{" "}
          <Button className='bg-danger' onClick={handleOk} > Delete  </Button>
        </ModalFooter>

        {
          // min={restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0].openinghours}
          console.log("hello", restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.openinghours?.substring(0, 5))
        }
      </Modal>
      {/* toggle={handleCancelReservationModal} */}
      <Modal isOpen={isShowAddReservation}  >
        <ModalHeader >{isEditing ? "Edit Booking Details" : "Add New Booking Details"}</ModalHeader>
        <ModalBody>
          <form >
            <div className='col-12 mb-3' >
              <label>Customer Name</label><span className='text-danger' >*</span>
              <input
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Customer Name"
                className='form-control mb-3'
              />
              <label>Number of Person(s)</label><span className='text-danger' >*</span>
              <input
                type="number"
                min="1"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleInputChange}
                className='form-control'

              />

            </div>
            <div className='col-12 '>
              {
                console.log("restaurentData", restaurentData)
              }
              <label>Restaurant</label><span className='text-danger' >*</span>
              <Input
                id="exampleSelect"
                name="restaurantid"
                type="select"
                className='form-control mb-3'
                onChange={handleInputChange}
                value={formData?.restaurantid }

              >
                <option value={""} >---select---</option>
                {
                  restaurentData?.length > 0 && restaurentData?.map((restaurant) => {
                    return <>
                      <option value={restaurant?.restaurantid}>
                        {restaurant?.name}
                      </option>


                    </>

                  })
                }
              </Input>
            </div>
        {  formData?.restaurantid!="" && <div className='row'>
              <div className='col-12 mb-3 text-success' >
            {  `Opening Time:${ restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.openinghours} and Closing Time:${ restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.closinghours}` }
              </div>

            </div>}
            <div className='row' >
              <div className='col-6' >
                <label>Reservation Date</label><span className='text-danger' >*</span>

                <input
                  type="date"
                  name="reservationDate"
                  value={formData.reservationDate}
                  onChange={handleInputChange}
                  className='form-control '

                />

              </div>

          { formData?.restaurantid!="" &&  <div className='col-6' >
                <label>Reservation Time</label><span className='text-danger' >*</span>
                {/* <span title={`Opening Time:${ restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.openinghours} and Closing Time:${ restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.closinghours}` } >test</span> */}
                <input
                  type="time"
                  name="reservationTime"
                
               
                  value={formData.reservationTime}
                  onChange={handleInputChange}
                  className='form-control '

                />



              </div>}

            </div>



            {}


          </form>

        </ModalBody>
        <ModalFooter>
          <Button className='bg-secondary' onClick={handleCancelReservationModal}>
            Cancel
          </Button>{' '}
          <Button className='bg-primary' onClick={(e) => {
            handleSubmit(e)
          }}>
            {isEditing ? 'Update' : 'Book'}

          </Button>
        </ModalFooter>
      </Modal>

      {/* Reservation Form */}



      {/* List of Reservations */}


      {}

      {/* <Card>
        <CardHeader>
          <h4>Restaurants</h4>
        </CardHeader>
      </Card> */}

      <Card className='mt-2'>
        <CardHeader>
          <span className='flaot-start h4'>Restaurants</span>
          <Button className='float-end bg-success' onClick={() => {
            setisShowAddReservation(true)
          }} >Add Booking</Button>
        </CardHeader>
        <CardBody className=''>
          <p className='h6 mt-lg-4 mt-sm-2' >Total Bookings{`(${reservations?.length})`}</p>
          <Table bordered>
            <thead>
              <tr>
                <th>
                  #
                </th>
                <th>
               Customer Name
                </th>
                <th>Restaurant Name</th>
                <th>
                  Date
                </th>
                <th>
                  Time
                </th>
                <th>
                  Number of Person(s)
                </th>
                <th>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {
                console.log("reservationsreservations", reservations)
              }
              {reservations?.map((reservation, i) => (
                <tr>
                  <th scope="row">
                    {i + 1}
                  </th>
                  <td>
                    {reservation?.data?.customerName}
                  </td>
                  {
                   console.log("name",restaurentData?.filter((f)=>Number(f.restaurantid)==Number(reservation?.data?.restaurantid)))

                  }
                  <td>
                    {restaurentData?.filter((f)=>Number(f.restaurantid)==Number(reservation?.data?.restaurantid))[0]?.name}
                  </td>
                  <td>
                    {reservation?.data?.reservationDate}
                  </td>
                  <td>
                    {reservation?.data?.reservationTime}
                  </td>
                  <td>
                    {reservation?.data?.numberOfGuests}
                  </td>
                  <td>
                    <div className=' ' >
                      {canEditOrDelete(reservation?.data?.reservationDate, reservation?.data?.reservationTime) && (
                        // {true && (
                        <>
                          {/* <button className='mx-2' onClick={() => handleEdit(reservation)}>
                          
                            Edit
                            
                            </button> */}
                          <BiEdit className="mx-2 h5 " style={{ cursor: "pointer" }} onClick={() => handleEdit(reservation)} />

                          {/* <button className='bg-danger' onClick={() => handleDelete(reservation.id)}>Delete</button> */}
                          <AiOutlineDelete className='text-danger h5 cursor-pointer ' style={{ cursor: "pointer" }} onClick={() => handleDelete(reservation?.id)} />
                        </>
                      )}
                    </div>

                  </td>
                </tr>

              ))}
            </tbody>
          </Table>

        </CardBody>
      </Card>

    </div>

  );
};

export default Restaurant;
