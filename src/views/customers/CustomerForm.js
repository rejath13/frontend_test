import React, { useState, useCallback, useEffect } from 'react';

import { Row, Col, Button, Form, Modal } from 'react-bootstrap';

import Swal from 'sweetalert2';

import withReactContent from 'sweetalert2-react-content';

import Select from 'react-select';

import DatePicker from "react-datepicker";

import { useForm } from "react-hook-form";

import Moment from 'moment';

import { API_URL } from "../../config/constant";

import './customers.css';

import CustomerAddressMap from './CustomerAddressMap';

import CustomerExpiryForm from './CustomerExpiryForm';

import { implementationType } from '../../config/constant'

const authToken = localStorage.getItem('authToken');

function CustomerForm({ id, closePopup, updateCustomers }) {

    const selectedCustomerId = id;
    const [salespluslist, setsalespluslist] = useState([]);
    const [salespersons, setsalespersons] = useState([]);
    const [customers, setcustomers] = useState([]);
    const [spinner, setspinner] = useState(false);
    const [spinnerloader, setspinnerloader] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState();
    const [selectedParentName, setSelectedParentName] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [contactList, setContactList] = useState([{ order: 1, name: "", email: "", phone: "", position: "" }]);
    const [installedDateEdit, setInstalledDateEdit] = useState(false);

    const [expDateListPopup, setExpDateListPopup] = useState(false);
    const [searchkeyword, setSearchkeyword] = useState(null);

    const [formData, setFormData] = useState({
        id: 0,
        customer_id: 0,
        name: '',
        customer_name: '',
        device_count: '',
        email: '',
        customer_contact_name: '',
        customer_contact_phone: '',
        customer_email: '',
        customer_installed_date: '',
        customer_price_device: '',
        customer_price_software: '',
        customer_price_sim: '',
        customer_sales_person_id: 0,
        customer_dealer_name: '',
        customer_referal_name: '',
        parent_name: '',
        customer_lead_type: '',
        customer_comment: '',
        customer_other_details: '',
        expMonth: '',
        expYear: '',
        customer_status: 'active',
        customer_new_level: '',
        customer_status_group: '',
        customer_status_note: '',
        customer_account_monitored: '',
        customer_account_monitored_time: '',
        customer_payment_due: false,
        customer_payment_note: '',
        customer_locator_sim: true,
        rental_device: false,
        customer_sim_note: '',
        customer_payment_type: '',
        customer_address: '',
        customer_address_cordinates: '',
        customer_address_2: '',
        multiple_contact_details: [{ order: 1, name: "", email: "", phone: "", position: "" }]
    });

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        watch
    } = useForm({});

    const handleParentChange = e => {
        setSelectedParentId(e ? e.value : 0);
        setSelectedParentName(e ? e.label : '')
    }

    const handleSelectSalesplus = (e) => {

        var id = e.target.value;
        console.log(id);
        var cusdata = salespluslist.find(item => item.sales_plus_id == id);
        console.log(cusdata);

        if (!getValues('expMonth') && !getValues('expYear')) {

            const expdate = Moment(cusdata.sales_plus_renewel, 'MM/DD/YY', true).isValid() ? new Date(cusdata.sales_plus_renewel) : '';
            reset({
                ...getValues(),
                expMonth: expdate ? expdate.getMonth() + 1 : '',
                expYear: expdate ? expdate.getFullYear() : ''
            })
        }

        reset({
            ...getValues(),
            customer_contact_name: cusdata.sales_plus_customer_name,
            customer_contact_phone: cusdata.sales_plus_phone,
            customer_email: cusdata.sales_plus_email,
            customer_contact_position: cusdata.sales_plus_designation,
            customer_installed_date: Moment(cusdata.sales_plus_installation, 'MM/DD/YY', true).isValid() ? new Date(cusdata.sales_plus_installation) : '',
            customer_sales_person_id: cusdata.sales_person_id,
            customer_lead_type: cusdata.sales_plus_type === 'migrate' ? 'migration' : cusdata.sales_plus_type,
            customer_payment_due: cusdata.sales_plus_payment_collected,
            customer_address: cusdata.sales_plus_address,
            sales_plus_id: cusdata.sales_plus_id
        })
    }

    const onChangeSearch = (e) => {
        setSearchkeyword(e.id);
    };

    const handleKeypress = e => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {

            setSearchkeyword(e.target.value ? e.target.value : null);

            e.preventDefault();

            search();
        }
    };

    const clearSearch = () => {
        setsalespluslist([]);
        setSearchkeyword(null);
        getData();
    }

    const search = async () => {
        //setspinnerloader(true);
        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "salesplussearch/" + searchkeyword;

            const response = await fetch(url, options)

            const data = await response.json();

            setsalespluslist(data);

            //setspinnerloader(false);
        }
        catch {

        }
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

            const url = API_URL + "singlecustomer/" + id;

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.data.parent_id) {
                data.data.customer_parent = data.data.parent_id;
            } else {
                data.data.customer_parent = 0;
                data.data.parent_id = 0;
            }


            if (data.data.customer_address_cordinates) {
                const cordinates = data.data.customer_address_cordinates.substring(1, data.data.customer_address_cordinates.length - 1);
                data.data.customer_address_cordinates = cordinates;
                const center = cordinates.split(',');
                data.data.latitude = center[0];
                data.data.longitude = center[1];
            }

            if (data.data.customer_installed_date === '0000-00-00' || data.data.customer_installed_date === null) {
                data.data.customer_installed_date = '';
            } else {
                data.data.customer_installed_date = new Date(data.data.customer_installed_date);
            }

            if (data.data.customer_expiry_date === '0000-00-00' || data.data.customer_expiry_date === null) {
                data.data.expMonth = '';
                data.data.expYear = '';
            } else {
                const expdate = new Date(data.data.customer_expiry_date);
                data.data.expMonth = expdate.getMonth() + 1;
                data.data.expYear = expdate.getFullYear();
            }

            setFormData(data.data);

            const fulldata = data.data;

            reset(fulldata);

            if (fulldata.multiple_contact_details) {
                setContactList(fulldata.multiple_contact_details);
            }

            const latitude = fulldata.latitude;
            const longitude = fulldata.longitude;

            setSelectedParentId(fulldata.parentuser);
            setSelectedParentName(fulldata.parent_name);

            setIsLoading(false);
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

            setsalespersons(data.data);

            reset({ ...getValues(), customer_sales_person_id: formData.customer_sales_person_id })
        }
        catch {

        }
    }, []);

    const getCustomerList = useCallback(async () => {

        setspinner(true);

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "listcustomersforselect";

            const response = await fetch(url, options)

            const data = await response.json();

            setcustomers(data.data);

            setspinner(false);
        }
        catch {

        }
    }, []);

    useEffect(() => {
        getSalesPersonsList();
        getCustomerList();
        if (selectedCustomerId > 0) {
            getData();
        }
    }, [])

    const SpinnerLoader = () => (
        <span style={{ position: 'absolute', display: 'block', right: '50px', top: '35px', zIndex: '200' }}><i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i></span>
    );

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: '#f4f7fa', height: '43px' })
    };

    const onSubmit = async (data) => {

        if (selectedParentId) {
            data.customer_parent = selectedParentId;
            data.parent_id = selectedParentId;
            data.parent_name = selectedParentName;
        } else {
            data.customer_parent = 0;
            data.parent_name = null;
            data.parent_id = 0;
        }

        data.customer_installed_date = Moment(new Date(data.customer_installed_date)).format('YYYY-MM-DD');

        const lastdateofmonth = new Date(data.expYear, data.expMonth, 0).getDate();

        data.customer_expiry_date = data.expYear + '-' + data.expMonth + '-' + lastdateofmonth;

        data.multiple_contact_details = JSON.stringify(contactList);

        //setIsLoading(true);

        if (data.id) {
            console.log('data');

            try {
                const options = {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    'Xtoken': authToken,
                    body: JSON.stringify(data)
                }

                const url = API_URL + "editcustomer/" + data.id;

                const response = await fetch(url, options)

                const resdata = await response.json();

                setIsLoading(false);

                closeAddPopup();

                updateCustomersList();

                if (resdata.status === 'success') {

                    sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully edited customer!' });

                } else {
                    sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in editing customer!' });
                }
            }
            catch {

            }
        } else {

            if (data.customer_id) {
                try {
                    const options = {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        'Xtoken': authToken,
                        body: JSON.stringify(data)
                    }

                    const url = API_URL + "editOldInactiveCustomer/" + data.customer_id;

                    const response = await fetch(url, options)

                    const resdata = await response.json();

                    setIsLoading(false);

                    closeAddPopup();

                    updateCustomersList();

                    if (resdata.status === 'success') {

                        sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully edited customer!' });

                    } else {
                        sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in editing customer!' });
                    }
                }
                catch {

                }
            } else {
                try {
                    const options = {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        'Xtoken': authToken,
                        body: JSON.stringify(data)
                    }

                    const url = API_URL + "addcustomer";

                    const response = await fetch(url, options)

                    const resdata = await response.json();

                    setIsLoading(false);

                    closeAddPopup();

                    updateCustomersList();

                    if (resdata.status === 'success') {

                        sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully added customer!' });

                    } else {
                        sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in adding customer!' });
                    }
                }
                catch {

                }
            }

        }
    };

    const handleContactChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...contactList];
        list[index][name] = value;
        setContactList(list);
    };

    const handleContactRemove = index => {
        const list = [...contactList];
        list.splice(index, 1);
        setContactList(list);
    };

    const handleAddContact = () => {
        setContactList([...contactList, { order: contactList.length + 1, name: "", email: "", phone: "", position: "" }]);
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

    const handleInstalledDateChange = (date) => {
        reset({ ...getValues(), customer_installed_date: date })
    };

    const closeAddPopup = () => {
        closePopup();
        updateCustomersList();
    }

    const updateCustomersList = () => {
        updateCustomers();
    }

    const showExpDateList = () => {
        setExpDateListPopup(true);
    }

    const hideExpDatePopup = () => {
        setExpDateListPopup(false);
        getData();
    }

    useEffect(() => {
        if (!expDateListPopup) {
            if (selectedCustomerId > 0) {
                getData();
            }
        }
    }, [expDateListPopup])

    return (
        <div className="App">

            <Form onSubmit={handleSubmit(onSubmit)}>
                {isLoading ? <Loader /> : null}
                <Row style={{ height: '68vh', overflowY: 'auto', marginBottom: '10px' }}>

                    {getValues('customer_status') === 'followup' ? (
                        <><Col md={6} style={{ margin: '5px 0 25px 0' }}>

                            <span>

                                {salespluslist.length === 0 ? <Form.Control placeholder="Search from salesplus..." value={searchkeyword || ''} onChange={onChangeSearch} onKeyPress={handleKeypress} /> : ''}

                                {salespluslist.length > 0 ? <Form.Control as="select" {...register('sales_plus_id')} onChange={handleSelectSalesplus}>
                                    <option value="">Select customer</option>
                                    {salespluslist &&
                                        salespluslist.map(person => (
                                            <option key={person.sales_plus_id} value={person.sales_plus_id}>
                                                {person.sales_plus_company_name}
                                            </option>
                                        ))}
                                </Form.Control> : ''}

                            </span>
                        </Col>
                            <Col md={2}>
                                <button
                                    className="text-capitalize btn btn-success"
                                    type="button"
                                    onClick={search}
                                >
                                    <i className="feather icon-search" style={{ margin: 0 }}></i>
                                </button>
                                <button
                                    className="text-capitalize btn btn-danger"
                                    type="button"
                                    onClick={clearSearch}
                                >
                                    <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
                                </button>

                            </Col>
                            <Col md={4}></Col></>
                    ) : null}

                    {getValues('id') ? (
                        <Col md={1}>
                            <Form.Label>ID:</Form.Label>
                            <Form.Control rows="1" {...register('id')} disabled />
                        </Col>
                    ) : null}

                    <Col md={5}>
                        <Form.Label>Name: <span style={{ color: 'red' }}>*</span></Form.Label>

                        <Form.Control rows="1" {...register('name')} disabled={getValues('id') ? true : false} style={{ fontWeight: 'bold' }} />

                    </Col>

                    <Col md={2}>
                        <Form.Label>Vehicle Count:</Form.Label>
                        <Form.Control rows="1" {...register('device_count')} disabled={getValues('id') ? true : false} />
                    </Col>

                    <Col md={4}>
                        <Form.Label><b>Username:</b></Form.Label>
                        <Form.Control rows="1" {...register('email')} disabled={getValues('id') ? true : false} />
                    </Col>

                    <Col md={3}>
                        <Form.Label>Contact Name:</Form.Label>
                        <Form.Control rows="1" {...register('customer_contact_name')} />
                    </Col>

                    <Col md={3}>
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control rows="1" {...register('customer_contact_phone')} />
                    </Col>

                    <Col md={3}>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control rows="1" {...register('customer_email')} />
                    </Col>

                    <Col md={3}>
                        <Form.Label>Position:</Form.Label>
                        <Form.Control rows="1" {...register('customer_contact_position')} />
                    </Col>

                    <Col md={4}>
                        <Form.Label>Installed Date:</Form.Label><br />
                        {installedDateEdit ?
                            <DatePicker
                                placeholderText='Select date'
                                selected={getValues(('customer_installed_date'))}
                                onChange={handleInstalledDateChange}
                                className="form-control"
                                dateFormat="dd-MM-yyyy"
                                isClearable={true}
                            />
                            :
                            <Row>
                                <Col md={10} className="pr-0">
                                    <DatePicker
                                        selected={getValues(('customer_installed_date'))}
                                        className="form-control"
                                        dateFormat="dd-MM-yyyy"
                                        disabled
                                    />
                                </Col>
                                <Col md={2}>
                                    <Button variant="primary" onClick={() => setInstalledDateEdit(true)} style={{ padding: '10px 6px', margin: '0' }}>
                                        <i className="fas fa-pen" style={{ margin: 0 }}></i>
                                    </Button>
                                </Col>
                            </Row>
                        }
                    </Col>
                    <Col md={4}>
                        <Form.Label>Lead Type: </Form.Label>
                        <Form.Control as="select" {...register('customer_lead_type')}>
                            <option value="new">New</option>
                            <option value="migration">Migration</option>
                            <option value="trading">Trading</option>
                        </Form.Control>
                    </Col>
                    <Col md={4}>
                        <Form.Label>Sales Person: </Form.Label>
                        <Form.Control as="select" {...register('customer_sales_person_id')}>
                            <option value="None">Select sales person</option>
                            {salespersons &&
                                salespersons.map(person => (
                                    <option key={person.user_id} value={person.user_id}>
                                        {person.user_name}
                                    </option>
                                ))}
                        </Form.Control>
                    </Col>

                    <Col md={4}>
                        <Form.Label>Device Price: </Form.Label>
                        <Form.Control rows="1" {...register('customer_price_device')} />
                    </Col>

                    <Col md={4}>
                        <Form.Label>Software Price: </Form.Label>
                        <Form.Control rows="1" {...register('customer_price_software')} />
                    </Col>

                    <Col md={4}>
                        <Form.Label>SIM Price: </Form.Label>
                        <Form.Control rows="1" {...register('customer_price_sim')} />
                    </Col>



                    <Col md={4}>
                        <Form.Label>Dealer Name: </Form.Label>
                        <Form.Control rows="1" {...register('customer_dealer_name')} />
                    </Col>

                    <Col md={4}>
                        <Form.Label>Referral Name: </Form.Label>
                        <Form.Control rows="1" {...register('customer_referal_name')} />
                    </Col>

                    <Col md={4}>
                        <Form.Label>Select Parent: </Form.Label>
                        <span>
                            {spinner ? <SpinnerLoader /> : null}
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="parent"
                                options={customers}
                                value={customers.find(obj => obj.label === selectedParentName)}
                                onChange={handleParentChange}
                                placeholder="Type Parent Name"
                                styles={colourStyles}
                                isClearable={true}
                            />
                        </span>
                    </Col>



                    <Col md={12}>
                        <Form.Label>Comment: </Form.Label>
                        <Form.Control as="textarea" rows="3" {...register('customer_comment')} />
                    </Col>

                    <Col md={10} style={{ border: '1px dashed red', margin: '20px 8%' }}></Col>

                    <Col md={4}>
                        <Form.Label>Expiry Date: </Form.Label>
                        <Row>
                            <Col md={6}>
                                <Form.Control as="select" {...register('expMonth')}>
                                    <option value="">Select Month</option>
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
                            <Col md={5}>
                                <Form.Control as="select" {...register('expYear')}>
                                    <option value="">Select Year</option>
                                    <option value="2017">2017</option>
                                    <option value="2018">2018</option>
                                    <option value="2019">2019</option>
                                    <option value="2020">2020</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                </Form.Control>
                            </Col>
                            <Col md={1}>
                                <Button variant={getValues('ExpiryCount') > 1 ? 'success' : 'secondary'} onClick={() => showExpDateList()} style={{ padding: '4px 3px', margin: '7px 5px 0', float: 'right' }}><i className="fa fa-eye" style={{ color: '#fff', margin: 0 }}></i></Button>
                            </Col>
                        </Row>
                    </Col>

                    <Col md={2}>
                        <Form.Label>Status: </Form.Label>
                        <Form.Control as="select" {...register('customer_status')} name="customer_status">
                            <option value="active">Active</option>
                            <option value="new">New</option>
                            <option value="demoaccount">Demo Account</option>
                            <option value="blocked">Blocked</option>
                            <option value="inactive">Inactive</option>
                            <option value="temporarysuspend">To Verify</option>
                            <option value="oldinactive">Corporate</option>
                            <option value="followup" disabled>Newly created</option>
                        </Form.Control>
                    </Col>

                    <Col md={2}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Term</Form.Label>
                            <Form.Control as="select" {...register('term')}>
                                <option value="yearly">Yearly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="semi">Semi-annual</option>
                                <option value="monthly">Monthly</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col md={1}>
                        <Form.Group controlId="exampleForm.ControlSelect4">
                            <Form.Label>2G Count</Form.Label>
                            <Form.Control rows="1" {...register('customer_sim_2g_count')} />
                        </Form.Group>
                    </Col>

                    <Col md={1}>
                        <Form.Group controlId="exampleForm.ControlSelect5">
                            <Form.Label>4G Count</Form.Label>
                            <Form.Control rows="1" {...register('customer_sim_4g_count')} />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group controlId="exampleForm.ControlSelectimptype">
                            <Form.Label>Implementation Type:</Form.Label>
                            <Form.Control as="select" {...register('customer_implementation_type')}>
                                <option value="">Select Implementation Type</option>
                                {
                                    implementationType.map((type, i) => <option key={i} value={type.value}>{type.label}</option>)
                                }
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col md={1}>

                        <Form.Group>
                            <Form.Label>Rental: </Form.Label><br />
                            <div className="switch d-inline m-r-10">
                                <Form.Control type="checkbox" name="rental_device" id="checked-rental" {...register('rental_device')} />
                                <Form.Label htmlFor="checked-rental" className="cr" />
                            </div>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Label>Status Note: </Form.Label>
                        <Form.Control  {...register('customer_status_note')} />
                    </Col>

                    <Col md={2}>

                        <Form.Group>
                            <Form.Label>Payment Due: </Form.Label><br />
                            <div className="switch d-inline m-r-10">
                                <Form.Control type="checkbox" name="customer_payment_due" id="checked-payment" {...register('customer_payment_due')} />
                                <Form.Label htmlFor="checked-payment" className="cr" />
                            </div>
                        </Form.Group>
                    </Col>

                    <Col md={5}>
                        <Col md={3} style={{ padding: '0', float: 'left' }}>

                            <Form.Group>
                                <Form.Label>Locator SIM: </Form.Label><br />
                                <div className="switch d-inline m-r-10">
                                    <Form.Control type="checkbox" name="customer_locator_sim" id="checked-sim" {...register('customer_locator_sim')} />
                                    <Form.Label htmlFor="checked-sim" className="cr" />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={9} style={{ padding: '0', float: 'right' }}>
                            <Form.Label>Locator SIM Note: </Form.Label>
                            <Form.Control  {...register('customer_sim_note')} />
                        </Col>
                    </Col>

                    <Col md={10} style={{ border: '1px dashed red', margin: '20px 8%' }}></Col>

                    <Col md={12}>
                        <label className='form-label mt-3' style={{ color: '#000' }}>Contact Details</label>
                        {contactList.length > 0 && <Row>
                            <Col md={1}><label className='form-label'></label></Col>
                            <Col md={3}><label className='form-label'>Name</label></Col>
                            <Col md={3}><label className='form-label'>Email</label></Col>
                            <Col md={2}><label className='form-label'>Phone</label></Col>
                            <Col md={2}><label className='form-label'>Position</label></Col>
                            <Col md={1}><label className='form-label'></label></Col>
                        </Row>}
                        {contactList.map((x, i) => {
                            return (
                                <Row>
                                    <Col md={1}>
                                        <Button variant='light'>{i + 1}</Button>
                                        <input type="hidden" name='order' value={i + 1} />
                                    </Col>
                                    <Col md={3}>
                                        <input type="text" className="form-control" name="name" value={x.name} onChange={e => handleContactChange(e, i)} />
                                    </Col>
                                    <Col md={3}>
                                        <input type="text" className="form-control" name="email" value={x.email} onChange={e => handleContactChange(e, i)} />
                                    </Col>
                                    <Col md={2}>
                                        <input type="text" className="form-control" name="phone" value={x.phone} onChange={e => handleContactChange(e, i)} />
                                    </Col>
                                    <Col md={2}>
                                        <input type="text" className="form-control" name="position" value={x.position} onChange={e => handleContactChange(e, i)} />
                                    </Col>
                                    <Col md={1}>
                                        <Button variant='danger' onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Are you sure you want to delete this?"
                                            )
                                            if (confirmBox === true) { handleContactRemove(i) }
                                        }}
                                        ><i className="fas fa-trash m-r-5" style={{ margin: 0 }} /></Button>
                                    </Col>
                                </Row>
                            );
                        })}
                        <Row>

                            <Col md={12}>
                                <Form.Label>Other Contact Details: </Form.Label>
                                <Form.Control as="textarea" rows="2" {...register('customer_other_details')} />
                            </Col>

                            <Col><Button variant='info' onClick={() => handleAddContact()} style={{ margin: '10px 48% 0' }}><i className="fas fa-plus m-r-5" style={{ margin: 0 }} /></Button></Col>
                        </Row>

                    </Col>

                    <Col md={10} style={{ border: '1px dashed red', margin: '20px 8%' }}></Col>

                    <Col md={4}>
                        <Form.Label>Address From Map:</Form.Label>
                        <Form.Control  {...register('customer_address')} />
                    </Col>

                    <Col md={3}>
                        <Form.Label>Coordinates:</Form.Label>
                        <Form.Control  {...register('customer_address_cordinates')} />
                    </Col>

                    <Col md={4}>
                        <Form.Label>Address 2:</Form.Label>
                        <Form.Control  {...register('customer_address_2')} />
                    </Col>
                </Row>
                <Col md={12} style={{ paddingTop: '1rem', borderTop: '1px solid #dee2e6' }} className="text-right pr-0">

                    <Button variant="success" type="submit">Submit</Button>
                    <Button variant="secondary" onClick={closePopup}>Close</Button>
                </Col>


            </Form>

            <Modal size="lg" show={expDateListPopup} onHide={() => setExpDateListPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Multiple Expiry Date - {formData.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CustomerExpiryForm id={formData.customer_id} hideExpDatePopup={hideExpDatePopup} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CustomerForm;