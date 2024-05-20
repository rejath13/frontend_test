import React, { useEffect, useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Row,
  Col,
  Card,
  Pagination,
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
  Form,
  Table,
  Tabs,
  Tab,
  Badge,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy, usePagination } from "react-table";
import Moment from "moment";
import DatePicker from "react-datepicker";
import "./jobs.css";
import { API_URL } from "../../config/constant";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import existing from "../../assets/images/icons/existing.svg";
import newtype from "../../assets/images/icons/new.svg";
import dealer from "../../assets/images/icons/dealer.svg";
import referral from "../../assets/images/icons/referral.svg";
import JobActionButton from "./JobActionButton";
import {
  implementationType,
  projectStatus,
} from "../itc/projects/project-options-data";
import RichTextEditor from "react-rte";

const MAIL_DEFAULT_SUBJECT = "LOCATOR: GPS Tracking Platform Login Details";
const MAIL_DEFAULT_BODY = `
    <p>Hello,</p>
    <p>Welcome onboard !!</p>
    <p>Please find the below login details for the GPS Tracking Software for your reference.</p>
    <p>Note: Kindly use the Chrome or Mozilla browser to access our software for a better experince.</p>
    <p> Web Login URL: <a href=" https://www.mylocatorplus.com">  https://www.mylocatorplus.com </a></p>

    <p>For Smartphones (iOS and Android), you may please download the Application named “Mylocatorplus” from the playstore or Appstore and login with the user access details.</p>
    <p>
        Username  : {{LOCATOR_USERNAME}} </br>
        Password  : {{LOCATOR_PASSWORD}} </br>
    </p>

    <p>Please don't hesitate to call us  if ever a problem should arise.</p>

    <p>
        Kindly go through on this Link for Further details about Locator Platform as a demo: <a href="https://vimeo.com/232383916" >https://vimeo.com/232383916</a>
    </p>

    <p>
        <p> Support In-charge: </p>
            Customer Support      : Shamnad - 050 225 0286, 043547766<br/>
            Operation Coordinator : Rasik   - 0522119952<br/>
            Sales Coordinator     : Shams - 050 874 6688<br/>
        <p>
    </p>
        " We hope to have the pleasure of doing business with you for many years to come."
    </p>`;

const sweetAlertHandler = (alert) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    //title: alert.title,
    icon: "success",
    text: alert.text,
    type: alert.type,
  });
};

const Tr = styled.tr`
  background-color: white;
  display: ${({ isDragging }) => (isDragging ? "table" : "")};
`;

function CompletedJobsTable({
  columns,
  data,
  fromNumber,
  toNumber,
  getJobsList,
  totalCount,
  salesplusstatus,
  addNewSalesJob,
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
      initialState: {
        pageIndex: 0,
        sortBy: [{ id: "sales_plus_completed_date", desc: true }],
      },
      manualPagination: true,
      pageCount: Math.ceil(totalCount / 40),
    },
    useSortBy,
    usePagination
  );

  const [verifiedStatus, setVerifiedStatus] = useState(null);
  const [collectedStatus, setCollectedStatus] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [filterarray, setFilterarray] = useState({});
  const [fromDate, setSearchFromDate] = useState();
  const [toDate, setSearchToDate] = useState();
  const [dateChange, setDateChange] = useState(false);
  const [paymentStatusChange, setPaymentStatusChange] = useState("");

  const isInitialCall = useRef(true);

  const onChangePaymentVerifiedStatus = (e) => {
    setVerifiedStatus(e.target.value);
  };

  const onChangePaymentCollectedStatus = (e) => {
    setCollectedStatus(e.target.value);
  };

  const onChangeSearchCustomer = (e) => {
    setSearchCustomer(e.target.value);
  };

  const search = () => {
    if (searchCustomer) setSearchText(searchCustomer);

    if (fromDate || toDate) setDateChange(dateChange === true ? false : true);

    if (verifiedStatus) {
      setPaymentStatusChange(paymentStatusChange === true ? false : true);
    }

    if (collectedStatus) {
      setPaymentStatusChange(paymentStatusChange === true ? false : true);
    }

    if (pageIndex > 0) {
      gotoPage(0);
    }
  };

  const addsalesJob = () => {
    addNewSalesJob();
  };

  const clearAllFilters = () => {
    setSearchCustomer(null);
    setSearchText(null);
    setVerifiedStatus(null);
    setCollectedStatus(null);
    setSearchFromDate(null);
    setSearchToDate(null);

    if (pageIndex > 0) {
      gotoPage(0);
    } else {
      setDateChange(dateChange === true ? false : true);
    }
  };

  useEffect(() => {
    if (isInitialCall.current) {
      isInitialCall.current = false;
    } else {
      const searchFromDate = fromDate
        ? Moment(fromDate).format("YYYY-MM-DD")
        : null;
      const searchToDate = toDate ? Moment(toDate).format("YYYY-MM-DD") : null;
      getJobsList({
        pageIndex,
        searchText,
        sortBy,
        filterarray,
        salesplusstatus,
        searchFromDate,
        searchToDate,
        verifiedStatus,
        collectedStatus,
      });
    }
  }, [sortBy, pageIndex, searchText, dateChange, paymentStatusChange]);

  const handleSearchFromDateChange = (date) => {
    setSearchFromDate(date);
  };

  const handleSearchToDateChange = (date) => {
    setSearchToDate(date);
  };

  return (
    <>
      <Form>
        <Form.Row>
          <Col xs={2}>
            <Form.Control
              as="select"
              value={verifiedStatus || ""}
              onChange={onChangePaymentVerifiedStatus}
            >
              <option value="">Select Payment Verified Status</option>
              <option value="1">Verified</option>
              <option value="0">Not Verified</option>
              <option value="2">All</option>
            </Form.Control>
          </Col>

          <Col xs={2}>
            <Form.Control
              as="select"
              value={collectedStatus || ""}
              onChange={onChangePaymentCollectedStatus}
            >
              <option value="">Select Payment Collected Status</option>
              <option value="yes">Paid</option>
              <option value="no">Not Paid</option>
              <option value="all">All</option>
            </Form.Control>
          </Col>

          <Col xs={2}>
            <DatePicker
              placeholderText="From"
              selected={fromDate}
              onChange={handleSearchFromDateChange}
              className="form-control"
              dateFormat="dd-MM-yyyy"
              isClearable={true}
            />
          </Col>

          <Col xs={2}>
            <DatePicker
              placeholderText="To"
              selected={toDate}
              onChange={handleSearchToDateChange}
              className="form-control"
              dateFormat="dd-MM-yyyy"
              isClearable={true}
            />
          </Col>

          <Col xs={2}>
            <Form.Control
              placeholder="Search..."
              value={searchCustomer || ""}
              onChange={onChangeSearchCustomer}
            />
            {searchCustomer && (
              <button
                type="button"
                className="react-datepicker__close-icon"
                onClick={clearAllFilters}
                style={{ right: "2px", height: "90%" }}
              ></button>
            )}
          </Col>

          <Col xs={1}>
            <button
              className="text-capitalize btn btn-success"
              type="button"
              onClick={search}
              style={{ marginRight: "3px", padding: "10px 15px" }}
            >
              <i
                className="feather icon-search"
                style={{ margin: 0, fontSize: "16px" }}
              ></i>
            </button>

            <button
              className="text-capitalize btn btn-danger"
              type="button"
              onClick={clearAllFilters}
              style={{ marginRight: "0", padding: "10px 15px" }}
            >
              <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
            </button>
          </Col>

          <Col xs={1}>
            <button
              className="text-capitalize btn btn-primary"
              type="button"
              onClick={addsalesJob}
              style={{
                marginRight: "3px",
                padding: "10px 15px",
                float: "right",
              }}
            >
              <i
                className="fas fa-plus"
                style={{ margin: 0, fontSize: "16px" }}
              ></i>
            </button>
          </Col>
        </Form.Row>
      </Form>
      <BTable striped bordered hover responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  style={{ whiteSpace: "normal" }}
                  className={column.className}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <span className="feather icon-arrow-down text-muted float-right mt-1" />
                      ) : (
                        <span className="feather icon-arrow-up text-muted float-right mt-1" />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps({
                        className: cell.column.className,
                      })}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>
      <Row className="justify-content-between mt-3">
        <Col sm={12} md={4}>
          <span className="d-flex align-items-center">
            Page{" "}
            <strong>
              {" "}
              {pageIndex + 1} of {pageOptions.length}{" "}
            </strong>{" "}
            | Go to page:{" "}
            <input
              type="number"
              className="form-control ml-2"
              value={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>
        </Col>
        <Col sm={12} md={4}>
          <span>
            {fromNumber} - {toNumber} of {totalCount} items
          </span>
        </Col>
        <Col sm={12} md={4}>
          <Pagination className="justify-content-end">
            <Pagination.First
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            />
            <Pagination.Prev
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            />
            <Pagination.Next
              onClick={() => nextPage()}
              disabled={!canNextPage}
            />
            <Pagination.Last
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            />
          </Pagination>
        </Col>
      </Row>
    </>
  );
}

