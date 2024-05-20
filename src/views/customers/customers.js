import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { Row, Col, Card, Pagination, Form, Modal, Button, OverlayTrigger, Tooltip, Table, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import Moment from 'moment';
import './customers.css';
import CustomerForm from './CustomerForm';
import CustomerExpiryForm from './CustomerExpiryForm';
import Discussions from './Discussions';
import DatePicker from "react-datepicker";
import ReactHtmlParser from 'react-html-parser';
import adminprofile from "../../assets/images/small-logo.png";
import ScrollToBottom from 'react-scroll-to-bottom';

import { API_URL } from "../../config/constant";

const loginUserId = localStorage.getItem('loginUserId');

function DynamicTable({ columns, data, fromNumber, toNumber, getCustomersList, totalCount, addCustomer, showReminderPopup, dueremindercount }) {

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
      initialState: { pageIndex: 0, sortBy: [{ id: 'tbl_user_traccar.id', desc: false }] },
      manualPagination: true,
      pageCount: Math.ceil(totalCount / 40),
    },
    useSortBy,
    usePagination
  )

  const datafilter = [
    {
      name: "active",
      value: "true",
      label: "Active"
    },
    {
      name: "demo",
      value: "true",
      label: "Demo"
    },
    {
      name: "new",
      value: "true",
      label: "New"
    },
    {
      name: "blocked",
      value: "false",
      label: "Blocked"
    },
    {
      name: "followup",
      value: "false",
      label: "Newly Created"
    },
    {
      name: "temporarysuspend",
      value: "false",
      label: "To Verify"
    },
    {
      name: "reqcontact",
      value: "false",
      label: "Sub users"
    },
    {
      name: "oldinactive",
      value: "false",
      label: "Corporate"
    }

    //'followup' - status for 'newly created', 'temporarysuspend' - for 'To verify', 'reqcontact' - for 'Sub Users' and 'oldinactive' - for 'Corporate'
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
  const [clearfilter, setClearFilter] = useState(false);

  const [finalFilterarray, setFinalFilterarray] = useState({ "active": true, "demo": true, "new": true });
  const [filterarray, setFilterarray] = useState({ "active": true, "demo": true, "new": true });
  const [filterdata, setFilterdata] = useState(datafilter);
  const [searchOnCurrentPage, setSearchOnCurrentPage] = useState(false);

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

  const search = () => {

    if (selectedFromMonth !== 0 && selectedFromYear !== 0)
      setFromDate(selectedFromYear + '-' + selectedFromMonth + '-01');
    if (selectedToMonth !== 0 && selectedToYear !== 0)
      setToDate(selectedToYear + '-' + selectedToMonth + '-01');

    setSearchText(searchCustomer ? searchCustomer : null);

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

    if (pageIndex > 0) {
      gotoPage(0);
    } else {
      setClearFilter(true);
    }
  }

  const handleFilterArrayChange = (e) => {

    const isChecked = e.target.checked;
    const checkeditem = e.target.name;

    if (checkeditem === 'inactive' && isChecked) {
      setFilterarray({ "inactive": true, "active": false, "demo": false, "new": false, "blocked": false, "followup": false, "reqcontact": false, "temporarysuspend": false, "oldinactive": false, "referal": false, "dealer": false, "locatorsim": false, "rental": false, "subaccounts": false, "yearly": false, "quarterly": false, "semi": false, "monthly": false });
    } else if (checkeditem === 'inactive' && !isChecked) {
      setFilterarray({ "inactive": false, "active": true, "demo": true, "new": true, "blocked": false, "followup": false, "reqcontact": false, "temporarysuspend": false, "oldinactive": false, "referal": false, "dealer": false, "locatorsim": false, "rental": false, "subaccounts": false, "yearly": false, "quarterly": false, "semi": false, "monthly": false });
    } else {
      setFilterarray({ ...filterarray, [checkeditem]: isChecked, "inactive": false });
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
    setFinalFilterarray({ "active": true, "demo": true, "new": true });
    setFilterarray({ "active": true, "demo": true, "new": true });
    setFilterdata(datafilter);
    if (pageIndex > 0) {
      gotoPage(0);
    } else {
      setClearFilter(true);
    }
  }

  useEffect(() => {
    if (clearfilter) {
      getCustomersList({ pageIndex, searchText, fromDate, toDate, finalFilterarray, sortBy });
    }
  }, [clearfilter])

  useEffect(() => {
    getCustomersList({ pageIndex, searchText, fromDate, toDate, finalFilterarray, sortBy });
  }, [getCustomersList, pageIndex, toDate, searchText, finalFilterarray, sortBy, searchOnCurrentPage])

  const calladdCustomer = () => {
    addCustomer();
  }

  const handleKeypress = e => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {

      setSearchCustomer(e.target.value ? e.target.value : null);

      e.preventDefault();

      search();
    }
  };

  const showReminders = () => {
    showReminderPopup();
  }

  return (
    <>
      <Form>
        <Form.Row>
          <Col xs={1}><span>Expiry date filter</span></Col>
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
          <Col xs={4}>
            <button
              className="text-capitalize btn btn-success"
              type="button"
              onClick={search}
            >
              <i className="feather icon-search" style={{ margin: 0 }}></i>
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
              overlay={<Tooltip id={`tooltip-top`}>Add New Customer</Tooltip>}
            >
              <Button onClick={() => calladdCustomer()} className='text-capitalize' variant="primary" style={{ float: 'right' }}><i className="feather icon-plus" style={{ margin: '0px', fontWeight: 'bold' }}></i></Button>
            </OverlayTrigger>

            <button
              className="btn btn-warning"
              type="button"
              onClick={() => showReminders()}
              style={{ float: 'right' }}
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

          <Col xs={1}>
            {loginUserId === '1' ? <form action={`${API_URL}customers/${sortBy[0].id}/${sortBy[0].desc ? 'desc' : 'asc'}/${searchCustomer}/${fromDate}/${toDate}/1`} method="POST" target="_blank">

              <input type="hidden" name="_token" />

              {Object.entries(filterarray).filter(item => item[1] === true).map(i => (
                <input type="hidden" name={i[0]} value={i[1]} />
              ))}

              <OverlayTrigger
                placement='top'
                overlay={<Tooltip id={`tooltip-top`}>Excel Export</Tooltip>}
              >
                <button value="1" className="text-capitalize btn btn-primary m-0" type="submit" style={{ float: 'right' }}><i class="fas fa-file-export" style={{ margin: '0px' }}></i></button>
              </OverlayTrigger>
            </form> : ''}
          </Col>

          <Col xs={12} style={{ padding: '5px' }}><b style={{ color: 'black' }}>Filtered Count : {totalCount}</b><span style={{ marginLeft: '5px' }}>[{Object.entries(filterarray).filter(item => item[1] === true).map(i => i[0] === 'followup' ? 'Newly created' : i[0] === 'temporarysuspend' ? 'To Verify' : i[0] === 'reqcontact' ? 'Sub users' : i[0] === 'oldinactive' ? 'Corporate' : i[0]).join(",")}]</span></Col>

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
        <Col sm={12} md={4}><span>{fromNumber} - {toNumber} of {totalCount} customers</span></Col>
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
            <Col md={6} xl={3}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="inactive" value="false" checked={filterarray['inactive']} id="inactive" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="inactive" className="cr m-0">Inactive</Form.Label>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <hr />

          <Row>
            <Col md={6} xl={3}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="referal" value="false" checked={filterarray['referal']} id="referal" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="referal" className="cr m-0">Referral</Form.Label>
                </div>
              </Form.Group>
            </Col>
            <Col md={6} xl={3}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="dealer" value="false" checked={filterarray['dealer']} id="dealer" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="dealer" className="cr m-0">Dealer</Form.Label>
                </div>
              </Form.Group>
            </Col>
            <Col md={6} xl={3}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="locatorsim" value="false" checked={filterarray['locatorsim']} id="locatorsim" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="locatorsim" className="cr m-0">Customer SIM</Form.Label>
                </div>
              </Form.Group>
            </Col>
            <Col md={6} xl={3}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="rental" value="false" checked={filterarray['rental']} id="rental" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="rental" className="cr m-0">Rental</Form.Label>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <hr />

          <Row>

            <Col md={6} xl={4}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="subaccounts" value="false" checked={filterarray['subaccounts']} id="subaccounts" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="subaccounts" className="cr m-0">Sub Accounts</Form.Label>
                </div>
              </Form.Group>
            </Col>
          </Row>


          <hr className="mt-0" />

          <Row>
            <Col md={6} xl={3}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="yearly" value="false" checked={filterarray['yearly']} id="yearly" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="yearly" className="cr m-0">Yearly</Form.Label>
                </div>
              </Form.Group>
            </Col>

            <Col md={6} xl={3}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="quarterly" value="false" checked={filterarray['quarterly']} id="quarterly" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="quarterly" className="cr m-0">Quarterly</Form.Label>
                </div>
              </Form.Group>
            </Col>

            <Col md={6} xl={3}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="semi" value="false" checked={filterarray['semi']} id="semi" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="semi" className="cr m-0">Semi-annual</Form.Label>
                </div>
              </Form.Group>
            </Col>

            <Col md={6} xl={3}>
              <Form.Group>
                <div className="checkbox d-inline">
                  <Form.Control type="checkbox" name="monthly" value="false" checked={filterarray['monthly']} id="monthly" onChange={handleFilterArrayChange} />
                  <Form.Label htmlFor="monthly" className="cr m-0">Monthly</Form.Label>
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

  const [selectedCustomer, setselectedCustomer] = useState('');
  const [selectedCustomerId, setselectedCustomerId] = useState(0);
  const [isLoginList, setisLoginList] = useState(false);
  const [loginList, setloginList] = useState([]);
  const [isExpDateList, setisExpDateList] = useState(false);
  const [iscustomereditmodal, setiscustomereditmodal] = useState(false);
  const [singleCustomerData, setsingleCustomerData] = useState({});

  const { register: registerPswdForm, handleSubmit: handleSubmitPswdForm, reset: resetPswdForm } = useForm({
    defaultValues: {
      id: 0,
      Password: ''
    },
  });

  const [pswdUpdateModal, setPswdUpdateModal] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [fromNumber, setFromNumber] = useState(0);
  const [toNumber, setToNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [listupdated, setListUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortType, setSortType] = useState('tbl_user_traccar.id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterData, saveFilterData] = useState({});
  const [searchFrom, setFromDate] = useState(null);
  const [searchTo, setToDate] = useState(null);
  const [notePopup, setNotePopup] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [dueremindercount, setDueReminderCount] = useState(0);
  const [reminderListPopup, setReminderListPopup] = useState(false);
  const [remindertextPopup, setReminderTextPopup] = useState(false);

  const showReminderPopup = () => {
    setReminderListPopup(true);
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

  const updateReminder = (reminderdata) => {
    setReminderListPopup(false);
    editCustomer(reminderdata.id, reminderdata)
  }

  const updateMNote = (reminderdata) => {
    setReminderListPopup(false);
    setsingleCustomerData(reminderdata);
    showNotePopup();
  }

  const getReminders = useCallback(async () => {

    try {
      const options = {
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Xtoken': authToken
        }
      }

      const url = API_URL + "getCustomerReminders";

      const response = await fetch(url, options)

      const data = await response.json();

      setDueReminderCount(data.dueremindercount);

      setReminders(data.data);
    }
    catch {

    }
  }, [])

  useEffect(() => {
    getReminders();
  }, [getReminders])

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

      const url = API_URL + "removeCustomerReminder";

      const response = await fetch(url, options)

      const data = await response.json();

      setReminderTextPopup(false);

      setListUpdated(true);

      getReminders();

      sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully removed reminder!' })
    }
    catch {

    }
  }

  const showNotePopup = () => {
    setNotePopup(true);
  }

  const hideNotePopup = () => {
    setNotePopup(false);
  }

  const CustomerExpDateList = async (id, name) => {

    setselectedCustomer(name);
    setselectedCustomerId(id);

    setisExpDateList(true);
  }

  const hideExpDatePopup = () => {
    setisExpDateList(false);
  }

  const loglist = async (id, name) => {

    setselectedCustomer(name);

    try {
      const options = {
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }

      const url = API_URL + "loginlist/" + id;

      const response = await fetch(url, options)

      const data = await response.json();

      setloginList(data.data);

      setisLoginList(true);
    }
    catch {

    }
  }

  const editCustomer = async (id, data) => {
    setselectedCustomerId(id);
    setsingleCustomerData(data);
    setiscustomereditmodal(true);
  }

  const addCustomer = () => {
    setselectedCustomerId(0);
    setsingleCustomerData({});
    setiscustomereditmodal(true);
  }

  const loginToWeb = (email, pswd) => {

    const weburl = 'https://mylocatorplus.com/office-use/#/access/signin?username=' + window.btoa(email) + '&password=' + window.btoa(pswd);
    window.open(weburl, '_blank');
  }

  const showPswdUpdateModal = (id, name, email) => {
    resetPswdForm({
      id: id,
      name: name,
      email: email,
      password: ''
    });
    setselectedCustomer(name);
    setPswdUpdateModal(true);
  }

  const onSubmitPswdForm = async (datarow) => {

    try {
      const options = {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Xtoken': authToken
        },
        body: JSON.stringify(datarow),
      };


      const url = API_URL + "editcustomerpassword";

      const response = await fetch(url, options)

      const data = await response.json();

      if (data.status === 'success') {

        sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated password!' })

        setPswdUpdateModal(false);

      } else {
        sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating password!' })
      }

    }
    catch {

    }
  }

  const columns = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'customer_referal_name',
        className: 'firstcolumn',
        disableSortBy: true,
        Cell: ({ row }) => {
          if (row.original.customer_referal_name) {
            return <OverlayTrigger
              placement='top'
              overlay={<Tooltip id={`tooltip-top`}>Referral - {row.original.customer_referal_name}</Tooltip>}
            >
              <Button variant="success" style={{ padding: '5px', margin: 0 }}>R</Button>
            </OverlayTrigger>
          } else if (row.original.customer_dealer_name) {
            return <OverlayTrigger
              placement='top'
              overlay={<Tooltip id={`tooltip-top`}>Dealer - {row.original.customer_dealer_name}</Tooltip>}
            >
              <Button variant="success" style={{ padding: '5px', margin: 0 }}>D</Button>
            </OverlayTrigger>
          } else {
            return '';
          }
        }
      },
      {
        Header: 'Name',
        accessor: 'name',
        className: 'namecolumn',
        Cell: ({ row }) => {

          let customerType = '';
          let typeColor = 'text-black';
          if (row.original.customer_parent === null && row.original.customer_parent !== 0) {
            customerType = 'Sub Account';
            typeColor = 'text-primary';
          } else if (row.original.customer_parent !== null && row.original.customer_parent > 0) {
            customerType = 'Sub Account';
            typeColor = 'text-primary';
          } else if (row.original.customer_parent === 0) {
            customerType = 'Main Account';
          }

          return (
            <p style={{ cursor: 'pointer' }} onClick={() => editCustomer(row.original.id, row.original)}>
              <b style={{ color: 'black' }}>{row.original.name.replace(/&amp;/g, '&')}</b> <br />
              <span>{row.original.email ? '(' + row.original.email + ')' : ''} {row.original.rental_device === 'yes' ? '  [Rental]' : ''}</span><br />
              <span className={typeColor}>{customerType}</span>
            </p>
          );
        }
      },
      {
        Header: 'Name/ Phone/ Sales Person',
        accessor: 'customer_contact_name',
        className: 'contactwidth',
        disableSortBy: true,
        Cell: ({ row }) => {
          return <span>
            {row.original.customer_contact_name ?
              <span>{row.original.customer_contact_name}<br /></span> : ''}
            {row.original.customer_contact_phone ?
              <span>{row.original.customer_contact_phone.substring(0, 25)}<br /></span> : ''}
            {row.original.Sales_Person ? row.original.Sales_Person : ''}
          </span>
        }
      },
      {
        Header: 'Status',
        accessor: 'customer_status',
        className: 'statuswidth',
        disableSortBy: true,
        Cell: ({ cell }) => {
          const { value } = cell;
          if (value === 'active') {
            return (
              <span style={{ color: '#38ce38' }}>Active</span>
            );
          } else if (value === 'blocked') {
            return (
              <span style={{ color: '#ec0606' }}>Blocked</span>
            );
          } else {
            return (
              <span style={{ textTransform: 'capitalize' }}>
                {value === 'demoaccount' ? 'Demo Account' : value === 'followup' ? 'Newly Created' : value === 'temporarysuspend' ? 'To Verify' : value === 'reqcontact' ? 'Sub Users' : value === 'oldinactive' ? 'Corporate' : value}
              </span>
            );
          }
        }

      },
      {
        Header: 'Term',
        accessor: 'term',
        className: 'termwidth',
        Cell: ({ row }) => {

          return (
            <span style={{ textTransform: 'capitalize' }}>{row.original.term === 'semi' ? 'Semi-annual' : row.original.term}</span>
          );
        }
      },
      {
        Header: 'Expiry Date',
        accessor: 'customer_expiry_date',
        className: 'expdatewidth',
        Cell: ({ row }) => {

          const formattedDate = Moment(row.original.customer_expiry_date).format('MMM-YYYY');

          return (
            <span>
              {formattedDate !== 'Invalid date' ? formattedDate : ""}

              <OverlayTrigger
                placement='top'
                overlay={<Tooltip id={`tooltip-top`}>{row.original.ExpiryCount > 1 ? 'View Expiry Date List' : 'Add Multiple Expiry Date'}</Tooltip>}
              >
                <Button variant={row.original.ExpiryCount > 1 ? 'success' : 'secondary'} onClick={() => CustomerExpDateList(row.original.customer_id, row.original.name)} style={{ padding: '4px 3px', margin: '0 5px', float: 'right' }}><i className="fa fa-eye" style={{ color: '#fff', margin: 0 }}></i></Button>
              </OverlayTrigger>
            </span>
          );


        }
      },
      {
        Header: 'Count',
        accessor: 'count',
        className: 'countwidth',
        disableSortBy: true,
        Cell: ({ row }) => {

          return (
            <span>
              <OverlayTrigger
                placement='top'
                overlay={<Tooltip id={`tooltip-top`}>Total Devices</Tooltip>}
              >
                <Badge variant="primary" style={{ fontSize: '13px', minWidth: '35px' }}>{row.original.count}</Badge>
              </OverlayTrigger><br />
              <OverlayTrigger
                placement='top'
                overlay={<Tooltip id={`tooltip-top`}>No Connection Devices</Tooltip>}
              >
                <Badge variant="danger" style={{ fontSize: '13px', minWidth: '35px' }}>{row.original.Noconnection}</Badge>
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
        Header: 'Last Login',
        accessor: 'last_login',
        className: 'lastloginwidth',
        Cell: ({ row }) => {

          if (row.original.last_login) {
            return (
              <span>
                {findDateDifference(row.original.last_login)}
                <Badge variant="success" style={{ fontSize: '13px', float: 'right', cursor: 'pointer' }} onClick={() => loglist(row.original.id, row.original.name)} >Logins</Badge>
              </span>
            );
          } else {
            return '';
          }

        }
      },
      {
        Header: '',
        accessor: 'buttons',
        className: 'buttonswidth',
        disableSortBy: true,
        Cell: ({ row }) => {

          return (
            <span>

              <a className='btn btn-primary text-capitalize' onClick={() => loginToWeb(row.original.email, row.original.password)} style={{ padding: '6px', marginRight: '2px' }}>
                <i className="fas fa-sign-in-alt" style={{ margin: 0 }}></i>
              </a>
            </span>
          );

        }
      }
    ],
    []
  )

  useEffect(() => {
    if (listupdated) {
      console.log(currentPage, searchKeyword, searchFrom, searchTo);
      const sortBy = [{ id: sortType, desc: sortOrder === 'desc' ? true : false }];
      const pageIndex = currentPage;
      const searchText = searchKeyword;
      const fromDate = searchFrom;
      const toDate = searchTo;
      const finalFilterarray = filterData;
      getCustomersList({ pageIndex, searchText, fromDate, toDate, finalFilterarray, sortBy })
    }
  }, [listupdated])

  const getCustomersList = useCallback(async ({ pageIndex, searchText, fromDate, toDate, finalFilterarray, sortBy }) => {

    setIsLoading(true);

    try {
      const options = {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalFilterarray)
      }

      const currentPage = pageIndex + 1;

      if (!searchText) {
        searchText = null;
      }

      if (!fromDate) {
        fromDate = null;
      }

      if (!toDate) {
        toDate = null;
      }

      setCurrentPage(pageIndex);

      setFromDate(fromDate);

      setToDate(toDate);

      setSearchKeyword(searchText);

      saveFilterData(finalFilterarray);

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

      let sortTp = stype ? stype : sortType;
      let sortOdr = sorder ? sorder : sortOrder;

      const url = API_URL + "customers/" + sortTp + "/" + sortOdr + "/" + searchText + "/" + fromDate + "/" + toDate + "/0+/?page=" + currentPage;

      const response = await fetch(url, options)

      const data = await response.json();

      setCustomers(data.data.data);

      setTotalCount(data.data.total);

      setFromNumber(data.data.from);

      setToNumber(data.data.to);

      setIsLoading(false);

      setListUpdated(false);
    }
    catch {

    }

  }, []);

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

  const closeAddPopup = () => {
    setiscustomereditmodal(false);
  }

  const updateCustomers = () => {
    setListUpdated(true);
  }

  useEffect(() => {
    if (!isExpDateList) {
      setListUpdated(true);
    }
  }, [isExpDateList])

  return (
    <React.Fragment>
      <Row>
        <Col>
          {isLoading ? <Loader /> : null}
          <Card>
            <Card.Body>
              <DynamicTable columns={columns} data={customers} fromNumber={fromNumber} toNumber={toNumber} getCustomersList={getCustomersList} totalCount={totalCount} addCustomer={addCustomer} showReminderPopup={showReminderPopup} dueremindercount={dueremindercount} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={isLoginList} onHide={() => setisLoginList(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">{selectedCustomer} Last 10 logins</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {loginList.map((item, index) => (
              <li md={6} xl={12} key={index}>{item.last_login} [{item.type}]</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setisLoginList(false)}>Ok</Button>
        </Modal.Footer>
      </Modal>

      <Modal size="lg" show={isExpDateList} onHide={() => setisExpDateList(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Add Multiple Expiry Date - {selectedCustomer}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomerExpiryForm id={selectedCustomerId} hideExpDatePopup={hideExpDatePopup} />
        </Modal.Body>
      </Modal>

      <Modal size="xl" show={iscustomereditmodal} onHide={() => setiscustomereditmodal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title as="h5" style={{ width: '90%' }}>{selectedCustomerId ? 'Edit Customer' : 'Add Customer'}</Modal.Title>

          {singleCustomerData.customer_id ? (
            <>
              <Button style={{ float: 'right', padding: '2px 15px' }} variant="danger" onClick={() => showNotePopup()} >
                <i className="fas fa-comment" style={{ margin: 0 }}></i>
              </Button>

              <OverlayTrigger
                placement='top'
                overlay={<Tooltip id={`tooltip-top`}>Update Password</Tooltip>}
              >
                <button className='btn btn-warning text-capitalize' onClick={() => showPswdUpdateModal(singleCustomerData.id, singleCustomerData.name, singleCustomerData.email)} style={{ padding: '2px 15px', marginRight: '2px' }}>
                  <i className="fas fa-key" style={{ margin: 0 }}></i>
                </button>
              </OverlayTrigger>
            </>
          ) : ''}

        </Modal.Header>
        <Modal.Body>

          <CustomerForm id={selectedCustomerId} closePopup={closeAddPopup} updateCustomers={updateCustomers} />

        </Modal.Body>
      </Modal>

      <Modal size="lg" show={notePopup} onHide={() => setNotePopup(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title as="h5">Discussions</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>

          <Discussions id={singleCustomerData.id} status={singleCustomerData.customer_status} customerId={singleCustomerData.customer_id} hideNotePopup={hideNotePopup} />

        </Modal.Body>

      </Modal>

      <Modal size="sm" show={pswdUpdateModal} onHide={() => setPswdUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Update Password - {selectedCustomer}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>

            <Col md={12}>
              <Form key="pswdform" onSubmit={handleSubmitPswdForm(onSubmitPswdForm)}>

                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="text" placeholder="New Password" {...registerPswdForm('password')} />
                </Form.Group>

                <Button variant="success" type='submit'>Submit</Button>
                <Button variant="secondary" onClick={() => setPswdUpdateModal()}>Close</Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal size="xl" show={reminderListPopup} onHide={() => setReminderListPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Reminders</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>
          <Row>
            <Col md={12}>
              <Card style={{ margin: 0 }}>
                <Card.Body>{reminders && reminders.length > 0 &&
                  <Table responsive hover style={{ border: '1px solid #eaeaea' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '2%' }}>#</th>
                        <th style={{ width: '30%' }}>Customer Name</th>
                        <th style={{ width: '15%' }}>Date</th>
                        <th style={{ width: '48%' }}>Note</th>
                        <th style={{ width: '1%' }}></th>
                        <th style={{ width: '1%' }}></th>
                        <th style={{ width: '1%' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {reminders.map((reminder, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{reminder.name}</td>
                          <td><span className={findDatePastorFuture(reminder.customer_note_date) < 0 ? 'redText' : ''}>{Moment(reminder.customer_note_date).format('DD-MM-YYYY hh:mm:ss')}</span></td>
                          <td>{ReactHtmlParser(reminder.customer_note_text)}</td>
                          <td>
                            <Button onClick={() => showRemoveReminderTextPopup(reminder.customer_id, reminder.customer_note_id)} variant="danger" style={{ padding: '6px' }}>
                              <i className="far fa-trash-alt" style={{ fontWeight: 'normal', margin: 0 }}></i>
                            </Button>
                          </td>
                          <td>
                            <OverlayTrigger
                              placement='top'
                              overlay={<Tooltip id={`tooltip-top`}>Notes</Tooltip>}
                            >
                              <Button onClick={() => updateMNote(reminder)} variant="success" style={{ padding: '6px' }}>
                                <i className="far fa-sticky-note" style={{ fontWeight: 'normal', margin: 0 }}></i>
                              </Button>
                            </OverlayTrigger>
                          </td>
                          <td>
                            <OverlayTrigger
                              placement='top'
                              overlay={<Tooltip id={`tooltip-top`}>Edit customer</Tooltip>}
                            >
                              <Button onClick={() => updateReminder(reminder)} variant="primary" style={{ padding: '6px' }}>
                                <i class="fa fa-edit" style={{ fontWeight: 'normal', margin: 0 }}></i>
                              </Button>
                            </OverlayTrigger>
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
  )
}

export default App
