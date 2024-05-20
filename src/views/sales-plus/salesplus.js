import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Row, Col, Card, Pagination, Table, Modal, Field, Button, OverlayTrigger, Tooltip, Form, ButtonGroup, Tabs, Tab, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import './saleplus.css';
import Salesplusform from './Salesplusform';
import Salesplusquotation from './Salesplusquotation';
import { API_URL } from "../../config/constant";
import ReactHtmlParser from 'react-html-parser';
// import adminprofile from "../../assets/images/small-logo.png";
import ScrollToBottom from 'react-scroll-to-bottom';
import Datetime from 'react-datetime';
import Editor from "nib-core";
import Dropdown from 'react-bootstrap/Dropdown';

import adminprofile from "../../assets/images/small-logo.png";
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
        icon: 'success',
        text: alert.text,
        type: alert.type
    });
};



function DynamicTable({ columns, data, fromNumber, toNumber, totalCount, getSalePlusList, addsalesplus, todaycnt, duecnt, upcomingcnt, updateList, New, Proposed, Won, Lost, Hold, Completed, Duplicate, Demo, MigrationCheck, newDeviceCount, migrateDeviceCount }) {

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
            initialState: { pageIndex: 0, sortBy: [{ id: 'date', desc: true }] },
            manualPagination: true,
            pageCount: Math.ceil(totalCount / 40),
        },
        useSortBy,
        usePagination

    )
    const loginUserId = localStorage.getItem('loginUserId');
    const [searchCompanyName, setCompanyName] = useState(null);
    const [searchContactName, setContactName] = useState(null);
    const [searchSource, setSource] = useState(null);
    const [searchSalesPerson, setSearchSalesPerson] = useState(0);
    const [searchFromDate, setFromDate] = useState(null);
    const [searchToDate, setToDate] = useState(null);
    const [remSearchDate, setRemSearchDate] = useState('today');
    const [remaindermode, setremaindermode] = useState(false);
    const authToken = localStorage.getItem('authToken');
    const [isFilter, setisFilter] = useState(false);
    const formRef = useRef();
    const [searchoption, setsearchoption] = useState(null);
    const [status, searchstatus] = useState(null);
    const [salespersonList, setsalepersonList] = useState([]);
    const [searchFromAllDeals, setsearchFromAllDeals] = useState(false);
    const [refreshList, setRefreshList] = useState(false);
    

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

    const fnremainder = async (e) => {
        var checked = e.target.checked;
        if (checked) {
            setremaindermode(true);
        }
        else {
            setremaindermode(false);
        }

        setFromDate(null);
        setToDate(null);

        if (pageIndex > 0) {
            gotoPage(0);
        } else
            setRefreshList(refreshList === true ? false : true);
    }

    const handlefromDateChange = (date) => {
        setFromDate(new Date(date));
    };

    const handletoDateChange = (date) => {
        setToDate(new Date(date));
    };

    const search = () => {

        if (pageIndex > 0) {
            gotoPage(0);
        }
        setsearchoption(new Date());
    };

    const clear1 = () => {
        setCompanyName(null);
        setSource(null);
        formRef.current.reset();
        searchstatus(null);
        setsearchFromAllDeals(false);
        setsearchoption(new Date());
        setSearchSalesPerson(0);

        if (pageIndex > 0) {
            gotoPage(0);
        }
    };

    const calladdsales = () => {
        addsalesplus();
    }

    const filterSearch = () => {
        setisFilter(false);
        if (pageIndex > 0) {
            gotoPage(0);
        }
        else
            setRefreshList(refreshList === true ? false : true);
    }

    const onclearfilter = () => {
        setFromDate(null);
        setToDate(null);
        searchstatus(null);
    };

    const onChangeSearchtext = (e) => {
        var data = e.target.value;
        if (data === '')
            data = null;
        setCompanyName(data);
    };

    const handleKeypress = e => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            search();
        }
    };

    const clearPopupFilter = () => {
        setisFilter(false);
        setFromDate(null);
        setToDate(null);
        if (pageIndex > 0) {
            gotoPage(0);
        } else
            setRefreshList(refreshList === true ? false : true);
    }

    useEffect(() => {

        if (isFilter) {
            setisFilter(false)
        }

        getSalePlusList({ pageIndex, sortBy, status, searchCompanyName, searchSource, searchFromDate, searchToDate, remSearchDate, remaindermode, searchFromAllDeals, searchSalesPerson });

        getSalesPersonsList();

    }, [getSalePlusList, sortBy, pageIndex, status, searchoption, remSearchDate, refreshList, updateList, searchSalesPerson])
    return (
        <>

            <Form ref={formRef}>
                <Form.Row>
                    <Col xs={2}>

                        <Form.Group>
                            <div className="switch d-inline m-r-10">
                                <Form.Control type="checkbox" id="checked-offline" onChange={(e) => { fnremainder(e); }} />
                                <Form.Label htmlFor="checked-offline" className="cr" />
                            </div>
                            <Form.Label>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Due/Today</Tooltip>}
                                >
                                    <span>Reminders {duecnt > 0 || todaycnt > 0 ? '[' + duecnt + '/' + todaycnt + ']' : ''}</span>
                                </OverlayTrigger>
                            </Form.Label>
                        </Form.Group>
                    </Col>

                    {remaindermode &&
                        <Col xs={3}>
                            <ButtonGroup>
                                <><Button variant={remSearchDate === 'today' ? 'warning smallbtn' : 'outline-warning smallbtn'} style={{ padding: '9px 9px' }} onClick={() => setRemSearchDate('today')}>
                                    <Badge variant="danger">{todaycnt}</Badge>&nbsp;Today</Button>
                                    <Button variant={remSearchDate === 'due' ? 'warning smallbtn' : 'outline-warning smallbtn'} style={{ padding: '9px 9px' }} onClick={() => setRemSearchDate('due')}   ><Badge variant="danger" >{duecnt}</Badge>&nbsp;Due</Button>
                                    <Button variant={remSearchDate === 'upcoming' ? 'warning smallbtn' : 'outline-warning smallbtn'} style={{ padding: '9px 9px' }} onClick={() => setRemSearchDate('upcoming')} >

                                        <Badge variant="danger"  >{upcomingcnt}
                                        </Badge>&nbsp;Upcoming
                                    </Button></>

                            </ButtonGroup>
                        </Col>

                    }

                    <Col xs={remaindermode ? '1' : '2'} >
                        {(loginUserId == 1 || loginUserId == 14) && 
                            <Form.Control as="select" defaultValue={searchSalesPerson} onChange={(e) => { setSearchSalesPerson(e.target.value); }}>
                                <option value="None">Sales person</option>
                                {salespersonList &&
                                salespersonList.map(person => (
                                <option selected={searchSalesPerson == person.user_id} key={person.user_id} value={person.user_id}>{person.user_name}</option>
                                ))}
                            </Form.Control>
                        }
                    </Col>

                    <Col xs={1} >
                        <Form.Control as="select" defaultValue={searchSource} onChange={(e) => { setSource(e.target.value); }} >
                            <option value="null">Source</option>
                            <option value="cold call">Cold Call</option>
                            <option value="referal">Referal</option>
                            <option value="company lead">Company Lead</option>
                            <option value="dealer">Dealer</option>
                            <option value="door to door">Door to Door</option>
                            <option value="MECAF2019">MECAF 2019</option>
                        </Form.Control>
                    </Col>

                    <Col xs={2}>
                        <Form.Control placeholder="Search..." onChange={onChangeSearchtext} onKeyPress={handleKeypress} />
                    </Col>
                    <Col xs={remaindermode ? '3' : '4'}>

                        <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Show in all list</Tooltip>}>
                            <div className="checkbox d-inline checkbox-primary">
                                <Form.Control type="checkbox" id="chksr" onClick={(e) => setsearchFromAllDeals(searchFromAllDeals == false ? true : false)} />
                                <Form.Label htmlFor="chksr" className="cr"></Form.Label>
                            </div>
                        </OverlayTrigger>

                        <button
                            className="text-capitalize btn btn-success"
                            type="button"
                            onClick={search}  >
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
                            onClick={clear1}  >
                            <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
                        </button>
                    

                        {!remaindermode && 
                            <button
                                className="text-capitalize btn btn-primary mx-0"
                                type="button" onClick={() => calladdsales()}>   <i className="feather icon-plus mr-1 font-bold"></i>New

                            </button>
                        }
                    </Col>
                </Form.Row>
            </Form>

            <Form className="top-section">
                <Form.Row>

                    <Col xs={7} className="text-dark">
                        <span><b>
                            New : {New} &nbsp;&nbsp;&nbsp;
                            Proposed : {Proposed} &nbsp;&nbsp;&nbsp;
                            Won : {Won} &nbsp;&nbsp;&nbsp;
                            Demo : {Demo} &nbsp;&nbsp;&nbsp;
                            {status === 'Lost' && 'Lost : ' + Lost} &nbsp;&nbsp;&nbsp;
                            {status === 'Hold' && 'Hold : ' + Hold} &nbsp;&nbsp;&nbsp;
                            {status === 'Completed' && 'Completed : ' + Completed} &nbsp;&nbsp;&nbsp;
                            {status === 'Duplicate' && 'Duplicate : ' + Duplicate} &nbsp;&nbsp;&nbsp;
                            {status === 'MigrationCheck' && 'Check for Mig. :' + MigrationCheck} &nbsp;&nbsp;&nbsp;
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Current month new device count</Tooltip>}><span>New Devices [{newDeviceCount}] &nbsp;&nbsp;&nbsp;</span></OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Current month migrated device count</Tooltip>}><span>Migrated Devices [{migrateDeviceCount}]</span></OverlayTrigger>
                        </b></span>
                    </Col>
                    <Col xs={5} className="text-dark text-right">

                        {(status != null || searchFromDate != null) && <span>Filters used :- </span>}
                        {(status != null) && <span>&nbsp;&nbsp;&nbsp; Status : <b>{status}</b></span>}
                        {(searchFromDate != null) && <span>&nbsp;&nbsp;&nbsp; From Date : <b>{searchFromDate ? Moment(searchFromDate).format('DD-MM-YYYY') : ''}</b></span>}
                        {(searchToDate != null) && <span>&nbsp;&nbsp;&nbsp; To Date : <b>{searchToDate ? Moment(searchToDate).format('DD-MM-YYYY') : ''}</b></span>}
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
                        <Col md={6} xl={3}>
                            <Form.Control as="select" onChange={(e) => { var data = e.target.value; searchstatus(data); }} value={status}  >
                                <option value="null">Status</option>
                                <option value="New">New</option>
                                <option value="Proposed">Proposed</option>
                                <option value="Won">Won</option>
                                <option value="Lost">Lost</option>
                                <option value="Hold">Hold</option>
                                <option value="Completed">Completed</option>
                                <option value="Duplicate">Duplicate</option>
                                <option value="Demo">Demo</option>
                                <option value="MigrationCheck">Check for Migration</option>
                            </Form.Control>
                        </Col>
                        <Col xs={3}>
                            <DatePicker
                                placeholderText='Select date'
                                className="form-control"
                                dateFormat="dd-MM-yyyy"
                                selected={searchFromDate}
                                onChange={handlefromDateChange}
                            />
                        </Col>
                        <Col xs={3}>

                            <DatePicker
                                placeholderText='Select date'
                                className="form-control"
                                dateFormat="dd-MM-yyyy"
                                selected={searchToDate}
                                onChange={handletoDateChange}
                            />
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

