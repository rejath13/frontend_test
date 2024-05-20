import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { Row, Col, Card, Pagination, Table, Modal, Field, Button, OverlayTrigger, Tooltip, Form, Tabs, Tab, Badge, ButtonGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import './vehicle.css';
import { API_URL } from "../../config/constant";
import ReactHtmlParser from 'react-html-parser';
import ScrollToBottom from 'react-scroll-to-bottom';
import Datetime from 'react-datetime';
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

function DynamicTable({ columns, data, fromNumber, toNumber, getVehiclesList, totalCount, addVehicle, viewReminderPopup, fnremainder,dueCount,TodayCount,upcomingCount,RectCount
}) {

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

    const [selectedStatus, setSelectedStatus] = useState('active');
    const [searchtext, setSearchText] = useState(null);
    const [updateList, setupdateList] = useState(false);
    const [rectifiedFilter, setRectifiedFilter] = useState(false);
    const [selectedRemType, setSelectedRemType] = useState('self');
    const [remSearchDate, setRemSearchDate] = useState('today');
    const [searchReminder, setSearchReminder] = useState(null);
    const [rmode, setrmode] = useState(false); 
    const loginUserId = localStorage.getItem('loginUserId');

    const onChangeSearchtext = (e) => {
        setSearchText(e.target.value);
    };

    const clearsearch = () => {
        setSearchText(null);
        if (pageIndex > 0) {
          gotoPage(0);
        } else {
          setupdateList(updateList === true ? false : true)
        }
    }

     const filterRectifiedReminders = () => {
        setRectifiedFilter(rectifiedFilter === true ? false : true);
        setupdateList(updateList === true ? false : true)
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
        setSearchText(null);
        if (pageIndex > 0) {
            gotoPage(0);
        }
        else
            setupdateList(updateList ? false : true);
    }

    const calladdvehicle = () => {
        addVehicle();
    }
    const callfnremainder = (e) => {
        var checked = e.target.checked;
        //fnremainder(checked);
        if (checked)
           setrmode(true);
        else
            setrmode(false);

        setRectifiedFilter(false);
        setSelectedRemType('self');
        //setRemSearchDate('today');
        setSearchReminder(null);
    }

    const clearReminderSearch = () => {
        setSearchReminder(null);
        setupdateList(updateList ? false : true);
    }


    useEffect(() => {
        
        getVehiclesList({ pageIndex, searchtext, sortBy, selectedStatus,rectifiedFilter ,selectedRemType,remSearchDate,rmode,searchReminder});
    }, [sortBy, pageIndex, updateList, rmode])

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
                    <Col xs={1} style={{ color: 'black' }}><span style={{ top: '12px', position: 'relative' }}>{rmode===false&&totalCount>0? <b>Total : {totalCount}</b>:''}</span></Col>
                    <Col xs={2}>
                        <Form.Group>
                            <div className="switch d-inline m-r-10">
                                <Form.Control type="checkbox" id="checked-remainder" onChange={(e) => { callfnremainder(e); }} />
                                <Form.Label htmlFor="checked-remainder" className="cr" />
                            </div>
                            <Form.Label>

                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Due/Today</Tooltip>}
                                >
                                    <span>Reminders {dueCount > 0 || TodayCount>0 && '[' + dueCount + '/'+ TodayCount+ ']'}</span>
                                </OverlayTrigger>                        
                                
                            </Form.Label>
                        </Form.Group>
                    </Col>
                    {rmode?
                        <>
                            <Col xs="5">
                                <ButtonGroup>
                                    {selectedRemType !== 'others' && rectifiedFilter === false &&
                                        <><Button variant={remSearchDate === 'today' ? 'warning' : 'outline-warning'}
                                            onClick={() => {
                                                setRemSearchDate('today');
                                                setupdateList(updateList === true ? false : true)
                                            }}>Today&nbsp;({TodayCount}) </Button>

                                            <Button variant={remSearchDate === 'due' ? 'warning' : 'outline-warning'} onClick={() => {
                                                setRemSearchDate('due');
                                                setupdateList(updateList === true ? false : true)
                                            }} style={{ padding: '10px 20px' }}>Due&nbsp;({dueCount})</Button>

                                            <Button variant={remSearchDate === 'upcoming' ? 'warning' : 'outline-warning'} onClick={() => {
                                                setRemSearchDate('upcoming');
                                                setupdateList(updateList === true ? false : true)
                                            }}>Upcoming&nbsp;({upcomingCount})</Button></>
                                    }
                                    <Button variant={rectifiedFilter === true ? 'warning' : 'outline-warning'} onClick={() => filterRectifiedReminders()}>Rectified&nbsp;({RectCount})</Button>
                                </ButtonGroup>
                            </Col>

                        <Col xs="1">
                            <Form.Control as="select" value={selectedRemType} onChange={(e) => {
                                setSelectedRemType(e.target.value);
                                setupdateList(updateList === true ? false : true)
                                setRectifiedFilter(false);
                            }}>
                                <option value="self">Self</option>
                                <option value="others">Others</option>
                            </Form.Control>
                        </Col>

                        <Col xs={2}>
                            <Form.Control placeholder="Search..." value={searchReminder || ''} onChange={(e) => {
                                const keyword = e.target.value;
                                if (!keyword)
                                    setSearchReminder(null);
                                else
                                    setSearchReminder(keyword)
                            }} onKeyPress={(e) => {
                                if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                    e.preventDefault();
                                    setupdateList(updateList ? false : true);
                                }
                            }} />
                            {searchReminder && <button type="button" class="react-datepicker__close-icon" onClick={clearReminderSearch} style={{ right: '2px', height: '90%' }}></button>}
                        </Col>
                        <Col xs={1}>
                            <button
                                className="text-capitalize btn btn-success"
                                type="button"
                                onClick={()=>setupdateList(updateList ? false : true)}
                            >
                                <i className="feather icon-search" style={{ margin: 0, fontSize: '16px' }}></i>
                            </button>
                        </Col>

                        </>
                    :
                    
                    <>
                    <Col xs={1}>

                        <Form.Control as="select" value={selectedStatus} onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setupdateList(updateList ? false : true);
                            }}>
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="offline">Offline</option>
                            <option value="blocked">Blocked</option>
                            <option value="duplicates">Duplicates</option>
                        </Form.Control>
                    </Col>
                    <Col xs={2}>
                        <Form.Control placeholder="Search..." value={searchtext || ''} onChange={onChangeSearchtext} onKeyPress={handleKeypress} />
                        {searchtext && <button type="button" class="react-datepicker__close-icon" onClick={clearsearch} style={{ right: '2px', height: '90%' }}></button>}
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
                            className="text-capitalize btn btn-danger"
                            type="button"
                            onClick={clearAllFilters}
                        >
                            <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
                        </button>
                        <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Add New Vehicle</Tooltip>}
                        >
                            <Button onClick={() => calladdvehicle()} className='text-capitalize' variant="primary" ><i className="feather icon-plus" style={{ margin: '0px', fontWeight: 'bold' }}></i></Button>
                        </OverlayTrigger>
                    </Col>
                    </>
                }  

                {rmode===false && 
                    <Col xs={1}>{loginUserId === '1' ? 
                        <form action={`${API_URL}vehicles?page=1`} method="post" target="_blank">

                            <input type="hidden" name="keyword" value={searchtext} />

                            <input type="hidden" name="status" value={selectedStatus} />

                            <input type="hidden" name="export" value="true" />

                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Excel Export</Tooltip>}
                            >
                                <button value="1" className="text-capitalize btn btn-primary m-0" type="submit" style={{ float: 'right' }}><i class="fas fa-file-export" style={{ margin: '0px' }}></i></button>
                            </OverlayTrigger>
                        </form>: ''}
                    </Col>
                } 
                  
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
    const [vehicles, setvehicle] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [dueCount, setdueCount] = useState(null);
    const [TodayCount, setTodayCount] = useState(null);
    const [upcomingCount, setupcomingCount] = useState(null);
    const [RectCount, setRectCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [vehiclePopup, setvehiclePopup] = useState(false);
    const [blockedPopup, setblockedPopup] = useState(false);
    const [vehicleeditPopup, setvehicleeditPopup] = useState(false);
    const [listupdated, setListUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [mode, setMode] = useState('active');
    const [sortType, setSortType] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [vehicleaccount, getvehicleaccount] = useState([]);
    const [jobDetails, setjobDetails] = useState([]);
    const [installDate, setinstallDate] = useState();
    const [blockDate, setblockDate] = useState();
    const [selectedvehicleId, setselectedVehicleid] = useState(0);
    const [selectedvehicleName, setselectedVehicleName] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const [monitoringblockedPopup, setMonitoringblockedPopup] = useState(false);
    const [notearray, setNoteArray] = useState([]);
    const [monitoringblockedDate, setMonitoringblockedDate] = useState();
    const [vehicle_blocked, setvehicle_blocked] = useState(false);
    const [duplicates, setDuplicates] = useState(false);

    const [notePopup, setNotePopup] = useState(false);
    const [reminderDate, setReminderDate] = useState('');
    const [reminderArray, setReminderArray] = useState([]);
    const loginUserId = localStorage.getItem('loginUserId');
    const loginUserName = localStorage.getItem('loginUserName');

    const [reminders, setReminders] = useState([]);
    const [remaindermode, setremaindermode] = useState(false);
    const [remindertextPopup, setReminderTextPopup] = useState(false);

    const [reminderPopup, setReminderPopup] = useState(false);    
    const [rectifiedFilter, setRectifiedFilter] = useState(false);
    const [selectedRemType, setSelectedRemType] = useState('self');
    //const [remSearchDate, setRemSearchDate] = useState('today');
    const [searchReminder, setSearchReminder] = useState(null);

    const [refreshReminders, setRefreshReminders] = useState(false);
    const [rectifytextPopup, setRectifyTextPopup] = useState(false);
    const [isPopupLoading, setIsPopupLoading] = useState(false);





 

    const clearReminderSearch = () => {
        setSearchReminder(null);
        setRefreshReminders(refreshReminders === true ? false : true);
    }

    const fnremainder = async(checked) => {
     var val=checked;
        if (val===true)
           setremaindermode(true);
        
        else
                setremaindermode(false);

        
    }

 
    const updateMNote = (reminderdata) => {
        setselectedVehicleid(reminderdata.vehicle_traccar_id);
        showReminderPopup(reminderdata);
    }

    const { register: registerRectifyReminder, handleSubmit: handleSubmitRectifyReminder, reset: resetRectifyReminder } = useForm({
        defaultValues: {
            rectified_text: '',
            reminder_id: 0,
            reminder_vehicle_id: 0
        },
    });

    const showRectifiedTextPopup = (vehicleid, id) => {
        resetRectifyReminder({
            rectified_text: '',
            reminder_id: id,
            reminder_vehicle_id: vehicleid
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

            const url = API_URL + "rectifyVehicleReminder";

            const response = await fetch(url, options)

            const data = await response.json();

            setRectifyTextPopup(false);

            setListUpdated(true);

            sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully rectified reminder!' })
        }
        catch {

        }
    }

    const { register: registerRemoveReminder, handleSubmit: handleSubmitRemoveReminder, reset: resetRemoveReminder } = useForm({
        defaultValues: {
            remove_reminder_text: '',
            reminder_id: 0,
            reminder_vehicle_id: 0
        },
    });

    const showRemoveReminderTextPopup = (vehicleid, id) => {
        resetRemoveReminder({
            remove_reminder_text: '',
            reminder_id: id,
            reminder_vehicle_id: vehicleid
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

            const url = API_URL + "removeVehicleReminder";

            const response = await fetch(url, options)

            const data = await response.json();

            setReminderTextPopup(false);

            setListUpdated(true);

            sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully removed reminder!' })
        }
        catch {

        }
    }

    const { register, handleSubmit, reset, getValues } = useForm({
        defaultValues: {
            vehicle_name: '',
            customer_name: '',
            vehicle_imei: '',
            vehicle_sim: '',
            vehicle_installed_date: '',
            vehicle_warranty: '',
            vehicle_pwd: '',
            vehicle_profile: '',
            vehicle_blocked: false,
            blocked_date: '',
            blocked_by: '',
            vehicle_ownership: '',
            vehicle_pswd_profile: '',
            vehicle_device_type: '',
            vehicle_data: '',
            vehicle_sim_ownership: '',
            blocked_details: '',
            vehicle_sim_note: '',
            vehicle_comment: '',
            vehicle_id: '',
            vehicle_sim_4g: '',
            duplicate_vehicle:false
        },
    });

    const handleMonitoringblockedDateChange = (date) => {
        setMonitoringblockedDate(date);
    };

    const addVehicle = () => {
        setselectedVehicleid(0);
        setIsDisabled(false);
        setvehicleeditPopup(true);
        reset({
            vehicle_name: '',
            customer_name: '',
            vehicle_imei: '',
            vehicle_sim: '',
            vehicle_installed_date: '',
            vehicle_warranty: '',
            vehicle_pwd: '',
            vehicle_sim_4g: '',
            vehicle_profile: '',
            vehicle_blocked: false,
            blocked_date: '',
            blocked_details: '',
            vehicle_sim_note: '',
            vehicle_comment: '',
            vehicle_id: '',
            blocked_by: '',
            vehicle_ownership: '',
            vehicle_pswd_profile: '',
            vehicle_device_type: '',
            vehicle_data: '',
            vehicle_sim_ownership: '',
            duplicate_vehicle:false
        });
    }

    const {
        register: register1,
        handleSubmit: handleSubmit1,
        reset: reset1
    } = useForm({
        defaultValues: {
            blocked_note: '',
            blocked_note_id: 0
        }
    });

    const {
        register: registerReminder,
        handleSubmit: handleSubmitReminder,
        reset: resetReminder
    } = useForm({
        defaultValues: {
            vehicle_note_text: '',
            vehicle_note_date: '',
            vehicle_note_id: 0,
            vehicle_note_assigned_to: loginUserName
        }
    });

    const fillformtoedit = (note) => {
        resetReminder({
            vehicle_note_text: note.vehicle_note_text.replaceAll('<br/>', '\n'),
            vehicle_note_id: note.vehicle_note_id
        });
        if (note.vehicle_note_date && note.vehicle_note_date !== '0000-00-00 00:00:00') {
      setReminderDate(new Date(note.vehicle_note_date));
    } else {
      setReminderDate();
    }
    }

    const changeMonitoringDate = () => {

        const date = new Date();
        setMonitoringblockedDate(new Date(date));
    };

    const handleinstallDateChange = (date) => {
        setinstallDate(new Date(date));
        reset({ ...getValues(), vehicle_installed_date: new Date(date) });
    }

    const handleblockDateChange = (date) => {
        setblockDate(new Date(date));
        reset({ ...getValues(), blocked_date: new Date(date) });
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

    const getVehicle = async (vehid) => {

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }
            setDuplicates(false);
            setvehicle_blocked(false);
            const url = API_URL + "singlevehicle/" + vehid;

            const response = await fetch(url, options)

            const vehicledata = await response.json();

            setIsDisabled(true);

            setselectedVehicleid(vehid);

            const options1 = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url1 = API_URL + "getblockedvehiclenote/" + vehid;

            const response1 = await fetch(url1, options1)

            const vehiclenote = await response1.json();

            setNoteArray(vehiclenote);

            setblockedPopup(false);

            if (vehicledata.data.vehicle_installed_date === '0000-00-00' || vehicledata.data.vehicle_installed_date === null) {
                vehicledata.data.vehicle_installed_date = '';
                setinstallDate('');
            } else {
                vehicledata.data.vehicle_installed_date = new Date(vehicledata.data.vehicle_installed_date);
                setinstallDate(vehicledata.data.vehicle_installed_date);
            }

            if (vehicledata.data.vehicle_blocked_date === '0000-00-00' || vehicledata.data.vehicle_blocked_date === null) {
                vehicledata.data.vehicle_blocked_date = '';
                setblockDate('');
            } else {
                vehicledata.data.vehicle_blocked_date = new Date(vehicledata.data.vehicle_blocked_date);
                setblockDate(vehicledata.data.vehicle_blocked_date);
            }
            setDuplicates(vehicledata.data.duplicate_vehicle === 'yes' ? true : false);
            setvehicle_blocked(vehicledata.data.vehicle_blocked === 'yes' ? true : false);
            reset(vehicledata.data);



            reset({ ...getValues(), duplicate_vehicle: vehicledata.data.duplicate_vehicle === 'yes' ? true : false });
            console.log(getValues());
            setjobDetails(vehicledata.jobs);

            setvehicleeditPopup(true);
        }
        catch {

        }
    }

    const editvehicleform = async (data) => {

        data.vehicle_installed_date = Moment(new Date(data.vehicle_installed_date)).format('YYYY-MM-DD');
        data.duplicate_vehicle = data.duplicate_vehicle === true ? 'yes' : 'no';

        console.log(data);
        //data.vehicle_blocked = data.vehicle_blocked===true?'yes':'no';

        if (data.vehicle_id != '') {

            try {
                const options = {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken
                    },
                    body: JSON.stringify(data),
                };

                const url = API_URL + "editvehicle/" + data.vehicle_id;

                const response = await fetch(url, options)

                const data1 = await response.json();

                if (data1.status === 'success') {
                    sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully edited  !' })
                    setListUpdated(true);
                }
                else
                    sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in editing  !' })
            }
            catch
            {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in editing  !' })
            }

        }
        else {

            try {
                const options = {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken
                    },
                    body: JSON.stringify(data),
                };

                const url = API_URL + "addvehicle";

                const response = await fetch(url, options)

                const data1 = await response.json();

                if (data1.status === 'success') {
                    sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully Added  !' })
                    setListUpdated(true);
                }
                else
                    sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in Added  !' })
            }
            catch
            {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in Added  !' })
            }
        }
    }

    const saveBlockedNote = async (data) => {

        const postdata = { blocked_vehicle_note_vehicle_id: selectedvehicleId, blocked_vehicle_note_text: data.blocked_note.replace(/\r?\n/g, '<br/>'), blocked_vehicle_note_date: monitoringblockedDate ? Moment(monitoringblockedDate).format('YYYY-MM-DD HH:mm') : '', blocked_note_id: data.blocked_note_id };

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


            const url = API_URL + "saveBlockedNote";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                setListUpdated(true);

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated notes!' })

            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating note!' })
            }

            setMonitoringblockedPopup(false);
        }
        catch {

        }
    }

    const getVehicleAccountsList = async (vehicleid) => {

        const options = {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Xtoken': authToken
            }
        }

        const url = API_URL + "getVehiclesAllAccount/" + vehicleid;

        const response = await fetch(url, options)

        const vehicle = await response.json();

        getvehicleaccount(vehicle);

        setvehiclePopup(true);
    }

    const showReminderPopup = async (vehicle) => {

        setIsLoading(true);

        setselectedVehicleid(vehicle.vehicle_traccar_id);
        setselectedVehicleName(vehicle.vehicle_name);

        try {
            const options = {
                method: 'get',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                  'Xtoken': authToken
                }
            }

            const url = API_URL + "getVehicleNotes/" + vehicle.vehicle_traccar_id;

            const response = await fetch(url, options)

            const data = await response.json();

            setReminderArray(data.data);

            setNotePopup(true);

            setIsLoading(false);
        }
        catch {

        }

        setReminderDate('');

        resetReminder({
          vehicle_note_text: '',
          vehicle_note_id: 0,
          vehicle_note_date: '',
          vehicle_note_assigned_to: loginUserName
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

  const loginToWeb = (email, pswd) => {

    const weburl = 'https://mylocatorplus.com/office-use/#/access/signin?username=' + window.btoa(email) + '&password=' + window.btoa(pswd);
    window.open(weburl, '_blank');
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

    const submitReminder = async (data) => {

        const postdata = { ...data, vehicle_note_vehicle_id: selectedvehicleId, vehicle_note_text: data.vehicle_note_text.replace(/\r?\n/g, '<br/>'), vehicle_note_date: reminderDate ? Moment(reminderDate).format('YYYY-MM-DD HH:mm:ss') : '' };

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

            const url = API_URL + "saveVehicleNote";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated reminder!' });
                setNotePopup(false);
                setListUpdated(true);
            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating reminder!' })
            }
        }
        catch {

        }
    }

    const fnblocked = async (e, id) => {

        if (e == 'comment') {
            var checked = true;
            const options1 = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url1 = API_URL + "getblockedvehiclenote/" + id;

            const response1 = await fetch(url1, options1)

            const vehiclenote = await response1.json();
            setNoteArray(vehiclenote);
            setselectedVehicleid(id);
        }
        else
            var checked = e.target.checked;

        if (checked) {
            reset({
                ...getValues(),
                vehicle_blocked: true,
                blocked_date: '',
                blocked_details: '',
            });
            setMonitoringblockedPopup(true);
        } else {
            reset({
                ...getValues(),
                vehicle_blocked: false,
                blocked_date: '',
                blocked_details: '',
            });
            setMonitoringblockedPopup(false);
        }
    }

    const fnduplicates = (e) => {
        const checked = e.target.checked;
        var value='';
        if(checked)
            value=true;
        else
            value=false;

            reset({
                ...getValues(),
                duplicate_vehicle: value,
            });
            setDuplicates(value);
    }

    const checkDeviceNC = (date) => {

        var yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
        
        var date = new Date(date);

        let ms1 = yesterday.getTime();
        let ms2 = date.getTime();

        if (ms2 < ms1) {
            return true;
        }
    }
 

      const columns2 = React.useMemo(
        () => [
            
        
           {
                Header: '',
                accessor: 'cl2',
                className: 'simplecolumn',
                Cell: ({ row }) => {

                    return (
                       <img className="left-logo" style={{ borderRadius: '50%', width: '40px' }} src={row.original.vehicle_note_by === 'admin' ? adminprofile : row.original.vehicle_note_by === 'Shams' ? shamsprofile : row.original.vehicle_note_by === 'Shamnad' ? shamnadprofile : row.original.vehicle_note_by === 'Rasick' ? rasickprofile : row.original.vehicle_note_by === 'Ajmal' ? ajmalprofile : row.original.vehicle_note_by === 'Celine' ? celineprofile : row.original.vehicle_note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                    );

                }
            },
               {
                Header: 'Vehicle & Customer Name',
                accessor: 'cl3',
                className: 'vehiclecolumn',
                Cell: ({ row }) => {

                    return (
                         <span>
                        {row.original.vehicle_name}<br />{row.original.customer_name} ({row.original.customer_username})<br/><OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Created on</Tooltip>}><span style={{ fontSize: '11px' }}>{Moment(row.original.created_at).format('DD-MM-YYYY HH:mm')}</span></OverlayTrigger>
                         </span>
                    );

                }
            },
            {
                Header: 'Assigned To',
                accessor: 'vehicle_note_assigned_to',
                className: 'simplecolumn'
            },
            {
                Header: 'Date',
                accessor: 'cl5',
                className: 'remdatecolumn',
                Cell: ({ row }) => {

                    return (
                       <span className={getDifferenceInDays(row.original.vehicle_note_date) ? 'redText' : ''}>{row.original.vehicle_note_date !== '0000-00-00 00:00:00' ? Moment(row.original.vehicle_note_date).format('DD-MM-YYYY HH:mm') : ''}</span>
                    );

                }
            },
            {
                Header: 'Last Updated Time',
                accessor:'vehicle_last_updated_time',
                className: 'lstupdatecolumn'
            },
            {
                Header: 'Note',
                accessor: 'cl6',
                className: 'vehiclenotecolumn',
                Cell: ({ row }) => {

                    return ( <span>
                       {ReactHtmlParser(row.original.vehicle_note_text)}
                                                            {row.original.vehicle_note_rectified === 'true' && <span style={{ color: 'blue' }}><br />{ReactHtmlParser(row.original.rectified_text)}<span style={{ fontSize: '11px', marginLeft: '5px' }}>{'(' + Moment(row.original.rectified_date).format('DD-MM-YYYY HH:mm') + ')'}</span></span>} </span>
                    );

                }
            }
            ,
            {
                Header: '',
                accessor: 'cl7',
                className: 'buttonlistclm',
                Cell: ({ row }) => {

                    return ( <span style={{display:'flex'}}>
                      {row.original.vehicle_note_rectified !== 'true' && row.original.vehicle_note_assigned_to === loginUserName && row.original.vehicle_note_assigned_to !== row.original.vehicle_note_by && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Rectify reminder</Tooltip>}>

                                                                <Button onClick={() => showRectifiedTextPopup(row.original.vehicle_note_vehicle_id, row.original.vehicle_note_id)} variant="warning" style={{ padding: '6px' }}>
                                                                    <i className="fa fa-check" style={{ margin: 0 }}></i>
                                                                </Button>
                                                            </OverlayTrigger>} 
                                                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Remove reminder</Tooltip>}>

                                                                <Button onClick={() => showRemoveReminderTextPopup(row.original.vehicle_note_vehicle_id, row.original.vehicle_note_id)} variant="danger" style={{ padding: '6px' }}>
                                                                    <i className="far fa-calendar-times" style={{ margin: 0 }}></i>
                                                                </Button>
                                                            </OverlayTrigger>

                                                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Edit note</Tooltip>}>
                                                                <Button onClick={() => updateMNote(row.original)} variant="success" style={{ padding: '6px' }}>
                                                                    <i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                                                </Button>
                                                            </OverlayTrigger>
                                                             <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Edit Vehicle</Tooltip>}>
    <Button onClick={() => getVehicle(row.original.vehicle_note_vehicle_id)} variant="primary" style={{ padding: '6px' }}>
                                                                    <i class="fa fa-edit" style={{ fontWeight: 'normal', margin: 0 }}></i>
                                                                </Button>
                                                            </OverlayTrigger>
                                                            </span>
                    );

                }
            
            }])

    const columns = React.useMemo(
        () => [
            
            {
                Header: 'Vehicle Name',
                accessor: 'vehicle_name',
                className: 'vehiclecolumn',
                Cell: ({ row }) => {

                    return (
                        <span>
                            <span className="pointer" onClick={() => getVehicle(row.original.vehicle_traccar_id)}>{row.original.vehicle_name}</span>
                            &nbsp;
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Account List</Tooltip>}>
                                    <i className="fa fa-eye pointer" onClick={() => getVehicleAccountsList(row.original.vehicle_traccar_id)} style={{ fontWeight: 'normal', margin: 0 }}></i>
                                    </OverlayTrigger>
                            &nbsp;&nbsp;
                        {(row.original.vehicle_blocked === 'yes'||row.original.customer_status==='blocked')?<span>
                                <OverlayTrigger placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Blocked</Tooltip>}>
                                    <Badge variant="danger" style={{ fontSize: '13px', minWidth: '10px' }}>B</Badge>
                                </OverlayTrigger>
                            </span>:''}
                    
                    {checkDeviceNC(row.original.vehicle_last_updated_time)?
                        <span>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>No Connection</Tooltip>}>
                                    <Badge variant="secondary" style={{ fontSize: '13px', minWidth: '10px' }}>NC</Badge>
                                </OverlayTrigger>
                            </span>:''}</span>
                    );

                }
            },
            {
                Header: 'Customer Name/UserName',
                accessor: 'customer_name',
                className: 'namecolumn',
                Cell: ({ row }) => {

                    return (<span>{row.original.customer_name} ({row.original.customer_username})
                        <br />
                        <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Customer Status</Tooltip>}
                        >
                            <span className={row.original.customer_status==='blocked'?'redtext':'greentext'} style={{ 'text-transform': 'capitalize' }}>{row.original.customer_status==='followup'?'Newly Created':row.original.customer_status}</span>
                        </OverlayTrigger>
                    </span>);

                }
            },
            {
                Header: 'IMEI',
                accessor: 'vehicle_imei',
                className: 'contactcolumn',
                Cell: ({ row }) => {

                    return (
                        <span><span>{row.original.vehicle_imei}
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Sim</Tooltip>}>
                                <span><br />{row.original.vehicle_sim}</span>
                            </OverlayTrigger>
                             
                        </span>
                        
                         
                            <span>
                                {row.original.vehicle_sim_ownership === 'locator' && <OverlayTrigger
                                    placement='top'
                                    overlay={<Tooltip id={`tooltip-top`}>Locator Sim</Tooltip>}>
                                    <span class="lsim">LS</span>
                                </OverlayTrigger>}</span>
                             
                        </span>
                    );
                }
            },
            {
                Header: ' Installed Date',
                accessor: 'vehicle_installed_date',
                className: 'datecolumn',
                Cell: ({ row }) => {
                    return (<span>{row.original.vehicle_installed_date !== '0000-00-00' && row.original.vehicle_installed_date !== null ? Moment(row.original.vehicle_installed_date).format('DD-MM-yyyy') : ''}  </span>);
                }
            },
           /* {
                Header: 'Locator SIM',
                accessor: 'vehicle_sim',
                className: 'simcolumn'
            },*/
            {
                Header: 'Service Date',
                accessor: 'vehicle_services_date',
                className: 'datecolumn',
                Cell: ({ row }) => {
                    return (<span>{row.original.vehicle_services_date !== '0000-00-00' && row.original.vehicle_services_date !== null ? Moment(row.original.vehicle_services_date).format('DD-MM-yyyy') : ''}</span>);
                }
            },
            
            {
                Header: ' Last Updated Time ',
                accessor: 'vehicle_last_updated_time',
                className: 'lastdatecolumn',
                Cell: ({ row }) => {
                    return (<span>{Moment(row.original.vehicle_last_updated_time).format('DD-MM-yyyy hh:mm a')}</span>);
                }
            },
            {
                Header: 'Network',
                accessor: 'vehicle_sim_4g',
                className: '4Gcolumn',
                Cell: ({ row }) => {
                    return (<span>{row.original.vehicle_sim_4g === 'yes' ? '4G' : row.original.vehicle_sim_4g === 'no' ? '2G':''}</span>);
                }
            },
            {
                Header: '',
                accessor: 'action',
                className: 'buttoncolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span>

                           <a className='btn btn-primary text-capitalize' onClick={() => loginToWeb(row.original.customer_username, row.original.password)} href='#'  style={{ padding: '6px' }}>
                                <i className="fas fa-sign-in-alt" style={{ margin: 0 }}></i>
                            </a>

                            {row.original.vehicle_blocked == 'yes' ?
                                <Button onClick={() => { fnblocked('comment', row.original.vehicle_traccar_id); }} className='text-capitalize fa fa-sticky-note' variant="primary" style={{ padding: '6px' }}></Button> : ''}

                            <Button onClick={() => { showReminderPopup(row.original); }} className='text-capitalize fa fa-sticky-note' variant="success" style={{ padding: '6px' }}></Button>
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
            const searchText = searchKeyword;
            const selectedStatus = mode;
            const rmode=remaindermode
            const pageIndex = currentPage;
            const remSearchDate = 'today'
            
            getVehiclesList({ pageIndex, searchText, sortBy, selectedStatus,rectifiedFilter ,selectedRemType,remSearchDate,rmode,searchReminder });
        }
    }, [listupdated])

    const getVehiclesList = useCallback(async ({ pageIndex, searchtext, sortBy, selectedStatus,rectifiedFilter ,selectedRemType,remSearchDate,rmode,searchReminder }) => {

        setIsLoading(true);

        setTotalCount(0);

        const cpage = pageIndex + 1;
        setCurrentPage(pageIndex);
        var stype = '';
        var sorder = '';

        setSearchKeyword(searchtext);
        setMode(selectedStatus);
        setremaindermode(rmode);
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
            keyword: searchtext, sortType: stype ? stype : sortType, sortOrder: sorder ? sorder : sortOrder, status: selectedStatus, export:false
        }
  
        if(rmode===false || rmode===undefined){

            try {
                console.log(postdata);
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(postdata)
            }

            const url = API_URL + "vehicles?page=" + cpage;

            const response = await fetch(url, options)

            const data = await response.json();

            setvehicle(data.data.data);

            setTotalCount(data.data.total);

            setdueCount(data.dueremindercount);

            setTodayCount(data.todaycnt);

            setFromNumber(data.data.from);

            setToNumber(data.data.to);

            setIsLoading(false);

            setListUpdated(false);
        }
        catch {

        }
    }
    else
    {

           try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = `${API_URL}getVehicleReminders/${selectedRemType}/${rectifiedFilter}/${remSearchDate}/${searchReminder}`;

            const response = await fetch(url, options)

            const data = await response.json();

            setTotalCount(data.data.total);
            setdueCount(data.duecnt);
            setTodayCount(data.todaycnt);
            setupcomingCount(data.upcocnt);
            setRectCount(data.retcocnt);
            setvehicle(data.data.data);

            setFromNumber(data.data.from);

            setToNumber(data.data.to);

            setIsLoading(false);

            setListUpdated(false);
        }
        catch {

        }

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
                            <DynamicTable columns={(remaindermode==false||remaindermode==undefined) ?columns:columns2} data={vehicles} fromNumber={fromNumber} toNumber={toNumber} getVehiclesList={getVehiclesList} totalCount={totalCount} addVehicle={addVehicle} fnremainder={fnremainder} dueCount={dueCount} TodayCount={TodayCount}  upcomingCount={upcomingCount}  RectCount={RectCount} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal size="xl" show={vehiclePopup} onHide={() => setvehiclePopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Vehicle Account</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>

                    {vehicleaccount && vehicleaccount.map((item, index) => (
                        <Row>
                            <Col md={12}>
                                <Card style={{ margin: 0 }}>
                                    <Card.Body className='task-comment'>
                                        <span className='accountvehicle'><i class="fas fa-circle"></i> {item.customer_name} ({item.customer_username})</span>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ))}

                </Modal.Body>

            </Modal>

            <Modal size="lg" show={monitoringblockedPopup} onHide={() => setMonitoringblockedPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Blocked Notes</Modal.Title>
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
                                                            <img className="media-object img-radius comment-img" src={adminprofile} alt="Generic placeholder" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading text-muted">{note.blocked_vehicle_note_by}
                                                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:MM')}</span>
                                                                <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                                                    <i class="fas fa-pencil-alt"></i>
                                                                </span>


                                                            </h6>
                                                            <p style={{ color: 'black' }}>{ReactHtmlParser(note.blocked_vehicle_note_text)} </p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </ScrollToBottom>}

                                    <Form key="monitoringform" onSubmit={handleSubmit1(saveBlockedNote)}>
                                        <Row>
                                            <Col md="6"></Col>
                                            <Col md="6">

                                                <DatePicker
                                                    placeholderText='Select date'
                                                    // todayButton={"Today"}
                                                    selected={monitoringblockedDate}
                                                    onChange={handleMonitoringblockedDateChange}
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


                                        <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...register1('blocked_note')} />

                                        <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Comment</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal>

            <Modal size="xl" show={vehicleeditPopup} onHide={() => setvehicleeditPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{selectedvehicleId ? 'Edit Vehicle' : 'Add Vehicle'}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <Row>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body className='task-comment'>

                                    <Form key="vehicleform" onSubmit={handleSubmit(editvehicleform)} >
                                        <Row>
                                            <Col md={4}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Name :</Form.Label>

                                                    <input type="text" class="form-control" disabled={isDisabled}  {...register('vehicle_name')} />


                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Customer Name: *</Form.Label>
                                                    <input type="text" class="form-control" disabled={isDisabled} {...register('customer_name')} />

                                                </Form.Group>
                                            </Col>

                                            <Col md={2} className="p-0">
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>IMEI: </Form.Label>

                                                    <input type="text" class="form-control" disabled={isDisabled} {...register('vehicle_imei')} />

                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>SIM: *</Form.Label>

                                                    <input type="text" class="form-control" disabled={isDisabled} {...register('vehicle_sim')} />

                                                </Form.Group>
                                            </Col>
                                       
                                            <Col md={2}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Installed Date: *</Form.Label>

                                                    <DatePicker
                                                        placeholderText='Select date'
                                                        className="form-control"
                                                        selected={installDate}
                                                        onChange={handleinstallDateChange}
                                                        dateFormat="dd-MM-yyyy"
                                                        timeCaption="time"
                                                        isClearable={true}
                                                    />

                                                </Form.Group>
                                            </Col>

                                            <Col md={1}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Warranty: </Form.Label>

                                                    <input type="text" class="form-control"  {...register('vehicle_warranty')} />

                                                </Form.Group>
                                            </Col>

                                            <Col md={1} className="p-0">
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Network :</Form.Label>

                                                    <select class="form-control"  {...register('vehicle_sim_4g')}>

                                                        <option value="yes">4G</option>

                                                        <option value="no">2G</option>
                                                    </select>

                                                </Form.Group>
                                            </Col>

                                            <Col md={2}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Device Ownership: </Form.Label>
                                                    <select class="form-control" {...register('vehicle_ownership')}>
                                                        <option value="locator ">Locator</option>
                                                        <option value="customer">Customer</option>
                                                    </select>

                                                </Form.Group>
                                            </Col>

                                            <Col md={2}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Device type:  </Form.Label>

                                                    <input type="text" class="form-control" {...register('vehicle_device_type')} />

                                                </Form.Group>
                                            </Col>

                                            <Col md={2}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Password:</Form.Label>

                                                    <select class="form-control"  {...register('vehicle_pwd')}>

                                                        <option value="yes">Yes</option>

                                                        <option value="no">No</option>
                                                    </select>

                                                </Form.Group>
                                            </Col>

                                            <Col md={1}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Blocked:</Form.Label>

                                                    <Col md={12}>
                                                        <div className="switch d-inline m-r-10">
                                                            <input type="checkbox" id="checked-default" className="form-control" name="blocked"
                                                                onChange={(e) => { fnblocked(e, 0); }}
                                                                defaultChecked={vehicle_blocked === true} />
                                                            <label className="cr form-label" htmlFor="checked-default"></label>
                                                        </div>
                                                    </Col>

                                                </Form.Group>
                                            </Col>

                                            <Col md={1} className='p-0'>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Duplicates: &nbsp;</Form.Label><br />
                                                    <div className="switch d-inline m-r-10">
                                                        <input type="checkbox" id="checked-default5" className="form-control" name="duplicates"
                                                            onChange={(e) => { fnduplicates(e); }}
                                                            defaultChecked={duplicates ===true} />
                                                        <label className="cr form-label" htmlFor="checked-default5"></label>
                                                    </div>

                                                </Form.Group>
                                            </Col>

                                            <Col md={2}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Profile:</Form.Label>

                                                    <input type="text" class="form-control"  {...register('vehicle_profile')} />

                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Pwd profile:  </Form.Label>

                                                    <input type="text" class="form-control" {...register('vehicle_pswd_profile')} />

                                                </Form.Group>
                                            </Col>
                                            
                                            <Col md={2}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>DATA : </Form.Label>
                                                    <select class="form-control" {...register('vehicle_data')}>
                                                        <option value="LOCAL">LOCAL</option>
                                                        <option value="ROAMING">ROAMING</option>
                                                    </select>

                                                </Form.Group>
                                            </Col>


                                            <Col md={2}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>SIM Ownership : </Form.Label>
                                                    <select class="form-control" {...register('vehicle_sim_ownership')}>
                                                        <option value="locator">Locator</option>
                                                        <option value="customer">Customer</option>
                                                    </select>

                                                </Form.Group>
                                            </Col>

                                            <Col md={4}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Locator SIM Note:  </Form.Label>
                                                     <Form.Control as="textarea" rows="2" {...register('vehicle_sim_note')} />
                                                   

                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Note:  </Form.Label>
                                                      <Form.Control as="textarea" rows="2" {...register('vehicle_comment')} />
                        
                                                   

                                                </Form.Group>
                                            </Col>



                                        </Row>




                                        <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Save</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                   
                    {selectedvehicleId && (
                        <Row>
                            <Col md={12}>
                                {isLoading ? <Loader /> : null}
                                <Tabs defaultActiveKey="schedule">
                                    <Tab eventKey="schedule" title="Job Details">
                                        <Table responsive style={{ border: '1px solid #eaeaea', borderTop: 'none' }}>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Type</th>
                                                    <th>Status</th>
                                                    <th>Technician</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jobDetails.map((item, index) => (
                                                    <tr>
                                                        <td>{Moment(item.updated_at).format('DD-MM-yyyy')}</td>
                                                        <td>{item.job_details_type}</td>
                                                        <td>{item.job_details_status}</td>
                                                        <td>{item.technician_name}</td>

                                                    </tr>
                                                ))}

                                                {jobDetails.length == 0 ? <tr><td colspan="11">No jobs added by technician</td></tr> : ''}
                                            </tbody>
                                        </Table>
                                    </Tab>
                                </Tabs>

                            </Col>
                        </Row>
                    )}
                </Modal.Body>

            </Modal>

            <Modal size="lg" show={notePopup} onHide={() => setNotePopup(false)} backdrop="static">
                <Modal.Header closeButton>
                  <Modal.Title as="h5">Notes - {selectedvehicleName}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                  <Row>
                    <Col md={12}>
                        <Card style={{ margin: 0 }}>
                            <Card.Body className='task-comment'>

                              {reminderArray && reminderArray.length > 0 &&
                                <ScrollToBottom className="mon-note-list">
                                  <ul className="media-list p-0">

                                    {reminderArray.map((note, index) => (
                                      <li className="media">
                                        <div className="media-left mr-3">
                                          <img className="media-object img-radius comment-img" src={note.vehicle_note_by === 'admin' ? adminprofile : note.vehicle_note_by === 'Shams' ? shamsprofile : note.vehicle_note_by === 'Shamnad' ? shamnadprofile : note.vehicle_note_by === 'Rasick' ? rasickprofile : note.vehicle_note_by === 'Ajmal' ? ajmalprofile : note.vehicle_note_by === 'Celine' ? celineprofile : note.vehicle_note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                        </div>
                                        <div className="media-body">
                                          <h6 className="media-heading text-muted">{note.vehicle_note_by}
                                            <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:mm')}</span>
                                            {note.vehicle_note_by === loginUserName && <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                              <i class="fas fa-pencil-alt"></i>
                                            </span>}

                                            <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'black' }}>{note.vehicle_note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.vehicle_note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span>
                                          </h6>

                                          <p style={{ color: 'black', margin: 0 }}>{ReactHtmlParser(note.vehicle_note_text)} </p>
                                          <p style={{ fontStyle: 'italic' }}>{ReactHtmlParser(note.remove_reminder_text)} </p>

                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </ScrollToBottom>}

                              <Form key="monitoringform" onSubmit={handleSubmitReminder(submitReminder)}>
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
                                    <Col md="3">
                                                <Form.Group controlId="exampleForm.ControlSelect2">
                                                    <Form.Control as="select" {...registerReminder('vehicle_note_assigned_to')}>
                                                        <option value="Shamnad">{loginUserId === '3' ? 'Self' : 'Shamnad'}</option>
                                                        <option value="Celine">{loginUserId === '7' ? 'Self' : 'Celine'}</option>
                                                        <option value="Shams">{loginUserId === '5' ? 'Self' : 'Shams'}</option>
                                                        <option value="Rasick">{loginUserId === '2' ? 'Self' : 'Rasick'}</option>
                                                        <option value="Ajmal">{loginUserId === '6' ? 'Self' : 'Ajmal'}</option>
                                                        <option value="Shone">{loginUserId === '8' ? 'Self' : 'Shone'}</option>
                                                        <option value="admin">{loginUserId === '1' ? 'Self' : 'admin'}</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                </Row>

                                <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...registerReminder('vehicle_note_text')} />

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