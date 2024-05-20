import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { Row, Col, Card, Pagination, Modal, Button, ButtonGroup, OverlayTrigger, Tooltip, Form, Table, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import './subscription-due.css';
import { API_URL } from "../../config/constant";
import ReactHtmlParser from 'react-html-parser';
import ScrollToBottom from 'react-scroll-to-bottom';

import adminprofile from "../../assets/images/profile-logo/admin.png";

import shamsprofile from "../../assets/images/profile-logo/shams.jpg";

import shamnadprofile from "../../assets/images/profile-logo/shamnad.jpg";

import rasickprofile from "../../assets/images/profile-logo/rasick.jpg";

import ajmalprofile from "../../assets/images/profile-logo/ajmal.jpg";

import celineprofile from "../../assets/images/profile-logo/celine.jpg";

import shoneprofile from "../../assets/images/profile-logo/shone.jpg";

const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        //title: alert.title,
        icon: alert.type,
        text: alert.text,
        type: alert.type
    });
};

function DynamicTable({ columns, data, fromNumber, toNumber, getSubscriptionsList, totalCount, showReminderPopup, dueremindercount }) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,

        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { sortBy, pageIndex },
    } = useTable(
        {
            columns,
            data,
            manualSortBy: true,
            initialState: { pageIndex: 0, sortBy: [{ id: 'customer_expiry_date', desc: false }] },
            manualPagination: true,
            pageCount: Math.ceil(totalCount / 40),
        },
        useSortBy,
        usePagination

    )

    const authToken = localStorage.getItem('authToken');
    const [searchCustomer, setSearchCustomer] = useState(null);
    const [isFilter, setisFilter] = useState(false);
    const [filterarray, setFilterarray] = useState({ "active": true, "demo": true, "new": true, "servicepending": true, "partial": true, "renewed": true });
    const [refreshList, setRefreshList] = useState(false);

    const statusfilter = [

        {
            name: "servicepending",
            value: "true",
            label: "Service Pending"
        },
        {
            name: "readyforinvoice",
            value: "false",
            label: "Ready for Invoice"
        },
        {
            name: "invoiced",
            value: "false",
            label: "Invoiced"
        },
        {
            name: "partial",
            value: "true",
            label: "Partial"
        },
        {
            name: "renewed",
            value: "true",
            label: "Without Subscription Status"
        }
    ];


    const onChangeSearchCustomer = (e) => {
        setSearchCustomer(e.target.value);
    };

    const search = () => {

        if (pageIndex > 0) {
            gotoPage(0);
        } else {
            setRefreshList(refreshList === true ? false : true);
        }
    };

    const clearAllFilters = () => {

        setSearchCustomer(null);

        if (pageIndex > 0) {
            gotoPage(0);
        } else {
            setRefreshList(refreshList === true ? false : true);
        }
    }

    const clearPopupFilter = () => {

        setisFilter(false);

        setFilterarray({ "active": true, "demo": true, "new": true, "servicepending": true, "partial": true, "renewed": true });

        setRefreshList(refreshList === true ? false : true);
    }

    const filterSearch = () => {

        setisFilter(false);
        if (pageIndex > 0) {
            gotoPage(0);
        } else {
            setRefreshList(refreshList === true ? false : true);
        }
    }

    const handleFilterArrayChange = (e) => {

        const isChecked = e.target.checked;
        const checkeditem = e.target.name;
        setFilterarray({ ...filterarray, [checkeditem]: isChecked });
    }

    useEffect(() => {
        getSubscriptionsList({ pageIndex, searchCustomer, sortBy, filterarray });
    }, [getSubscriptionsList, sortBy, pageIndex, refreshList])

    const showReminders = () => {
        showReminderPopup();
    }

    const handleKeypress = e => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            search();
        }
    };

    return (
        <>
            <Form>
                <Form.Row>
                    <Col xs={2} style={{ color: 'black' }}><span style={{ top: '12px', position: 'relative' }}><b>Total : {totalCount}</b></span></Col>
                    <Col xs={3}>

                        <button
                            className="btn btn-warning"
                            type="button"
                            onClick={() => showReminders()}
                        >
                            <i className="fas fa-bell" style={{ margin: 0, fontSize: '18px' }}></i>
                            {dueremindercount > 0 ?
                                (<OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Due Reminders</Tooltip>}
                                >
                                    <span style={{ color: 'red', marginLeft: '12px' }}><b>[ {dueremindercount} ]</b></span>
                                </OverlayTrigger>)
                                : ''}

                        </button>

                    </Col>
                    <Col xs={4}>
                        <Form.Control placeholder="Search..." value={searchCustomer || ''} onChange={onChangeSearchCustomer} onKeyPress={handleKeypress} />
                        {searchCustomer && <button type="button" class="react-datepicker__close-icon" onClick={clearAllFilters} style={{ right: '5px', height: '90%' }}></button>}
                    </Col>
                    <Col xs={3}>
                        <button
                            className="text-capitalize btn btn-success"
                            type="button"
                            onClick={search}
                        >
                            <i className="feather icon-search" style={{ margin: 0, fontSize: '16px' }}></i>
                        </button>

                        <button
                            className="text-capitalize btn btn-warning"
                            type="button"
                            onClick={() => setisFilter(true)}
                        >
                            <i className="feather icon-filter" style={{ margin: 0 }}></i>
                        </button>

                        <button
                            className="text-capitalize btn btn-danger"
                            type="button"
                            onClick={clearAllFilters}
                        >
                            <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
                        </button>
                    </Col>
                </Form.Row>
            </Form>
            <BTable striped bordered hover responsive {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th style={{ whiteSpace: 'normal' }} className={column.className} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <span className='feather icon-arrow-down text-muted float-right mt-1' />
                                                : <span className='feather icon-arrow-up text-muted float-right mt-1' />
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps({ className: cell.column.className })}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </BTable>
            <Row className='justify-content-between mt-3'>
                <Col sm={12} md={4}>
                    <span className="d-flex align-items-center">
                        Page {' '} <strong> {pageIndex + 1} of {pageOptions.length} </strong>{' '}
                        | Go to page:{' '}
                        <input
                            type="number"
                            className='form-control ml-2'
                            value={pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                        />
                    </span>

                </Col>
                <Col sm={12} md={4}><span>{fromNumber} - {toNumber} of {totalCount} items</span></Col>
                <Col sm={12} md={4}>
                    <Pagination className='justify-content-end'>
                        <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
                        <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
                        <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
                        <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
                    </Pagination>
                </Col>
            </Row>

            <Modal size="lg" show={isFilter} onHide={() => setisFilter(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Filter</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="active" value="false" checked={filterarray['active']} id="active" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="active" className="cr">Active</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="demo" value="false" checked={filterarray['demo']} id="demo" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="demo" className="cr">Demo</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="new" value="false" checked={filterarray['new']} id="new" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="new" className="cr">New</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                    </Row>

                    <hr />

                    <Row>

                        {statusfilter.map((item, index) => (
                            <Col md={6} xl={4}>
                                <Form.Group>
                                    <div className="checkbox d-inline">
                                        <Form.Control type="checkbox" name={item.name} value={item.value} checked={filterarray[item.name]} id={item.name} onChange={handleFilterArrayChange} />
                                        <Form.Label htmlFor={item.name} className="cr">{item.label}</Form.Label>
                                    </div>
                                </Form.Group>
                            </Col>
                        ))}

                    </Row>

                    <hr className="mt-0" />

                    <Row>
                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="yearly" value="false" checked={filterarray['yearly']} id="yearly" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="yearly" className="cr m-0">Yearly</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="quarterly" value="false" checked={filterarray['quarterly']} id="quarterly" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="quarterly" className="cr m-0">Quarterly</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="semi" value="false" checked={filterarray['semi']} id="semi" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="semi" className="cr m-0">Semi-annual</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="monthly" value="false" checked={filterarray['monthly']} id="monthly" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="monthly" className="cr m-0">Monthly</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="priority" value="false" checked={filterarray['priority']} id="priority" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="priority" className="cr m-0">Priority</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr className="mt-0" />

                    <Row>
                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="one_month" value="false" checked={filterarray['one_month']} id="one_month" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="one_month" className="cr m-0">One month</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="two_month" value="false" checked={filterarray['two_month']} id="two_month" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="two_month" className="cr m-0">Two month</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6} xl={4}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="three_month" value="false" checked={filterarray['three_month']} id="three_month" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="three_month" className="cr m-0">Three month</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => clearPopupFilter()}>Clear</Button>
                    <Button variant="primary" onClick={() => filterSearch()}>Search</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const findDateDifference = (currentdate) => {

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
    var todayDiff = Math.abs(date.getTime() - today.getTime());
    var todayDifference = Math.ceil(todayDiff / (1000 * 3600 * 24));

    if (todayDifference === 0 || todayDifference === 1) {
        return 'Today';
    } else {
        return todayDifference;
    }

}

const findMonthDifference = (date) => {
    var months;
    var d1 = new Date(date);
    var d2 = new Date();
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

const getDifferenceInDays = (date) => {
    const currentDate = new Date();
    const givenDate = new Date(date);

    if (givenDate < currentDate) {
        return true;
    } else {
        return false;
    }
}

function App() {

    const authToken = localStorage.getItem('authToken');
    const [subscriptions, setSubscriptions] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPopupLoading, setIsPopupLoading] = useState(false);
    const [selectedCustomer, setselectedCustomer] = useState('');
    const [selectedCustomerId, setselectedCustomerId] = useState(0);
    const [updtepopup, setupdatepopup] = useState(false);
    const [monitoringPopup, setMonitoringPopup] = useState(false);
    const [notearray, setNoteArray] = useState([]);
    const [monitoringDate, setMonitoringDate] = useState();
    const [monitorDatePopup, setMonitorDatePopup] = useState(false);
    const [contactList, setContactList] = useState([{ order: 1, name: "", email: "", phone: "", position: "" }]);
    const [listupdated, setListUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortType, setSortType] = useState('customer_expiry_date');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isSetReminder, setIsSetReminder] = useState(false);
    const [reminderPopup, setReminderPopup] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [dueremindercount, setDueReminderCount] = useState(0);
    const [remindertextPopup, setReminderTextPopup] = useState(false);
    const [filterData, saveFilterData] = useState({});
    const loginUserId = localStorage.getItem('loginUserId');
    const loginUserName = localStorage.getItem('loginUserName');
    const [rectifiedFilter, setRectifiedFilter] = useState(false);
    const [selectedRemType, setSelectedRemType] = useState('self');
    const [remSearchDate, setRemSearchDate] = useState('today');
    const [searchReminder, setSearchReminder] = useState(null);
    const [refreshReminders, setRefreshReminders] = useState(false);

    const [rectifytextPopup, setRectifyTextPopup] = useState(false);

    const showReminderPopup = () => {
        setReminderPopup(true);
        setRectifiedFilter(false);
        setSelectedRemType('self');
        setRemSearchDate('today');
        setSearchReminder(null);
        getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);
    }

    const searchFromReminder = () => {
        getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);
    }

    const clearReminderSearch = () => {
        setSearchReminder(null);
        setRefreshReminders(refreshReminders === true ? false : true);
    }

    const getReminders = useCallback(async (rectifiedFilter, selectedRemType, remSearchDate, searchReminder) => {

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

            const url = `${API_URL}getSubscriptionDueReminders/${selectedRemType}/${rectifiedFilter}/${remSearchDate}/${searchReminder}`;

            const response = await fetch(url, options)

            const data = await response.json();

            setDueReminderCount(data.dueremindercount);

            setReminders(data.data);

            setIsPopupLoading(false);
        }
        catch {

        }
    }, [])

    useEffect(() => {
        getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);
    }, [rectifiedFilter, selectedRemType, refreshReminders, remSearchDate])

    const filterRectifiedReminders = () => {
        setRectifiedFilter(rectifiedFilter === true ? false : true);
    }

    const updateReminder = (reminderdata) => {
        update(reminderdata);
    }

    const updateMNote = (reminderdata) => {
        setselectedCustomerId(reminderdata.customer_id);
        updateMonitoringNote(reminderdata);
    }

    const showPostpondDatePopup = (reminderdata) => {
        setMonitorDatePopup(true);
        setselectedCustomerId(reminderdata.customer_id);

        reset1({
            subscription_note_id: reminderdata.subscription_note_id,
        });
        setMonitoringDate(new Date(reminderdata.subscription_note_date));
    }

    const postpondMonitoringDate = async (data) => {

        if (monitoringDate) {

            const postdata = { ...data, monitoring_date: monitoringDate ? Moment(monitoringDate).format('YYYY-MM-DD HH:mm:ss') : ''};

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


                const url = API_URL + "postpondSubscriptionDueDate";

                const response = await fetch(url, options)

                const data = await response.json();

                if (data.status === 'success') {

                    setListUpdated(true);

                    //sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully postponded monitoring date!' })

                } else {
                    sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in postponding monitoring date!' })
                }

                setMonitorDatePopup(false);
            }
            catch {

            }
        } else {
            window.alert('Please select a valid date');
        }
    }

    const { register: registerRectifyReminder, handleSubmit: handleSubmitRectifyReminder, reset: resetRectifyReminder } = useForm({
        defaultValues: {
            rectified_text: '',
            reminder_id: 0,
            reminder_customer_id: 0
        },
    });

    const showRectifiedTextPopup = (customerid, id) => {
        resetRectifyReminder({
            rectified_text: '',
            reminder_id: id,
            reminder_customer_id: customerid
        });
        setRectifyTextPopup(true);
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

    const { register: registerRemoveReminder, handleSubmit: handleSubmitRemoveReminder, reset: resetRemoveReminder } = useForm({
        defaultValues: {
            remove_reminder_text: '',
            reminder_id: 0,
            reminder_customer_id: 0
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

    const removeReminderDate = async (postdata) => {
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

            const url = API_URL + "removeSubscriptionDueReminder";

            const response = await fetch(url, options)

            const data = await response.json();

            setReminderTextPopup(false);

            setListUpdated(true);

            sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully removed reminder!' })
        }
        catch {

        }
    }

    const updateMonitoringNote = async (selectedcustomerdetails) => {

        setIsLoading(true);

        setIsSetReminder(false);
        setselectedCustomer(selectedcustomerdetails.name);
        setselectedCustomerId(selectedcustomerdetails.customer_id);

        if (selectedcustomerdetails.subscription_due_date && selectedcustomerdetails.subscription_due_date !== '0000-00-00 00:00:00') {
            setIsSetReminder(true);
        }

        reset1({
            monitoring_note: '',
            subscription_note_id: 0,
            subscription_note_by: '',
            subscription_note_assigned_to: loginUserName
        });
        setMonitoringDate();

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "getSubscriptionNotes/" + selectedcustomerdetails.customer_id + "/due";

            const response = await fetch(url, options)

            const data = await response.json();

            setNoteArray(data.data);

            setMonitoringPopup(true);

            setIsLoading(false);
        }
        catch {

        }
    }

    const update = (selectedcustomerdetails) => {
        setupdatepopup(true);
        setselectedCustomer(selectedcustomerdetails.name);
        setselectedCustomerId(selectedcustomerdetails.customer_id);
        reset({
            customer_status: selectedcustomerdetails.customer_status,
            subscriber_status: selectedcustomerdetails.subscriber_status,
            multiple_contact_details: selectedcustomerdetails.multiple_contact_details,
            subscription_due_priority: selectedcustomerdetails.subscription_due_priority,
            special_note: selectedcustomerdetails.special_note,
            customer_other_details: selectedcustomerdetails.customer_other_details,
            customer_contact_name: selectedcustomerdetails.customer_contact_name,
            customer_email: selectedcustomerdetails.customer_email,
            customer_contact_phone: selectedcustomerdetails.customer_contact_phone,
            customer_contact_position: selectedcustomerdetails.customer_contact_position
        });
        if (selectedcustomerdetails.multiple_contact_details) {
            setContactList(selectedcustomerdetails.multiple_contact_details);
        } else {
            setContactList([{ order: 1, name: "", email: "", phone: "", position: "" }]);
        }
    }

    const loginToWeb = (email, pswd) => {

        const weburl = 'https://mylocatorplus.com/office-use/#/access/signin?username=' + window.btoa(email) + '&password=' + window.btoa(pswd);
        window.open(weburl, '_blank');
    }


    const columns = React.useMemo(
        () => [
            {
                Header: '',
                accessor: 'subscription_due_priority',
                className: 'prioritybuttoncolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    if (row.original.subscription_due_priority) {
                        return (
                            <span>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>High Priority</Tooltip>}
                                >
                                    <i class="fas fa-star" style={{ color: 'red' }}></i>
                                </OverlayTrigger>
                            </span>
                        );
                    } else {
                        return (
                            <span></span>
                        );
                    }
                }
            },
            {
                Header: 'Customer Name',
                accessor: 'name',
                className: 'namecolumn',
                Cell: ({ row }) => {

                    return (
                        <span onClick={() => update(row.original)} style={{ cursor: 'pointer' }}>
                            <span style={{ color: 'black' }}><b>{row.original.name.replace(/&amp;/g, '&').substring(0, 25)}</b></span>
                            {row.original.customer_contact_name ?
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Contact Name</Tooltip>}
                                >
                                    <span><br />({row.original.customer_contact_name})</span>
                                </OverlayTrigger> : ''}
                            {row.original.rental_device === 'yes' ? '  [Rental]' : ''}
                        </span>
                    );

                }
            },
            {
                Header: 'Count',
                accessor: 'count',
                className: 'countcolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span>
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Total Devices</Tooltip>}
                            >
                                <Badge variant="primary" style={{ fontSize: '13px', minWidth: '35px' }}>{row.original.count > 0 ? row.original.count : 0}</Badge>
                            </OverlayTrigger><br />

                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>No Connection Devices</Tooltip>}
                            >
                                <Badge variant="danger" style={{ fontSize: '13px', minWidth: '35px' }}>{row.original.Noconnection > 0 ? row.original.Noconnection : 0}</Badge>
                            </OverlayTrigger>
                        </span>

                    );
                }
            },
            {
                Header: 'Last Login',
                accessor: 'last_login',
                className: 'lastlogincolumn',
                Cell: ({ row }) => {

                    if (row.original.last_login) {
                        return (
                            <span>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>{findDateDifference(row.original.last_login) + ' Days'}</Tooltip>}
                                >
                                    <Button className='text-capitalize' variant="light" style={{ padding: '2px', margin: '0px', backgroundColor: 'unset', border: 'none', width: '40px' }}>{findDateDifference(row.original.last_login)}</Button>
                                </OverlayTrigger>
                            </span>
                        );
                    } else {
                        return '';
                    }

                }
            },
            {
                Header: 'Exp. Date',
                accessor: 'customer_expiry_date',
                className: 'expirycolumn',
                Cell: ({ row }) => {

                    if (row.original.customer_expiry_date !== '0000-00-00' && row.original.customer_expiry_date !== null && row.original.customer_expiry_date !== '1970-01-31' && row.original.customer_expiry_date !== '1970-01-01') {

                        return (
                            <span>
                                <Button className='btn-rounded text-capitalize' variant="light" style={{ padding: '2px', margin: '0px', backgroundColor: 'unset', border: 'none', width: '60px' }}>{Moment(row.original.customer_expiry_date).format('MMM-YYYY')} </Button>
                            </span>
                        );
                    } else {
                        return (
                            <span></span>
                        );
                    }
                }
            },
            {
                Header: 'Due',
                accessor: 'expiry_due',
                className: 'duemonthcolumn',
                Cell: ({ row }) => {

                    if (row.original.customer_expiry_date !== '0000-00-00' && row.original.customer_expiry_date !== null && row.original.customer_expiry_date !== '1970-01-31' && row.original.customer_expiry_date !== '1970-01-01') {

                        return (
                            <span>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>{findMonthDifference(row.original.customer_expiry_date) === 0 ? 'This Month' : findMonthDifference(row.original.customer_expiry_date) + ' Month'}</Tooltip>}
                                >
                                    <Button className='btn-rounded text-capitalize' variant="light" style={{ padding: '2px', margin: '0px', backgroundColor: 'unset', border: 'none' }}>{findMonthDifference(row.original.customer_expiry_date)}</Button>
                                </OverlayTrigger >
                            </span>
                        );
                    } else {
                        return (
                            <span></span>
                        );
                    }
                }
            },
            {
                Header: 'Term',
                accessor: 'term',
                className: 'termcolumn'
            },
            {
                Header: 'Status',
                accessor: 'customer_status',
                className: 'statuscolumn',
                Cell: ({ row }) => {

                    return (
                        <span style={{ textTransform: 'capitalize' }}>{row.original.customer_status === 'demoaccount' ? 'Demo Account' : row.original.customer_status} <br />
                            {row.original.subscriber_status !== '' && row.original.subscriber_status !== null && row.original.subscriber_status !== 'renewed' ? '[' + (row.original.subscriber_status === 'servicepending' ? 'Service Pending' : row.original.subscriber_status === 'readyforinvoice' ? 'Ready for Invoice' : row.original.subscriber_status) + ']' : ''}
                            <span style={{ fontSize: '11px', marginLeft: '2px' }}>{row.original.subscriber_recent_follow ? '(' + Moment(row.original.subscriber_recent_follow).format('YYYY-MM-DD HH:mm') + ')' : ''}</span>
                        </span>
                    );

                }
            },
            {
                Header: 'Followup Date',
                accessor: 'subscription_due_date',
                className: 'monitoringdatecolumn',
                Cell: ({ row }) => {

                    return (
                        <span style={{ fontWeight: 'bold', color: 'black' }}>{row.original.subscription_due_date && row.original.subscription_due_date !== '0000-00-00 00:00:00' ? row.original.subscription_due_date : ''}</span>
                    );

                }
            },
            {
                Header: 'Followup Note',
                accessor: 'subscription_due_note',
                className: 'monitoringnotecolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    var note = row.original.latestnote;

                    return (
                        <span>
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>{ReactHtmlParser(note)}</Tooltip>}
                            >
                                <span style={{ height: '20px', display: 'inline-block', overflow: 'hidden' }}>{ReactHtmlParser(note)}</span>
                            </OverlayTrigger>
                            <br />
                            <span style={{ fontSize: '12px', marginLeft: '2px' }}>{row.original.latestnotecreateddate ? '(' + Moment(row.original.latestnotecreateddate.date).format('YYYY-MM-DD HH:mm') + ')' : ''}</span>

                        </span>
                    );

                }
            },
            {
                Header: '',
                accessor: 'monitoringbutton',
                className: 'monitoringbuttoncolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span>
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Update Due Note</Tooltip>}
                            >
                                <Button onClick={() => updateMonitoringNote(row.original)} className='text-capitalize' variant="success" style={{ padding: '6px' }}><i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i></Button>
                            </OverlayTrigger>
                        </span>
                    );

                }
            },
            {
                Header: '',
                accessor: 'buttons',
                className: 'buttoncolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span>
                            <Button variant="primary" onClick={() => loginToWeb(row.original.email, row.original.password)} style={{ padding: '6px' }}>
                                <i class="fas fa-sign-in-alt" style={{ margin: 0 }}></i>
                            </Button>
                        </span>
                    );
                }
            }
        ],
        []
    )

    useEffect(() => {
        if (listupdated) {

            const sortBy = [{ id: sortType, desc: sortOrder === 'desc' ? true : false }];
            const searchCustomer = searchKeyword;
            const pageIndex = currentPage;
            const filterarray = filterData;
            getSubscriptionsList({ pageIndex, searchCustomer, sortBy, filterarray });
            getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);
        }
    }, [listupdated])

    const getSubscriptionsList = useCallback(async ({ pageIndex, searchCustomer, sortBy, filterarray }) => {

        setIsLoading(true);

        const cpage = pageIndex + 1;
        setCurrentPage(pageIndex);

        if (!searchCustomer) {
            searchCustomer = null;
        }

        setSearchKeyword(searchCustomer);

        var stype = '';
        var sorder = '';

        if (sortBy.length > 0) {

            setSortType(sortBy[0].id);
            stype = sortBy[0].id;

            if (sortBy[0].desc) {
                setSortOrder('desc');
                sorder = 'desc';
            }
            else {
                setSortOrder('asc');
                sorder = 'asc';
            }
        }

        saveFilterData(filterarray);

        const postdata = {
            keyword: searchCustomer, sortType: stype ? stype : sortType, sortOrder: sorder ? sorder : sortOrder, searchstatus: filterarray
        }

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

            const url = API_URL + "subscriptionDueList?page=" + cpage;

            const response = await fetch(url, options)

            const data = await response.json();

            setSubscriptions(data.data.data);

            setTotalCount(data.data.total);

            setFromNumber(data.data.from);

            setToNumber(data.data.to);

            setIsLoading(false);

            setListUpdated(false);
        }
        catch {

        }

    }, []);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            customer_status: '',
            subscriber_status: '',
            multiple_contact_details: '',
            subscription_due_priority: '',
            special_note: '',
            customer_other_details: '',
            customer_contact_name: '',
            customer_email: '',
            customer_contact_phone: '',
            customer_contact_position: ''
        },
    });

    const {
        register: register1,
        handleSubmit: handleSubmit1,
        reset: reset1,
        getValues,
    } = useForm({
        defaultValues: {
            monitoring_note: '',
            subscription_note_id: 0,
            subscription_note_by: '',
            subscription_note_assigned_to: loginUserName
        }
    });

    const onSubmit = async (data) => {

        const postdata = { ...data, customer_id: selectedCustomerId, multiple_contact_details: JSON.stringify(contactList) };

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


            const url = API_URL + "saveSubscriptionDueDetails";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                setListUpdated(true);

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated details!' })

            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating data!' })
            }
        }
        catch {

        }
    }

    const saveMonitoringNote = async (data) => {

        const postdata = { ...data, customer_id: selectedCustomerId, monitoring_note: data.monitoring_note.replace(/\r?\n/g, '<br/>'), monitoring_date: monitoringDate ? Moment(monitoringDate).format('YYYY-MM-DD HH:mm') : '' };

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


            const url = API_URL + "saveSubscriptionDueNotes";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                setListUpdated(true);

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated notes!' })

            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating note!' })
            }

            setMonitoringPopup(false);
        }
        catch {

        }
    }

    const Loader = () => (
        <div className="divLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );

    const fillformtoedit = (note) => {
        reset1({
            monitoring_note: note.subscription_note_text.replaceAll('<br/>', '\n'),
            subscription_note_id: note.subscription_note_id,
            subscription_note_by: note.subscription_note_by,
            subscription_note_assigned_to: note.subscription_note_assigned_to
        });
        if (note.subscription_note_date !== '0000-00-00 00:00:00' && note.subscription_note_date !== '') {
            setMonitoringDate(new Date(note.subscription_note_date));
        } else {
            setMonitoringDate();
        }
    }

    const changeMonitoringDate = (selectedtype) => {

        if (selectedtype === 'tomorrow') {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            setMonitoringDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1w') {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            setMonitoringDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '2w') {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            setMonitoringDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1m') {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            setMonitoringDate(new Date(date).setHours(9, 0, 0));
        }
    };

    const handleMonitoringDateChange = (date) => {
        const selectedHour = new Date(date).getHours();
        if (selectedHour === 0) {
            setMonitoringDate(new Date(date).setHours(9, 0, 0));
        } else {
            setMonitoringDate(date);
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

    return (
        <React.Fragment>
            <Row>
                <Col className='p-0'>
                    {isLoading ? <Loader /> : null}
                    <Card>
                        <Card.Body style={{ padding: '15px' }}>
                            <DynamicTable columns={columns} data={subscriptions} fromNumber={fromNumber} toNumber={toNumber} getSubscriptionsList={getSubscriptionsList} totalCount={totalCount} showReminderPopup={showReminderPopup} dueremindercount={dueremindercount} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal size="lg" show={monitoringPopup} onHide={() => setMonitoringPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Notes - {selectedCustomer}</Modal.Title>
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
                                                    <li className="media" style={{ marginBottom: '2rem' }}>
                                                        <div className="media-left mr-3">
                                                            <img className="media-object img-radius comment-img" src={note.subscription_note_by === 'admin' ? adminprofile : note.subscription_note_by === 'Shams' ? shamsprofile : note.subscription_note_by === 'Shamnad' ? shamnadprofile : note.subscription_note_by === 'Rasick' ? rasickprofile : note.subscription_note_by === 'Ajmal' ? ajmalprofile : note.subscription_note_by === 'Celine' ? celineprofile : note.subscription_note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading text-muted">{note.subscription_note_by}

                                                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:mm')}</span>
                                                                {note.subscription_note_by === loginUserName && <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                                                    <i class="fas fa-pencil-alt"></i>
                                                                </span>}
                                                                {getDifferenceInDays(note.subscription_note_date) && index === notearray.length - 1 && isSetReminder ?
                                                                    <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'red' }}>{note.subscription_note_date !== '0000-00-00 00:00:00' ? '[' + note.subscription_note_date + ']' : ''}</span> : <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'black' }}>{note.subscription_note_date !== '0000-00-00 00:00:00' ? '[' + note.subscription_note_date + ']' : ''}</span>}

                                                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Assigned to</Tooltip>}><span style={{ float: 'right', fontWeight: 'bold', color: 'darkmagenta' }}><i className="fas fa-arrow-circle-right" style={{ marginRight: '10px' }}></i>
                                                                    {note.subscription_note_assigned_to}</span>
                                                                </OverlayTrigger>

                                                            </h6>
                                                            <p style={{ color: 'black', margin: 0 }}>{ReactHtmlParser(note.subscription_note_text)} </p>
                                                            {note.subscription_note_rectified === 'true' && <p style={{ color: 'blue', margin: 0 }}>[Rectified on {Moment(note.rectified_date).format('DD-MM-YYYY HH:mm')}  -  {ReactHtmlParser(note.rectified_text)}]</p>}
                                                            {note.remove_reminder_text && <p style={{ fontStyle: 'italic', margin: 0 }}>[{ReactHtmlParser(note.remove_reminder_text)}] </p>}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </ScrollToBottom>}

                                    <Form key="monitoringform" onSubmit={handleSubmit1(saveMonitoringNote)}>
                                        <Row>
                                            <Col md="6">

                                                <ButtonGroup style={{ marginBottom: '5px' }}>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Tomorrow</Tooltip>}>
                                                        <Button variant="danger" onClick={() => changeMonitoringDate('tomorrow')} style={{ padding: '10px 20px' }}>T</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Week</Tooltip>}>
                                                        <Button variant="warning" onClick={() => changeMonitoringDate('1w')}>1 W</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Two Week</Tooltip>}>
                                                        <Button variant="info" onClick={() => changeMonitoringDate('2w')}>2 W</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Month</Tooltip>}>
                                                        <Button variant="success" onClick={() => changeMonitoringDate('1m')}>1 M</Button>
                                                    </OverlayTrigger>
                                                </ButtonGroup>
                                            </Col>
                                            <Col md="6"></Col>
                                            <Col md="6">
                                                <DatePicker
                                                    placeholderText='Select date'
                                                    // todayButton={"Today"}
                                                    selected={monitoringDate}
                                                    onChange={handleMonitoringDateChange}
                                                    className="form-control"
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dateFormat="dd-MM-yyyy h:mm aa"
                                                    timeCaption="time"
                                                    isClearable={true}
                                                />
                                            </Col>
                                            <Col md="3">
                                                <Form.Group controlId="exampleForm.ControlSelect2">
                                                    <Form.Control as="select" {...register1('subscription_note_assigned_to')}>
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


                                        <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...register1('monitoring_note')} />

                                        <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Comment</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal>

            <Modal size="xl" show={updtepopup} onHide={() => setupdatepopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{selectedCustomer}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Row>
                            <Col md={3}>
                                <Form.Group controlId="exampleForm.ControlSelect2">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as="select" {...register('customer_status')}>
                                        <option value="active">Active</option>
                                        <option value="new">New</option>
                                        <option value="demoaccount">Demo</option>
                                        <option value="blocked">Blocked</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="exampleForm.ControlSelect3">
                                    <Form.Label>Sub Status</Form.Label>
                                    <Form.Control as="select" {...register('subscriber_status')}>
                                        <option value="">Select Status</option>
                                        <option value="servicepending">Service Pending</option>
                                        <option value="readyforinvoice">Ready for Invoice</option>
                                        <option value="invoiced">Invoiced</option>
                                        <option value="partial">Partial</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={1} className="p-0">
                                <Form.Group>
                                    <div className="checkbox d-inline checkbox-danger" style={{ top: '40px' }}>
                                        <Form.Control type="checkbox" name="subscription_due_priority" id="danger-checkbox-1"  {...register('subscription_due_priority')} />
                                        <Form.Label htmlFor="danger-checkbox-1" className="cr">Priority</Form.Label>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={5}>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Special Note<span style={{ fontSize: '12px' }}> [visible only in this page]</span></Form.Label>
                                    <Form.Control as="textarea" rows="2" {...register('special_note')} />
                                </Form.Group>
                            </Col>

                        </Row>
                        <label className='form-label' style={{ color: '#000' }}>Contact Details</label>
                        <Row>
                            <Col md={1}><label className='form-label'></label></Col>
                            <Col md={3}><label className='form-label'>Name</label></Col>
                            <Col md={3}><label className='form-label'>Email</label></Col>
                            <Col md={2}><label className='form-label'>Phone</label></Col>
                            <Col md={2}><label className='form-label'>Position</label></Col>
                            <Col md={1}><label className='form-label'></label></Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={1}><Button variant='light'>1</Button></Col>
                            <Col md={3}>
                                <input type="text" className="form-control" {...register('customer_contact_name')} />
                            </Col>
                            <Col md={3}>
                                <input type="text" className="form-control" {...register('customer_email')} />
                            </Col>
                            <Col md={2}>
                                <input type="text" className="form-control" {...register('customer_contact_phone')} />
                            </Col>
                            <Col md={2}>
                                <input type="text" className="form-control" {...register('customer_contact_position')} />
                            </Col>
                            <Col md={1}></Col>
                        </Row>

                        {contactList.map((x, i) => {
                            return (
                                <Row>
                                    <Col md={1}>
                                        <Button variant='light'>{i + 2}</Button>
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" type='submit'>Submit</Button>
                        <Button variant="secondary" onClick={() => setupdatepopup(false)}>Close</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal size="xl" show={reminderPopup} onHide={() => setReminderPopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Reminders</Modal.Title>
                    <Row style={{ margin: '0 auto', width: '80%' }}>
                        <Col md="6">
                            <ButtonGroup>
                                {selectedRemType !== 'others' && rectifiedFilter === false &&
                                    <><Button variant={remSearchDate === 'today' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('today')}>Today</Button>
                                        <Button variant={remSearchDate === 'due' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('due')} style={{ padding: '10px 20px' }}>Due</Button>
                                        <Button variant={remSearchDate === 'upcoming' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('upcoming')}>Upcoming</Button></>
                                }
                                <Button variant={rectifiedFilter === true ? 'warning' : 'outline-warning'} onClick={() => filterRectifiedReminders()}>Rectified</Button>
                            </ButtonGroup>
                        </Col>

                        <Col md="2">
                            <Form.Control as="select" value={selectedRemType} onChange={(e) => {
                                setSelectedRemType(e.target.value);
                                setRectifiedFilter(false);
                            }}>
                                <option value="self">Self</option>
                                <option value="others">Others</option>
                            </Form.Control>
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
                    <Row>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body style={{ height: '85vh', padding: '10px 25px' }}>

                                    {reminders && reminders.length > 0 ?
                                        <Table responsive hover style={{ border: '1px solid #eaeaea', maxHeight: '75vh', overflowY: 'scroll' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '1%' }}>#</th>
                                                    <th style={{ width: '1%' }}></th>
                                                    <th style={{ width: '6%' }}></th>
                                                    <th style={{ width: '26%' }}>Customer Name</th>
                                                    {selectedRemType !== 'self' && <th style={{ width: '8%' }}>Assgn. To</th>}
                                                    <th style={{ width: '15%' }}>Date</th>
                                                    <th style={{ width: '40%' }}>Note</th>
                                                    <th style={{ width: '1%' }}></th>
                                                    <th style={{ width: '1%' }}></th>
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

                                                        <td onClick={() => updateMNote(reminder)}>{reminder.name}<br /><OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Created on</Tooltip>}><span style={{ fontSize: '11px' }}>{Moment(reminder.created_at).format('DD-MM-YYYY HH:mm:ss')}</span></OverlayTrigger>
                                                        </td>
                                                        {selectedRemType !== 'self' && <td>{reminder.subscription_note_assigned_to}</td>}
                                                        <td onClick={() => showPostpondDatePopup(reminder)} style={{cursor:'pointer'}}>
                                                            <span className={getDifferenceInDays(reminder.subscription_note_date) ? 'redText' : ''}>{reminder.subscription_note_date !== '0000-00-00 00:00:00' ? Moment(reminder.subscription_note_date).format('DD-MM-YYYY HH:mm:ss') : ''}</span>
                                                        </td>
                                                        <td onClick={() => updateMNote(reminder)}>{ReactHtmlParser(reminder.subscription_note_text.substring(0, 32))}
                                                            {reminder.subscription_note_rectified === 'true' && <span style={{ color: 'blue' }}><br />{ReactHtmlParser(reminder.rectified_text)}<span style={{ fontSize: '11px', marginLeft: '5px' }}>{'(' + Moment(reminder.rectified_date).format('DD-MM-YYYY HH:mm') + ')'}</span></span>}
                                                        </td>

                                                        <td>
                                                            {reminder.subscription_note_rectified !== 'true' && reminder.subscription_note_assigned_to === loginUserName && reminder.subscription_note_assigned_to !== reminder.subscription_note_by && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Rectify reminder</Tooltip>}>

                                                                <Button onClick={() => showRectifiedTextPopup(reminder.customer_id, reminder.subscription_note_id)} variant="warning" style={{ padding: '6px' }}>
                                                                    <i className="fa fa-check" style={{ margin: 0 }}></i>
                                                                </Button>
                                                            </OverlayTrigger>}
                                                        </td>

                                                        <td>
                                                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Remove reminder</Tooltip>}>

                                                                <Button onClick={() => showRemoveReminderTextPopup(reminder.customer_id, reminder.subscription_note_id)} variant="danger" style={{ padding: '6px' }}>
                                                                    <i className="far fa-calendar-times" style={{ margin: 0 }}></i>
                                                                </Button>
                                                            </OverlayTrigger>
                                                        </td>
                                                        <td>
                                                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Edit note</Tooltip>}>
                                                                <Button onClick={() => updateMNote(reminder)} variant="success" style={{ padding: '6px' }}>
                                                                    <i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                                                </Button>
                                                            </OverlayTrigger>
                                                        </td>
                                                        <td>
                                                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Edit account details</Tooltip>}>
                                                                <Button onClick={() => updateReminder(reminder)} variant="primary" style={{ padding: '6px' }}>
                                                                    <i class="fa fa-edit" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                                                </Button>
                                                            </OverlayTrigger>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table> : <p style={{ marginTop: '30px' }}>No Reminders for the selected time</p>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

            <Modal show={remindertextPopup} onHide={() => setReminderTextPopup(false)} backdrop="static" style={{ top: '35px', borderWidth: '2px' }}>
                <Form onSubmit={handleSubmitRemoveReminder(removeReminderDate)}>
                    <Modal.Header closeButton>
                        {/* <Modal.Title as="h5">Text</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Control as="textarea" rows="3" {...registerRemoveReminder('remove_reminder_text')} placeholder='Say something about removing reminder' required />
                                </Form.Group>
                            </Col>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" type='submit'>Submit</Button>
                        <Button variant="secondary" onClick={() => setReminderTextPopup(false)}>Close</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={rectifytextPopup} onHide={() => setRectifyTextPopup(false)} backdrop="static" style={{ top: '35px', borderWidth: '2px' }}>
                <Form onSubmit={handleSubmitRectifyReminder(rectifyReminder)}>
                    <Modal.Header closeButton>
                        {/* <Modal.Title as="h5">Text</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Control as="textarea" rows="3" {...registerRectifyReminder('rectified_text')} placeholder='Say something about rectifying reminder' required />
                                </Form.Group>
                            </Col>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" type='submit'>Submit</Button>
                        <Button variant="secondary" onClick={() => setRectifyTextPopup(false)}>Close</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={monitorDatePopup} onHide={() => setMonitorDatePopup(false)} backdrop="static">
                <Modal.Body style={{border: '3px solid rgba(0, 0, 0, 0.2)',borderRadius: '0.3rem'}}>
                    <Row>
                        <Col md={12}>

                                    <Form key="monitoringform" onSubmit={handleSubmit1(postpondMonitoringDate)}>
                                        <Row>
                                            <Col md="12">
                                                <DatePicker
                                                    placeholderText='Select date'
                                                    selected={monitoringDate}
                                                    onChange={handleMonitoringDateChange}
                                                    className="form-control"
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dateFormat="dd-MM-yyyy h:mm aa"
                                                    timeCaption="time"
                                                    isClearable={true}
                                                />
                                            </Col>
                                        </Row>

                                        <Button variant="secondary"onClick={() => setMonitorDatePopup(false)} style={{ float:'right' }}>Cancel</Button>
                                <Button variant="success" type='submit' style={{ float:'right' }}>Save</Button>
                                    </Form>
                               
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal>

        </React.Fragment>
    );

}

export default App