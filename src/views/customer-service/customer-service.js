import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { Row, Col, Card, Pagination, Modal, Button, ButtonGroup, OverlayTrigger, Tooltip, Form, Table, Badge } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import './customer-service.css';
import { API_URL } from "../../config/constant";
import ReactHtmlParser from 'react-html-parser';
import ScrollToBottom from 'react-scroll-to-bottom';

import CustomerServiceForm from './CustomerServiceForm';

import adminprofile from "../../assets/images/profile-logo/admin.png";

import shamsprofile from "../../assets/images/profile-logo/shams.jpg";

import shamnadprofile from "../../assets/images/profile-logo/shamnad.jpg";

import rasickprofile from "../../assets/images/profile-logo/rasick.jpg";

import ajmalprofile from "../../assets/images/profile-logo/ajmal.jpg";

import celineprofile from "../../assets/images/profile-logo/celine.jpg";

import shoneprofile from "../../assets/images/profile-logo/shone.jpg";

import PNotify from "pnotify/dist/es/PNotify";

function DynamicTable({ columns, data, fromNumber, toNumber, getCustomerServiceList, totalCount, addService, showReminderPopup, dueCount, levelOneOpenCount, levelTwoOpenCount, levelOneInitiatedCount, levelTwoInitiatedCount, levelOneVerifiedCount, levelTwoVerifiedCount }) {

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
            initialState: { pageIndex: 0, sortBy: [{ id: 'customer_service_created_date', desc: true }] },
            manualPagination: true,
            pageCount: Math.ceil(totalCount / 40),
        },
        useSortBy,
        usePagination
    )

    const [searchText, setSearchText] = useState(null);
    const [isFilter, setisFilter] = useState(false);
    const [filterarray, setFilterarray] = useState({ "new": true, "hold": true, "ongoing": true, "completed": false });
    const [refreshList, setRefreshList] = useState(false);
    const [dateRange, setDateRange] = useState({"from":'',"to":''});

    const handleFilterArrayChange = (e) => {

        const isChecked = e.target.checked;
        const checkeditem = e.target.name;
        setFilterarray({ ...filterarray, [checkeditem]: isChecked });

        if (checkeditem == 'jobcreated') {
            const todate = new Date();
            const fromdate = new Date();
            fromdate.setDate(fromdate.getDate() -7);
            setDateRange({"from":fromdate,"to":todate});
        }
    }

    const handleMainFilterChange = (e) => {

        const isChecked = e.target.checked;
        const checkeditem = e.target.name;
        setFilterarray({ ...filterarray, [checkeditem]: isChecked });
        setRefreshList(refreshList === true ? false : true);
    }

    const clearPopupFilter = () => {

        setisFilter(false);

        setFilterarray({ "new": true, "hold": true, "ongoing": true, "completed": false });

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

    const onChangeSearchCustomer = (e) => {
        setSearchText(e.target.value);
    };

    const search = () => {

        if (pageIndex > 0) {
            gotoPage(0);
        } else {
            setRefreshList(refreshList === true ? false : true);
        }
    };

    const clearAllFilters = () => {
        setSearchText(null);
        clearPopupFilter();
        if (pageIndex > 0) {
            gotoPage(0);
        } else {
            setRefreshList(refreshList === true ? false : true);
        }
        setDateRange({"from":'',"to":''});
    }

    useEffect(() => {
        getCustomerServiceList({ pageIndex, searchText, sortBy, filterarray, dateRange });
    }, [getCustomerServiceList, sortBy, pageIndex, refreshList])

    const handleKeypress = e => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            search();
        }
    };

    const callAddServiceFn = () => {
        addService();
    }

    const showReminders = () => {
        showReminderPopup();
    }

    const handlefromDateChange = (date) => {
        setDateRange({ ...dateRange, 'from': new Date(date) });
    };

    const handletoDateChange = (date) => {
        setDateRange({ ...dateRange, 'to': new Date(date) });
    };

    return (
        <>
            <Form>
                <Form.Row>
                    <Col xs={2} style={{ color: 'black' }}>
                        <span><b>Total : {totalCount}</b></span>

                        <button
                            className="btn btn-warning ml-4"
                            type="button"
                            onClick={() => showReminders()}
                        >
                            <i className="fas fa-bell" style={{ margin: 0, fontSize: '18px' }}></i>
                            {dueCount > 0 ?
                                (<OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Due Reminders</Tooltip>}
                                >
                                    <span style={{ color: 'red', marginLeft: '12px' }}><b>[ {dueCount} ]</b></span>
                                </OverlayTrigger>)
                                : ''}

                        </button>

                    </Col>
                    <Col xs={5}>
                        <Row>
                            <Col xs={11}>
                                <Row className="mr-3" style={{ backgroundColor: '#87ceeb17', color: 'orangered', borderBottom: '1px solid skyblue' }}>
                                    <div className="p-2 mr-3">Level 1</div>
                                    <div className="checkbox d-inline mr-4">
                                        <Form.Control type="checkbox" variant='warning' name="open" value="false" checked={filterarray['open']} id="open" onChange={handleMainFilterChange} />
                                        <Form.Label htmlFor="open" className="cr m-0">Open {levelOneOpenCount > 0 && <span>[{levelOneOpenCount}]</span> }</Form.Label>
                                    </div>
                                    <div className="checkbox d-inline mr-4">
                                        <Form.Control type="checkbox" name="initiated" value="false" checked={filterarray['initiated']} id="initiated" onChange={handleMainFilterChange} />
                                        <Form.Label htmlFor="initiated" className="cr m-0">Initiated {levelOneInitiatedCount > 0 && <span>[{levelOneInitiatedCount}]</span>}</Form.Label>
                                    </div>
                                    <div className="checkbox d-inline">
                                        <Form.Control type="checkbox" name="verified" value="false" checked={filterarray['verified']} id="verified" onChange={handleMainFilterChange} />
                                        <Form.Label htmlFor="verified" className="cr m-0">Verified {levelOneVerifiedCount > 0 && <span>[{levelOneVerifiedCount}]</span>}</Form.Label>
                                    </div>
                                </Row>
                                <Row className="mr-3 mb-2" style={{ backgroundColor: '#87ceeb17', color: 'green' }}>
                                    <div className="p-2 mr-3">Level 2</div>
                                    <div className="checkbox d-inline mr-4">
                                        <Form.Control type="checkbox" name="open2" value="false" checked={filterarray['open2']} id="open2" onChange={handleMainFilterChange} />
                                        <Form.Label htmlFor="open2" className="cr m-0">Open {levelTwoOpenCount > 0 && <span>[{levelTwoOpenCount}]</span>}</Form.Label>
                                    </div>
                                    <div className="checkbox d-inline mr-4">
                                        <Form.Control type="checkbox" name="initiated2" value="false" checked={filterarray['initiated2']} id="initiated2" onChange={handleMainFilterChange} />
                                        <Form.Label htmlFor="initiated2" className="cr m-0">Initiated {levelTwoInitiatedCount > 0 && <span>[{levelTwoInitiatedCount}]</span>}</Form.Label>
                                    </div>
                                    <div className="checkbox d-inline">
                                        <Form.Control type="checkbox" name="verified2" value="false" checked={filterarray['verified2']} id="verified2" onChange={handleMainFilterChange} />
                                        <Form.Label htmlFor="verified2" className="cr m-0">Verified {levelTwoVerifiedCount > 0 && <span>[{levelTwoVerifiedCount}]</span>}</Form.Label>
                                    </div>
                                </Row>
                            </Col>
                            
                        </Row>
                    </Col>
                    <Col xs={2}>
                        <Form.Control placeholder="Search..." value={searchText || ''} onChange={onChangeSearchCustomer} onKeyPress={handleKeypress} />
                        {searchText && <button type="button" className="react-datepicker__close-icon" onClick={clearAllFilters} style={{ right: '5px', height: 'auto', marginTop: '14px' }}></button>}
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

                        <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Add New Service</Tooltip>}
                        >
                            <Button onClick={() => callAddServiceFn()} className='text-capitalize float-right' variant="primary"><i className="feather icon-plus" style={{ margin: '0px', fontWeight: 'bold' }}></i></Button>
                        </OverlayTrigger>

                    </Col>
                </Form.Row>
            </Form>
            {data.length>0 && 
            <><BTable striped bordered hover responsive {...getTableProps()}>
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
            </Row></>}

            {data.length==0 && <p style={{textAlign:'center',padding:'20px 0 0', margin:'30px 0 0', borderTop:'1px solid #ced4da'}}>There is no data to show</p>}

            <Modal size="lg" show={isFilter} onHide={() => setisFilter(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Filter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-primary'>Status</p>
                    <Row>
                        <Col md={2} xl={2}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="new" value="false" checked={filterarray['new']} id="new" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="new" className="cr">New</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={2} xl={2}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="hold" value="false" checked={filterarray['hold']} id="hold" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="hold" className="cr">Hold</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={2} xl={2}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="ongoing" value="false" checked={filterarray['ongoing']} id="ongoing" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="ongoing" className="cr">Ongoing</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={3} xl={3}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="completed" value="false" checked={filterarray['completed']} id="completed" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="completed" className="cr">Completed</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={3} xl={3}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="followed-up" value="false" checked={filterarray['followed-up']} id="followed-up" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="followed-up" className="cr">Followed up</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>

                    </Row>

                    <hr />

                    <Row>
                        <Col md={3} xl={3}>
                            <p className='text-primary'>Job Created</p>
                                <Form.Group>
                                    <div className="checkbox d-inline">
                                        <Form.Control type="checkbox" name="jobcreated" value="false" checked={filterarray['jobcreated']} id="jobcreated" onChange={handleFilterArrayChange} />
                                        <Form.Label htmlFor="jobcreated" className="cr m-0"></Form.Label>
                                    </div>
                                </Form.Group>
                        </Col>

                        <Col md={9} xl={9}>
                            <Row>
                                <p className='text-primary w-100' style={{paddingLeft:'15px'}}>Service/Job Created Date Range</p>
                                    
                                <Col xs={3}>
                                    <DatePicker
                                        placeholderText='Select date'
                                        className="form-control"
                                        dateFormat="dd-MM-yyyy"
                                        selected={dateRange['from']}
                                        onChange={handlefromDateChange}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <DatePicker
                                        placeholderText='Select date'
                                        className="form-control"
                                        dateFormat="dd-MM-yyyy"
                                        selected={dateRange['to']}
                                        onChange={handletoDateChange}
                                    />
                                </Col>
                                
                            </Row>
                        </Col>
                    </Row>

                    <hr />
                    <p className='text-primary'>Payment</p>
                    <Row>

                        <Col md={6} xl={6}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="applicable" value="false" checked={filterarray['applicable']} id="applicable" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="applicable" className="cr m-0">Applicable</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6} xl={6}>
                            <Form.Group>
                                <div className="checkbox d-inline">
                                    <Form.Control type="checkbox" name="notapplicable" value="false" checked={filterarray['notapplicable']} id="notapplicable" onChange={handleFilterArrayChange} />
                                    <Form.Label htmlFor="notapplicable" className="cr m-0">Not applicable</Form.Label>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr />
                    <Row>
                        <Col md={6} xl={6}>
                            <p className='text-primary w-100'>Invoice Status</p>
                            <Row className='m-0'>
                                <Col md={6} xl={6} className='p-0'>
                                    <Form.Group>
                                        <div className="checkbox d-inline">
                                            <Form.Control type="checkbox" name="invoiced" value="false" checked={filterarray['invoiced']} id="invoiced" onChange={handleFilterArrayChange} />
                                            <Form.Label htmlFor="invoiced" className="cr m-0">Invoiced</Form.Label>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6} xl={6} className='p-0'>
                                    <Form.Group>
                                        <div className="checkbox d-inline">
                                            <Form.Control type="checkbox" name="notinvoiced" value="false" checked={filterarray['notinvoiced']} id="notinvoiced" onChange={handleFilterArrayChange} />
                                            <Form.Label htmlFor="notinvoiced" className="cr m-0">Not Invoiced</Form.Label>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6} xl={6}>
                            <p className='text-primary w-100'>Payment Status</p>
                            <Row className='m-0'>
                                <Col md={6} xl={6} className='p-0'>
                                    <Form.Group>
                                        <div className="checkbox d-inline">
                                            <Form.Control type="checkbox" name="paid" value="false" checked={filterarray['paid']} id="paid" onChange={handleFilterArrayChange} />
                                            <Form.Label htmlFor="paid" className="cr m-0">Paid</Form.Label>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6} xl={6} className='p-0'>
                                    <Form.Group>
                                        <div className="checkbox d-inline">
                                            <Form.Control type="checkbox" name="notpaid" value="false" checked={filterarray['notpaid']} id="notpaid" onChange={handleFilterArrayChange} />
                                            <Form.Label htmlFor="notpaid" className="cr m-0">Not paid</Form.Label>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>                    

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => filterSearch()}>Search</Button>
                    <Button variant="danger" onClick={() => clearPopupFilter()}>Clear</Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}

