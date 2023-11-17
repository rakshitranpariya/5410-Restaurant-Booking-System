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
// import { Button } from 'antd'
// import DatePicker from "react-datepicker";
import { BiFilterAlt } from "react-icons/bi"
// BiFilterAlt

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Rectangle, Label } from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function Dashboard() {
    const animatedComponents = makeAnimated();

    const [loading, setLoading] = useState(false)
    const userEmail = useSelector((state) => state?.auth?.user?.email)
    const [reservations, setReservations] = useState([]);
    const [chartDataForToday, setChartDataForToday] = useState([])
    const [chartDataForMonthly, setChartDataForMonthly] = useState([])
    const [chartDataForWeekly, setChartDataForWeekly] = useState([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filterDates, setFilterDates] = useState({
        fromDate: "",
        toDate: ""
    })
    const [selectedYear, setSelectedYear] = useState(new Date())
    const [selectedDay, setSelectedDay] = useState(new Date())
    const [graphControl, setGraphControl] = useState({
        daily: true,
        weekly: false,
        monthly: false
    })


    const handleApplyfilter = () => {
        // const filterDates = filterDates
        const toDate = moment(new Date(filterDates.toDate)).format("YYYY-MM-DD")
        const fromDate = moment(new Date(filterDates.fromDate)).format("YYYY-MM-DD")
        let filterData = chartData.filter((f) => moment(new Date(f.data.reservationDate)).format("YYYY-MM-DD") >= fromDate && moment(new Date(f.data.reservationDate)).format("YYYY-MM-DD") <= toDate)
        setReservations(filterData)
        setIsShowFilter(false)

    }




    useEffect(() => {
        fetchData();
        fetchChartData()

    }, [])

    useEffect(() => {
        fetchData()
    }, [selectedYear])

    useEffect(() => {
        fetchData()

    }, [selectedDay])

    const fetchChartData = async () => {
        try {
            // let url = "https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/Holistic/getHolisticChartData"
               let url =   "https://3xkugu6ck3.execute-api.us-east-1.amazonaws.com/Holistic/getHolisticChartData"
            // // let url = "https://nsbbk26x0l.execute-api.us-east-1.amazonaws.com/getchartdata"
            // // let url = "https://nsbbk26x0l.execute-api.us-east-1.amazonaws.com/getchartdata"
            // let url ="https://dzbx9ilhx3.execute-api.us-east-1.amazonaws.com/chartdata"
            let setData = {

                "body": {
                    "restaurantid": "1",
                    "selectedDate": "2023-11-10"//moment(selectedDay).format("YYYY-MM-DD")
                }
                // "restaurantid": "1",
                // "selectedDate": moment(selectedDay).format("YYYY-MM-DD")

            }
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*"
                },
                data: setData
            };
            let data = await axios.post(url, config.data, config.headers)

            console.log("data", data)
        } catch (error) {
            console.log("Error", error)
        }

    }

    const fetchData = async () => {
        try {


            setLoading(true)

            let url = "https://nsbbk26x0l.execute-api.us-east-1.amazonaws.com/getall"

            let data = await axios.get(url)
            //   console.log("data", data.data);
            let TodayDate = moment(new Date()).format("YYYY-MM-DD")
            // alert(TodayDate)
            let ReservationData = data?.data.filter((f) => f.data.restaurantid == 1)
            let filterData = data?.data.filter((f) => f.data.restaurantid == 1)
            let restaurentData = data?.data.filter((f) => f.data.restaurantid == 1)
            let restaurentDataToday = data?.data.filter((f) => f.data.restaurantid == 1 && moment(f.data.reservationDate).format("YYYY-MM-DD") == moment(selectedDay).format("YYYY-MM-DD"))
            // let filterData = data?.data.filter((f) => f.data.userId == userEmail && moment(new Date()).format("YYYY-MM-DD") == moment(new Date(f.data.createdAt)).format("YYYY-MM-DD"))
            // console.log("filterData", filterData)
            let valueDateMorning = moment("12:00", 'HH:mm a').format('HH:mm a')
            let filterDataMorning = restaurentDataToday?.filter((f) => moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') < valueDateMorning
            )
            let valueDateNoon = moment("15:00", 'HH:mm a').format('HH:mm a')

            let filterDataNoon = restaurentDataToday?.filter((f) => moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') < valueDateNoon && moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') > valueDateMorning
            )
            let valueDateEvening = moment("18:00", 'HH:mm a').format('HH:mm a')

            let filterDataEvening = restaurentDataToday?.filter((f) => moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') < valueDateEvening && moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') > valueDateNoon
            )

            let valueDateNight = moment("23:59", 'HH:mm a').format('HH:mm a')

            let filterDataNight = restaurentDataToday?.filter((f) => moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') < valueDateNight && moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') > valueDateEvening
            )
            // let valueNight = moment("23:59", 'HH:mm a').format('HH:mm a')

            // let filterNight = restaurentData?.filter((f) => moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') < valueNight && moment(f?.data?.reservationTime, 'HH:mm a').format('HH:mm a') > valueDateNight
            // )
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

            // let TotalBookinTillNow = restaurentData?.filter((f) => moment(f?.data?.reservationDate).format("YYYY-MM-DD") <= moment(new Date()).format("YYYY-MM-DD"))
            let TotalBookingTillNow = 0
            restaurentData.forEach(element => {
                TotalBookingTillNow += Number(element.data.numberOfGuests)

            });
            // alert(TotalBookingTillNow)
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
            // alert(NightTotal)
            // console.log("filterDataMorning", filterDataNight)

            let ChartDataWeekly = [
                {
                    name: "Sun",
                    "Table Booked": 50

                },
                {
                    name: "Mon",
                    "Table Booked": 150
                },
                {
                    name: "Tue",
                    "Table Booked": 150
                },
                {
                    name: "Wed",
                    "Table Booked": 150
                },
                {
                    name: "Thu",
                    "Table Booked": 150
                },
                {
                    name: "Fri",
                    "Table Booked": 150
                },
                {
                    name: "Sat",
                    "Table Booked": 150
                }

            ]

            setReservations(filterData)
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
                                    // backgroundColor: "#c96b6b",

                                    width: 150,
                                    cursor: "pointer",
                                }}

                            >
                                <CardBody>
                                    <div className="text-value text-center text-light">
                                        {reservations.filter((f) => f.data.restaurantid == 1 && moment(f.data.reservationDate).format("YYYY-MM-DD") == moment(new Date()).format("YYYY-MM-DD")).map((m) => {

                                            return m.data.numberOfGuests
                                        }).reduce((accumulator, currentValue) => {
                                            return accumulator + currentValue
                                        }, 0)
                                        }
                                    </div>
                                    <div className="text-center text-light">Today</div>

                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="3"  >

                            <Card
                                aria-disabled
                                // className=""
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
                                        {reservations.filter((f) => f.data.restaurantid == 1 && moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${new Date().getFullYear()}-01-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${new Date().getFullYear()}-12-31`).format("YYYY-MM-DD")).map((m) => {

                                            return m.data.numberOfGuests
                                        }).reduce((accumulator, currentValue) => {
                                            return accumulator + Number(currentValue)
                                        }, 0)
                                        }
                                    </div>
                                    <div className="text-center text-light">This Week</div>

                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="3"  >


                            <Card
                                aria-disabled
                                // className=""
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
                                        {reservations.filter((f) => f.data.restaurantid == 1 && moment(f?.data?.reservationDate).format("YYYY-MM-DD") >= moment(`${new Date().getFullYear()}-01-01`).format("YYYY-MM-DD") && moment(f?.data?.reservationDate).format("YYYY-MM-DD") < moment(`${new Date().getFullYear()}-12-31`).format("YYYY-MM-DD")).map((m) => {

                                            return m.data.numberOfGuests
                                        }).reduce((accumulator, currentValue) => {
                                            return accumulator + Number(currentValue)
                                        }, 0)
                                        }
                                    </div>
                                    <div className="text-center text-light">This Year</div>

                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="1"  >

                        </Col>



                    </Row>
                    <Row>
                        {/* <Col xs="6"  >
                            <span className='h4' style={{ cursor: "pointer" }} onClick={() => {
                                setIsShowFilter(true)
                            }} ><BiFilterAlt /></span>
                        </Col> */}




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
                                {  false&&  <Button
                                        color="secondary"
                                        outline
                                        onClick={() => { setGraphControl((prev) => { return { daily: false, weekly: true, monthly: false } }) }}

                                        active={graphControl.weekly}
                                    >
                                        Weekly
                                    </Button>}
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
                                    onChange={(date) => { setSelectedDay(date) }} />
                                <br />
                                <div className=' px-2 my-3'>
                                    {/* {} */}
                                    <span>Total Table Booked: </span>
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
                                <label htmlFor="Year" className='mx-2'>Year</label>
                                <DatePicker
                                    // id="Year"
                                    // selected={selectedYear}
                                    // dateFormat="yyyy"
                                    // showYearPicker
                                    firstSelectDay={1}
                                    controls={['calendar']}
                                    // select="preset-range"
                                    selectSize={7}
                                    selectsRange={true}
                                    select="range"
                                    rangeHighlight={true}
                                    showRangeLabels={true}
                                // onChange={(date) => { setSelectedYear(date) }}
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
                                    onChange={(date) => { setSelectedYear(date) }} />
                                <br />
                                <div className=' px-2 my-3'>
                                    {/* {} */}
                                    <span>Total Table Booked: </span>
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
                    {/* <p className='h6 mt-lg-4 mt-sm-2' >Total Bookings{`(${reservations?.length})`}</p> */}
                    {false && <Table bordered>
                        <thead>
                            <tr>
                                <th>
                                    #
                                </th>
                                <th>
                                    Customer Name
                                </th>
                                {/* <th>Restaurant Name</th> */}
                                <th>
                                    Date
                                </th>
                                <th>
                                    Time
                                </th>
                                <th>
                                    Number of Person(s)
                                </th>
                                {/* <th>
                  Your Order(s)
                </th> */}
                                <th>
                                    Booking Status
                                </th>
                                {/* <th>
                  Action
                </th> */}
                            </tr>
                        </thead>
                        {/* <tbody>

                            {reservations?.length > 0 ? reservations?.map((reservation, i) => (
                                <tr>
                                    <th scope="row">
                                        {i + 1}
                                    </th>
                                    <td>
                                        {reservation?.data?.customerName}
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
                                        {reservation?.data?.status}
                                    </td>

                                </tr>

                            )) :
                                <tr>
                                    <td colSpan={"6"} className='text-center' >No Records Found. </td>
                                </tr>
                            }
                        </tbody> */}
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
                        // disabled={
                        //     Object
                        // }
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