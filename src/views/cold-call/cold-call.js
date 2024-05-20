import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";

import { Row, Col, Card, Pagination, Table, Modal, Field, Button, OverlayTrigger, Tooltip, ButtonGroup, Form, Tabs, Tab, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import './cold-call.css';
import { API_URL } from "../../config/constant";
import ReactHtmlParser from 'react-html-parser';
import ScrollToBottom from 'react-scroll-to-bottom';
import Datetime from 'react-datetime';
import adminprofile from "../../assets/images/profile-logo/admin.png";

import shamsprofile from "../../assets/images/profile-logo/shams.jpg";

import shamnadprofile from "../../assets/images/profile-logo/shamnad.jpg";

import rasickprofile from "../../assets/images/profile-logo/rasick.jpg";

import ajmalprofile from "../../assets/images/profile-logo/ajmal.jpg";

import celineprofile from "../../assets/images/profile-logo/celine.jpg";

import shoneprofile from "../../assets/images/profile-logo/shone.jpg";

import axios from 'axios';

import Dropdown from 'react-bootstrap/Dropdown';

import { saveAs } from "file-saver";

const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 700 });


function DynamicTable({ columns, data, fromNumber, toNumber, getcoldcallList, totalCount, showReminderPopup, newcount, followupcnt, totalncnt, todaycnt, duecnt, upcomingcnt, addfileupload, addCustomer }) {

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
            initialState: { pageIndex: 0, sortBy: [{ id: '', desc: true }] },
            manualPagination: true,
            pageCount: Math.ceil(totalCount / 50),
        },
        useSortBy,
        usePagination

    )
    const handleFilterArrayChange = (e) => {

        localStorage.removeItem('logfillterarray');
        const isChecked = e.target.checked;
        const checkeditem = e.target.name;

        setFilterarray(filterarray => ({ ...filterarray, [checkeditem]: isChecked }));


    }

    const statusfilter = [

        {
            name: "new",
            value: "true",
            label: "New",
            full: "New"
        },
        {
            name: "interested",
            value: "true",
            label: "IN",
            full: "Interested"
        },
        {
            name: "futurerequirements",
            value: "true",
            label: "FR",
            full: "Future Requirement"
        },
        {
            name: "noresponse",
            value: "true",
            label: "NRS",
            full: "No Response"
        },
        {
            name: "norequirements",
            value: "true",
            label: "NR",
            full: "No Requirement"
        },
        {
            name: "invalid",
            value: "true",
            label: "IV",
            full: "Invalid"
        }
        ,
        {
            name: "duplicate",
            value: "true",
            label: "DU",
            full: "Duplicate"
        }
        ,
        {
            name: "actiontaken",
            value: "true",
            label: "AT",
            full: "Action Taken"
        }

    ]
    const authToken = localStorage.getItem('authToken');
    const [searchtext, setSearchText] = useState(null);
    const [location, setlocation] = useState(null);
    const [filterarray, setFilterarray] = useState({ "new": true });
    const [updateList, setupdateList] = useState(false);
    const [remaindermode, setremaindermode] = useState(false);
    const [remSearchDate, setRemSearchDate] = useState('today');
    const [rectifiedFilter, setRectifiedFilter] = useState(false);
    const [searchMonth, setSearchMonth] = useState('');
    const [Category, searchCategory] = useState('');
    const [leadsource, searchleadsource] = useState('');
    const [isFilter, setisFilter] = useState(false);
    const [clearfilter, setClearFilter] = useState(false);
    const [Monthname, setMonthname] = useState(null);
    const [initiallog, setinitiallog] = useState(0);
    const [initial, setinitial] = useState('first');
    const year = (new Date()).getFullYear();
    const years = Array.from(new Array(60), (val, index) => index + year);
    const [searchYear, setsearchYear] = useState('');
    const loginUserName = localStorage.getItem('loginUserName');
    const sale_person_id = localStorage.getItem('sale_person_id');
    const fnremainder = async (e) => {
        var checked = e.target.checked;
        if (checked) {
            setremaindermode(true);
            setFilterarray({ "new": false, "interested": true, "futurerequirements": true, "noresponse": true, "norequirements": true, "invalid": true });
        }
        else {
            setremaindermode(false);
            //setFilterarray({ "New": true});
        }
        if (pageIndex > 0) {
            gotoPage(0);
        }

    }


    const onChangeSearchtext = (e) => {
        setSearchText(e.target.value);
    };
    const onChangeLocation = (e) => {
        setlocation(e.target.value);
        localStorage.setItem("loglocation", location);
    };

    const onChangeSearchMonth = (e) => {
        var data = e.target.value
        setSearchMonth(data);
        if (data != '')
            localStorage.setItem("logMonthname", e.target.options[e.target.selectedIndex].text);
        else
            localStorage.setItem("logMonthname", '');
        localStorage.setItem("logMonth", data);
    };

    const onChangeCategory = (e) => {
        var data = e.target.value
        searchCategory(data);
        localStorage.setItem("logCategory", data);
    };
    const onChangeSearchYear = (e) => {
        var data = e.target.value
        setsearchYear(data);
        localStorage.setItem("logSearchYear", data);
    };

    const onChangeleadsource = (e) => {
        var data = e.target.value
        searchleadsource(data);
        localStorage.setItem("logleadsource", data);
    };


    const onclearfilter = () => {
        searchCategory('');
        setSearchMonth('');
        setlocation(null);
        setsearchYear('');
        searchleadsource('');
        localStorage.removeItem('logCategory');
        localStorage.removeItem('logSearchYear');
        localStorage.removeItem('logMonth');
        localStorage.removeItem('logMonthname');
        localStorage.removeItem('loglocation');
        localStorage.removeItem("logleadsource");

    };

    const setlocalstorage = async () => {
        if (localStorage.hasOwnProperty('logfillterarray'))
            setFilterarray(JSON.parse(localStorage.getItem('logfillterarray')));

        if (localStorage.hasOwnProperty('logCategory'))
            searchCategory(localStorage.getItem('logCategory'));


        if (localStorage.hasOwnProperty('logSearchYear'))
            searchCategory(localStorage.getItem('logSearchYear'));


        if (localStorage.hasOwnProperty('logMonth'))
            setSearchMonth(localStorage.getItem('logMonth'));

        if (localStorage.hasOwnProperty('loglocation'))
            setlocation(localStorage.getItem('loglocation'));

        if (localStorage.hasOwnProperty('logleadsource'))
            searchleadsource(localStorage.getItem('logleadsource'));

        if (localStorage.hasOwnProperty('logSearchYear'))
            searchCategory(localStorage.getItem('logSearchYear'));

        setinitiallog(1);
        if (localStorage.hasOwnProperty('logMonth') || localStorage.hasOwnProperty('logSearchYear') || localStorage.hasOwnProperty('logCategory') || localStorage.hasOwnProperty('logfillterarray') || localStorage.hasOwnProperty('loglocation') || localStorage.hasOwnProperty('logleadsource'))
            setupdateList(updateList ? false : true);
        else
            getcoldcallList({ pageIndex, searchtext, sortBy, filterarray, remSearchDate, remaindermode, searchMonth, Category, location, leadsource, searchYear });


    }


    const clearsearch = () => {
        setSearchText(null);
    }
    const showReminders = () => {
        showReminderPopup();
    }
    const search = () => {
        if (searchtext)
            setSearchText(searchtext);

        if (pageIndex > 0) {
            gotoPage(0);
        }
        else
            setupdateList(updateList ? false : true);
    };

    const clearAllFilters = () => {
        localStorage.removeItem('logfillterarray');
        localStorage.removeItem('logMonth');
        localStorage.removeItem('logCategory');
        localStorage.removeItem('logMonthname')
        onclearfilter();
        setSearchText(null);
        setremaindermode(false);
        setFilterarray({ "new": true });

        if (pageIndex > 0) {
            gotoPage(0);
        }
        else
            setupdateList(updateList ? false : true);
    }

    const callfileupload = () => {
        addfileupload();
    }


    const calladdCustomer = () => {
        console.log(localStorage);
        addCustomer(0, loginUserName, sale_person_id);
    }

    const filterSearch = () => {
        setisFilter(false);
        if (pageIndex > 0) {
            gotoPage(0);
        }
        else
            setupdateList(updateList ? false : true);
    }

    const clearPopupFilter = () => {
        onclearfilter();
        setisFilter(false);
        if (pageIndex > 0) {
            gotoPage(0);
        }
        else
            setupdateList(updateList ? false : true);
    }

    useEffect(() => {

        if (initiallog == 0)
            setlocalstorage();
        if (initiallog == 1 && initial == 'first')
            getcoldcallList({ pageIndex, searchtext, sortBy, filterarray, remSearchDate, remaindermode, searchMonth, Category, location, leadsource, searchYear });


    }, [getcoldcallList, sortBy, updateList, pageIndex, remaindermode, remSearchDate, clearfilter])




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


                    <Col xs={1}>

                        <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Reminders</Tooltip>}
                        >
                            <div className="switch d-inline m-r-10">
                                <Form.Control type="checkbox" id="checked-offline" onChange={(e) => { fnremainder(e); }} />
                                <Form.Label htmlFor="checked-offline" className="cr" />
                            </div>
                        </OverlayTrigger>

                    </Col>

                    {remaindermode && <Col xs={3} className="topcols">
                        <ButtonGroup>
                            <><Button variant={remSearchDate === 'today' ? 'warning smallbtn' : 'outline-warning smallbtn'} onClick={() => setRemSearchDate('today')}>
                                <Badge variant="danger">{todaycnt}</Badge>Today</Button>
                                <Button variant={remSearchDate === 'due' ? 'warning smallbtn' : 'outline-warning smallbtn'} onClick={() => setRemSearchDate('due')} style={{ padding: '10px 20px' }}  ><Badge variant="danger" >{duecnt}</Badge>Due</Button>
                                <Button variant={remSearchDate === 'upcoming' ? 'warning smallbtn' : 'outline-warning smallbtn'} onClick={() => setRemSearchDate('upcoming')} >

                                    <Badge variant="danger"  >{upcomingcnt}
                                    </Badge>Upcoming
                                </Button></>

                        </ButtonGroup>


                    </Col>
                    }



                    <Col xs={4}>
                        <Form.Control placeholder="Search..." value={searchtext || ''} onChange={onChangeSearchtext} onKeyPress={handleKeypress} />
                        {searchtext && <button type="button" class="react-datepicker__close-icon" onClick={clearsearch} style={{ right: '2px', height: '90%' }}></button>}
                    </Col>
                    <Col xs={4}>
                        <button
                            className="text-capitalize btn btn-success topbuttons"
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
                            className="text-capitalize btn btn-danger topbuttons"
                            type="button"
                            onClick={clearAllFilters}
                        >
                            <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
                        </button>

                        {remaindermode == false && <>
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Bulk Upload </Tooltip>}>

                                <button
                                    className="text-capitalize btn btn-primary  topbuttons"
                                    type="button"
                                    onClick={event => window.location.href = '/temp-cold-call'}
                                >
                                    <i className="fa fa-upload" style={{ margin: 0 }}></i>
                                </button>
                            </OverlayTrigger>
                            <Dropdown style={{ 'display': 'inline' }}>
                                <Dropdown.Toggle variant="info" id="dropdown-basic"><i className="icon feather icon-settings" style={{ margin: '10px' }}></i>

                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => calladdCustomer()}>Add New Customer</Dropdown.Item>

                                    <Dropdown.Item onClick={event => window.location.href = '/Report'}>Cold Call Report</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown></>
                        }





                    </Col>

                    <Col xs={12} style={{ color: 'black' }}><b>Total : {totalncnt} , New : {newcount} , Follow Up : {followupcnt}</b>

                        {(searchMonth != '' || Category != '' || leadsource != '' || searchYear != '') && <span>&nbsp;&nbsp;&nbsp;Filters used :- </span>}
                        {(searchMonth != '') && <span>&nbsp;&nbsp;&nbsp; Month : <b>{localStorage.getItem("logMonthname")}</b></span>}
                        {(searchYear != '') && <span>&nbsp;&nbsp;&nbsp;Year : <b>{searchYear}</b></span>}
                        {(Category != '') && <span>&nbsp;&nbsp;&nbsp; Category : <b>{Category}</b></span>}
                        {(leadsource != '') && <span>&nbsp;&nbsp;&nbsp; Lead Source : <b>{leadsource}</b></span>}
                        {(location != null) && <span>&nbsp;&nbsp;&nbsp; Location : <b>{location}</b></span>}
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
            <Modal size="xl" show={isFilter} onHide={() => setisFilter(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Filter</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        {statusfilter.map((item, index) => (
                            <Col className="topcols">
                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>{item.full}</Tooltip>}>
                                    <div className="checkbox d-inline">
                                        <Form.Control type="checkbox" name={item.name} value={item.value}
                                            checked={filterarray[item.name]} id={item.name}
                                            onClick={(e) => handleFilterArrayChange(e)} />
                                        <Form.Label htmlFor={item.name} className="cr">{item.label}</Form.Label>
                                    </div>
                                </OverlayTrigger>
                            </Col>
                        ))}

                    </Row>

                    <Row>

                        <Col md={6} xl={3}>
                            <Form.Control as="select" name="smonth" onChange={(e) => { onChangeSearchMonth(e); }} value={searchMonth}>
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

                        <Col md={6} xl={2}>
                            <Form.Control name="bb" as="select" onChange={(e) => { onChangeSearchYear(e); }} value={searchYear}>
                                <option value="">Select Year</option>
                                {
                                    years.map((year, index) => {
                                        return <option key={`year${index}`} value={year}>{year}</option>
                                    })
                                }
                            </Form.Control>
                        </Col>
                        <Col md={6} xl={2}>
                            <Form.Control as="select" name="leadsource" onChange={(e) => { onChangeleadsource(e); }} value={leadsource} >
                                <option value="">Lead Source</option>
                                <option value="coldcall">cold call</option>
                                <option value="doortodoor">Door to Door</option>
                                <option value="referral">Referral</option>
                                <option value="companylead">Company Lead</option>
                                <option value="dealer">Dealer</option>
                                <option value="others">Others</option>


                            </Form.Control>
                        </Col>
                        <Col md={6} xl={2}>
                            <Form.Control as="select" name="category" onChange={(e) => { onChangeCategory(e); }} value={Category}>
                                <option value="">Select Category</option>
                                <option value="Courier Services">Courier Services</option>

                            </Form.Control>
                        </Col>

                        <Col md={6} xl={3}>

                            <input type="text" class="form-control" name="location" onChange={onChangeLocation} placeholder='Location' autocomplete='off' value={location} />

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


    const [coldcall, setcoldcall] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [listupdated, setListUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortType, setSortType] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [notearray, setNoteArray] = useState([]);
    const [remDate, setRemDate] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [notetext, setnotetext] = useState('');
    const [filterData, saveFilterData] = useState({});
    const [monitoringPopup, setMonitoringPopup] = useState(false);
    const [fileupload, setfileuploadPopup] = useState(false);
    const [selectedCustomer, setselectedCustomer] = useState('');
    const [selectedCustomerId, setselectedCustomerId] = useState(0);
    const loginUserId = localStorage.getItem('loginUserId');
    const loginUserName = localStorage.getItem('loginUserName');
    const sale_person_id = localStorage.getItem('sale_person_id');
    const [monitoringDate, setMonitoringDate] = useState();
    const [isSetReminder, setIsSetReminder] = useState(false);
    const [reminderPopup, setReminderPopup] = useState(false);
    const authToken = localStorage.getItem('authToken');
    const [refreshReminders, setRefreshReminders] = useState(false);
    const [isPopupLoading, setIsPopupLoading] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [updtepopup, setupdatepopup] = useState(false);
    const [remindertextPopup, setReminderTextPopup] = useState(false);
    const [contactList, setContactList] = useState([{ order: 1, name: "", email: "", phone: "", position: "" }]);
    const [rectifytextPopup, setRectifyTextPopup] = useState(false);
    const [SearchDate, setSearchDate] = useState('');
    const [remaindermode, setremaindermode] = useState(false);
    const [newcount, setnewcount] = useState(0);
    const [followupcnt, setfollowupcnt] = useState(0);
    const [totalncnt, settotalcnt] = useState(0);
    const [salesaccount, setsalesaccount] = useState(0);
    const [CustomerPopup, setcustomerPopup] = useState(null);
    const [gpsvalue, setgpsvalue] = useState(false);
    const [creationDate, setcreationDate] = useState('');
    const [modifiedDate, setmodifiedDate] = useState('');
    const [expiryDate, setexpiryDate] = useState(null);

    const [todaycnt, settodaycnt] = useState(0);
    const [duecnt, setduecnt] = useState(0);
    const [upcomingcnt, setupcomingcnt] = useState(0);

    const [searchMonth, setSearchMonth] = useState('');
    const [Category, searchCategory] = useState('');
    const [leadsource, searchleadsource] = useState('');
    const [location, setlocation] = useState(null);
    const [searchYear, setsearchYear] = useState('');
    const year = (new Date()).getFullYear();
    const years = Array.from(new Array(60), (val, index) => index + year);

    const handlecreationDateChange = (date) => {
        setcreationDate(new Date(date));
        reset2({
            ...getValues2(),
            creation_date: creationDate,
        })
    };

    const handlemodifiedDateChange = (date) => {
        setmodifiedDate(new Date(date));
        reset2({
            ...getValues2(),
            modified_date: modifiedDate,
        })
    };

    const handleexpiryDateChange = (date) => {
        setexpiryDate(new Date(date));
        reset2({
            ...getValues2(),
            expiry_date: expiryDate,
        })
    };



    const fngps = async (e) => {
        var checked = e.target.checked;
        if (checked)
            setgpsvalue(true);
        else
            setgpsvalue(false);

    }

    const fnsalesaccount = async (e) => {
        var value = e.target.value;
        setsalesaccount(value);

    }


    const addfileupload = () => {
        setfileuploadPopup(true);
    }
    // const showReminderPopup = () => {
    //     setReminderPopup(true);
    //     setRectifiedFilter(false);
    //     setSelectedRemType('self');
    //     setRemSearchDate('today');
    //     setSearchReminder(null);
    //     getReminders(rectifiedFilter,selectedRemType,remSearchDate,searchReminder);
    // }
    const showRectifiedTextPopup = (customerid, id) => {
        resetRectifyReminder({
            rectified_text: '',
            reminder_id: id,
            reminder_customer_id: customerid
        });
        setRectifyTextPopup(true);
    }



    const updateMNote = (reminderdata) => {

        setselectedCustomerId(reminderdata.customer_id);
        updateMonitoringNote(reminderdata);
    }
    // const searchFromReminder = () => {
    //     getReminders(rectifiedFilter,selectedRemType,remSearchDate,searchReminder);
    // }
    //  const clearReminderSearch = () => {
    //     setSearchReminder(null);
    //     setRefreshReminders(refreshReminders === true ? false : true);
    // }

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        reset: reset2,
        getValues: getValues2,
    } = useForm({

        defaultValues: {
            cold_call_id: 0,
            company_name: '',
            phone: '',
            location: '',
            gps: '',
            contact_name: '',
            project_value: 0,
            new_qty: '',
            city: '',
            mobile: '',
            migrate_qty: '',
            trading_qty: '',
            sales_value: '',
            contact_email: '',
            lead_source: 'coldcall',
            service: '',
            expiry_date: '',
            sales_person: sale_person_id,
            creation_date: creationDate,
            modified_date: '',
            status: 'new',
            comment: '',
            month: 0,
            year: 0,
            category: '',
            website: ''

        }
    });

    const {
        register: register1,
        handleSubmit: handleSubmit1,
        reset: reset1,
        getValues,
    } = useForm({
        defaultValues: {
            note_id: '',
            note_text: '',
            cold_call_id: 0,
            note_by: '',
            note_assigned_to: loginUserName
        }
    });


    const { register: registerRectifyReminder, handleSubmit: handleSubmitRectifyReminder, reset: resetRectifyReminder } = useForm({
        defaultValues: {
            rectified_text: '',
            reminder_id: 0,
            reminder_customer_id: 0
        },
    });



    const { register: registerRemoveReminder, handleSubmit: handleSubmitRemoveReminder, reset: resetRemoveReminder } = useForm({
        defaultValues: {
            remove_reminder_text: '',
            reminder_id: 0,
            notes_id: 0
        },
    });

    const showRemoveReminderTextPopup = (customerid, id) => {

        resetRemoveReminder({
            remove_reminder_text: '',
            reminder_id: id,
            notes_id: id
        });
        setReminderTextPopup(true);
    }
    const addCustomer = async (id, loginUserName, sale_person_id) => {


        if (id != 0) {
            try {
                const options = {
                    method: 'get',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken
                    }
                }

                const url = API_URL + "getcoldcallcustomerdata/" + id;

                const response = await fetch(url, options)

                const data = await response.json();

                reset2({
                    cold_call_id: data.data.cold_call_id,
                    company_name: data.data.company_name,
                    phone: data.data.phone,
                    location: data.data.location,
                    gps: data.data.gps,
                    contact_name: data.data.contact_name,
                    project_value: data.data.project_value,
                    new_qty: data.data.new_qty,
                    migrate_qty: data.data.migrate_qty,
                    trading_qty: data.data.trading_qty,
                    sales_value: data.data.sales_value,
                    contact_email: data.data.contact_email,
                    lead_source: data.data.lead_source == '' || data.data.lead_source == 'null' ? 'coldcall' : data.data.lead_source,
                    service: data.data.service,
                    expiry_date: data.data.cold_call_id,
                    sales_person: data.data.sales_person == null ? sale_person_id : data.data.sales_person,
                    creation_date: data.data.creation_date != '0000-00-00' ? new Date(data.data.creation_date) : '',
                    modified_date: data.data.modified_date != '0000-00-00' ? new Date(data.data.modified_date) : '',
                    status: data.data.status,
                    month: data.data.expiry_month,
                    year: data.data.expiry_year,
                    comment: '',
                    category: data.data.category,
                    website: data.data.website,
                    city: data.data.city,
                    mobile: data.data.mobile,
                })



                var d1 = (data.data.creation_date != '0000-00-00' ? new Date(data.data.creation_date) : '');
                var d2 = (data.data.modified_date != '0000-00-00' ? new Date(data.data.modified_date) : '');
                setcreationDate(d1);
                setmodifiedDate(d2);
                setexpiryDate(null);

                if (data.data.gps == 'yes')
                    setgpsvalue(true);
                else
                    setgpsvalue(false);

                setcustomerPopup(true);
            }
            catch {

            }
        }
        else {
            setgpsvalue(false);
            clearregval();
            setcreationDate(new Date());
            setcustomerPopup(true);
        }


    }


    // useEffect(() => {
    //     getReminders(rectifiedFilter,selectedRemType,remSearchDate,searchReminder);
    // }, [rectifiedFilter,selectedRemType,refreshReminders,remSearchDate])

    const saveMonitoringNote = async (data) => {

        const postdata = { ...data, cold_call_id: selectedCustomerId, note_text: data.note_text.replace(/\r?\n/g, '<br/>'), note_date: monitoringDate ? Moment(monitoringDate).format('YYYY-MM-DD HH:mm') : '' };

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

            const url = API_URL + "savecoldcallnotes";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                setListUpdated(true);
                updateMonitoringNote(selectedCustomerId, data.company_name);

                Toast.fire({
                    type: 'success',
                    title: 'Successfully updated notes!',
                    variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                    customClass: { popup: 'adjust' }
                })
            } else {
                Toast.fire({
                    type: 'success',
                    title: 'Error in updating note!',
                    variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                    customClass: { popup: 'adjust' }
                })

            }

            //setMonitoringPopup(false);
        }
        catch {

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
        } else if (selectedtype === '3m') {
            const date = new Date();
            date.setDate(date.getDate() + 90);
            setMonitoringDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '6m') {
            const date = new Date();
            date.setDate(date.getDate() + 180);
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
    // const filterRectifiedReminders = () =>{
    //        setRectifiedFilter(rectifiedFilter===true?false:true);
    //    }  

    const fillformtoedit = (note) => {
        reset1({
            note_id: note.notes_id,
            note_text: note.note_text.replaceAll('<br/>', '\n'),
            cold_call_id: note.cold_call_id,
            note_by: note.note_by,
            note_assigned_to: note.note_assigned_to
        });
        if (note.note_date !== '0000-00-00 00:00:00' && note.note_date !== '') {
            setMonitoringDate(new Date(note.note_date));
        } else {
            setMonitoringDate();
        }
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

            const url = API_URL + "removecoldcallReminder";

            const response = await fetch(url, options)

            const data = await response.json();

            setReminderTextPopup(false);

            setListUpdated(true);

            Toast.fire({
                type: 'success',
                title: data.data,
                variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                customClass: { popup: 'adjust' }
            })
        }
        catch {

        }
    }

    const movecoldcallto = async (cold_id, value) => {

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },

            }


            const url = API_URL + "movecoldcallto/" + cold_id + '/' + value;

            const response = await fetch(url, options)

            const data = await response.json();
            //setListUpdated(true);
            var myRow = document.getElementById("at_" + cold_id);

            myRow.parentElement.parentElement.remove();
            Toast.fire({
                type: 'success',
                title: data.data,
                variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                customClass: { popup: 'adjust' }
            })

        }
        catch {

        }
    };


    const deletecoldcall = async (cold_id) => {
        var confirm = window.confirm('Do you Want To Delete?');

        if (confirm === true) {

            try {
                const options = {
                    method: 'get',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken
                    },

                }

                const url = API_URL + "deletecoldcallitem/" + cold_id;

                const response = await fetch(url, options)

                const data = await response.json();
                setListUpdated(true);
                Toast.fire({
                    type: 'success',
                    title: data.data,
                    variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                    customClass: { popup: 'adjust' }
                })

            }
            catch {

            }
        }
    };

    const changeStatus = async (selectedstatus, cold_id) => {
        setCurrentStatus(selectedstatus);
        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },

            }

            const url = API_URL + "updatecoldcallstatus/" + cold_id + '/' + selectedstatus;

            const response = await fetch(url, options)

            const data = await response.json();
            Toast.fire({
                type: 'success',
                title: data.data,
                variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                customClass: { popup: 'adjust' }
            })

        }
        catch {

        }
    };


    const updateMonitoringNote = async (cold_call_id, company_name) => {
        setMonitoringPopup(true);
        setIsSetReminder(false);
        setselectedCustomer(company_name);
        setselectedCustomerId(cold_call_id);



        reset1({
            note_id: '',
            note_text: '',
            cold_call_id: 0,
            note_by: '',
            note_assigned_to: loginUserName
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

            const url = API_URL + "getAllColdCallNotes/" + cold_call_id;

            const response = await fetch(url, options)

            const data = await response.json();

            setNoteArray(data.data);

            setMonitoringPopup(true);

            setIsLoading(false);
        }
        catch {

        }

    }

    const updateexpirymonth = async (e, cold_id) => {
        try {
            var month = e.target.value;
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, /',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },

            }

            const url = API_URL + "updateexpirymonth/" + cold_id + '/' + month;

            const response = await fetch(url, options)
            e.target.value = month;
            const data = await response.json();
            Toast.fire({
                type: 'success',
                title: data.data,
                variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                customClass: { popup: 'adjust' }
            })

        }
        catch {

        }
    };


    const updateexpiryyear = async (e, cold_id) => {
        try {
            console.log(e.target.value);
            var year = e.target.value;

            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, /',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },

            }

            const url = API_URL + "updateexpiryyear/" + cold_id + '/' + year;

            const response = await fetch(url, options)

            const data = await response.json();
            e.target.value = year;
            Toast.fire({
                type: 'success',
                title: data.data,
                variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                customClass: { popup: 'adjust' }
            })


        }
        catch {

        }
    };


    const saveFile = () => {
        saveAs(
            "https://locatoralerts.com/control/react_api/public/coldcall/sample.csv",
            "sample.csv"
        );
    };
    const submitcustomer = async (data) => {


        const postdata = { ...data, creation_date: creationDate ? Moment(creationDate).format('YYYY-MM-DD') : '', expiry_date: expiryDate ? Moment(expiryDate).format('YYYY-MM-DD') : '', modified_date: modifiedDate ? Moment(modifiedDate).format('YYYY-MM-DD') : '', comment: data.comment.replace(/\r?\n/g, '<br/>'), gps: gpsvalue };


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

            const url = API_URL + "savesinglecustomer";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {
                setcustomerPopup(false);
                setListUpdated(true);
                clearregval();
            }

            Toast.fire({
                type: 'success',
                title: data.data,
                variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                customClass: { popup: 'adjust' }
            })

        }
        catch {

        }

    }

    const clearregval = async () => {
        reset2({
            cold_call_id: 0,
            company_name: '',
            phone: '',
            location: '',
            gps: 'false',
            contact_name: '',
            project_value: 0,
            new_qty: '',
            migrate_qty: '',
            trading_qty: '',
            sales_value: '',
            contact_email: '',
            lead_source: 'coldcall',
            service: '',
            expiry_date: '',
            sales_person: sale_person_id,
            creation_date: '',
            modified_date: '',
            status: 'new',
            month: '',
            year: '',
            comment: '',
            category: '',
            website: '',
            city: '',
            mobile: '',
        })
        setcreationDate(null);
        setmodifiedDate(null);
        setexpiryDate(null);
    }
    const updateqty = async (e, cold_id) => {
        try {
            var qty = e.target.value;
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },

            }

            const url = API_URL + "updatecoldcallqty/" + cold_id + '/' + qty;

            const response = await fetch(url, options);

            const data = await response.json();
            Toast.fire({
                type: 'success',
                title: data.data,
                variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                customClass: { popup: 'adjust' }
            })

        }
        catch {

        }
    };
    const updateGps = async (e, cold_id) => {
        try {

            var gps = e.target.checked;
            if (gps == true)
                gps = 'yes';
            else
                gps = 'no';
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },

            }

            const url = API_URL + "updatecoldcallgps/" + cold_id + '/' + gps;

            const response = await fetch(url, options)

            const data = await response.json();
            Toast.fire({
                type: 'success',
                title: data.data,
                variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                customClass: { popup: 'adjust' }
            })

        }
        catch {

        }
    };


    const saveNote = async (cold_call_id, text, date) => {

        try {


            const postdata = { cold_call_id: cold_call_id, note_text: text.replace(/\r?\n/g, '<br/>'), note_date: date ? Moment(date).format('YYYY-MM-DD HH:mm:ss') : '', note_assigned_to: '' };

            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(postdata),

            }

            const url = API_URL + "savecoldcallnotes";

            const response = await fetch(url, options)

            const data = await response.json();
            Toast.fire({
                type: 'success',
                title: data.data,
                variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                customClass: { popup: 'adjust' }
            })


        }
        catch {

        }



    };


    const changeRemDate = (selectedtype) => {

        if (selectedtype === 'tomorrow') {
            var date = new Date();
            date.setDate(date.getDate() + 1);
            setRemDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1w') {
            var date = new Date();
            date.setDate(date.getDate() + 7);
            setRemDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '2w') {
            var date = new Date();
            date.setDate(date.getDate() + 14);
            setRemDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1m') {
            var date = new Date();
            date.setDate(date.getDate() + 30);
            setRemDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '3m') {
            var date = new Date();
            date.setDate(date.getDate() + 60);
            setRemDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '6m') {
            var date = new Date();
            date.setDate(date.getDate() + 180);
            setRemDate(new Date(date).setHours(9, 0, 0));
        }

    };



    const columns = React.useMemo(
        () => [
            {
                Header: 'Company Name',
                accessor: 'company_name',
                className: 'namecolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span>
                            <span className="pointer" onClick={() => addCustomer(row.original.cold_call_id, loginUserName, sale_person_id)}>
                                {row.original.duplicate == 'yes' ? <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Duplicate Entry</Tooltip>}><Badge variant="danger" className='mr-2'> D</Badge></OverlayTrigger> : ''}
                                {row.original.company_name}</span>
                            <br />
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Contact name</Tooltip>}><span>{row.original.contact_name}</span></OverlayTrigger><br />
                            {(row.original.category == '' || row.original.category == ' ' || row.original.category == 'null') ? '' :
                                <><OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Category</Tooltip>}>
                                    <span style={{ 'color': 'blue' }}>
                                        [{row.original.category}]</span></OverlayTrigger>
                                    <br /></>}
                            <ButtonGroup size="sm" className='mt-2'>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Interested</Tooltip>}>
                                    <Button variant="success" onClick={() => {
                                        row.original.status = 'interested';
                                        changeStatus('interested', row.original.cold_call_id)
                                    }} className="smallbtn">

                                        {row.original.status === 'interested' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} IN
                                    </Button>
                                </OverlayTrigger>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Future Requirement</Tooltip>}>
                                    <Button variant="warning" onClick={() => {
                                        row.original.status = 'futurerequirements';
                                        changeStatus('futurerequirements', row.original.cold_call_id)
                                    }} className="smallbtn">
                                        {row.original.status === 'futurerequirements' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>}
                                        FR</Button>
                                </OverlayTrigger>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>No Response</Tooltip>}>
                                    <Button variant="danger" onClick={() => {
                                        row.original.status = 'noresponse';
                                        changeStatus('noresponse', row.original.cold_call_id)
                                    }} className="smallbtn">
                                        {row.original.status === 'noresponse' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>}
                                        NRS</Button>
                                </OverlayTrigger>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>No Requirement</Tooltip>}>
                                    <Button variant="secondary" onClick={() => {
                                        row.original.status = 'norequirements';
                                        changeStatus('norequirements', row.original.cold_call_id)
                                    }} className="smallbtn">
                                        {row.original.status === 'norequirements' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>}
                                        NR</Button>
                                </OverlayTrigger>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Invalid</Tooltip>}>
                                    <Button variant="light" onClick={() => {
                                        row.original.status = 'invalid';
                                        changeStatus('invalid', row.original.cold_call_id)
                                    }} className="smallbtn">
                                        {row.original.status === 'invalid' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>}
                                        IV</Button>
                                </OverlayTrigger>

                            </ButtonGroup>
                        </span>
                    );

                }
            },
            {
                Header: 'Phone',
                accessor: 'phone',
                className: 'Phonecolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (<span>{row.original.phone}</span>);

                }
            },

            {
                Header: 'Location',
                accessor: 'Location',
                className: 'Locationcolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span> {row.original.location}</span>
                    );
                }
            },

            {
                Header: ' Qty / Gps',
                accessor: 'new_qty',
                className: 'Qtycolumn',
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<div>  <Form.Control name='qty' defaultValue={row.original.new_qty} onChange={(e) => row.original.new_qty = e.target.value} onBlur={(e) => updateqty(e, row.original.cold_call_id)} /> <br /> <div className="checkbox d-inline checkbox-primary">   <Form.Control type="checkbox" name={row.original.gps_name} onClick={(e) => updateGps(e, row.original.cold_call_id)} defaultChecked={row.original.gps === 'yes'} id={row.original.gps_name} /><Form.Label htmlFor={row.original.gps_name} className="cr">Gps</Form.Label></div></div>);
                }

            },
            {
                Header: 'Expiry',
                accessor: 'expiry_month',
                className: 'Expirycolumn',
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<>
                        <Form.Control as="select" name="aa" onChange={(e) => { row.original.expiry_month = e.target.value; updateexpirymonth(e, row.original.cold_call_id); }} value={row.original.expiry_month} >
                            <option value="0">Month</option>
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


                        <Form.Control name="bb{row.original.cold_call_id}" as="select" onChange={(e) => { row.original.expiry_year = e.target.value; updateexpiryyear(e, row.original.cold_call_id); }} value={row.original.expiry_year}>
                            <option value="0">Year</option>
                            {
                                years.map((year, index) => {
                                    return <option key={`year${index}`} value={year}>{year}</option>
                                })
                            }
                        </Form.Control>

                    </>
                    );


                }
            },
            {
                Header: ' Note',
                accessor: ' Note',
                className: 'Notecolumn',
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<span>
                        <Form.Label style={{ fontSize: '12px' }} onClick={() => updateMonitoringNote(row.original.cold_call_id, row.original.company_name)}>First Contact On :{row.original.first_contact_on != null ? Moment(row.original.first_contact_on).format('DD-MM-YYYY HH:mm') : ' NC'} </Form.Label>

                        {row.original.dul_followup_date && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Note Date</Tooltip>}>
                            <span style={{ 'color': 'blue' }}>  [{Moment(row.original.dul_followup_date).format('DD-MM-YYYY HH:mm')}] </span>
                        </OverlayTrigger>}



                        {row.original.followup_count > 0 && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Follow Up Count</Tooltip>}>

                            <span style={{ 'float': 'right', 'margin-right': '20px', 'background-color': 'red', 'border-radius': '10px', 'padding': '3px', 'color': 'white' }}><b>{row.original.followup_count} </b></span>
                        </OverlayTrigger>}
                        <Form.Control as="textarea" rows="1" placeholder={row.original.note_text} onBlur={(e) => row.original.note_text = e.target.value} />

                        <ButtonGroup className='mt-2 float-left'>
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Tomorrow</Tooltip>}>
                                <Button variant="danger" onClick={() => {
                                    row.original.note_date_as_text = 'tomorrow';
                                    const date = new Date();
                                    date.setDate(date.getDate() + 1);
                                    row.original.note_date = new Date(date).setHours(9, 0, 0);
                                    row.original.dul_followup_date = row.original.note_date;

                                    changeRemDate('tomorrow');
                                }} className="smallbtn">
                                    {row.original.note_date_as_text === 'tomorrow' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} T
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Week</Tooltip>}>
                                <Button variant="warning" onClick={() => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + 7);
                                    row.original.note_date = new Date(date).setHours(9, 0, 0);
                                    row.original.dul_followup_date = row.original.note_date;

                                    row.original.note_date_as_text = 'oneweek';
                                    changeRemDate('1w');
                                }} className="smallbtn">
                                    {row.original.note_date_as_text === 'oneweek' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} 1 W
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Two Week</Tooltip>}>
                                <Button variant="info" onClick={() => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + 14);
                                    row.original.note_date = new Date(date).setHours(9, 0, 0);
                                    row.original.dul_followup_date = row.original.note_date;

                                    row.original.note_date_as_text = 'twoweek';
                                    changeRemDate('2w');
                                }} className="smallbtn">
                                    {row.original.note_date_as_text === 'twoweek' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} 2 W
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Month</Tooltip>}>
                                <Button variant="success" onClick={() => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + 30);
                                    row.original.note_date = new Date(date).setHours(9, 0, 0);
                                    row.original.dul_followup_date = row.original.note_date;

                                    row.original.note_date_as_text = 'onemonth';
                                    changeRemDate('1m');
                                }} className="smallbtn">
                                    {row.original.note_date_as_text === 'onemonth' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} 1 M
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Three Month</Tooltip>}>
                                <Button variant="primary" onClick={() => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + 90);
                                    row.original.note_date = new Date(date).setHours(9, 0, 0);
                                    row.original.dul_followup_date = row.original.note_date;

                                    row.original.note_date_as_text = 'threemonth';
                                    changeRemDate('3m');
                                }} className="smallbtn">
                                    {row.original.note_date_as_text === 'threemonth' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} 3 M
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Six Month</Tooltip>}>
                                <Button variant="secondary" onClick={() => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + 180);
                                    row.original.note_date = new Date(date).setHours(9, 0, 0);
                                    row.original.dul_followup_date = row.original.note_date;

                                    row.original.note_date_as_text = 'sixmonth';
                                    changeRemDate('6m');
                                }} className="smallbtn">
                                    {row.original.note_date_as_text === 'sixmonth' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} 6 M
                                </Button>
                            </OverlayTrigger>

                        </ButtonGroup>

                        <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Save</Tooltip>}>
                            <Button className='mt-2 float-right smallbtn' variant="success" onClick={() => saveNote(row.original.cold_call_id, row.original.note_text, row.original.note_date)}><i className="far fa-save m-0"></i> Save</Button>
                        </OverlayTrigger>
                    </span>);
                }
            },
            {
                Header: '',
                accessor: 'Delete',
                className: 'Deletecolumn',
                Cell: ({ row }) => {

                    return (
                        <>
                            {row.original.status != 'actiontaken' && row.original.status != 'new' ? <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Action Taken</Tooltip>}>
                                <button id={row.original.button_name} onClick={() => {
                                    if (window.confirm('actiontaken?'))
                                        movecoldcallto(row.original.cold_call_id, 'AT')
                                }} type="button" class="mt-0 float-right smallbtn btn btn-success">X</button>
                            </OverlayTrigger> : ''}</>);
                }
            },
        ],
        []
    )

    useEffect(() => {
        if (listupdated) {

            const sortBy = [{ id: sortType, desc: sortOrder === 'desc' ? true : false }];
            const searchText = searchKeyword;
            const filterarray = filterData;
            const pageIndex = currentPage;


            getcoldcallList({ pageIndex, searchText, sortBy, filterarray, SearchDate, remaindermode, searchMonth, Category, location, leadsource, searchYear });
        }
    }, [listupdated])



    const getcoldcallList = useCallback(async ({ pageIndex, searchtext, sortBy, filterarray, remSearchDate, remaindermode, searchMonth, Category, location, leadsource, searchYear }) => {

        setIsLoading(true);

        const cpage = pageIndex + 1;
        setCurrentPage(pageIndex);
        setSearchDate(remSearchDate);
        setremaindermode(remaindermode);
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

        localStorage.removeItem('logfillterarray');
        localStorage.setItem("logfillterarray", JSON.stringify(filterarray));

        const postdata = {
            keyword: searchtext, sortType: stype ? stype : sortType, sortOrder: sorder ? sorder : sortOrder, searchstatus: filterarray, remSearchDate: remSearchDate, searchMonth: searchMonth, Category: Category, location: location, leadsource: leadsource, searchYear: searchYear
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

            if (remaindermode === false)
                var url = API_URL + "getAllColdCall?page=" + cpage;
            else
                var url = API_URL + "coldcallReminders?page=" + cpage;

            const response = await fetch(url, options)

            const data = await response.json();

            setcoldcall(data.data.data);

            setTotalCount(data.data.total);

            setFromNumber(data.data.from);

            setToNumber(data.data.to);
            setnewcount(data.new);
            setfollowupcnt(data.followup_cnt);

            setupcomingcnt(data.upcomingcount);
            setduecnt(data.duecount);
            settodaycnt(data.todaycount);

            settotalcnt(data.total);

            setIsLoading(false);

            setListUpdated(false);
        }
        catch {

        }

    }, []);

    const [file, setFile] = useState()

    function handleChange(event) {
        setFile(event.target.files[0]);

    }
    function uploadFile(event) {
        event.preventDefault()
        setIsLoading(true);
        const url = API_URL + "uploadCsvfile/";
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('salesaccount', salesaccount);

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        axios.post(url, formData, config).then((response) => {
            // sweetAlertHandler({ title: 'Good job!', type: 'success', text: response.data })
            var string = response.data.successcnt + ' Customers added.\n' + response.data.Failed + ' Duplicate Customers \n';
            // if(response.data.Failedarray.length>0)
            // string+='Failed Customers List:\n'+response.data.Failedarray.join('\r\n');



            Toast.fire({
                type: 'success',
                title: string,
                variant: { value: 'success', label: 'Success', color: '#1de9b6' },
                customClass: { popup: 'adjust' }
            })
            setfileuploadPopup(false);
            setListUpdated(true);
        });

    }

    const Loader = () => (
        <div className="divLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );

    return (
        <React.Fragment>
            <Row>
                <Col className='p-0'>
                    {isLoading ? <Loader /> : null}
                    <Card>
                        <Card.Body style={{ padding: '15px' }}>
                            <DynamicTable columns={columns} data={coldcall} fromNumber={fromNumber} toNumber={toNumber} getcoldcallList={getcoldcallList} totalCount={totalCount} newcount={newcount} followupcnt={followupcnt} totalncnt={totalncnt} addfileupload={addfileupload} addCustomer={addCustomer} todaycnt={todaycnt} duecnt={duecnt} upcomingcnt={upcomingcnt} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>





            <Modal size="lg" show={CustomerPopup} onHide={() => setcustomerPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h3">{getValues2('cold_call_id') == 0 ? 'Add' : 'Edit'} New Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <Card style={{ margin: 0 }}>
                        <Card.Body>

                            <Form onSubmit={handleSubmit2(submitcustomer)}>
                                <Row>
                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Control required as="select" {...register2('sales_person')} >
                                                <option value="" disabled>Sales Person</option>
                                                <option value="3">Shams</option>
                                                <option value="1">Ajmal</option>
                                                <option value="11">Ananthu</option>
                                                <option value="12">Vishal</option>
                                                <option value="13">Sales 5</option>
                                                <option value="14">Sales 6</option>
                                                <option value="15">Slaes 7</option>
                                                <option value="16">Sales 8</option>

                                            </Form.Control>
                                        </Form.Group>

                                    </Col>
                                    <Col md="4">
                                        <DatePicker
                                            placeholderText='Creation Date'
                                            selected={creationDate}
                                            onChange={handlecreationDateChange}
                                            className="form-control"
                                            dateFormat="dd-MM-yyyy"
                                            isClearable={true}


                                        />
                                    </Col>

                                    <Col md="4">
                                        <DatePicker
                                            placeholderText='Modified Date'
                                            selected={modifiedDate}
                                            onChange={handlemodifiedDateChange}
                                            className="form-control"
                                            dateFormat="dd-MM-yyyy"
                                            isClearable={true}

                                        />
                                    </Col>





                                </Row>
                                <Row>
                                    <Col md="12">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Company Name' {...register2('company_name')} />

                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>

                                    <Col md="6">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Customer Name' {...register2('contact_name')} />

                                        </Form.Group>
                                    </Col>


                                    <Col md="6">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="email" class="form-control" placeholder='Contact Email' {...register2('contact_email')} />

                                        </Form.Group>
                                    </Col>


                                </Row>

                                <Row>
                                    <Col md="3">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Contact Phone' {...register2('phone')} />

                                        </Form.Group>
                                    </Col>

                                    <Col md="3">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Mobile' {...register2('mobile')} />

                                        </Form.Group>
                                    </Col>


                                    <Col md="6">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Location ' {...register2('location')} />

                                        </Form.Group>
                                    </Col>
                                    <Col md="6">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='City ' {...register2('city')} />

                                        </Form.Group>
                                    </Col>

                                    <Col md="6">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Control as="select" {...register2('lead_source')}>
                                                <option value="null" disabled>Lead Source</option>
                                                <option value="coldcall">cold call</option>
                                                <option value="doortodoor">Door to Door</option>
                                                <option value="referral">Referral</option>
                                                <option value="companylead">Company Lead</option>
                                                <option value="dealer">Dealer</option>
                                                <option value="others">Others</option>


                                            </Form.Control>
                                        </Form.Group>

                                    </Col>
                                </Row>

                                <Row>



                                    <Col md="3">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="float" class="form-control" placeholder='Sales Value' {...register2('sales_value')} />

                                        </Form.Group>
                                    </Col>

                                    <Col md="3">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="float" class="form-control" placeholder='New' {...register2('new_qty')} />

                                        </Form.Group>
                                    </Col>

                                    <Col md="3">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="float" class="form-control" placeholder='Migration' {...register2('migrate_qty')} />

                                        </Form.Group>
                                    </Col>
                                    <Col md="3">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="float" class="form-control" placeholder='Trading' {...register2('trading_qty')} />

                                        </Form.Group>
                                    </Col>
                                    <Col md="3">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="float" class="form-control" placeholder='Service' {...register2('service')} />

                                        </Form.Group>
                                    </Col>
                                    <Col md="3">

                                        <Form.Control name="month" as="select" {...register2('month')} >
                                            <option value='0'>Month</option>
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
                                    <Col md="3">
                                        <Form.Control name="year" as="select" {...register2('year')}>
                                            <option value='0'>Year</option>
                                            {
                                                years.map((year, index) => {
                                                    return <option value={year}>{year}</option>
                                                })
                                            }
                                        </Form.Control>

                                    </Col>


                                    <Col md="3">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Control as="select" {...register2('status')}>
                                                <option value="0" disabled>Status</option>
                                                <option value="new">New</option>
                                                <option value="interested">Interested</option>
                                                <option value="futurerequirements">Future Requirements</option>
                                                <option value="noresponse">No Response</option>
                                                <option value="norequirements">No Requirements</option>
                                                <option value="invalid">Invalid</option>
                                            </Form.Control>
                                        </Form.Group>

                                    </Col>

                                    <Col md="3">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Control as="select" {...register2('category')} >
                                                <option value="">category</option>
                                                <option value="Courier Services">Courier Services</option>

                                            </Form.Control>
                                        </Form.Group>

                                    </Col>

                                    <Col md="6">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Web site' {...register2('website')} />

                                        </Form.Group>


                                    </Col>

                                    <Col md="3">
                                        <div className="switch d-inline m-r-10">
                                            <Form.Control type="checkbox" id="checked-Gps" checked={gpsvalue === true} onChange={(e) => { fngps(e); }} />
                                            <Form.Label htmlFor="checked-Gps" className="cr"  {...register2('gps')} /> GPS
                                        </div>
                                    </Col>

                                </Row>
                                <Row><Col md="12">&nbsp;</Col> </Row>

                                <Row>




                                    <Col md="12">
                                        <Form.Control as="textarea" style={{ width: '98%' }} placeholder='Comment here' rows="1" {...register2('comment')} />
                                    </Col>
                                </Row>
                                {getValues2('cold_call_id') != 0 && <Button variant="primary" onClick={() => {
                                    if (window.confirm('Move to Sale plus?')) {
                                        movecoldcallto(getValues2('cold_call_id'), 'SP');
                                        setcustomerPopup(false);
                                    }
                                }} style={{ margin: '40px auto 10px', float: 'left', padding: '10px 30px' }} ><i class="fas fa-arrows-alt m-0"></i> Move To Sale Plus</Button>}

                                <Button variant="success" type='submit' style={{ margin: '40px auto 10px', float: 'right', padding: '10px 30px' }} >Submit</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
            <Modal size="lg" show={fileupload} onHide={() => setfileuploadPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h3"> File Uploading</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <Card style={{ margin: 0 }}>
                        <Card.Body>
                            <Form key="fileform" onSubmit={uploadFile}>
                                <Row>

                                    <Col md="3">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Control as="select" required onChange={(e) => { fnsalesaccount(e); }}>
                                                <option value="">-- Select-- </option>
                                                <option value="3">Shams</option>
                                                <option value="1">Ajmal</option>
                                                <option value="11">Ananthu</option>
                                                <option value="12">Vishal</option>
                                                <option value="13">Sales 5</option>
                                                <option value="14">Sales 6</option>
                                                <option value="15">Slaes 7</option>
                                                <option value="16">Sales 8</option>

                                            </Form.Control>
                                        </Form.Group>

                                    </Col>

                                    <Col md="5">
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={<Tooltip id={`tooltip-top`}>File upload</Tooltip>}
                                        >
                                            <input type="file" class="form-control" onChange={handleChange} accept=".csv" required />
                                        </OverlayTrigger>
                                    </Col>
                                    <Col md="2">
                                        <Button variant="success" type='submit'>Upload</Button>
                                    </Col>
                                    <Col md="1">
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={<Tooltip id={`tooltip-top`}>Download Sample Csv</Tooltip>}
                                        >
                                            <Button variant="info" onClick={saveFile}> <i class="fas fa-download" style={{ margin: '0px', fontWeight: 'bold' }}></i> </Button>
                                        </OverlayTrigger>


                                    </Col>

                                </Row>
                            </Form>


                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>


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
                                                            <img className="media-object img-radius comment-img" src={note.note_by === 'admin' ? adminprofile : note.note_by === 'Shams' ? shamsprofile : note.note_by === 'Shamnad' ? shamnadprofile : note.note_by === 'Rasick' ? rasickprofile : note.note_by === 'Ajmal' ? ajmalprofile : note.note_by === 'Celine' ? celineprofile : note.note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading text-muted">{note.note_by}

                                                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:MM')}</span>
                                                                <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                                                    <i class="fas fa-pencil-alt"></i>
                                                                </span>
                                                                {getDifferenceInDays(note.note_date) ?
                                                                    <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'red' }}>{note.note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span> : <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'black' }}>{note.note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span>}

                                                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Assigned to</Tooltip>}><span style={{ float: 'right', fontWeight: 'bold', color: 'darkmagenta' }}><i className="fas fa-arrow-circle-right" style={{ marginRight: '10px' }}></i>
                                                                    {note.note_assigned_to}</span>
                                                                </OverlayTrigger>

                                                            </h6>
                                                            <p style={{ color: 'black', margin: 0 }}>{ReactHtmlParser(note.note_text)} </p>
                                                            {note.note_rectified === 'true' && <p style={{ color: 'blue', margin: 0 }}>[Rectified on {Moment(note.rectified_date).format('DD-MM-YYYY HH:mm')}  -  {ReactHtmlParser(note.rectified_text)}]</p>}
                                                            {note.remove_reminder_text && <p style={{ fontStyle: 'italic', margin: 0 }}>[{ReactHtmlParser(note.remove_reminder_text)}] </p>}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </ScrollToBottom>}

                                    <Form key="monitoringform" onSubmit={handleSubmit1(saveMonitoringNote)}>
                                        <Row>
                                            <Col md="6">

                                                <ButtonGroup className='mt-2 float-left' style={{ 'fontSize': '10px' }}>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Tomorrow</Tooltip>}>

                                                        <Button variant="danger" style={{ 'fontSize': '10px' }} className="smallbtn" onClick={() => changeMonitoringDate('tomorrow')}>
                                                            T</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Week</Tooltip>}>

                                                        <Button variant="warning" style={{ 'fontSize': '10px', 'line-height': 0.5 }} className="smallbtn" onClick={() => changeMonitoringDate('1w')}> 1 W
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Two Week</Tooltip>}>

                                                        <Button variant="info" style={{ 'fontSize': '10px', 'line-height': 0.5 }} className="smallbtn" onClick={() => changeMonitoringDate('2w')}>2 W
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Month</Tooltip>}>

                                                        <Button variant="success" style={{ 'fontSize': '10px', 'line-height': 0.5 }} className="smallbtn" onClick={() => changeMonitoringDate('1m')}> 1 M
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Three Month</Tooltip>}>

                                                        <Button variant="primary" style={{ 'fontSize': '10px', 'line-height': 0.5 }} className="smallbtn" onClick={() => changeMonitoringDate('3m')}>3 M
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Six Month</Tooltip>}>

                                                        <Button variant="info" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeMonitoringDate('6m')}>6 M  </Button>
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
                                            {/*<Col md="3">
                                                <Form.Group controlId="exampleForm.ControlSelect2">
                                                    <Form.Control as="select" {...register1('note_assigned_to')}>
                                                        <option value="Shamnad">{loginUserId==='3'?'Self':'Shamnad'}</option>
                                                        <option value="Celine">{loginUserId==='7'?'Self':'Celine'}</option>
                                                        <option value="Shams">{loginUserId==='5'?'Self':'Shams'}</option>
                                                        <option value="Rasick">{loginUserId==='2'?'Self':'Rasick'}</option>
                                                        <option value="Ajmal">{loginUserId==='6'?'Self':'Ajmal'}</option>
                                                        <option value="Shone">{loginUserId==='8'?'Self':'Shone'}</option>
                                                        <option value="Vishal">{loginUserId === '9' ? 'Self' : 'Vishal'}</option>
                                                        <option value="Nishad">{loginUserId === '11' ? 'Self' : 'Nishad'}</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>*/}

                                        </Row>


                                        <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...register1('note_text')} />

                                        <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Comment</Button>
                                    </Form>
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



        </React.Fragment>
    );
}

export default App