
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Pagination, Modal, Button, ButtonGroup, OverlayTrigger, Tooltip, Form, Table, Badge } from 'react-bootstrap';

import ChatList from "./ChatList";
import { ConfigContext } from "../../../../contexts/ConfigContext";
import useAuth from '../../../../hooks/useAuth';

import adminprofile from "../../../../assets/images/profile-logo/admin.png";

import shamsprofile from "../../../../assets/images/profile-logo/shams.jpg";

import shamnadprofile from "../../../../assets/images/profile-logo/shamnad.jpg";

import rasickprofile from "../../../../assets/images/profile-logo/rasick.jpg";

import ajmalprofile from "../../../../assets/images/profile-logo/ajmal.jpg";

import celineprofile from "../../../../assets/images/profile-logo/celine.jpg";

import vishalprofile from "../../../../assets/images/profile-logo/vishal.jpg";

import shoneprofile from "../../../../assets/images/profile-logo/shone.jpg";
import ScrollToBottom from 'react-scroll-to-bottom';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import ReactHtmlParser from 'react-html-parser';
import { API_URL } from "../../../../config/constant";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';


const NavRight = () => {
    const [updtepopup, setupdatepopup] = useState(false);
    const [selectedCustomer, setselectedCustomer] = useState('');
    const configContext = useContext(ConfigContext);
    const { logout } = useAuth();
    const { rtlLayout } = configContext.state;
    const loginUserId = localStorage.getItem('loginUserId');
    const [reminderPopup, setReminderPopup] = useState(false);
    const [notearray, setReminders] = useState([]);
    const [listOpen, setListOpen] = useState(false);
    const loginUserName = localStorage.getItem('loginUserName');
    const [remDate, setRemDate] = useState('');
    const [selectedCustomerId, setselectedCustomerId] = useState(0);
    const authToken = localStorage.getItem('authToken');
    const [isLoading, setIsLoading] = useState(false);
    const [listupdated, setListUpdated] = useState(false);
    const [reminderListPopup, setReminderListPopup] = useState(false);
    const [remSearchDate, setRemSearchDate] = useState('today');
    const [searchReminder, setSearchReminder] = useState(null);
    const [refreshReminders, setRefreshReminders] = useState(false);
    const [rectifytextPopup, setRectifyTextPopup] = useState(false);
    const [isPopupLoading, setIsPopupLoading] = useState(false);
    const [dueremindercount, setDueReminderCount] = useState(0);
    const [reminders, setallReminders] = useState([]);
    const [remindertextPopup, setReminderTextPopup] = useState(false);
    const [contactList, setContactList] = useState([{ order: 1, name: "", email: "", phone: "", position: "" }]);


    const { register: registerRemoveReminder, handleSubmit: handleSubmitRemoveReminder, reset: resetRemoveReminder } = useForm({
        defaultValues: {
            remove_reminder_text: '',
            reminder_id: 0,
            reminder_customer_id: 0
        },
    });
    const { register: registerUpdate, handleSubmit: handleSubmitUpdate, reset: resetUpdate, getValues, } = useForm({
        defaultValues: {
            customer_status: '',
            subscriber_status: '',
            expMonth: '',
            expYear: '',
            multiple_contact_details: '',
            subscriber_amount: '',
            term: '',
            subscriber_remarks: '',
            customer_contact_name: '',
            customer_email: '',
            customer_contact_phone: '',
            customer_contact_position: ''
        },
    });



    const showRemoveReminderTextPopup = (customerid, id) => {
        resetRemoveReminder({
            remove_reminder_text: '',
            reminder_id: id,
            reminder_customer_id: customerid
        });
        setReminderTextPopup(true);
    }

    const updateMNote = (reminderdata) => {
        //setReminderListPopup(false);
        showRemDatePopup(reminderdata.customer_id, reminderdata.subscription_note_date);
    }
    const fnallremainder = () => {
        setReminderListPopup(true);
        getAllReminders(remSearchDate, searchReminder);
    }
    const updateReminder = (reminderdata) => {
        // setReminderListPopup(false);
        SubscriberUpdate(reminderdata);
    }

    const SubscriberUpdate = async (selectedcustomerdetails) => {

        setupdatepopup(true);
        setselectedCustomer(selectedcustomerdetails.name);
        setselectedCustomerId(selectedcustomerdetails.customer_id);

        var expdate = '';

        if (selectedcustomerdetails.customer_expiry_date !== '0000-00-00' && selectedcustomerdetails.customer_expiry_date !== null && selectedcustomerdetails.customer_expiry_date !== '1970-01-31' && selectedcustomerdetails.customer_expiry_date !== '1970-01-01') {
            expdate = new Date(selectedcustomerdetails.customer_expiry_date);
        }

        resetUpdate({
            customer_status: selectedcustomerdetails.customer_status,
            subscriber_status: selectedcustomerdetails.subscriber_status,
            multiple_contact_details: selectedcustomerdetails.multiple_contact_details,
            subscriber_amount: selectedcustomerdetails.subscriber_amount,
            term: selectedcustomerdetails.term,
            subscriber_remarks: selectedcustomerdetails.subscriber_remarks,
            customer_contact_name: selectedcustomerdetails.customer_contact_name,
            customer_email: selectedcustomerdetails.customer_email,
            customer_contact_phone: selectedcustomerdetails.customer_contact_phone,
            customer_contact_position: selectedcustomerdetails.customer_contact_position,
            expMonth: expdate ? expdate.getMonth() + 1 : '',
            expYear: expdate ? expdate.getFullYear() : '',
            ExpairyCount: selectedcustomerdetails.ExpairyCount
        });
        if (selectedcustomerdetails.multiple_contact_details) {
            setContactList(selectedcustomerdetails.multiple_contact_details);
        } else {
            setContactList([{ order: 1, name: "", email: "", phone: "", position: "" }]);
        }
    }
    const Loader = () => (
        <div className="divLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );
    const showReminderPopup = () => {
        setReminderListPopup(true);
        setRemSearchDate('today');
        setSearchReminder(null);
        getAllReminders(remSearchDate, searchReminder);
    }

    const searchFromReminder = () => {
        getAllReminders(remSearchDate, searchReminder);
    }
    const clearReminderSearch = () => {
        setSearchReminder(null);
        setRefreshReminders(refreshReminders === true ? false : true);
    }

    const rectifyReminder = async (postdata) => {
        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(postdata)
            }

            const url = API_URL + "rectifySubscriptionDueReminder";

            const response = await fetch(url, options)

            const data = await response.json();

            setRectifyTextPopup(false);

            setListUpdated(true);

            sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully removed reminder!' })
        }
        catch {

        }
    }


    const { register: registerRectifyReminder, handleSubmit: handleSubmitRectifyReminder, reset: resetRectifyReminder } = useForm({
        defaultValues: {
            rectified_text: '',
            reminder_id: 0,
            reminder_customer_id: 0
        },
    });

    const showRemDatePopup = async (id, date) => {

        setIsLoading(true);

        setselectedCustomerId(id);

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "getSubscriptionNotes/" + id;

            const response = await fetch(url, options)

            const data = await response.json();

            setReminders(data.data);

            setReminderPopup(true);

            setIsLoading(false);
        }
        catch {

        }

        setRemDate('');

        reset1({
            notes: '',
            note_id: 0,
            note_to: loginUserName,
            type: ''
        });

    }
    const getAllReminders = useCallback(async (remSearchDate, searchReminder) => {
        setIsPopupLoading(true);

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + `getAllRemainders/${remSearchDate}/${searchReminder}`;

            const response = await fetch(url, options)

            const data = await response.json();

            setDueReminderCount(data.dueremindercount);

            setallReminders(data.data);
            setIsPopupLoading(false);
        }
        catch {

        }
    }, [])

    useEffect(() => {
        getAllReminders(remSearchDate, searchReminder);
    }, [getAllReminders, remSearchDate, searchReminder])

    const getRemainders = async () => {

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },

            };

            const url = API_URL + "getuserRemainders";

            const response = await fetch(url, options)

            const data = await response.json();

            setReminders(data.data);

        }
        catch {

        }

    }
    const findDatePastorFuture = (currentdate) => {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        today = yyyy + '/' + mm + '/' + dd;

        var date = new Date(currentdate);
        var dd1 = date.getDate();
        var mm1 = date.getMonth() + 1;
        var yyyy1 = date.getFullYear();
        if (dd1 < 10) {
            dd1 = '0' + dd1
        }
        if (mm1 < 10) {
            mm1 = '0' + mm1
        }
        date = yyyy1 + '/' + mm1 + '/' + dd1;

        today = new Date(today);
        date = new Date(date);
        var todayDiff = date.getTime() - today.getTime();
        var todayDifference = Math.ceil(todayDiff / (1000 * 3600 * 24));

        return todayDifference;

    }

    const showRectifiedTextPopup = (customerid, id) => {
        resetRectifyReminder({
            rectified_text: '',
            reminder_id: id,
            reminder_customer_id: customerid
        });
        setRectifyTextPopup(true);
    }

    const changeRemDate = (selectedtype) => {

        if (selectedtype === 'tomorrow') {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            setRemDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1w') {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            setRemDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '2w') {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            setRemDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1m') {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            setRemDate(new Date(date).setHours(9, 0, 0));
        }
    };
    const changeReminderDate = (date) => {
        const selectedHour = new Date(date).getHours();
        if (selectedHour === 0) {
            setRemDate(new Date(date).setHours(9, 0, 0));
        } else {
            setRemDate(date);
        }
    };

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            //title: alert.title,
            icon: alert.type,
            text: alert.text,
            type: alert.type
        });
    };
    const handleLogout = async () => {
        try {
            //handleClose();
            await logout();
        } catch (err) {
            console.error(err);
        }
    };
    const {
        register: register1,
        handleSubmit: handleSubmit1,
        reset: reset1
    } = useForm({
        defaultValues: {
            notes: '',
            note_id: 0,
            note_to: loginUserName,
            type: ''
        }
    });

    const submitReminderDate = async (data) => {



        if (data.type == 'sub') {
            var postdata = { subscriber_note: data.notes.replace(/\r?\n/g, '<br/>'), subscriber_reminder_date: remDate ? Moment(remDate).format('YYYY-MM-DD HH:mm') : '', subscription_note_id: data.note_id, subscription_note_assigned_to: data.note_to };

            var url = API_URL + "saveSubscriberDetails";
        }


        else if (data.type == 'subdue') {
            var postdata = { monitoring_note: data.notes.replace(/\r?\n/g, '<br/>'), monitoring_date: remDate ? Moment(remDate).format('YYYY-MM-DD HH:mm:ss') : '', subscription_note_id: data.note_id, subscription_note_assigned_to: data.note_to };
            var url = API_URL + "saveSubscriptionDueDetails";

        }


        else if (data.type == 'monitoring') {


            var postdata = { monitoring_note: data.notes.replace(/\r?\n/g, '<br/>'), monitoring_date: remDate ? Moment(remDate).format('YYYY-MM-DD HH:mm:ss') : '', monitoring_note_id: data.note_id, monitoring_note_assigned_to: data.note_to };


            var url = API_URL + "saveMonitoringDueDetails";

        }


        else if (data.type == 'training') {

            var postdata = { training_note: data.notes.replace(/\r?\n/g, '<br/>'), training_date: remDate ? Moment(remDate).format('YYYY-MM-DD HH:mm:ss') : '', training_note_id: data.note_id, training_note_assigned_to: data.note_to };

            var url = API_URL + "saveTrainingDetails";
        }


        else if (data.type == 'blocked') {



            var postdata = { blocked_account_note: data.notes.replace(/\r?\n/g, '<br/>'), blocked_account_note_date: remDate ? Moment(remDate).format('YYYY-MM-DD HH:mm') : '', blocked_account_note_id: data.note_id, blocked_account_note_assigned_to: data.note_to };
            var url = API_URL + "saveBlockedAccountDetails";
        }



        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(postdata),
            };



            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated reminder date!' });

                setReminderPopup(false);
                setListUpdated(true);

            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating reminder date!' })
            }

        }
        catch {

        }

    }


    const fillformtoedit = (note) => {
        reset1({
            notes: note.note_text.replaceAll('<br/>', '\n'),
            note_id: note.note_id,
            note_to: note.note_to,
            type: note.type
        });
        if (note.note_date && note.note_date !== '0000-00-00 00:00:00') {
            setRemDate(new Date(note.note_date));
        } else {
            setRemDate();
        }
    }

    return (
        <React.Fragment>
            <ListGroup as='ul' bsPrefix=' ' className="navbar-nav ml-auto" id='navbar-right'>


                <ListGroup.Item as='li' bsPrefix=' '>
                    <Dropdown alignRight={!rtlLayout} className="drp-user">
                        <Dropdown.Toggle as={Link} variant='link' to='#' id="dropdown-basic">
                            <i className="icon feather icon-settings" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight className="profile-notification">
                            <div className="pro-head">
                                <img src={loginUserId === '1' ? adminprofile : loginUserId === '5' ? shamsprofile : loginUserId === '3' ? shamnadprofile : loginUserId === '2' ? rasickprofile : loginUserId === '6' ? ajmalprofile : loginUserId === '7' ? celineprofile : loginUserId === '8' ? shoneprofile : loginUserId === '9' ? vishalprofile : adminprofile} className="img-radius" alt="User Profile" />
                                <span>{loginUserId === '1' ? 'Admin' : loginUserId === '5' ? 'Shamsudheen' : loginUserId === '3' ? 'Shamnad' : loginUserId === '2' ? 'Rasick' : loginUserId === '6' ? 'Ajmal' : loginUserId === '7' ? 'Celine' : loginUserId === '8' ? 'Shone' : 'Admin'}</span>
                                <Link to='/' className="dud-logout" title="Logout">
                                    <i className="feather icon-log-out" />
                                </Link>
                            </div>
                            <ListGroup as='ul' bsPrefix=' ' variant='flush' className="pro-body">
                                <ListGroup.Item as='li' bsPrefix=' '><Link to='#' className="dropdown-item"><i className="feather icon-settings" /> Settings</Link></ListGroup.Item>
                                <ListGroup.Item as='li' bsPrefix=' '><Link to='#' className="dropdown-item"><i className="feather icon-user" /> Profile</Link></ListGroup.Item>
                                <ListGroup.Item as='li' bsPrefix=' ' onClick={() => fnallremainder()}><Link to='#' className="dropdown-item"><i className="feather icon-user" /> Remainders</Link></ListGroup.Item>
                                <ListGroup.Item as='li' bsPrefix=' '><Link to='/' className="dropdown-item"><i className="feather icon-log-out" /> Logout</Link></ListGroup.Item>
                            </ListGroup>
                        </Dropdown.Menu>
                    </Dropdown>
                </ListGroup.Item>
            </ListGroup>
            <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />


            <Modal size="lg" show={reminderPopup} onHide={() => setReminderPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Notes</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <Row>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body className='task-comment'>

                                    {notearray && notearray.length > 0 &&
                                        <ScrollToBottom className="mon-note-list">
                                            <ul className="media-list p-0">

                                                {notearray.map((note, index) => (
                                                    <li className="media">
                                                        <div className="media-left mr-3">
                                                            <img className="media-object img-radius comment-img" src={note.note_by === 'admin' ? adminprofile : note.note_by === 'Shams' ? shamsprofile : note.note_by === 'Shamnad' ? shamnadprofile : note.note_by === 'Rasick' ? rasickprofile : note.note_by === 'Ajmal' ? ajmalprofile : note.note_by === 'Celine' ? celineprofile : note.note_by === 'Shone' ? shoneprofile : note.note_by === 'Vishal' ? vishalprofile : adminprofile} alt="Generic placeholder" /><br />
                                                            <span style={{ color: 'black' }}><b>[{note.type === 'blocked' ? 'Blocked' : note.type === 'training' ? 'Training' : note.type === 'monitoring' ? 'Monitoring' : note.type === 'subdue' ? 'Subscription Due' : note.type === 'customer' ? 'Customer' : note.type === 'sub' ? 'Subscription' : ''}]</b></span>
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading text-muted">{note.note_by}
                                                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:MM')}</span>
                                                                <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                                                    <i class="fas fa-pencil-alt"></i>
                                                                </span>

                                                                <span style={{ fontWeight: 'bold', marginRight: '25px', float: 'right', color: 'black' }}>{note.note_date !== '0000-00-00 00:00:00' ? '[' + note.note_date + ']' : ''}</span>

                                                            </h6>
                                                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Assigned to</Tooltip>}><span style={{ float: 'right', fontWeight: 'bold', color: 'darkmagenta' }}><i className="fas fa-arrow-circle-right" style={{ marginRight: '10px' }}></i>
                                                                {note.note_to}</span>
                                                            </OverlayTrigger>
                                                            <p style={{ color: 'black', margin: 0 }}>{ReactHtmlParser(note.note_text)} </p>
                                                            <p style={{ fontStyle: 'italic' }}>{ReactHtmlParser(note.remove_reminder_text)} </p>

                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </ScrollToBottom>}

                                    <Form key="monitoringform" onSubmit={handleSubmit1(submitReminderDate)}>
                                        <Row>
                                            <Col md="6"></Col>
                                            <Col md="6">

                                                <ButtonGroup style={{ marginBottom: '5px', float: 'right' }}>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Tomorrow</Tooltip>}>
                                                        <Button variant="danger" onClick={() => changeRemDate('tomorrow')} style={{ padding: '10px 20px' }}>T</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Week</Tooltip>}>
                                                        <Button variant="warning" onClick={() => changeRemDate('1w')}>1 W</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Two Week</Tooltip>}>
                                                        <Button variant="info" onClick={() => changeRemDate('2w')}>2 W</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Month</Tooltip>}>
                                                        <Button variant="success" onClick={() => changeRemDate('1m')}>1 M</Button>
                                                    </OverlayTrigger>
                                                </ButtonGroup>
                                            </Col>
                                            <Col md="6">
                                                <DatePicker
                                                    placeholderText='Select date'
                                                    selected={remDate}
                                                    onChange={changeReminderDate}
                                                    className="form-control"
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dateFormat="dd-MM-yyyy h:mm aa"
                                                    timeCaption="time"
                                                    isClearable={true}
                                                />
                                            </Col>

                                            <Col md="6">
                                                <Form.Group controlId="exampleForm.ControlSelect2">
                                                    <Form.Control as="select" {...register1('note_to')}>
                                                        <option value="Shamnad">{loginUserId === '3' ? 'Self' : 'Shamnad'}</option>
                                                        <option value="Celine">{loginUserId === '7' ? 'Self' : 'Celine'}</option>
                                                        <option value="Shams">{loginUserId === '5' ? 'Self' : 'Shams'}</option>
                                                        <option value="Rasick">{loginUserId === '2' ? 'Self' : 'Rasick'}</option>
                                                        <option value="Ajmal">{loginUserId === '6' ? 'Self' : 'Ajmal'}</option>
                                                        <option value="Shone">{loginUserId === '8' ? 'Self' : 'Shone'}</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>

                                        </Row>


                                        <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...register1('notes')} />

                                        <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Comment</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal>



            <Modal size="xl" show={reminderListPopup} onHide={() => setReminderListPopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Reminders</Modal.Title>
                    <Row style={{ margin: '0 auto', width: '80%' }}>
                        <Col md="4">
                            <ButtonGroup>
                                <Button variant={remSearchDate === 'today' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('today')}>Today</Button>
                                <Button variant={remSearchDate === 'due' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('due')} style={{ padding: '10px 20px' }}>Due</Button>
                                <Button variant={remSearchDate === 'upcoming' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('upcoming')}>Upcoming</Button>
                            </ButtonGroup>
                        </Col>



                        <Col md="3">
                            <Form.Control placeholder="Search..." value={searchReminder || ''} onChange={(e) => {
                                const keyword = e.target.value;
                                if (!keyword)
                                    setSearchReminder(null);
                                else
                                    setSearchReminder(keyword)
                            }} onKeyPress={(e) => {
                                if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                    e.preventDefault();
                                    searchFromReminder();
                                }
                            }} />
                            {searchReminder && <button type="button" class="react-datepicker__close-icon" onClick={clearReminderSearch} style={{ right: '5px', height: '90%' }}></button>}
                        </Col>
                        <Col md="1">
                            <button
                                className="text-capitalize btn btn-success"
                                type="button"
                                onClick={searchFromReminder}
                            >
                                <i className="feather icon-search" style={{ margin: 0, fontSize: '16px' }}></i>
                            </button>
                        </Col>

                    </Row>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    {isPopupLoading ? <Loader /> : null}

                    <Row style={{ margin: '0 auto', width: '100%' }}>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body style={{ height: '85vh' }}>{reminders && reminders.length > 0 &&
                                    <Table responsive hover style={{ border: '1px solid #eaeaea', maxHeight: '80vh', overflowY: 'scroll' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '2%' }}>#</th>
                                                <th style={{ width: '2%' }}></th>
                                                <th style={{ width: '6%' }}></th>
                                                <th style={{ width: '30%' }}>Customer Name</th>
                                                <th style={{ width: '15%' }}>Date</th>
                                                <th style={{ width: '48%' }}>Note</th>

                                                <th style={{ width: '1%' }}></th>
                                                <th style={{ width: '1%' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reminders.map((reminder, index) => (
                                                <tr>
                                                    <td onClick={() => updateMNote(reminder)}>{index + 1}</td>
                                                    <td onClick={() => updateMNote(reminder)}>

                                                        {reminder.subscription_due_priority && reminder.subscription_due_priority === true && <span><i className="fas fa-star" style={{ color: 'red' }}></i><br /></span>}
                                                        {reminder.subscription_note_rectified === 'true' && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Rectified</Tooltip>}>
                                                            <i className="fa fa-check" style={{ color: 'green' }}></i>
                                                        </OverlayTrigger>}

                                                    </td>
                                                    <td onClick={() => updateMNote(reminder)}>
                                                        <img className="left-logo" style={{ borderRadius: '50%', width: '40px' }} src={reminder.subscription_note_by === 'admin' ? adminprofile : reminder.subscription_note_by === 'Shams' ? shamsprofile : reminder.subscription_note_by === 'Shamnad' ? shamnadprofile : reminder.subscription_note_by === 'Rasick' ? rasickprofile : reminder.subscription_note_by === 'Ajmal' ? ajmalprofile : reminder.subscription_note_by === 'Celine' ? celineprofile : reminder.subscription_note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                                    </td>
                                                    <td onClick={() => updateMNote(reminder)}>{reminder.name}<br /><OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Created on</Tooltip>}><span style={{ fontSize: '11px' }}>{Moment(reminder.created_at).format('DD-MM-YYYY hh:mm:ss')}</span></OverlayTrigger>
                                                        <br />
                                                        <span style={{ color: 'black' }}><b>[{reminder.type === 'blocked' ? 'Blocked' : reminder.type === 'training' ? 'Training' : reminder.type === 'mon' ? 'Monitoring' : reminder.type === 'subdue' ? 'Subscription Due' : reminder.type === 'customer' ? 'Customer' : reminder.type === 'sub' ? 'Subscription' : ''}]</b></span>
                                                    </td>

                                                    <td onClick={() => updateMNote(reminder)}>
                                                        <span className={findDatePastorFuture(reminder.note_date) < 0 ? 'redText' : ''}>
                                                            {reminder.note_date !== '0000-00-00 00:00:00' ? Moment(reminder.note_date).format('DD-MM-YYYY hh:mm:ss') : ''}
                                                        </span></td>
                                                    <td onClick={() => updateMNote(reminder)}>{reminder.note_text}
                                                    </td>


                                                    <td>
                                                        <Button onClick={() => showRemoveReminderTextPopup(reminder.customer_id, reminder.note_id)} variant="danger" style={{ padding: '6px' }}>
                                                            <i className="far fa-trash-alt" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => updateMNote(reminder)} variant="success" style={{ padding: '6px' }}>
                                                            <i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                                        </Button>
                                                    </td>
                                                    <td>

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default NavRight;
