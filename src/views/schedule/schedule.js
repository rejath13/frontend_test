import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Row,
  Col,
  Card,
  Pagination,
  Table,
  Modal,
  Field,
  Button,
  OverlayTrigger,
  Tooltip,
  Form,
  Tabs,
  Tab,
  Badge,
  ButtonGroup,
} from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy, usePagination } from "react-table";
import Moment from "moment";
import DatePicker from "react-datepicker";
import "./schedule.css";
import { API_URL } from "../../config/constant";
import ReactHtmlParser from "react-html-parser";
// import adminprofile from "../../assets/images/small-logo.png";
import ScrollToBottom from "react-scroll-to-bottom";
import Datetime from "react-datetime";
import TimelineView from "./timeline/TimelineView";

import { BiCurrentLocation } from 'react-icons/bi'
import LocationPickerMap from "./LocationPickerMap";
import OptimizerMap from "./optimizer/OptimizerMap";
import { implementationType } from "../itc/projects/project-options-data";

const sweetAlertHandler = (alert) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    //title: alert.title,
    icon: "success",
    text: alert.text,
    type: alert.type,
  });
};

function DynamicTable({
  columns,
  data,
  fromNumber,
  toNumber,
  getSchedulesList,
  technicians,
  totalCount,
  completedcnt,
  partialcnt,
  initcnt,
  remSearchDate,
  cleardatetype,
  handlesearchjobDateChange,
  searchjobDate,
  addSchedule,
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
        sortBy: [{ id: "tbl_job.job_date", desc: true }],
      },
      manualPagination: true,
      pageCount: Math.ceil(totalCount / 40),
    },
    useSortBy,
    usePagination
  );

  const [searchCustomer, setSearchCustomer] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [searchTech, setTech] = useState(null);
  const technicianlist = technicians;
  const [updateList, setupdateList] = useState(false);
  const [filterarray, setFilterarray] = useState({
    initiated: true,
    partial: true,
  });

  const [isTimelineView, setIsTimelineView] = useState(false);
  const [activeView, setActiveView] = useState('Table');

  const handleFilterArrayChange = (e) => {
    const isChecked = e.target.checked;
    const checkeditem = e.target.name;

    setFilterarray((filterarray) => ({
      ...filterarray,
      [checkeditem]: isChecked,
    }));
  };
  const statusfilter = [
    // {
    //   name: "pending",
    //   value: "false",
    //   label: "Due",
    //   full: "Due Jobs",
    // },
    {
      name: "initiated",
      value: "true",
      label: "Initiated",
      full: "Initiated",
    },
    {
      name: "partial",
      value: "true",
      label: "Partial",
      full: "Partial",
    },
    {
      name: "completed",
      value: "true",
      label: "Completed",
      full: "Completed",
    },

  ];

  const calladdschedule = () => {
    addSchedule();
  };

  const fndatetype = (value) => {
    if (pageIndex > 0) gotoPage(0);
    cleardatetype(value);
  };

  const onChangeSearchCustomer = (e) => {
    setSearchCustomer(e.target.value);
  };

  const search = () => {
    if (searchCustomer) setSearchText(searchCustomer);

    if (pageIndex > 0) {
      gotoPage(0);
    }
    setupdateList(updateList ? false : true);
  };

  const clearAllFilters = () => {
    //setIsLoading(true);
    setTech(null);
    setSearchCustomer(null);
    setSearchText(null);
    handlesearchjobDateChange(null);
    cleardatetype(null);
    if (pageIndex > 0) {
      gotoPage(0);
    }
  };


  const _getActiveView = () => {


    switch (activeView) {

      case 'Timeline':
        return (<TimelineView jobs={data} />);

      case 'Optimizer':
        return (<OptimizerMap jobs={data} />);

      default:
        return (
          <React.Fragment>
            <BTable striped bordered hover responsive {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup,index) => (
                  <tr key={index}  {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column,ci) => (
                      <th
                        key={ci}
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
                    <tr key={i} {...row.getRowProps()}>
                      {row.cells.map((cell,ti) => {
                        return (
                          <td
                            key={ti}
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
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
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
          </React.Fragment>
        );
    }


  }

  useEffect(() => {
    getSchedulesList({
      pageIndex,
      searchText,
      searchTech,
      sortBy,
      filterarray,
      searchjobDate,
      remSearchDate,
    });
  }, [getSchedulesList, sortBy, pageIndex, searchText, searchTech, updateList]);

  return (
    <>
      <Form>
        <Form.Row>
          <Col xs={1} style={{ color: "black" }}>
            <span style={{ top: "12px", position: "relative" }}>
              <b>Total : {totalCount}</b>
            </span>
          </Col>
          <Col xs="2">
            <ButtonGroup size="sm">
              <Button
                variant={
                  remSearchDate === "today" ? "warning" : "outline-warning"
                }
                onClick={() => {
                  fndatetype("today");
                }}
              >
                TDY&nbsp;{" "}
              </Button>

              <Button
                variant={remSearchDate === "tw" ? "warning" : "outline-warning"}
                onClick={() => {
                  fndatetype("tw");
                }}
                style={{ padding: "10px 20px" }}
              >
                TMW&nbsp;
              </Button>

              <Button
                variant={
                  remSearchDate === "dat" ? "warning" : "outline-warning"
                }
                onClick={() => {
                  fndatetype("dat");
                }}
              >
                DAT&nbsp;
              </Button>
            </ButtonGroup>
          </Col>

          <Col xs="2">
            <DatePicker
              placeholderText="Date"
              selected={searchjobDate}
              onChange={handlesearchjobDateChange}
              className="form-control"
              dateFormat="dd-MM-yyyy"
              isClearable={true}
            />
          </Col>

          {statusfilter.map((item, index) => (
            <Col className="topcols">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>{item.full}</Tooltip>}
              >
                <div className="checkbox d-inline">
                  <Form.Control
                    type="checkbox"
                    name={item.name}
                    value={item.value}
                    defaultChecked={filterarray[item.name]}
                    id={item.name}
                    onClick={(e) => handleFilterArrayChange(e)}
                  />

                  <Form.Label htmlFor={item.name} className="cr">
                    {item.label}
                  </Form.Label>
                  <span>
                    [
                    {item.name == "initiated"
                      ? initcnt
                      : item.name == "partial"
                        ? partialcnt
                        : item.name == "completed"
                          ? completedcnt
                          : ""}
                    ]
                  </span>
                </div>
              </OverlayTrigger>
            </Col>
          ))}


          <Col xs={1}>
            <Form.Control
              as="select"
              defaultValue={searchTech}
              onChange={(e) => {
                setTech(e.target.value);
              }}
            >
              <option value="null">Technician</option>
              <option value="null">Un Assigned</option>
              {technicianlist &&
                technicianlist.map((person) => (
                  <option
                    key={person.technician_id}
                    value={person.technician_id}
                  >
                    {person.technician_name}
                  </option>
                ))}
            </Form.Control>
          </Col>

          <Col xs={1}>
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
          <Col xs={3}>
            <button
              className="text-capitalize btn btn-success"
              type="button"
              onClick={search}
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
            >
              <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
            </button>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Add New Schedule</Tooltip>}
            >
              <Button
                onClick={() => calladdschedule()}
                className="text-capitalize"
                variant="primary"
              >
                <i
                  className="feather icon-plus"
                  style={{ margin: "0px", fontWeight: "bold" }}
                ></i>
              </Button>
            </OverlayTrigger>

            {/* TIMELINE VIEW  */}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}> {activeView != 'Table' ? 'Table View' : 'Timeline View'} </Tooltip>}
            >
              <Button
                onClick={() => setActiveView(activeView == 'Table' ? 'Timeline' : 'Table')}
                className="text-capitalize"
                variant="warning"
              >
                <i
                  className={activeView !== 'Table' ? 'fa fa-table' : 'fa fa-calendar'}
                  style={{ margin: "0px", fontWeight: "bold" }}
                ></i>
              </Button>
            </OverlayTrigger>

            {/* ROUTES  */}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}> {activeView != 'Table' ? 'Close Optimizer' : 'Timeline View'} </Tooltip>}
            >
              <Button
                onClick={() => setActiveView(activeView == 'Optimizer' ? 'Table' : 'Optimizer')}
                className="text-capitalize"
                variant="info"
              >
                <i
                  className={activeView !== 'Optimizer' ? 'fa fa-location-arrow' : 'fa fa-times'}
                  style={{ margin: "0px", fontWeight: "bold" }}
                ></i>
              </Button>
            </OverlayTrigger>
          </Col>
        </Form.Row>
      </Form>

      {_getActiveView()}

    </>
  );
}

