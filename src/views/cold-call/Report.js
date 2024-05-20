import React, { useEffect, useState, useCallback } from 'react';
import {Row, Col, Card, Table,Form,OverlayTrigger,Tooltip} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Moment from 'moment';
import { API_URL } from "../../config/constant";





const ReportDefault = () => {

const [fromDate, setfromDate] = useState(null);
const [toDate, settoDate] = useState(null);
const [updateList, setupdateList] = useState(false);
const [daytype, setdaytype] = useState(null);
const [month, setmonth] = useState(null);
const [isLoading, setIsLoading] = useState(false);  
const authToken = localStorage.getItem('authToken');
const [reportType, setreportType] = useState(1);

const [counts, setcounts] = useState([]);
const [dotgraph, setdotgraph] = useState({});

const handlefromDateChange = (date) => {      
           setfromDate(new Date(date)); 
};

const handletoDateChange = (date) => {
         settoDate(new Date(date));
         
    };

const statusReport = () => {
    setupdateList(updateList?false:true);
};

const oncleardropdown = () => {
       setdaytype(null);
       setmonth(null);     
    };

 const clearAllFilters = () => {
       setfromDate(null);
       settoDate(null); 
       oncleardropdown(null);
       setreportType(1);
       setupdateList(updateList?false:true);

    }

const getReports = useCallback(async ({ daytype,month, fromDate, toDate,reportType}) => {

       

         if(reportType!='')
        {
             setIsLoading(true);
            const postdata = {
                   dayType:daytype, month:month, from_date:fromDate?Moment(fromDate).format('YYYY-MM-DD HH:mm:ss'):'', to_date:toDate?Moment(toDate).format('YYYY-MM-DD HH:mm:ss'):'',reportType:reportType
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
        
                    var url = API_URL + "coldcallReports";
                   
        
                    const response = await fetch(url, options)
        
                    const data = await response.json();
        
                   if(reportType==2)
                        setdotgraph(data);
                   else
                        setcounts(data.data);
        
                    setIsLoading(false);
        
                   
                }
                catch {
        
                }
        }

    }, []);

useEffect(() => {
    getReports({ daytype,month, fromDate, toDate,reportType});
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
<Row> 
 <Col md={12}>
       
              <Form>
                <Form.Row>

                 <Col cxs={2}>
                  <Form.Control as="select"  name="dayType" value={daytype}
                  onChange={(e) =>{var data=e.target.value;setdaytype(data)}}>
                      <option value="">Select</option>
                      <option value="1">Yesterday</option>
                      <option value="2">Last week</option>
                   </Form.Control>
                 </Col>
                 <Col cxs={2}>
                  <Form.Control as="select"  name="month" value={month}
                    onChange={(e) =>{var data=e.target.value;setmonth(data)}}>
                                <option value="">Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                   </Form.Control>
                 </Col>
                 <Col cxs={2}>
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
                 <Col cxs={2}>
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

                <Col xs={4}>
                 <OverlayTrigger
                          placement='top'
                          overlay={<Tooltip id={`tooltip-top`}>Status Report</Tooltip>} 
                        >
                        <button
                            className="text-capitalize btn btn-info"
                            type="button"
                            onClick={() => {setreportType(1);statusReport()}}
                             >
                           <i class="fa fa-file" aria-hidden="true"></i>

                        </button>
                 </OverlayTrigger> 
                 <OverlayTrigger
                          placement='top'
                          overlay={<Tooltip id={`tooltip-top`}> Occupency Report</Tooltip>} 
                        >
                        <button
                            className="text-capitalize btn btn-warning"
                            type="button"
                            onClick={() => {setreportType(2);statusReport()}}
                            >
                           <i class="fa fa-file" aria-hidden="true"></i>

                        </button>
                 </OverlayTrigger>  
                 <OverlayTrigger
                          placement='top'
                          overlay={<Tooltip id={`tooltip-top`}>Weekly Status Report</Tooltip>} 
                        >
                        <button
                            className="text-capitalize btn btn-success"
                            type="button"
                            onClick={() =>{ setreportType(3);statusReport()}}
                            
                        >
                           <i class="fa fa-file" aria-hidden="true"></i>

                        </button>
                 </OverlayTrigger>         
                        <button
                            className="text-capitalize btn btn-danger"
                             onClick={clearAllFilters}
                            type="button"
                            
                        >
                            <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
                        </button>

                        

                       
                    </Col>

                      <Col xs={12} style={{ color: 'black' }}><b></b></Col>
             
                </Form.Row>

            </Form>
            </Col>
</Row>
          
           {(reportType==1||reportType==3)&&<Row>
            <Col md={6} xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Future Requirements</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>{counts[0]}</h3>
                                </div>

                            
                            </div>
                            <div className="progress m-t-30" style={{height: '7px'}}>
                                <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '100%'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"/>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Interested</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-down text-c-red f-30 m-r-5"/> {counts[1]}</h3>
                                </div>

                            
                            </div>
                            <div className="progress m-t-30" style={{height: '7px'}}>
                                <div className="progress-bar progress-c-theme2" role="progressbar" style={{width: '100%'}} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"/>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Invalid</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5"/> {counts[2]}</h3>
                                </div>

                                
                            </div>
                            <div className="progress m-t-30" style={{height: '7px'}}>
                                <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '100%'}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"/>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>No Requirements</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-down text-c-red f-30 m-r-5"/> {counts[3]}</h3>
                                </div>

                            
                            </div>
                            <div className="progress m-t-30" style={{height: '7px'}}>
                                <div className="progress-bar progress-c-theme2" role="progressbar" style={{width: '100%'}} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"/>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                  <Col md={6} xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>No Response</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5"/> {counts[4]}</h3>
                                </div>

                            
                            </div>
                            <div className="progress m-t-30" style={{height: '7px'}}>
                                <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '100%'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"/>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>New</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5"/> {counts[5]}</h3>
                                </div>

                                
                            </div>
                            <div className="progress m-t-30" style={{height: '7px'}}>
                                <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '100%'}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"/>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>


            {reportType==2&&<><Col xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Total</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5"/> </h3>
                                </div>

                                
                            </div>
                            <div className="progress m-t-30" style={{height: '7px'}}>
                                <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '100%'}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"/>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>


                <Col xl={4}>
                <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Follow Up</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5"/> </h3>
                                </div>

                                
                            </div>
                            <div className="progress m-t-30" style={{height: '7px'}}>
                                <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '100%'}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"/>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                </>
            }
       
            </Row>
        }

        
        </React.Fragment>
    );
}

export default  ReportDefault;