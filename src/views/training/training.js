import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { Row, Col, Card, Pagination, Modal, Button, OverlayTrigger, Tooltip, Form, Table, Badge, ButtonGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import './training.css';
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
        icon: 'success',
        text: alert.text,
        type: alert.type
    });
};

function DynamicTable({ columns, data, fromNumber, toNumber, getSubscriptionsList, totalCount, activeCustomerCount, showReminderPopup, remindercount }) {

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
            initialState: { pageIndex: 0, sortBy: [{ id: 'customer_expiry_date', desc: true }] },
            manualPagination: true,
            pageCount: Math.ceil(totalCount / 40),
        },
        useSortBy,
        usePagination

    )

    const statusfilter = [
        {
            name: "new",
            value: "true",
            label: "New"
        },
        {
            name: "demoaccount",
            value: "true",
            label: "Demo"
        }
        ,
        {
            name: "followup",
            value: "true",
            label: "Newly Created"
        }
    ]

    const [searchCustomer, setSearchCustomer] = useState(null);
    const [filterarray, setFilterarray] = useState({ "new": true, "demoaccount": true, "followup": true });
    const [refreshList, setRefreshList] = useState(false);

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

        setFilterarray({ "new": true, "demoaccount": true, "followup":true });

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
                    <Col xs={1} style={{ color: 'black' }}><span style={{ top: '12px', position: 'relative' }}><b>Total : {activeCustomerCount}</b></span></Col>
                    <Col xs={2}>
                        <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Due Reminders</Tooltip>}
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

                    {statusfilter.map((item, index) => (
                        <Col xs={item.name ==='followup'?2:1}>

                            <div className="checkbox d-inline">
                                <Form.Control type="checkbox" name={item.name} value={item.value} checked={filterarray[item.name]} id={item.name} onChange={handleFilterArrayChange} />
                                <Form.Label htmlFor={item.name} className="cr">{item.label}</Form.Label>
                            </div>
                        </Col>
                    ))}
                    <Col xs={3}>

                        <Form.Control placeholder="Search..." value={searchCustomer || ''} onChange={onChangeSearchCustomer} onKeyPress={handleKeypress} />
                        {searchCustomer && <button type="button" className="react-datepicker__close-icon" onClick={clearAllFilters} style={{ right: '5px', height: '90%' }}></button>}
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

    return todayDifference;

}