function DynamicTable({
  columns,
  data,
  fromNumber,
  toNumber,
  getJobsList,
  totalCount,
  salesplusstatus,
  statusCount,
  updateJobs,
  reorderJobs,
  addNewSalesJob,
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
      updateJobs,
      reorderJobs,
      manualSortBy: true,
      initialState: {
        pageIndex: 0,
        sortBy: [{ id: "sales_plus_customer_status", desc: true }],
      },
      manualPagination: true,
      pageCount: Math.ceil(totalCount / 40),
    },
    useSortBy,
    usePagination
  );

  var datafilter = {};

  datafilter.unassigned = true;
  datafilter.scheduled = true;
  datafilter.inprogress = true;

  const [searchCustomer, setSearchCustomer] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [filterarray, setFilterarray] = useState(datafilter);
  const [filterArrayChange, setFilterArrayChange] = useState();

  const onChangeSearchCustomer = (e) => {
    setSearchCustomer(e.target.value);
  };

  const search = () => {
    if (searchCustomer) setSearchText(searchCustomer);

    if (filterarray) {
      setFilterArrayChange(filterarray);
    }

    if (pageIndex > 0) {
      gotoPage(0);
    }
  };

  const addsalesJob = () => {
    addNewSalesJob();
  };

  const clearAllFilters = () => {
    setSearchCustomer(null);
    setSearchText(null);

    if (pageIndex > 0) {
      gotoPage(0);
    }
  };

  useEffect(() => {
    const searchFromDate = null;
    const searchToDate = null;
    const verifiedStatus = null;
    const collectedStatus = null;
    getJobsList({
      pageIndex,
      searchText,
      sortBy,
      filterarray,
      salesplusstatus,
      searchFromDate,
      searchToDate,
      verifiedStatus,
      collectedStatus,
    });
  }, [getJobsList, sortBy, pageIndex, searchText, filterArrayChange]);

  const handleFilterArrayChange = (e) => {
    const isChecked = e.target.checked;
    const checkeditem = e.target.name;
    setFilterarray({ ...filterarray, [checkeditem]: isChecked });
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    reorderJobs(source.index, destination.index);
  };

  return (
    <>
      <Form>
        <Form.Row>
          <Col xs={8} style={{ paddingTop: "8px" }}>
            <div className="checkbox d-inline">
              <Form.Control
                type="checkbox"
                name="all"
                checked={filterarray["all"]}
                id="all"
                onChange={handleFilterArrayChange}
              />
              <Form.Label htmlFor="all" className="cr">
                All
              </Form.Label>
            </div>
            <div className="checkbox d-inline">
              <Form.Control
                type="checkbox"
                name="unassigned"
                checked={filterarray["unassigned"]}
                id="unassigned"
                onChange={handleFilterArrayChange}
              />
              <Form.Label htmlFor="unassigned" className="cr">
                Un Assigned [{statusCount.unassigned}]
              </Form.Label>
            </div>
            <div className="checkbox d-inline">
              <Form.Control
                type="checkbox"
                name="scheduled"
                checked={filterarray["scheduled"]}
                id="scheduled"
                onChange={handleFilterArrayChange}
              />
              <Form.Label htmlFor="scheduled" className="cr">
                Scheduled [{statusCount.scheduled}]
              </Form.Label>
            </div>
            <div className="checkbox d-inline">
              <Form.Control
                type="checkbox"
                name="inprogress"
                checked={filterarray["inprogress"]}
                id="inprogress"
                onChange={handleFilterArrayChange}
              />
              <Form.Label htmlFor="inprogress" className="cr">
                In Progress [{statusCount.inprogress}]
              </Form.Label>
            </div>
            <div className="checkbox d-inline">
              <Form.Control
                type="checkbox"
                name="demo"
                checked={filterarray["demo"]}
                id="demo"
                onChange={handleFilterArrayChange}
              />
              <Form.Label htmlFor="demo" className="cr">
                Demo [{statusCount.demo}]
              </Form.Label>
            </div>
            <div className="checkbox d-inline">
              <Form.Control
                type="checkbox"
                name="onhold"
                checked={filterarray["onhold"]}
                id="onhold"
                onChange={handleFilterArrayChange}
              />
              <Form.Label htmlFor="onhold" className="cr">
                On Hold [{statusCount.onhold}]
              </Form.Label>
            </div>
            <div className="checkbox d-inline">
              <Form.Control
                type="checkbox"
                name="assigned"
                checked={filterarray["assigned"]}
                id="assigned"
                onChange={handleFilterArrayChange}
              />
              <Form.Label htmlFor="assigned" className="cr">
                Assigned [{statusCount.assigned}]
              </Form.Label>
            </div>
            <div className="checkbox d-inline">
              <Form.Control
                type="checkbox"
                name="deleted"
                checked={filterarray["deleted"]}
                id="deleted"
                onChange={handleFilterArrayChange}
              />
              <Form.Label htmlFor="deleted" className="cr">
                Deleted [{statusCount.deleted}]
              </Form.Label>
            </div>
          </Col>

          <Col xs={2}>
            <Form.Control
              placeholder="Search..."
              value={searchCustomer || ""}
              onChange={onChangeSearchCustomer}
            />
            {searchCustomer && (
              <button
                type="button"
                className="react-datepicker__close-icon"
                onClick={clearAllFilters}
                style={{ right: "2px", height: "90%" }}
              ></button>
            )}
          </Col>
          <Col xs={2}>
            <button
              className="text-capitalize btn btn-success"
              type="button"
              onClick={search}
              style={{ marginRight: "3px", padding: "10px 15px" }}
            >
              <i
                className="feather icon-search"
                style={{ margin: 0, fontSize: "16px" }}
              ></i>
            </button>

            <button
              className="text-capitalize btn btn-danger"
              type="button"
              onClick={clearAllFilters}
              style={{ marginRight: "0", padding: "10px 15px" }}
            >
              <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
            </button>

            <button
              className="text-capitalize btn btn-primary"
              type="button"
              onClick={addsalesJob}
              style={{
                marginRight: "3px",
                padding: "10px 15px",
                float: "right",
              }}
            >
              <i
                className="fas fa-plus"
                style={{ margin: 0, fontSize: "16px" }}
              ></i>
            </button>
          </Col>
        </Form.Row>
      </Form>
      <BTable striped bordered hover responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  style={{ whiteSpace: "normal" }}
                  className={column.className}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <span className="feather icon-arrow-down text-muted float-right mt-1" />
                      ) : (
                        <span className="feather icon-arrow-up text-muted float-right mt-1" />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="table-body">
            {(provided, snapshot) => (
              <tbody
                ref={provided.innerRef}
                {...provided.droppableProps}
                {...getTableBodyProps()}
              >
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Draggable
                      draggableId={row.original.sales_plus_id.toString()}
                      key={row.original.sales_plus_id.toString()}
                      index={row.index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <Tr
                            {...row.getRowProps()}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            isDragging={snapshot.isDragging}
                          >
                            {row.cells.map((cell) => (
                              <td
                                {...cell.getCellProps({
                                  className: cell.column.className,
                                })}
                              >
                                {cell.render("Cell", {
                                  dragHandleProps: provided.dragHandleProps,
                                  isSomethingDragging: snapshot.isDraggingOver,
                                })}
                              </td>
                            ))}
                          </Tr>
                        );
                      }}
                    </Draggable>
                  );
                })}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
      </BTable>
      <Row className="justify-content-between mt-3">
        <Col sm={12} md={4}>
          <span className="d-flex align-items-center">
            Page{" "}
            <strong>
              {" "}
              {pageIndex + 1} of {pageOptions.length}{" "}
            </strong>{" "}
            | Go to page:{" "}
            <input
              type="number"
              className="form-control ml-2"
              value={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>
        </Col>
        <Col sm={12} md={4}>
          <span>
            {fromNumber} - {toNumber} of {totalCount} items
          </span>
        </Col>
        <Col sm={12} md={4}>
          <Pagination className="justify-content-end">
            <Pagination.First
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            />
            <Pagination.Prev
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            />
            <Pagination.Next
              onClick={() => nextPage()}
              disabled={!canNextPage}
            />
            <Pagination.Last
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            />
          </Pagination>
        </Col>
      </Row>
    </>
  );
}

function formatExpectedDate(date) {
  if (date !== "" && date !== "0000-00-00") {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    today = yyyy + "/" + mm + "/" + dd;

    var date = new Date(date);
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    date = yyyy + "/" + mm + "/" + dd;

    today = new Date(today);
    date = new Date(date);

    var todayDiff = date.getTime() - today.getTime();
    var todayDifference = Math.ceil(todayDiff / (1000 * 3600 * 24));

    return todayDifference;
  } else {
    return "";
  }
}

const UpDownArrow = (props) => (
  <span
    {...props.dragHandleProps}
    className={props.className}
    aria-label="move"
    role="img"
  >
    <span className="move-icon"></span>
  </span>
);

const StyledUpDownArrow = styled(UpDownArrow)`
  position: absolute;
`;

