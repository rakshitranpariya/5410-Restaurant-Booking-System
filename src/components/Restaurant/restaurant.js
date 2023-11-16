import React, { useState, useEffect } from 'react';
import { auth, db, provider } from '../../helpers/firebase-config';
import './restaurant.css';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { message } from 'antd';
import { useSelector } from 'react-redux'
import { Table, Button, Modal, ModalBody, ModalFooter, ModalHeader, Card, CardBody, CardHeader, Input, Spinner } from "reactstrap"
import { BiEdit, BiLoader } from 'react-icons/bi';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import axios from 'axios';
import { any } from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const Restaurant = () => {
  const animatedComponents = makeAnimated();
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: 1,
    restaurantid: "",
    menuitemid: []
  });
  const userEmail = useSelector((state) => state?.auth?.user?.email)

  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [DeletereservationsId, SetDeletereservationsId] = useState(null);

  const [isShowAddReservation, setisShowAddReservation] = useState(false);
  const [restaurentData, setRestaurentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [MenuItemsOptions, setMenuItemsOptions] = useState([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState([])
  const [showMenuItems, setShowMenuItems] = useState(false)
  const [ForViewOrder, setForViewOrder] = useState(false)
  const [NewFormData, setNewFormData] = useState({})

  useEffect(() => {
    fetchData();
    getResturenrData()
  }, []);

  const fetchData = async () => {
    try {

      setLoading(true)

      let url = "https://nsbbk26x0l.execute-api.us-east-1.amazonaws.com/getall"

      let data = await axios.get(url)
      
      let filterData = data?.data.filter((f) => f.data.userId == userEmail)
      

      setReservations(filterData)
      setLoading(false)


    } catch (error) {
      setLoading(false)

    }
  };

  const getResturenrData = async () => {
    let url = "https://l1j6zvbe7c.execute-api.us-east-1.amazonaws.com/5410-project-getRestaurantDetails"
    let data = await axios.get(url)
    let response = data?.data
    setRestaurentData(response)

  }

  const getMenuItemsData = async (restaurantid, isPopup) => {
    setLoading(true)

    try {
      let url = "https://l1j6zvbe7c.execute-api.us-east-1.amazonaws.com/individualmenulist";
      let payload = {
        "restaurantid": Number(restaurantid)
      }
      let data = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      let response = data?.data
      let filteSetData = response.map((m) => {
        return {
          ...m,
          label: m.Name,
          value: m.menuitemid
        }
      })

      setMenuItemsOptions([...filteSetData])


      setLoading(false)
      let filterIds = filteSetData?.filter((f) => NewFormData?.menuitemid?.includes(f?.value))
      if (isPopup == "editDetails") {
        setLoading(true)
        setTimeout(() => {
          setSelectedMenuItems(filterIds)
          setLoading(false)

        }, 3000)


      } else {
        setSelectedMenuItems([])

      }

    } catch (error) {
      
      setMenuItemsOptions([])

      setLoading(false)

    }


  }

  const canEditOrDelete = (reservationDate, reservationTime) => {

    var currentDate = new Date();

    // Add 1 hour to the current date
    currentDate.setHours(currentDate.getHours() + 1);
    const reservationDateTime = new Date(`${reservationDate}T${reservationTime}`);
    const diffHours = (reservationDateTime > currentDate)

    return diffHours
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    if (name == "reservationTime") {

      const minDate = restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.openinghours
      const minTime = new Date(`20-10-2023T${minDate}`);
      const getValue = new Date(`20-10-2023T${value}`)

      const maxDate = restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.closinghours
      const maxTime = new Date(`${formData.reservationDate}T${maxDate}`);
      const currenttime = new Date(`${formData.reservationDate}T${value}`);

      var currentDate1 = new Date();

      // Add 1 hour to the current date
      currentDate1.setHours(currentDate1.getHours());
      const reservationDateTime1 = new Date()
      reservationDateTime1.setHours(value);
      let minDateFinal = moment(minDate, 'HH:mm a').format('HH:mm a')
      let maxDateFinal = moment(maxDate, 'HH:mm a').format('HH:mm a')
      let valueDateFinal = moment(value, 'HH:mm a').format('HH:mm a')


      if (valueDateFinal >= minDateFinal && valueDateFinal <= maxDateFinal) {
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

    if (name == "restaurantid") {
      setSelectedMenuItems([])
      setFormData((prev) => {
        return {
          ...prev,
          menuitemid: [],
          reservationTime: "",
        }
      })
      if (value) {
        getMenuItemsData(value, "Add")
      }


    }


  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      console.log("formData", formData)
      setLoading(true)
      let ValidateFormData = {
        ...formData,
        menuitemid: ["No Validation"]
      }

      let formDataArray = Object.values(ValidateFormData)

      let checkValidation = formDataArray.some((e) => e == "")

      const config = {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      };

      if (checkValidation) {
        toast.error("Please enter all required fields.")
        setLoading(false)

        return false
      }

      if (isEditing) {


        let url = "https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/reservation/updatereservation"
        let setData = {
          "pathParameters": {
            id: currentEditId
          },
          "body": {
            ...formData,
            userId: userEmail,


          }

        }

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/reservation/createreservation',
          headers: {
            'Content-Type': 'application/json'
          },
          data: setData
        };
        let data = await axios.post(url, config.data, config.headers)


        messageApi.open({
          type: 'success',
          content: 'Booking updated successfully!',
          duration: 6,
          style: { float: "right" }
        });

        setIsEditing(false);
        setCurrentEditId(null);
        setLoading(false)

      } else {

      
        let setData = {
          ...formData,
          userId: userEmail,
          status: "Pending",
        }


        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/reservation/createreservation',
          headers: {
            'Content-Type': 'application/json'
          },
          data: setData
        };

        let data = await axios.post(config.url, config.data, config.headers)

        console.log("data", data)
        messageApi.open({
          type: 'success',
          content: 'Thank you! your booking is successful.',
          duration: 6,
          style: { float: "right" }
        });
        setLoading(false)


      }
   

      handleCancelReservationModal()
      fetchData();

    } catch (error) {
      toast.error("Something went wrong!")
    }



  };

  const handleEdit = async (reservation, isPopup) => {


    try {

      setLoading(true)
     
      setMenuItemsOptions([])
      setSelectedMenuItems([])

      setFormData(reservation?.data);
      setNewFormData(reservation?.data)

      
      setisShowAddReservation(true)
      setIsEditing(true);
      setCurrentEditId(reservation?.id);

      setLoading(false)

      getMenuItemsData(reservation?.data?.restaurantid, isPopup)


    } catch (error) {
      toast.error("Somthing went wrong!")
    }


  };


  const handleOk = async () => {
    setLoading(true)

    let url = "https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/reservation/deletereservation"

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Adding CORS headers
      },
      data: {
        "pathParameters": {
          id: DeletereservationsId
        }
      }
    };

    try {
      let response = await axios.post(url, config.data, config.headers);
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
      setLoading(false)

    } catch (error) {
      setLoading(false)
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
      restaurantid: "",
      menuitemid: []
    })

    setIsEditing(false);
    setCurrentEditId(null);
    setSelectedMenuItems([])
    setMenuItemsOptions([])
  }

  const handleMenuItemsChange = (selectedOptions) => {
    console.log("selectedOptions", selectedOptions)
    setSelectedMenuItems(selectedOptions)
    let selectedIds = selectedOptions.map((m) => {
      return m.value
    })
    setFormData((prev) => {
      return {
        ...prev,
        menuitemid: selectedIds
      }
    })

  }


  const handleCancelShowItems = () => {
    setShowMenuItems(false)
    setFormData({
      customerName: '',
      reservationDate: '',
      reservationTime: '',
      numberOfGuests: 1,
      restaurantid: "",
      menuitemid: [],
    })
    
    setSelectedMenuItems([])
    setMenuItemsOptions([])
    setNewFormData({})


  }

  const handleViewOrder = (reservation) => {
    setSelectedMenuItems([])
    setMenuItemsOptions([])
    setFormData(reservation.data)
    setShowMenuItems(true)
    getMenuItemsData(reservation?.data?.restaurantid)
  }
  const Loader = () => {
    if (loading) {
      return <div className='cover-spin text-center' >
        <Spinner className='' >
          Loading...
        </Spinner>
      </div>
    }
  }

  return (
    <div className="restaurant-container">
      {Loader()}
      {contextHolder}
      <ToastContainer />

      <Modal isOpen={showMenuItems} >
        <ModalHeader >Your Orders</ModalHeader>
        <ModalBody>
          <Table className='m-0 p-0'>
            <thead className='border'>
              <th className='border text-center'>#</th>
              <th className='border text-center'>Item</th>
              <th className='border text-center'>Category</th>
              <th className='border text-center'>Price</th>
            </thead>
            <tbody className='border'>
              {
                formData?.menuitemid?.length > 0 ? MenuItemsOptions?.filter((f) => formData?.menuitemid?.includes(Number(f.menuitemid)))?.map((m, index) => {
                  return <>
                    <tr>
                      <td className='border text-center'>{index + 1}</td>
                      <td className='border text-center'>{m.Name}</td>
                      <td className='border text-center'>{m?.Category}</td>
                      <td className='border text-center'>{"$"}{m?.Price}</td>

                    </tr>
                  </>


                }) : <tr> <td colSpan={"4"} >{"You have not ordered anything yet."}</td> </tr>

              }

            </tbody>
          </Table>
       
        </ModalBody>
        <ModalFooter>
          <Button className='bg-secondary' onClick={handleCancelShowItems} >Back</Button>{" "}
        </ModalFooter>


      </Modal>
     
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
          console.log("hello", restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.openinghours?.substring(0, 5))
        }
      </Modal>

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

              <label>Restaurant</label><span className='text-danger' >*</span>
              <Input
                id="exampleSelect"
                name="restaurantid"
                type="select"
                className='form-control mb-3'
                onChange={handleInputChange}
                value={formData?.restaurantid}

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
            {formData?.restaurantid != "" && <div className='row'>
              <div className='col-12 mb-3 text-success' >
                {`Opening Time:${restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.openinghours} and Closing Time:${restaurentData?.filter(f => (f.restaurantid == formData.restaurantid))[0]?.closinghours}`}
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

              {formData?.restaurantid != "" && <div className='col-6' >
                <label>Reservation Time</label><span className='text-danger' >*</span>
                { }
                <input
                  type="time"
                  name="reservationTime"


                  value={formData.reservationTime}
                  onChange={handleInputChange}
                  className='form-control '

                />

              </div>}

            </div>

            {formData?.restaurantid != "" && <div className='mt-3'>
              <label>Available Items in Menu</label>

              {<Select

                options={MenuItemsOptions?.map((m)=>{return{
                  ...m,
                  label:m.Name + " $"+ m.Price
                }})}
                onChange={(e) => {
                  handleMenuItemsChange(e)
                }}


                value={MenuItemsOptions?.filter(f => formData.menuitemid?.includes(f?.menuitemid))}


                closeMenuOnSelect={false}
                components={animatedComponents}

                isMulti
              />}
            </div>}

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
                  Your Order(s)
                </th>
                <th>
                  Booking Status
                </th>
                <th>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>

              {reservations?.map((reservation, i) => (
                <tr>
                  <th scope="row">
                    {i + 1}
                  </th>
                  <td>
                    {reservation?.data?.customerName}
                  </td>
                  {
                    console.log("name", restaurentData?.filter((f) => Number(f.restaurantid) == Number(reservation?.data?.restaurantid)))

                  }
                  <td>
                    {restaurentData?.filter((f) => Number(f.restaurantid) == Number(reservation?.data?.restaurantid))[0]?.name}
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
                  <td className='text-center'>
                    <AiOutlineEye
                      className='fw-bold h5'
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                       
                        handleCancelReservationModal()
                        handleViewOrder(reservation)

                      }} />
                  </td>
                  <td>
                    {reservation?.data?.status}
                  </td>
                  <td>
                    <div className=' ' >
                      {canEditOrDelete(reservation?.data?.reservationDate, reservation?.data?.reservationTime) && (
                        
                        <>
                          
                          <BiEdit className="mx-2 h5 " style={{ cursor: "pointer" }} onClick={() => handleEdit(reservation, "editDetails")} />

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
