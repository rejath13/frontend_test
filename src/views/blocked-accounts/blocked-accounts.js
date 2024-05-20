import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { Row, Col, Card, Pagination, Modal, Button, OverlayTrigger, Tooltip, Form, Table, ButtonGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import './blocked-account.css';
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

function DynamicTable({ columns, data, fromNumber, toNumber, getSubscriptionsList, totalCount, remindercount, showReminderPopup }) {

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
            initialState: { pageIndex: 0, sortBy: [{ id: 'tbl_customer.customer_expiry_date', desc: true }] },
            manualPagination: true,
            pageCount: Math.ceil(totalCount / 40),
        },
        useSortBy,
        usePagination

    )
    const [searchCustomer, setSearchCustomer] = useState(null);
    const [searchText, setSearchText] = useState(null);

    const onChangeSearchCustomer = (e) => {
        setSearchCustomer(e.target.value);
    };

    const search = () => {

        if (searchCustomer)
            setSearchText(searchCustomer);

        if (pageIndex > 0) {
            gotoPage(0);
        }
    };

    const clearAllFilters = () => {
        setSearchCustomer(null);
        setSearchText(null);

        if (pageIndex > 0) {
            gotoPage(0);
        }
    }

    useEffect(() => {
        getSubscriptionsList({ pageIndex, searchText, sortBy });
    }, [getSubscriptionsList, sortBy, pageIndex, searchText])

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
                    <Col xs={4}>
                        <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Reminders</Tooltip>}
                        >
                            <button
                                className="btn btn-warning"
                                type="button"
                                onClick={() => showReminders()}
                            >
                                <i className="fas fa-bell" style={{ margin: 0, fontSize: '18px' }}></i>
                                {remindercount > 0 ? <span style={{ color: 'red', marginLeft: '12px' }}><b>[ {remindercount} ]</b></span> : ''}
                            </button>
                        </OverlayTrigger>
                    </Col>

                    <Col xs={4}>
                        <Form.Control placeholder="Search..." value={searchCustomer || ''} onChange={onChangeSearchCustomer} onKeyPress={handleKeypress} />
                        {searchCustomer && <button type="button" class="react-datepicker__close-icon" onClick={clearAllFilters} style={{ right: '2px', height: '90%' }}></button>}
                    </Col>
                    <Col xs={2}>
                        <button
                            className="text-capitalize btn btn-success"
                            type="button"
                            onClick={search}
                        >
                            <i className="feather icon-search" style={{ margin: 0, fontSize: '16px' }}></i>
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

        </>
    )
}