function App() {
  const authToken = localStorage.getItem("authToken");
  const loginUserType = localStorage.getItem("loginUserType");
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [statusCount, setStatusCount] = useState([]);
  const [fromNumber, setFromNumber] = useState(0);
  const [toNumber, setToNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [listupdated, setListUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortType, setSortType] = useState("sales_plus_customer_status");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterData, saveFilterData] = useState({});
  const [pendingTitle, setPendingTitle] = useState("Pending");
  const [completedTitle, setCompletedTitle] = useState("Completed");
  const [salesplusstatus, setsalesplusstatus] = useState(0);
  const [key, setKey] = useState("pending");
  const isInitialMount = useRef(true);
  const [dateModal, setDateModal] = useState(false);
  const [expectedDate, setExpectedDate] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(0);
  const [statusModal, seStatusModal] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [salespersons, setsalespersons] = useState([]);
  const [technicians, settechnicians] = useState([]);
  const [customers, setcustomers] = useState([]);
  const [searchFrom, setFromDate] = useState(null);
  const [searchTo, setToDate] = useState(null);
  const [verifiedSts, setVerifiedStatus] = useState(null);
  const [collectedSts, setCollectedStatus] = useState(null);
  const [traccarCredentialsPopup, setTraccarCredentialsPopup] = useState(false);
  const [sendMailPopup, setSendMailPopup] = useState(false);
  const [sharePopup, setSharePopup] = useState(false);
  const [selectedType, setSelectedType] = useState("whatsapp");
  const [schedulePopup, setSchedulePopup] = useState(false);
  const [isScheduleContactDetails, setScheduleContactDetails] = useState(false);

  const [activeJob, setActiveJob] = useState(false);

  const [body, setBody] = useState(
    RichTextEditor.createValueFromString(MAIL_DEFAULT_BODY, "html")
  );

  const editorRef = useRef();

  const { register, handleSubmit, reset } = useForm();

  const {
    register: registerupdate,
    handleSubmit: handleSubmitupdate,
    reset: resetupdate,
    getValues,
  } = useForm({});

  const {
    register: registercredentials,
    handleSubmit: handleSubmitTraccarCredentials,
  } = useForm({});
  const {
    register: registerMailDetails,
    handleSubmit: handleSubmitMailDetails,
  } = useForm({});

  const {
    register: registerShare,
    reset: resetShareDetails,
    getValues: getShareValues,
  } = useForm({});

  const {
    register: registerSchedule,
    handleSubmit: handleSubmitSchedule,
    reset: resetSchedule,
    getValues: getScheduleValues,
  } = useForm({});

  const OrderCell = (props) => {
    return <StyledUpDownArrow {...props} />;
  };

  const completedColumns = React.useMemo(
    () => [
      {
        Header: "Created Date/Completed Date/Job Id",
        accessor: "created_at",
        className: "datecolumn",
        Cell: ({ row }) => {
          return (
            <span>
              {Moment(row.original.created_at).format("DD-MM-YYYY")}
              <br />
              <span style={{ color: "red" }}>
                {Moment(row.original.sales_plus_completed_date).format(
                  "DD-MM-YYYY"
                )}
              </span>
              <br />
              {1000 + row.original.sales_plus_id}
            </span>
          );
        },
      },
      {
        Header: "Company/Customer/Phone",
        accessor: "sales_plus_company_name",
        className: "cuname",
        Cell: ({ row }) => {
          var cuname = "";
          if (
            row.original.sales_plus_company_name &&
            row.original.sales_plus_company_name.length > 20
          ) {
            cuname =
              row.original.sales_plus_company_name.substring(0, 20) + "...";
          } else {
            cuname = row.original.sales_plus_company_name;
          }

          return (
            <span
              onClick={() => showUpdatePopup(row.original)}
              style={{ cursor: "pointer" }}
            >
              <span style={{ color: "black" }}>
                <b>{cuname}</b>
              </span>
              <br />
              <span>
                {row.original.sales_plus_customer_name}
                <br />
                {row.original.sales_plus_phone}&nbsp;
                {row.original.sales_plus_address ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        {row.original.sales_plus_address}
                      </Tooltip>
                    }
                  >
                    <i
                      className="fas fa-address-book"
                      style={{ color: "red", marginRight: "4px" }}
                    ></i>
                  </OverlayTrigger>
                ) : (
                  ""
                )}
                {row.original.sales_plus_accessories ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        {row.original.sales_plus_accessories}
                      </Tooltip>
                    }
                  >
                    <i
                      className="fas fa-paperclip"
                      style={{ color: "green", marginRight: "4px" }}
                    />
                  </OverlayTrigger>
                ) : (
                  ""
                )}
                {row.original.sales_plus_source === "dealer" ||
                row.original.sales_plus_source === "referral" ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        {row.original.sales_plus_source === "dealer"
                          ? "Dealer"
                          : "Referral"}
                      </Tooltip>
                    }
                  >
                    <Badge
                      style={{
                        backgroundColor: "#e93446",
                        borderRadius: "50%",
                        padding: "0.1em 0.15em 0.25em 0.2em",
                        verticalAlign: "top",
                        marginTop: "0.31em",
                        marginRight: "4px",
                      }}
                    >
                      <img
                        src={
                          row.original.sales_plus_source === "dealer"
                            ? dealer
                            : referral
                        }
                        alt="Dealer/Referral"
                      />
                    </Badge>
                  </OverlayTrigger>
                ) : (
                  ""
                )}
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      {row.original.sales_plus_entry_type === 0
                        ? "New"
                        : "Existing"}
                    </Tooltip>
                  }
                >
                  <Badge
                    style={{
                      backgroundColor: "#e93446",
                      borderRadius: "50%",
                      padding: "0.1em 0.15em 0.25em 0.2em",
                      verticalAlign: "top",
                      marginTop: "0.31em",
                      marginRight: "4px",
                    }}
                  >
                    <img
                      src={
                        row.original.sales_plus_entry_type === 0
                          ? newtype
                          : existing
                      }
                      alt="New/Existing"
                    />
                  </Badge>
                </OverlayTrigger>
                {row.original.sales_plus_accessories ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        {row.original.sales_plus_accessories}
                      </Tooltip>
                    }
                  >
                    <i
                      className="fas fa-paperclip"
                      style={{ color: "green", marginRight: "4px" }}
                    />
                  </OverlayTrigger>
                ) : (
                  ""
                )}
              </span>
            </span>
          );
        },
      },
      {
        Header: "Quantity/Sales Person/Value",
        accessor: "sales_plus_quantity_new",
        className: "quantity",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.sales_plus_quantity_new > 0 ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>New</Tooltip>}
                >
                  <Badge variant="primary">
                    N {row.original.sales_plus_quantity_new}
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}

              {row.original.sales_plus_quantity_migrate > 0 ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Migration</Tooltip>}
                >
                  <Badge variant="warning">
                    M {row.original.sales_plus_quantity_migrate}
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}

              {row.original.sales_plus_quantity_trading > 0 ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Trading</Tooltip>}
                >
                  <Badge variant="danger">
                    R {row.original.sales_plus_quantity_trading}
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}

              {row.original.sales_plus_quantity_service > 0 ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Service</Tooltip>}
                >
                  <Badge variant="success">
                    S {row.original.sales_plus_quantity_service}
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}
              <br />
              <span>
                {row.original.user_name}
                <br />
                {row.original.sales_plus_project_value}
              </span>
            </span>
          );
        },
      },
      {
        Header: "Scheduler Note",
        accessor: "sales_plus_won_note",
        className: "note",
        disableSortBy: true,
        Cell: ({ row }) => {
          var note = "";
          if (
            row.original.sales_plus_won_note &&
            row.original.sales_plus_won_note.length > 45
          ) {
            note = row.original.sales_plus_won_note.substring(0, 45) + "...";
          } else {
            note = row.original.sales_plus_won_note;
          }
          return <span>{note}</span>;
        },
      },
      {
        Header: "Status Note",
        accessor: "customer_comment",
        className: "note",
        disableSortBy: true,
        Cell: ({ row }) => {
          var comment = "";
          if (
            row.original.customer_comment &&
            row.original.customer_comment.length > 45
          ) {
            comment = row.original.customer_comment.substring(0, 45) + "...";
          } else {
            comment = row.original.customer_comment;
          }
          return <span>{comment}</span>;
        },
      },
      {
        Header: "Status",
        accessor: "sales_plus_customer_status",
        className: "status",
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.sales_plus_customer_status}&nbsp;
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Update Status</Tooltip>}
              >
                <Badge
                  variant="primary"
                  onClick={() => showStatusPopup(row.original)}
                  style={{ cursor: "pointer", margin: "0" }}
                >
                  <i className="fas fa-check-circle" style={{ margin: 0 }}></i>
                </Badge>
              </OverlayTrigger>
              <br />
              {row.original.sales_plus_customer_sms !== "0" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>SMS send</Tooltip>}
                >
                  <Badge variant="success">
                    <i className="fas fa-comment"></i>
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}
              {row.original.sales_plus_customer_mail !== "0" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Mail send</Tooltip>}
                >
                  <Badge variant="success">
                    <i className="fas fa-envelope"></i>
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}
              {row.original.sales_plus_customer_whatsapp !== "0" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Whatsapp</Tooltip>}
                >
                  <Badge variant="success">
                    <i className="fab fa-whatsapp"></i>
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}
            </span>
          );
        },
      },
      {
        Header: "P",
        accessor: "sales_plus_payment_status",
        className: "check",
        disableSortBy: true,
        Cell: ({ row }) => {
          var textColor = "";
          if (row.original.sales_plus_payment_status === "yes") {
            textColor = "green";
          } else if (row.original.sales_plus_payment_status === "no") {
            textColor = "gray";
          }
          return (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`}>
                  {row.original.sales_plus_payment_status === "yes"
                    ? "Payment Verified"
                    : "Payment Not Verified"}
                </Tooltip>
              }
            >
              <i
                className="fas fa-check-square"
                style={{ color: textColor, fontSize: "18px" }}
              ></i>
            </OverlayTrigger>
          );
        },
      },
      {
        Header: "",
        accessor: "buttons",
        className: "buttoncolumn",
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.sales_plus_traccar_customer_created == 1 ? (
                <span>
                  <Button
                    variant="primary"
                    style={{ padding: "6px", margin: "0 2px 2px 0" }}
                  >
                    <i className="fas fa-sign-in-alt" style={{ margin: 0 }}></i>
                  </Button>
                  <br />
                </span>
              ) : (
                ""
              )}
              <Button
                variant="success"
                onClick={() => showSharePopup(row.original)}
                style={{ padding: "6px", margin: "0 2px 2px 0" }}
              >
                <i className="fas fa-share" style={{ margin: 0 }}></i>
              </Button>
            </span>
          );
        },
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Sl",
        accessor: "sales_plus_job",
        className: "sortordercolumn",
        Cell: OrderCell,
      },
      {
        Header: "No.",
        accessor: "sales_plus_job_order",
        className: "ordercolumn",
        Cell: ({ row }) => {
          return <span class="joborder">{row.index + 1}</span>;
        },
      },
      {
        Header: "Created Date/Job Id",
        accessor: "created_at",
        className: "datecolumn",
        Cell: ({ row }) => {
          return (
            <span>
              {Moment(row.original.created_at).format("DD-MM-YYYY")}
              <br />
              {/* {1000 + row.original.sales_plus_id} */}
              <small>
                {Moment().diff(Moment(row.original.created_at), "days")} D
              </small>
            </span>
          );
        },
      },
      {
        Header: "Company/Customer/Phone",
        accessor: "sales_plus_company_name",
        className: "cname",
        Cell: ({ row }) => {
          var cname = "";
          if (
            row.original.sales_plus_company_name &&
            row.original.sales_plus_company_name.length > 20
          ) {
            cname =
              row.original.sales_plus_company_name.substring(0, 20) + "...";
          } else {
            cname = row.original.sales_plus_company_name;
          }

          return (
            <span style={{ cursor: "pointer" }}>
              <span
                onClick={() => showUpdatePopup(row.original)}
                style={{ color: "black" }}
              >
                <b>{cname}</b>
              </span>
              <br />
              <span onClick={() => showUpdatePopup(row.original)}>
                <div>
                  <span style={{ color: "black" }}>
                    {row.original.sales_plus_customer_name}
                    <i
                      className="fas fa-envelope ml-2"
                      style={{
                        color:
                          row.original.sales_plus_customer_mail == "1"
                            ? "#1bd5d2"
                            : "#888888",
                      }}
                    ></i>
                  </span>
                </div>
                {row.original.sales_plus_phone}&nbsp;
                {row.original.sales_plus_address ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        {row.original.sales_plus_address}
                      </Tooltip>
                    }
                  >
                    <i
                      className="fas fa-address-book"
                      style={{ color: "red", marginRight: "4px" }}
                    ></i>
                  </OverlayTrigger>
                ) : (
                  ""
                )}
                {row.original.sales_plus_accessories ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        {row.original.sales_plus_accessories}
                      </Tooltip>
                    }
                  >
                    <i
                      className="fas fa-paperclip"
                      style={{ color: "green", marginRight: "4px" }}
                    />
                  </OverlayTrigger>
                ) : (
                  ""
                )}
                {row.original.sales_plus_source === "dealer" ||
                row.original.sales_plus_source === "referral" ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        {row.original.sales_plus_source === "dealer"
                          ? "Dealer"
                          : row.original.sales_plus_source === "referral"
                          ? "Referral"
                          : ""}
                      </Tooltip>
                    }
                  >
                    <Badge
                      style={{
                        backgroundColor: "#e93446",
                        borderRadius: "50%",
                        padding: "0.1em 0.15em 0.25em 0.2em",
                        verticalAlign: "top",
                        marginTop: "0.31em",
                        marginRight: "4px",
                      }}
                    >
                      <img
                        src={
                          row.original.sales_plus_source === "dealer"
                            ? dealer
                            : row.original.sales_plus_source === "referral"
                            ? referral
                            : ""
                        }
                        alt=""
                      />
                    </Badge>
                  </OverlayTrigger>
                ) : (
                  ""
                )}
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      {row.original.sales_plus_entry_type === 0
                        ? "New"
                        : "Existing"}
                    </Tooltip>
                  }
                >
                  <Badge
                    style={{
                      backgroundColor: "#e93446",
                      borderRadius: "50%",
                      padding: "0.1em 0.15em 0.25em 0.2em",
                      verticalAlign: "top",
                      marginTop: "0.31em",
                      marginRight: "4px",
                    }}
                  >
                    <img
                      src={
                        row.original.sales_plus_entry_type === 0
                          ? newtype
                          : existing
                      }
                      alt="New/Existing"
                    />
                  </Badge>
                </OverlayTrigger>
              </span>

              {/* Implementation  Type */}
              <div className="d-flex justify-content-between">
                <span className="font-13"> LOCATOR </span>
                <JobActionButton
                  job={row.original}
                  handleCreateLocatorUser={() => {
                    setSelectedJobId(row.original.sales_plus_id);

                    const confirmBox = window.confirm(
                      "Are you sure you want to add this user to traccar?"
                    );
                    if (confirmBox === true) {
                      setTraccarCredentialsPopup(true);
                    }
                  }}
                  handleSendMailToUser={() => {
                    setSelectedJobId(row.original.sales_plus_id);

                    const confirmBox = window.confirm(
                      "Do you want to continue sending the Email?"
                    );
                    if (confirmBox === true) {
                      sendMail(getShareValues());
                    }
                  }}
                  handleCreateSchedule={() => {
                    console.log(row.original.sales_plus_person);
                    resetSchedule({
                      job_customer_id:
                        row.original.sales_plus_company_traccar_id,
                      name: row.original.sales_plus_company_name,
                      job_user: row.original.sales_plus_company_name,
                      job_customer_contact:
                        row.original.sales_plus_customer_name,
                      job_customer_phone: row.original.sales_plus_phone,
                      job_sales_person_id: row.original.sales_plus_person,
                      job_address: row.original.sales_plus_address,
                      job_new: row.original.sales_plus_quantity_new,
                      job_migration: row.original.sales_plus_quantity_migrate,
                      job_replace: row.original.sales_plus_quantity_trading,
                      job_services: row.original.sales_plus_quantity_service,
                      job_status: "initiated",
                      job_comment: "",
                      job_date: "",
                      job_technician_id: "",
                    });
                    setSchedulePopup(true);
                  }}
                  handleDeleteJob={() =>
                    handleDeleteJob(row.original.sales_plus_id)
                  }
                />
              </div>
            </span>
          );
        },
      },
      {
        Header: "Quantity/Sales Person/Value",
        accessor: "sales_plus_quantity_new",
        className: "quantity",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.sales_plus_quantity_new > 0 ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>New</Tooltip>}
                >
                  <Badge variant="primary">
                    N {row.original.sales_plus_quantity_new}
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}

              {row.original.sales_plus_quantity_migrate > 0 ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Migration</Tooltip>}
                >
                  <Badge variant="warning">
                    M {row.original.sales_plus_quantity_migrate}
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}

              {row.original.sales_plus_quantity_trading > 0 ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Trading</Tooltip>}
                >
                  <Badge variant="danger">
                    R {row.original.sales_plus_quantity_trading}
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}

              {row.original.sales_plus_quantity_service > 0 ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Service</Tooltip>}
                >
                  <Badge variant="success">
                    S {row.original.sales_plus_quantity_service}
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}
              <br />
              <span>
                {row.original.user_name}
                <br />
                {row.original.sales_plus_project_value}
              </span>
            </span>
          );
        },
      },
      {
        Header: "Scheduler Note",
        accessor: "sales_plus_won_note",
        className: "note",
        disableSortBy: true,
        Cell: ({ row }) => {
          var note = "";
          if (
            row.original.sales_plus_won_note &&
            row.original.sales_plus_won_note.length > 45
          ) {
            note = row.original.sales_plus_won_note.substring(0, 45) + "...";
          } else {
            note = row.original.sales_plus_won_note;
          }
          return <span>{note}</span>;
        },
      },
      {
        Header: "Status Note",
        accessor: "customer_comment",
        className: "note",
        disableSortBy: true,
        Cell: ({ row }) => {
          var comment = "";
          if (
            row.original.customer_comment &&
            row.original.customer_comment.length > 45
          ) {
            comment = row.original.customer_comment.substring(0, 45) + "...";
          } else {
            comment = row.original.customer_comment;
          }
          return <span>{comment}</span>;
        },
      },
      {
        Header: "Expected Time",
        accessor: "sales_plus_expected_completion",
        className: "expected",
        disableSortBy: true,
        Cell: ({ row }) => {
          if (
            formatExpectedDate(row.original.sales_plus_expected_completion) ===
            0
          ) {
            return <span>Today</span>;
          } else if (
            formatExpectedDate(row.original.sales_plus_expected_completion) > 0
          ) {
            return (
              <span>
                <div>
                  {Moment(
                    row.original.sales_plus_expected_completion,
                    "YYYY-MM-DD"
                  ).format("DD MMM, YY")}
                </div>
                <small>
                  (In{" "}
                  {formatExpectedDate(
                    row.original.sales_plus_expected_completion
                  )}{" "}
                  days)
                </small>
              </span>
            );
          } else if (
            formatExpectedDate(row.original.sales_plus_expected_completion) < 0
          ) {
            return (
              <span style={{ color: "red" }}>
                <div>
                  {Moment(
                    row.original.sales_plus_expected_completion,
                    "YYYY-MM-DD"
                  ).format("DD MMM, YY")}
                </div>
                <small>
                  (Due{" "}
                  {Math.abs(
                    formatExpectedDate(
                      row.original.sales_plus_expected_completion
                    )
                  )}{" "}
                  days)
                </small>
              </span>
            );
          } else {
            return (
              <Badge
                variant="primary"
                onClick={() => {
                  setDateModal(true);
                  setSelectedJobId(row.original.sales_plus_id);
                }}
                style={{
                  padding: "8px 5px",
                  margin: 0,
                  fontSize: "80%",
                  cursor: "pointer",
                }}
              >
                Not Scheduled
              </Badge>
            );
          }
        },
      },
      {
        Header: "Status",
        accessor: "sales_plus_customer_status",
        className: "status",
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.sales_plus_customer_status === "inprogress"
                ? "In Progress"
                : row.original.sales_plus_customer_status === "onhold"
                ? "On Hold"
                : row.original.sales_plus_customer_status === "unassigned"
                ? "Un Assigned"
                : row.original.sales_plus_customer_status}
              &nbsp;
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Update Status</Tooltip>}
              >
                <Badge
                  variant="primary"
                  onClick={() => showStatusPopup(row.original)}
                  style={{ cursor: "pointer", margin: "0" }}
                >
                  <i className="fas fa-check-circle" style={{ margin: 0 }}></i>
                </Badge>
              </OverlayTrigger>
              <br />
              {row.original.sales_plus_customer_sms !== "0" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>SMS send</Tooltip>}
                >
                  <Badge variant="success">
                    <i className="fas fa-comment"></i>
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}
              {row.original.sales_plus_customer_mail !== "0" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Mail send</Tooltip>}
                >
                  <Badge variant="success">
                    <i className="fas fa-envelope"></i>
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}
              {row.original.sales_plus_customer_whatsapp !== "0" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Whatsapp</Tooltip>}
                >
                  <Badge variant="success">
                    <i className="fab fa-whatsapp"></i>
                  </Badge>
                </OverlayTrigger>
              ) : (
                ""
              )}
            </span>
          );
        },
      },
      {
        Header: "P",
        accessor: "sales_plus_payment_status",
        className: "check",
        disableSortBy: true,
        Cell: ({ row }) => {
          var textColor = "";
          if (row.original.sales_plus_payment_status === "yes") {
            textColor = "green";
          } else if (row.original.sales_plus_payment_status === "no") {
            textColor = "gray";
          }
          return (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`}>
                  {row.original.sales_plus_payment_status === "yes"
                    ? "Payment Verified"
                    : "Payment Not Verified"}
                </Tooltip>
              }
            >
              <i
                className="fas fa-check-square"
                style={{ color: textColor, fontSize: "18px" }}
              ></i>
            </OverlayTrigger>
          );
        },
      },
      {
        Header: "",
        accessor: "buttons",
        className: "buttoncolumn",
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.sales_plus_traccar_customer_created == 1 ? (
                <span>
                  <Button
                    variant="primary"
                    style={{ padding: "6px", margin: "0 2px 2px 0" }}
                  >
                    <i className="fas fa-sign-in-alt" style={{ margin: 0 }}></i>
                  </Button>
                  <br />
                </span>
              ) : (
                ""
              )}
              {row.original.sales_plus_customer_status !== "unassigned" ? (
                <Button
                  variant="success"
                  onClick={() => showSharePopup(row.original)}
                  style={{ padding: "6px", margin: "0 2px 2px 0" }}
                >
                  <i className="fas fa-share" style={{ margin: 0 }}></i>
                </Button>
              ) : (
                ""
              )}
            </span>
          );
        },
      },
      {
        Header: "C",
        accessor: "sales_plus_completion",
        className: "check",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>Completion Status</Tooltip>
                }
              >
                <i
                  className="fas fa-check-square"
                  onClick={() => {
                    const confirmBox = window.confirm("Are you completed?");
                    if (confirmBox === true) {
                      movetoCompleted(row.original.sales_plus_id);
                    }
                  }}
                  style={{ color: "gray", fontSize: "18px" }}
                ></i>
              </OverlayTrigger>
            </span>
          );
        },
      },
    ],
    []
  );

  const typeRadioHandler = (status) => {
    setSelectedType(status);
  };

  const sendMail = async (postdata) => {
    try {
      const options = {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
        body: JSON.stringify(postdata),
      };

      const url = API_URL + "sendMailnewCustomer/" + selectedJobId;

      const response = await fetch(url, options);

      const data = await response.json();

      if (data.status === "success") {
        setListUpdated(true);

        setSharePopup(false);

        sweetAlertHandler({
          title: "Good job!",
          type: "success",
          text: "Successfully Send Mail!",
        });
      } else {
        sweetAlertHandler({
          title: "Error!",
          type: "error",
          text: "Error in Sending Mail!",
        });
      }
    } catch {}
  };

  const sendSMS = async (postdata) => {
    try {
      const options = {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
        body: JSON.stringify(postdata),
      };

      const url = API_URL + "sendSmsnewCustomer/" + selectedJobId;

      const response = await fetch(url, options);

      const data = await response.json();

      if (data.status === "success") {
        setListUpdated(true);

        setSharePopup(false);

        sweetAlertHandler({
          title: "Good job!",
          type: "success",
          text: "Successfully Send SMS!",
        });
      } else {
        sweetAlertHandler({
          title: "Error!",
          type: "error",
          text: "Error in Sending SMS!",
        });
      }
    } catch {}
  };

  const sendWhatsapp = async (postdata) => {
    try {
      const options = {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
        body: JSON.stringify(postdata),
      };

      const url = API_URL + "sendWhatsappnewCustomer/" + selectedJobId;

      const response = await fetch(url, options);

      const data = await response.json();

      if (data.status === "success") {
        setListUpdated(true);

        setSharePopup(false);

        sweetAlertHandler({
          title: "Good job!",
          type: "success",
          text: "Successfully Send WhatsApp!",
        });
      } else {
        sweetAlertHandler({
          title: "Error!",
          type: "error",
          text: "Error in Sending WhatsApp!",
        });
      }
    } catch {}
  };

  const showSharePopup = async (rowdata) => {
    setSharePopup(true);
    setSelectedJobId(rowdata.sales_plus_id);

    const jobNumber = 1000 + rowdata.sales_plus_id;

    setSelectedType("whatsapp");

    resetShareDetails({
      sales_plus_message_option: "whatsapp",
      sales_plus_email: rowdata.sales_plus_email,
      sales_plus_phone: rowdata.sales_plus_phone,
      sales_person_phone: rowdata.user_phone,
      sales_plus_email_subject:
        "Locator: " + rowdata.sales_plus_customer_status + " #" + jobNumber,
    });

    try {
      const options = {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
      };

      const url = API_URL + "ViewsinglenewCustomer/" + rowdata.sales_plus_id;

      const response = await fetch(url, options);

      const data = await response.json();

      resetShareDetails({
        ...getShareValues(),
        customer_whatsapp_comment: "Here is the job status. " + data.link,
        customer_sms_comment: "Here is the job status. " + data.link,
        customer_mail_comment: "Here is the job status. " + data.link,
      });
    } catch {}
  };

  const movetoCompleted = async (id) => {
    try {
      const options = {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
      };

      const url = API_URL + "changeCompletionStatus/" + id + "/1";
      console.log(url);

      const response = await fetch(url, options);

      const data = await response.json();

      if (data.status === "success") {
        sweetAlertHandler({
          title: "Good job!",
          type: "success",
          text: "Successfully moved!",
        });

        setListUpdated(true);
      } else {
        sweetAlertHandler({
          title: "Error!",
          type: "error",
          text: "Error in updating expected date!",
        });
      }
    } catch {}
  };

  const addNewSalesJob = () => {
    setUpdatePopup(true);
    setSelectedJobId(0);

    resetupdate({
      sales_plus_company_name: "",
      sales_plus_customer_name: "",
      sales_plus_email: "",
      sales_plus_phone: "",
      sales_plus_address: "",
      sales_plus_person: 0,
      sales_plus_quantity_new: "",
      sales_plus_quantity_migrate: "",
      sales_plus_quantity_trading: "",
      sales_plus_quantity_service: "",
      sales_plus_source: "",
      sales_plus_project_type: "",
      sales_plus_implementation_type: "",
      sales_plus_project_value: "",
      sales_plus_accessories: "",
      sales_plus_won_note: "",
      sales_plus_payment_collected: "",
      sales_plus_customer_invoice: "",
      sales_plus_payment_status: false,
      sales_plus_job_remarks: "",
      customer_comment: "",
      sales_plus_traccar_customer_created: 0,
      sales_plus_company_traccar_id: 0,
    });
  };

  const showUpdatePopup = (rowdata) => {
    setUpdatePopup(true);
    setSelectedJobId(rowdata.sales_plus_id);

    resetupdate({
      sales_plus_company_name: rowdata.sales_plus_company_name,
      sales_plus_customer_name: rowdata.sales_plus_customer_name,
      sales_plus_email: rowdata.sales_plus_email,
      sales_plus_phone: rowdata.sales_plus_phone,
      sales_plus_address: rowdata.sales_plus_address,
      sales_plus_person: rowdata.sales_plus_person,
      sales_plus_quantity_new: rowdata.sales_plus_quantity_new,
      sales_plus_quantity_migrate: rowdata.sales_plus_quantity_migrate,
      sales_plus_quantity_trading: rowdata.sales_plus_quantity_trading,
      sales_plus_quantity_service: rowdata.sales_plus_quantity_service,
      sales_plus_source: rowdata.sales_plus_source,
      sales_plus_project_type: "",
      sales_plus_implementation_type: "",
      sales_plus_project_value: rowdata.sales_plus_project_value,
      sales_plus_accessories: rowdata.sales_plus_accessories,
      sales_plus_won_note: rowdata.sales_plus_won_note,
      sales_plus_payment_collected: rowdata.sales_plus_payment_collected,
      sales_plus_customer_invoice: rowdata.sales_plus_customer_invoice,
      sales_plus_payment_status:
        rowdata.sales_plus_payment_status === "yes" ? true : false,
      sales_plus_job_remarks: rowdata.sales_plus_job_remarks,
      customer_comment: rowdata.customer_comment,
      sales_plus_traccar_customer_created:
        rowdata.sales_plus_traccar_customer_created,
      sales_plus_company_traccar_id: rowdata.sales_plus_company_traccar_id,
    });
  };

  const onSubmitUpdate = async (postdata) => {
    const updateddata = {
      ...postdata,
      sales_plus_payment_status:
        postdata.sales_plus_payment_status === true ? "yes" : "no",
      sales_plus_date: Moment(new Date()).format("DD/MM/YYYY"),
      sales_plus_customer_flag: 1,
      sales_plus_entry_type: 1,
      sales_plus_status: "Won",
    };

    if (selectedJobId === 0) {
      try {
        const options = {
          method: "post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Xtoken: authToken,
          },
          body: JSON.stringify(updateddata),
        };

        const url = API_URL + "addsalesplus";

        const response = await fetch(url, options);

        const data = await response.json();

        if (data.status === "success") {
          setListUpdated(true);

          setUpdatePopup(false);

          sweetAlertHandler({
            title: "Good job!",
            type: "success",
            text: "Successfully added sales job!",
          });
        } else {
          sweetAlertHandler({
            title: "Error!",
            type: "error",
            text: "Error in adding sales job!",
          });
        }
      } catch {}
    } else {
      try {
        const options = {
          method: "post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Xtoken: authToken,
          },
          body: JSON.stringify(updateddata),
        };

        const url = API_URL + "saveJobDetails/" + selectedJobId;

        const response = await fetch(url, options);

        const data = await response.json();

        if (data.status === "success") {
          setListUpdated(true);

          setUpdatePopup(false);

          sweetAlertHandler({
            title: "Good job!",
            type: "success",
            text: "Successfully updated details!",
          });
        } else {
          sweetAlertHandler({
            title: "Error!",
            type: "error",
            text: "Error in updating data!",
          });
        }
      } catch {}
    }
  };

  const handleScheduleDateChange = (date) => {
    resetSchedule({ ...getScheduleValues(), job_date: date });
  };

  const onSubmitSchedule = async (postdata) => {
    const updateddata = {
      ...postdata,
      job_date: Moment(new Date(postdata.job_date)).format("YYYY-MM-DD hh:mm"),
      job_user_id: 0,
    };

    try {
      const options = {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
        body: JSON.stringify(updateddata),
      };

      const url = API_URL + "addjob";

      const response = await fetch(url, options);

      const data = await response.json();

      if (data.status === "success") {
        setSchedulePopup(false);

        sweetAlertHandler({
          title: "Good job!",
          type: "success",
          text: "Successfully added schedule!",
        });
      } else {
        sweetAlertHandler({
          title: "Error!",
          type: "error",
          text: "Error in adding schedule!",
        });
      }
    } catch {}
  };

  const isEmptyBody = () => {
    const regex = /^<p>(<br>|&nbsp;)<\/p>$/;
    return !body || regex.test(body.toString("html"));
  };

  const submitMailForm = async (data) => {
    try {
      if (isEmptyBody()) {
        return;
      }
      var d = {
        ...data,
        body: body.toString("html"),
      };
      console.log("data", d);
    } catch (error) {
      console.log("error...", error);
    }
  };

  const addUserToTraccar = async (postcredata) => {
    try {
      const options = {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
        body: JSON.stringify(postcredata),
      };

      const url = API_URL + "addUserToTraccar/" + selectedJobId;

      const response = await fetch(url, options);

      const data = await response.json();

      if (data.status === "success") {
        setTraccarCredentialsPopup(false);

        sweetAlertHandler({
          title: "Good job!",
          type: "success",
          text: "Successfully Added User to Traccar!",
        });
      } else {
        sweetAlertHandler({
          title: "Error!",
          type: "error",
          text: "Error in adding user to traccar!",
        });
      }
    } catch {}
  };

  const deleteSalesJob = async () => {
    try {
      const options = {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
      };

      const url = API_URL + "salesplusFlagChange/" + selectedJobId;

      const response = await fetch(url, options);

      const data = await response.json();

      if (data.status === "success") {
        setListUpdated(true);

        sweetAlertHandler({
          title: "Good job!",
          type: "success",
          text: "Successfully changed status to deleted!",
        });
      } else {
        sweetAlertHandler({
          title: "Error!",
          type: "error",
          text: "Error in changing status!",
        });
      }
    } catch {}
  };

  const handleExpectedDateChange = (date) => {
    setExpectedDate(date);
  };

  const saveExpectedDate = async () => {
    try {
      const options = {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
        body: JSON.stringify({ sales_plus_expected_completion: expectedDate }),
      };

      const url = API_URL + "saveJobDetails/" + selectedJobId;

      const response = await fetch(url, options);

      const data = await response.json();

      if (data.status === "success") {
        sweetAlertHandler({
          title: "Good job!",
          type: "success",
          text: "Successfully updated expected date of completion!",
        });

        setListUpdated(true);
      } else {
        sweetAlertHandler({
          title: "Error!",
          type: "error",
          text: "Error in updating expected date!",
        });
      }

      setDateModal(false);
    } catch {}
  };

  const showStatusPopup = (rowdata) => {
    seStatusModal(true);
    setSelectedJobId(rowdata.sales_plus_id);
    reset({
      sales_plus_customer_status: rowdata.sales_plus_customer_status,
    });
  };

  const onSubmit = async (datarow) => {
    try {
      const options = {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
        body: JSON.stringify(datarow),
      };

      const url = API_URL + "saveJobDetails/" + selectedJobId;

      const response = await fetch(url, options);

      const data = await response.json();

      if (data.status === "success") {
        sweetAlertHandler({
          title: "Good job!",
          type: "success",
          text: "Successfully updated status!",
        });

        setListUpdated(true);
      } else {
        sweetAlertHandler({
          title: "Error!",
          type: "error",
          text: "Error in updating status!",
        });
      }

      seStatusModal(false);
    } catch {}
  };

  const getSalesPersonsList = useCallback(async () => {
    try {
      const options = {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
      };

      const url = API_URL + "salesperson";

      const response = await fetch(url, options);

      const data = await response.json();

      setsalespersons(data.data);
    } catch {}
  }, []);
  const getTechnicianList = useCallback(async () => {
    try {
      const options = {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
      };

      const url = API_URL + "technicians";

      const response = await fetch(url, options);

      const data = await response.json();

      settechnicians(data.data);
    } catch {}
  }, []);

  const getCustomerList = useCallback(async () => {
    try {
      const options = {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
      };

      const url = API_URL + "listcustomersforselect";

      const response = await fetch(url, options);

      const data = await response.json();

      setcustomers(data.data);
    } catch {}
  }, []);

  useEffect(() => {
    getSalesPersonsList();
    getCustomerList();
    getTechnicianList();
  }, [getSalesPersonsList, getCustomerList, getTechnicianList]);

  useEffect(() => {
    if (listupdated) {
      const sortBy = [
        { id: sortType, desc: sortOrder === "desc" ? true : false },
      ];
      const searchText = searchKeyword;
      const pageIndex = currentPage;
      const filterarray = filterData;
      getJobsList({
        pageIndex,
        searchText,
        sortBy,
        filterarray,
        salesplusstatus,
        searchFrom,
        searchTo,
        verifiedSts,
        collectedSts,
      });
    }
  }, [listupdated]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setSearchKeyword("");
      const searchText = "";
      const pageIndex = 0;
      const filterarray = filterData;

      if (salesplusstatus === 0) {
        setSortType("sales_plus_customer_status");
        setSortOrder("desc");
        const sortBy = [{ id: "sales_plus_customer_status", desc: true }];

        getJobsList({
          pageIndex,
          searchText,
          sortBy,
          filterarray,
          salesplusstatus,
          searchFrom,
          searchTo,
          verifiedSts,
          collectedSts,
        });
      } else {
        setSortType("sales_plus_completed_date");
        setSortOrder("desc");
        const sortBy = [{ id: "sales_plus_completed_date", desc: true }];

        getJobsList({
          pageIndex,
          searchText,
          sortBy,
          filterarray,
          salesplusstatus,
          searchFrom,
          searchTo,
          verifiedSts,
          collectedSts,
        });
      }
    }
  }, [salesplusstatus]);

  const getJobsList = useCallback(
    async ({
      pageIndex,
      searchText,
      sortBy,
      filterarray,
      salesplusstatus,
      searchFromDate,
      searchToDate,
      verifiedStatus,
      collectedStatus,
    }) => {
      setIsLoading(true);

      const cpage = pageIndex + 1;
      setCurrentPage(pageIndex);

      if (!searchText) {
        searchText = null;
      }

      if (!searchFromDate) {
        searchFromDate = null;
      }

      if (!searchToDate) {
        searchToDate = null;
      }

      if (!collectedStatus) {
        collectedStatus = null;
      }

      if (!verifiedStatus) {
        verifiedStatus = null;
      }

      setFromDate(searchFromDate);

      setToDate(searchToDate);

      setVerifiedStatus(verifiedStatus);

      setCollectedStatus(collectedStatus);

      setSearchKeyword(searchText);

      var stype = "";
      var sorder = "";

      if (sortBy.length > 0) {
        setSortType(sortBy[0].id);
        stype = sortBy[0].id;

        if (sortBy[0].desc) {
          setSortOrder("desc");
          sorder = "desc";
        } else {
          setSortOrder("asc");
          sorder = "asc";
        }
      }

      saveFilterData(filterarray);

      let sortTp = stype ? stype : sortType;
      let sortOdr = sorder ? sorder : sortOrder;

      try {
        const options = {
          method: "post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Xtoken: authToken,
          },
          body: JSON.stringify(filterarray),
        };

        console.log(
          searchFromDate,
          searchToDate,
          verifiedStatus,
          collectedStatus
        );

        const url =
          API_URL +
          "salesplusCustomerlist/" +
          sortTp +
          "/" +
          sortOdr +
          "/" +
          salesplusstatus +
          "/" +
          searchText +
          "/" +
          searchFromDate +
          "/" +
          searchToDate +
          "/" +
          verifiedStatus +
          "/" +
          collectedStatus +
          "/all?page=" +
          cpage;

        const response = await fetch(url, options);

        const data = await response.json();

        setJobs(data.data.data);

        setTotalCount(data.data.total);

        if (salesplusstatus === 0) {
          setPendingTitle("Pending (" + data.data.total + ")");

          setCompletedTitle("Completed (" + data.statusCount.completed + ")");
        } else {
          setCompletedTitle("Completed (" + data.data.total + ")");
        }

        setStatusCount(data.statusCount);

        setFromNumber(data.data.from);

        setToNumber(data.data.to);

        setIsLoading(false);

        setListUpdated(false);
      } catch {}
    },
    []
  );

  const Loader = () => (
    <div className="divLoader">
      <svg
        className="svgLoader"
        viewBox="0 0 100 100"
        width="10em"
        height="10em"
      >
        <path
          stroke="none"
          d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
          fill="#51CACC"
          transform="rotate(179.719 50 51)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            calcMode="linear"
            values="0 50 51;360 50 51"
            keyTimes="0;1"
            dur="1s"
            begin="0s"
            repeatCount="indefinite"
          ></animateTransform>
        </path>
      </svg>
    </div>
  );

  const reorderJobs = (startIndex, endIndex) => {
    const newData = [...jobs];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);
    setJobs(newData);
  };

  const updateJobs = async (rowIndex, columnID, newValue) => {
    setJobs((oldData) =>
      oldData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...oldData[rowIndex],
            [columnID]: newValue,
          };
        }
        return row;
      })
    );
    try {
      const options = {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
        body: JSON.stringify(jobs),
      };

      const url = API_URL + "UpdateSalesJobOrder";

      const response = await fetch(url, options);

      const data = await response.json();
    } catch {}
  };

  const changeSelectedView = (key) => {
    setKey(key);

    if (key === "pending") {
      setsalesplusstatus(0);
    } else {
      setsalesplusstatus(1);
    }
  };

  const handleDeleteJob = (id) => {
    setSelectedJobId(id);

    const confirmBox = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (confirmBox === true) {
      deleteSalesJob();
    }
  };

  const onDateButtonClick = (types) => {
    var currentDate = new Date();

    if ("tmw" == types) {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if ("dat" == types) {
      currentDate.setDate(currentDate.getDate() + 2);
    }

    handleScheduleDateChange(new Date(currentDate));
  };

  return (
    <React.Fragment>
      <Row>
        <Col className="p-0">
          {isLoading ? <Loader /> : null}
          <Tabs activeKey={key} onSelect={(k) => changeSelectedView(k)}>
            <Tab eventKey="pending" title={pendingTitle}>
              <DynamicTable
                columns={columns}
                data={jobs}
                fromNumber={fromNumber}
                toNumber={toNumber}
                getJobsList={getJobsList}
                totalCount={totalCount}
                salesplusstatus={salesplusstatus}
                statusCount={statusCount}
                updateJobs={updateJobs}
                reorderJobs={reorderJobs}
                addNewSalesJob={addNewSalesJob}
              />
            </Tab>
            <Tab eventKey="completed" title={completedTitle}>
              <CompletedJobsTable
                columns={completedColumns}
                data={jobs}
                fromNumber={fromNumber}
                toNumber={toNumber}
                getJobsList={getJobsList}
                totalCount={totalCount}
                salesplusstatus={salesplusstatus}
                addNewSalesJob={addNewSalesJob}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>

      <Modal
        show={dateModal}
        onHide={() => setDateModal(false)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Set expected date of completion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <DatePicker
                placeholderText="Select date"
                selected={expectedDate}
                onChange={handleExpectedDateChange}
                className="form-control"
                dateFormat="dd-MM-yyyy"
                isClearable={true}
              />
            </Col>
            <Col md={6}>
              <Button
                variant="success"
                type="submit"
                onClick={() => saveExpectedDate()}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal
        show={statusModal}
        onHide={() => seStatusModal(false)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Edit status</Modal.Title>
        </Modal.Header>
        <Form key="expdateform" onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control
                    as="select"
                    {...register("sales_plus_customer_status")}
                  >
                    <option value="unassigned">Un Assigned</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="demo">Demo</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed </option>
                    <option value="onhold">On Hold</option>
                    <option value="deleted">Deleted</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Button variant="success" type="submit">
                  Save
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Form>
      </Modal>

      <Modal
        size="xl"
        show={updatePopup}
        onHide={() => setUpdatePopup(false)}
        backdrop="static"
      >
        <Modal.Header closeButton style={{ padding: "0.7rem 1rem" }}>
          <Modal.Title as="h5">
            {selectedJobId === 0 ? "Add Job" : "Edit Job"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitupdate(onSubmitUpdate)}>
          <Modal.Body style={{ padding: "0.5rem 1rem 0" }}>
            <Row>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_company_name")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea2">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_customer_name")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_email")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea4">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_phone")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea5">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_address")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlSelect6">
                  <Form.Label>Sales Person</Form.Label>
                  <Form.Control
                    as="select"
                    {...registerupdate("sales_plus_person")}
                  >
                    <option value="None">Select sales person</option>
                    {salespersons &&
                      salespersons.map((person) => (
                        <option
                          key={person.sales_person_id}
                          value={person.sales_person_id}
                        >
                          {person.sales_person_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea7">
                  <Form.Label>New</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_quantity_new")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea8">
                  <Form.Label>Migration</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_quantity_migrate")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea9">
                  <Form.Label>Trading</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_quantity_trading")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea10">
                  <Form.Label>Service</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_quantity_service")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlSelect11">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    {...registerupdate("sales_plus_source")}
                  >
                    <option value="">Select Source</option>
                    <option value="dealer">Dealer</option>
                    <option value="referal">Referal</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.implementationType">
                  <Form.Label>Implementation Type</Form.Label>
                  <Form.Control
                    as="select"
                    {...registerupdate("sales_plus_implementation_type")}
                  >
                    <option value="">Select Implementation Type</option>
                    {implementationType.map((type, i) => (
                      <option key={i} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.projectType">
                  <Form.Label>Project Type</Form.Label>
                  <Form.Control
                    as="select"
                    {...registerupdate("sales_plus_project_type")}
                  >
                    <option value="">Select Project Type</option>
                    {projectStatus.map((type, i) => (
                      <option key={i} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea12">
                  <Form.Label>Project Value</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_project_value")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea13">
                  <Form.Label>Accessories If Any </Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_accessories")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea15">
                  <Form.Label>Invoice</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerupdate("sales_plus_customer_invoice")}
                  />
                </Form.Group>
              </Col>

              {/* SHOW ABOVE FIELDS IF IT IS ONLY ADMIN */}

              {loginUserType == "admin" && (
                <React.Fragment>
                  <Col md={2}>
                    <Form.Group controlId="exampleForm.ControlSelect16">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        as="select"
                        {...registerupdate("sales_plus_payment_collected")}
                      >
                        <option value="no">Not Paid</option>
                        <option value="partial">Partial</option>
                        <option value="yes">Paid</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="p-0">
                    <Form.Group>
                      <div
                        className="checkbox d-inline checkbox-danger"
                        style={{ top: "40px" }}
                      >
                        <Form.Control
                          type="checkbox"
                          name="sales_plus_payment_status"
                          id="danger-checkbox-1"
                          {...registerupdate("sales_plus_payment_status")}
                        />
                        <Form.Label htmlFor="danger-checkbox-1" className="cr">
                          Payment Verified
                        </Form.Label>
                      </div>
                    </Form.Group>
                  </Col>
                </React.Fragment>
              )}

              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea14">
                  <Form.Label>Note for scheduling </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="2"
                    {...registerupdate("sales_plus_won_note")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea17">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="2"
                    {...registerupdate("sales_plus_job_remarks")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea18">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="2"
                    {...registerupdate("customer_comment")}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer style={{ padding: "0.2rem 0.75rem" }}>
            {selectedJobId !== 0 ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Create Schedule</Tooltip>}
              >
                <Button
                  variant="warning"
                  onClick={() => {
                    const confirmBox = window.confirm(
                      "Are you sure you want to create schedule for this job?"
                    );
                    if (confirmBox === true) {
                      resetSchedule({
                        job_customer_id: getValues(
                          "sales_plus_company_traccar_id"
                        ),
                        name: getValues("sales_plus_company_name"),
                        job_user: getValues("sales_plus_company_name"),
                        job_customer_contact: getValues(
                          "sales_plus_customer_name"
                        ),
                        job_customer_phone: getValues("sales_plus_phone"),
                        job_sales_person_id: getValues("sales_plus_person"),
                        job_address: getValues("sales_plus_address"),
                        job_new: getValues("sales_plus_quantity_new"),
                        job_migration: getValues("sales_plus_quantity_migrate"),
                        job_replace: getValues("sales_plus_quantity_trading"),
                        job_services: getValues("sales_plus_quantity_service"),
                        job_status: "initiated",
                        job_comment: "",
                        job_date: "",
                        job_technician_id: "",
                      });
                      setUpdatePopup(false);
                      setSchedulePopup(true);
                    }
                  }}
                >
                  <i className="fas fa-calendar-day" style={{ margin: 0 }}></i>
                </Button>
              </OverlayTrigger>
            ) : (
              ""
            )}

            {selectedJobId !== 0 &&
            getValues("sales_plus_traccar_customer_created") === 0 ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>Create Locator User</Tooltip>
                }
              >
                <Button
                  variant="primary"
                  onClick={() => {
                    const confirmBox = window.confirm(
                      "Are you sure you want to add this user to traccar?"
                    );
                    if (confirmBox === true) {
                      setTraccarCredentialsPopup(true);
                    }
                  }}
                >
                  <i className="fas fa-user" style={{ margin: 0 }}></i>
                </Button>
              </OverlayTrigger>
            ) : (
              ""
            )}

            {selectedJobId !== 0 ? (
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteJob(selectedJobId);
                }}
              >
                <i className="fas fa-trash-alt" style={{ margin: 0 }}></i>
              </Button>
            ) : (
              ""
            )}

            <Button variant="success" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={() => setUpdatePopup(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={traccarCredentialsPopup}
        onHide={() => setTraccarCredentialsPopup(false)}
        backdrop="static"
      >
        <Form onSubmit={handleSubmitTraccarCredentials(addUserToTraccar)}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group controlId="exampleForm.email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control rows="1" {...registercredentials("email")} />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Username</Form.Label>
                  <Form.Control rows="1" {...registercredentials("username")} />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="exampleForm.ControlTextarea2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control rows="1" {...registercredentials("password")} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit">
              Submit
            </Button>
            <Button
              variant="secondary"
              onClick={() => setTraccarCredentialsPopup(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={sendMailPopup}
        size="lg"
        onHide={() => setSendMailPopup(false)}
        backdrop="static"
      >
        <Form onSubmit={handleSubmitMailDetails(submitMailForm)}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    rows="1"
                    type="email"
                    {...registerMailDetails("to")}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    defaultValue={MAIL_DEFAULT_SUBJECT}
                    rows="1"
                    {...registerMailDetails("subject")}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Body</Form.Label>
                  <RichTextEditor
                    ref={editorRef}
                    value={body}
                    onChange={(v) => {
                      setBody(v);
                    }}
                    editorStyle={{
                      height: 170,
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={() => setSendMailPopup(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={sharePopup}
        onHide={() => setSharePopup(false)}
        backdrop="static"
      >
        <Form>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <div className="radio d-inline radio-primary">
                    <Form.Control
                      type="radio"
                      name="sales_plus_message_option"
                      id="primary-radio-1"
                      value="whatsapp"
                      {...registerShare("sales_plus_message_option")}
                      onClick={(e) => typeRadioHandler("whatsapp")}
                    />
                    <Form.Label htmlFor="primary-radio-1" className="cr">
                      Whatsapp
                    </Form.Label>
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <div className="radio d-inline radio-primary">
                    <Form.Control
                      type="radio"
                      name="sales_plus_message_option"
                      id="primary-radio-2"
                      value="sms"
                      {...registerShare("sales_plus_message_option")}
                      onClick={(e) => typeRadioHandler("sms")}
                    />
                    <Form.Label htmlFor="primary-radio-2" className="cr">
                      SMS
                    </Form.Label>
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <div className="radio d-inline radio-primary">
                    <Form.Control
                      type="radio"
                      name="sales_plus_message_option"
                      id="primary-radio-3"
                      value="mail"
                      {...registerShare("sales_plus_message_option")}
                      onClick={(e) => typeRadioHandler("mail")}
                    />
                    <Form.Label htmlFor="primary-radio-3" className="cr">
                      Mail
                    </Form.Label>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {selectedType === "whatsapp" && (
              <Row>
                <Col md={12}>
                  <Form.Group controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      rows="1"
                      {...registerShare("sales_plus_phone")}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Whatsapp Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="2"
                      {...registerShare("customer_whatsapp_comment")}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            {selectedType === "sms" && (
              <Row>
                <Col md={12}>
                  <Form.Group controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      rows="1"
                      {...registerShare("sales_plus_phone")}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="exampleForm.ControlTextarea2">
                    <Form.Label>SMS Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="2"
                      {...registerShare("customer_sms_comment")}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            {selectedType === "mail" && (
              <Row>
                <Col md={12}>
                  <Form.Group controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      rows="1"
                      {...registerShare("sales_plus_email")}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      rows="1"
                      {...registerShare("sales_plus_email_subject")}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="2"
                      {...registerShare("customer_mail_comment")}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            {selectedType === "whatsapp" &&
            getShareValues("sales_plus_phone") ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>Share to Customer</Tooltip>
                }
              >
                <a
                  className="btn btn-primary"
                  href={`https://api.whatsapp.com/send?phone='+${getShareValues(
                    "sales_plus_phone"
                  )}+'&text='+${getShareValues("customer_whatsapp_comment")}`}
                  onClick={() => sendWhatsapp(getShareValues())}
                  target="_blank"
                >
                  <i
                    className="fab fa-whatsapp"
                    style={{ margin: 0, fontSize: "18px" }}
                  ></i>
                </a>
              </OverlayTrigger>
            ) : (
              ""
            )}
            {selectedType === "whatsapp" &&
            getShareValues("sales_person_phone") ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>Share to Sales Staff</Tooltip>
                }
              >
                <a
                  className="btn btn-light"
                  href={`https://api.whatsapp.com/send?phone='+${getShareValues(
                    "sales_person_phone"
                  )}+'&text='+${getShareValues("customer_whatsapp_comment")}`}
                  onClick={() => sendWhatsapp(getShareValues())}
                  target="_blank"
                >
                  <i
                    className="fab fa-whatsapp"
                    style={{ margin: 0, fontSize: "18px" }}
                  ></i>
                </a>
              </OverlayTrigger>
            ) : (
              ""
            )}

            {selectedType === "sms" ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Send SMS</Tooltip>}
              >
                <a
                  className="btn btn-warning"
                  onClick={() => {
                    const confirmBox = window.confirm(
                      "Do you want to continue sending SMS?"
                    );
                    if (confirmBox === true) {
                      sendSMS(getShareValues());
                    }
                  }}
                >
                  <i
                    className="fas fa-sms"
                    style={{ margin: 0, fontSize: "18px" }}
                  ></i>
                </a>
              </OverlayTrigger>
            ) : (
              ""
            )}

            {selectedType === "mail" ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Send mail</Tooltip>}
              >
                <a
                  className="btn btn-danger"
                  onClick={() => {
                    const confirmBox = window.confirm(
                      "Do you want to continue sending the Email?"
                    );
                    if (confirmBox === true) {
                      sendMail(getShareValues());
                    }
                  }}
                >
                  <i
                    className="fas fa-envelope"
                    style={{ margin: 0, fontSize: "18px" }}
                  ></i>
                </a>
              </OverlayTrigger>
            ) : (
              ""
            )}
            {/* <Button variant="success" type='submit'>Submit</Button> */}
            <Button variant="secondary" onClick={() => setSharePopup(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        size="xl"
        show={schedulePopup}
        onHide={() => setSchedulePopup(false)}
        backdrop="static"
      >
        <Modal.Header closeButton style={{ padding: "0.7rem 1rem" }}>
          <Modal.Title as="h5">Add Schedule</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitSchedule(onSubmitSchedule)}>
          <Modal.Body style={{ padding: "0.5rem 1rem 0" }}>
            <Row>
              <Col md={4}>
                <Form.Group
                  controlId="exampleForm.ControlTextarea1"
                  className="mb-1"
                >
                  <Form.Label>Date *</Form.Label>
                  <DatePicker
                    placeholderText="Select date"
                    selected={getScheduleValues("job_date")}
                    onChange={handleScheduleDateChange}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    isClearable={true}
                  />
                </Form.Group>
                <div className="d-flex">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}>Today</Tooltip>}
                  >
                    <Button
                      variant="secondary"
                      onClick={() => onDateButtonClick("tdy")}
                      style={{ padding: "5px 10px" }}
                      className="mb-2"
                    >
                      Tdy
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}>Tomorrow</Tooltip>}
                  >
                    <Button
                      variant="secondary"
                      onClick={() => onDateButtonClick("tmw")}
                      style={{ padding: "5px 10px" }}
                      className="mb-2"
                    >
                      Tmw
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>Day After Tomorrow</Tooltip>
                    }
                  >
                    <Button
                      variant="secondary"
                      onClick={() => onDateButtonClick("dat")}
                      style={{ padding: "5px 10px" }}
                      className="mb-2"
                    >
                      DaT
                    </Button>
                  </OverlayTrigger>
                </div>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlSelect6">
                  <Form.Label>Technician</Form.Label>
                  <Form.Control
                    as="select"
                    {...registerSchedule("job_technician_id")}
                  >
                    <option value="None">Select technician</option>
                    {technicians &&
                      technicians.map((person) => (
                        <option
                          key={person.technician_id}
                          value={person.technician_id}
                        >
                          {person.technician_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerSchedule("name")}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea2">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerSchedule("job_customer_contact")}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea4">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerSchedule("job_customer_phone")}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlSelect6">
                  <Form.Label>Sales Person</Form.Label>
                  <Form.Control
                    as="select"
                    {...registerSchedule("job_sales_person_id")}
                    disabled
                  >
                    <option value="None">Select sales person</option>
                    {salespersons &&
                      salespersons.map((person) => (
                        <option key={person.user_id} value={person.user_id}>
                          {person.user_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea5">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerSchedule("job_address")}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea7">
                  <Form.Label>Installation</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerSchedule("job_new")}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea8">
                  <Form.Label>Migration</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerSchedule("job_migration")}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea9">
                  <Form.Label>Trading</Form.Label>

                  <Form.Control
                    rows="1"
                    {...registerSchedule("job_replace")}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea10">
                  <Form.Label>Service</Form.Label>
                  <Form.Control
                    rows="1"
                    {...registerSchedule("job_services")}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="exampleForm.ControlTextarea14">
                  <Form.Label>Note </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="2"
                    {...registerSchedule("job_comment")}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Form.Label className="mr-2">
                  Schedule Contact details
                </Form.Label>
                <input
                  type="checkbox"
                  id="isScheduleContactDetails"
                  name="isScheduleContactDetails"
                  defaultChecked={isScheduleContactDetails}
                  onClick={(e) => setScheduleContactDetails(e.target.checked)}
                />
              </Col>
            </Row>
            {isScheduleContactDetails && (
              <>
                <hr />
                <Row>
                  <Col>
                    <Form.Group controlId="exampleForm.ControlTextarea15">
                      <Form.Label>Schedule Contact Name</Form.Label>
                      <Form.Control
                        rows="1"
                        {...registerupdate("schedule_contact_name")}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="exampleForm.ControlTextarea16">
                      <Form.Label>Schedule Contact Phone</Form.Label>
                      <Form.Control
                        rows="1"
                        {...registerupdate("schedule_contact_phone")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Modal.Body>
          <Modal.Footer style={{ padding: "0.2rem 0.75rem" }}>
            <Button variant="success" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={() => setSchedulePopup(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </React.Fragment>
  );
}

export default App;
