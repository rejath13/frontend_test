import React, { useState, useCallback, useEffect } from 'react';

import { Row, Col, Button, Form, Modal } from 'react-bootstrap';

import PNotify from "pnotify/dist/es/PNotify";

import Select from 'react-select';

import DatePicker from "react-datepicker";

import { useForm } from "react-hook-form";

import Moment from 'moment';

import { API_URL } from "../../config/constant";

import './customer-service.css';

const authToken = localStorage.getItem('authToken');

function CustomerServiceForm({ id, closePopup, updateServices, customers, refreshCustomerDropdown }) {

    const selectedServiceId = id;
    const customersList = customers;
    const [isLoading, setIsLoading] = useState(false);
    const [installedDateEdit, setInstalledDateEdit] = useState(false);
    const [searchkeyword, setSearchkeyword] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(0);
    const [selectedCustomerName, setSelectedCustomerName] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        watch
    } = useForm({
        customer_service_id: 0,
        customer_service_traccar_customer_id: 0,
        customer_service_description: '',
        customer_service_status: 'new',
        customer_service_payment: 'applicable',
        customer_service_invoice_status: 'notinvoiced',
        customer_service_amount: '',
        customer_service_payment_status: 'notpaid',
        customer_service_quantity: '',
        customer_email: '',
        customer_address: '',
        customer_contact_name: '',
        customer_contact_phone: '',
    });

    const refreshList = () => {
        refreshCustomerDropdown();
    }

    const handleCustomerChange = e => {
        reset({ 
            ...getValues(), 
            customer_service_traccar_customer_id: e.value, 
            customer_email: e.customer_email,
            customer_address: e.customer_address,
            customer_contact_name: e.customer_contact_name,
            customer_contact_phone: e.customer_contact_phone
        });
        setSelectedCustomerId(e.value);
        setSelectedCustomerName(e.label)
    }

    const getData = async () => {

        setIsLoading(true);

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "getSingleService/" + id;

            const response = await fetch(url, options)

            const data = await response.json();

            const fulldata = data.data;

            reset(fulldata);

            setSelectedCustomerId(fulldata.customer_service_traccar_customer_id);
            
            setSelectedCustomerName(fulldata.customer_name);

            setIsLoading(false);
        }
        catch {

        }
    }

    useEffect(() => {
        if (selectedServiceId > 0) {
            getData();
        }
        else{
            reset({
                customer_service_id: 0,
                customer_service_traccar_customer_id: 0,
                customer_service_description: '',
                customer_service_status: 'new',
                customer_service_payment: 'applicable',
                customer_service_invoice_status: 'notinvoiced',
                customer_service_amount: '',
                customer_service_payment_status: 'notpaid',
                customer_service_quantity: '',
                customer_email: '',
                customer_address: '',
                customer_contact_name: '',
                customer_contact_phone: '',
            });
        }
    }, [])

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: '#f4f7fa', height: '43px' })
    };

    const onSubmit = async (data) => {

        //setIsLoading(true);

        try {
                const options = {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken,
                    },
                    body: JSON.stringify(data)
                }

                const url = API_URL + "saveSingleService";

                const response = await fetch(url, options)

                const resdata = await response.json();

                setIsLoading(false);

                closeAddPopup();

                //updateServicesList();

                if (resdata.status === 'success') {
                    const notice = PNotify.success({
                        title: "Success",
                        text: resdata.data,
                        hide: false,
                    });
                    notice.on('click', function() {
                        notice.close();
                    });
                } else {
                    const notice = PNotify.error({
                        title: "Error",
                        text: resdata.data,
                        hide: false,
                    });
                    notice.on('click', function() {
                        notice.close();
                    });
                }
            }
        catch {

        }
        
    };

    const Loader = () => (
        <div className="modalLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );

    const closeAddPopup = () => {
        closePopup();
        updateServicesList();
    }

    const updateServicesList = () => {
        updateServices();
    }

    return (
        <div className="App">

            <Form onSubmit={handleSubmit(onSubmit)}>
                {isLoading ? <Loader /> : null}
                <Row style={{ marginBottom: '10px' }}>

                    <Col md={12}>
                        <Form.Label>Select Customer: </Form.Label>
                        <span className='d-inline-block' style={{width:'88%'}}>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="customer"
                                options={customersList}
                                value={customersList.find(obj => obj.label === selectedCustomerName)}
                                onChange={handleCustomerChange}
                                placeholder="Type Customer Name"
                                styles={colourStyles}
                            />
                        </span>
                        <Button className='m-0 ml-3 py-2 px-1 d-inline-block' style={{width:'8%'}} variant="secondary" onClick={()=> refreshList() }><i className="feather icon-refresh-cw m-0"></i></Button>
                    </Col>

                    <Col md={12}>
                        <p className="my-2 p-2" style={{border:'1px solid red', borderRadius: '5px',backgroundColor:'#ff000008'}}>
                        Contact Name: <span style={{color:'#000'}}>{getValues('customer_contact_name')}</span><br/>
                        Phone: <span style={{color:'#000'}}>{getValues('customer_contact_phone')}</span><br/>
                        Email: <span style={{color:'#000'}}>{getValues('customer_email')}</span><br/>
                        Address: <span style={{color:'#000'}}>{getValues('customer_address')}</span></p>
                    </Col>

                    <Col md={6}>
                        <Form.Label>Status: </Form.Label>
                        <Form.Control as="select" {...register('customer_service_status')}>
                            <option value="new">New</option>
                            <option value="hold">Hold</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </Form.Control>
                    </Col>

                    <Col md={6}>
                        <Form.Label>Quantity: </Form.Label>
                        <Form.Control rows="1" {...register('customer_service_quantity')} />
                    </Col>

                    <Col md={12}>
                        <Form.Label>Description: </Form.Label>
                        <Form.Control as="textarea" rows="3" {...register('customer_service_description')} />
                    </Col>

                    <Col md={6}>
                        <Form.Label>Payment: </Form.Label>
                        <Form.Control as="select" {...register('customer_service_payment')} onChange={(e)=>{
                            reset({
                                ...getValues(),
                                customer_service_payment: e.target.value,
                                customer_service_invoice_status: 'notinvoiced'
                            });
                        }}>
                            <option value="applicable">Applicable</option>
                            <option value="notapplicable">Not Applicable</option>
                        </Form.Control>
                    </Col>

                    {getValues('customer_service_payment') === 'applicable' && 
                    <>
                    <Col md={6}>
                        <Form.Label>Invoice Status: </Form.Label>
                        <Form.Control as="select" {...register('customer_service_invoice_status')}>
                            <option value="notinvoiced">Not Invoiced</option>
                            <option value="invoiced">Invoiced</option>
                        </Form.Control>
                    </Col>

                    <Col md={6}>
                        <Form.Label>Amount: </Form.Label>
                        <Form.Control rows="1" {...register('customer_service_amount')} />
                    </Col>

                    <Col md={6}>
                        <Form.Label>Payment Status: </Form.Label>
                        <Form.Control as="select" {...register('customer_service_payment_status')}>
                            <option value="notpaid">Not Paid</option>
                            <option value="paid">Paid</option>
                        </Form.Control>
                    </Col></>
                    }

                </Row>
                <Col md={12} style={{ paddingTop: '1rem', borderTop: '1px solid #dee2e6' }} className="text-right pr-0">

                    <Button variant="success" type="submit">Submit</Button>
                    <Button variant="secondary" onClick={closePopup}>Close</Button>
                </Col>
            </Form>
        </div>
    );
};

export default CustomerServiceForm;