function App() {

    const authToken = localStorage.getItem('authToken');
    const [subscriptions, setSubscriptions] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCustomer, setselectedCustomer] = useState('');
    const [selectedCustomerId, setselectedCustomerId] = useState(0);
    const [monitoringPopup, setMonitoringPopup] = useState(false);
    const [blockedNoteDate, setBlockedNoteDate] = useState();
    const [updtepopup, setupdatepopup] = useState(false);
    const [listupdated, setListUpdated] = useState(false);
    const [accBlockedDate, setAccBlockedDate] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortType, setSortType] = useState('tbl_customer.blocked_date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [notearray, setNoteArray] = useState([]);
    const [reminderPopup, setReminderPopup] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [remindercount, setReminderCount] = useState(0);
    const [remindertextPopup, setReminderTextPopup] = useState(false);
    const loginUserId = localStorage.getItem('loginUserId');
    const loginUserName = localStorage.getItem('loginUserName');
    const [isPopupLoading, setIsPopupLoading] = useState(false);
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
    const filterRectifiedReminders = (e) => {
        setRectifiedFilter(rectifiedFilter === true ? false : true);
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

            const url = API_URL + `getBlockedAccountReminders/${selectedRemType}/${rectifiedFilter}/${remSearchDate}/${searchReminder}`;

            const response = await fetch(url, options)

            const data = await response.json();

            setReminderCount(data.data.length);

            setReminders(data.data);
            setIsPopupLoading(false);
        }
        catch {

        }
    }, [])

    useEffect(() => {
        getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);
    }, [getReminders, rectifiedFilter, selectedRemType, remSearchDate, searchReminder])

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

            const url = API_URL + "rectifyBlockedAccountReminder";

            const response = await fetch(url, options)

            const data = await response.json();

            setRectifyTextPopup(false);

            setListUpdated(true);

            sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully removed reminder!' })
        }
        catch {

        }
    }

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        reset: reset2
    } = useForm({
        defaultValues: {
            remove_reminder_text: '',
            reminder_id: 0
        }
    });



    const showRemoveReminderTextPopup = (id) => {
        reset2({
            remove_reminder_text: '',
            reminder_id: id
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

            const url = API_URL + "removeBlockedAccountReminder";

            const response = await fetch(url, options)

            const data = await response.json();

            setReminderTextPopup(false);

            getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);

            sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully removed reminder!' })

        }
        catch {

        }
    }

    const update = (selectedcustomerdetails) => {

        //  setReminderPopup(false);
        setupdatepopup(true);
        setselectedCustomer(selectedcustomerdetails.name);
        setselectedCustomerId(selectedcustomerdetails.customer_id);
        reset({
            blocked_date: selectedcustomerdetails.blocked_date,
            reason: selectedcustomerdetails.blocked_reason,
            customer_status: selectedcustomerdetails.customer_status,
            subscriber_status: selectedcustomerdetails.subscriber_status
        });
        if (selectedcustomerdetails.blocked_date !== '0000-00-00' && selectedcustomerdetails.blocked_date !== null) {
            setAccBlockedDate(new Date(selectedcustomerdetails.blocked_date));
        } else {
            setAccBlockedDate();
        }
    }

    const updateComments = async (selectedcustomerdetails) => {

        setselectedCustomer(selectedcustomerdetails.name);
        setselectedCustomerId(selectedcustomerdetails.customer_id);

        reset1({
            blocked_account_note: '',
            blocked_account_note_id: 0,
            blocked_account_note_assigned_to: loginUserName
        });
        setBlockedNoteDate();

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "getBlockedNotes/" + selectedcustomerdetails.customer_id;

            const response = await fetch(url, options)

            const data = await response.json();

            setNoteArray(data.data);

            setMonitoringPopup(true);

            setIsLoading(false);
        }
        catch {

        }
    }

    const columns = React.useMemo(
        () => [

            {
                Header: 'Customer Name',
                accessor: 'name',
                className: 'accname',
                Cell: ({ row }) => {


                    return (
                        <span onClick={() => update(row.original)} style={{ cursor: 'pointer' }}><span style={{ color: 'black' }}><b>{row.original.name}</b></span>
                            {row.original.customer_contact_name ? <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Contact Name</Tooltip>}
                            >
                                <span><br />({row.original.customer_contact_name})</span>
                            </OverlayTrigger> : ''}
                        </span>
                    );

                }
            },
            {
                Header: 'Cont. Phone',
                accessor: 'customer_contact_phone',
                className: 'contactcolumn',
                disableSortBy: true,
            },
            {
                Header: 'Blocked Date',
                accessor: 'blocked_date',
                className: 'blockedcolumn',
                Cell: ({ row }) => {

                    if (row.original.blocked_date !== '0000-00-00' && row.original.blocked_date !== null) {

                        return (
                            <span>{Moment(row.original.blocked_date).format('MMM-YYYY')}</span>
                        );
                    } else {
                        return (
                            <span></span>
                        );
                    }
                }
            },
            {
                Header: 'Reason',
                accessor: 'blocked_reason',
                className: 'reasoncolumn',
                disableSortBy: true
            },
            {
                Header: 'Rem. Date',
                accessor: 'latest_date',
                className: 'latestdatecolumn',
                Cell: ({ row }) => {

                    if (row.original.latest_date !== '0000-00-00 00:00:00' && row.original.latest_date !== null && row.original.latest_date !== '') {

                        return (
                            <span>{Moment(row.original.latest_date).format('DD-MM-YYYY')}</span>
                        );
                    } else {
                        return (
                            <span></span>
                        );
                    }
                },
                disableSortBy: true
            },
            {
                Header: 'Comments',
                accessor: 'latest_comment',
                className: 'commentcolumn',
                disableSortBy: true,
                Cell: ({ row }) => {
                    var note = '';
                    if (row.original.latest_comment.length > 32) {
                        note = row.original.latest_comment.substring(0, 32) + '...';
                    } else {
                        note = row.original.latest_comment;
                    }

                    return (
                        <span>
                            <span style={{ height: '20px', display: 'inline-block', overflow: 'hidden' }}>{ReactHtmlParser(note)}</span>
                            <br />
                            <span style={{ fontSize: '12px', marginLeft: '2px' }}>{row.original.latest_comment_created_date ? '(' + Moment(row.original.latest_comment_created_date.date).format('YYYY-MM-DD HH:mm') + ')' : ''}</span>
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
                                overlay={<Tooltip id={`tooltip-top`}>Update Comment</Tooltip>}
                            >
                                <Button onClick={() => updateComments(row.original)} className='text-capitalize' variant="success" style={{ padding: '6px' }}><i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i></Button>
                            </OverlayTrigger>
                        </span>
                    );

                }
            },
        ],
        []
    )

    useEffect(() => {
        if (listupdated) {

            const sortBy = [{ id: sortType, desc: sortOrder === 'desc' ? true : false }];
            const searchText = searchKeyword;
            const pageIndex = currentPage;
            getSubscriptionsList({ pageIndex, searchText, sortBy });
            getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);
        }
    }, [listupdated])

    const getSubscriptionsList = useCallback(async ({ pageIndex, searchText, sortBy }) => {

        setIsLoading(true);

        const cpage = pageIndex + 1;
        setCurrentPage(pageIndex);

        if (!searchText) {
            searchText = null;
        }

        setSearchKeyword(searchText);

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
            keyword: searchText, sortType: stype ? stype : sortType, sortOrder: sorder ? sorder : sortOrder
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

            const url = API_URL + "getBlockedAccountList?page=" + cpage;

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
            blocked_date: '',
            reason: '',
            customer_status: '',
            subscriber_status: ''
        },
    });

    const {
        register: register1,
        handleSubmit: handleSubmit1,
        reset: reset1
    } = useForm({
        defaultValues: {
            blocked_account_note: '',
            blocked_account_note_id: 0
        }
    });


    const onSubmit = async (data) => {

        const postdata = { customer_id: selectedCustomerId, blocked_date: accBlockedDate ? Moment(accBlockedDate).format('YYYY-MM-DD') : '', blocked_reason: data.reason, customer_status: data.customer_status, subscriber_status: data.subscriber_status };

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


            const url = API_URL + "saveBlockedAccountDetails";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                setListUpdated(true);

                setupdatepopup(false);

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated details!' })

            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating data!' })
            }
        }
        catch {

        }
    }

    const saveMonitoringNote = async (data) => {

        const postdata = { ...data, customer_id: selectedCustomerId, blocked_account_note: data.blocked_account_note.replace(/\r?\n/g, '<br/>'), blocked_account_note_date: blockedNoteDate ? Moment(blockedNoteDate).format('YYYY-MM-DD HH:mm') : '' };

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


            const url = API_URL + "saveBlockedAccountNote";

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
            blocked_account_note: note.blocked_account_note_text.replaceAll('<br/>', '\n'),
            blocked_account_note_id: note.blocked_account_note_id
        });
        console.log(note.blocked_account_note_date);
        if (note.blocked_account_note_date !== '0000-00-00 00:00:00') {
            setBlockedNoteDate(new Date(note.blocked_account_note_date));
        }
        else {
            setBlockedNoteDate();
        }
    }

    const handleMonitoringDateChange = (date) => {
        const selectedHour = new Date(date).getHours();
        if (selectedHour === 0) {
            setBlockedNoteDate(new Date(date).setHours(9, 0, 0));
        } else {
            setBlockedNoteDate(date);
        }
    };

    const changeRemDate = (selectedtype) => {

        if (selectedtype === 'tomorrow') {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            setBlockedNoteDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1w') {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            setBlockedNoteDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '2w') {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            setBlockedNoteDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1m') {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            setBlockedNoteDate(new Date(date).setHours(9, 0, 0));
        }
    };

    const handleBlockedDateChange = (date) => {
        setAccBlockedDate(date);
    };


    return (
        <React.Fragment>
            <Row>
                <Col className='p-0'>
                    {isLoading ? <Loader /> : null}
                    <Card>
                        <Card.Body style={{ padding: '15px' }}>
                            <DynamicTable columns={columns} data={subscriptions} fromNumber={fromNumber} toNumber={toNumber} getSubscriptionsList={getSubscriptionsList} totalCount={totalCount} remindercount={remindercount} showReminderPopup={showReminderPopup} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={updtepopup} onHide={() => setupdatepopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{selectedCustomer}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect2">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as="select" {...register('customer_status')}>
                                        <option value="active">Active</option>
                                        <option value="new">New</option>
                                        <option value="demoaccount">Demo Account</option>
                                        <option value="blocked">Blocked</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="temporarysuspend">To Verify</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect3">
                                    <Form.Label></Form.Label>
                                    <Form.Control as="select" {...register('subscriber_status')}>
                                        <option value="">Select</option>
                                        <option value="companyclosed">Company Closed</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={6}>

                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Blocked date</Form.Label>
                                    <DatePicker
                                        placeholderText='Blocked date'
                                        selected={accBlockedDate}
                                        onChange={handleBlockedDateChange}
                                        className="form-control"
                                        dateFormat="dd-MM-yyyy"
                                        isClearable={true}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group controlId="exampleForm.ControlSelect2">
                                    <Form.Control as="textarea" rows="3" name="reason" placeholder='Reason' {...register('reason')} />
                                </Form.Group>
                            </Col>

                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" type='submit'>Submit</Button>
                        <Button variant="secondary" onClick={() => setupdatepopup(false)}>Close</Button>
                    </Modal.Footer>
                </Form>
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
                                                    <li className="media mb-3">
                                                        <div className="media-left mr-3">
                                                            <img className="media-object img-radius comment-img" src={note.blocked_account_note_by === 'admin' ? adminprofile : note.blocked_account_note_by === 'Shams' ? shamsprofile : note.blocked_account_note_by === 'Shamnad' ? shamnadprofile : note.blocked_account_note_by === 'Rasick' ? rasickprofile : note.blocked_account_note_by === 'Ajmal' ? ajmalprofile : note.blocked_account_note_by === 'Celine' ? celineprofile : note.blocked_account_note_by === 'Shone' ? shoneprofile : adminprofile} alt="profile" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading text-muted">{note.blocked_account_note_by}
                                                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:MM')}</span>
                                                                {note.blocked_account_note_by === loginUserName && <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                                                    <i class="fas fa-pencil-alt"></i>
                                                                </span>}

                                                                <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'black' }}>{note.blocked_account_note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.blocked_account_note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span>

                                                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Assigned to</Tooltip>}>
                                                                    <span style={{ float: 'right', fontWeight: 'bold', color: 'darkmagenta' }}><i className="fas fa-arrow-circle-right" style={{ marginRight: '10px' }}></i>
                                                                        {note.blocked_account_note_assigned_to}</span>
                                                                </OverlayTrigger>

                                                            </h6>
                                                            <p style={{ color: 'black', marginBottom: 0 }}>{ReactHtmlParser(note.blocked_account_note_text)} </p>

                                                            {note.blocked_account_note_rectified === 'true' && <p style={{ color: 'blue', margin: 0 }}>[Rectified on {Moment(note.rectified_date).format('DD-MM-YYYY HH:mm')}  -  {ReactHtmlParser(note.rectified_text)}]</p>}

                                                            {note.remove_reminder_text && <p style={{ fontStyle: 'italic', margin: 0 }}>{ReactHtmlParser(note.remove_reminder_text)} </p>}
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
                                            <Col md="6">
                                                <DatePicker
                                                    placeholderText='Select date'
                                                    // todayButton={"Today"}
                                                    selected={blockedNoteDate}
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
                                                    <Form.Control as="select" {...register1('blocked_account_note_assigned_to')}>
                                                        <option value="Shamnad">{loginUserId === '3' ? 'Self' : 'Shamnad'}</option>
                                                        <option value="Celine">{loginUserId === '7' ? 'Self' : 'Celine'}</option>
                                                        <option value="Shams">{loginUserId === '5' ? 'Self' : 'Shams'}</option>
                                                        <option value="Rasick">{loginUserId === '2' ? 'Self' : 'Rasick'}</option>
                                                        <option value="Ajmal">{loginUserId === '6' ? 'Self' : 'Ajmal'}</option>
                                                        <option value="Shone">{loginUserId === '8' ? 'Self' : 'Shone'}</option>
                                                        <option value="Shone">{loginUserId === '10' ? 'Self' : 'Ajmal_m'}</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md="3"></Col>
                                        </Row>

                                        <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...register1('blocked_account_note')} />

                                        <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Comment</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>

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

                    <Row style={{ margin: '0 auto', width: '100%' }}>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body style={{ height: '85vh' }}>{reminders && reminders.length > 0 ?
                                    <Table responsive hover style={{ border: '1px solid #eaeaea', maxHeight: '80vh', overflowY: 'scroll' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '1%' }}>#</th>
                                                <th style={{ width: '1%' }}></th>
                                                <th style={{ width: '6%' }}></th>
                                                <th style={{ width: '30%' }}>Customer Name</th>
                                                {selectedRemType !== 'self' && <th style={{ width: '8%' }}>Assgn. To</th>}
                                                <th style={{ width: '15%' }}>Date</th>
                                                <th style={{ width: '35%' }}>Note</th>
                                                <th style={{ width: '1%' }}></th>
                                                <th style={{ width: '1%' }}></th>
                                                <th style={{ width: '1%' }}></th>
                                                <th style={{ width: '1%' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reminders.map((reminder, index) => (
                                                <tr>
                                                    <td onClick={() => updateComments(reminder)}>{index + 1}</td>
                                                    <td onClick={() => updateComments(reminder)}>
                                                        {reminder.blocked_account_note_rectified === 'true' && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Rectified</Tooltip>}>
                                                            <i className="fa fa-check" style={{ color: 'green' }}></i>
                                                        </OverlayTrigger>}
                                                    </td>
                                                    <td onClick={() => updateComments(reminder)}>
                                                        <img className="left-logo" style={{ borderRadius: '50%', width: '40px' }} src={reminder.blocked_account_note_by === 'admin' ? adminprofile : reminder.blocked_account_note_by === 'Shams' ? shamsprofile : reminder.blocked_account_note_by === 'Shamnad' ? shamnadprofile : reminder.blocked_account_note_by === 'Rasick' ? rasickprofile : reminder.blocked_account_note_by === 'Ajmal' ? ajmalprofile : reminder.blocked_account_note_by === 'Celine' ? celineprofile : reminder.blocked_account_note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                                    </td>
                                                    <td onClick={() => updateComments(reminder)}>{reminder.name}<br /><OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Created on</Tooltip>}><span style={{ fontSize: '11px' }}>{Moment(reminder.created_at).format('DD-MM-YYYY HH:mm')}</span></OverlayTrigger></td>
                                                    {selectedRemType !== 'self' && <td>{reminder.blocked_account_note_assigned_to}</td>}
                                                    <td onClick={() => updateComments(reminder)}>{Moment(reminder.blocked_account_note_date).format('DD-MM-YYYY HH:mm')}</td>
                                                    <td onClick={() => updateComments(reminder)}>{ReactHtmlParser(reminder.blocked_account_note_text)}
                                                        {reminder.blocked_account_note_rectified === 'true' && <span style={{ color: 'blue' }}><br />{ReactHtmlParser(reminder.rectified_text)}<span style={{ fontSize: '11px', marginLeft: '5px' }}>{'(' + Moment(reminder.rectified_date).format('DD-MM-YYYY HH:mm') + ')'}</span></span>}
                                                    </td>

                                                    <td>
                                                        {reminder.blocked_account_note_rectified !== 'true' && reminder.blocked_account_note_assigned_to === loginUserName && reminder.blocked_account_note_assigned_to !== reminder.blocked_account_note_by && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Rectify reminder</Tooltip>}>

                                                            <Button onClick={() => showRectifiedTextPopup(reminder.customer_id, reminder.blocked_account_note_id)} variant="warning" style={{ padding: '6px' }}>
                                                                <i className="fa fa-check" style={{ margin: 0 }}></i>
                                                            </Button>
                                                        </OverlayTrigger>}
                                                    </td>

                                                    <td>
                                                        <Button onClick={() => showRemoveReminderTextPopup(reminder.blocked_account_note_id)} variant="danger" style={{ padding: '6px' }}>
                                                            <i className="far fa-calendar-times" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => updateComments(reminder)} variant="success" style={{ padding: '6px' }}>
                                                            <i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => update(reminder)} variant="primary" style={{ padding: '6px' }}>
                                                            <i className="fa fa-edit" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                                        </Button>
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
                <Form onSubmit={handleSubmit2(removeReminderDate)}>
                    <Modal.Header closeButton>
                        {/* <Modal.Title as="h5">Text</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Control as="textarea" rows="3" {...register2('remove_reminder_text')} placeholder='Say something about removing reminder' required />
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

        </React.Fragment>
    );

}

export default App