const findMonthDifference = (date) => {
    var months;
    var d1 = new Date(date);
    var d2 = new Date();
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months;
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
    const [services, setServices] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [levelOneOpenCount, setLevelOneOpenCount] = useState('');
    const [levelTwoOpenCount, setLevelTwoOpenCount] = useState('');

    const [levelOneInitiatedCount, setLevelOneInitiatedCount] = useState('');
    const [levelTwoInitiatedCount, setLevelTwoInitiatedCount] = useState('');

    const [levelOneVerifiedCount, setLevelOneVerifiedCount] = useState('');
    const [levelTwoVerifiedCount, setLevelTwoVerifiedCount] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [listupdated, setListUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortType, setSortType] = useState('monitoring_due_monitored_date');
    const [sortOrder, setSortOrder] = useState('desc');
    const loginUserId = localStorage.getItem('loginUserId');
    const loginUserName = localStorage.getItem('loginUserName');
    const [servicePopup, setServicePopup] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(0);
    const [users, setUsers] = useState([]);
    const [statusEditPopup, setStatusEditPopup] = useState(false);
    const [reminderDate, setReminderDate] = useState('');
    const [notePopup, setNotePopup] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const [notearray, setNoteArray] = useState([]);
    const [supportNotePopup, setSupportNotePopup] = useState(false);
    const [supportNote, setSupportNote] = useState('');
    const [supportNoteLevel, setSupportNoteLevel] = useState(0);
    const [reminderPopup, setReminderPopup] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [remSearchDate, setRemSearchDate] = useState('today');
    const [searchReminder, setSearchReminder] = useState(null);
    const [refreshReminders, setRefreshReminders] = useState(false);
    const [isPopupLoading, setIsPopupLoading] = useState(false);
    const [dueCount, setDueCount] = useState(0);
    const [todayCount, setTodayCount] = useState(0);
    const [upcomingCount, setUpcomingCount] = useState(0);
    const [filterData, saveFilterData] = useState({});
    const [jobCreatedDateRange, saveJobCreatedDateRange] = useState('');
    const [level2AssignPopup, setLevel2AssignPopup] = useState(false);
    const [remindertextPopup, setReminderTextPopup] = useState(false);
    const [jobRemarkPopup, setJobRemarkPopup] = useState(false);
    const [logPopup, setLogPopup] = useState(false);
    const [logs, setLogs] = useState(false);

    const searchFromReminder = () => {
        getReminders(remSearchDate, searchReminder);
    }

    const clearReminderSearch = () => {
        setSearchReminder(null);
        setRefreshReminders(refreshReminders === true ? false : true);
    }

    const getReminders = useCallback(async (remSearchDate, searchReminder) => {

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

            const url = `${API_URL}getServiceReminders/${remSearchDate}/${searchReminder}`;

            const response = await fetch(url, options)

            const data = await response.json();

            setReminders(data.data);

            setDueCount(data.duecnt);

            setTodayCount(data.todaycnt);

            setUpcomingCount(data.upcomingcnt);

            setIsPopupLoading(false);
        }
        catch {

        }
    }, [])

    useEffect(() => {
        getReminders(remSearchDate, searchReminder);
    }, [refreshReminders, remSearchDate])

    const updateMNote = (reminderdata) => {
        updateNote(reminderdata.customer_service_id, reminderdata.customer_service_description);
        // fillformtoedit(reminderdata);
    }

    const updateReminder = (reminderdata) => {
        editService(reminderdata.customer_service_id);
    }

    const {
        register: jobNoteRegister,
        handleSubmit: handleSubmitJobNote,
        reset: resetJobNote,
        getValues: getJobNoteValues,
        watch: watchJobNote
    } = useForm({
        service_id: 0,
        job_note: '',
        status: 1
    });

    const {
        register: statusregister,
        handleSubmit: handleSubmitStatusChange,
        reset: resetStatusChange,
        getValues: getStatusChangeValues,
        watch: watchStatusChange
    } = useForm({
        service_id: 0,
        service_status: '',
        note_date: '',
        note_text: '',
        note_by: loginUserName,
    });

    const {
        register,
        handleSubmit,
        reset,
        getValues,
    } = useForm({
        defaultValues: {
            note_id: 0,
            note_text: '',
            service_id: 0,
            note_by: loginUserName,
            note_date: ''
        }
    });

    const {
        register: level2assignregister,
        handleSubmit: handleSubmitAssignLevel2,
        reset: resetLevel2Assign,
        getValues: getLevel2AssignValues,
    } = useForm({
        service_id: 0,
        customer_service_L2_assigned_to: 0,
    });

    const updateNote = async (id, description) => {
        setIsLoading(true);
        setSelectedService(description);
        setSelectedServiceId(id);

        reset({
            note_id: 0,
            note_text: '',
            service_id: id,
            note_by: loginUserName,
            note_date: ''
        });
        setReminderDate();

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "getServiceNotes/" + id;

            const response = await fetch(url, options)

            const data = await response.json();

            setNoteArray(data.data);

            setNotePopup(true);

            setIsLoading(false);
        }
        catch {

        }

    }

    const changeReminderDate = (selectedtype) => {

        if (selectedtype === 'tomorrow') {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            setReminderDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1w') {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            setReminderDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '2w') {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            setReminderDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1m') {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            setReminderDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '3m') {
            const date = new Date();
            date.setDate(date.getDate() + 90);
            setReminderDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '6m') {
            const date = new Date();
            date.setDate(date.getDate() + 180);
            setReminderDate(new Date(date).setHours(9, 0, 0));
        }
    };

    const fillformtoedit = (note) => {
        reset({
            note_id: note.note_id,
            note_text: note.note_text.replaceAll('<br/>', '\n'),
            service_id: note.service_id,
            note_by: note.note_by
        });
        if (note.note_date !== '0000-00-00 00:00:00' && note.note_date !== '') {
            setReminderDate(new Date(note.note_date));
        } else {
            setReminderDate();
        }
    }

    const saveNote = async (data) => {

        const postdata = { ...data, note_text: data.note_text.replace(/\r?\n/g, '<br/>'), note_date: reminderDate ? Moment(reminderDate).format('YYYY-MM-DD HH:mm') : '' };

        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(postdata),

            }

            const url = API_URL + "SaveServiceNotes";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                setListUpdated(true);

                setRefreshReminders(refreshReminders === true ? false : true);

                updateNote(selectedServiceId, data.customer_service_description);

                PNotify.success({
                    title: "Success",
                    text: "Successfully updated notes!",
                    hide: true,
                    delay: 1000
                });
                // notice.on('click', function() {
                //     notice.close();
                // });

            } else {
                PNotify.error({
                    title: "Error ",
                    text: "Error in updating note!",
                    hide: true,
                    delay: 1000
                });
            }
        }
        catch {

        }
    }

    const showStatusPopup = (servicedata) => {
        setSelectedServiceId(servicedata.customer_service_id);

        if (servicedata.note_date !== '0000-00-00 00:00:00' && servicedata.note_date !== '') {
            setReminderDate(new Date(servicedata.note_date));
        } else {
            setReminderDate();
        }

        resetStatusChange({ service_id: servicedata.customer_service_id, service_status: servicedata.customer_service_status, note_text: servicedata.note_text });
        setStatusEditPopup(true);
    }

    const handleReminderDateChange = (date) => {
        if (date == null) {
            setReminderDate('');
        } else {
            const selectedHour = new Date(date).getHours();
            if (selectedHour === 0) {
                setReminderDate(new Date(date).setHours(9, 0, 0));
            } else {
                setReminderDate(date);
            }
        }
    };

    const onSubmitStatusChange = async (data) => {

        if (data.service_status === 'hold' && (reminderDate === '' || data.note_text === '')) {
            let msgtext = '';

            if (!reminderDate && data.note_text === '')
                msgtext = 'Please fill date and remark.';
            else if (!reminderDate)
                msgtext = 'Please select a date.';
            else if (data.note_text === '')
                msgtext = 'Please type remark.';

            PNotify.notice({
                title: "Alert!",
                text: msgtext,
                hide: true,
                delay: 1000
            });
        } else {
            setIsLoading(true);

            const postdata = { ...data, service_id: selectedServiceId, note_text: data.note_text.replace(/\r?\n/g, '<br/>'), note_date: reminderDate ? Moment(reminderDate).format('YYYY-MM-DD HH:mm') : '' };

            try {
                const options = {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken,
                    },
                    body: JSON.stringify(postdata)
                }

                const url = API_URL + "updateServiceStatus";

                const response = await fetch(url, options)

                const resdata = await response.json();

                setIsLoading(false);

                setStatusEditPopup(false);

                setListUpdated(true);

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

    const saveSupportNote = async () => {

        setIsLoading(true);

        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken,
                },
                body: JSON.stringify({ service_id: selectedServiceId, note: supportNote, level: supportNoteLevel })
            }

            const url = API_URL + "updateServiceSupportNote";

            const response = await fetch(url, options)

            const resdata = await response.json();

            setIsLoading(false);

            setSupportNotePopup(false);

            setSupportNoteLevel(0);

            setListUpdated(true);

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

    const onSubmitAssignLevel2 = async (data) => {

        setIsLoading(true);

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

            const url = API_URL + "assignServiceToLeveltwo";

            const response = await fetch(url, options)

            const resdata = await response.json();

            setIsLoading(false);

            setLevel2AssignPopup(false);

            setListUpdated(true);

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
    };

    const showLogs = async (id) => {

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

            const url = API_URL + "listLogs/"+id;

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                setLogs(data.data);

                setLogPopup(true);

                setIsLoading(false);
            } else {
                PNotify.error({
                    title: "Error ",
                    text: "Something went wrong!",
                    hide: true,
                    delay: 1000
                });
            }
        }
        catch {

        }
    }

    const columns = React.useMemo(
        () => [

            {
                Header: 'Customer',
                accessor: 'customer_service_created_date',
                className: 'customercolumn',
                Cell: ({ row }) => {

                    const formattedDate = Moment(row.original.customer_service_customer_exp_date).format('MMM-YYYY');

                    return (
                        <>

                            <span style={{ cursor: 'pointer' }} onClick={() => editService(row.original.customer_service_id)}>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Service Created Date</Tooltip>}
                                >
                                    <span>{Moment(row.original.customer_service_created_date).format('DD-MM-YYYY HH:mm')}<br /></span>
                                </OverlayTrigger>

                                {row.original.customer_service_customer_name} 
                            </span>
                            <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Logs</Tooltip>}
                                >
                                    <i class="fa fa-history" onClick={()=>showLogs(row.original.customer_service_id)} style={{marginLeft:'10px', cursor:'pointer', padding:'4px 10px'}}></i> 
                            </OverlayTrigger><br />

                            {row.original.count && <><OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Total Devices</Tooltip>}
                            >
                                <Badge variant="primary" style={{ fontSize: '13px', minWidth: '35px' }}>{row.original.count}</Badge>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>No Connection Devices</Tooltip>}
                            >
                                <><Badge variant="danger" style={{ fontSize: '13px', minWidth: '35px' }}>{row.original.Noconnection}</Badge><br /></>
                            </OverlayTrigger></>}
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Expiry Date</Tooltip>}>
                                <span className={findMonthDifference(row.original.customer_service_customer_exp_date) > 0 ? 'text-danger' : 'text-primary'}>{formattedDate !== 'Invalid date' ? formattedDate : ""}</span>
                            </OverlayTrigger>
                            <span className={formattedDate !== 'Invalid date' ? 'ml-1' : ''}>(by {row.original.user_name})</span>
                        </>
                    );

                }
            },
            {
                Header: 'Description',
                accessor: 'customer_service_description',
                className: 'monnamecolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span style={{ cursor: 'pointer' }} onClick={() => editService(row.original.customer_service_id)}>{row.original.customer_service_description}
                        </span>
                    );
                }
            },
            {
                Header: 'Qty/Payment',
                accessor: 'customer_service_quantity',
                className: 'payment_column',
                Cell: ({ row }) => {

                    return (
                        <span style={{ cursor: 'pointer' }} onClick={() => editService(row.original.customer_service_id)}>

                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Quantity</Tooltip>}
                            ><span>{row.original.customer_service_quantity}<br /></span>
                            </OverlayTrigger>

                            <span>
                                {row.original.customer_service_payment === 'notapplicable' ? 'Not applicable' : 'Applicable'}<br />
                                {row.original.customer_service_invoice_status === 'notinvoiced' ? 'Not Invoiced' : row.original.customer_service_invoice_status === 'invoiced' ? 'Invoiced' : ''}<br />
                                {row.original.customer_service_payment_status === 'notpaid' ? 'Not paid' : row.original.customer_service_payment_status === 'paid' ? 'Paid' : ''}<br />
                                {row.original.customer_service_amount}
                            </span>
                        </span>
                    );
                }
            },
            {
                Header: 'Level 1',
                accessor: 'customer_service_L1_support_initiated_date',
                className: 'support_column',
                Cell: ({ row }) => {

                    return (
                        <>
                            {(row.original.customer_service_L1_support_status !== 'open' || row.original.customer_service_L1_assigned_to === loginUserId) && <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>L1 Initiated</Tooltip>}
                            >
                                <p className="initiated-section">
                                    {row.original.customer_service_L1_support_initiated_date && Moment(row.original.customer_service_L1_support_initiated_date).format('DD-MM-YYYY HH:mm A')}
                                    {row.original.customer_service_L1_support_initiated_by && <span className="ml-1" style={{ 'fontSize': '10px' }}>({row.original.customer_service_L1_support_initiated_by})</span>}

                                    {(row.original.customer_service_L1_support_status === 'open' && row.original.customer_service_L1_assigned_to === loginUserId) && <Badge onClick={() => {
                                        const confirmBox = window.confirm(
                                            "Are you sure you want to change the status?"
                                        )
                                        if (confirmBox === true) { initiatedStatusChange('initiated', row.original.customer_service_id, 1) }
                                    }} className='text-capitalize' variant="secondary" style={{ padding: '6px', cursor: 'pointer' }}>
                                        <i className="fa fa-check" style={{ margin: 0 }}></i>
                                    </Badge>}
                                    {(row.original.customer_service_L1_support_status !== 'open' && row.original.customer_service_L1_assigned_to === loginUserId) && <Badge onClick={() => {
                                        if (row.original.customer_service_L1_support_initiated_by === loginUserName && row.original.customer_service_L1_support_status !== 'verified') {
                                            const confirmBox = window.confirm(
                                                "Are you sure you want to change the status back to 'open'?"
                                            )
                                            if (confirmBox === true) { initiatedStatusChange('open', row.original.customer_service_id, 1) }
                                        }
                                    }} className={`text-capitalize ${(row.original.customer_service_L1_support_initiated_by === loginUserName && row.original.customer_service_L1_support_status !== 'verified') ? 'pointer' : ''}`} variant="warning" style={{ padding: '6px', marginLeft: '10px' }}>
                                        <i className="fa fa-check" style={{ margin: 0 }}></i>
                                    </Badge>}

                                    {(row.original.customer_service_L1_assigned_to !== loginUserId && row.original.customer_service_L1_support_status !== 'open') && <Badge className='text-capitalize' variant="warning" style={{ padding: '6px', marginLeft: '10px' }}>
                                        <i className="fa fa-check" style={{ margin: 0 }}></i>
                                    </Badge>}
                                </p>
                            </OverlayTrigger>}
                            {row.original.customer_service_L1_support_status !== 'open' &&
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>L1 Verified</Tooltip>}
                                >
                                    <p className="verified-section">

                                        {row.original.customer_service_L1_support_verified_date && Moment(row.original.customer_service_L1_support_verified_date).format('DD-MM-YYYY HH:mm A')}
                                        {row.original.customer_service_L1_support_verified_by && <span className="ml-1" style={{ 'fontSize': '10px' }}>({row.original.customer_service_L1_support_verified_by})</span>}

                                        {(row.original.customer_service_L1_support_status === 'initiated' && row.original.customer_service_L1_assigned_to === loginUserId) && <Badge onClick={() => {
                                            if (row.original.customer_service_L1_support_initiated_by === loginUserName) {
                                                const confirmBox = window.confirm(
                                                    "Are you sure you verified this service?"
                                                )
                                                if (confirmBox === true) { verifiedStatusChange('verified', row.original.customer_service_id, 1) }
                                            }
                                        }} className={`text-capitalize ${(row.original.customer_service_L1_support_initiated_by === loginUserName && row.original.customer_service_L1_support_status !== 'verified') ? 'pointer' : ''}`} variant="secondary" style={{ padding: '6px' }}>
                                            <i className="fa fa-check" style={{ margin: 0 }}></i>
                                        </Badge>}
                                        {(row.original.customer_service_L1_support_status === 'verified' && row.original.customer_service_L1_assigned_to === loginUserId) && <Badge onClick={() => {
                                            if (row.original.customer_service_L1_support_verified_by === loginUserName && row.original.customer_service_L2_support_status === 'notassigned') {
                                                const confirmBox = window.confirm(
                                                    "Are you sure you want to change the status back to 'initiated'?"
                                                )
                                                if (confirmBox === true) { verifiedStatusChange('initiated', row.original.customer_service_id, 1) }
                                            }
                                        }} className={`text-capitalize ${(row.original.customer_service_L1_support_verified_by === loginUserName && row.original.customer_service_L2_support_status === 'notassigned') ? 'pointer' : ''}`} variant="success" style={{ padding: '6px', marginLeft: '10px' }}>
                                            <i className="fa fa-check" style={{ margin: 0 }}></i>
                                        </Badge>}

                                        {(row.original.customer_service_L1_assigned_to !== loginUserId && row.original.customer_service_L1_support_status === 'verified') && <Badge className='text-capitalize' variant="success" style={{ padding: '6px', marginLeft: '10px' }}>
                                            <i className="fa fa-check" style={{ margin: 0 }}></i>
                                        </Badge>}

                                    </p>
                                </OverlayTrigger>}

                            {row.original.customer_service_L1_support_note &&
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>{row.original.customer_service_L1_support_note}</Tooltip>}
                                >
                                    <p className={`${(row.original.customer_service_L1_support_initiated_by === loginUserName) ? 'pointer' : ''} support-note`} style={{ padding: '4px 8px 0', margin: 0 }} onClick={() => {
                                        if (row.original.customer_service_L1_support_initiated_by === loginUserName) {
                                            setSupportNote(row.original.customer_service_L1_support_note);
                                            setSelectedServiceId(row.original.customer_service_id);
                                            setSupportNotePopup(true);
                                            setSupportNoteLevel(1);
                                        }
                                    }}>{row.original.customer_service_L1_support_note}</p>
                                </OverlayTrigger>
                            }

                            {(!row.original.customer_service_L1_support_note && row.original.customer_service_L1_assigned_to === loginUserId) &&
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Add level 1 note</Tooltip>}
                                >
                                    <Button className='m-1 ml-2 px-1 py-0' variant="primary" onClick={() => {
                                        setSupportNote(row.original.customer_service_L1_support_note);
                                        setSelectedServiceId(row.original.customer_service_id);
                                        setSupportNotePopup(true);
                                        setSupportNoteLevel(1);
                                    }}><i className="feather icon-plus" style={{ margin: '0px', fontWeight: 'bold' }}></i></Button>
                                </OverlayTrigger>}

                            {(row.original.customer_service_L1_support_status === 'verified' && row.original.customer_service_L2_support_status === 'notassigned' && row.original.customer_service_L1_assigned_to === loginUserId) &&
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Assign for level 2</Tooltip>}
                                >
                                    <Button className='m-1 ml-2 px-1 py-0' variant="primary" onClick={() => {
                                        resetLevel2Assign({
                                            service_id: row.original.customer_service_id
                                        });
                                        setLevel2AssignPopup(true);
                                    }}>Assign</Button>
                                </OverlayTrigger>
                            }

                        </>
                    );
                }
            },

            {
                Header: 'Level 2',
                accessor: 'customer_service_L2_support_initiated_date',
                className: 'support_column',
                Cell: ({ row }) => {

                    return (
                        <>

                            {row.original.customer_service_L2_support_status !== 'notassigned' &&
                                <>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={<Tooltip id={`tooltip-top`}>L2 Initiated</Tooltip>}
                                    >
                                        <p className="initiated-section">

                                            {(row.original.customer_service_L2_support_status === 'open' && row.original.customer_service_L2_assigned_to !== loginUserId) && <span className="pl-2">Level 2 assigned to {users.filter(user => user.user_id == row.original.customer_service_L2_assigned_to) }</span>
                                            }

                                            {(row.original.customer_service_L2_support_status === 'open'  && row.original.customer_service_L2_assigned_to !== loginUserId) &&
                                                    <Button className='m-1 ml-2 px-1 py-0' variant="primary" onClick={() => {
                                                        resetLevel2Assign({
                                                            service_id: row.original.customer_service_id
                                                        });
                                                        setLevel2AssignPopup(true);
                                                    }}>Reassign</Button>
                                            }

                                            {row.original.customer_service_L2_support_initiated_date && Moment(row.original.customer_service_L2_support_initiated_date).format('DD-MM-YYYY HH:mm A')}
                                            {row.original.customer_service_L2_support_initiated_by && <span className="ml-1" style={{ 'fontSize': '10px' }}>({row.original.customer_service_L2_support_initiated_by})</span>}

                                            {row.original.customer_service_L2_assigned_to === loginUserId && <span>
                                                {row.original.customer_service_L2_support_status === 'open' && <Badge onClick={() => {
                                                    const confirmBox = window.confirm(
                                                        "Are you sure you want to change the status?"
                                                    )
                                                    if (confirmBox === true) { initiatedStatusChange('initiated', row.original.customer_service_id, 2) }
                                                }} className='text-capitalize' variant="secondary" style={{ padding: '6px', cursor: 'pointer' }}>
                                                    <i className="fa fa-check" style={{ margin: 0 }}></i>
                                                </Badge>}
                                                {row.original.customer_service_L2_support_status === 'initiated' && <Badge onClick={() => {
                                                    const confirmBox = window.confirm(
                                                        "Are you sure you want to change the status back to 'open'?"
                                                    )
                                                    if (confirmBox === true) { initiatedStatusChange('open', row.original.customer_service_id, 2) }
                                                }} className='text-capitalize' variant="warning" style={{ padding: '6px', marginLeft: '10px', cursor: 'pointer' }}>
                                                    <i className="fa fa-check" style={{ margin: 0 }}></i>
                                                </Badge>}
                                                {row.original.customer_service_L2_support_status === 'verified' && <Badge className='text-capitalize' variant="warning" style={{ padding: '6px', marginLeft: '10px' }}>
                                                    <i className="fa fa-check" style={{ margin: 0 }}></i>
                                                </Badge>}
                                            </span>}

                                            {(row.original.customer_service_L2_assigned_to !== loginUserId && row.original.customer_service_L2_support_status !== 'open') && <Badge className='text-capitalize' variant="warning" style={{ padding: '6px', marginLeft: '10px' }}>
                                                <i className="fa fa-check" style={{ margin: 0 }}></i>
                                            </Badge>}

                                        </p>
                                    </OverlayTrigger>
                                    {row.original.customer_service_L2_support_status !== 'open' &&
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={<Tooltip id={`tooltip-top`}>L2 Verified</Tooltip>}
                                        >
                                            <p className="verified-section">

                                                {row.original.customer_service_L2_support_verified_date && Moment(row.original.customer_service_L2_support_verified_date).format('DD-MM-YYYY HH:mm A')}
                                                {row.original.customer_service_L2_support_verified_by && <span className="ml-1" style={{ 'fontSize': '10px' }}>({row.original.customer_service_L2_support_verified_by})</span>}

                                                {row.original.customer_service_L2_assigned_to === loginUserId && <span>
                                                    {row.original.customer_service_L2_support_status === 'initiated' && <Badge onClick={() => {
                                                        const confirmBox = window.confirm(
                                                            "Are you sure you verified this service?"
                                                        )
                                                        if (confirmBox === true) { verifiedStatusChange('verified', row.original.customer_service_id, 2) }
                                                    }} className='text-capitalize' variant="secondary" style={{ padding: '6px', cursor: 'pointer' }}>
                                                        <i className="fa fa-check" style={{ margin: 0 }}></i>
                                                    </Badge>}
                                                    {row.original.customer_service_L2_support_status === 'verified' && <Badge onClick={() => {
                                                        const confirmBox = window.confirm(
                                                            "Are you sure you want to change the status back to 'initiated'?"
                                                        )
                                                        if (confirmBox === true) { verifiedStatusChange('initiated', row.original.customer_service_id, 2) }
                                                    }} className='text-capitalize' variant="success" style={{ padding: '6px', marginLeft: '10px', cursor: 'pointer' }}>
                                                        <i className="fa fa-check" style={{ margin: 0 }}></i>
                                                    </Badge>}
                                                </span>}

                                                {(row.original.customer_service_L2_assigned_to !== loginUserId && row.original.customer_service_L2_support_status === 'verified') && <Badge className='text-capitalize' variant="success" style={{ padding: '6px', marginLeft: '10px' }}>
                                                    <i className="fa fa-check" style={{ margin: 0 }}></i>
                                                </Badge>}
                                            </p>
                                        </OverlayTrigger>}

                                    {row.original.customer_service_L2_support_note &&
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={<Tooltip id={`tooltip-top`}>{row.original.customer_service_L2_support_note}</Tooltip>}
                                        >
                                            <p className={`${row.original.customer_service_L2_assigned_to === loginUserId ? 'pointer' : ''} support-note`} style={{ padding: '4px 8px 0', margin: 0 }} onClick={() => {
                                                if (row.original.customer_service_L2_assigned_to === loginUserId) {
                                                    setSupportNote(row.original.customer_service_L2_support_note);
                                                    setSelectedServiceId(row.original.customer_service_id);
                                                    setSupportNotePopup(true);
                                                    setSupportNoteLevel(2);
                                                }
                                            }}>{row.original.customer_service_L2_support_note}</p>
                                        </OverlayTrigger>
                                    }

                                    {(!row.original.customer_service_L2_support_note && row.original.customer_service_L2_assigned_to === loginUserId) &&
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={<Tooltip id={`tooltip-top`}>Add level 2 note</Tooltip>}
                                        >
                                            <Button className='m-1 ml-2 px-1 py-0' variant="primary" onClick={() => {
                                                setSupportNote(row.original.customer_service_L2_support_note);
                                                setSupportNoteLevel(2);
                                                setSelectedServiceId(row.original.customer_service_id);
                                                setSupportNotePopup(true);
                                            }}><i className="feather icon-plus" style={{ margin: '0px', fontWeight: 'bold' }}></i></Button>
                                        </OverlayTrigger>}
                                </>

                            }

                        </>
                    );
                }
            },

            
            {
                Header: 'Status',
                accessor: 'customer_service_status',
                className: 'status_column',
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (
                        <>
                            <div onClick={() => showStatusPopup(row.original)} className={`text-capitalize ${row.original.customer_service_status === 'completed' ? 'text-success' : ''}`} style={{ cursor: 'pointer' }}>

                                {row.original.customer_service_status}

                                {row.original.customer_service_status_change_time && <span style={{ fontSize: '11px' }}><br />({Moment(row.original.customer_service_status_change_time).format('DD-MM-YYYY HH:mm A')})</span>}
                            </div>

                            {row.original.customer_service_job_created === 0 &&
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Create Job</Tooltip>}
                                >
                                    <Button className='px-1 py-0 mt-3' variant="primary" onClick={() => showJobNotePopup(row.original)}>
                                        <i className="feather icon-plus" style={{ margin: 0, fontWeight: 'bold' }}></i> Job
                                    </Button>
                                </OverlayTrigger>}

                            {row.original.customer_service_job_created === 1 && <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Job Created Date/By/Status </Tooltip>}
                            >
                                <span style={{ color: 'orange' }}>
                                    <b>Job Created</b> <br />
                                    <span style={{ fontSize: '11px', textTransform:'capitalize' }}>{row.original.customer_service_job_created_date && Moment(row.original.customer_service_job_created_date).format('DD-MM-YYYY')} /
                                        {row.original.customer_service_job_created_by} / <b>{row.original.sales_plus_customer_status}</b></span>

                                </span>
                            </OverlayTrigger>
                            }
                        </>);
                }
            },
            {
                Header: 'Remark',
                accessor: 'note_date',
                className: 'monnamecolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span style={{ cursor: 'pointer' }}>
                            {row.original.note_text === '' &&
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Add Remark</Tooltip>}
                                >
                                    <Button className='mr-1 p-1' variant="primary" onClick={() => updateNote(row.original.customer_service_id, row.original.customer_service_description)}>
                                        <i className="fas fa-comment m-0"></i></Button>
                                </OverlayTrigger>}
                            {row.original.note_text && <span style={{ cursor: 'pointer' }} onClick={() => updateNote(row.original.customer_service_id, row.original.customer_service_description)}>{row.original.note_text}<span className="ml-2" style={{ fontSize: '11px' }}>[{row.original.note_date && Moment(row.original.note_date).format('DD-MM-YYYY')}]</span>
                            </span>}
                        </span>
                    );
                }
            },
        ],
        []
    )

    const showJobNotePopup = (servicedata) => {
        setSelectedServiceId(servicedata.customer_service_id);
        console.log(getJobNoteValues());

        resetJobNote({ service_id: servicedata.customer_service_id, job_note: servicedata.customer_service_job_remarks, status: 1 });
        setJobRemarkPopup(true);
    }

    const getUsersList = async () => {

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "getUsers";

            const response = await fetch(url, options)

            const data = await response.json();

            setUsers(data.data);
        }
        catch {

        }
    }

    useEffect(() => {
        getUsersList();
    }, [])

    const initiatedStatusChange = async (value, serviceid, level) => {
        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = `${API_URL}updateInitiatedLevelSupport/${serviceid}/${value}/${level}`;

            const response = await fetch(url, options);

            const data = await response.json();

            if (data.status === 'success') {
                PNotify.success({
                    title: "Success",
                    text: data.data,
                    hide: true,
                    delay: 1000
                });
            } else {
                PNotify.error({
                    title: "Error",
                    text: data.data,
                    hide: true,
                    delay: 1000
                });
            }
            setListUpdated(true);
        }
        catch {

        }
    }

    const verifiedStatusChange = async (value, serviceid, level) => {
        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = `${API_URL}updateVerifiedLevelSupport/${serviceid}/${value}/${level}`;

            const response = await fetch(url, options);

            const data = await response.json();

            if (data.status === 'success') {
                PNotify.success({
                    title: "Success",
                    text: data.data,
                    hide: true,
                    delay: 1000
                });
            } else {
                PNotify.error({
                    title: "Error",
                    text: data.data,
                    hide: true,
                    delay: 1000
                });
            }
            setListUpdated(true);
        }
        catch {

        }
    }

    const createJobforService = async (formdata) => {
        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(formdata)
            }

            const url = `${API_URL}createJobforService`;

            const response = await fetch(url, options);

            const data = await response.json();

            let successmsg = '';

            if (formdata.status === 1)
                successmsg = 'Job added successfully';
            else
                successmsg = 'Job deleted';

            if (data.status === 'success') {
                PNotify.success({
                    title: "Success",
                    text: successmsg,
                    hide: true,
                    delay: 1000
                });
            } else {
                PNotify.error({
                    title: "Error",
                    text: 'Something went wrong!',
                    hide: true,
                    delay: 1000
                });
            }
            setListUpdated(true);
            setJobRemarkPopup(false);
        }
        catch {

        }
    }

    useEffect(() => {
        if (listupdated) {

            const sortBy = [{ id: sortType, desc: sortOrder === 'desc' ? true : false }];
            const searchText = searchKeyword;
            const pageIndex = currentPage;
            const filterarray = filterData;
            const dateRange = jobCreatedDateRange;
            getCustomerServiceList({ pageIndex, searchText, sortBy, filterarray, dateRange });
        }
    }, [listupdated])

    const getCustomerServiceList = useCallback(async ({ pageIndex, searchText, sortBy, filterarray, dateRange }) => {

        setIsLoading(true);

        const cpage = pageIndex + 1;
        setCurrentPage(pageIndex);

        if (!searchText) {
            searchText = null;
        }

        setSearchKeyword(searchText);

        saveFilterData(filterarray);

        saveJobCreatedDateRange(dateRange);

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

        const postdata = {
            keyword: searchText, sortType: stype ? stype : sortType, sortOrder: sorder ? sorder : sortOrder, searchstatus: filterarray, jobCreatedDateRange:dateRange
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

            const url = API_URL + "getCustomerServices?page=" + cpage;

            const response = await fetch(url, options)

            const data = await response.json();

            setServices(data.data.data);

            setTotalCount(data.data.total);

            setFromNumber(data.data.from);

            setToNumber(data.data.to);

            setLevelOneOpenCount(data.leveloneopencount);

            setLevelTwoOpenCount(data.leveltwoopencount);

            setLevelOneInitiatedCount(data.leveloneinitiatedcount);
            setLevelTwoInitiatedCount(data.leveltwoinitiatedcount);
            setLevelOneVerifiedCount(data.leveloneverifiedcount);
            setLevelTwoVerifiedCount(data.leveltwoverifiedcount);

            setIsLoading(false);

            setListUpdated(false);
        }
        catch {

        }

    }, []);

    const Loader = () => (
        <div className="servicePageLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );

    const closeAddPopup = () => {
        setServicePopup(false);
        setRefreshReminders(refreshReminders === true ? false : true);
    }

    const updateServices = () => {
        setListUpdated(true);
    }

    const editService = (id) => {
        setSelectedServiceId(id);
        setServicePopup(true);
    }

    const addService = () => {
        setSelectedServiceId(0);
        setServicePopup(true);
    }

    const showReminderPopup = () => {
        setReminderPopup(true);
        setRemSearchDate('today');
        setSearchReminder(null);
        setReminders([]);
        getReminders(remSearchDate, searchReminder);
    }

    const { register: registerRemoveReminder, handleSubmit: handleSubmitRemoveReminder, reset: resetRemoveReminder } = useForm({
        defaultValues: {
            remove_reminder_text: '',
            note_id: 0,
            service_id: 0
        },
    });

    const showRemoveReminderTextPopup = (serviceid, id) => {
        resetRemoveReminder({
            remove_reminder_text: '',
            note_id: id,
            service_id: serviceid
        });
        setReminderTextPopup(true);
    }

    const removeReminderDate = async (postdata) => {

        setIsLoading(true);
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

            const url = API_URL + "removeServiceReminder";

            const response = await fetch(url, options)

            const data = await response.json();

            setReminderTextPopup(false);

            setRefreshReminders(refreshReminders === true ? false : true);

            setIsLoading(false);

            if (data.status === 'success') {
                PNotify.success({
                    title: "Success",
                    text: 'Successfully removed reminder!',
                    hide: true,
                    delay: 1000
                });
            } else {
                PNotify.error({
                    title: "Error",
                    text: 'Something went wrong!',
                    hide: true,
                    delay: 1000
                });
            }
        }
        catch {

        }
    }


    return (
        <React.Fragment>
            <Row>
                <Col className='p-0'>
                    {isLoading ? <Loader /> : null}
                    <Card>
                        <Card.Body style={{ padding: '15px' }}>
                            <DynamicTable columns={columns} data={services} fromNumber={fromNumber} toNumber={toNumber} getCustomerServiceList={getCustomerServiceList} totalCount={totalCount} addService={addService} showReminderPopup={showReminderPopup} dueCount={dueCount} levelOneOpenCount={levelOneOpenCount} levelTwoOpenCount={levelTwoOpenCount} levelOneInitiatedCount={levelOneInitiatedCount} levelTwoInitiatedCount={levelTwoInitiatedCount} levelOneVerifiedCount={levelOneVerifiedCount} levelTwoVerifiedCount={levelTwoVerifiedCount} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal size="lg" show={servicePopup} onHide={() => setServicePopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{selectedServiceId ? 'Edit Service' : 'Add Service'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CustomerServiceForm id={selectedServiceId} closePopup={closeAddPopup} updateServices={updateServices} users={users} />
                </Modal.Body>
            </Modal>

            <Modal show={statusEditPopup} onHide={() => setStatusEditPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Edit status</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleSubmitStatusChange(onSubmitStatusChange)}>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col md={12}>
                                <Form.Label>Select Status: </Form.Label>
                                <Form.Control as="select" {...statusregister('service_status')} onChange={(e) => {
                                    resetStatusChange({
                                        ...getStatusChangeValues(),
                                        service_status: e.target.value,
                                    });
                                }}>
                                    <option value="new">New</option>
                                    <option value="hold">Hold</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="followed-up">Followed up</option>
                                </Form.Control>
                            </Col>
                            {getStatusChangeValues('service_status') === 'hold' &&
                                <><Col md={12} className='mt-1'>
                                    <Form.Label>Select Date: </Form.Label>
                                    <DatePicker
                                        placeholderText='Select date'
                                        selected={reminderDate}
                                        onChange={handleReminderDateChange}
                                        className="form-control"
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="dd-MM-yyyy h:mm aa"
                                        timeCaption="time"
                                        isClearable={true}
                                    />
                                </Col>
                                    <Col md={12}>
                                        <Form.Label>Remark: </Form.Label>
                                        <Form.Control as="textarea" rows="3" {...statusregister('note_text')} />
                                    </Col></>}
                        </Row>
                        <Col md={12} style={{ paddingTop: '1rem', borderTop: '1px solid #dee2e6' }} className="text-right pr-0">
                            <Button variant="success" type="submit">Submit</Button>
                            <Button variant="secondary" onClick={() => setStatusEditPopup(false)}>Close</Button>
                        </Col>
                    </Form>

                </Modal.Body>
            </Modal>

            <Modal size="lg" show={notePopup} onHide={() => setNotePopup(false)} backdrop="static">
                <Modal.Header closeButton className='pt-3 pr-3 pl-3 pb-1'>
                    <Modal.Title as="h5" className='w-100'>Notes<br />
                        <p className='mb-0 mt-2'>{selectedService}</p>
                    </Modal.Title>
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
                                                            <img className="media-object img-radius comment-img" src={note.note_by === 'admin' ? adminprofile : note.note_by === 'Shams' ? shamsprofile : note.note_by === 'Shamnad' ? shamnadprofile : note.note_by === 'Rasick' ? rasickprofile : note.note_by === 'Ajmal' ? ajmalprofile : note.note_by === 'Celine' ? celineprofile : note.note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading text-muted">{note.note_by}

                                                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:MM')}</span>
                                                                {note.note_by === loginUserName && <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                                                    <i className="fas fa-pencil-alt"></i>
                                                                </span>}
                                                                {getDifferenceInDays(note.note_date) ?
                                                                    <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'red' }}>{note.note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span> : <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'black' }}>{note.note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span>}
                                                            </h6>
                                                            <p style={{ color: 'black', margin: 0 }}>{ReactHtmlParser(note.note_text)} </p>
                                                            {note.remove_reminder_text && <p style={{ fontStyle: 'italic', margin: 0 }}>[{ReactHtmlParser(note.remove_reminder_text)}] </p>}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </ScrollToBottom>}

                                    <Form key="monitoringform" onSubmit={handleSubmit(saveNote)}>
                                        <Row>
                                            <Col md="6">

                                                <ButtonGroup className='mt-2 float-left' style={{ 'fontSize': '10px' }}>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Tomorrow</Tooltip>}>

                                                        <Button variant="success" style={{ 'fontSize': '10px' }} onClick={() => changeReminderDate('tomorrow')}>
                                                            T</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Week</Tooltip>}>

                                                        <Button variant="warning" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeReminderDate('1w')}> 1 W
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Two Week</Tooltip>}>

                                                        <Button variant="danger" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeReminderDate('2w')}>2 W
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Month</Tooltip>}>

                                                        <Button variant="secondary" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeReminderDate('1m')}> 1 M
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Three Month</Tooltip>}>

                                                        <Button variant="info" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeReminderDate('3m')}>3 M
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Six Month</Tooltip>}>

                                                        <Button variant="light" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeReminderDate('6m')}>6 M  </Button>
                                                    </OverlayTrigger>
                                                </ButtonGroup>

                                            </Col>
                                            <Col md="6"></Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>&nbsp;</Col></Row>
                                        <Row>
                                            <Col md="6">
                                                <DatePicker
                                                    placeholderText='Select date'
                                                    selected={reminderDate}
                                                    onChange={handleReminderDateChange}
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


                                        <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...register('note_text')} />

                                        <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Comment</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal>

            <Modal show={supportNotePopup} onHide={() => setSupportNotePopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Support Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col md={12}>
                                <Form.Label>Note: </Form.Label>
                                <Form.Control as="textarea" rows="8" value={supportNote} onChange={(e) => setSupportNote(e.target.value)} />
                            </Col>
                        </Row>
                        <Col md={12} style={{ paddingTop: '1rem', borderTop: '1px solid #dee2e6' }} className="text-right pr-0">
                            <Button variant="success" onClick={() => saveSupportNote()}>Submit</Button>
                            <Button variant="secondary" onClick={() => setSupportNotePopup(false)}>Close</Button>
                        </Col>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal size="xl" show={reminderPopup} onHide={() => setReminderPopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Reminders</Modal.Title>
                    <Row style={{ margin: '0 auto', width: '80%' }}>
                        <Col md="6">
                            <ButtonGroup>
                                <Button variant={remSearchDate === 'today' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('today')}>Today ({todayCount})</Button>
                                <Button variant={remSearchDate === 'due' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('due')} style={{ padding: '10px 20px' }}>Due ({dueCount})</Button>
                                <Button variant={remSearchDate === 'upcoming' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('upcoming')}>Upcoming ({upcomingCount})</Button>
                            </ButtonGroup>
                        </Col>

                        <Col md="4">
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
                            {searchReminder && <button type="button" className="react-datepicker__close-icon" onClick={clearReminderSearch} style={{ right: '5px', height: '90%' }}></button>}
                        </Col>
                        <Col md="2">
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
                                <Card.Body style={{ height: '80vh', padding: '10px 25px' }}>

                                    {reminders && reminders.length > 0 ?
                                        <Table responsive hover style={{ border: '1px solid #eaeaea', maxHeight: '75vh', overflowY: 'scroll' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '1%' }}>#</th>
                                                    <th style={{ width: '6%' }}></th>
                                                    <th style={{ width: '26%' }}>Description/<br />Customer</th>
                                                    <th style={{ width: '15%' }}>Date</th>
                                                    <th style={{ width: '30%' }}>Note</th>
                                                    <th style={{ width: '10%' }}>Status</th>
                                                    <th style={{ width: '1%' }}></th>
                                                    <th style={{ width: '1%' }}></th>
                                                    <th style={{ width: '1%' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reminders.map((reminder, index) => (
                                                    <tr>
                                                        <td onClick={() => updateMNote(reminder)} style={{ cursor: 'pointer' }}>{index + 1}</td>
                                                        <td onClick={() => updateMNote(reminder)} style={{ cursor: 'pointer' }}>
                                                            <img className="left-logo" style={{ borderRadius: '50%', width: '40px' }} src={reminder.note_by === 'admin' ? adminprofile : reminder.note_by === 'Shams' ? shamsprofile : reminder.note_by === 'Shamnad' ? shamnadprofile : reminder.note_by === 'Rasick' ? rasickprofile : reminder.note_by === 'Ajmal' ? ajmalprofile : reminder.note_by === 'Celine' ? celineprofile : reminder.note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                                        </td>

                                                        <td onClick={() => updateMNote(reminder)} style={{ cursor: 'pointer' }}>{reminder.customer_service_description}<br />({reminder.customer_service_customer_name})<br /><OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Created on</Tooltip>}><span style={{ fontSize: '11px' }}>{Moment(reminder.created_at).format('DD-MM-YYYY HH:mm:ss')}</span></OverlayTrigger>
                                                        </td>
                                                        <td onClick={() => updateMNote(reminder)} style={{ cursor: 'pointer' }}>
                                                            <span className={getDifferenceInDays(reminder.note_date) ? 'text-danger' : ''}>{reminder.note_date !== '0000-00-00 00:00:00' ? Moment(reminder.note_date).format('DD-MM-YYYY HH:mm:ss') : ''}</span>
                                                        </td>
                                                        <td onClick={() => updateMNote(reminder)} style={{ cursor: 'pointer' }}>{ReactHtmlParser(reminder.note_text)}
                                                        </td>
                                                        <td onClick={() => updateMNote(reminder)} style={{ cursor: 'pointer' }}>{reminder.customer_service_status}
                                                        </td>
                                                        <td>
                                                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Remove reminder</Tooltip>}>

                                                                <Button onClick={() => showRemoveReminderTextPopup(reminder.service_id, reminder.note_id)} variant="danger" style={{ padding: '6px' }}>
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
                                                                    <i className="fa fa-edit" style={{ fontWeight: 'normal', margin: 0 }}></i>
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

            <Modal show={level2AssignPopup} onHide={() => setLevel2AssignPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Assign Level 2</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleSubmitAssignLevel2(onSubmitAssignLevel2)}>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col md={12}>
                                <Form.Label>Select Assignee: </Form.Label>
                                <Form.Control as="select" {...level2assignregister('customer_service_L2_assigned_to')} onChange={(e) => {
                                    resetLevel2Assign({
                                        ...getLevel2AssignValues(),
                                        customer_service_L2_assigned_to: e.target.value,
                                    });
                                }}>
                                    <option value="">Select</option>
                                    {users.filter((user, index) => [2,3,10,15,19,22].includes(user.user_id)).map(user => (

                                        <option key={user.user_id} value={user.user_id}>{user.user_name}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Row>
                        <Col md={12} style={{ paddingTop: '1rem', borderTop: '1px solid #dee2e6' }} className="text-right pr-0">
                            <Button variant="success" type="submit">Submit</Button>
                            <Button variant="secondary" onClick={() => setLevel2AssignPopup(false)}>Close</Button>
                        </Col>
                    </Form>

                </Modal.Body>
            </Modal>

            <Modal show={jobRemarkPopup} onHide={() => setJobRemarkPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Job Remark</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleSubmitJobNote(createJobforService)}>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col md={12}>
                                <Form.Label>Remark</Form.Label>
                                <Form.Control as="textarea" placeholder='Add Remark...' rows="3" {...jobNoteRegister('job_note')} />
                            </Col>
                        </Row>
                        <Col md={12} style={{ paddingTop: '1rem', borderTop: '1px solid #dee2e6' }} className="text-right pr-0">
                            <Button variant="success" type="submit">Submit</Button>
                            <Button variant="secondary" onClick={() => setJobRemarkPopup(false)}>Close</Button>
                        </Col>
                    </Form>

                </Modal.Body>
            </Modal>

            <Modal size="lg" show={logPopup} onHide={() => setLogPopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Logs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {logs.length>0 ? <Table responsive style={{ border: '1px solid #eaeaea', borderTop: 'none' }}>
                        <thead>
                            <tr>
                                <th style={{width:'25%'}}>Date & Time</th>
                                <th>Activity</th>
                            </tr>
                        </thead>
                        <tbody>

                            {logs.map((item, index) => (
                                <tr>
                                    <th style={{width:'25%'}}>{Moment(item.date).format('DD-MM-yyyy hh:mm a')}</th>
                                    <th>{item.text}</th>
                                </tr>
                            ))}

                        </tbody>
                    </Table> : <p style={{ marginTop: '18px' }}>No logs</p>}

                </Modal.Body>
            </Modal>

        </React.Fragment>
    );

}

export default App