function App() {

    const authToken = localStorage.getItem('authToken');
    const [subscriptions, setSubscriptions] = useState([]);
    const [activeCustomerCount, setActiveCustomerCount] = useState(0);
    const [totalCount, setTotalCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCustomer, setselectedCustomer] = useState('');
    const [selectedCustomerId, setselectedCustomerId] = useState(0);
    const [updtepopup, setupdatepopup] = useState(false);
    const [trainingPopup, setTrainingPopup] = useState(false);
    const [notearray, setNoteArray] = useState([]);
    const [trainingDate, setTrainingDate] = useState();
    const [contactList, setContactList] = useState([{ order: 1, name: "", email: "", phone: "", position: "" }]);
    const [listupdated, setListUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortType, setSortType] = useState('training_first_date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [reminderPopup, setReminderPopup] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [remindercount, setReminderCount] = useState(0);
    const [remindertextPopup, setReminderTextPopup] = useState(false);
    const [statusPopup, setStatusPopup] = useState(false);
    const [filterData, saveFilterData] = useState({});
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

    const filterRectifiedReminders = () => {
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

            const url = API_URL + `getTrainingReminders/${selectedRemType}/${rectifiedFilter}/${remSearchDate}/${searchReminder}`;

            const response = await fetch(url, options)

            const data = await response.json();

            setReminderCount(data.count);

            setReminders(data.data);
            setIsPopupLoading(false);
        }
        catch {

        }
    }, [])

    useEffect(() => {
        getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);
    }, [getReminders, rectifiedFilter, selectedRemType, remSearchDate])

    const updateReminder = (reminderdata) => {
        update(reminderdata);
    }

    const updateMNote = (reminderdata) => {
        updateTrainingNote(reminderdata);
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

            const url = API_URL + "rectifyTrainingReminder";

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
            reminder_id: 0
        },
    });

    const showRemoveReminderTextPopup = (id) => {
        resetRemoveReminder({
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

            const url = API_URL + "removeTrainingReminder";

            const response = await fetch(url, options)

            const data = await response.json();

            setReminderTextPopup(false);

            getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);

            sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully removed reminder!' })

        }
        catch {

        }
    }

    const completeTraining = async (training,id) => {

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "completeTraining/" + training+"/"+id;

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                setListUpdated(true);

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully Updated!' })

            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating status!' })
            }
        }
        catch {

        }
    }

    const updateTrainingNote = async (selectedcustomerdetails) => {
        setselectedCustomer(selectedcustomerdetails.customer_name);
        setselectedCustomerId(selectedcustomerdetails.customer_id);

        reset1({
            training_note: '',
            training_note_id: 0,
            training_note_assigned_to: loginUserName
        });
        setTrainingDate();

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "getTrainingNotes/" + selectedcustomerdetails.customer_id;

            const response = await fetch(url, options)

            const data = await response.json();

            setNoteArray(data.data);

            setTrainingPopup(true);

            setIsLoading(false);
        }
        catch {

        }
    }

    const { register: registerStatusEdit, handleSubmit: handleSubmitStatusEdit, reset: resetStatusEdit, watch: watchStatusChange } = useForm({
        defaultValues: {
            customer_status: '',
            customer_id: 0
        },
    });

    const statusEditForm = (id, status) => {
        resetStatusEdit({
            customer_status: status,
            customer_id: id
        })
        setStatusPopup(true);
    }

    const editStatus = async (postdata) => {

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


            const url = API_URL + "saveTrainingDetails";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                setListUpdated(true);

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated status!' })

            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating status!' })
            }

            setStatusPopup(false);
        }
        catch {

        }
    }

    const update = (selectedcustomerdetails) => {

        setupdatepopup(true);
        setselectedCustomer(selectedcustomerdetails.customer_name);
        setselectedCustomerId(selectedcustomerdetails.customer_id);
        reset({
            multiple_contact_details: selectedcustomerdetails.multiple_contact_details,
            erp_used: selectedcustomerdetails.erp_used,
            driver_expture_app: selectedcustomerdetails.driver_expture_app,
            fuel_card: selectedcustomerdetails.fuel_card,
            salik: selectedcustomerdetails.salik,
            task_manager: selectedcustomerdetails.task_manager,
            fleet_manager: selectedcustomerdetails.fleet_manager,
            accounting_sft: selectedcustomerdetails.accounting_sft,
            actual_veh_count: selectedcustomerdetails.actual_veh_count,
            group_of_companies: selectedcustomerdetails.group_of_companies,
            third_training_duration: selectedcustomerdetails.third_training_duration,
            referral_possibility: selectedcustomerdetails.referral_possibility,
            preferred_module: selectedcustomerdetails.preferred_module,
            attendance_system: selectedcustomerdetails.attendance_system,
            garage: selectedcustomerdetails.garage,
            rental_vehicles: selectedcustomerdetails.rental_vehicles,
            send_contact_details_whatsapp: selectedcustomerdetails.send_contact_details_whatsapp,
            send_contact_details_mail: selectedcustomerdetails.send_contact_details_mail,
            send_thankyou_msg_whatsapp: selectedcustomerdetails.send_thankyou_msg_whatsapp,
            send_thankyou_msg_mail: selectedcustomerdetails.send_thankyou_msg_mail,
            send_monthly_email: selectedcustomerdetails.send_monthly_email,
            send_sales_email: selectedcustomerdetails.send_sales_email,
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
                Header: 'Name(Username)/Date/Sales Person',
                accessor: 'traccar_created_at',
                className: 'trainingnamecolumn',
                Cell: ({ row }) => {

                    return (
                        <span onClick={() => update(row.original)} style={{ cursor: 'pointer' }}>
                            <span style={{ color: 'black' }}><b>{row.original.customer_name.replace(/&amp;/g, '&').substring(0, 25)}</b></span>
                            {row.original.customer_contact_name ? <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Contact Name</Tooltip>}
                            >
                                <span> ({row.original.customer_contact_name})</span>
                            </OverlayTrigger> : ''}<br/>
                            {row.original.traccar_created_at && <span className='text-primary'>Created on: {Moment(row.original.traccar_created_at).format('DD-MM-YYYY')}&nbsp;&nbsp;</span>}
                            {row.original.sales_person?' By: '+row.original.sales_person:''}
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
                                <span style={{ background: 'blue', padding: '1px 10px', color: '#fff', display: 'inline-block', width: 'auto', textAlign: 'center', borderRadius: '5px', marginBottom: '2px' }}>{row.original.count > 0 ? row.original.count : 0}</span>
                            </OverlayTrigger><br />

                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>No Connection Devices</Tooltip>}
                            >
                                <span style={{ background: 'red', padding: '1px 10px', color: '#fff', display: 'inline-block', width: 'auto', textAlign: 'center', borderRadius: '5px' }}>{row.original.Noconnection > 0 ? row.original.Noconnection : 0}</span>
                            </OverlayTrigger>
                        </span>

                    );
                }
            },
            {
                Header: 'Status',
                accessor: 'customer_status',
                className: 'statuscolumn',
                Cell: ({ row }) => {

                    return (
                        <span>{row.original.customer_status === 'demoaccount' ? 'Demo' : row.original.customer_status === 'followup' ? 'Newly Created' :'New'}
                            <Badge onClick={() => statusEditForm(row.original.customer_id, row.original.customer_status)} variant="primary" className="pl-2 pr-1 pt-1 pb-1 mt-1 mr-2" style={{ float: 'right', cursor: 'pointer' }}>
                                <i className="fas fa-edit"></i>
                            </Badge>
                        </span>
                    );
                }
            },
            {
                Header: 'Accessory',
                accessor: 'accessory',
                className: 'accessorycolumn',
                disableSortBy: true
            },
            {
                Header: '1st',
                accessor: 'training_first_date',
                className: 'trainingdatescolumn',
                Cell: ({ row }) => {

                    return (
                        <span>{row.original.training_first_date !== null && row.original.training_first_date !== '0000-00-00 00:00:00'?row.original.training_first_date:''}
                            {row.original.training_first_date !== null && row.original.training_first_date !== '0000-00-00 00:00:00' && <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Complete First Training</Tooltip>}
                            >
                                <Badge onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Are you sure you completed first training?"
                                            )
                                            if (confirmBox === true) { completeTraining('first',row.original.customer_id) }
                                        }} className='text-capitalize' variant="success" style={{ padding: '6px',marginLeft:'10px',cursor:'pointer' }}>
                                    <i className="fa fa-check" style={{ margin: 0 }}></i>
                                </Badge>
                            </OverlayTrigger>}
                        </span>
                    );

                }
            },
            {
                Header: '2nd',
                accessor: 'training_second_date',
                className: 'trainingdatescolumn',
                Cell: ({ row }) => {

                    return (
                        <span>{row.original.training_second_date !== null && row.original.training_second_date !== '0000-00-00 00:00:00'?row.original.training_second_date:''}
                            {row.original.training_second_date !== null && row.original.training_second_date !== '0000-00-00 00:00:00' && <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Complete Second Training</Tooltip>}
                            >
                                <Badge onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Are you sure you completed second training?"
                                            )
                                            if (confirmBox === true) { completeTraining('second',row.original.customer_id) }
                                        }} className='text-capitalize' variant="success" style={{ padding: '6px',marginLeft:'10px',cursor:'pointer' }}>
                                    <i className="fa fa-check" style={{ margin: 0 }}></i>
                                </Badge>
                            </OverlayTrigger>}
                        </span>
                    );

                }
            },
            {
                Header: '3rd',
                accessor: 'training_third_date',
                className: 'trainingdatescolumn',
                Cell: ({ row }) => {

                    return (
                        <span>{row.original.training_third_date !== null && row.original.training_third_date !== '0000-00-00 00:00:00'?row.original.training_third_date:''}
                            {row.original.training_third_date !== null && row.original.training_third_date !== '0000-00-00 00:00:00' && <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Complete Third Training</Tooltip>}
                            >
                                <Badge onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Are you sure you completed third training?"
                                            )
                                            if (confirmBox === true) { completeTraining('third',row.original.customer_id) }
                                        }} className='text-capitalize' variant="success" style={{ padding: '6px',marginLeft:'10px',cursor:'pointer' }}>
                                    <i className="fa fa-check" style={{ margin: 0 }}></i>
                                </Badge>
                            </OverlayTrigger>}
                        </span>
                    );

                }
            },
            {
                Header: 'Comments',
                accessor: 'latestnote',
                className: 'trainingnotecolumn',
                disableSortBy: true,
                Cell: ({ row }) => {
                    var note = '';
                    if (row.original.latestnote.length > 32) {
                        note = row.original.latestnote.substring(0, 32) + '...';
                    } else {
                        note = row.original.latestnote;
                    }

                    return (
                        <span>
                            <span style={{ height: '20px', display: 'inline-block', overflow: 'hidden' }}>{ReactHtmlParser(note)}</span>
                        </span>
                    );

                }
            },
            {
                Header: '',
                accessor: 'trainingbutton',
                className: 'trainingbuttoncolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span>
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Update Training Note</Tooltip>}
                            >
                                <Button onClick={() => updateTrainingNote(row.original)} className='text-capitalize' variant="success" style={{ padding: '6px' }}>
                                    <i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                </Button>
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
                            <Button variant="primary" onClick={() => loginToWeb(row.original.   customer_username, row.original.password)} style={{ padding: '6px' }}>
                                <i className="fas fa-sign-in-alt" style={{ margin: 0 }}></i>
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

            const url = API_URL + "getTrainingList?page=" + cpage;

            const response = await fetch(url, options)

            const data = await response.json();

            setSubscriptions(data.data.data);

            setTotalCount(data.data.total);

            setFromNumber(data.data.from);

            setToNumber(data.data.to);

            setIsLoading(false);

            setListUpdated(false);

            setActiveCustomerCount(data.data.total);
        }
        catch {

        }

    }, []);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            multiple_contact_details: '',
            erp_used: '',
            driver_expture_app: '',
            fuel_card: '',
            salik: '',
            task_manager: '',
            fleet_manager: '',
            accounting_sft: '',
            actual_veh_count: '',
            group_of_companies: '',
            third_training_duration: '',
            referral_possibility: '',
            preferred_module: '',
            attendance_system: '',
            garage: '',
            rental_vehicles: '',
            send_contact_details_whatsapp: 0,
            send_contact_details_mail: 0,
            send_thankyou_msg_whatsapp: 0,
            send_thankyou_msg_mail: 0,
            send_monthly_email: 0,
            send_sales_email: 0,
            customer_contact_name: '',
            customer_email: '',
            customer_contact_phone: '',
            customer_contact_position: ''
        },
    });

    const {
        register: register1,
        handleSubmit: handleSubmit1,
        reset: reset1
    } = useForm({
        defaultValues: {
            training_note: '',
            training_note_id: 0,
            training_note_assigned_to: loginUserName
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

            const url = API_URL + "saveTrainingDetails";

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

    const saveTrainingNote = async (data) => {

        const postdata = { ...data, customer_id: selectedCustomerId, training_note: data.training_note.replace(/\r?\n/g, '<br/>'), training_date: trainingDate ? Moment(trainingDate).format('YYYY-MM-DD HH:mm:ss') : '' };

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


            const url = API_URL + "saveTrainingNote";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                setListUpdated(true);

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated training notes!' })

            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating training note!' })
            }

            setTrainingPopup(false);
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
            training_note: note.training_note_text.replaceAll('<br/>', '\n'),
            training_note_id: note.training_note_id,
            training_note_assigned_to: note.training_note_assigned_to
        });
        if (note.training_note_date && note.training_note_date !== '0000-00-00 00:00:00') {
            setTrainingDate(new Date(note.training_note_date));
        } else {
            setTrainingDate();
        }
    }

    const changeRemDate = (selectedtype) => {

        if (selectedtype === 'tomorrow') {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            setTrainingDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1w') {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            setTrainingDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '2w') {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            setTrainingDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1m') {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            setTrainingDate(new Date(date).setHours(9, 0, 0));
        }
    };

    const handleTrainingDateChange = (date) => {
        const selectedHour = new Date(date).getHours();
        if (selectedHour === 0) {
            setTrainingDate(new Date(date).setHours(9, 0, 0));
        } else {
            setTrainingDate(date);
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
                            <DynamicTable columns={columns} data={subscriptions} fromNumber={fromNumber} toNumber={toNumber} getSubscriptionsList={getSubscriptionsList} totalCount={totalCount} activeCustomerCount={activeCustomerCount} showReminderPopup={showReminderPopup} remindercount={remindercount} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal size="lg" show={trainingPopup} onHide={() => setTrainingPopup(false)} backdrop="static">
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
                                                            <img className="media-object img-radius comment-img" src={note.training_note_by === 'admin' ? adminprofile : note.training_note_by === 'Shams' ? shamsprofile : note.training_note_by === 'Shamnad' ? shamnadprofile : note.training_note_by === 'Rasick' ? rasickprofile : note.training_note_by === 'Ajmal' ? ajmalprofile : note.training_note_by === 'Celine' ? celineprofile : note.training_note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading text-muted">{note.training_note_by}
                                                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:mm')}</span>
                                                                {note.training_note_by === loginUserName && <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                                                    <i className="fas fa-pencil-alt"></i>
                                                                </span>}

                                                                {findDateDifference(note.training_note_date) === 1 || findDateDifference(note.training_note_date) === 0 ?
                                                                    <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'red' }}>{note.training_note_date !== '0000-00-00 00:00:00' ? '[' + note.training_note_date + ']' : ''}</span> : <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'black' }}>{note.training_note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.training_note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span>}
                                                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Assigned to</Tooltip>}>
                                                                    <span style={{ float: 'right', fontWeight: 'bold', color: 'darkmagenta' }}><i className="fas fa-arrow-circle-right" style={{ marginRight: '10px' }}></i>
                                                                        {note.training_note_assigned_to}</span>
                                                                </OverlayTrigger>

                                                            </h6>
                                                            <p style={{ color: 'black', margin: 0 }}>{ReactHtmlParser(note.training_note_text)} </p>
                                                            {note.training_note_rectified === 'true' && <p style={{ color: 'blue', margin: 0 }}>[Rectified on {Moment(note.rectified_date).format('DD-MM-YYYY HH:mm')}  -  {ReactHtmlParser(note.rectified_text)}]</p>}
                                                            {note.remove_reminder_text && <p style={{ fontStyle: 'italic', margin: 0 }}>[{ReactHtmlParser(note.remove_reminder_text)}] </p>}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </ScrollToBottom>}

                                    <Form key="trainingform" onSubmit={handleSubmit1(saveTrainingNote)}>
                                        <Row className='mb-2'>
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
                                            <Col md="3"></Col>
                                            <Col md="3">
                                                <Form.Group controlId="exampleForm.ControlSelect2">
                                                    <Form.Control as="select" {...register1('training_note_assigned_to')}>
                                                        <option value="Shamnad">{loginUserId === '3' ? 'Self' : 'Shamnad'}</option>
                                                        <option value="Celine">{loginUserId === '7' ? 'Self' : 'Celine'}</option>
                                                        <option value="Shams">{loginUserId === '5' ? 'Self' : 'Shams'}</option>
                                                        <option value="Rasick">{loginUserId === '2' ? 'Self' : 'Rasick'}</option>
                                                        <option value="Ajmal">{loginUserId === '6' ? 'Self' : 'Ajmal'}</option>
                                                        <option value="Shone">{loginUserId === '8' ? 'Self' : 'Shone'}</option>
                                                        <option value="Ajmal_m">{loginUserId === '10' ? 'Self' : 'Ajmal_m'}</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <DatePicker
                                                    placeholderText='Select date'
                                                    // todayButton={"Today"}
                                                    selected={trainingDate}
                                                    onChange={handleTrainingDateChange}
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


                                        <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...register1('training_note')} />

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
                        <Row style={{ height: '295px', overflowY: 'scroll' }}>
                            <Col md={4}>
                                <label className='mb-2' style={{ color: '#000' }}>1st:</label>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Fleet Manager</Form.Label>
                                    <Form.Control rows="1" {...register('fleet_manager')} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea2">
                                    <Form.Label>Driver Expenditure Application</Form.Label>
                                    <Form.Control rows="1" {...register('driver_expture_app')} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea3">
                                    <Form.Label>Task Manager</Form.Label>
                                    <Form.Control rows="1" {...register('task_manager')} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea4">
                                    <Form.Label>Fuel Card (ADNOC/ENOC)</Form.Label>
                                    <Form.Control rows="1" {...register('fuel_card')} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea5">
                                    <Form.Label>Salik</Form.Label>
                                    <Form.Control rows="1" {...register('salik')} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea6">
                                    <Form.Label>Which module the most preferred (by comma)</Form.Label>
                                    <Form.Control rows="1" {...register('preferred_module')} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea7">
                                    <Form.Label>Actual Vehicle Count</Form.Label>
                                    <Form.Control rows="1" {...register('actual_veh_count')} />
                                </Form.Group>

                                <Form.Group controlId="exampleForm.ControlTextarea13">
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Control type="number" {...register('first_training_duration', {valueAsNumber: true,})} />
                                </Form.Group>

                                
                                <Form.Group style={{ width: '50%', float: 'left' }}>
                                    <div className="checkbox d-inline checkbox-success">
                                        <Form.Control type="checkbox" name="send_contact_details_whatsapp" id="danger-checkbox-1"  {...register('send_contact_details_whatsapp')} />
                                        <Form.Label htmlFor="danger-checkbox-1" className="cr"></Form.Label>
                                    </div>
                                    <Button variant="success"><i className="fab fa-whatsapp" style={{ marginRight: '4px' }}></i> Contact</Button>
                                </Form.Group>
                                <Form.Group style={{ width: '50%', float: 'right' }}>
                                    <div className="checkbox d-inline checkbox-primary">
                                        <Form.Control type="checkbox" name="send_contact_details_mail" id="danger-checkbox-2"  {...register('send_contact_details_mail')} />
                                        <Form.Label htmlFor="danger-checkbox-2" className="cr"></Form.Label>
                                    </div>
                                    <Button><i className="far fa-envelope" style={{ marginRight: '4px' }}></i> Contact</Button>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <label className='mb-2' style={{ color: '#000' }}>2nd:</label>
                                <Form.Group controlId="exampleForm.ControlTextarea8">
                                    <Form.Label>ERP Integration</Form.Label>
                                    <Form.Control rows="1" {...register('erp_used')} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea9">
                                    <Form.Label>Accounting Tool</Form.Label>
                                    <Form.Control rows="1" {...register('accounting_sft')} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea10">
                                    <Form.Label>Attendance System (office and Outdoor)</Form.Label>
                                    <Form.Control rows="1" {...register('attendance_system')} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea11">
                                    <Form.Label>Garage</Form.Label>
                                    <Form.Control rows="1" {...register('garage')} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea12">
                                    <Form.Label>Rental Vehicles</Form.Label>
                                    <Form.Control rows="1" {...register('rental_vehicles')} />
                                </Form.Group>

                                <Form.Group controlId="exampleForm.ControlTextarea13">
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Control type="number" {...register('second_training_duration', {valueAsNumber: true,})} />
                                </Form.Group>

                                <Form.Group style={{ width: '50%', float: 'left' }}>
                                    <div className="checkbox d-inline checkbox-success" style={{ margin: 0 }}>
                                        <Form.Control type="checkbox" name="send_thankyou_msg_whatsapp" id="danger-checkbox-3"  {...register('send_thankyou_msg_whatsapp')} />
                                        <Form.Label htmlFor="danger-checkbox-3" className="cr"></Form.Label>
                                    </div>
                                    <Button variant="success"><i className="fab fa-whatsapp" style={{ marginRight: '4px' }}></i> Thank you</Button>
                                </Form.Group>
                                <Form.Group style={{ width: '50%', float: 'right' }}>
                                    <div className="checkbox d-inline checkbox-primary" style={{ margin: 0 }}>
                                        <Form.Control type="checkbox" name="send_thankyou_msg_mail" id="danger-checkbox-4"  {...register('send_thankyou_msg_mail')} />
                                        <Form.Label htmlFor="danger-checkbox-4" className="cr"></Form.Label>
                                    </div>
                                    <Button style={{ margin: '0' }}><i className="far fa-envelope" style={{ marginRight: '4px' }}></i> Thank you</Button>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <label className='mb-2' style={{ color: '#000' }}>3rd:</label>
                                <Form.Group controlId="exampleForm.ControlTextarea13">
                                    <Form.Label>Group of Companies</Form.Label>
                                    <Form.Control rows="1" {...register('group_of_companies')} />
                                </Form.Group>

                                <Form.Group controlId="exampleForm.ControlTextarea13">
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Control type="number" {...register('third_training_duration', {valueAsNumber: true,})} />
                                </Form.Group>
                                
                                <Form.Group>
                                    <div className="checkbox d-inline checkbox-success">
                                        <Form.Control type="checkbox" name="send_monthly_email" id="danger-checkbox-5"  {...register('send_monthly_email')} />
                                        <Form.Label htmlFor="danger-checkbox-5" className="cr"></Form.Label>
                                    </div>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={<Tooltip id={`tooltip-top`}>Send from App</Tooltip>}
                                    >
                                        <Button variant="success">Monthly <i className="far fa-envelope" style={{ marginRight: '0', marginLeft: '4px' }}></i></Button>
                                    </OverlayTrigger>
                                </Form.Group>
                                <Form.Group>
                                    <div className="checkbox d-inline checkbox-primary">
                                        <Form.Control type="checkbox" name="send_sales_email" id="danger-checkbox-6"  {...register('send_sales_email')} />
                                        <Form.Label htmlFor="danger-checkbox-6" className="cr"></Form.Label>
                                    </div>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={<Tooltip id={`tooltip-top`}>Send from App</Tooltip>}
                                    >
                                        <Button>Sales <i className="far fa-envelope" style={{ marginRight: '0', marginLeft: '4px' }}></i></Button>
                                    </OverlayTrigger>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group controlId="exampleForm.ControlTextarea14">
                                    <Form.Label>Confirm Referral</Form.Label>
                                    <Form.Control as="textarea" rows="2" {...register('referral_possibility')} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <label className='form-label mt-3' style={{ color: '#000' }}>Contact Details</label>
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
                            <Col><Button variant='info' onClick={() => handleAddContact()} style={{ margin: '0 48% 0' }}><i className="fas fa-plus m-r-5" style={{ margin: 0 }} /></Button></Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" type='submit' className="mt-0 mb-0">Submit</Button>
                        <Button variant="secondary" className="m-0" onClick={() => setupdatepopup(false)}>Close</Button>
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
                                                <th style={{ width: '25%' }}>Customer Name</th>
                                                {selectedRemType !== 'self' && <th style={{ width: '8%' }}>Assgn. To</th>}
                                                <th style={{ width: '8%' }}>Qty</th>
                                                <th style={{ width: '15%' }}>Date</th>
                                                <th style={{ width: '32%' }}>Note</th>
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
                                                        {reminder.training_note_rectified === 'true' && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Rectified</Tooltip>}>
                                                            <i className="fa fa-check" style={{ color: 'green' }}></i>
                                                        </OverlayTrigger>}
                                                    </td>
                                                    <td onClick={() => updateMNote(reminder)}>
                                                        <img className="left-logo" style={{ borderRadius: '50%', width: '40px' }} src={reminder.training_note_by === 'admin' ? adminprofile : reminder.training_note_by === 'Shams' ? shamsprofile : reminder.training_note_by === 'Shamnad' ? shamnadprofile : reminder.training_note_by === 'Rasick' ? rasickprofile : reminder.training_note_by === 'Ajmal' ? ajmalprofile : reminder.training_note_by === 'Celine' ? celineprofile : reminder.training_note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                                    </td>
                                                    <td onClick={() => updateMNote(reminder)}>{reminder.customer_name}<br />
                                                        <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Created on</Tooltip>}><span style={{ fontSize: '11px' }}>{Moment(reminder.created_at).format('DD-MM-YYYY HH:mm')}</span></OverlayTrigger>
                                                    </td>
                                                    {selectedRemType !== 'self' && <td>{reminder.training_note_assigned_to}</td>}
                                                    <td onClick={() => updateMNote(reminder)}>{reminder.count + reminder.Noconnection}</td>
                                                    <td onClick={() => updateMNote(reminder)}>{Moment(reminder.training_note_date).format('DD-MM-YYYY HH:mm')}</td>
                                                    <td onClick={() => updateMNote(reminder)}>{ReactHtmlParser(reminder.training_note_text)}
                                                        {reminder.training_note_rectified === 'true' && <span style={{ color: 'blue' }}><br />{ReactHtmlParser(reminder.rectified_text)}<span style={{ fontSize: '11px', marginLeft: '5px' }}>{'(' + Moment(reminder.rectified_date).format('DD-MM-YYYY HH:mm') + ')'}</span></span>}
                                                    </td>
                                                    <td>
                                                        {reminder.training_note_rectified !== 'true' && reminder.training_note_assigned_to === loginUserName && reminder.training_note_assigned_to !== reminder.training_note_by && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Rectify reminder</Tooltip>}>

                                                            <Button onClick={() => showRectifiedTextPopup(reminder.customer_id, reminder.training_note_id)} variant="warning" style={{ padding: '6px' }}>
                                                                <i className="fa fa-check" style={{ margin: 0 }}></i>
                                                            </Button>
                                                        </OverlayTrigger>}
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => showRemoveReminderTextPopup(reminder.training_note_id)} variant="danger" style={{ padding: '6px' }}>
                                                            <i className="far fa-calendar-times" style={{ margin: 0 }}></i>
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => updateMNote(reminder)} variant="success" style={{ padding: '6px' }}>
                                                            <i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => updateReminder(reminder)} variant="primary" style={{ padding: '6px' }}>
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

            <Modal show={statusPopup} onHide={() => setStatusPopup(false)} backdrop="static" style={{ top: '35px', borderWidth: '2px' }}>
                <Form onSubmit={handleSubmitStatusEdit(editStatus)}>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlText13">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as="select" {...registerStatusEdit('customer_status')} name="customer_status">
                                        <option value="demoaccount">Demo Account</option>
                                        <option value="new">New</option>
                                        <option value="active">Active</option>
                                        <option value="blocked">Blocked</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        {watchStatusChange("customer_status") === 'blocked' ? (
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="exampleForm.ControlSelect2">
                                        <Form.Control as="textarea" rows="3" name="reason" placeholder='Reason' {...registerStatusEdit('blocked_reason')} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        ) : null}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" type='submit'>Submit</Button>
                        <Button variant="secondary" onClick={() => setStatusPopup(false)}>Close</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </React.Fragment>
    );

}

export default App