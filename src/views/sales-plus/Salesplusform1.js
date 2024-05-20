import React, { useState, useCallback, useEffect } from 'react';

import { Row, Col, Button, Form, Modal, Table, Card } from 'react-bootstrap';

import Swal from 'sweetalert2';

import withReactContent from 'sweetalert2-react-content';

import Select from 'react-select';

import DatePicker from "react-datepicker";

import { useForm } from "react-hook-form";

import Moment from 'moment';

import { API_URL } from "../../config/constant";

import './saleplus.css';



function Salesplusform({ salesId, data, updatesaleplus, closepopup }) {
    const authToken = localStorage.getItem('authToken');
    const [plusid, setPlusId] = useState(salesId);
    const [salespersonList, setsalepersonList] = useState([]);
    const [customername, setcustomername] = useState(data.sales_plus_customer_name);
    const [lastDealPopup, setlastDealPopup] = useState(null);
    const [lastDealdata, getlastDealdata] = useState([]);
    const [choosenDate, setchoosenDate] = useState(new Date(data.sales_plus_date));
    const [meeting, setmeeting] = useState(data.sales_plus_meeting);
    const [renewalDate, setrenewalDate] = useState();
    const [installDate, setinstallDate] = useState();
    const [customers, setCustomers] = useState([]);
    const loginUserId = (data.sales_plus_person === undefined) ? localStorage.getItem('sale_person_id') : data.sales_plus_person;

    const getcustomerlist = async () => {
        const options = {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Xtoken': authToken
            }
        }

        const url = API_URL + "listcustomers";

        const response = await fetch(url, options)

        const data = await response.json();
        setCustomers(data.data);


    }


    const handlechoosenDateChange = (date) => {
        setchoosenDate(new Date(date));
        reset1({
            ...getValues1(),
            sales_plus_date: choosenDate
        });


    };

    const handleInstDateChange = (date) => {
        setinstallDate(new Date(date));
        reset1({
            ...getValues1(),
            sales_plus_installation: installDate
        });
    };

    const handleCustomerChange = (e) => {
        var splitval = e.target.value.split('/')[1];
        var data = customers.filter(value => { return value.name == splitval });
        console.log(data);
        reset1({
            ...getValues1(),
            sales_plus_customer_name: data[0].sales_plus_customer_name,
            sales_plus_phone: data[0].sales_plus_phone,
            sales_plus_email: data[0].sales_plus_email,
            sales_plus_company_name: data[0].name,
            sales_plus_address: data[0].sales_plus_address
        });

        setcustomername(data.sales_plus_customer_name);
    };

    const handleRenewalDateChange = (date) => {
        setrenewalDate(new Date(date));
        reset1({
            ...getValues1(),
            sales_plus_renewel: renewalDate
        });
    };

    const {
        register: register1,
        handleSubmit: handleSubmit1,
        reset: reset1, getValues: getValues1
    } = useForm({
        defaultValues: {

            sales_plus_date: Moment(data.sales_plus_date).format('DD-MM-yyyy'),
            sales_person_id: data.sales_person_id,
            sales_plus_source: data.sales_plus_source,
            sales_plus_region: data.sales_plus_region,
            sales_plus_status: data.sales_plus_status,
            sales_plus_customer_name: data.sales_plus_customer_name,
            sales_plus_company_name: data.sales_plus_company_name,
            sales_plus_project_value: data.sales_plus_project_value,
            sales_plus_phone: data.sales_plus_phone,
            sales_plus_email: data.sales_plus_email,
            sales_person_address: data.sales_person_address,
            sales_plus_designation: data.sales_plus_designation,
            sales_plus_quantity_new: data.sales_plus_quantity_new,
            sales_plus_quantity_migrate: data.sales_plus_quantity_migrate,
            sales_plus_quantity_trading: data.sales_plus_quantity_trading,
            sales_plus_price: data.sales_plus_price,
            sales_plus_installation: data.sales_plus_installation,
            sales_plus_renewel: data.sales_plus_renewel,
            sales_plus_supplier: data.sales_plus_supplier,
            sales_plus_id: data.sales_plus_id,
            sales_plus_job_order: data.sales_plus_job_order,
            sales_plus_entry_type: data.sales_plus_entry_type,
            sales_plus_company_traccar_id: data.sales_plus_company_traccar_id,
            sales_plus_quantity_new: data.sales_plus_quantity_new,
            sales_plus_quantity_migrate: data.sales_plus_quantity_migrate,
            sales_plus_quantity_trading: data.sales_plus_quantity_trading,
            sales_plus_quantity_service: data.sales_plus_quantity_service,
            sales_plus_gps: data.sales_plus_gps,
            sales_plus_reminder: data.sales_plus_reminder,
            sales_plus_comment: data.sales_plus_comment,
            sales_plus_address: data.sales_plus_address,
            sales_plus_project_value: data.sales_plus_project_value,
            sales_plus_meeting: data.sales_plus_meeting,
            sales_plus_person: loginUserId,
            sales_plus_type: (data.sales_plus_type == undefined || data.sales_plus_type == '' || data.sales_plus_type == null) ? "new" : data.sales_plus_type,
            sales_plus_note: data.sales_plus_type,
            sales_plus_payment_status: data.sales_plus_type,
            sales_plus_modified_date: data.sales_plus_modified_date,
            sales_plus_customer_flag: data.sales_plus_customer_flag,
            sales_plus_job_remarks: data.sales_plus_job_remarks,
            actiontype: data.actiontype



        }
    });



    const editsaleplus = async (saleplus) => {


        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(saleplus),
            };


            if (plusid != 0)
                var url = API_URL + "editsalesplus/" + plusid;
            else
                var url = API_URL + "addsalesplus";
            const response = await fetch(url, options)

            const data1 = await response.json();

            if (data1.status === 'success') {

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: data1.data });
                resetcustomerdata(data);
                updatesaleplus();
                closepopup();
            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating !' })
            }


        }
        catch {

        }
    }


    const getSalesPersonsList = useCallback(async () => {

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "salesperson";

            const response = await fetch(url, options)

            const data = await response.json();

            setsalepersonList(data.data);
        }
        catch {

        }
    }, []);

    const checkContactSalesperson = async () => {

        if (customername != null) {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "checkContactSalesperson/" + customername;

            const response = await fetch(url, options)

            const dealdata = await response.json();
            getlastDealdata(dealdata.data);
            setlastDealPopup(true);
        }
    }

    const fnmeeting = e => {
        var checked = e.target.checked;
        if (checked) {
            reset1({
                ...getValues1(),
                sales_plus_meeting: 1
            });
            setmeeting(1);
        } else {
            reset1({
                ...getValues1(),
                sales_plus_meeting: 0
            });
            setmeeting(0);
        }



    }


    const changepersonname = (e) => {
        reset1({
            ...getValues1(),
            sales_plus_person: e.target.key
        });

    };
    const changecustomername = (e) => {
        setcustomername(e.target.value);

    };
    const resetcustomerdata = (data) => {

        reset1({

            sales_person_address: "",
            sales_person_id: loginUserId,
            sales_plus_address: "",
            sales_plus_comment: "",
            sales_plus_company_name: "",
            sales_plus_company_traccar_id: "",
            sales_plus_customer_flag: "",
            sales_plus_customer_name: "",
            sales_plus_date: Moment(choosenDate).format('DD-MM-yyyy'),
            sales_plus_designation: "",
            sales_plus_email: "",
            sales_plus_entry_type: "",
            sales_plus_gps: "",
            sales_plus_id: "",
            sales_plus_installation: "",
            sales_plus_job_order: "",
            sales_plus_job_remarks: "",
            sales_plus_meeting: "",
            sales_plus_modified_date: "",
            sales_plus_note: "",
            sales_plus_payment_status: "",
            sales_plus_person: loginUserId,
            sales_plus_phone: "",
            sales_plus_price: "",
            sales_plus_project_value: "",
            sales_plus_quantity_migrate: "",
            sales_plus_quantity_new: "",
            sales_plus_quantity_service: "",
            sales_plus_quantity_trading: "",
            sales_plus_region: "",
            sales_plus_reminder: "",
            sales_plus_renewel: "2022-09-12T06:30:58.816Z",
            sales_plus_source: "",
            sales_plus_status: "New",
            sales_plus_supplier: "",
            sales_plus_type: ""
        });

    };


    useEffect(() => {
        //if(plusid>0){
        getSalesPersonsList();
        getcustomerlist();
        // }


    }, [plusid])


    const SpinnerLoader = () => (
        <span style={{ position: 'absolute', display: 'block', right: '50px', top: '35px', zIndex: '200' }}><i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i></span>
    );

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: '#f4f7fa', height: '43px' })
    };


    const Loader = () => (
        <div className="divLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            //title: alert.title,
            icon: 'success',
            text: alert.text,
            type: alert.type
        });
    };






    return (

        <>
            <div className="App">

                <Form onSubmit={handleSubmit1(editsaleplus)}>
                    <Row>

                        <Col md={2}>
                            {plusid == 0 ?
                                <DatePicker
                                    placeholderText='Select date'
                                    className="form-control"
                                    dateFormat="dd-MM-yyyy"
                                    selected={choosenDate}
                                    onChange={handlechoosenDateChange}
                                />
                                : <DatePicker
                                    placeholderText='Select date'
                                    className="form-control"
                                    dateFormat="dd-MM-yyyy"
                                    selected={choosenDate}
                                    readOnly="true"
                                    onChange={handlechoosenDateChange}
                                />}

                        </Col>

                        <Col md={2}>
                            <Form.Control as="select" {...register1('sales_plus_source')}>
                                <option value="">Select Source</option>

                                <option value="cold call">Cold Call</option>

                                <option value="referal">Referal</option>

                                <option value="company lead">Company Lead</option>

                                <option value="dealer">Dealer</option>

                                <option value="door to door">Door to Door</option>

                                <option value="MECAF2019">MECAF 2019</option>
                            </Form.Control>
                        </Col>
                        <Col md={2}>
                            <Form.Control as="select" {...register1('sales_plus_region')}>
                                <option value="">Select Region</option>

                                <option value="Sharjah">Sharjah</option>

                                <option value="Dubai">Dubai</option>

                                <option value="Abu Dhabi">Abu Dhabi</option>

                                <option value="Ajman">Ajman</option>

                                <option value="Fujairah">Fujairah</option>

                                <option value="Ras Al Khaimah">Ras Al Khaimah</option>

                                <option value="Umm Al Quwain">Umm Al Quwain</option>
                            </Form.Control>
                        </Col>
                        <Col md={2}>
                            <Form.Control as="select" {...register1('sales_plus_status')}>
                                <option value="">Select status</option>
                                <option value="New">New Lead</option>
                                <option value="Proposed">Proposed &amp; Followup</option>
                                <option value="Won">Won</option>
                                <option value="Hold">Hold</option>
                                <option value="Lost">Lost</option>
                                <option value="Completed">Completed</option>
                                <option value="Duplicate">Duplicate</option>
                                <option value="Demo">Demo</option>
                            </Form.Control>
                        </Col>







                        <Col md={4}>
                            <Form.Control as="select" {...register1('sales_plus_person')}>
                                <option value="None">Select sales person</option>
                                {salespersonList &&
                                    salespersonList.map(person => (
                                        <option selected={getValues1('sales_plus_person') == person.sales_person_id} key={person.sales_person_id} value={person.sales_person_id}>
                                            {person.sales_person_name}
                                        </option>
                                    ))}
                            </Form.Control>
                        </Col>


                    </Row>


                    <Row>

                        <Col md={3}>
                            <Form.Group controlId="exampleForm.ControlSelect1">

                                <select

                                    name="job_customer"
                                    as="select"
                                    onChange={handleCustomerChange}
                                    className="form-control">
                                    <option value="None">Select Customer</option>
                                    {customers &&
                                        customers.map(person => (
                                            <option value={person.id + '/' + person.name}
                                            >{person.name}</option>
                                        ))}
                                </select>

                            </Form.Group>
                        </Col>
                        <Col md={1}>
                            <button
                                className="text-capitalize btn btn-success" style={{ marginLeft: '4px', float: 'right', marginRight: '0px' }}
                                type="button" onClick={checkContactSalesperson}>
                                <i className="feather icon-search" style={{ margin: 0, fontSize: '16px' }}></i>
                            </button>
                        </Col>
                        <Col md={4}>

                            <Form.Control rows="1" placeholder="Customer Name" style={{ width: '70%', float: 'left' }}  {...register1('sales_plus_customer_name')} onChange={(e) => changecustomername(e)} />
                            <button
                                className="text-capitalize btn btn-danger" style={{ marginLeft: '4px', float: 'right', marginRight: '0px' }}
                                type="button" onClick={() => resetcustomerdata(data)}>
                                <i className="feather icon-refresh-cw" style={{ margin: 0, fontSize: '16px' }}></i>
                            </button>


                        </Col>

                        <Col md={4}>
                            <Form.Control rows="1" placeholder="Contact Name" {...register1('sales_plus_company_name')} />
                        </Col>
                        <Col md={2}>
                            <Form.Control rows="1" placeholder="Phone" {...register1('sales_plus_phone')} />
                        </Col>

                        <Col md={2}>
                            <Form.Control style={{ marginBottom: '10px' }} rows="1" placeholder="Email" {...register1('sales_plus_email')} />
                        </Col>

                        <Col md={2}>
                            <Form.Control rows="1" placeholder="Designation" {...register1('sales_plus_designation')} />
                        </Col>

                        <Col md={6}>
                            <Form.Control rows="1" placeholder="Address" {...register1('sales_plus_address')} />
                        </Col>



                    </Row>


                    <Row>

                        <Col md={2}>
                            <Form.Control rows="1" placeholder="New Quantity" {...register1('sales_plus_quantity_new')} />
                        </Col>

                        <Col md={2}>
                            <Form.Control rows="1" placeholder="Price Details" {...register1('sales_plus_price')} />
                        </Col>

                        <Col md={2}>
                            <Form.Control rows="1" style={{ marginBottom: '10px' }} placeholder="Project Value" {...register1('sales_plus_project_value')} />

                        </Col>


                        <Col md={2}>
                            <Form.Control rows="1" placeholder="Migrate Quantity" {...register1('sales_plus_quantity_migrate')} />
                        </Col>
                        <Col md={2}>
                            <Form.Control rows="1" placeholder="Trading Quantity" {...register1('sales_plus_quantity_trading')} />
                        </Col>


                        <Col md={2}>
                            <Form.Control as="select" {...register1('sales_plus_type')}>
                                <option value="">Select Sales Type</option>

                                <option value="new">New Device</option>

                                <option value="migrate">Migrate</option>

                                <option value="trading">Trading</option>

                                <option value="new-migrate">New Device and Migrate</option>

                                <option value="new-trading">New Device and Trading</option>

                                <option value="migrate-trading">Migrate and Trading</option>

                                <option value="new-migrate-trading">New Device and Migrate and Trading</option>
                            </Form.Control>
                        </Col>

                        <Col md={6}>
                            <Form.Control rows="1" placeholder="Supplier Name" {...register1('sales_plus_supplier')} />
                        </Col>


                        <Col md={3}>
                            <DatePicker
                                placeholderText='Install Date'
                                selected={installDate}
                                onChange={handleInstDateChange}
                                className="form-control"
                                dateFormat="dd-MM-yyyy"
                                isClearable={true}

                            />

                        </Col>
                        <Col md={3}>
                            <DatePicker
                                placeholderText='Renewal Date'
                                selected={renewalDate}
                                onChange={handleRenewalDateChange}
                                className="form-control"
                                dateFormat="dd-MM-yyyy"
                                isClearable={true}

                            />

                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Control as="textarea" rows="1" placeholder="Comment" {...register1('sales_plus_comment')} />
                        </Col>




                        {/*<Col md={1}>
                      
                       <input type="checkbox" id="Priority" onChange={(e) => { fnmeeting(e);}} defaultChecked={meeting === '1'}  name="Priority"/> Meeting
                           
                  </Col> 
                */}
                    </Row>
                    <Row>



                    </Row>
                    <Row>
                        <Col md={12} style={{ textAlign: 'right' }}>
                            <button type='submit' className="text-capitalize btn btn-success">SAVE</button>
                        </Col>
                    </Row>
                </Form>
            </div>

            <Modal size="xl" show={lastDealPopup} onHide={() => setlastDealPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Last Deal </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>

                    <Table responsive style={{ border: '1px solid #eaeaea', borderTop: 'none' }}>
                        <thead>
                            <tr>
                                <th> Company Name</th>
                                <th>Customer Name </th>
                                <th> Sales Person</th>
                                <th>Source</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lastDealdata && lastDealdata.map((item, index) => (
                                <tr>
                                    <th>{item.sales_plus_company_name}</th>
                                    <th>{item.sales_plus_customer_name}</th>
                                    <th>{item.sales_person_name}</th>
                                    <th>{item.sales_plus_source}</th>
                                    <th>{item.sales_plus_status}</th>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                </Modal.Body>
            </Modal>


        </>
    );
};

export default Salesplusform;