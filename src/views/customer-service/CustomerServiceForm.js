import React, { useState, useCallback, useEffect } from 'react';

import { Row, Col, Button, Form, Modal } from 'react-bootstrap';

import PNotify from "pnotify/dist/es/PNotify";

import CreatableSelect from 'react-select/creatable';

import DatePicker from "react-datepicker";

import { useForm } from "react-hook-form";

import Moment from 'moment';

import { API_URL } from "../../config/constant";

import './customer-service.css';

import { implementationType } from '../../config/constant'


const authToken = localStorage.getItem('authToken');


function CustomerServiceForm({ id, closePopup, updateServices, users }) {

    const selectedServiceId = id;
    const [isLoading, setIsLoading] = useState(false);
    const [installedDateEdit, setInstalledDateEdit] = useState(false);
    const [searchkeyword, setSearchkeyword] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(0);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerType, changeCustomerType] = useState('LOCATOR');
    const [customersList, setcustomers] = useState([]);
    const [selectError, setSelectError] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        watch,
        formState: { errors },
    } = useForm({
        customer_service_id: 0,
        customer_service_customer_id: 0,
        customer_service_customer_name: '',
        customer_service_description: '',
        customer_service_status: 'new',
        customer_service_payment: 'applicable',
        customer_service_invoice_status: 'notinvoiced',
        customer_service_amount: '',
        customer_service_payment_status: 'notpaid',
        customer_service_quantity: '',
        customer_service_customer_email: '',
        customer_service_customer_address: '',
        customer_service_customer_contact_name: '',
        customer_service_customer_phone: '',
        customer_service_customer_exp_date: '',
        customer_service_L1_assigned_to: 22 // by default assigned to vaisakh
    });

    const handleCustomerType = (e) => {
        changeCustomerType(e.target.value);
        setcustomers([]);
        setSelectedCustomer([]);
        reset({
            ...getValues(),
            customer_service_customer_id: 0,
            customer_service_customer_name: '',
            customer_service_customer_type: e.target.value,
            customer_service_customer_email: '',
            customer_service_customer_address: '',
            customer_service_customer_contact_name: '',
            customer_service_customer_phone: '',
            customer_service_customer_exp_date: ''
        });
    };

    const handleCustomerChange = e => {
        setSelectError(false);
        reset({ 
            ...getValues(), 
            customer_service_customer_id: e.value, 
            customer_service_customer_name: e.label,
            customer_service_customer_email: e.email,
            customer_service_customer_address: e.address,
            customer_service_customer_contact_name: e.contact_name,
            customer_service_customer_phone: e.contact_phone,
            customer_service_customer_exp_date: e.expiry_date
        });
        setSelectedCustomerId(e.value);
        setSelectedCustomer(e);
    }

    const handleCreate = (inputValue) => {

        setSelectError(false);
        reset({ 
            ...getValues(), 
            customer_service_customer_id: 0, 
            customer_service_customer_name: inputValue,
            customer_service_customer_email: '',
            customer_service_customer_address: '',
            customer_service_customer_contact_name: '',
            customer_service_customer_phone: '',
            customer_service_customer_exp_date: ''
        });

        setSelectedCustomer({value:0,label:inputValue});
    };

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

            setSelectedCustomerId(fulldata.customer_service_customer_id);
            
            setSelectedCustomer({
                value: fulldata.customer_service_customer_id,
                label: fulldata.customer_service_customer_name,
                email: fulldata.customer_service_customer_email,
                address: fulldata.customer_service_customer_address,
                contact_name: fulldata.customer_service_customer_contact_name,
                contact_phone: fulldata.customer_service_customer_phone
            });

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
                customer_service_customer_id: 0,
                customer_service_customer_name: '',
                customer_service_description: '',
                customer_service_status: 'new',
                customer_service_payment: 'applicable',
                customer_service_invoice_status: 'notinvoiced',
                customer_service_amount: '',
                customer_service_payment_status: 'notpaid',
                customer_service_quantity: '',
                customer_service_customer_email: '',
                customer_service_customer_address: '',
                customer_service_customer_contact_name: '',
                customer_service_customer_phone: '',
                customer_service_customer_exp_date: '',
                customer_service_L1_assigned_to: 22
            });
        }
    }, [])

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: '#f4f7fa', height: '43px' })
    };

    const onSubmit = async (data) => {

        //setIsLoading(true);

        if ((customerType !== 'OTHER' && data.customer_service_customer_id == 0)) {
            setSelectError(true);
        }else{

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
                        PNotify.success({
                            title: "Success",
                            text: resdata.data,
                            hide: true,
                            delay: 1000
                        });
                    } else {
                        PNotify.error({
                            title: "Error",
                            text: resdata.data,
                            hide: true,
                            delay: 1000
                        });
                    }
                }
            catch {

            }
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

    const getCustomerList = async () => {

        if (customerType !== 'OTHER') {

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

                const url = API_URL + "listServiceCustomers/"+customerType;

                const response = await fetch(url, options)

                const data = await response.json();

                setcustomers(data.data);

                setIsLoading(false);
            }
            catch {

            }
        }
    };

    useEffect(() => {
        getCustomerList();
    }, [customerType])

    return (
        <div className="App">

            <Form onSubmit={handleSubmit(onSubmit)}>
                {isLoading ? <Loader /> : null}
                <Row style={{ marginBottom: '10px' }}>

                    <Col md={4}>
                        <Form.Label>Type: </Form.Label>
                        <Form.Control as="select" value={customerType} onChange={handleCustomerType}>
                            {implementationType.map((type, i) => <option key={i} value={type.value}>{type.label}</option>)}
                        </Form.Control>
                    </Col>

                    <Col md={8}>
                        <Form.Label>Select Customer: <span style={{ color: 'red' }}>*</span> </Form.Label>
                        <span className='d-inline-block' style={{width:'88%'}}>
                            
                            <CreatableSelect
                              isClearable
                              isDisabled={isLoading}
                              isLoading={isLoading}
                              onChange={handleCustomerChange}
                              onCreateOption={handleCreate}
                              options={customersList}
                              value={selectedCustomer}
                            />
                            
                        </span>
                        <Button className='m-0 ml-3 py-2 px-1 d-inline-block' style={{width:'8%'}} variant="secondary" onClick={()=> getCustomerList() }><i className="feather icon-refresh-cw m-0"></i></Button>
                        {selectError && <p style={{color:'red'}}>Select a customer</p>}
                    </Col>

                    <Col md={12}>
                        <p className="my-2 p-2" style={{border:'1px solid red', borderRadius: '5px',backgroundColor:'#ff000008'}}>
                        Contact Name: <span style={{color:'#000'}}>{getValues('customer_service_customer_contact_name')}</span><br/>
                        Phone: <span style={{color:'#000'}}>{getValues('customer_service_customer_phone')}</span><br/>
                        Email: <span style={{color:'#000'}}>{getValues('customer_service_customer_email')}</span><br/>
                        Address: <span style={{color:'#000'}}>{getValues('customer_service_customer_address')}</span></p>
                    </Col>

                    <Col md={12}>
                        <Form.Label>Description: <span style={{ color: 'red' }}>*</span> </Form.Label>
                        <Form.Control as="textarea" rows="3" {...register('customer_service_description', { required: "Enter description" })} />
                        {errors.customer_service_description && <p style={{color:'red'}}> {errors.customer_service_description.message}</p> }
                    </Col>

                    <Col md={6}>
                        <Form.Label>Status: </Form.Label>
                        <Form.Control as="select" {...register('customer_service_status')}>
                            <option value="new">New</option>
                            <option value="hold">Hold</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="followed-up">Followed up</option>
                        </Form.Control>
                    </Col>

                    <Col md={6}>
                        <Form.Label>Quantity: </Form.Label>
                        <Form.Control rows="1" {...register('customer_service_quantity')} />
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
                    </Col>

                    <Col md={6}>
                        <Form.Label>Level 1 Assignee: </Form.Label>
                        <Form.Control as="select" {...register('customer_service_L1_assigned_to')}>
                            <option value="">Select</option>
                            {users.filter((user, index) => [2,3,10,15,19,22].includes(user.user_id)).map(user => (
                                <option key={user.user_id} value={user.user_id}>{user.user_name}</option>
                            ))}
                        </Form.Control>
                    </Col>
                    </>
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