function App() {
  const authToken = localStorage.getItem("authToken");
  const [schedules, setschedule] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [fromNumber, setFromNumber] = useState(0);
  const [toNumber, setToNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setselectedCustomer] = useState("");
  const [selectedDeviceId, setselectedDeviceId] = useState(0);
  const [monitoringPopup, setMonitoringPopup] = useState(false);
  const [ScheduleType, setScheduleType] = useState("");
  const [commentNoteDate, setCommentNoteDate] = useState();
  const [updtepopup, setupdatepopup] = useState(false);
  const [listupdated, setListUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchTechId, setSearchTechId] = useState(null);
  const [filterarray, setfilterarray] = useState({
    initiated: true,
    partial: true,
  });
  const [sortType, setSortType] = useState("tbl_job.job_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [notearray, setNoteArray] = useState([]);
  const [singleschedule, seteditschedule] = useState([]);
  const [customers, getCustomers] = useState([]);
  const [technicians, gettechnicians] = useState([]);
  const [salepersons, getsalepersons] = useState([]);
  const [jobDetails, setjobDetails] = useState([]);
  const [paymentDetails, setpaymentDetails] = useState([]);
  const [accessoriesDetails, setaccessoriesDetails] = useState([]);
  const [jobDate, setjobDate] = useState();
  const [totime, settotime] = useState("");
  const [fromDate, setfromDate] = useState("");
  const [fromtime, setfromtime] = useState();
  const [initcnt, setinitcnt] = useState(null);
  const [partialcnt, setpartialcnt] = useState(null);
  const [completedcnt, setcompletedcnt] = useState(null);
  const [remSearchDate, setRemSearchDate] = useState(""); //today
  const [searchjobDate, setsearchjobDate] = useState("");

  //   Toggle Location map
  const [showLocationPickerMap, setShowLocationPickerMap] = useState(false);



  const { register, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: {
      job_date: "",
      job_technician_id: "",
      Travel_time: 20,
      from_time: "",
      to_time: "",
      job_customer_contact: "",
      job_customer_id: "",
      job_user_id: "",
      job_customer_phone: "",
      job_address: "",
      job_address_cordinates: "",
      job_new: 0,
      job_migration: 0,
      job_replace: 0,
      job_services: 0,
      job_others: 0,

      job_comment: 0,
      job_priority: 0,
      job_paid: "no",
      job_mail_send: 0,
      jobid: 0,
      job_sales_person_id: "",
      job_lead_type: "",
      job_status: "initiated",
    },
  });

  const addSchedule = () => {
    setScheduleType("Add");
    setMonitoringPopup(true);
    reset({
      job_date: "",
      job_technician_id: "",
      Travel_time: 20,
      from_time: "",
      to_time: "",
      job_customer_contact: "",
      job_customer_id: "",
      job_user_id: "",
      job_customer_phone: "",
      job_address: "",
      job_address_cordinates: "",
      job_new: 0,
      job_migration: 0,
      job_replace: 0,
      job_services: 0,
      job_others: 0,
      job_comment: 0,
      job_priority: 0,
      job_paid: "no",
      job_mail_send: 0,
      jobid: 0,
      job_sales_person_id: "",
      job_lead_type: "",
      job_status: "initiated",
    });
    fetchtechnicians();
    fetchcustomers();
    fetchsaleperson();
  };
  const cleardatetype = (value) => {
    setRemSearchDate(value);

    setListUpdated(listupdated === true ? false : true);
  };
  const handlesearchjobDateChange = (date) => {
    if (date == null) setsearchjobDate(null);
    else setsearchjobDate(new Date(date));
  };

  const getDifferenceInDays = (date) => {
    const currentDate = new Date();
    const givenDate = new Date(date);

    if (givenDate < currentDate) {
      return true;
    } else {
      return false;
    }
  };

  const deleteItem = async (id) => {
    const options = {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Xtoken: authToken,
      },
    };

    const url = API_URL + "deletejob/" + id;

    const response = await fetch(url, options);

    const data = await response.json();

    if (data.status === "success") {
      sweetAlertHandler({
        title: "Good job!",
        type: "success",
        text: "Successfully  Deleted Job!",
      });
      setMonitoringPopup(false);
      setListUpdated(true);
    } else
      sweetAlertHandler({ title: "Error!", type: "error", text: "Error  !" });
  };

  const handlecustomerChange = (e) => {
    var item = e.target.value.split("/");

    if (item[0] != 0) fetchcustomerdetails(item[0], item[1]);
  };
  const fetchcustomerdetails = async (id, org_id) => {
    const options = {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Xtoken: authToken,
      },
    };

    const url = API_URL + "customercontactdetails/" + id;

    const response = await fetch(url, options);

    const customer_data = await response.json();

    reset({
      ...getValues(),
      job_customer_contact: customer_data.data[0].customer_contact_name,
      job_customer_id: id + "/" + org_id,
      job_user_id: org_id,
      job_customer_phone: customer_data.data[0].customer_contact_phone,
      job_address: customer_data.data[0].customer_address,
      job_address_cordinates:
        customer_data.data[0].customer_address_cordinates != null
          ? customer_data.data[0].customer_address_cordinates.replaceAll(
            '"',
            ""
          )
          : "",
      job_sales_person_id: customer_data.data[0].customer_sales_person_id,
      job_lead_type: customer_data.data[0].customer_sales_person_id,
    });

    singleschedule.job_address = customer_data.data[0].customer_address;
    singleschedule.job_address_cordinates =
      customer_data.data[0].customer_address_cordinates != null
        ? customer_data.data[0].customer_address_cordinates.replaceAll('"', "")
        : "";
    singleschedule.job_customer_contact =
      customer_data.data[0].customer_contact_name;
    singleschedule.job_customer_id = id;
    singleschedule.job_user_id = org_id;
    singleschedule.job_sales_person_id =
      customer_data.data[0].customer_sales_person_id;
    singleschedule.job_customer_phone =
      customer_data.data[0].customer_contact_phone;
    singleschedule.job_lead_type =
      customer_data.data[0].customer_sales_person_id;
  };

  const changePriorityStatus = (e) => {
    if (e.target.checked == true) {
      reset({ ...getValues(), job_priority: "1" });
    } else {
      reset({ ...getValues(), job_priority: "0" });
    }
  };
  const changePaidStatus = (e) => {
    if (e.target.checked == true) {
      reset({ ...getValues(), job_paid: "yes" });
    } else {
      reset({ ...getValues(), job_paid: "no" });
    }
  };
  const changeMailStatus = (e) => {
    if (e.target.checked == true) {
      reset({ ...getValues(), job_mail_send: "1" });
    } else {
      reset({ ...getValues(), job_mail_send: "0" });
    }
  };
  const checkPostitionId = (job) => {
    if (
      job.traccar_devices &&
      job.traccar_devices.hasOwnProperty("positionid") &&
      job.traccar_devices.positionid
    ) {
      return "deviceactive";
    } else return false;
  };

  const getaddedDate = (types) => {
    var currentDate = new Date();

    if ("tmw" == types) {
      currentDate.setDate(currentDate.getDate() + 1);
      setjobDate(new Date(currentDate));
      reset({ ...getValues(), job_date: new Date(currentDate) });
    } else if ("dat" == types) {
      currentDate.setDate(currentDate.getDate() + 2);
      setjobDate(new Date(currentDate));
      reset({ ...getValues(), job_date: new Date(currentDate) });
    } else if ("tbs" == types) {
      setjobDate("");
      reset({ ...getValues(), job_date: "" });
    }
    singleschedule.job_date = new Date(currentDate);
  };

  const changeStatusToCompleted = async (jobid) => {
    const confirmBox = window.confirm(
      "You want to change status to completed?"
    );
    if (confirmBox === true) {
      try {
        const options = {
          method: "post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Xtoken: authToken,
          },
        };

        const url = API_URL + "changeStatusToCompleted/" + jobid;

        const response = await fetch(url, options);

        const data = await response.json();

        if (data.status === "success") {
          sweetAlertHandler({
            title: "Good job!",
            type: "success",
            text: "Successfully Changed Status!",
          });

          setListUpdated(true);
        } else {
          sweetAlertHandler({
            title: "Error!",
            type: "error",
            text: "Error  !",
          });
        }
      } catch { }
    }
  };

  const fetchtechnicians = async () => {
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

    const techs = await response.json();

    gettechnicians(techs.data);
  };

  useEffect(() => {
    fetchtechnicians();
  }, []);

  const fetchsaleperson = async () => {
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

    const sales = await response.json();

    getsalepersons(sales.data);
  };

  const fetchcustomers = async () => {
    const options = {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Xtoken: authToken,
      },
    };

    const url = API_URL + "ListLocatorCustomer";

    const response = await fetch(url, options);

    const customers = await response.json();

    getCustomers(customers.data);
  };

  const fetchjobDetails = async (jobid) => {
    const options = {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Xtoken: authToken,
      },
    };

    const url = API_URL + "jobdetails/" + jobid;

    const response = await fetch(url, options);

    const jobdetails = await response.json();

    setjobDetails(jobdetails.data);
    setpaymentDetails(jobdetails.payment);
    setaccessoriesDetails(jobdetails.accessories);
  };

  const editJob = async (jobid) => {
    setScheduleType("Edit");
    fetchcustomers();
    try {
      const options = {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
      };

      const url = API_URL + "singlejob/" + jobid;

      const response = await fetch(url, options);

      const jobdata = await response.json();
      seteditschedule(jobdata.data[0]);

      setjobDate(new Date(jobdata.data[0].job_date));

      fetchtechnicians();

      fetchsaleperson();
      fetchjobDetails(jobid);

      reset({
        job_date: jobdata.data[0].job_date,
        job_technician_id: jobdata.data[0].job_technician_id,
        Travel_time: jobdata.data[0].Travel_time,
        job_sales_person_id: jobdata.data[0].job_sales_person_id,
        job_customer_contact: jobdata.data[0].job_customer_contact,
        job_customer_id:
          jobdata.data[0].job_user_id + "/" + jobdata.data[0].job_customer_id,
        job_user_id: jobdata.data[0].job_user_id,
        job_customer_phone: jobdata.data[0].job_customer_phone,
        job_address: jobdata.data[0].job_address,
        job_address_cordinates:
          jobdata.data[0].job_address_cordinates.replaceAll('"', ""),
        job_new: jobdata.data[0].job_new,
        job_migration: jobdata.data[0].job_migration,
        job_replace: jobdata.data[0].job_replace,
        job_services: jobdata.data[0].job_services,
        job_others: jobdata.data[0].job_others,
        job_status: jobdata.data[0].job_status,
        job_comment: jobdata.data[0].job_comment,
        job_priority: jobdata.data[0].job_priority,
        job_paid: jobdata.data[0].job_paid,
        job_mail_send: jobdata.data[0].job_mail_send,
        jobid: jobid,
        job_lead_type: jobdata.data[0].job_lead_type,
      });
    } catch { }

    setMonitoringPopup(true);
  };
  const updateComments = (selectedcustomerdetails) => {
    setselectedCustomer(selectedcustomerdetails.name);
    setselectedDeviceId(selectedcustomerdetails.id);
    fetchOfflineNotes(selectedcustomerdetails.id);
    setMonitoringPopup(true);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Order",
        accessor: "Order",
        className: "ordercolumn",
        Cell: ({ row }) => {
          return <span className="joborder">{row.original.job_order}</span>;
        },
      },
      {
        Header: "Date",
        accessor: "job_date",
        className: "datecolumn",

        Cell: ({ row }) => {
          return (
            <span onClick={() => editJob(row.original.job_id)}>
              {Moment(row.original.job_date).format("DD-MM-yyyy hh:mm a") !==
                "Invalid date"
                ? Moment(row.original.job_date).format("DD-MM-yyyy hh:mm A")
                : ""}
            </span>
          );
        },
      },
      {
        Header: "User",
        accessor: "User",
        className: "namecolumn",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span onClick={() => editJob(row.original.job_id)}>
              {row.original.customer_name}
            </span>
          );
        },
      },
      {
        Header: "Schedule Contact",
        accessor: "Schedule Contact",
        className: "namecolumn",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.job_customer_phone || ""}
            </span>
          );
        },
      },
      {
        Header: "Technician",
        accessor: "Technician",
        className: "techcolumn",
        disableSortBy: false,
        Cell: ({ row }) => {
          return (
            <span
              onClick={() => editJob(row.original.job_id)}
              style={
                row.original.technician_color
                  ? { "backgroundColor": row.original.technician_color }
                  : { "backgroundColor": "#564aa3" }
              }
              className="technician"
            >
              {row.original.technician_name}
            </span>
          );
        },
      },
      //   {
      //     Header: "Types",
      //     accessor: "Types",
      //     className: "countcolumn",
      //     disableSortBy: true,
      //     Cell: ({ row }) => {
      //       return (
      //         <span>
      //           {row.original.job_new != 0 && row.original.job_new != null ? (
      //             <OverlayTrigger
      //               placement="top"
      //               overlay={<Tooltip id={`tooltip-top`}>Installation</Tooltip>}
      //             >
      //               <Badge variant="primary">N {row.original.job_new}</Badge>
      //             </OverlayTrigger>
      //           ) : (
      //             ""
      //           )}
      //           {row.original.job_migration != 0 &&
      //           row.original.job_migration != null ? (
      //             <OverlayTrigger
      //               placement="top"
      //               overlay={<Tooltip id={`tooltip-top`}>Migration</Tooltip>}
      //             >
      //               <Badge variant="warning">
      //                 M {row.original.job_migration}
      //               </Badge>
      //             </OverlayTrigger>
      //           ) : (
      //             ""
      //           )}
      //           {row.original.job_replace != 0 &&
      //           row.original.job_replace != null ? (
      //             <OverlayTrigger
      //               placement="top"
      //               overlay={<Tooltip id={`tooltip-top`}>Replace</Tooltip>}
      //             >
      //               <Badge variant="danger">R {row.original.job_replace}</Badge>
      //             </OverlayTrigger>
      //           ) : (
      //             ""
      //           )}
      //           {row.original.job_services != 0 &&
      //           row.original.job_services != null ? (
      //             <OverlayTrigger
      //               placement="top"
      //               overlay={<Tooltip id={`tooltip-top`}>Services</Tooltip>}
      //             >
      //               <Badge variant="success">S {row.original.job_services}</Badge>
      //             </OverlayTrigger>
      //           ) : (
      //             ""
      //           )}
      //           {row.original.job_others == 0 &&
      //           row.original.job_others != null ? (
      //             <OverlayTrigger
      //               placement="top"
      //               overlay={<Tooltip id={`tooltip-top`}>Others</Tooltip>}
      //             >
      //               <Badge variant="success">O {row.original.job_others}</Badge>
      //             </OverlayTrigger>
      //           ) : (
      //             ""
      //           )}
      //         </span>
      //       );
      //     },
      //   },
      {
        Header: " ",
        accessor: "",
        className: "iconscolumn",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.job_training == 0 ? (
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}>Not Trained</Tooltip>}
                  >
                    <i
                      className="fa fa-check-square"
                      aria-hidden="true"
                      style={{ color: "#CFCFCF" }}
                    ></i>
                  </OverlayTrigger>
                  &nbsp;&nbsp;
                </span>
              ) : (
                ""
              )}

              {row.original.job_training == 1 ? (
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}>Trained</Tooltip>}
                  >
                    <i
                      className="fa fa-check-square"
                      aria-hidden="true"
                      style={{ color: "green" }}
                    ></i>
                  </OverlayTrigger>{" "}
                  &nbsp;&nbsp;{" "}
                </span>
              ) : (
                ""
              )}

              {!row.original.job_comment ? (
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}>No Comment</Tooltip>}
                  >
                    <i className="fas fa-comments" style={{ color: "#CFCFCF" }}></i>
                  </OverlayTrigger>
                  &nbsp;&nbsp;
                </span>
              ) : (
                ""
              )}

              {row.original.job_comment ? (
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}> Comment</Tooltip>}
                  >
                    <i
                      className="fas fa-comments"
                      aria-hidden="true"
                      style={{ color: "green" }}
                    ></i>
                  </OverlayTrigger>{" "}
                  &nbsp;&nbsp;{" "}
                </span>
              ) : (
                ""
              )}

              {!row.original.job_address_cordinates ? (
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}> No Location</Tooltip>}
                  >
                    <i
                      className="fas fa-map-marker-alt"
                      style={{ color: "!CFCFCF" }}
                      aria-hidden="true"
                    ></i>
                  </OverlayTrigger>{" "}
                  &nbsp;&nbsp;
                </span>
              ) : (
                ""
              )}

              {row.original.job_address_cordinates ? (
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}>Location</Tooltip>}
                  >
                    <i
                      className="fas fa-map-marker-alt"
                      style={{ color: "green" }}
                      aria-hidden="true"
                    ></i>
                  </OverlayTrigger>{" "}
                  &nbsp;&nbsp;{" "}
                </span>
              ) : (
                ""
              )}

              {row.original.job_mail_send == "0" ? (
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        Not Send Welcome Mail
                      </Tooltip>
                    }
                  >
                    <i
                      className="fa fa-enveloper"
                      aria-hidden="true"
                      style={{ color: "#CFCFCF" }}
                    ></i>
                  </OverlayTrigger>{" "}
                  &nbsp;&nbsp;{" "}
                </span>
              ) : (
                ""
              )}

              {row.original.job_mail_send == "1" ? (
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>Send Welcome Mail</Tooltip>
                    }
                  >
                    <i
                      className="fa fa-envelope"
                      aria-hidden="true"
                      style={{ color: "green" }}
                    ></i>
                  </OverlayTrigger>{" "}
                  &nbsp;&nbsp;{" "}
                </span>
              ) : (
                ""
              )}

              {row.original.job_paid == "no" ? (
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}>Not Paid</Tooltip>}
                  >
                    <i
                      className="fas fa-dollar-sign"
                      aria-hidden="true"
                      style={{ color: "#CFCFCF" }}
                    ></i>
                  </OverlayTrigger>{" "}
                  &nbsp;&nbsp;{" "}
                </span>
              ) : (
                ""
              )}

              {row.original.job_paid == "yes" ? (
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}>Paid</Tooltip>}
                  >
                    <i
                      className="fas fa-dollar-sign"
                      aria-hidden="true"
                      style={{ color: "green" }}
                    ></i>
                  </OverlayTrigger>{" "}
                  &nbsp;&nbsp;
                </span>
              ) : (
                ""
              )}

              {row.original.job_priority === "0" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Low Priority</Tooltip>}
                >
                  <i
                    className="fas fa-star"
                    aria-hidden="true"
                    style={{ color: "yellow" }}
                  ></i>
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>High Priority</Tooltip>}
                >
                  <i
                    className="fas fa-star"
                    aria-hidden="true"
                    style={{ color: "red" }}
                  ></i>
                </OverlayTrigger>
              )}
            </span>
          );
        },
      },
      //   {
      //     Header: "Lead Type",
      //     accessor: "Lead Type",
      //     className: "leadcolumn",
      //     disableSortBy: true,
      //     Cell: ({ row }) => {
      //       return <span>{row.original.job_lead_type}</span>;
      //     },
      //   },
      {
        Header: "Sales Person",
        accessor: "Sales Person",
        className: "personcolumn",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span onClick={() => editJob(row.original.job_id)}>
              {row.original.sales_person_name}
            </span>
          );
        },
      },
      {
        Header: "Status",
        accessor: "Status",
        className: "statuscolumn",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span onClick={() => editJob(row.original.job_id)}>
              {row.original.job_status}

              {row.original.job_status != "completed" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      Changes Status To Completed
                    </Tooltip>
                  }
                >
                  <span
                    style={{
                      marginRight: "0.5rem",
                      cursor: "pointer",
                      float: "right",
                    }}
                    onClick={() => changeStatusToCompleted(row.original.job_id)}
                  >
                    <i className="fas fa-check-circle"></i>{" "}
                  </span>
                </OverlayTrigger>
              ) : (
                ""
              )}

              {row.original.job_status == "completed"
                ? Moment(row.original.job_compleated_time).format(
                  "DD-MM-yyyy hh:mm a"
                )
                : ""}
            </span>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (listupdated) {
      const sortBy = [
        { id: sortType, desc: sortOrder === "desc" ? true : false },
      ];
      const searchText = searchKeyword;
      const pageIndex = currentPage;
      const searchTech = searchTechId;
      getSchedulesList({
        pageIndex,
        searchText,
        searchTech,
        sortBy,
        filterarray,
        searchjobDate,
        remSearchDate,
      });
    }
  }, [listupdated]);

  const getSchedulesList = useCallback(
    async ({
      pageIndex,
      searchText,
      searchTech,
      sortBy,
      filterarray,
      searchjobDate,
      remSearchDate,
    }) => {
      setIsLoading(true);
      const cpage = pageIndex + 1;
      setCurrentPage(pageIndex);

      if (!searchText) {
        searchText = null;
      }

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

      const postdata = {
        status: filterarray,
        paymentstatus: "all",
        value: searchText,
        from: null,
        techid: searchTech,
        to: null,
        sortType: stype ? stype : sortType,
        sortOrder: sorder ? sorder : sortOrder,
        datetype: remSearchDate,
        searchjobDate: searchjobDate,
      };

      console.log(postdata);
      try {
        const options = {
          method: "Post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Xtoken: authToken,
          },
          body: JSON.stringify(postdata),
        };

        const url = API_URL + "/job?page=" + cpage;

        const response = await fetch(url, options);

        const data = await response.json();

        setschedule(data.data.data);

        setTotalCount(data.data.total);

        setFromNumber(data.data.from);

        setToNumber(data.data.to);
        setinitcnt(data.count.initcnt);
        setpartialcnt(data.count.partialcnt);
        setcompletedcnt(data.count.completedcnt);
        setIsLoading(false);

        setListUpdated(false);
      } catch { }
    },
    []
  );

  const saveSchedule = async (data) => {
    data.job_address_cordinates = data.job_address_cordinates
      .replace(/\\/g, "")
      .replaceAll('"', "");
    var aryvalue = data.job_customer_id.split("/");
    data.job_customer_id = aryvalue[1];
    data.job_user_id = aryvalue[0];

    if (data.job_customer_id != "None") {
      if (data.jobid != 0) {
        try {
          const options = {
            method: "post",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Xtoken: authToken,
            },
            body: JSON.stringify(data),
          };

          const url = API_URL + "editjob/" + data.jobid;

          const response = await fetch(url, options);

          const data1 = await response.json();

          if (data1.status === "success")
            sweetAlertHandler({
              title: "Good job!",
              type: "success",
              text: "Successfully edited  !",
            });
          else
            sweetAlertHandler({
              title: "Error!",
              type: "error",
              text: "Error in editing  !",
            });
        } catch {
          sweetAlertHandler({
            title: "Error!",
            type: "error",
            text: "Error in editing  !",
          });
        }
      } else {
        try {
          const options = {
            method: "post",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Xtoken: authToken,
            },
            body: JSON.stringify(data),
          };

          //console.log(data);

          const url = API_URL + "addjob";

          const response = await fetch(url, options);

          const data1 = await response.json();

          if (data1.status === "success") {
            sweetAlertHandler({
              title: "Good job!",
              type: "success",
              text: "Successfully Added  !",
            });
            setMonitoringPopup(false);
          } else
            sweetAlertHandler({
              title: "Error!",
              type: "error",
              text: "Error in added  !",
            });
        } catch {
          sweetAlertHandler({
            title: "Error!",
            type: "error",
            text: "Error in added  !",
          });
        }
      }
    } else
      sweetAlertHandler({
        title: "Sorry",
        type: "success",
        text: "Please Select Customer!",
      });

    setListUpdated(true);
  };

  const fetchOfflineNotes = async (data) => {
    const postdata = { device_id: data };

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

      const url = API_URL + "getOfflineNotes";

      const response = await fetch(url, options);

      const data = await response.json();
      setNoteArray(data.data);
    } catch { }
  };

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

  const handleJobDateChange = (date) => {
    setjobDate(new Date(date));
    reset({ ...getValues(), job_date: new Date(date) });
  };
  const handletraveltimeChange = (e) => {
    reset({ ...getValues(), Travel_time: e.target.value });
    if (fromDate != "") handlefromtimeChange(fromDate);
  };

  const handlefromtimeChange = (date) => {
    setfromDate(date);

    var event = new Date(date);
    var value = event.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setfromtime(value);
    reset({ ...getValues(), from_time: value });
    var Travel_time = getValues("Travel_time");
    var futureDate = new Date(event.getTime() + Travel_time * 60000);
    value = futureDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    settotime(value);

    reset({ ...getValues(), to_time: value });
  };

  const handletotimeChange = (date) => {
    //alert(date);
    var event = new Date(date);
    var value = event.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    settotime(value);
    reset({ ...getValues(), to_time: value });
  };

  return (
    <React.Fragment>
      <Row>
        <Col className="p-0">
          {isLoading ? <Loader /> : null}
          <Card>
            <Card.Body style={{ padding: "15px" }}>
              <DynamicTable
                columns={columns}
                data={schedules}
                fromNumber={fromNumber}
                toNumber={toNumber}
                getSchedulesList={getSchedulesList}
                technicians={technicians}
                totalCount={totalCount}
                completedcnt={completedcnt}
                partialcnt={partialcnt}
                initcnt={initcnt}
                remSearchDate={remSearchDate}
                cleardatetype={cleardatetype}
                handlesearchjobDateChange={handlesearchjobDateChange}
                searchjobDate={searchjobDate}
                addSchedule={addSchedule}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        size="xl"
        show={monitoringPopup}
        onHide={() => setMonitoringPopup(false)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">{ScheduleType} Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>
          <Row>
            <Col md={12}>
              <Card style={{ margin: 0 }}>
                <Card.Body className="task-comment">
                  <Form
                    key="monitoringform"
                    onSubmit={handleSubmit(saveSchedule)}
                  >
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Date :</Form.Label>

                          <DatePicker
                            placeholderText="Select date"
                            selected={jobDate}
                            onChange={handleJobDateChange}
                            className="form-control"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd-MM-yyyy h:mm aa"
                            timeCaption="time"
                            isClearable={true}
                          />

                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>Tomorrow</Tooltip>
                            }
                          >
                            <Button
                              variant="secondary"
                              onClick={() => getaddedDate("tmw")}
                            >
                              Tmw
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                Day After Tomorrow
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="secondary"
                              onClick={() => getaddedDate("dat")}
                            >
                              DaT
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                To be Scheduled
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="secondary"
                              onClick={() => getaddedDate("tbs")}
                            >
                              TBS
                            </Button>
                          </OverlayTrigger>
                        </Form.Group>
                      </Col>

                      <Col md={2}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Travel Time :</Form.Label>
                          <select
                            name="traveltime"
                            as="select"
                            className="form-control"
                            {...register("Travel_time")}
                            onChange={handletraveltimeChange}
                          >
                            <option value="None">Select Time</option>
                            <option value="15">15 Min</option>
                            <option value="20">20 Min</option>
                            <option value="30">30 Min</option>
                            <option value="45">45 Min</option>
                            <option value="60">1 Hr</option>
                            <option value="90">1.30 Hr</option>
                            <option value="120">2 Hr</option>
                            <option value="180">3 Hr</option>
                          </select>
                        </Form.Group>
                      </Col>

                      <Col md={2}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>From :</Form.Label>
                          <Datetime
                            dateFormat={false}
                            inputProps={{ placeholder: "Select Time" }}
                            defaultvalue={fromtime}
                            onChange={handlefromtimeChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>To :</Form.Label>
                          <Datetime
                            dateFormat={false}
                            inputProps={{ placeholder: "Select Time" }}
                            value={totime}
                            onChange={handletotimeChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Contact Name: </Form.Label>

                          <input
                            type="text"
                            className="form-control"
                            {...register("job_customer_contact")}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Customer: *</Form.Label>

                          <select
                            name="job_customer"
                            as="select"
                            className="form-control"
                            {...register("job_customer_id")}
                            onChange={(e) => handlecustomerChange(e)}
                          >
                            <option value="None">Select Customer</option>
                            {customers &&
                              customers.map((person) => (
                                <option value={person.customer_id}>
                                  {person.customer_name}
                                </option>
                              ))}
                          </select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={3}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Technician: *</Form.Label>

                          <select
                            name="Technician"
                            as="select"
                            className="form-control"
                            defaultValue={singleschedule.job_technician_id}
                            {...register("job_technician_id")}
                          >
                            <option value="None">Select Technician</option>
                            {technicians &&
                              technicians.map((person) => (
                                <option
                                  key={person.technician_id}
                                  value={person.technician_id}
                                >
                                  {person.technician_name}
                                </option>
                              ))}
                          </select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Sales Person: *</Form.Label>

                          <select
                            name="sale_person"
                            as="select"
                            className="form-control"
                            {...register("job_sales_person_id")}
                            disabled={ScheduleType == "Edit" ? true : false}
                          >
                            <option value="None">Select Sale Person</option>
                            {salepersons &&
                              salepersons.map((person) => (
                                <option
                                  selected={
                                    singleschedule.job_sales_person_id ===
                                    person.sales_person_id
                                  }
                                  key={person.sales_person_id}
                                  value={person.sales_person_id}
                                >
                                  {person.user_name}
                                </option>
                              ))}
                          </select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Contact Phone: </Form.Label>

                          <input
                            type="text"
                            className="form-control"
                            {...register("job_customer_phone")}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Lead Type: </Form.Label>

                          <input
                            type="text"
                            className="form-control"
                            value={singleschedule.job_lead_type}
                            readOnly={true}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Address:</Form.Label>

                          <input
                            type="text"
                            className="form-control"
                            {...register("job_address")}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect1">

                          <div className="d-flex justify-content-between">
                            <Form.Label>Coordinates:</Form.Label>
                            <BiCurrentLocation
                              onClick={() => setShowLocationPickerMap(!showLocationPickerMap)}
                              className="pointer"
                              color="#007bff"
                              size={20} />
                          </div>

                          <input
                            type="text"
                            className="form-control"
                            placeholder="latitude,longitude"
                            {...register("job_address_cordinates")}
                          />


                          {/* MAP */}
                          {showLocationPickerMap && <LocationPickerMap handleOnLocationChange={(latLng) => setValue('job_address_cordinates', `${latLng.lat},${latLng.lng}`)} />}

                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Number of Installation:</Form.Label>

                          <input
                            type="text"
                            className="form-control"
                            {...register("job_new")}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group controlId="exampleForm.implementationType">
                          <Form.Label>Implementation Type</Form.Label>
                          <Form.Control as="select">
                            <option value="">Select Implementation Type</option>
                            {
                              implementationType.map((type, i) => <option key={i} value={type.value}>{type.label}</option>)
                            }
                          </Form.Control>
                        </Form.Group>
                      </Col>


                    </Row>

                    <Row>
                      <Col md={3}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Number of Migration: </Form.Label>

                          <input
                            type="text"
                            className="form-control"
                            {...register("job_migration")}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Number of Replace: </Form.Label>

                          <input
                            type="text"
                            className="form-control"
                            {...register("job_replace")}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Number of Service: </Form.Label>

                          <input
                            type="text"
                            className="form-control"
                            {...register("job_services")}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Number of Other Services: </Form.Label>

                          <input
                            type="text"
                            className="form-control"
                            {...register("job_others")}
                          />
                        </Form.Group>
                      </Col>


                    </Row>

                    <Row></Row>

                    <Row>
                      <Col md={3}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Status: </Form.Label>

                          <select
                            name="status"
                            className="form-control"
                            {...register("job_status")}
                          >
                            <option
                              selected={
                                singleschedule.job_status === "initiated"
                              }
                              value="initiated"
                            >
                              Initiated
                            </option>
                            <option
                              selected={singleschedule.job_status === "partial"}
                              value="partial"
                            >
                              Partial
                            </option>
                            <option
                              selected={
                                singleschedule.job_status === "completed"
                              }
                              value="completed"
                            >
                              Completed
                            </option>
                          </select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Note from admin: </Form.Label>
                          <textarea
                            name="adminnote"
                            rows="3"
                            cols="65"
                            placeholder="Note"
                            {...register("job_comment")}
                          ></textarea>
                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <br />
                          <input
                            type="checkbox"
                            id="Priority"
                            name="Priority"
                            defaultChecked={singleschedule.job_priority === "1"}
                            onClick={(e) => changePriorityStatus(e)}
                          />
                          <Form.Label htmlFor="Priority"> High Priority</Form.Label>
                          <br />
                          <input
                            type="checkbox"
                            id="Payment"
                            name="Payment"
                            defaultChecked={singleschedule.job_paid === "yes"}
                            onClick={(e) => changePaidStatus(e)}
                          />
                          <Form.Label htmlFor="Payment"> Payment</Form.Label>
                          <br />

                          <input
                            type="checkbox"
                            id="mail"
                            name="mail"
                            defaultChecked={
                              singleschedule.job_mail_send === "1"
                            }
                            onClick={(e) => changeMailStatus(e)}
                          />
                          <Form.Label htmlFor="mail"> Send Welcome Mail</Form.Label>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Comment from technician: </Form.Label>
                          <br />
                          <div className="divcomment">
                            {ReactHtmlParser(singleschedule.technician_comment)}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      variant="success"
                      type="submit"
                      style={{ margin: "10px auto 0", float: "right" }}
                    >
                      Save
                    </Button>

                    {ScheduleType === "Edit" && (
                      <Button
                        className="text-capitalize btn-danger"
                        variant="primary"
                        style={{ margin: "10px 10px", float: "right" }}
                        onClick={() => {
                          const confirmBox = window.confirm(
                            "Are you sure you want to delete this item ?"
                          );
                          if (confirmBox === true) {
                            deleteItem(singleschedule.job_id);
                          }
                        }}
                      >
                        <i
                          className=" "
                          style={{ fontWeight: "normal", margin: 0 }}
                        ></i>{" "}
                        Delete
                      </Button>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={12}>&nbsp;</Col>
          </Row>
          {ScheduleType === "Edit" && (
            <Row>
              <Col md={12}>
                {isLoading ? <Loader /> : null}
                <Tabs defaultActiveKey="schedule">
                  <Tab eventKey="schedule" title="Schedule Details">
                    <Table
                      responsive
                      style={{ border: "1px solid #eaeaea", borderTop: "none" }}
                    >
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>IMEI</th>
                          <th>Vehicle Name</th>
                          <th>SIM</th>
                          <th>Vehicle Type</th>
                          <th>Model</th>
                          <th>Type</th>
                          <th>Comment</th>
                          <th>Status</th>
                          <th>Device status</th>
                          <th>Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobDetails.map((item, index) => (
                          <tr key={index}>
                            <td>
                              {Moment(item.job_date).format("DD-MM-yyyy")}
                            </td>
                            <td>{item.stock_imei}</td>
                            <td>{item.job_details_vehicle_name}</td>
                            <td>{item.stock_sim}</td>
                            <td>{item.job_details_vehicle_type}</td>
                            <td>{item.job_details_vehicle_model}</td>
                            <td>{item.job_details_type}</td>
                            <td>{item.job_details_comment}</td>
                            <td>{item.job_details_status}</td>
                            <td className="deviceactivetd">
                              <span className={checkPostitionId(item)}>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                              </span>
                            </td>
                            <td>{item.updated_at}</td>
                          </tr>
                        ))}

                        {jobDetails.length == 0 ? (
                          <tr>
                            <td colspan="11">No jobs added by technician</td>
                          </tr>
                        ) : (
                          ""
                        )}
                      </tbody>
                    </Table>
                  </Tab>
                  <Tab eventKey="payment" title="Payment Details">
                    <Table
                      responsive
                      style={{ border: "1px solid #eaeaea", borderTop: "none" }}
                    >
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentDetails.map((item, index) => (
                          <tr>
                            <td>{item.payment_type}</td>
                            <td>{item.payment_type}</td>
                            <td>{item.payment_amount}</td>
                          </tr>
                        ))}
                        {paymentDetails.length == 0 ? (
                          <tr>
                            <td colspan="3">No Data to show</td>
                          </tr>
                        ) : (
                          ""
                        )}
                      </tbody>
                    </Table>
                  </Tab>
                  <Tab eventKey="accessories" title="Accessories List">
                    <Table
                      responsive
                      style={{ border: "1px solid #eaeaea", borderTop: "none" }}
                    >
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accessoriesDetails.length > 0 &&
                          accessoriesDetails.map((item, index) => (
                            <tr>
                              <td>{item.item_name}</td>
                              <td>{item.job_accessories_quantity}</td>
                            </tr>
                          ))}

                        {accessoriesDetails.length == 0 ? (
                          <tr>
                            <td colspan="2">No Data to show</td>
                          </tr>
                        ) : (
                          ""
                        )}
                      </tbody>
                    </Table>
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default App;
