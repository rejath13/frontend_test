import React, { useEffect, useState, useCallback } from 'react';
import {Row, Col,Form,OverlayTrigger,Tooltip, Card} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Moment from 'moment';
import { API_URL } from "../../config/constant";
import BarChart from "./BarChart";
import './door-door.css';
import Map from "./Map";

const DoorReport = () => {

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [updateList, setUpdateList] = useState(false);
    const [isLoading, setIsLoading] = useState(false);  
    const authToken = localStorage.getItem('authToken');
    const [primaryData, setPrimaryData] = useState([]);
    const [followupData, setFollowupData] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [mapLatitude, setMapLatitude] = useState('');
    const [mapLongitude, setMapLongitude] = useState('');

    const handlefromDateChange = (date) => {      
        setFromDate(new Date(date)); 
    };

    const handletoDateChange = (date) => {
        setToDate(new Date(date));    
    };

    const getReport = () => {
        setUpdateList(updateList?false:true);
    };

    const getReports = useCallback(async ({ fromDate, toDate}) => {

        setIsLoading(true);
        const postdata = {
            fromDate:fromDate?Moment(fromDate).format('YYYY-MM-DD HH:mm:ss'):'', toDate:toDate?Moment(toDate).format('YYYY-MM-DD HH:mm:ss'):''
        }
            
        try {
            const options = {
                method: 'Post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(postdata)
            }
            
            var url = API_URL + "getReport";
                       
            const response = await fetch(url, options)
            
            const data = await response.json();

            setMapData(data.mapData);

            setMapLatitude(parseFloat(data.mapData[0].door_latitude));
            setMapLongitude(parseFloat(data.mapData[0].door_longitude));

            setPrimaryData(data.primaryData);

            setFollowupData(data.followupData);
                       
            setIsLoading(false);
        }
        catch {
            
        }
    }, []);

    useEffect(() => {
        if (fromDate && toDate) {
            getReports({ fromDate, toDate});
        }
        
    }, [getReports, updateList])


  const Loader = () => (
        <div className="divLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );
    return (
        <React.Fragment>
        {isLoading ? <Loader /> : null}

            <Row className='mb-2'> 
                <Col md={12}>
       
                    <Form>

                        <Form.Row>
                            <Col xs={6}></Col>
                            <Col xs={2}>
                                <DatePicker
                                    placeholderText='From Date'
                                    selected={fromDate}
                                    onChange={handlefromDateChange}
                                    className="form-control"
                                    dateFormat="dd-MM-yyyy"
                                    isClearable={true}
                                    required
                                />
                            </Col>
                            <Col xs={2}>
                                <DatePicker
                                    placeholderText='To Date'
                                    selected={toDate}
                                    onChange={handletoDateChange}
                                    className="form-control"
                                    dateFormat="dd-MM-yyyy"
                                    isClearable={true}
                                    required
                                />
                            </Col>

                            <Col xs={2}>
                                <button
                                    className="text-capitalize btn btn-info"
                                    type="button"
                                    onClick={() => {getReport()}}
                                     >
                                   <i class="fa fa-file" aria-hidden="true" style={{margin:0}}></i>

                                </button>
                            </Col>
             
                        </Form.Row>

                    </Form>
                </Col>
            </Row>

            <Row>
                <Col xl={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Primary report</Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center" height={300}>
                            {primaryData.length>0 ? <BarChart data={primaryData}/> : <p>Select a date range to show the report</p>}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Follow up report</Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center" height={300}>
                            {followupData.length>0 ? <BarChart data={followupData}/>: <p>Select a date range to show the report</p>}
                    </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Map View</Card.Title>
                        </Card.Header>
                        <Card.Body>

                            {mapData.length>0?<Map markers={mapData} latitude={mapLatitude} longitude={mapLongitude} />: <p>Select a date range to show the map</p>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        
        </React.Fragment>
    );
}

export default  DoorReport;