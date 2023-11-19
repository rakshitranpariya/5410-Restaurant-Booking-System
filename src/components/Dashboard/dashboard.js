import React from 'react'
import { Card, CardBody, CardHeader, Col, Input, ButtonGroup, Row, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'
import "./dashboard.css"
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import moment from 'moment';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { BiFilterAlt } from "react-icons/bi"



import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Rectangle, Label } from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function Dashboard() {
    const animatedComponents = makeAnimated();

    const [loading, setLoading] = useState(false)
    const restaurantOwnerId = useSelector((state) => state?.auth?.user?.id)
    
    const [reservations, setReservations] = useState([]);
    const [chartDataForToday, setChartDataForToday] = useState([])
    const [chartDataForMonthly, setChartDataForMonthly] = useState([])
    const [chartDataForWeekly, setChartDataForWeekly] = useState([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [isCallApiForDaily, setIsCallApiForDaily] = useState(false)
    const [isCallApiForWeekly, setIsCallApiForWeekly] = useState(false)
    const [isCallApiForYear, setIsCallApiForYear] = useState(false)
    const [filterDates, setFilterDates] = useState({
        fromDate: "",
        toDate: ""
    })
    const [selectedYear, setSelectedYear] = useState(new Date())
    const [selectedDay, setSelectedDay] = useState(new Date())
    const [startWeekDate, setStartWeekDate] = useState(new Date())
    const endDateinitail = new Date()
    endDateinitail.setDate(endDateinitail.getDate() + 6);
    const [endtWeekDate, setEndtWeekDate] = useState(endDateinitail)
    const [graphControl, setGraphControl] = useState({
        daily: true,
        weekly: false,
        monthly: false
    })


    const handleApplyfilter = () => {
        
        const toDate = moment(new Date(filterDates.toDate)).format("YYYY-MM-DD")
        const fromDate = moment(new Date(filterDates.fromDate)).format("YYYY-MM-DD")
        let filterData = chartData.filter((f) => moment(new Date(f.data.reservationDate)).format("YYYY-MM-DD") >= fromDate && moment(new Date(f.data.reservationDate)).format("YYYY-MM-DD") <= toDate)
        setReservations(filterData)
        setIsShowFilter(false)

    }




    useEffect(() => {
        
        fetchChartData();

    }, [])

    useEffect(() => {
        if (isCallApiForYear) {
            fetchData()
        }
        setIsCallApiForYear(false)
    }, [selectedYear])

    useEffect(() => {
        if (isCallApiForDaily) {
            fetchData()
        }
        setIsCallApiForDaily(false)
    }, [selectedDay])

    useEffect(() => {
        if (isCallApiForWeekly) {
            fetchData()
        }
        setIsCallApiForWeekly(false)
    }, [endtWeekDate])

    useEffect(() => {
        if (graphControl.daily) {
            fetchData()

        }

    }, [graphControl.daily])

    useEffect(() => {
        if (graphControl.weekly) {
            fetchData()

        }

    }, [graphControl.weekly])
    useEffect(() => {
        if (graphControl.monthly) {
            fetchData()

        }

    }, [graphControl.monthly])

    const fetchChartData = async () => {
        try {
            
            let url = "https://wvnzmflpyb.execute-api.us-east-1.amazonaws.com/reservation/getallreservations"



            let data = await axios.get(url)


            
            let jsonFilterData = JSON.parse(data?.data?.body)
            let filterData = jsonFilterData?.filter((f) => f.data.restaurantid == restaurantOwnerId)

            setReservations(filterData)
        } catch (error) {
            console.log("Error", error)
        }

    }

    const fetchData = async () => {
        setLoading(true)
        try {




            let url = "https://wvnzmflpyb.execute-api.us-east-1.amazonaws.com/reservation/getholisticchartdata"
            let setData = {}

            if (graphControl.daily) {
                setData = {

                    "body": {
                        "restaurantid": restaurantOwnerId,
                        "selectedDate": moment(selectedDay).format("YYYY-MM-DD")
                    }

                }
            }

            if (graphControl.weekly) {
                setData = {

                    "body": {
                        "restaurantid": restaurantOwnerId,
                        "startDate": moment(startWeekDate).format("YYYY-MM-DD"),
                        "endDate": moment(endtWeekDate).format("YYYY-MM-DD")
                    }

                }
            }
            if (graphControl.monthly) {
                setData = {

                    "body": {
                        "restaurantid": restaurantOwnerId,
                        "selectedYears": moment(selectedYear).format("YYYY")
                    }

                }
            }

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                data: setData
            };

            let data = await axios.post(url, config.data, config.headers)

            
            let TodayDate = moment(new Date()).format("YYYY-MM-DD")
            
            let ReservationData = data?.data?.body?.outdata?.filter((f) => f.data.restaurantid == restaurantOwnerId)
            let filterData = data?.data?.body?.outdata?.filter((f) => f.data.restaurantid == restaurantOwnerId)
            let restaurentData = data?.data?.body?.outdata.filter((f) => f.data.restaurantid == restaurantOwnerId)
            let restaurentDataToday = data?.data?.body?.outdata.filter((f) => f.data.restaurantid == restaurantOwnerId && moment(f.data.reservationDate).format("YYYY-MM-DD") == moment(selectedDay).format("YYYY-MM-DD"))
           
            let valueDateMorning = moment("12:00", 'HH:mm a').format('HH:mm a')
            let filterDataMorning = restaurentDataToday?.filter((f) => moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') <= valueDateMorning
            )
            let valueDateNoon = moment("15:00", 'HH:mm a').format('HH:mm a')

            let filterDataNoon = restaurentDataToday?.filter((f) => moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') <= valueDateNoon && moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') > valueDateMorning
            )
            let valueDateEvening = moment("18:00", 'HH:mm a').format('HH:mm a')

            let filterDataEvening = restaurentDataToday?.filter((f) => moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') <= valueDateEvening && moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') > valueDateNoon
            )

            let valueDateNight = moment("23:59", 'HH:mm a').format('HH:mm a')

            let filterDataNight = restaurentDataToday?.filter((f) => moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') <= valueDateNight && moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') > valueDateEvening
            )

            let MorningTotal = 0

            filterDataMorning.forEach(element => {
                MorningTotal += Number(element.data.numberOfGuests)

            });

            let NoonTotal = 0

            filterDataNoon.forEach(element => {
                NoonTotal += Number(element.data.numberOfGuests)

            });

            let EveningTotal = 0

            filterDataEvening.forEach(element => {
                EveningTotal += Number(element.data.numberOfGuests)

            });

            let NightTotal = 0

            filterDataNight.forEach(element => {
                NightTotal += Number(element.data.numberOfGuests)

            });
            let ChartDataToday = [
                {
                    name: "12:00 AM - 12:00 PM ",
                    "Table Booked": MorningTotal
                },
                {
                    name: "12:00 PM - 03:00 PM ",
                    "Table Booked": NoonTotal
                },
                {
                    name: "03:00 PM - 06:00 PM ",
                    "Table Booked": EveningTotal
                },
                {
                    name: "06:00 PM - 11:59 PM ",
                    "Table Booked": NightTotal
                },
            ]
            let filterDataJan = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-01-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-02-01`).format("YYYY-MM-DD"))
            let JanTotal = 0
            filterDataJan.forEach(element => {
                JanTotal += Number(element.data.numberOfGuests)

            });

            let filterDataFab = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-02-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-03-01`).format("YYYY-MM-DD"))
            let FabTotal = 0
            filterDataFab.forEach(element => {
                FabTotal += Number(element.data.numberOfGuests)

            });

            let filterDataMarch = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-03-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-04-01`).format("YYYY-MM-DD"))
            let MarchTotal = 0
            filterDataMarch.forEach(element => {
                MarchTotal += Number(element.data.numberOfGuests)

            });

            let filterDataApril = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-04-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-05-01`).format("YYYY-MM-DD"))
            let AprilTotal = 0
            filterDataApril.forEach(element => {
                AprilTotal += Number(element.data.numberOfGuests)

            });

            let filterDataMay = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-05-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-06-01`).format("YYYY-MM-DD"))
            let MayTotal = 0
            filterDataMay.forEach(element => {
                MayTotal += Number(element.data.numberOfGuests)

            });

            let filterDataJun = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-06-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-07-01`).format("YYYY-MM-DD"))
            let JunTotal = 0
            filterDataJun.forEach(element => {
                JunTotal += Number(element.data.numberOfGuests)

            });

            let filterDataJuly = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-07-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-08-01`).format("YYYY-MM-DD"))
            let JulyTotal = 0
            filterDataJuly.forEach(element => {
                JulyTotal += Number(element.data.numberOfGuests)

            });


            let filterDataAug = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-08-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-09-01`).format("YYYY-MM-DD"))
            let AugTotal = 0
            filterDataAug.forEach(element => {
                AugTotal += Number(element.data.numberOfGuests)

            });

            let filterDataSep = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-09-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-10-01`).format("YYYY-MM-DD"))
            let SepTotal = 0
            filterDataSep.forEach(element => {
                SepTotal += Number(element.data.numberOfGuests)

            });


            let filterDataOct = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-10-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-11-01`).format("YYYY-MM-DD"))
            let OctTotal = 0
            filterDataOct.forEach(element => {
                OctTotal += Number(element.data.numberOfGuests)

            });



            let filterDataNov = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-11-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${selectedYear.getFullYear()}-12-01`).format("YYYY-MM-DD"))
            let NovTotal = 0
            filterDataNov.forEach(element => {
                NovTotal += Number(element.data.numberOfGuests)

            });

            let filterDataDesc = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${selectedYear.getFullYear()}-12-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") <= moment(`${selectedYear.getFullYear()}-12-31`).format("YYYY-MM-DD"))
            let DescTotal = 0
            filterDataDesc.forEach(element => {
                DescTotal += Number(element.data.numberOfGuests)

            });

           
            let TotalBookingTillNow = 0
            restaurentData.forEach(element => {
                TotalBookingTillNow += Number(element.data.numberOfGuests)

            });
            
            let ChartDataMonthly = [
                {
                    name: "Jan",
                    "Table Booked": JanTotal
                },
                {
                    name: "Fab",
                    "Table Booked": FabTotal
                },
                {
                    name: "March",
                    "Table Booked": MarchTotal
                },
                {
                    name: "April",
                    "Table Booked": AprilTotal
                },
                {
                    name: "May",
                    "Table Booked": MayTotal
                },
                {
                    name: "Jun",
                    "Table Booked": JunTotal
                },
                {
                    name: "July",
                    "Table Booked": JulyTotal
                },
                {
                    name: "Aug",
                    "Table Booked": AugTotal
                },
                {
                    name: "Sep",
                    "Table Booked": SepTotal
                },
                {
                    name: "Oct",
                    "Table Booked": OctTotal
                },
                {
                    name: "Nov",
                    "Table Booked": NovTotal
                },
                {
                    name: "Dec",
                    "Table Booked": DescTotal
                },
            ]

            console.log("endtWeekDate", endtWeekDate)
            let restaurantDataForWeek = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${startWeekDate}`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") <= moment(`${endtWeekDate}`).format("YYYY-MM-DD"))

            let filterDataSun = restaurantDataForWeek?.filter((f) => moment(f?.data?.reservationDate).format("d") == 0)
            let SunBooking = 0
            filterDataSun.forEach(element => {
                SunBooking += Number(element.data.numberOfGuests)
            });

            let filterDataMon = restaurantDataForWeek?.filter((f) => moment(f?.data?.reservationDate).format("d") == 1)
            let MonBooking = 0
            filterDataMon.forEach(element => {
                MonBooking += Number(element.data.numberOfGuests)
            });

            let filterDataTue = restaurantDataForWeek?.filter((f) => moment(f?.data?.reservationDate).format("d") == 2)
            let TueBooking = 0
            filterDataTue.forEach(element => {
                TueBooking += Number(element.data.numberOfGuests)

            });

            let filterDataWed = restaurantDataForWeek?.filter((f) => moment(f?.data?.reservationDate).format("d") == 3)
            let WedBooking = 0
            filterDataWed.forEach(element => {
                WedBooking += Number(element.data.numberOfGuests)

            });

            let filterDataThu = restaurantDataForWeek?.filter((f) => moment(f?.data?.reservationDate).format("d") == 4)
            let ThuBooking = 0
            filterDataThu.forEach(element => {
                ThuBooking += Number(element.data.numberOfGuests)

            });

            let filterDataFri = restaurantDataForWeek?.filter((f) => moment(f?.data?.reservationDate).format("d") == 5)
            let FriBooking = 0
            filterDataFri.forEach(element => {
                FriBooking += Number(element.data.numberOfGuests)

            });

            let filterDataSat = restaurantDataForWeek?.filter((f) => moment(f?.data?.reservationDate).format("d") == 6)
            let SatBooking = 0
            filterDataSat.forEach(element => {
                SatBooking += Number(element.data.numberOfGuests)

            });

            let ChartDataWeekly = [
                {
                    name: "Sun",
                    "Table Booked": SunBooking

                },
                {
                    name: "Mon",
                    "Table Booked": MonBooking
                },
                {
                    name: "Tue",
                    "Table Booked": TueBooking
                },
                {
                    name: "Wed",
                    "Table Booked": WedBooking
                },
                {
                    name: "Thu",
                    "Table Booked": ThuBooking
                },
                {
                    name: "Fri",
                    "Table Booked": FriBooking
                },
                {
                    name: "Sat",
                    "Table Booked": SatBooking
                }

            ]

            
            setChartDataForToday(ChartDataToday)
            setChartDataForMonthly(ChartDataMonthly)
            setChartDataForWeekly(ChartDataWeekly)
            setLoading(false)


        } catch (error) {
            console.error('Error fetcdatadatadatahing data:', error);
            setLoading(false)

        }
    };
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

        <div className="dashboard-container">
            {Loader()}

            <Row>
                <span className='flaot-start h4'>Dashboard</span>


            </Row>
            <Card>
                <CardHeader>

                    <Row>
                        <Col xs="1"  >

                        </Col>


                        <Col xs="3"  >

                            <Card
                                aria-disabled
                                className="bg-success"
                                onClick={() => {




                                }}

                                style={{
                                    

                                    width: 150,
                                    cursor: "pointer",
                                }}

                            >
                                <CardBody>
                                    <div className="text-value text-center text-light">
                                        {}
                                        {reservations.filter((f) => f.data.restaurantid == restaurantOwnerId && moment(f.data.reservationDate).format("YYYY-MM-DD") == moment(new Date()).format("YYYY-MM-DD"))?.length



                                        }
                                    </div>
                                    <div className="text-center text-light">Today's Reservations</div>

                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="3"  >

                            <Card
                                aria-disabled
                                
                                onClick={() => {




                                }}
                                className=""


                                style={{
                                    backgroundColor: "#703030",

                                    width: 150,
                                    cursor: "pointer",
                                }}

                            >
                                <CardBody>
                                    <div className="text-value text-center text-light">
                                        {}
                                        {reservations.filter((f) => f.data.restaurantid == restaurantOwnerId && moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${new Date()}`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") <= moment(`${endDateinitail}`).format("YYYY-MM-DD"))?.length


                                        }
                                    </div>
                                    <div className="text-center text-light">Weekly Reservations</div>

                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="3"  >


                            <Card
                                aria-disabled
                                
                                onClick={() => {




                                }}
                                className=""


                                style={{
                                    backgroundColor: "#bd4848",

                                    width: 150,
                                    cursor: "pointer",
                                }}

                            >
                                <CardBody>
                                    <div className="text-value text-center text-light">
                                        {}
                                        {reservations.filter((f) => f.data.restaurantid == restaurantOwnerId && moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${new Date().getFullYear()}-01-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${new Date().getFullYear()}-12-31`).format("YYYY-MM-DD"))?.length


                                        }
                                    </div>
                                    <div className="text-center text-light">Yearly Reservations</div>

                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="1"  >

                        </Col>



                    </Row>
                    <Row>
                        { }




                    </Row>


                </CardHeader>
                <CardBody>
                    <div className='row' >

                        <div className='col-12' >
                            <CardHeader className='d-flex  justify-content-end'>


                                <ButtonGroup className=''>
                                    <Button
                                        color="secondary"
                                        outline
                                        onClick={() => { setGraphControl((prev) => { return { daily: true, weekly: false, monthly: false } }) }}
                                        active={graphControl.daily}
                                    >
                                        Daily
                                    </Button>
                                    <Button
                                        color="secondary"
                                        outline
                                        onClick={() => { setGraphControl((prev) => { return { daily: false, weekly: true, monthly: false } }) }}

                                        active={graphControl.weekly}
                                    >
                                        Weekly
                                    </Button>
                                    <Button
                                        color="secondary"
                                        outline
                                        onClick={() => { setGraphControl((prev) => { return { daily: false, weekly: false, monthly: true } }) }}

                                        active={graphControl.monthly}
                                    >
                                        Monthly
                                    </Button>
                                </ButtonGroup>
                            </CardHeader>

                        </div>
                    </div>
                    {false && <div>
                        <div className='col-12 shadow p-3 py-5' >
                            {<ResponsiveContainer width={800} height={200}>
                                <LineChart
                                    width={500}
                                    height={300}
                                    data={chartDataForWeekly}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis interval={0} dataKey="name" activeDot={{ r: 18 }} />
                                    <YAxis label={""} />

                                    <Tooltip />
                                    <Legend />
                                    <Line connectNulls type="monotone" dataKey={`Table Booked`} stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>}
                        </div>
                    </div>}
                    {graphControl.daily && <div>
                        <div className='col-12 shadow p-3 py-5' >
                            <div className='float-end shadow p-2'>
                                <label htmlFor="Year" className='mx-2'>Date</label>
                                <DatePicker id="Year" selected={selectedDay}
                                    onChange={(date) => { setSelectedDay(date); setIsCallApiForDaily(true) }} />
                                <br />
                                <div className=' px-2 my-3'>
                                    {/* {} */}
                                    <span>Total Number of Guests: </span>
                                    {
                                        chartDataForToday.map(m => m["Table Booked"]).reduce((accumulator, currentValue) => {
                                            return accumulator + currentValue
                                        }, 0)

                                    }
                                </div>

                            </div>
                            {<ResponsiveContainer width={800} height={300}>

                                <BarChart
                                    width={500}
                                    height={300}
                                    data={chartDataForToday}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis interval={0} dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Table Booked" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                                </BarChart>
                            </ResponsiveContainer>}
                        </div>
                    </div>}
                    {graphControl.weekly && <div>
                        <div className='col-12 shadow p-3 py-5' >
                            <div className='float-end shadow p-2'>
                                <label htmlFor="Year" className='mx-2'>Week</label>
                                <DatePicker

                                    firstSelectDay={1}

                                    selectSize={7}

                                    startDate={startWeekDate}
                                    endDate={endtWeekDate}

                                    onChange={(dates) => {
                                        const [start, end] = dates;
                                        const endDate = start


                                        setStartWeekDate(start);
                                        setEndtWeekDate(end);
                                        if (start && end) {
                                            setIsCallApiForWeekly(true)

                                        }


                                    }}
                                    selectsRange
                                />

                            </div>


                            <ResponsiveContainer width={800} height={300}>

                                <BarChart
                                    width={500}
                                    height={300}
                                    data={chartDataForWeekly}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis interval={0} dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Table Booked" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    </div>}
                    {graphControl.monthly && <div>
                        <div className='col-12 shadow p-3 py-5' >
                            <div className='float-end shadow p-2'>
                                <label htmlFor="Year" className='mx-2'>Year</label>
                                <DatePicker id="Year" selected={selectedYear} dateFormat="yyyy" showYearPicker
                                    onChange={(date) => { setSelectedYear(date); setIsCallApiForYear(true) }} />
                                <br />
                                <div className=' px-2 my-3'>
                                    {/* {} */}
                                    <span>Total Number of Guests: </span>
                                    {
                                        chartDataForMonthly.map(m => m["Table Booked"]).reduce((accumulator, currentValue) => {
                                            return accumulator + currentValue
                                        }, 0)

                                    }
                                </div>


                            </div>


                            <ResponsiveContainer width={800} height={300}>

                                <BarChart
                                    width={500}
                                    height={300}
                                    data={chartDataForMonthly}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis interval={0} dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Table Booked" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    </div>}





                    {filterDates.fromDate && <p className='text-center ' > Filter applied: result shown from <b>{filterDates.fromDate}</b> to <b>{filterDates.toDate}</b> </p>}
                    {}
                    {false && <Table bordered>
                        <thead>
                            <tr>
                                <th>
                                    #
                                </th>
                                <th>
                                    Customer Name
                                </th>
                                {}
                                <th>
                                    Date
                                </th>
                                <th>
                                    Time
                                </th>
                                <th>
                                    Number of Person(s)
                                </th>
                                {}
                                <th>
                                    Booking Status
                                </th>
                                {}
                            </tr>
                        </thead>
                        { }
                    </Table>}

                </CardBody>
            </Card>


            <Modal isOpen={isShowFilter} >
                <ModalHeader
                    toggle={() => {
                        setIsShowFilter(false)

                    }}
                >
                    Filter
                </ModalHeader>
                <ModalBody>

                    <Col xs="6">
                        <div className="d-md-flex align-items-center" >
                            <div className="mx-md-2">From</div>
                            <div className="cus-date-picker">
                                <Input
                                    type='date'
                                    name="fromDate"
                                    value={filterDates?.fromDate}
                                    onChange={(e) => {
                                        console.log("fromDate", e)
                                        setFilterDates((prev) => {
                                            return {
                                                ...prev,
                                                fromDate: e.target.value

                                            }

                                        })
                                    }}

                                />
                            </div>
                            <div className="mx-md-2">To</div>
                            <div className="cus-date-picker">
                                <Input
                                    type='date'
                                    name="toDate"
                                    value={filterDates?.toDate}
                                    onChange={(e) => {
                                        console.log("toDate", e)
                                        setFilterDates((prev) => {
                                            return {
                                                ...prev,
                                                toDate: e.target.value

                                            }

                                        })
                                    }}
                                />
                            </div>


                        </div>
                    </Col>

                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => {
                        setIsShowFilter(false)
                        setFilterDates({})
                        fetchData()
                    }} >Clear Filters</Button>{" "}
                    <Button

                        onClick={() => {
                            handleApplyfilter()
                        }}
                    >Apply</Button>

                </ModalFooter>
            </Modal>

        </div>


    )
}

export default Dashboard