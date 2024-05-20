import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { Row, Col, Card, Pagination, Modal, Button, ButtonGroup, OverlayTrigger, Tooltip, Form, Table, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import './subscription.css';
import ReactHtmlParser from 'react-html-parser';
import ScrollToBottom from 'react-scroll-to-bottom';

import adminprofile from "../../assets/images/profile-logo/admin.png";

import shamsprofile from "../../assets/images/profile-logo/shams.jpg";

import shamnadprofile from "../../assets/images/profile-logo/shamnad.jpg";

import rasickprofile from "../../assets/images/profile-logo/rasick.jpg";

import ajmalprofile from "../../assets/images/profile-logo/ajmal.jpg";

import celineprofile from "../../assets/images/profile-logo/celine.jpg";

import shoneprofile from "../../assets/images/profile-logo/shone.jpg";

import { API_URL } from "../../config/constant";

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

  const datafilter = [
    {
      name: "servicepending",
      value: "false",
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
      value: "false",
      label: "Partial"
    }
  ];

  const [searchCustomer, setSearchCustomer] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [selectedFromMonth, setSelectedFromMonth] = useState(0);
  const [selectedFromYear, setSelectedFromYear] = useState(0);
  const [selectedToMonth, setSelectedToMonth] = useState(0);
  const [selectedToYear, setSelectedToYear] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isFilter, setisFilter] = useState(false);

  const [filterarray, setFilterarray] = useState({ "active": true });
  const [filterdata, setFilterdata] = useState(datafilter);
  const [finalFilterarray, setFinalFilterarray] = useState({ "active": true });
  const [searchOnCurrentPage, setSearchOnCurrentPage] = useState(false);
  const [selectedCurrentMonth, setSelectedCurrentMonth] = useState(false);

  const onChangeSearchCustomer = (e) => {
    setSearchCustomer(e.target.value);
  };

  const handleFromMonthChange = (e) => {
    const selectedFromMonth = e.target.value;
    setSelectedFromMonth(selectedFromMonth);
  };

  const handleFromYearChange = (e) => {
    const selectedFromYear = e.target.value;
    setSelectedFromYear(selectedFromYear);
  };

  const handleToMonthChange = (e) => {
    const selectedToMonth = e.target.value;
    setSelectedToMonth(selectedToMonth);
  };

  const handleToYearChange = (e) => {
    const selectedToYear = e.target.value;
    setSelectedToYear(selectedToYear);
  };

  const currentMonth = (e) => {

    if (e.target.checked) {

      const date = new Date();
      const month = date.getMonth() + 1;

      setFromDate(date.getFullYear() + '-' + month + '-01');
      setToDate(date.getFullYear() + '-' + month + '-31');
    } else {
      setFromDate(null);
      setToDate(null);
    }

    if (pageIndex > 0) {
      gotoPage(0);
    } else {
      setSearchOnCurrentPage(searchOnCurrentPage === true ? false : true)
    }
  }

  const search = () => {

    if (selectedFromMonth !== 0 && selectedFromYear !== 0)
      setFromDate(selectedFromYear + '-' + selectedFromMonth + '-01');
    if (selectedToMonth !== 0 && selectedToYear !== 0)
      setToDate(selectedToYear + '-' + selectedToMonth + '-31');

    if (searchCustomer)
      setSearchText(searchCustomer);

    if (pageIndex > 0) {
      gotoPage(0);
    } else {
      setSearchOnCurrentPage(searchOnCurrentPage === true ? false : true)
    }
  };

  const clearAllFilters = () => {
    setSearchCustomer(null);
    setSearchText(null)
    setSelectedFromMonth(0);
    setSelectedFromYear(0);
    setSelectedToMonth(0);
    setSelectedToYear(0);
    setFromDate(null);
    setToDate(null);
    setSelectedCurrentMonth(false);

    if (pageIndex > 0) {
      gotoPage(0);
    } else {
      setSearchOnCurrentPage(searchOnCurrentPage === true ? false : true)
    }
  }

  const handleFilterArrayChange = (e) => {

    const isChecked = e.target.checked;
    const checkeditem = e.target.name;

    if (checkeditem === 'all' && isChecked) {
      setFilterarray({ "active": true, "servicepending": true, "readyforinvoice": true, "invoiced": true, "partial": true, "yearly": true, "quarterly": true, "semi": true, "monthly": true, "priority": true, "all": true })
    } else if (checkeditem === 'all' && !isChecked) {
      setFilterarray({ "active": true, "servicepending": false, "readyforinvoice": false, "invoiced": false, "partial": false, "yearly": false, "quarterly": false, "semi": false, "monthly": false, "priority": false, "all": false })
    } else {
      setFilterarray({ ...filterarray, [checkeditem]: isChecked });
    }

  }

  const filterSearch = () => {

    setFinalFilterarray(filterarray);
    setisFilter(false);
    if (pageIndex > 0) {
      gotoPage(0);
    } else {
      setSearchOnCurrentPage(searchOnCurrentPage === true ? false : true)
    }
  }

  const clearPopupFilter = () => {
    setisFilter(false);
    setFinalFilterarray({ "active": true });
    setFilterarray({ "active": true });
    setFilterdata(datafilter)
    if (pageIndex > 0) {
      gotoPage(0);
    } else {
      setSearchOnCurrentPage(searchOnCurrentPage === true ? false : true)
    }
  }

  useEffect(() => {
    getSubscriptionsList({ pageIndex, searchText, fromDate, toDate, finalFilterarray, sortBy })
  }, [getSubscriptionsList, pageIndex, toDate, searchText, finalFilterarray, sortBy, searchOnCurrentPage])

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

          <Col xs={1}>
            <Form.Control as="select" value={selectedFromMonth} onChange={handleFromMonthChange}>
              <option value="0">F. Month...</option>
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
          <Col xs={1}>
            <Form.Control as="select" value={selectedFromYear} onChange={handleFromYearChange}>
              <option value="0">F. Year</option>
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
          <Col xs={1}>
            <Form.Control as="select" value={selectedToMonth} onChange={handleToMonthChange}>
              <option value="0">T. Month...</option>
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
          <Col xs={1}>
            <Form.Control as="select" value={selectedToYear} onChange={handleToYearChange}>
              <option value="0">T. Year</option>
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
          <Col xs={2}>
            <Form.Control placeholder="Search..." value={searchCustomer || ''} onChange={onChangeSearchCustomer} onKeyPress={handleKeypress} />
            {searchCustomer && <button type="button" className="react-datepicker__close-icon" onClick={clearAllFilters} style={{ right: '2px', height: '90%' }}></button>}
          </Col>
          <Col xs={6} style={{ padding: 0 }}>
            <button
              className="text-capitalize btn btn-success"
              type="button"
              onClick={search}
            >
              <i className="feather icon-search" style={{ margin: 0 }}></i>
            </button>

            <button
              className="text-capitalize btn btn-light"
              type="button"
            >
              <div className="checkbox d-inline">
                <Form.Control type="checkbox" name="current_month" value={selectedCurrentMonth} id="current_month" onChange={currentMonth} />
                <Form.Label htmlFor="current_month" className="cr  m-0">Current month</Form.Label>
              </div>
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

            <button
              className="btn btn-warning"
              type="button"
              onClick={() => showReminders()}
              style={{ padding: '10px 6px', float: 'right' }}
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
          <Col xs={12} style={{ color: 'black', padding: '5px' }}><b>Filtered Count : {totalCount}</b></Col>
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

          </Row>

          <hr />

          <Row>

            {filterdata.map((item, index) => (
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

          <hr />

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
          <hr />

          <Row>
            <Col md={6} xl={4}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="all" value="false" checked={filterarray['all']} id="all" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="all" className="cr">All</Form.Label>
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

const findMonthDifference = (date) => {
  var months;
  var d1 = new Date(date);
  var d2 = new Date();
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months;
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


function App() {

  const authToken = localStorage.getItem('authToken');
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [fromNumber, setFromNumber] = useState(0);
  const [toNumber, setToNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setselectedCustomer] = useState('');
  const [selectedCustomerId, setselectedCustomerId] = useState(0);
  const [expDateList, setexpDateList] = useState([]);
  const [isExpDateList, setisExpDateList] = useState(false);
  const [reminderPopup, setReminderPopup] = useState(false);
  const [remDate, setRemDate] = useState('');
  const today = new Date();
  const [notearray, setNoteArray] = useState([]);

  const [rectifytextPopup, setRectifyTextPopup] = useState(false);

  const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [expMonth, setexpMonth] = useState(today.getMonth() + 1);
  const [expYear, setexpYear] = useState(today.getFullYear());
  const [selectedExpiryDate, setselectedExpiryDate] = useState(monthList[today.getMonth()] + '-' + today.getFullYear());
  const [customerExpDate, setcustomerExpDate] = useState('01-' + monthList[today.getMonth()] + '-' + today.getFullYear());

  const [updtepopup, setupdatepopup] = useState(false);
  const [contactList, setContactList] = useState([{ order: 1, name: "", email: "", phone: "", position: "" }]);
  const [listupdated, setListUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortType, setSortType] = useState('customer_expiry_date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterData, saveFilterData] = useState({});
  const [searchFrom, setFromDate] = useState(null);
  const [searchTo, setToDate] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [dueremindercount, setDueReminderCount] = useState(0);
  const [reminderListPopup, setReminderListPopup] = useState(false);
  const [remindertextPopup, setReminderTextPopup] = useState(false);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [rectifiedFilter, setRectifiedFilter] = useState(false);
  const [selectedRemType, setSelectedRemType] = useState('self');
  const [remSearchDate, setRemSearchDate] = useState('today');
  const [searchReminder, setSearchReminder] = useState(null);
  const [refreshReminders, setRefreshReminders] = useState(false);
  const loginUserId = localStorage.getItem('loginUserId');
  const loginUserName = localStorage.getItem('loginUserName');

  const showReminderPopup = () => {
    setReminderListPopup(true);
    setRectifiedFilter(false);
    setSelectedRemType('self');
    setRemSearchDate('today');
    setSearchReminder(null);
    getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);
  }
  const filterRectifiedReminders = (e) => {
    setRectifiedFilter(rectifiedFilter === true ? false : true);
  }
  const searchFromReminder = () => {
    getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);
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

      const url = API_URL + `getSubscriptionReminders/${selectedRemType}/${rectifiedFilter}/${remSearchDate}/${searchReminder}`;

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
  }, [getReminders, rectifiedFilter, selectedRemType, refreshReminders, remSearchDate])


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

      const url = API_URL + "removeSubscriptionReminder";

      const response = await fetch(url, options)

      const data = await response.json();

      setReminderTextPopup(false);

      setListUpdated(true);

      getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);

      sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully removed reminder!' })
    }
    catch {

    }
  }

  const updateReminder = (reminderdata) => {
    // setReminderListPopup(false);
    SubscriberUpdate(reminderdata);
  }

  const updateMNote = (reminderdata) => {
    //setReminderListPopup(false);
    showRemDatePopup(reminderdata);
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

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      expMonth: expMonth,
      expYear: expYear,
      customer_exp_count: "",
      customer_exp_type: "both",
      customer_exp_remark: "",
      selectedExpiryDate: selectedExpiryDate,
      customer_exp_date: customerExpDate,
      customer_exp_id: 0,
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

  const handleExpMonthChange = (e) => {
    const month = e.target.value;
    setexpMonth(month);
    setselectedExpiryDate(monthList[month] + '-' + expYear);
    setcustomerExpDate('01-' + month + '-' + expYear);
  };

  const handleExpYearChange = (e) => {
    const year = e.target.value;
    setexpYear(year);
    setselectedExpiryDate(expMonth + '-' + year);
    setcustomerExpDate('01-' + expMonth + '-' + year);
  };

  const onSubmit = async (datarow) => {

    const datapost = { ...datarow, customer_exp_date: customerExpDate };

    try {
      const options = {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Xtoken': authToken
        },
        body: JSON.stringify(datapost),
      };

      if (datapost.customer_exp_id > 0) {

        const url = API_URL + "editExpiryDate/" + datapost.customer_exp_id;

        const response = await fetch(url, options)

        const data = await response.json();

        if (data.status === 'success') {

          sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully edited expiry date!' })

          CustomerExpDateList(selectedCustomerId, selectedCustomer);

        } else {
          sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in editing expiry date!' })
        }

      } else {

        const url = API_URL + "addExpiryDate/" + selectedCustomerId;

        const response = await fetch(url, options)

        const data = await response.json();

        if (data.status === 'success') {

          sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully added expiry date!' })

          CustomerExpDateList(selectedCustomerId, selectedCustomer);

        } else {
          sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in adding expiry date!' })
        }

      }

    }
    catch {

    }
  }

  const getSingleExpiryDateDetails = async (id) => {

    try {
      const options = {
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Xtoken': authToken
        }
      }

      const url = API_URL + "getSingleExpDateDetails/" + id;

      const response = await fetch(url, options)

      const data = await response.json();

      const expdata = data.data;

      const expdate = new Date(expdata.customer_exp_date);

      setexpMonth(expdate.getMonth() + 1);
      setexpYear(expdate.getFullYear());
      setselectedExpiryDate(monthList[expdate.getMonth()] + '-' + expdate.getFullYear());
      setcustomerExpDate('01-' + (expdate.getMonth() + 1) + '-' + expdate.getFullYear());

      reset({
        expMonth: expdate.getMonth() + 1,
        expYear: expdate.getFullYear(),
        customer_exp_id: expdata.customer_exp_id,
        customer_exp_count: expdata.customer_exp_count,
        customer_exp_type: expdata.customer_exp_type,
        customer_exp_remark: expdata.customer_exp_remark,
        selectedExpiryDate: monthList[expdate.getMonth()] + '-' + expdate.getFullYear(),
        customer_exp_date: '01-' + (expdate.getMonth() + 1) + '-' + expdate.getFullYear(),

      });
    }
    catch {

    }
  }

  const deleteSingleExpiryDateDetails = async (id) => {

    try {
      const options = {
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Xtoken': authToken
        }
      }

      const url = API_URL + "deleteExpiryDate/" + id;

      const response = await fetch(url, options)

      const data = await response.json();

      if (data.status === 'success') {

        sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully deleted expiry date!' })

        CustomerExpDateList(selectedCustomerId, selectedCustomer);

      } else {
        sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in deleting expiry date!' })
      }
    }
    catch {

    }
  }

  const CustomerExpDateList = async (id, name) => {

    setselectedCustomer(name);
    setselectedCustomerId(id);

    try {
      const options = {
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }

      const url = API_URL + "getSubscriptionExpDates/" + id;

      const response = await fetch(url, options)

      const data = await response.json();

      setexpDateList(data.data);

      reset({
        expMonth: expMonth,
        expYear: expYear,
        customer_exp_count: "",
        customer_exp_type: "both",
        customer_exp_remark: "",
        selectedExpiryDate: selectedExpiryDate,
        customer_exp_date: customerExpDate,
        customer_exp_id: 0,
      });

      setisExpDateList(true);
    }
    catch {

    }
  }

  const clearExpiryForm = () => {
    setexpMonth(today.getMonth() + 1);
    setexpYear(today.getFullYear());
    setselectedExpiryDate(monthList[today.getMonth()] + '-' + today.getFullYear());
    setcustomerExpDate('01-' + monthList[today.getMonth()] + '-' + today.getFullYear());

    reset({
      expMonth: today.getMonth() + 1,
      expYear: today.getFullYear(),
      customer_exp_count: "",
      customer_exp_type: "both",
      customer_exp_remark: "",
      selectedExpiryDate: monthList[today.getMonth()] + '-' + today.getFullYear(),
      customer_exp_date: '01-' + monthList[today.getMonth()] + '-' + today.getFullYear(),
      customer_exp_id: 0,
    });

    setisExpDateList(false);
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

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    reset: reset1
  } = useForm({
    defaultValues: {
      subscriber_note: '',
      subscription_note_id: 0,
      subscription_note_assigned_to: loginUserName
    }
  });

  const fillformtoedit = (note) => {
    reset1({
      subscriber_note: note.subscription_note_text.replaceAll('<br/>', '\n'),
      subscription_note_id: note.subscription_note_id,
      subscription_note_assigned_to: note.subscription_note_assigned_to
    });
    if (note.subscription_note_date && note.subscription_note_date !== '0000-00-00 00:00:00') {
      setRemDate(new Date(note.subscription_note_date));
    } else {
      setRemDate();
    }
  }

  const showRemDatePopup = async (selectedcustomerdetails) => {

    setIsLoading(true);

    setselectedCustomerId(selectedcustomerdetails.customer_id);
    setselectedCustomer(selectedcustomerdetails.name);

    try {
      const options = {
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Xtoken': authToken
        }
      }

      const url = API_URL + "getSubscriptionNotes/" + selectedcustomerdetails.customer_id + "/subscription";

      const response = await fetch(url, options)

      const data = await response.json();

      setNoteArray(data.data);

      setReminderPopup(true);

      setIsLoading(false);
    }
    catch {

    }

    setRemDate('');

    reset1({
      subscriber_note: '',
      subscription_note_id: 0,
      subscription_note_assigned_to: loginUserName
    });

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


  const submitReminderDate = async (data) => {

    const postdata = { customer_id: selectedCustomerId, subscriber_note: data.subscriber_note.replace(/\r?\n/g, '<br/>'), subscriber_reminder_date: remDate ? Moment(remDate).format('YYYY-MM-DD HH:mm') : '', subscription_note_id: data.subscription_note_id, subscription_note_assigned_to: data.subscription_note_assigned_to };


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

      const url = API_URL + "saveSubscriberNote";

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

  const loginToWeb = (email, pswd) => {

    const weburl = 'https://mylocatorplus.com/office-use/#/access/signin?username=' + window.btoa(email) + '&password=' + window.btoa(pswd);
    window.open(weburl, '_blank');
  }


  const columns = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'subscription_due_priority',
        className: 'prioritycolumn',
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
        className: 'subnamecolumn',
        Cell: ({ row }) => {

          return (
            <span onClick={() => SubscriberUpdate(row.original)} style={{ color: 'black', cursor: 'pointer' }}><b>{row.original.name.replace(/&amp;/g, '&').substring(0, 35)}</b>
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
        Header: 'Expiry Date',
        accessor: 'customer_expiry_date',
        className: 'subexpirycolumn',
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.customer_expiry_date !== '0000-00-00' && row.original.customer_expiry_date !== null ? Moment(row.original.customer_expiry_date).format('MMM-YYYY') : ""}

              <OverlayTrigger
                placement='top'
                overlay={<Tooltip id={`tooltip-top`}>{row.original.ExpairyCount > 1 ? 'View Expiry Date List' : 'Add Multiple Expiry Date'}</Tooltip>}
              >
                <Button variant={row.original.ExpairyCount > 1 ? 'success' : 'secondary'} onClick={() => CustomerExpDateList(row.original.customer_id, row.original.customer_name)} style={{ padding: '4px 3px', margin: '0px 5px', float: 'right' }}><i className="fa fa-eye" style={{ color: '#fff', margin: 0 }}></i></Button>
              </OverlayTrigger>
            </span>
          );
        }
      },
      {
        Header: 'Term',
        accessor: 'term',
        className: 'subtermcolumn'
      },
      {
        Header: 'Due',
        accessor: 'ExpairyCount',
        className: 'duemonthcolumn',
        disableSortBy: true,
        Cell: ({ row }) => {

          return (
            <span>{row.original.customer_expiry_date !== '0000-00-00' && row.original.customer_expiry_date !== null && row.original.customer_expiry_date !== '1970-01-31' && row.original.customer_expiry_date !== '1970-01-01' ? <OverlayTrigger
              placement='top'
              overlay={<Tooltip id={`tooltip-top`}>{findMonthDifference(row.original.customer_expiry_date) < 0 ? '' : findMonthDifference(row.original.customer_expiry_date) === 0 ? 'This Month' : findMonthDifference(row.original.customer_expiry_date) + ' Month'}</Tooltip>}
            >
              <Button className='btn-rounded text-capitalize' variant="light" style={{ padding: '2px', margin: '0px', backgroundColor: 'unset', border: 'none' }}>{findMonthDifference(row.original.customer_expiry_date) >= 0 ? findMonthDifference(row.original.customer_expiry_date) : ''}</Button>
            </OverlayTrigger > : ''}</span>
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
        Header: '2G',
        accessor: 'customer_sim_2g_count',
        className: 'simg'
      },
      {
        Header: '4G',
        accessor: 'customer_sim_4g_count',
        className: 'simg'
      },
      {
        Header: 'Status',
        accessor: 'customer_status',
        className: 's_statuscolumn',
        Cell: ({ row }) => {

          return (
            <span style={{ textTransform: 'capitalize' }}>{row.original.customer_status === 'demoaccount' ? 'Demo Account' : row.original.customer_status} <br />
              {row.original.subscriber_status !== '' && row.original.subscriber_status !== null && row.original.subscriber_status !== 'NULL' && row.original.subscriber_status !== 'renewed' ? '[' + (row.original.subscriber_status === 'servicepending' ? 'Service Pending' : row.original.subscriber_status === 'readyforinvoice' ? 'Ready for Invoice' : row.original.subscriber_status) + ']' : ''}
            </span>
          );
        }
      },
      {
        Header: 'Rem. Date',
        accessor: 'subscriber_reminder_date',
        className: 'remdatecolumn',
        Cell: ({ row }) => {
          return (
            <span style={{ fontWeight: 'bold', color: 'black' }}>{row.original.subscriber_reminder_date && row.original.subscriber_reminder_date !== '0000-00-00 00:00:00' ? row.original.subscriber_reminder_date : ''}</span>
          );
        }
      },
      {
        Header: 'Note',
        accessor: 'latestnote',
        className: 'notecolumn',
        disableSortBy: true,
        Cell: ({ row }) => {

          if (row.original.latestnote !== null && row.original.latestnote !== 'null' && row.original.latestnote !== '') {
            var note = row.original.latestnote;
          } else {
            var note = '';
          }



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
        className: 'mnbuttoncolumn',
        disableSortBy: true,
        Cell: ({ row }) => {

          return (
            <span>

              <OverlayTrigger
                placement='top'
                overlay={<Tooltip id={`tooltip-top`}>Update Due Note</Tooltip>}
              >
                <Button onClick={() => showRemDatePopup(row.original)} className='text-capitalize' variant="success" style={{ padding: '6px' }}><i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i></Button>
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
            <Button className='text-capitalize' variant="primary" onClick={() => loginToWeb(row.original.email, row.original.password)} style={{ padding: '6px' }}><i className="fas fa-sign-in-alt" style={{ margin: 0 }}></i></Button>
          );

        }
      }
    ],
    []
  )

  const getSubscriptionsList = useCallback(async ({ pageIndex, searchText, fromDate, toDate, finalFilterarray, sortBy }) => {

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

    if (!fromDate) {
      fromDate = null;
    }

    if (!toDate) {
      toDate = null;
    }

    setFromDate(fromDate);

    setToDate(toDate);

    saveFilterData(finalFilterarray);

    const postdata = {
      searchstatus: finalFilterarray, keyword: searchText, sortType: stype ? stype : sortType, sortOrder: sorder ? sorder : sortOrder, search_date_from: fromDate, search_date_to: toDate
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

      const url = API_URL + "AllSubscribers?page=" + cpage;

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

  useEffect(() => {
    if (listupdated) {
      const sortBy = [{ id: sortType, desc: sortOrder === 'desc' ? true : false }];
      const pageIndex = currentPage;
      const searchText = searchKeyword;
      const fromDate = searchFrom;
      const toDate = searchTo;
      const finalFilterarray = filterData;
      getSubscriptionsList({ pageIndex, searchText, fromDate, toDate, finalFilterarray, sortBy });
      getReminders(rectifiedFilter, selectedRemType, remSearchDate, searchReminder);
    }
  }, [listupdated])

  useEffect(() => {
    if (!isExpDateList) {
      setListUpdated(true);
    }
  }, [isExpDateList])

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      //title: alert.title,
      icon: alert.type,
      text: alert.text,
      type: alert.type
    });
  };

  const Loader = () => (
    <div className="divLoader">
      <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
        <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
      </svg>
    </div>
  );

  const onSubmitUpdate = async (data) => {

    const lastdateofmonth = new Date(data.expYear, data.expMonth, 0).getDate();

    const postdata = { ...data, customer_expiry_date: data.expYear + '-' + data.expMonth + '-' + lastdateofmonth, customer_id: selectedCustomerId, multiple_contact_details: JSON.stringify(contactList) };

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


      const url = API_URL + "saveSubscriberDetails";

      const response = await fetch(url, options)

      const resdata = await response.json();

      if (resdata.status === 'success') {

        setListUpdated(true);

        sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated details!' })

      } else {
        sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating data!' })
      }
    }
    catch {

    }
  }

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
        <Col>
          {isLoading ? <Loader /> : null}
          <Card>
            <Card.Body>
              <DynamicTable columns={columns} data={subscriptions} fromNumber={fromNumber} toNumber={toNumber} getSubscriptionsList={getSubscriptionsList} totalCount={totalCount} showReminderPopup={showReminderPopup} dueremindercount={dueremindercount} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal size="lg" show={isExpDateList} onHide={() => setisExpDateList(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Add Multiple Expiry Date - {selectedCustomer}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={7}>
              <Table responsive style={{ border: '1px solid #eaeaea', borderTop: 'none' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Count</th>
                    <th>Type</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {expDateList.map((item, index) => (
                    <tr>
                      <td>{item.customer_exp_date}</td>
                      <td>{item.customer_exp_count}</td>
                      <td>{item.customer_exp_type === 'both' ? 'Software & Data' : item.customer_exp_type === 's/w' ? 'Software' : 'Data'}</td>
                      <td>
                        <Button variant="primary" onClick={() => getSingleExpiryDateDetails(item.customer_exp_id)} style={{ padding: '5px' }}>Edit</Button>
                        <Button variant="danger"
                          onClick={() => {
                            const confirmBox = window.confirm(
                              "Are you sure you want to delete this?"
                            )
                            if (confirmBox === true) {
                              if (expDateList.length > 1) {
                                deleteSingleExpiryDateDetails(item.customer_exp_id)
                              } else {
                                window.alert("It cannot be deleted because this is the only one expiry date")
                              }

                            }
                          }} style={{ padding: '5px' }}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>

            <Col sm={5}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Form key="expdateform" onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="exampleForm.ControlInput1" style={{ margin: 0 }}>
                          <Form.Label>Expiry Date</Form.Label>

                          <Form.Control type="text" {...register('customer_exp_id')} hidden />

                          <Form.Control type="text" placeholder="Date" {...register('selectedExpiryDate')} />
                        </Form.Group>
                        <Row>
                          <Col md={6} style={{ paddingRight: 0 }}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                              <Form.Control as="select" {...register('expMonth')} onChange={handleExpMonthChange}>
                                <option value={1}>January</option>
                                <option value={2}>February</option>
                                <option value={3}>March</option>
                                <option value={4}>April</option>
                                <option value={5}>May</option>
                                <option value={6}>June</option>
                                <option value={7}>July</option>
                                <option value={8}>August</option>
                                <option value={9}>September</option>
                                <option value={10}>October</option>
                                <option value={11}>November</option>
                                <option value={12}>December</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6} style={{ paddingLeft: 0 }}>
                            <Form.Group controlId="exampleForm.ControlSelect2">
                              <Form.Control as="select" {...register('expYear')} onChange={handleExpYearChange}>
                                <option value={2017}>2017</option>
                                <option value={2018}>2018</option>
                                <option value={2019}>2019</option>
                                <option value={2020}>2020</option>
                                <option value={2021}>2021</option>
                                <option value={2022}>2022</option>
                                <option value={2023}>2023</option>
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group controlId="exampleForm.ControlInput2">
                          <Form.Label>Count</Form.Label>
                          <Form.Control type="text" placeholder="Count" {...register('customer_exp_count')} />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlSelect3">
                          <Form.Label>Status</Form.Label>
                          <Form.Control as="select" {...register('customer_exp_type')}>
                            <option value="both">Software & Data</option>
                            <option value="s/w">Software</option>
                            <option value="data">Data</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlTextarea1">
                          <Form.Label>Remarks</Form.Label>
                          <Form.Control as="textarea" rows="3" {...register('customer_exp_remark')} />
                        </Form.Group>

                        <Button variant="success" type='submit'>Submit</Button>
                        <Button variant="secondary" onClick={() => clearExpiryForm()}>Close</Button>
                      </Form>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal size="lg" show={reminderPopup} onHide={() => setReminderPopup(false)} backdrop="static">
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
                          <li className="media">
                            <div className="media-left mr-3">
                              <img className="media-object img-radius comment-img" src={note.subscription_note_by === 'admin' ? adminprofile : note.subscription_note_by === 'Shams' ? shamsprofile : note.subscription_note_by === 'Shamnad' ? shamnadprofile : note.subscription_note_by === 'Rasick' ? rasickprofile : note.subscription_note_by === 'Ajmal' ? ajmalprofile : note.subscription_note_by === 'Celine' ? celineprofile : note.subscription_note_by === 'Shone' ? shoneprofile : adminprofile} alt="Generic placeholder" />
                            </div>
                            <div className="media-body">
                              <h6 className="media-heading text-muted">{note.sub_note_by}
                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:mm')}</span>
                                {note.subscription_note_by === loginUserName && <span onClick={() => fillformtoedit(note)} style={{ marginLeft: '10px', color: '#04a9f5' }}>
                                  <i class="fas fa-pencil-alt"></i>
                                </span>}

                                <span style={{ fontWeight: 'bold', marginLeft: '15px', float: 'right', color: 'black' }}>{note.subscription_note_date !== '0000-00-00 00:00:00' ? '[' + Moment(note.subscription_note_date).format('DD-MM-YYYY HH:mm') + ']' : ''}</span>

                                <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Assigned to</Tooltip>}><span style={{ float: 'right', fontWeight: 'bold', color: 'darkmagenta' }}><i className="fas fa-arrow-circle-right" style={{ marginRight: '10px' }}></i>
                                  {note.subscription_note_assigned_to}</span>
                                </OverlayTrigger>
                              </h6>

                              <p style={{ color: 'black', margin: 0 }}>{ReactHtmlParser(note.subscription_note_text)} </p>
                              <p style={{ fontStyle: 'italic' }}>{ReactHtmlParser(note.remove_reminder_text)} </p>

                            </div>
                          </li>
                        ))}
                      </ul>
                    </ScrollToBottom>}

                  <Form key="monitoringform" onSubmit={handleSubmit1(submitReminderDate)}>
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


                    <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...register1('subscriber_note')} />

                    <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Comment</Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>

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


      <Modal size="xl" show={updtepopup} onHide={() => setupdatepopup(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title as="h5">{selectedCustomer}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitUpdate(onSubmitUpdate)}>
          <Modal.Body>
            <Row>
              <Col md={2}>
                <Form.Group controlId="exampleForm.ControlSelect2">
                  <Form.Label>Status</Form.Label>
                  <Form.Control as="select" {...registerUpdate('customer_status')}>
                    <option value="active">Active</option>
                    <option value="new">New</option>
                    <option value="demoaccount">Demo</option>
                    <option value="blocked">Blocked</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="exampleForm.ControlSelect3">
                  <Form.Label>Sub Status</Form.Label>
                  <Form.Control as="select" {...registerUpdate('subscriber_status')}>
                    <option value="renewed">Select Status</option>
                    <option value="servicepending">Service Pending</option>
                    <option value="readyforinvoice">Ready for Invoice</option>
                    <option value="invoiced">Invoiced</option>
                    <option value="partial">Partial</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlSelect5" style={{ width: '40%', display: 'inline-block', marginLeft: '5px' }}>
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control as="select" {...registerUpdate('expMonth')}>
                    <option value="">Month</option>
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlSelect6" style={{ width: '40%', display: 'inline-block', marginLeft: '5px' }}>
                  <Form.Label style={{ height: '15px' }}></Form.Label>
                  <Form.Control as="select" {...registerUpdate('expYear')}>
                    <option value="">Year</option>
                    <option value={2017}>2017</option>
                    <option value={2018}>2018</option>
                    <option value={2019}>2019</option>
                    <option value={2020}>2020</option>
                    <option value={2021}>2021</option>
                    <option value={2022}>2022</option>
                    <option value={2023}>2023</option>
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                  </Form.Control>
                </Form.Group>

                <Button variant={getValues('ExpairyCount') > 1 ? 'success' : 'secondary'} onClick={() => CustomerExpDateList(selectedCustomerId, selectedCustomer)} style={{ padding: '4px 3px', margin: '35px 5px 0', float: 'right' }}><i className="fa fa-eye" style={{ color: '#fff', margin: 0 }}></i></Button>
              </Col>

              <Col md={2}>
                <Form.Group controlId="exampleForm.ControlSelect3">
                  <Form.Label>Term</Form.Label>
                  <Form.Control as="select" {...registerUpdate('term')}>
                    <option value="yearly">Yearly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi">Semi-annual</option>
                    <option value="monthly">Monthly</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group controlId="exampleForm.ControlText1">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control rows="1" {...registerUpdate('subscriber_amount')} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control as="textarea" rows="2" {...registerUpdate('subscriber_remarks')} />
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
                <input type="text" className="form-control" {...registerUpdate('customer_contact_name')} />
              </Col>
              <Col md={3}>
                <input type="text" className="form-control" {...registerUpdate('customer_email')} />
              </Col>
              <Col md={2}>
                <input type="text" className="form-control" {...registerUpdate('customer_contact_phone')} />
              </Col>
              <Col md={2}>
                <input type="text" className="form-control" {...registerUpdate('customer_contact_position')} />
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
              <Col><Button variant='info' onClick={() => handleAddContact()} style={{ margin: '10px 48% 0' }}><i className="fas fa-plus m-r-5" style={{ margin: 0 }} /></Button></Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type='submit'>Submit</Button>
            <Button variant="secondary" onClick={() => setupdatepopup(false)}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal size="xl" show={reminderListPopup} onHide={() => setReminderListPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Reminders</Modal.Title>
          <Row style={{ margin: '0 auto', width: '80%' }}>
            <Col md="6">
              <ButtonGroup>{selectedRemType !== 'others' && rectifiedFilter === false &&
                <>
                  <Button variant={remSearchDate === 'today' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('today')}>Today</Button>
                  <Button variant={remSearchDate === 'due' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('due')} style={{ padding: '10px 20px' }}>Due</Button>
                  <Button variant={remSearchDate === 'upcoming' ? 'warning' : 'outline-warning'} onClick={() => setRemSearchDate('upcoming')}>Upcoming</Button></>
              }
                <Button variant={rectifiedFilter === true ? 'warning' : 'outline-warning'} onClick={() => filterRectifiedReminders()}>Rectified</Button>
              </ButtonGroup>
            </Col>

            <Col md="2">
              <Form.Control as="select" value={selectedRemType} onChange={(e) => setSelectedRemType(e.target.value)}>
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
                <Card.Body style={{ height: '85vh' }}>
                  {reminders && reminders.length > 0 ?
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
                            <td onClick={() => updateMNote(reminder)}>{reminder.name}<br /><OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Created on</Tooltip>}><span style={{ fontSize: '11px' }}>{Moment(reminder.created_at).format('DD-MM-YYYY HH:mm')}</span></OverlayTrigger></td>
                            {selectedRemType !== 'self' && <td>{reminder.subscription_note_assigned_to}</td>}
                            <td onClick={() => updateMNote(reminder)}><span className={findDatePastorFuture(reminder.subscription_note_date) < 0 ? 'redText' : ''}>{Moment(reminder.subscription_note_date).format('DD-MM-YYYY HH:mm')}</span></td>
                            <td onClick={() => updateMNote(reminder)}>{reminder.subscription_note_text}
                              {reminder.subscription_note_rectified === 'true' && <span style={{ color: 'blue' }}><br />{ReactHtmlParser(reminder.rectified_text)}<span style={{ fontSize: '11px', marginLeft: '5px' }}>{'(' + Moment(reminder.rectified_date).format('DD-MM-YYYY HH:mm') + ')'}</span></span>}</td>
                            <td>
                              {reminder.subscription_note_rectified !== 'true' && reminder.subscription_note_assigned_to === loginUserName && reminder.subscription_note_assigned_to !== reminder.subscription_note_by && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Rectify reminder</Tooltip>}>

                                <Button onClick={() => showRectifiedTextPopup(reminder.customer_id, reminder.subscription_note_id)} variant="warning" style={{ padding: '6px' }}>
                                  <i className="fa fa-check" style={{ margin: 0 }}></i>
                                </Button>
                              </OverlayTrigger>}
                            </td>

                            <td>
                              <Button onClick={() => showRemoveReminderTextPopup(reminder.customer_id, reminder.subscription_note_id)} variant="danger" style={{ padding: '6px' }}>
                                <i className="far fa-calendar-times" style={{ fontWeight: 'normal', margin: 0 }}></i>
                              </Button>
                            </td>
                            <td>
                              <Button onClick={() => updateMNote(reminder)} variant="success" style={{ padding: '6px' }}>
                                <i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i>
                              </Button>
                            </td>
                            <td>
                              <Button onClick={() => updateReminder(reminder)} variant="primary" style={{ padding: '6px' }}>
                                <i class="fa fa-edit" style={{ fontWeight: 'normal', margin: 0 }}></i>
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

    </React.Fragment>
  );
}

export default App