function App() {

    const authToken = localStorage.getItem('authToken');
    const [saleplus, setsaleplus] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortType, setSortType] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [updateList, setupdateList] = useState(false);
    const [logPopup, setlogPopup] = useState(null);
    const [saleplusPopup, setsaleplusPopup] = useState(null);
    const [notesPopup, setNotesPopup] = useState(false);
    const [logdata, getlogdata] = useState([]);
    const [notedata, getnotedata] = useState([]);
    const loginUserName = localStorage.getItem('loginUserName');
    const [customername, setcustomername] = useState(null);
    const [SearchDate, setSearchDate] = useState('');
    const [remaindermode, setremaindermode] = useState(false);
    const [reminderDate, setReminderDate] = useState('');
    const [notesArray, setNotesArray] = useState([]);
    const [salesArray, setsalesArray] = useState([]);
    const loginUserId = localStorage.getItem('loginUserId');
    const [monitoringblockedDate, setMonitoringblockedDate] = useState();
    const [singlesalesplusdata_id, setsalesplusdata] = useState(0);
    const [emailPopup, setemailPopup] = useState(null);
    const [quoatePopup, setquoatePopup] = useState(null);
    const [chkadvancePopup, setchkadvancePopup] = useState(null);
    const [emailtext_content, setContent] = useState(null);
    const today = new Date().toISOString();

    const [todaycnt, settodaycnt] = useState(0);
    const [duecnt, setduecnt] = useState(0);
    const [upcomingcnt, setupcomingcnt] = useState(0);

    const [New, setNewcnt] = useState(0);
    const [Proposed, setProposedcnt] = useState(0);
    const [Won, setWoncnt] = useState(0);
    const [Lost, setLostcnt] = useState(0);
    const [Hold, setHoldcnt] = useState(0);
    const [Completed, setCompletedcnt] = useState(0);
    const [Duplicate, setDuplicatecnt] = useState(0);
    const [MigrationCheck, setMigrationCheckcnt] = useState(0);
    const [newDeviceCount, setnewDeviceCount] = useState(0);
    const [migrateDeviceCount, setmigrateDeviceCount] = useState(0);
    const [Demo, setDemo] = useState(0);
    const [statuEditPopup, setStatusEditPopup] = useState(false);

    const updateMNote = (reminderdata) => {
        showNotePopup(reminderdata);
    }

    const updatesaleplus = () => {
        setupdateList(updateList ? false : true);
    }

    const closepopup = () => {
        setsaleplusPopup(false);
    }

    const {
        register: register1,
        handleSubmit: handleSubmit1,
        reset: reset1, getValues: getValues1
    } = useForm({
        defaultValues: {
            sales_plus_date: today,
            sales_plus_source: null,
            sales_plus_region: null,
            sales_plus_status: null,
            sales_plus_customer_name: null,
            sales_plus_company_name: null,
            sales_plus_phone: null,
            sales_plus_email: null,
            sales_plus_designation: null,
            sales_plus_quantity_new: null,
            sales_plus_quantity_migrate: null,
            sales_plus_quantity_trading: null,
            sales_plus_price: null,
            sales_plus_installation: today,
            sales_plus_renewel: today,
            sales_plus_supplier: null,
            sales_plus_id: null,
            sales_plus_comment: null,
            sales_plus_address: null,
            sales_plus_project_value: null,
            sales_plus_person: null,
            sales_plus_type: "new",
            actiontype: 'Add',
        }
    });

    const addsalesplus = () => {
        setsalesplusdata(0);
        reset1({
            sales_plus_date: today,
            sales_plus_installation: today,
            sales_plus_renewel: today,
            sales_plus_status: 'New',
            sales_plus_type: "new",
            actiontype: 'Add',
        });
        setsaleplusPopup(true);
    }

    const {
        register: registerReminder,
        handleSubmit: handleSubmitNotes,
        reset: resetReminder
    } = useForm({
        defaultValues: {
            sales_note_text: '',
            sales_note_date: '',
            salesplus_note_id: 0,
            sales_note_sales_id: 0,
            sales_note_assigned_to: loginUserName,
            sales_note_type: 'noreminder'
        }
    });

    const fillformtoedit = (note) => {
        resetReminder({
            sales_note_text: note.sales_note_text.replaceAll('<br/>', '\n'),
            salesplus_note_id: note.salesplus_note_id,
            sales_note_type: note.sales_note_type,
            salesplus_note_id: note.salesplus_note_id,
            sales_note_sales_id: note.sales_note_sales_id,
        });
        if (note.sales_note_date && note.sales_note_date !== '0000-00-00 00:00:00') {
            setReminderDate(new Date(note.sales_note_date));
        } else {
            setReminderDate();
        }
    }

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        reset: reset2,
        getValues: getValues3
    } = useForm({
        defaultValues: {

            sales_plus_id: null,
            sales_plus_template_mail_text: null,
            sales_plus_template_mail_content: null,
            sales_plus_template_mail_subject: null,
            sales_plus_email: null,
            sales_plus_template_mail_type: null,
            sales_plus_person: null
        }
    });

    const content = JSON.parse(getValues3('sales_plus_template_mail_text'));

    const saveemailTemplate = async (emailtemplate) => {


        var object_as_string = JSON.stringify(emailtext_content);

        const postdata = { sales_plus_id: emailtemplate.sales_plus_id, sales_plus_template_mail_text: object_as_string, sales_plus_template_mail_content: emailtemplate.sales_plus_template_mail_content, sales_plus_template_mail_subject: emailtemplate.sales_plus_template_mail_subject, sales_plus_email: emailtemplate.sales_plus_email, sales_plus_template_mail_type: emailtemplate.sales_plus_template_mail_type, sales_plus_person: emailtemplate.sales_plus_person };

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


            var url = API_URL + "sendsalesemailtemplate";
            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'Success') {

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully Updated !' })

            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating !' })
            }
            setemailPopup(false);

        }
        catch {

        }
    }

    const showNotePopup = async (saleplus) => {

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

            const url = API_URL + "getsalesplusNotes/" + saleplus.sales_plus_id;

            const response = await fetch(url, options)

            const data = await response.json();

            setNotesArray(data.data);

            setNotesPopup(true);

            setIsLoading(false);
        }
        catch {

        }

        setReminderDate('');

        resetReminder({
            sales_note_text: '',
            salesplus_note_id: 0,
            sales_note_date: '',
            sales_note_sales_id: saleplus.sales_plus_id,
            sales_note_assigned_to: loginUserName
        });

    }

    const changeReminderDate = (date) => {
        const selectedHour = new Date(date).getHours();
        if (selectedHour === 0) {
            setReminderDate(new Date(date).setHours(9, 0, 0));
        } else {
            setReminderDate(date);
        }
    };

    const getlogs = async (id, customername) => {
        const options = {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Xtoken': authToken
            }
        }

        const url = API_URL + "getDealLogs/" + id;

        const response = await fetch(url, options)

        const logdata = await response.json();

        getlogdata(logdata.data);
        setcustomername(customername);
        setlogPopup(true);
    }

    const getquotationdata = async (id) => {
        setquoatePopup(true);
        setsalesplusdata(id);
    }

    const editsaleplus = (id) => {
        setsalesplusdata(id);
        getsaleplusdata(id);
    }

    const showEditStatusPopup = (data) => {
        setsalesplusdata(data.sales_plus_id);
        reset1(data);
        setStatusEditPopup(true);
    }

    const editsaleplusstatus = async (saleplus) => {

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

            var url = API_URL + "editsalesplus/" + singlesalesplusdata_id;

            const response = await fetch(url, options)

            const data1 = await response.json();

            if (data1.status === 'success') {

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: data1.data });
                setupdateList(updateList ? false : true);
                setStatusEditPopup(false);
            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating !' })
            }
        }
        catch {

        }
    }

    const deletesaleplus = async (id) => {

        const options = {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Xtoken': authToken
            }
        };


        var url = API_URL + "deletesalesplus/" + id;
        const response = await fetch(url, options)

        const data = await response.json();

        if (data.status === 'success') {
            sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully Deleted!' })
            setupdateList(updateList ? false : true);
        } else {
            sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in deleting!' })
        }

    }

    const changeRemDate = (selectedtype) => {

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
        }
    };

    const submitNotes = async (data) => {

        const postdata = { ...data, sales_note_text: data.sales_note_text.replace(/\r?\n/g, '<br/>'), sales_note_date: reminderDate ? Moment(reminderDate).format('YYYY-MM-DD HH:mm:ss') : '' };

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

            const url = API_URL + "savesaleplusNote";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated Notes!' });
                setNotesPopup(false);
                setupdateList(updateList ? false : true);
            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating Notes!' })
            }
        }
        catch {

        }
    }

    const emailtemplate = async (id) => {


        const options = {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Xtoken': authToken
            }
        }

        const url = API_URL + "singlesalesplus/" + id;

        const response = await fetch(url, options)

        const salesplusdata = await response.json();
        var obj = JSON.parse(salesplusdata.data[0].sales_plus_template_mail_text);
        setContent(obj);
        reset2({ ...getValues3(), sales_plus_id: id, sales_plus_person: salesplusdata.data[0].sales_plus_person, sales_plus_template_mail_text: salesplusdata.data[0].sales_plus_template_mail_text, sales_plus_template_mail_content: salesplusdata.data[0].sales_plus_template_mail_content, sales_plus_template_mail_subject: salesplusdata.data[0].sales_plus_template_mail_subject, sales_plus_email: salesplusdata.data[0].sales_plus_email, sales_plus_template_mail_type: salesplusdata.data[0].sales_plus_template_mail_type });

        setemailPopup(true);
    }

    const getsaleplusdata = async (id) => {
        const options = {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Xtoken': authToken
            }
        }

        const url = API_URL + "singlesalesplus/" + id;

        const response = await fetch(url, options)

        const salesplusdata = await response.json();

        reset1(salesplusdata.data);
        reset1({
            ...getValues1(),
            actiontype: 'Edit',
        })
        setsaleplusPopup(true);

    }

    const columns = React.useMemo(
        () => [

            {
                Header: 'Created Date',
                accessor: 'date',
                className: 'datecolumn',
                Cell: ({ row }) => {

                    return (
                        <>
                            <span className="cursor" onClick={() => editsaleplus(row.original.sales_plus_id)}>{Moment(row.original.sales_plus_date).format('DD-MM-yyyy hh:mm a') !== 'Invalid date' ? Moment(row.original.sales_plus_date).format('DD-MM-yyyy') : ""}
                            </span>

                            <br />
                            {Moment(row.original.sales_plus_reminder).isValid() &&
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Reminder Date</Tooltip>}><span className={Moment(row.original.sales_plus_reminder) < Moment(new Date()) ? 'text-danger' : Moment(row.original.sales_plus_reminder) === Moment(new Date()) ? 'text-primary' : 'text-dark'}>[{Moment(row.original.sales_plus_reminder).format('DD-MM-yyyy')}]</span>
                                </OverlayTrigger>}

                            {(loginUserId == 1 || loginUserId == 14) && <span>&nbsp;({row.original.user_name})</span>}

                        </>

                    );

                }
            },

            {
                Header: 'Company Name',
                accessor: 'sales_plus_company_name',
                className: 'companycolumn',
                Cell: ({ row }) => {

                    return (
                        <span className="cursor" onClick={() => editsaleplus(row.original.sales_plus_id)}>{row.original.sales_plus_company_name} ({row.original.sales_plus_customer_name}) <br /> {row.original.sales_plus_phone} </span>

                    );

                }
            },

            {
                Header: ' Project Value  (Qty)',
                accessor: 'sales_plus_project_value',
                className: 'projectcolumn',
                Cell: ({ row }) => {

                    return (
                        <span className="cursor" onClick={() => editsaleplus(row.original.sales_plus_id)}>{row.original.sales_plus_project_value} &nbsp;
                            (
                            {row.original.sales_plus_quantity_new + row.original.sales_plus_quantity_migrate + row.original.sales_plus_quantity_trading + row.original.sales_plus_quantity_service} )
                        </span>
                    );

                }
            },
            {
                Header: ' Lead Source',
                accessor: 'sales_plus_source',
                className: 'leadcolumn',
                Cell: ({ row }) => {

                    return (
                        <span className="cursor" onClick={() => editsaleplus(row.original.sales_plus_id)}>{row.original.sales_plus_source}</span>
                    );

                }
            },
            {
                Header: ' Notes',
                accessor: 'sales_note_text',
                className: 'notescolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span className="cursor" onClick={() => showNotePopup(row.original)}> {row.original.sales_note_text}</span>

                    );

                }
            },

            {
                Header: ' Status',
                accessor: 'sales_plus_status',
                className: 'statuscolumn',
                Cell: ({ row }) => {

                    return (<>

                        <span style={{ 'color': 'orange' }} className="cursor" onClick={() => showEditStatusPopup(row.original)}>{row.original.sales_plus_status}</span></>
                    );

                }
            },
            {
                Header: ' ',
                accessor: 'sales_plus_id',
                className: 'actions',
                Cell: ({ row }) => {

                    return (
                        <span >

                            <ButtonGroup>


                                <Dropdown align="end" id="settings-dropdown">
                                    <Dropdown.Toggle variant="info" id="dropdown-basic" style={{ padding: '2px 8px' }}><i className="icon feather icon-settings"> </i>

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end">

                                        <Dropdown.Item onClick={() => getlogs(row.original.sales_plus_id, row.original.sales_plus_customer_name)}>View Dual Logs</Dropdown.Item>

                                        <Dropdown.Item onClick={() => emailtemplate(row.original.sales_plus_id)}>Email Templates</Dropdown.Item>

                                        <Dropdown.Item onClick={() => { if (window.confirm('Delete the item?')) { deletesaleplus(row.original.sales_plus_id) } }}>Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Create Quotation </Tooltip>}>

                                    <Button onClick={() => getquotationdata(row.original.sales_plus_id)} className='text-capitalize actionbuttons' variant="primary" style={{ backgroundColor: '#c22761', borderColor: '#c22761', padding: '2px 5px', marginLeft: '5px', borderRadius: '0.25rem' }} ><i className="fa fa-file" style={{ fontWeight: 'normal', margin: 0 }}></i></Button>
                                </OverlayTrigger>

                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Note here!!</Tooltip>}>
                                    <Button onClick={() => { showNotePopup(row.original); }} className='text-capitalize' variant="success" style={{ padding: '2px 5px', marginLeft: '5px', borderRadius: '0.25rem' }}><i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i></Button>
                                </OverlayTrigger>
                            </ButtonGroup>

                        </span>
                    );

                }
            },


        ],
        []
    )

    const getSalePlusList = useCallback(async ({ pageIndex, sortBy, status, searchCompanyName, searchSource, searchFromDate, searchToDate, remSearchDate, remaindermode, searchFromAllDeals, searchSalesPerson }) => {

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

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }

            }

            const selectedsorttype = stype ? stype : sortType;
            const selectedsortorder = sorder ? sorder : sortOrder;

            const fdate = searchFromDate ? Moment(searchFromDate).format('YYYY-MM-DD') : null;
            const tdate = searchToDate ? Moment(searchToDate).format('YYYY-MM-DD') : null;

            if (remaindermode === false)
                var url = `${API_URL}salespluslist/${selectedsorttype}/${selectedsortorder}/${searchCompanyName}/${status}/${fdate}/${tdate}/${searchSource}/${searchFromAllDeals}/${searchSalesPerson}?page=${cpage}`;

            else
                var url = `${API_URL}salesplusReminders/${selectedsorttype}/${selectedsortorder}/${searchCompanyName}/${status}/${fdate}/${tdate}/${searchSource}/${remSearchDate}/${searchFromAllDeals}/${searchSalesPerson}?page=${cpage}`

            const response = await fetch(url, options)

            const data = await response.json();

            

                setsaleplus(data.data.data);

                setTotalCount(data.data.total);

                setFromNumber(data.data.from);

                setToNumber(data.data.to);
            

            setIsLoading(false);

            setupcomingcnt(data.upcomingcount);
            setduecnt(data.duecount);
            settodaycnt(data.todaycount);

            setNewcnt(data.new);
            setProposedcnt(data.Proposed);
            setWoncnt(data.Won);
            setLostcnt(data.Lost);
            setHoldcnt(data.Hold);
            setCompletedcnt(data.Completed);
            setDuplicatecnt(data.Duplicate);
            setMigrationCheckcnt(data.MigrationCheck);
            setDemo(data.Demo);
            setnewDeviceCount(data.newDeviceCount);
            setmigrateDeviceCount(data.migrateDeviceCount);
            setsalesArray(data.allsearchresult);
            if (searchFromAllDeals == true) {
                setchkadvancePopup(true);
            }


        }
        catch {

        }

    }, []);



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

                            <DynamicTable columns={columns} data={saleplus} fromNumber={fromNumber} toNumber={toNumber} totalCount={totalCount} getSalePlusList={getSalePlusList} addsalesplus={addsalesplus} todaycnt={todaycnt} duecnt={duecnt} upcomingcnt={upcomingcnt} updateList={updateList} New={New} Proposed={Proposed} Won={Won} Lost={Lost} Hold={Hold} Completed={Completed} Duplicate={Duplicate} MigrationCheck={MigrationCheck} Demo={Demo} newDeviceCount={newDeviceCount} migrateDeviceCount={migrateDeviceCount} />

                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            <Modal size="xl" show={quoatePopup} onHide={() => setquoatePopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Quotation</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <Card style={{ margin: 0 }}>
                        <Card.Body>
                            <Row>
                                <Col md={12}>
                                    <Salesplusquotation salesId={singlesalesplusdata_id} data={getValues1()} />


                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>


            <Modal size="xl" show={saleplusPopup} onHide={() => setsaleplusPopup(false)} backdrop="static">

                <Salesplusform salesId={singlesalesplusdata_id} data={getValues1()} updatesaleplus={updatesaleplus} closepopup={closepopup} />
            </Modal>

            <Modal size="xl" show={logPopup} onHide={() => setlogPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5"></Modal.Title>
                </Modal.Header>
                <Modal.Body  >
                    <p style={{ fontWeight: 'bold' }}>Last {logdata.length} Logs</p>
                    <p style={{ fontWeight: 'bold' }}>Customer Name : {customername}</p>
                    <Table responsive style={{ border: '1px solid #eaeaea', borderTop: 'none' }}>
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Activity</th>
                                <th>Source</th>
                            </tr>
                        </thead>
                        <tbody>

                            {logdata && logdata.map((item, index) => (
                                <tr>
                                    <th>{Moment(item.updated_at).format('DD-MM-yyyy hh:mm a')}</th>
                                    <th>{item.log_status}</th>
                                    <th>{item.log_in_place} ({item.user_name})</th>
                                </tr>
                            ))}

                        </tbody>
                    </Table>

                </Modal.Body>
            </Modal>

            <Modal size="lg" show={notesPopup} onHide={() => setNotesPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Notes</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <Row>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body className='task-comment'>

                                    {notesArray && notesArray.length > 0 &&
                                        <ScrollToBottom className="mon-note-list">
                                            <ul className="media-list p-0">

                                                {notesArray.map((note, index) => (
                                                    <li className="media">
                                                        <div className="media-left mr-3">
                                                            <img className="media-object img-radius comment-img" src={note.sales_note_by === 'admin' ? adminprofile : note.sales_note_by === 'Shams' ? shamsprofile : note.sales_note_by === 'Shamnad' ? shamnadprofile : note.sales_note_by === 'Rasick' ? rasickprofile : note.sales_note_by === 'Ajmal' ? ajmalprofile : note.sales_note_by === 'Celine' ? celineprofile : note.sales_note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading text-muted">{note.sales_note_by}
                                                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:mm')}</span>
                                                                {note.sales_note_by === loginUserName && <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                                                    <i class="fas fa-pencil-alt"></i>
                                                                </span>}

                                                                <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'black' }}>{note.sales_note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.sales_note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span>
                                                            </h6>

                                                            <p style={{ color: 'black', margin: 0 }}>{ReactHtmlParser(note.sales_note_text)} </p>
                                                            <p style={{ fontStyle: 'italic' }}>{ReactHtmlParser(note.remove_reminder_text)} </p>

                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </ScrollToBottom>}

                                    <Form key="monitoringform" onSubmit={handleSubmitNotes(submitNotes)}>
                                        <Row>
                                            <Col md="6">
                                                <ButtonGroup style={{ marginBottom: '5px' }}>
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
                                            <Col md="6"></Col>
                                            <Col md="4" className="pr-0">
                                                <DatePicker
                                                    placeholderText='Select date'
                                                    selected={reminderDate}
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
                                            <Col md="5">
                                                <input type="radio" name="remaindertype" value="noreminder" {...registerReminder('sales_note_type')} onChange={() => {
                                                    setReminderDate('');
                                                }} />&nbsp;No Reminder &nbsp;&nbsp;
                                                <input type="radio" name="remaindertype" value="notification" {...registerReminder('sales_note_type')} />&nbsp;Follow Up  &nbsp;&nbsp;
                                                <input type="radio" name="remaindertype" value="meeting" {...registerReminder('sales_note_type')} />&nbsp;Meeting &nbsp;
                                            </Col>
                                            <Col md="3">
                                                <Form.Group controlId="exampleForm.ControlSelect2">
                                                    <Form.Control as="select" {...registerReminder('sales_note_assigned_to')}>
                                                        <option value="Shamnad">{loginUserId === '3' ? 'Self' : 'Shamnad'}</option>
                                                        <option value="Celine">{loginUserId === '7' ? 'Self' : 'Celine'}</option>
                                                        <option value="Shams">{loginUserId === '5' ? 'Self' : 'Shams'}</option>
                                                        <option value="Rasick">{loginUserId === '2' ? 'Self' : 'Rasick'}</option>
                                                        <option value="Ajmal">{loginUserId === '6' ? 'Self' : 'Ajmal'}</option>
                                                        <option value="Shone">{loginUserId === '8' ? 'Self' : 'Shone'}</option>
                                                        <option value="Vishal">{loginUserId === '9' ? 'Self' : 'Vishal'}</option>
                                                        <option value="Nishad">{loginUserId === '11' ? 'Self' : 'Nishad'}</option>
                                                        <option value="admin">{loginUserId === '1' ? 'Self' : 'admin'}</option>

                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...registerReminder('sales_note_text')} />

                                        <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Comment</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal>

            <Modal size="lg" show={chkadvancePopup} onHide={() => setchkadvancePopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Previous Sales</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>

                    <Row style={{ margin: '0 auto', width: '100%' }}>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body style={{ height: '85vh' }}>
                                    {salesArray && salesArray.length > 0 ?
                                        <Table responsive hover style={{ border: '1px solid #eaeaea', maxHeight: '80vh', overflowY: 'scroll' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '2%' }}>#</th>
                                                    <th style={{ width: '5%' }}>Sales Date</th>
                                                    <th style={{ width: '40%' }}>Company Name</th>
                                                    <th style={{ width: '10%' }}>Region</th>
                                                    <th style={{ width: '20%' }}>Sales Person</th>
                                                    <th style={{ width: '5%' }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salesArray.map((sales, index) => (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{Moment(sales.sales_plus_date).format('DD-MM-YYYY')}</td>
                                                        <td>{sales.sales_plus_company_name}</td>
                                                        <td>{sales.sales_plus_region}</td>
                                                        <td>{sales.user_name}</td>
                                                        <td>{sales.sales_plus_status}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table> : <p style={{ marginTop: '30px' }}>Previous List Not Found</p>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal>

            <Modal size="xl" show={emailPopup} onHide={() => setemailPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Send Template</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <Row>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body>

                                    <Form key="emailform" onSubmit={handleSubmit2(saveemailTemplate)}>
                                        <Row>
                                            <Col md="6">
                                                <Form.Label>Email :</Form.Label>
                                                <Form.Control rows="1" placeholder='Email' {...register2('sales_plus_email')} />
                                                <input type="hidden" {...register2('sales_plus_person')} />
                                            </Col>
                                            <Col md="6">
                                                <Form.Label>Mail Type :</Form.Label>
                                                <Form.Control as="select" {...register2('sales_plus_template_mail_type')}>
                                                    <option value="" selected="selected">Select Type</option>
                                                    <option value="Welcome">Welcome</option>
                                                    <option value="Status">Status</option>

                                                </Form.Control>
                                            </Col>

                                        </Row>

                                        <Row>
                                            <Col md="12">
                                                <Form.Label>Subject :</Form.Label>
                                                <Form.Control rows="1" placeholder='Email Subject' {...register2('sales_plus_template_mail_subject')} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <Form.Label>Content :</Form.Label>
                                                <Form.Control as="textarea" placeholder='Content' rows="3" {...register2('sales_plus_template_mail_content')} />

                                            </Col>


                                        </Row>

                                        <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Save</Button>
                                    </Form> <Row>

                                        <Col md="12">
                                            <Form.Label>Template :</Form.Label>
                                            <Editor defaultValue={content} onChange={setContent} />

                                        </Col>

                                    </Row>

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </Modal.Body>
            </Modal>

            <Modal show={statuEditPopup} onHide={() => setStatusEditPopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Update Status</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit1(editsaleplusstatus)}>
                    <Modal.Body>
                        <Row>
                            <Col md={12}>
                                <Form.Control as="select" {...register1('sales_plus_status')}>
                                    <option value="New">New</option>
                                    <option value="Proposed">Proposed</option>
                                    <option value="PartiallyWon">Partially Won</option>
                                    <option value="Won">Won</option>
                                    <option value="Lost">Lost</option>
                                    <option value="Hold">Hold</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Duplicate">Duplicate</option>
                                    <option value="Demo">Demo</option>
                                    <option value="MigrationCheck">Check for Migration</option>
                                </Form.Control>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </React.Fragment>
    );





}

export default App