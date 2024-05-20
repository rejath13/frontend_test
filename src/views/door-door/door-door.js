import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom'
import { Row, Col, Card, Pagination, Table, Modal, Field, Button, OverlayTrigger, Tooltip, ButtonGroup, Form, Badge } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import './door-door.css';
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

import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import { saveAs } from "file-saver";

import Multiselect from 'multiselect-react-dropdown';

import PNotify from "pnotify/dist/es/PNotify";

import Select from 'react-select';

function DynamicTable({ columns, data, fromNumber, toNumber, getDoorList, totalCount, todaycnt, duecnt, upcomingcnt, areas, zones, categories, addCustomer, getZoneList, showLoader }) {

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
            name: "norightperson",
            value: "true",
            label: "RPNA",
            full: "Right Person Not Available"
        },
        {
            name: "futurerequirements",
            value: "true",
            label: "FR",
            full: "Future Requirement"
        },
        {
            name: "alreadydone",
            value: "true",
            label: "AD",
            full: "Already Done"
        },
        {
            name: "norequirement",
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
    ]
    const [searchtext, setSearchText] = useState(null);
    const [filterarray, setFilterarray] = useState({ "new": true });
    const [remindermode, setremindermode] = useState(false);
    const [remSearchDate, setRemSearchDate] = useState('today');
    const [updateList, setupdateList] = useState(false);
    const [initiallog, setinitiallog] = useState(0);
    const [initial, setinitial] = useState('first');
    const [isFilter, setisFilter] = useState(false);
    const loginUserName = localStorage.getItem('loginUserName');
    const loginUserId = localStorage.getItem('loginUserId');
    const [category, setCategory] = useState([]);
    const [area, setArea] = useState(0);
    const [zone, setZone] = useState([]);
    const [categoriesList, setCategoriesList] = useState(categories);
    const [zonesList, setZonesList] = useState(zones);
    const [filterCount, setFilterCount] = useState(0);
    const authToken = localStorage.getItem('authToken');
    const [addedSource, setAddedSource] = useState('all');

    const handleFilterArrayChange = (e) => {
        const isChecked = e.target.checked;
        const checkeditem = e.target.name;
        setFilterarray(filterarray => ({ ...filterarray, [checkeditem]: isChecked }));
    }

    const fnreminder = async (e) => {
        clearAllFilters();
        var checked = e.target.checked;
        if (checked) {
            setZone([]);
            setCategory([]);
            localStorage.removeItem('logarea');
            localStorage.removeItem('logzone');
            localStorage.removeItem('logcategory');
            setSearchText(null);
            localStorage.removeItem('logDoorFilterArray');
            setFilterarray({ "interested": true, "norightperson": true, "futurerequirements": true, "alreadydone": true, });

            setremindermode(true);
        }
        else {
            setFilterarray({ "new": true });

            setremindermode(false);
        }

        localStorage.setItem("logDoorFilterArray", JSON.stringify(filterarray));

        if (pageIndex > 0) {
            gotoPage(0);
        }
    }

    const onChangeSearchtext = (e) => {
        setSearchText(e.target.value);
    };

    const onChangeCategory = (selectedList, selectedItem) => {
        setCategory(selectedList);
    };

    const onRemoveCategory = (selectedList, removedItem) => {
        setCategory(selectedList);
    };

    const onChangeArea = (e) => {
        const selectedarea = e.target.value;
        setArea(selectedarea);
        localStorage.setItem("logarea", selectedarea);
        setZone([]);
        getZoneList({ selectedarea });
    };

    const onChangeAddedSource = (e) => {
        const selected = e.target.value;
        setAddedSource(selected);
        localStorage.setItem("logaddedsource", selected);
    }

    const onChangeZone = (selectedList, selectedItem) => {
        setZone(selectedList);
    };

    const onRemoveZone = (selectedList, removedItem) => {
        setZone(selectedList);
    };

    const onclearfilter = () => {
        setZone([]);
        setCategory([]);
        setArea(0);
        setAddedSource('all');
        localStorage.removeItem('logarea');
        localStorage.removeItem('logzone');
        localStorage.removeItem('logcategory');
        localStorage.removeItem('logDoorFilterArray');
        localStorage.removeItem('logaddedsource');
        setFilterarray({ "new": true });
    };

    const setlocalstorage = async () => {
        if (localStorage.hasOwnProperty('logDoorFilterArray'))
            setFilterarray(JSON.parse(localStorage.getItem('logDoorFilterArray')));

        if (localStorage.hasOwnProperty('logarea') && localStorage.getItem('logarea')>0)
            setArea(localStorage.getItem('logarea'));

        if (localStorage.hasOwnProperty('logzone'))
            setZone(JSON.parse(localStorage.getItem('logzone')));

        if (localStorage.hasOwnProperty('logcategory'))
            setCategory(JSON.parse(localStorage.getItem('logcategory')));

        if (localStorage.hasOwnProperty('logaddedsource') && localStorage.getItem('logaddedsource')>0)
            setAddedSource(localStorage.getItem('logaddedsource'));

        setinitiallog(1);

        if (localStorage.hasOwnProperty('logDoorFilterArray') || localStorage.hasOwnProperty('logarea') || localStorage.hasOwnProperty('logzone') || localStorage.hasOwnProperty('logcategory'))
            setupdateList(updateList ? false : true);
        else
            getDoorList({ pageIndex, searchtext, sortBy, filterarray, remSearchDate, remindermode, area, zone, category, addedSource });
    }

    const clearsearch = () => {
        setSearchText(null);
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
        
        onclearfilter();
        setSearchText(null);

        if (pageIndex > 0) {
            gotoPage(0);
        }
        else
            setupdateList(updateList ? false : true);
    }

    const filterSearch = () => {
        setisFilter(false);

        localStorage.setItem("logzone", JSON.stringify(zone));

        localStorage.setItem("logcategory", JSON.stringify(category));

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
            getDoorList({ pageIndex, searchtext, sortBy, filterarray, remSearchDate, remindermode, area, zone, category,addedSource });

    }, [getDoorList, sortBy, updateList, pageIndex, remindermode, remSearchDate])

    useEffect(() => {
        getDoorList({ pageIndex, searchtext, sortBy, filterarray, remSearchDate, remindermode, area, zone, category,addedSource });
    }, [])

    const geListCount = useCallback(async ({ area, zone, category, filterarray }) => {

        showLoader(true);
        console.log(filterarray)

        const postdata = {
            selectedStatus: filterarray, selectedZoneforRoute: zone, selectedCategoriesforRoute: category, reminderActive: remindermode,reminderdate: remSearchDate
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

            var url = API_URL + "getRowsCountforRoute/" + area+'/'+loginUserId;

            const response = await fetch(url, options)

            const data = await response.json();

            setFilterCount(data.data);            

            showLoader(false);
        }
        catch {

        }

    }, []);

    useEffect(() => {
        if (isFilter) {
            geListCount({ area, zone, category, filterarray });
        }
        
    }, [geListCount, area, zone, category, filterarray, isFilter])

    const handleKeypress = e => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            search();
        }
    };

    const calladdCustomer = () => {
        addCustomer(0,loginUserId);
    }

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
                                <Form.Control type="checkbox" id="checked-offline" onChange={(e) => { fnreminder(e); }} />
                                <Form.Label htmlFor="checked-offline" className="cr" />
                            </div>
                        </OverlayTrigger>
                        
                    </Col>

                    {remindermode && <Col xs={3} className="topcols">
                        <ButtonGroup>
                            <>
                                <Button variant={remSearchDate === 'today' ? 'warning smallbtn' : 'outline-warning smallbtn'} onClick={() => setRemSearchDate('today')}>
                                    <Badge variant="danger">{todaycnt}</Badge>Today
                                </Button>
                                <Button variant={remSearchDate === 'due' ? 'warning smallbtn' : 'outline-warning smallbtn'} onClick={() => setRemSearchDate('due')} style={{ padding: '10px 20px' }}  >
                                    <Badge variant="danger" >{duecnt}</Badge>Due
                                </Button>
                                <Button variant={remSearchDate === 'upcoming' ? 'warning smallbtn' : 'outline-warning smallbtn'} onClick={() => setRemSearchDate('upcoming')} >
                                    <Badge variant="danger"  >{upcomingcnt}</Badge>Upcoming
                                </Button>
                            </>
                        </ButtonGroup>
                    </Col>
                    }

                    <Col xs={4}>
                        <Form.Control placeholder="Search..." value={searchtext || ''} onChange={onChangeSearchtext} onKeyPress={handleKeypress} />
                        {searchtext && <button type="button" className="react-datepicker__close-icon" onClick={clearsearch} style={{ right: '2px', height: '90%' }}></button>}
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
                            className="text-capitalize btn btn-warning topbuttons"
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

                        {remindermode == false && <>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Add New Customer</Tooltip>}>
                                <button
                                    className="text-capitalize btn btn-info topbuttons"
                                    type="button"
                                    onClick={() => calladdCustomer()}
                                >
                                    <i className="fa fa-plus" style={{ margin: 0, fontSize: '16px' }}></i>
                                </button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Upload Data </Tooltip>}>

                                <Link to='door-door-data' target='_blank' className="text-capitalize btn btn-primary  topbuttons">
                                    <i className="fa fa-upload" style={{ margin: 0 }}></i>
                                </Link>

                            </OverlayTrigger>

                            <Link to='/door-report' className="text-capitalize btn btn-secondary  topbuttons">Report</Link>

                        </>
                        }
                    </Col>

                </Form.Row>

                <Form.Row className='mt-1 mb-1'>
                    <b>Total: {totalCount}</b>
                    {category && 
                    <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Selected categories</Tooltip>}
                        >
                        <span className='ml-5 pr-3 border-right rounded'>{category.map(cat => cat.label+', ')}</span>
                    </OverlayTrigger>
                    }
                    
                    {area>0 && 
                    <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Selected area</Tooltip>}
                        >
                        <span className='ml-3 pr-3 border-right rounded'>{areas.filter( ar => ar.area_id == area ).map(filteredName =>  filteredName.area_name )}</span>
                    </OverlayTrigger>
                    }
                    {zone && 
                    <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Selected zones</Tooltip>}
                        >
                        <span className='ml-4'>{zone.map(zn => zn.name+', ')}</span>
                    </OverlayTrigger>
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

            <Modal size="xl" show={isFilter} onHide={() => setisFilter(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Filter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {statusfilter.map((item, index) => {
                            if(!remindermode || (remindermode && (item.name!=='new' && item.name!=='norequirement' && item.name!=='invalid')))
        
                            return <Col className="topcols">
                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>{item.full}</Tooltip>}>
                                    <div className="checkbox d-inline">
                                        <Form.Control type="checkbox" name={item.name} value={item.value}
                                            checked={filterarray[item.name]} id={item.name}
                                            onClick={(e) => handleFilterArrayChange(e)} />
                                        <Form.Label htmlFor={item.name} className="cr">{item.full}</Form.Label>
                                    </div>
                                </OverlayTrigger>
                            </Col>

                        })}
                    </Row>
                    <Row>
                        <Col xs={3}>
                            <Form.Control as="select" value={addedSource} onChange={(e) => { onChangeAddedSource(e); }} style={{padding: '10px 5px'}}>
                                <option value="all">All</option>
                                <option value="visit">Scheduled Visit</option>
                                <option value="list">From the list</option>
                            </Form.Control>
                        </Col>
                        <Col xs={3}>

                            <Multiselect
                                options={categories} 
                                selectedValues={category} 
                                onSelect={onChangeCategory} 
                                onRemove={onRemoveCategory}
                                displayValue="label"
                                showCheckbox="true"
                                placeholder="Select category"
                                emptyRecordMsg="No options available"
                                showArrow="true"
                            />
                            
                        </Col>
                        <Col xs={3}>
                            <Form.Control as="select" value={area} onChange={(e) => { onChangeArea(e); }} style={{padding: '10px 5px'}}>
                                <option value="0">Select area</option>
                                {areas &&
                                    areas.map(area => (
                                        <option value={area.area_id}
                                        >{area.area_name}</option>
                                    ))}
                            </Form.Control>
                        </Col>
                        <Col xs={3}>

                            <Multiselect
                                options={zones} 
                                selectedValues={zone} 
                                onSelect={onChangeZone} 
                                onRemove={onRemoveZone}
                                displayValue="name"
                                showCheckbox="true"
                                placeholder="Select zone"
                                emptyRecordMsg="No options available"
                                showArrow="true"
                            />

                        </Col>
                        
                    </Row>
                    <Row className='mt-2'>
                        <Col xs={12}><span className='text-danger'>Total leads : {filterCount}</span></Col>
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

    const [doorList, setDoorList] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [listupdated, setListUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [zone, setZone] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortType, setSortType] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [notearray, setNoteArray] = useState([]);
    const [filterData, saveFilterData] = useState({});
    const [monitoringPopup, setMonitoringPopup] = useState(false);
    const [selectedCustomer, setselectedCustomer] = useState('');
    const [selectedCustomerId, setselectedCustomerId] = useState(0);
    const loginUserId = localStorage.getItem('loginUserId');
    const loginUserName = localStorage.getItem('loginUserName');
    const [monitoringDate, setMonitoringDate] = useState();
    const authToken = localStorage.getItem('authToken');
    const [remindertextPopup, setReminderTextPopup] = useState(false);
    const [SearchDate, setSearchDate] = useState('');
    const [remindermode, setremindermode] = useState(false);
    const [searchArea, setSearchArea] = useState('');
    const [searchZone, setSearchZone] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [searchaddedSource, setSearchaddedSource] = useState('all');
    const [todaycnt, settodaycnt] = useState(0);
    const [duecnt, setduecnt] = useState(0);
    const [upcomingcnt, setupcomingcnt] = useState(0);
    const [areas, setAreas] = useState([]);
    const [zones, setZones] = useState([]);
    const [categories, setCategories] = useState([]);
    const [localUpdation, setLocalUpdation] = useState(false);
    const [customerPopup, setCustomerPopup] = useState(false);
    const [salespersons, setsalespersons] = useState([]);

    const {
        register: register1,
        handleSubmit: handleSubmit1,
        reset: reset1,
        getValues,
    } = useForm({
        defaultValues: {
            note_id: 0,
            note_text: '',
            door_id: 0,
            note_by: loginUserName,
            note_type: 'noreminder'
        }
    });

    const saveMonitoringNote = async (data) => {
        
        if ((data.note_id==0 && data.note_by == loginUserId) || (data.note_id>0 && data.note_by == loginUserName)) {

            const postdata = { ...data, door_id: selectedCustomerId, note_text: data.note_text.replace(/\r?\n/g, '<br/>'), note_date: monitoringDate ? Moment(monitoringDate).format('YYYY-MM-DD HH:mm') : '' };

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

                const url = API_URL + "SaveDoornotes";

                const response = await fetch(url, options)

                const data = await response.json();

                if (data.status === 'success') {

                    setListUpdated(true);
                    updateMonitoringNote(selectedCustomerId, data.door_company,data.door_sales_person);

                    PNotify.success({
                        title: "Success",
                        text: "Successfully updated notes!",
                    });

                } else {
                    PNotify.error({
                        title: "Error ",
                        text: "Error in updating note!",
                    });
                }

                //setMonitoringPopup(false);
            }
            catch {

            }
        }else{
            PNotify.notice({
                title: "Alert!",
                text: "You can't add reminder for this lead!",
            });
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
        reset1({
            ...getValues(),
            note_type: 'notification'
        });
    };

    const handleMonitoringDateChange = (date) => {
        const selectedHour = new Date(date).getHours();
        if (selectedHour === 0) {
            setMonitoringDate(new Date(date).setHours(9, 0, 0));
        } else {
            setMonitoringDate(date);
        }

        reset1({
            ...getValues(),
            note_type: 'notification'
        });
    };

    const fillformtoedit = (note) => {
        reset1({
            note_id: note.note_id,
            note_text: note.note_text.replaceAll('<br/>', '\n'),
            door_id: note.door_id,
            note_by: note.note_by,
            note_type: note.note_type
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

            PNotify.success({
                title: "Success",
                text: data.data,
            });
        }
        catch {

        }
    }

    const moveToSalesplus = async (door_id) => {

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
            }

            const url = API_URL + "moveDoor/" + door_id;

            const response = await fetch(url, options)

            const data = await response.json();

            setListUpdated(true);

            PNotify.success({
                title: "Success",
                text: data.data,
            });
        }
        catch {

        }
    };

    const callChangeStatusApi = async (door_id,selectedstatus) => {
        try {
                    const options = {
                        method: 'get',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json',
                            'Xtoken': authToken
                        },

                    }

                    const url = API_URL + "updateDtoDstatus/" + door_id + '/' + selectedstatus;

                    const response = await fetch(url, options)

                    const data = await response.json();

                    PNotify.success({
                        title: "Success",
                        text: data.data,
                    });
        }
        catch {

        }
    }

    const changeStatus = (selectedstatus, door_id, sales_person) => {

        if (sales_person == loginUserId) {

            let previousState = '';
            setDoorList((prev) => {
                const idx = prev.findIndex((v) => v.door_id === door_id);
                if (idx>=0) {
                    previousState = prev[idx];
                    prev[idx] = { ...prev[idx], door_status: selectedstatus };
                    return [...prev];
                }
            });
            console.log(previousState);

            if (previousState.door_status != 'new') {

                callChangeStatusApi(door_id, selectedstatus);
            }else{
                if (!previousState.note_date) {

                    const notice = PNotify.notice({
                        title: 'Date',
                        text: 'Please select a follow up date.',
                        hide: true
                    });
                    notice.on('click', function() {
                        notice.close();
                    });
                }else{
                    callChangeStatusApi(door_id, selectedstatus);
                    saveNote(previousState.door_id, previousState.note_text, previousState.note_date,previousState.door_sales_person,selectedstatus)
                }
            }
        }else{
            PNotify.notice({
                title: "Alert!",
                text: "You can't change status of this lead!",
            });
        }
    };

    const updateMonitoringNote = async (door_id, door_company,sales_person) => {
        setMonitoringPopup(true);
        setselectedCustomer(door_company);
        setselectedCustomerId(door_id);

        reset1({
            note_id: 0,
            note_text: '',
            door_id: door_id,
            note_by: loginUserName,
            note_type: 'noreminder'
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

            const url = API_URL + "getSingleDtoDNotes/" + door_id;

            const response = await fetch(url, options)

            const data = await response.json();

            setNoteArray(data.data);

            setMonitoringPopup(true);

            setIsLoading(false);
        }
        catch {

        }

    }

    const updateqty = async (e, door_id, sales_person) => {

        if (sales_person == loginUserId) {

            try {
                var qty = e.target.value;

                const postdata = { door_id: door_id, door_qty: qty };

                const options = {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken
                    },
                    body: JSON.stringify(postdata)
                }

                const url = API_URL + "update_singleDtoD";

                const response = await fetch(url, options);

                const data = await response.json();

                PNotify.success({
                    title: "Success",
                    text: data.data,
                });

            }
            catch {

            }
        }else{
            PNotify.notice({
                title: "Alert!",
                text: "You can't update this lead!",
            });
        }
    };

    const saveNote = async (door_id, text, date, sales_person,status) => {

        if (sales_person == loginUserId) {

            if (status!='new') {

                try {

                    const postdata = { door_id: door_id, note_text: text.replace(/\r?\n/g, '<br/>'), note_date: date ? Moment(date).format('YYYY-MM-DD HH:mm:ss') : '',note_type:'notification' };

                    const options = {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json',
                            'Xtoken': authToken
                        },
                        body: JSON.stringify(postdata),
                    }

                    const url = API_URL + "SaveDoornotes";

                    const response = await fetch(url, options)

                    const data = await response.json();

                    PNotify.success({
                        title: "Success",
                        text: data.data,
                    });

                    setListUpdated(true);
                }
                catch {

                }
            }else{

                    const notice = PNotify.notice({
                        title: 'Status',
                        text: 'Please select a status.',
                        hide: true
                    });
                    notice.on('click', function() {
                        notice.close();
                    });
            }
        }else{
            PNotify.notice({
                title: "Alert!",
                text: "You can't add reminder for this lead!",
            });
        }
    };

    const getCategoryList = useCallback(async () => {

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "getSavedCategories";

            const response = await fetch(url, options)

            const data = await response.json();

            setCategories(data.data);
        }
        catch {

        }
    }, []);

    const onChangeAddPopupArea = (e,area) => {
        setSearchArea(e.target.value);
        const selectedarea = e.target.value;
        setZones([]);
        getZoneList({ selectedarea });
    };

    const getZoneList = useCallback(async ({selectedarea}) => {
        
        if(selectedarea>0){
            try {
                const options = {
                    method: 'get',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken
                    }
                }

                const url = API_URL + "getSavedZones/"+selectedarea;

                const response = await fetch(url, options)

                const data = await response.json();

                setZones(data.data);
            }
            catch {

            }
        }
    }, []);

    const getAreaList = useCallback(async () => {

        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "getSavedAreas";

            const response = await fetch(url, options)

            const data = await response.json();

            setAreas(data.data);
        }
        catch {

        }
    }, []);

    useEffect(() => {
        getZoneList(searchArea);
        getCategoryList();
        getAreaList();
        getSalesPersonsList();
    }, [])

    const changeNoteDate = (selectedtype, door_id, sales_person) => {

        if (sales_person == loginUserId) {

            let selectedDate = '';

            if (selectedtype === 'tomorrow') {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                selectedDate = new Date(date).setHours(9, 0, 0);
            } else if (selectedtype === 'oneweek') {
                const date = new Date();
                date.setDate(date.getDate() + 7);
                selectedDate = new Date(date).setHours(9, 0, 0);
            } else if (selectedtype === 'twoweek') {
                const date = new Date();
                date.setDate(date.getDate() + 14);
                selectedDate = new Date(date).setHours(9, 0, 0);
            } else if (selectedtype === 'onemonth') {
                const date = new Date();
                date.setDate(date.getDate() + 30);
                selectedDate = new Date(date).setHours(9, 0, 0);
            } else if (selectedtype === 'threemonth') {
                const date = new Date();
                date.setDate(date.getDate() + 90);
                selectedDate = new Date(date).setHours(9, 0, 0);
            } else if (selectedtype === 'sixmonth') {
                const date = new Date();
                date.setDate(date.getDate() + 180);
                selectedDate = new Date(date).setHours(9, 0, 0);
            }

            setDoorList((prev) => {
                const idx = prev.findIndex((v) => v.door_id === door_id);
                prev[idx] = { ...prev[idx], note_date_as_text: selectedtype, note_date: selectedDate, dul_followup_date: Moment(selectedDate).format('DD-MM-YYYY') };
                return [...prev];
            });
        }else{
            PNotify.notice({
                title: "Alert!",
                text: "You can't add reminder for this lead!",
            });
        }

    };

    const columns = React.useMemo(
        () => [
            {
                Header: '',
                accessor: 'Delete',
                className: 'Deletecolumn',
                Cell: ({ row }) => {

                    return (
                        <>
                            {(row.original.door_status!=='converted' && row.original.door_status != 'actiontaken' && row.original.door_status != 'new') ? <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Move To Sale Plus</Tooltip>}>
                                <button id={row.original.door_id} onClick={() => {
                                    if (window.confirm('Are you sure you want to move this to sales plus?'))
                                        moveToSalesplus(row.original.door_id)
                                }} type="button" className="mt-0 float-right smallbtn btn btn-success"><i className="fa fa-check m-0"></i></button>
                            </OverlayTrigger> : ''}</>);
                }
            },
            {
                Header: 'Company Name',
                accessor: 'door_contact_name',
                className: 'namecolumn',
                Cell: ({ row }) => {
                    return (
                        <span><span className="pointer" onClick={() => addCustomer(row.original.door_id,row.original.door_sales_person)}>{row.original.door_company}</span><br />
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Contact name</Tooltip>}><span>{row.original.door_contact_name}</span></OverlayTrigger>
                            {row.original.door_sales_person != loginUserId && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Sales person</Tooltip>}><span className='text-danger'> ({row.original.user_name})</span></OverlayTrigger>}<br />

                            {row.original.door_status!=='converted' && <ButtonGroup size="sm" className='mt-2'>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Interested</Tooltip>}>
                                    <Button variant="success" id={`status_btn_${row.original.door_id}`} onClick={() => {
                                        changeStatus('interested', row.original.door_id,row.original.door_sales_person)
                                    }} className="smallbtn">
                                        {row.original.door_status === 'interested' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>}
                                        IN</Button>
                                </OverlayTrigger>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Right Person not Available</Tooltip>}>
                                    <Button variant="danger" onClick={() => {
                                        changeStatus('norightperson', row.original.door_id,row.original.door_sales_person)
                                    }} className="smallbtn">
                                        {row.original.door_status === 'norightperson' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>}
                                        RPNA</Button>
                                </OverlayTrigger>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Future Requirement</Tooltip>}>
                                    <Button variant="warning" onClick={() => {
                                        changeStatus('futurerequirements', row.original.door_id,row.original.door_sales_person)
                                    }} className="smallbtn">
                                        {row.original.door_status === 'futurerequirements' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>}
                                        FR</Button>
                                </OverlayTrigger>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Already Done</Tooltip>}>
                                    <Button variant="primary" onClick={() => {
                                        changeStatus('alreadydone', row.original.door_id,row.original.door_sales_person)
                                    }} className="smallbtn">
                                        {row.original.door_status === 'alreadydone' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>}
                                        AD</Button>
                                </OverlayTrigger>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>No Requirement</Tooltip>}>
                                    <Button variant="secondary" onClick={() => {
                                        changeStatus('norequirement', row.original.door_id,row.original.door_sales_person)
                                    }} className="smallbtn">
                                        {row.original.door_status === 'norequirement' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>}
                                        NR</Button>
                                </OverlayTrigger>


                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Invalid</Tooltip>}>
                                    <Button variant="light" onClick={() => {
                                        changeStatus('invalid', row.original.door_id,row.original.door_sales_person)
                                    }} className="smallbtn">
                                        {row.original.door_status === 'invalid' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>}
                                        IV</Button>
                                </OverlayTrigger>

                            </ButtonGroup>}

                            {row.original.door_status==='converted' && <span style={{color: 'red',fontSize: '15px'}}>Moved to salesplus</span>}

                        </span>
                    );

                }
            },
            {
                Header: 'Phone',
                accessor: 'door_contact_phone',
                className: 'Phonecolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (<span>{row.original.door_contact_phone}</span>);

                }
            },
            {
                Header: 'Category/Zone',
                accessor: 'door_zone',
                className: 'zonecolumn',
                Cell: ({ row }) => {

                    return (
                        <span>{row.original.category_name}<br />{row.original.zone_name} </span>
                    );
                }
            },
            {
                Header: 'Qty',
                accessor: 'door_qty',
                className: 'Qtycolumn',
                Cell: ({ row }) => {
                    return (<div>  <Form.Control name='qty' id={`qty_${row.original.door_id}`} defaultValue={row.original.door_qty} onChange={(e) => row.original.door_qty = e.target.value} onBlur={(e) => updateqty(e, row.original.door_id,row.original.door_sales_person)} /> <br /> </div>);
                }
            },
            {
                Header: ' Note',
                accessor: ' Note',
                className: 'Notecolumn',
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<span>
                        <Form.Label style={{ fontSize: '12px' }} onClick={() => updateMonitoringNote(row.original.door_id, row.original.door_company,row.original.door_sales_person)}>First Contact On :{row.original.door_first_contact_on != null ? Moment(row.original.door_first_contact_on).format('DD-MM-YYYY HH:mm') : ' NC'} </Form.Label>

                        {row.original.door_followup_date && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Follow-up Date</Tooltip>}>
                            <span style={{ 'color': 'blue' }}>  [{Moment(row.original.door_followup_date).format('DD-MM-YYYY HH:mm')}] </span>
                        </OverlayTrigger>}

                        {row.original.door_followup_count > 0 && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Follow Up Count</Tooltip>}>
                            <span style={{ 'float': 'right', 'marginRight': '20px', 'backgroundColor': 'red', 'borderRadius': '10px', 'padding': '3px', 'color': 'white' }}><b>{row.original.door_followup_count} </b></span>
                        </OverlayTrigger>}
                        <Form.Control as="textarea" rows="1" placeholder={row.original.note_text} onBlur={(e) => row.original.note_text = e.target.value} />

                        <ButtonGroup className='mt-2 float-left'>
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Tomorrow</Tooltip>}>
                                <Button variant="success" onClick={() => changeNoteDate('tomorrow', row.original.door_id,row.original.door_sales_person)} className="smallbtn">
                                    {row.original.note_date_as_text === 'tomorrow' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} T
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Week</Tooltip>}>
                                <Button variant="warning" onClick={() => changeNoteDate('oneweek', row.original.door_id,row.original.door_sales_person)} className="smallbtn">
                                    {row.original.note_date_as_text === 'oneweek' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} 1 W
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Two Week</Tooltip>}>
                                <Button variant="danger" onClick={() => changeNoteDate('twoweek', row.original.door_id,row.original.door_sales_person)} className="smallbtn">
                                    {row.original.note_date_as_text === 'twoweek' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} 2 W
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Month</Tooltip>}>
                                <Button variant="secondary" onClick={() => changeNoteDate('onemonth', row.original.door_id,row.original.door_sales_person)} className="smallbtn">
                                    {row.original.note_date_as_text === 'onemonth' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} 1 M
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Three Month</Tooltip>}>
                                <Button variant="info" onClick={() => changeNoteDate('threemonth', row.original.door_id,row.original.door_sales_person)} className="smallbtn">
                                    {row.original.note_date_as_text === 'threemonth' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} 3 M
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Six Month</Tooltip>}>
                                <Button variant="light" onClick={() => changeNoteDate('sixmonth', row.original.door_id,row.original.door_sales_person)} className="smallbtn" style={{borderTopRightRadius:'0.25rem',borderBottomRightRadius:'0.25rem'}}>
                                    {row.original.note_date_as_text === 'sixmonth' && <i className="fa fa-check" style={{ marinRight: '6px' }}></i>} 6 M
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Reminder date</Tooltip>}><span className='ml-2'>{row.original.dul_followup_date}</span></OverlayTrigger>
                        </ButtonGroup> 


                        <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Save</Tooltip>}>
                            <Button className='mt-2 float-right smallbtn' variant="success" onClick={() => saveNote(row.original.door_id, row.original.note_text, row.original.note_date,row.original.door_sales_person,row.original.door_status)}><i className="far fa-save m-0"></i> Save</Button>
                        </OverlayTrigger>
                    </span>);
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
            const zone = searchZone;
            const area = searchArea;
            const category = searchCategory;
            const addedSource = searchaddedSource;

            getDoorList({ pageIndex, searchText, sortBy, filterarray, SearchDate, remindermode, area, zone, category,addedSource });
        }
    }, [listupdated])

    const getDoorList = useCallback(async ({ pageIndex, searchtext, sortBy, filterarray, remSearchDate, remindermode, area, zone, category, addedSource }) => {

        setIsLoading(true);

        const cpage = pageIndex + 1;
        setCurrentPage(pageIndex);
        setSearchDate(remSearchDate);
        setremindermode(remindermode);
        setSearchZone(zone);
        setSearchArea(area);
        setSearchCategory(category);
        setSearchaddedSource(addedSource);
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

        localStorage.removeItem('logDoorFilterArray');
        localStorage.setItem("logDoorFilterArray", JSON.stringify(filterarray));

        const postdata = {
            searchKeyWord: searchtext, sortType: stype ? stype : sortType, sortOrder: sorder ? sorder : sortOrder, status: filterarray, remSearchDate: remSearchDate, selectedArea: area, selectedZone: zone, selectedCategory: category, remindermode: remindermode, addedSource:addedSource
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

            var url = API_URL + "getDtoDListForWeb?page=" + cpage;

            const response = await fetch(url, options)

            const data = await response.json();

            setDoorList(data.data.data);

            setTotalCount(data.data.total);

            setFromNumber(data.data.from);

            setToNumber(data.data.to);

            settodaycnt(data.todaycount);

            setduecnt(data.duecount);

            setupcomingcnt(data.upcomingcount);

            setIsLoading(false);

            setListUpdated(false);
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

    const {
        register: registerAddCustomer,
        handleSubmit: handleSubmitAddCustomer,
        reset: resetAddCustomer,
        getValues: getValuesAddCustomer,
    } = useForm({

        defaultValues: {
            door_id: 0,
            door_company: '',
            door_contact_name: '',
            door_contact_email: '',
            door_contact_phone: '',
            door_contact_position: '',
            door_address: '',
            door_latitude: '',
            door_longitude: '',
            door_qty: '',
            door_status: 'new',
            door_area: '',
            door_zone: '',
            door_category: '',
            sales_person: 0,
            door_added_source: 'visit'
        }
    });

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
        }
        catch {

        }
    }, []);

    const addCustomer = async (id,sales_person) => {

        if (id != 0) {
            if (sales_person == loginUserId) {

                try {
                    const options = {
                        method: 'get',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json',
                            'Xtoken': authToken
                        }
                    }

                    const url = API_URL + "getDoorCustomerData/" + id;

                    const response = await fetch(url, options)

                    const data = await response.json();

                    resetAddCustomer({
                        door_id: data.data.door_id,
                        door_company: data.data.door_company,
                        door_contact_name: data.data.door_contact_name,
                        door_contact_email: data.data.door_contact_email,
                        door_contact_phone: data.data.door_contact_phone,
                        door_contact_position: data.data.door_contact_position,
                        door_address: data.data.door_address,
                        door_latitude: data.data.door_latitude,
                        door_longitude: data.data.door_longitude,
                        door_qty: data.data.door_qty,
                        door_status: data.data.door_status,
                        door_area: data.data.door_area,
                        door_zone: data.data.door_zone,
                        door_category: data.data.door_category,
                        sales_person: loginUserId,
                        door_added_source: data.data.door_added_source
                    })

                }
                catch {

                }
            }
            else{
                PNotify.notice({
                    title: "Alert!",
                    text: "You can't update this lead!",
                });
            }
        } else {
                resetAddCustomer({
                    door_id: 0,
                    door_company: '',
                    door_contact_name: '',
                    door_contact_email: '',
                    door_contact_phone: '',
                    door_contact_position: '',
                    door_address: '',
                    door_latitude: '',
                    door_longitude: '',
                    door_qty: '',
                    door_status: 'new',
                    door_area: '',
                    door_zone: '',
                    door_category: '',
                    sales_person: 0,
                    door_added_source: 'visit'
                })
        }
        setCustomerPopup(true);
        
    }

    const submitcustomer = async (data) => {

        const postdata = { ...data, comment: data.comment.replace(/\r?\n/g, '<br/>') };

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

            const url = API_URL + "saveSingleDtoD";

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {
                setCustomerPopup(false);
                setListUpdated(true);

                PNotify.success({
                    title: "Success",
                    text: data.data,
                });

            }else{
                PNotify.error({
                    title: "Error",
                    text: data.data,
                });
            }
        }
        catch {

        }

    }

    const showLoader = (value) =>{
        setIsLoading(value);
    }

    const handleCategoryChange = (e) => {
        console.log(e)
        resetAddCustomer({
            door_category: e.id
        })
    }

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: '#f4f7fa', height: '43px' })
    };

    return (
        <React.Fragment>
            <Row>
                <Col className='p-0'>
                    {isLoading ? <Loader /> : null}
                    <Card>
                        <Card.Body style={{ padding: '15px' }}>
                            <DynamicTable columns={columns} data={doorList} fromNumber={fromNumber} toNumber={toNumber} getDoorList={getDoorList} totalCount={totalCount} todaycnt={todaycnt} duecnt={duecnt} upcomingcnt={upcomingcnt} areas={areas} zones={zones} categories={categories} addCustomer={addCustomer} getZoneList={getZoneList} showLoader={showLoader} />
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
                                                            <img className="media-object img-radius comment-img" src={note.note_by === 'admin' ? adminprofile : note.note_by === 'Shams' ? shamsprofile : note.note_by === 'Shamnad' ? shamnadprofile : note.note_by === 'Rasick' ? rasickprofile : note.note_by === 'Ajmal' ? ajmalprofile : note.note_by === 'Celine' ? celineprofile : note.note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading text-muted">{note.note_by}

                                                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:MM')}</span>
                                                                <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                                                    <i className="fas fa-pencil-alt"></i>
                                                                </span>
                                                                {getDifferenceInDays(note.note_date) ?
                                                                    <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'red' }}>{note.note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span> : <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'black' }}>{note.note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span>}
                                                            </h6>
                                                            <p style={{ color: 'black', margin: 0 }}>{ReactHtmlParser(note.note_text)} </p>
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

                                                        <Button variant="success" style={{ 'fontSize': '10px' }} onClick={() => changeMonitoringDate('tomorrow')}>
                                                            T</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Week</Tooltip>}>

                                                        <Button variant="warning" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeMonitoringDate('1w')}> 1 W
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Two Week</Tooltip>}>

                                                        <Button variant="danger" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeMonitoringDate('2w')}>2 W
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Month</Tooltip>}>

                                                        <Button variant="secondary" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeMonitoringDate('1m')}> 1 M
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Three Month</Tooltip>}>

                                                        <Button variant="info" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeMonitoringDate('3m')}>3 M
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Six Month</Tooltip>}>

                                                        <Button variant="light" style={{ 'fontSize': '10px', 'line-height': 0.5 }} onClick={() => changeMonitoringDate('6m')}>6 M  </Button>
                                                    </OverlayTrigger>
                                                </ButtonGroup>

                                            </Col>
                                            <Col md="6">

                                                <input type="radio" name="remaindertype" value="noreminder" {...register1('note_type')} onChange={() => {
                                                    setMonitoringDate('');
                                                }} />&nbsp;No Reminder &nbsp;&nbsp;
                                                <input type="radio" name="remaindertype" value="notification" {...register1('note_type')} />&nbsp;Follow Up  &nbsp;&nbsp;
                                                <input type="radio" name="remaindertype" value="meeting" {...register1('note_type')} />&nbsp;Meeting &nbsp;
                                            </Col>
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

            <Modal size="lg" show={customerPopup} onHide={() => setCustomerPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h3">{getValuesAddCustomer('door_id') == 0 ? 'Add' : 'Edit'} New Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <Card style={{ margin: 0 }}>
                        <Card.Body>

                            <Form onSubmit={handleSubmitAddCustomer(submitcustomer)}>
                                <Row>
                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" className="form-control" placeholder='Company Name *' {...registerAddCustomer('door_company')} required />

                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Customer Name' {...registerAddCustomer('door_contact_name')} />

                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="email" class="form-control" placeholder='Contact Email' {...registerAddCustomer('door_contact_email')} />

                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Contact Phone' {...registerAddCustomer('door_contact_phone')} />

                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Contact Position' {...registerAddCustomer('door_contact_position')} />

                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Address ' {...registerAddCustomer('door_address')} />

                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Latitude *' {...registerAddCustomer('door_latitude')} required />

                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="text" class="form-control" placeholder='Longitude *' {...registerAddCustomer('door_longitude')} required />

                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect1">

                                            <input type="float" class="form-control" placeholder='Qty' {...registerAddCustomer('door_qty')} />

                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Control as="select" {...registerAddCustomer('door_status')} required>
                                                <option value="">Status*</option>
                                                <option value="new">New</option>
                                                <option value="interested">Interested</option>
                                                <option value="futurerequirements">Future Requirements</option>
                                                <option value="alreadydone">Already Done</option>
                                                <option value="norequirement">No Requirement</option>
                                                <option value="invalid">Invalid</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="category"
                                                options={categories}
                                                value={categories.find(obj => obj.label === getValuesAddCustomer('door_category'))}
                                                onChange={(e) =>handleCategoryChange(e)}
                                                placeholder="Type Category Name"
                                                styles={colourStyles}
                                                isClearable={true}
                                                
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Control as="select" {...registerAddCustomer('door_area')} onChange={(e) => { onChangeAddPopupArea(e, getValuesAddCustomer('door_area')); }}>
                                                <option value=''>Select Area</option>
                                                {areas.length>0
                                                    && areas.map((item, i) => {
                                                        return <option value={item.area_id}>{item.area_name}</option>
                                                    })}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Control as="select" {...registerAddCustomer('door_zone')} >
                                                <option value=''>Select Zone</option>
                                                {zones
                                                    && zones.map((item, i) => {
                                                        return <option value={item.id}>{item.name}</option>
                                                    })}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Control placeholder='Website' {...registerAddCustomer('door_website')} ></Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md="4">
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Control as="select" {...registerAddCustomer('door_added_source')} >
                                                <option value='visit'>Scheduled Visit</option>
                                                <option value='list'>From the List</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4}>
                                        <Form.Group controlId="exampleForm.ControlSelect6">
                                            <Form.Control as="select" {...registerAddCustomer('sales_person')}>
                                                <option value="0">Select sales person</option>
                                                {salespersons &&
                                                    salespersons.map(person => (
                                                        <option key={person.user_id} value={person.user_id}>
                                                            {person.user_name}
                                                        </option>
                                                    ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md="8">
                                        <Form.Control as="textarea" placeholder='Comment here' rows="2" {...registerAddCustomer('comment')} />
                                    </Col>
                                </Row>
                                {getValuesAddCustomer('door_id') > 0 && <Button variant="primary" onClick={() => {
                                    if (window.confirm('Move to Sale plus?')) {
                                        moveToSalesplus(getValuesAddCustomer('door_id'));
                                        setCustomerPopup(false);
                                    }
                                }} style={{ margin: '40px auto 10px', float: 'left', padding: '10px 30px' }} ><i class="fas fa-arrows-alt m-0"></i> Move To Sale Plus</Button>}

                                <Button variant="success" type='submit' style={{ margin: '40px auto 10px', float: 'right', padding: '10px 30px' }} >Submit</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

        </React.Fragment>
    );
}

export default App