import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import {
  Container,
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

import { useQuery } from "react-query";

import BTable from "react-bootstrap/Table";
import { useTable, useSortBy, usePagination } from "react-table";

import Moment from "moment"; // Date formatting library
import DatePicker from "react-datepicker";
import ReactHtmlParser from "react-html-parser";

import RichTextEditor from "react-rte";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { API_URL } from "../../config/constant";
import JobActionButton from "./components/JobActionButton";
import {
  implementationType,
  projectStatus,
} from "../itc/projects/project-options-data";

// Local Imports
import {
  sweetAlertHandler,
  formatExpectedDate,
  MAIL_DEFAULT_BODY,
  MAIL_DEFAULT_SUBJECT,
  isEmptyBody,
} from "./helpers/jobs-helpers";

import "./styles/jobs.css";
import "./styles/index.css";
// import 'tailwindcss/dist/tailwind.css';

import { existing, newtype, dealer, referral } from "./images";
import { Tr } from "./styles/styles";
import DynamicTable from "./components/DynamicTable";
import CompletedJobsTable from "./components/CompletedJobsTable";
import { OrderCell } from "./components/OrderCell";
import Loader from "./components/Loader";
import axios from "axios";
import JobCardList from "./components/JobCardList";

function App() {
  console.log('Inside Jobs Sandeep')
  const authToken = localStorage.getItem("authToken");
  const loginUserType = localStorage.getItem("loginUserType");

  // useEffect(() => {
  //   fetchJobs();
  // }, []);

  const fetchTest = async () => {
    const url = 'http://65.20.71.81:3000/jobs'
    const config = {
      url,
      method: 'get',
   
    }

    const result = await axios(config)
    return result
  }

  const [jobs, setJobs] = useState([])

  useEffect(() => {
    fetchTest().then((results) => {
      if(results) {

        setJobs(results.data)
      }
      // console.log(jobs)
      // jobs.map((job) => {

      // })
    });
  }, [])

  // if(jobs) {

  //   const renderedJobs = jobs.length > 0 && jobs.map(job => {
  //     return (
  //       <div>
  //         <p>{job.id}</p>
  //         <p>{job.sales_plus_id}</p>
  //         <p>{job.tbl_sales_plu.sales_plus_customer_name}</p>
  //         <p>{job.tbl_sales_plu.sales_plus_company_name}</p>
  //         <p>{job.tbl_sales_plu.sales_plus_phone}</p>
  //       </div>
  //     )
  //   })
  // }
 

  // const { isLoading, error, data } = useQuery("fetch-test", fetchTest);
  // if(data) {
  //   console.log(data)
  // }
  
  // const fetchJobs = async () => {
    
  //   const url = `https://locatoralerts.com/control/react_api/public/index.php/salesplusCustomerlist/sales_plus_customer_status/desc/won/null/null/null/null/null/all?page=2`
    
  //   const config = {
  //     url,
  //     method: 'post',
  //     data: JSON.stringify({
  //       inprogress: true,
  //       scheduled: true,
  //       unassigned: true,
  //     }),
  //     headers: {
  //       Accept: "application/json, text/plain, */*",
  //       "Content-Type": "application/json",
  //       Xtoken: `${authToken}`,
  //     },
  //   }
    
    
  //   const result = await axios(config)
  //   return result
  // }
  
  // const { isLoading, error, data } = useQuery("getJobs", fetchJobs);

  // let jobsData = []
  // if(data) {
  //   // console.log("Result from use Query is ", data);
  //   jobsData = data.data.data.data
  // }
  /* Add code to rename the fetched data here */

  // All properties beginning with 'sp' refers to sales_plus
  //  const jobsDataRenamed = jobsData.map((item) => ({
  //    createdAt: item.created_at, // Renaming the property
  //    customerComment: item.customer_comment,
  //    customerUsername: item.customer_username,
  //    existingCustomer: item.existing_customer,
  //    cccessories: item.sales_plus_accessories,
  //    address: item.sales_plus_address,
  //    companyName: item.sales_plus_company_name,
  //    companyTraccarID: item.sales_plus_company_traccar_id,
  //    completedData: item.sales_plus_completed_date,
  //    customerInvoice: item.sales_plus_customer_invoice,
  //    customerMail: item.sales_plus_customer_mail,
  //    customerName: item.sales_plus_customer_name,
  //    customerSMS: item.sales_plus_customer_sms,
  //    customerStatus: item.sales_plus_customer_status,
  //    customerWhatsapp: item.sales_plus_customer_whatsapp,
  //    entryType: item.sales_plus_entry_type,
  //    expectedCompletion: item.sales_plus_expected_completion,
  //    id: item.sales_plus_id,
  //    implementationType: item.sales_plus_implementation_type,
  //    jobCreatedDate: item.sales_plus_job_created_date,
  //    jobRemarks: item.sales_plus_job_remarks,
  //    paymentCollected: item.sales_plus_payment_collected,
  //    paymentStatus: item.sales_plus_payment_status,
  //    person: item.sales_plus_person,
  //    phone: item.sales_plus_phone,
  //    projectType: item.sales_plus_project_type,
  //    projectValue: item.sales_plus_project_value,
  //    quantityMigrate: item.sales_plus_quantity_migrate,
  //    quantityNew: item.sales_plus_quantity_new,
  //    quantityService: item.sales_plus_quantity_service,
  //    quantityTrading: item.sales_plus_quantity_trading,
  //    source: item.sales_plus_source,
  //    traccarCustomerCreated: item.sales_plus_traccar_customer_created,
  //    wonNote: item.sales_plus_won_note,
  //    userName: item.user_name,
  //    userPhone: item.user_phone,
 
  //  }));
  
  

  // useEffect(() => {
  //   const data =  fetchJobs();
  //   console.log(data)
  // }, []);

  //   const response = await fetch(
  //     ,
  //     {
  //       method: "POST",
  //       mode: "no-cors",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: `${authToken}`,
  //       },
  //       body: JSON.stringify({
  //         inprogress: true,
  //         scheduled: true,
  //         unassigned: true,
  //       }),
  //     }).then((res) => res.json())

  //   return response;
  // }

  

  // Getting Jobs by React Query


  return (
    <>
      {/* <Container> */}
      <div id='sandeep'>

        <Row>
          <Col>
         {jobs.map(job => {
            return (
              <div>
                <p>{job.id}</p>
                <p>{job.sales_plus_id}</p>
                <p>{job.tbl_sales_plu.sales_plus_customer_name}</p>
                <p>{job.tbl_sales_plu.sales_plus_company_name}</p>
                <p>{job.tbl_sales_plu.sales_plus_phone}</p>
              </div>
            )
            })}
            {/* <JobCardList jobs={jobsDataRenamed} /> */}
          </Col>
        </Row>
      </div>
      {/* </Container> */}
    </>
  )

  // let remappedJobsData = []
  // if (renamedProperties) {
  //   remappedJobsData = renamedProperties.map(item => {
  //     //console.log("items is ", item)
  //   })
  // }
 
  // let initialStatusCount = {
  //   assigned: 0,
  //   completed: 0,
  //   deleted: 0,
  //   demo: 0,
  //   inProgress: 0,
  //   onHold: 0,
  //   scheduled: 0,
  //   unAssigned: 0,
  // }

  // const [statusCount, setStatusCount] = useState(initialStatusCount)


  // useEffect(() => {

  //   updateStatusCount(remappedJobsData)
  // }, [])

  //   const updateStatusCount = (remappedJobsData) => {
  
  //     remappedJobsData.map(job => {
  //       console.log(job)
  //       switch(job.customerStatus) {
  //         case 'assigned': {
  //           setStatusCount(prevStatusCount => ({...prevStatusCount, assigned: prevStatusCount.assigned + 1}))
  //           break;
  //         }
  //         case 'completed': {
  //           setStatusCount(prevStatusCount => ({...prevStatusCount, completed: prevStatusCount.assigned + 1}))
  //           statusCount.completed += 1
  //           break;
  //         }
  //         case 'deleted': {
  //           statusCount.deleted += 1
  //           break;
  //         }
  //         case 'demo': {
  //           statusCount.demo += 1
  //           break;
  //         }
  //         case 'inprogress': {
  //           statusCount.inProgress += 1
  //           break;
  //         }
  //         case 'onhold': {
  //           statusCount.onHold += 1
  //           break;
  //         }
  //         case 'scheduled': {
  //           statusCount.scheduled += 1
  //           break;
  //         }
  //         case 'unassigned': {
  //           statusCount.unAssigned += 1
  //           break;
  //         }
  //       }
  //     })
  
  //   }
 

  // if(remappedJobsData) {

  //   console.log('Updated Status Count is ', updateStatusCount(remappedJobsData))
  // }

 

  // if(isLoading) {
  //   return (
  //     <h1>Loading..</h1>
  //   )
  // }


  


  // States used in getJobsList

  // const [jobs, setJobs] = useState([]);

  // const [totalCount, setTotalCount] = useState(null);
  // const [statusCount, setStatusCount] = useState([]);
  // const [fromNumber, setFromNumber] = useState(0);
  // const [toNumber, setToNumber] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  // const [listupdated, setListUpdated] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [searchKeyword, setSearchKeyword] = useState("");
  // const [sortType, setSortType] = useState("sales_plus_customer_status");
  // const [sortOrder, setSortOrder] = useState("desc");
  // const [filterData, saveFilterData] = useState({});
  // const [pendingTitle, setPendingTitle] = useState("Pending"); // State for Tabs Names Pending
  // const [completedTitle, setCompletedTitle] = useState("Completed"); // State for Tabs Names Completed
  // const [searchFrom, setFromDate] = useState(null);
  // const [searchTo, setToDate] = useState(null);
  // const [verifiedSts, setVerifiedStatus] = useState(null);
  // const [collectedSts, setCollectedStatus] = useState(null);

  // const [salesplusstatus, setsalesplusstatus] = useState(0);
  // const [key, setKey] = useState("pending");
  // const [dateModal, setDateModal] = useState(false);
  // const [expectedDate, setExpectedDate] = useState("");
  // const [selectedJobId, setSelectedJobId] = useState(0);
  // const [statusModal, seStatusModal] = useState(false);
  // const [updatePopup, setUpdatePopup] = useState(false);
  // const [salespersons, setsalespersons] = useState([]);
  // const [technicians, settechnicians] = useState([]);
  // const [customers, setcustomers] = useState([]);
  // const [traccarCredentialsPopup, setTraccarCredentialsPopup] = useState(false);
  // const [sendMailPopup, setSendMailPopup] = useState(false);
  // const [sharePopup, setSharePopup] = useState(false);
  // const [selectedType, setSelectedType] = useState("whatsapp");
  // const [schedulePopup, setSchedulePopup] = useState(false);
  // const [isScheduleContactDetails, setScheduleContactDetails] = useState(false);

  // const isInitialMount = useRef(true);

  // const [activeJob, setActiveJob] = useState(false);

  // const [body, setBody] = useState(
  //   RichTextEditor.createValueFromString(MAIL_DEFAULT_BODY, "html")
  // );

  // // Jobs List
  // const jobsListArgs = {
  //   pageIndex: 0,
  //   // searchText: "",
  //   sortBy: 1,
  //   // filterarray: null,
  //   salesplusstatus: "won",
  //   searchFromDate: null,
  //   searchToDate: null,
  //   verifiedStatus: null,
  //   collectedStatus: null,
  // };
  // const getJobsList = useCallback(
  //   async ({
  //     pageIndex,
  //     searchText,
  //     sortBy,
  //     filterarray,
  //     salesplusstatus,
  //     searchFromDate,
  //     searchToDate,
  //     verifiedStatus,
  //     collectedStatus,
  //   }) => {
  //     setIsLoading(true);

  //     const cpage = pageIndex + 1;
  //     setCurrentPage(pageIndex);

  //     if (!searchText) {
  //       searchText = null;
  //     }

  //     if (!searchFromDate) {
  //       searchFromDate = null;
  //     }

  //     if (!searchToDate) {
  //       searchToDate = null;
  //     }

  //     if (!collectedStatus) {
  //       collectedStatus = null;
  //     }

  //     if (!verifiedStatus) {
  //       verifiedStatus = null;
  //     }

  //     setFromDate(searchFromDate);

  //     setToDate(searchToDate);

  //     setVerifiedStatus(verifiedStatus);

  //     setCollectedStatus(collectedStatus);

  //     setSearchKeyword(searchText);

  //     var stype = "";
  //     var sorder = "";

  //     if (sortBy.length > 0) {
  //       setSortType(sortBy[0].id);
  //       stype = sortBy[0].id;

  //       if (sortBy[0].desc) {
  //         setSortOrder("desc");
  //         sorder = "desc";
  //       } else {
  //         setSortOrder("asc");
  //         sorder = "asc";
  //       }
  //     }

  //     saveFilterData(filterarray);

  //     let sortTp = stype ? stype : sortType;
  //     let sortOdr = sorder ? sorder : sortOrder;

  //     try {
  //       const options = {
  //         method: "post",
  //         headers: {
  //           Accept: "application/json, text/plain, */*",
  //           "Content-Type": "application/json",
  //           Xtoken: authToken,
  //         },
  //         body: JSON.stringify(filterarray),
  //       };

  //       console.log(
  //         searchFromDate,
  //         searchToDate,
  //         verifiedStatus,
  //         collectedStatus
  //       );

  //       const url =
  //         API_URL +
  //         "salesplusCustomerlist/" +
  //         sortTp +
  //         "/" +
  //         sortOdr +
  //         "/" +
  //         salesplusstatus +
  //         "/" +
  //         searchText +
  //         "/" +
  //         searchFromDate +
  //         "/" +
  //         searchToDate +
  //         "/" +
  //         verifiedStatus +
  //         "/" +
  //         collectedStatus +
  //         "/all?page=" +
  //         cpage;

  //       const response = await fetch(url, options);

  //       const data = await response.json();

  //       setJobs(data.data.data);

  //       setTotalCount(data.data.total);
  //       // Change here try to find a way to show the pending and completed count deriving from other data
  //       if (salesplusstatus === 0) {
  //         setPendingTitle("Pending (" + data.data.total + ")");

  //         setCompletedTitle("Completed (" + data.statusCount.completed + ")");
  //       } else {
  //         setCompletedTitle("Completed (" + data.data.total + ")");
  //       }

  //       setStatusCount(data.statusCount);

  //       setFromNumber(data.data.from);

  //       setToNumber(data.data.to);

  //       setIsLoading(false);

  //       setListUpdated(false);
  //     } catch {}
  //   },
  //   []
  // );
  // useEffect(() => {
  //   getJobsList(jobsListArgs);
  // }, []);

  // const editorRef = useRef();

  // const { register, handleSubmit, reset } = useForm();

  // const {
  //   register: registerupdate,
  //   handleSubmit: handleSubmitupdate,
  //   reset: resetupdate,
  //   getValues,
  // } = useForm({});

  // const {
  //   register: registercredentials,
  //   handleSubmit: handleSubmitTraccarCredentials,
  // } = useForm({});

  // const {
  //   register: registerMailDetails,
  //   handleSubmit: handleSubmitMailDetails,
  // } = useForm({});

  // const {
  //   register: registerShare,
  //   reset: resetShareDetails,
  //   getValues: getShareValues,
  // } = useForm({});

  // const {
  //   register: registerSchedule,
  //   handleSubmit: handleSubmitSchedule,
  //   reset: resetSchedule,
  //   getValues: getScheduleValues,
  // } = useForm({});

  // // What is completedColumns for ?
  // const completedColumns = useMemo(
  //   () => [
  //     {
  //       Header: "Created Date/Completed Date/Job Id",
  //       accessor: "created_at",
  //       className: "datecolumn",
  //       Cell: ({ row }) => {
  //         return (
  //           <span>
  //             {Moment(row.original.created_at).format("DD-MM-YYYY")}
  //             <br />
  //             <span style={{ color: "red" }}>
  //               {Moment(row.original.sales_plus_completed_date).format(
  //                 "DD-MM-YYYY"
  //               )}
  //             </span>
  //             <br />
  //             {1000 + row.original.sales_plus_id}
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Company/Customer/Phone",
  //       accessor: "sales_plus_company_name",
  //       className: "cuname",
  //       Cell: ({ row }) => {
  //         var cuname = "";
  //         if (
  //           row.original.sales_plus_company_name &&
  //           row.original.sales_plus_company_name.length > 20
  //         ) {
  //           cuname =
  //             row.original.sales_plus_company_name.substring(0, 20) + "...";
  //         } else {
  //           cuname = row.original.sales_plus_company_name;
  //         }

  //         return (
  //           <span
  //             onClick={() => showUpdatePopup(row.original)}
  //             style={{ cursor: "pointer" }}
  //           >
  //             <span style={{ color: "black" }}>
  //               <b>{cuname}</b>
  //             </span>
  //             <br />
  //             <span>
  //               {row.original.sales_plus_customer_name}
  //               <br />
  //               {row.original.sales_plus_phone}&nbsp;
  //               {row.original.sales_plus_address ? (
  //                 <OverlayTrigger
  //                   placement="top"
  //                   overlay={
  //                     <Tooltip id={`tooltip-top`}>
  //                       {row.original.sales_plus_address}
  //                     </Tooltip>
  //                   }
  //                 >
  //                   <i
  //                     className="fas fa-address-book"
  //                     style={{ color: "red", marginRight: "4px" }}
  //                   ></i>
  //                 </OverlayTrigger>
  //               ) : (
  //                 ""
  //               )}
  //               {row.original.sales_plus_accessories ? (
  //                 <OverlayTrigger
  //                   placement="top"
  //                   overlay={
  //                     <Tooltip id={`tooltip-top`}>
  //                       {row.original.sales_plus_accessories}
  //                     </Tooltip>
  //                   }
  //                 >
  //                   <i
  //                     className="fas fa-paperclip"
  //                     style={{ color: "green", marginRight: "4px" }}
  //                   />
  //                 </OverlayTrigger>
  //               ) : (
  //                 ""
  //               )}
  //               {row.original.sales_plus_source === "dealer" ||
  //               row.original.sales_plus_source === "referral" ? (
  //                 <OverlayTrigger
  //                   placement="top"
  //                   overlay={
  //                     <Tooltip id={`tooltip-top`}>
  //                       {row.original.sales_plus_source === "dealer"
  //                         ? "Dealer"
  //                         : "Referral"}
  //                     </Tooltip>
  //                   }
  //                 >
  //                   <Badge
  //                     style={{
  //                       backgroundColor: "#e93446",
  //                       borderRadius: "50%",
  //                       padding: "0.1em 0.15em 0.25em 0.2em",
  //                       verticalAlign: "top",
  //                       marginTop: "0.31em",
  //                       marginRight: "4px",
  //                     }}
  //                   >
  //                     <img
  //                       src={
  //                         row.original.sales_plus_source === "dealer"
  //                           ? dealer
  //                           : referral
  //                       }
  //                       alt="Dealer/Referral"
  //                     />
  //                   </Badge>
  //                 </OverlayTrigger>
  //               ) : (
  //                 ""
  //               )}
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={
  //                   <Tooltip id={`tooltip-top`}>
  //                     {row.original.sales_plus_entry_type === 0
  //                       ? "New"
  //                       : "Existing"}
  //                   </Tooltip>
  //                 }
  //               >
  //                 <Badge
  //                   style={{
  //                     backgroundColor: "#e93446",
  //                     borderRadius: "50%",
  //                     padding: "0.1em 0.15em 0.25em 0.2em",
  //                     verticalAlign: "top",
  //                     marginTop: "0.31em",
  //                     marginRight: "4px",
  //                   }}
  //                 >
  //                   <img
  //                     src={
  //                       row.original.sales_plus_entry_type === 0
  //                         ? newtype
  //                         : existing
  //                     }
  //                     alt="New/Existing"
  //                   />
  //                 </Badge>
  //               </OverlayTrigger>
  //               {row.original.sales_plus_accessories ? (
  //                 <OverlayTrigger
  //                   placement="top"
  //                   overlay={
  //                     <Tooltip id={`tooltip-top`}>
  //                       {row.original.sales_plus_accessories}
  //                     </Tooltip>
  //                   }
  //                 >
  //                   <i
  //                     className="fas fa-paperclip"
  //                     style={{ color: "green", marginRight: "4px" }}
  //                   />
  //                 </OverlayTrigger>
  //               ) : (
  //                 ""
  //               )}
  //             </span>
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Quantity/Sales Person/Value",
  //       accessor: "sales_plus_quantity_new",
  //       className: "quantity",
  //       disableSortBy: true,
  //       Cell: ({ row }) => {
  //         return (
  //           <span>
  //             {row.original.sales_plus_quantity_new > 0 ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>New</Tooltip>}
  //               >
  //                 <Badge variant="primary">
  //                   N {row.original.sales_plus_quantity_new}
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}

  //             {row.original.sales_plus_quantity_migrate > 0 ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>Migration</Tooltip>}
  //               >
  //                 <Badge variant="warning">
  //                   M {row.original.sales_plus_quantity_migrate}
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}

  //             {row.original.sales_plus_quantity_trading > 0 ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>Trading</Tooltip>}
  //               >
  //                 <Badge variant="danger">
  //                   R {row.original.sales_plus_quantity_trading}
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}

  //             {row.original.sales_plus_quantity_service > 0 ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>Service</Tooltip>}
  //               >
  //                 <Badge variant="success">
  //                   S {row.original.sales_plus_quantity_service}
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}
  //             <br />
  //             <span>
  //               {row.original.user_name}
  //               <br />
  //               {row.original.sales_plus_project_value}
  //             </span>
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Scheduler Note",
  //       accessor: "sales_plus_won_note",
  //       className: "note",
  //       disableSortBy: true,
  //       Cell: ({ row }) => {
  //         var note = "";
  //         if (
  //           row.original.sales_plus_won_note &&
  //           row.original.sales_plus_won_note.length > 45
  //         ) {
  //           note = row.original.sales_plus_won_note.substring(0, 45) + "...";
  //         } else {
  //           note = row.original.sales_plus_won_note;
  //         }
  //         return <span>{note}</span>;
  //       },
  //     },
  //     {
  //       Header: "Status Note",
  //       accessor: "customer_comment",
  //       className: "note",
  //       disableSortBy: true,
  //       Cell: ({ row }) => {
  //         var comment = "";
  //         if (
  //           row.original.customer_comment &&
  //           row.original.customer_comment.length > 45
  //         ) {
  //           comment = row.original.customer_comment.substring(0, 45) + "...";
  //         } else {
  //           comment = row.original.customer_comment;
  //         }
  //         return <span>{comment}</span>;
  //       },
  //     },
  //     {
  //       Header: "Status",
  //       accessor: "sales_plus_customer_status",
  //       className: "status",
  //       Cell: ({ row }) => {
  //         return (
  //           <span>
  //             {row.original.sales_plus_customer_status}&nbsp;
  //             <OverlayTrigger
  //               placement="top"
  //               overlay={<Tooltip id={`tooltip-top`}>Update Status</Tooltip>}
  //             >
  //               <Badge
  //                 variant="primary"
  //                 onClick={() => showStatusPopup(row.original)}
  //                 style={{ cursor: "pointer", margin: "0" }}
  //               >
  //                 <i className="fas fa-check-circle" style={{ margin: 0 }}></i>
  //               </Badge>
  //             </OverlayTrigger>
  //             <br />
  //             {row.original.sales_plus_customer_sms !== "0" ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>SMS send</Tooltip>}
  //               >
  //                 <Badge variant="success">
  //                   <i className="fas fa-comment"></i>
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}
  //             {row.original.sales_plus_customer_mail !== "0" ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>Mail send</Tooltip>}
  //               >
  //                 <Badge variant="success">
  //                   <i className="fas fa-envelope"></i>
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}
  //             {row.original.sales_plus_customer_whatsapp !== "0" ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>Whatsapp</Tooltip>}
  //               >
  //                 <Badge variant="success">
  //                   <i className="fab fa-whatsapp"></i>
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       Header: "P",
  //       accessor: "sales_plus_payment_status",
  //       className: "check",
  //       disableSortBy: true,
  //       Cell: ({ row }) => {
  //         var textColor = "";
  //         if (row.original.sales_plus_payment_status === "yes") {
  //           textColor = "green";
  //         } else if (row.original.sales_plus_payment_status === "no") {
  //           textColor = "gray";
  //         }
  //         return (
  //           <OverlayTrigger
  //             placement="top"
  //             overlay={
  //               <Tooltip id={`tooltip-top`}>
  //                 {row.original.sales_plus_payment_status === "yes"
  //                   ? "Payment Verified"
  //                   : "Payment Not Verified"}
  //               </Tooltip>
  //             }
  //           >
  //             <i
  //               className="fas fa-check-square"
  //               style={{ color: textColor, fontSize: "18px" }}
  //             ></i>
  //           </OverlayTrigger>
  //         );
  //       },
  //     },
  //     {
  //       Header: "",
  //       accessor: "buttons",
  //       className: "buttoncolumn",
  //       Cell: ({ row }) => {
  //         return (
  //           <span>
  //             {row.original.sales_plus_traccar_customer_created == 1 ? (
  //               <span>
  //                 <Button
  //                   variant="primary"
  //                   style={{ padding: "6px", margin: "0 2px 2px 0" }}
  //                 >
  //                   <i className="fas fa-sign-in-alt" style={{ margin: 0 }}></i>
  //                 </Button>
  //                 <br />
  //               </span>
  //             ) : (
  //               ""
  //             )}
  //             <Button
  //               variant="success"
  //               onClick={() => showSharePopup(row.original)}
  //               style={{ padding: "6px", margin: "0 2px 2px 0" }}
  //             >
  //               <i className="fas fa-share" style={{ margin: 0 }}></i>
  //             </Button>
  //           </span>
  //         );
  //       },
  //     },
  //   ],
  //   []
  // );

  // // What is this columns for ?
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "Sl",
  //       accessor: "sales_plus_job",
  //       className: "sortordercolumn",
  //       Cell: OrderCell,
  //     },
  //     {
  //       Header: "No.",
  //       accessor: "sales_plus_job_order",
  //       className: "ordercolumn",
  //       Cell: ({ row }) => {
  //         return <span className="joborder">{row.index + 1}</span>;
  //       },
  //     },
  //     {
  //       Header: "Created Date/Job Id",
  //       accessor: "created_at",
  //       className: "datecolumn",
  //       Cell: ({ row }) => {
  //         return (
  //           <span>
  //             {Moment(row.original.created_at).format("DD-MM-YYYY")}
  //             <br />
  //             {/* {1000 + row.original.sales_plus_id} */}
  //             <small>
  //               {Moment().diff(Moment(row.original.created_at), "days")} D
  //             </small>
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Company/Customer/Phone",
  //       accessor: "sales_plus_company_name",
  //       className: "cname",
  //       Cell: ({ row }) => {
  //         var cname = "";
  //         if (
  //           row.original.sales_plus_company_name &&
  //           row.original.sales_plus_company_name.length > 20
  //         ) {
  //           cname =
  //             row.original.sales_plus_company_name.substring(0, 20) + "...";
  //         } else {
  //           cname = row.original.sales_plus_company_name;
  //         }

  //         return (
  //           <span style={{ cursor: "pointer" }}>
  //             <span
  //               onClick={() => showUpdatePopup(row.original)}
  //               style={{ color: "black" }}
  //             >
  //               <b>{cname}</b>
  //             </span>
  //             <br />
  //             <span onClick={() => showUpdatePopup(row.original)}>
  //               <div>
  //                 <span style={{ color: "black" }}>
  //                   {row.original.sales_plus_customer_name}
  //                   <i
  //                     className="fas fa-envelope ml-2"
  //                     style={{
  //                       color:
  //                         row.original.sales_plus_customer_mail == "1"
  //                           ? "#1bd5d2"
  //                           : "#888888",
  //                     }}
  //                   ></i>
  //                 </span>
  //               </div>
  //               {row.original.sales_plus_phone}&nbsp;
  //               {row.original.sales_plus_address ? (
  //                 <OverlayTrigger
  //                   placement="top"
  //                   overlay={
  //                     <Tooltip id={`tooltip-top`}>
  //                       {row.original.sales_plus_address}
  //                     </Tooltip>
  //                   }
  //                 >
  //                   <i
  //                     className="fas fa-address-book"
  //                     style={{ color: "red", marginRight: "4px" }}
  //                   ></i>
  //                 </OverlayTrigger>
  //               ) : (
  //                 ""
  //               )}
  //               {row.original.sales_plus_accessories ? (
  //                 <OverlayTrigger
  //                   placement="top"
  //                   overlay={
  //                     <Tooltip id={`tooltip-top`}>
  //                       {row.original.sales_plus_accessories}
  //                     </Tooltip>
  //                   }
  //                 >
  //                   <i
  //                     className="fas fa-paperclip"
  //                     style={{ color: "green", marginRight: "4px" }}
  //                   />
  //                 </OverlayTrigger>
  //               ) : (
  //                 ""
  //               )}
  //               {row.original.sales_plus_source === "dealer" ||
  //               row.original.sales_plus_source === "referral" ? (
  //                 <OverlayTrigger
  //                   placement="top"
  //                   overlay={
  //                     <Tooltip id={`tooltip-top`}>
  //                       {row.original.sales_plus_source === "dealer"
  //                         ? "Dealer"
  //                         : row.original.sales_plus_source === "referral"
  //                         ? "Referral"
  //                         : ""}
  //                     </Tooltip>
  //                   }
  //                 >
  //                   <Badge
  //                     style={{
  //                       backgroundColor: "#e93446",
  //                       borderRadius: "50%",
  //                       padding: "0.1em 0.15em 0.25em 0.2em",
  //                       verticalAlign: "top",
  //                       marginTop: "0.31em",
  //                       marginRight: "4px",
  //                     }}
  //                   >
  //                     <img
  //                       src={
  //                         row.original.sales_plus_source === "dealer"
  //                           ? dealer
  //                           : row.original.sales_plus_source === "referral"
  //                           ? referral
  //                           : ""
  //                       }
  //                       alt=""
  //                     />
  //                   </Badge>
  //                 </OverlayTrigger>
  //               ) : (
  //                 ""
  //               )}
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={
  //                   <Tooltip id={`tooltip-top`}>
  //                     {row.original.sales_plus_entry_type === 0
  //                       ? "New"
  //                       : "Existing"}
  //                   </Tooltip>
  //                 }
  //               >
  //                 <Badge
  //                   style={{
  //                     backgroundColor: "#e93446",
  //                     borderRadius: "50%",
  //                     padding: "0.1em 0.15em 0.25em 0.2em",
  //                     verticalAlign: "top",
  //                     marginTop: "0.31em",
  //                     marginRight: "4px",
  //                   }}
  //                 >
  //                   <img
  //                     src={
  //                       row.original.sales_plus_entry_type === 0
  //                         ? newtype
  //                         : existing
  //                     }
  //                     alt="New/Existing"
  //                   />
  //                 </Badge>
  //               </OverlayTrigger>
  //             </span>

  //             {/* Implementation  Type */}
  //             <div className="d-flex justify-content-between">
  //               <span className="font-13"> LOCATOR </span>
  //               <JobActionButton
  //                 job={row.original}
  //                 handleCreateLocatorUser={() => {
  //                   setSelectedJobId(row.original.sales_plus_id);

  //                   const confirmBox = window.confirm(
  //                     "Are you sure you want to add this user to traccar?"
  //                   );
  //                   if (confirmBox === true) {
  //                     setTraccarCredentialsPopup(true);
  //                   }
  //                 }}
  //                 handleSendMailToUser={() => {
  //                   setSelectedJobId(row.original.sales_plus_id);

  //                   const confirmBox = window.confirm(
  //                     "Do you want to continue sending the Email?"
  //                   );
  //                   if (confirmBox === true) {
  //                     sendMail(getShareValues());
  //                   }
  //                 }}
  //                 handleCreateSchedule={() => {
  //                   console.log(row.original.sales_plus_person);
  //                   resetSchedule({
  //                     job_customer_id:
  //                       row.original.sales_plus_company_traccar_id,
  //                     name: row.original.sales_plus_company_name,
  //                     job_user: row.original.sales_plus_company_name,
  //                     job_customer_contact:
  //                       row.original.sales_plus_customer_name,
  //                     job_customer_phone: row.original.sales_plus_phone,
  //                     job_sales_person_id: row.original.sales_plus_person,
  //                     job_address: row.original.sales_plus_address,
  //                     job_new: row.original.sales_plus_quantity_new,
  //                     job_migration: row.original.sales_plus_quantity_migrate,
  //                     job_replace: row.original.sales_plus_quantity_trading,
  //                     job_services: row.original.sales_plus_quantity_service,
  //                     job_status: "initiated",
  //                     job_comment: "",
  //                     job_date: "",
  //                     job_technician_id: "",
  //                   });
  //                   setSchedulePopup(true);
  //                 }}
  //                 handleDeleteJob={() =>
  //                   handleDeleteJob(row.original.sales_plus_id)
  //                 }
  //               />
  //             </div>
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Quantity/Sales Person/Value",
  //       accessor: "sales_plus_quantity_new",
  //       className: "quantity",
  //       disableSortBy: true,
  //       Cell: ({ row }) => {
  //         return (
  //           <span>
  //             {row.original.sales_plus_quantity_new > 0 ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>New</Tooltip>}
  //               >
  //                 <Badge variant="primary">
  //                   N {row.original.sales_plus_quantity_new}
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}

  //             {row.original.sales_plus_quantity_migrate > 0 ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>Migration</Tooltip>}
  //               >
  //                 <Badge variant="warning">
  //                   M {row.original.sales_plus_quantity_migrate}
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}

  //             {row.original.sales_plus_quantity_trading > 0 ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>Trading</Tooltip>}
  //               >
  //                 <Badge variant="danger">
  //                   R {row.original.sales_plus_quantity_trading}
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}

  //             {row.original.sales_plus_quantity_service > 0 ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>Service</Tooltip>}
  //               >
  //                 <Badge variant="success">
  //                   S {row.original.sales_plus_quantity_service}
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}
  //             <br />
  //             <span>
  //               {row.original.user_name}
  //               <br />
  //               {row.original.sales_plus_project_value}
  //             </span>
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Scheduler Note",
  //       accessor: "sales_plus_won_note",
  //       className: "note",
  //       disableSortBy: true,
  //       Cell: ({ row }) => {
  //         var note = "";
  //         if (
  //           row.original.sales_plus_won_note &&
  //           row.original.sales_plus_won_note.length > 45
  //         ) {
  //           note = row.original.sales_plus_won_note.substring(0, 45) + "...";
  //         } else {
  //           note = row.original.sales_plus_won_note;
  //         }
  //         return <span>{note}</span>;
  //       },
  //     },
  //     {
  //       Header: "Status Note",
  //       accessor: "customer_comment",
  //       className: "note",
  //       disableSortBy: true,
  //       Cell: ({ row }) => {
  //         var comment = "";
  //         if (
  //           row.original.customer_comment &&
  //           row.original.customer_comment.length > 45
  //         ) {
  //           comment = row.original.customer_comment.substring(0, 45) + "...";
  //         } else {
  //           comment = row.original.customer_comment;
  //         }
  //         return <span>{comment}</span>;
  //       },
  //     },
  //     {
  //       Header: "Expected Time",
  //       accessor: "sales_plus_expected_completion",
  //       className: "expected",
  //       disableSortBy: true,
  //       Cell: ({ row }) => {
  //         if (
  //           formatExpectedDate(row.original.sales_plus_expected_completion) ===
  //           0
  //         ) {
  //           return <span>Today</span>;
  //         } else if (
  //           formatExpectedDate(row.original.sales_plus_expected_completion) > 0
  //         ) {
  //           return (
  //             <span>
  //               <div>
  //                 {Moment(
  //                   row.original.sales_plus_expected_completion,
  //                   "YYYY-MM-DD"
  //                 ).format("DD MMM, YY")}
  //               </div>
  //               <small>
  //                 (In{" "}
  //                 {formatExpectedDate(
  //                   row.original.sales_plus_expected_completion
  //                 )}{" "}
  //                 days)
  //               </small>
  //             </span>
  //           );
  //         } else if (
  //           formatExpectedDate(row.original.sales_plus_expected_completion) < 0
  //         ) {
  //           return (
  //             <span style={{ color: "red" }}>
  //               <div>
  //                 {Moment(
  //                   row.original.sales_plus_expected_completion,
  //                   "YYYY-MM-DD"
  //                 ).format("DD MMM, YY")}
  //               </div>
  //               <small>
  //                 (Due{" "}
  //                 {Math.abs(
  //                   formatExpectedDate(
  //                     row.original.sales_plus_expected_completion
  //                   )
  //                 )}{" "}
  //                 days)
  //               </small>
  //             </span>
  //           );
  //         } else {
  //           return (
  //             <Badge
  //               variant="primary"
  //               onClick={() => {
  //                 setDateModal(true);
  //                 setSelectedJobId(row.original.sales_plus_id);
  //               }}
  //               style={{
  //                 padding: "8px 5px",
  //                 margin: 0,
  //                 fontSize: "80%",
  //                 cursor: "pointer",
  //               }}
  //             >
  //               Not Scheduled
  //             </Badge>
  //           );
  //         }
  //       },
  //     },
  //     {
  //       Header: "Status",
  //       accessor: "sales_plus_customer_status",
  //       className: "status",
  //       Cell: ({ row }) => {
  //         return (
  //           <span>
  //             {row.original.sales_plus_customer_status === "inprogress"
  //               ? "In Progress"
  //               : row.original.sales_plus_customer_status === "onhold"
  //               ? "On Hold"
  //               : row.original.sales_plus_customer_status === "unassigned"
  //               ? "Un Assigned"
  //               : row.original.sales_plus_customer_status}
  //             &nbsp;
  //             <OverlayTrigger
  //               placement="top"
  //               overlay={<Tooltip id={`tooltip-top`}>Update Status</Tooltip>}
  //             >
  //               <Badge
  //                 variant="primary"
  //                 onClick={() => showStatusPopup(row.original)}
  //                 style={{ cursor: "pointer", margin: "0" }}
  //               >
  //                 <i className="fas fa-check-circle" style={{ margin: 0 }}></i>
  //               </Badge>
  //             </OverlayTrigger>
  //             <br />
  //             {row.original.sales_plus_customer_sms !== "0" ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>SMS send</Tooltip>}
  //               >
  //                 <Badge variant="success">
  //                   <i className="fas fa-comment"></i>
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}
  //             {row.original.sales_plus_customer_mail !== "0" ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>Mail send</Tooltip>}
  //               >
  //                 <Badge variant="success">
  //                   <i className="fas fa-envelope"></i>
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}
  //             {row.original.sales_plus_customer_whatsapp !== "0" ? (
  //               <OverlayTrigger
  //                 placement="top"
  //                 overlay={<Tooltip id={`tooltip-top`}>Whatsapp</Tooltip>}
  //               >
  //                 <Badge variant="success">
  //                   <i className="fab fa-whatsapp"></i>
  //                 </Badge>
  //               </OverlayTrigger>
  //             ) : (
  //               ""
  //             )}
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       Header: "P",
  //       accessor: "sales_plus_payment_status",
  //       className: "check",
  //       disableSortBy: true,
  //       Cell: ({ row }) => {
  //         var textColor = "";
  //         if (row.original.sales_plus_payment_status === "yes") {
  //           textColor = "green";
  //         } else if (row.original.sales_plus_payment_status === "no") {
  //           textColor = "gray";
  //         }
  //         return (
  //           <OverlayTrigger
  //             placement="top"
  //             overlay={
  //               <Tooltip id={`tooltip-top`}>
  //                 {row.original.sales_plus_payment_status === "yes"
  //                   ? "Payment Verified"
  //                   : "Payment Not Verified"}
  //               </Tooltip>
  //             }
  //           >
  //             <i
  //               className="fas fa-check-square"
  //               style={{ color: textColor, fontSize: "18px" }}
  //             ></i>
  //           </OverlayTrigger>
  //         );
  //       },
  //     },
  //     {
  //       Header: "",
  //       accessor: "buttons",
  //       className: "buttoncolumn",
  //       Cell: ({ row }) => {
  //         return (
  //           <span>
  //             {row.original.sales_plus_traccar_customer_created === 1 ? (
  //               <span>
  //                 <Button
  //                   variant="primary"
  //                   style={{ padding: "6px", margin: "0 2px 2px 0" }}
  //                 >
  //                   <i className="fas fa-sign-in-alt" style={{ margin: 0 }}></i>
  //                 </Button>
  //                 <br />
  //               </span>
  //             ) : (
  //               ""
  //             )}
  //             {row.original.sales_plus_customer_status !== "unassigned" ? (
  //               <Button
  //                 variant="success"
  //                 onClick={() => showSharePopup(row.original)}
  //                 style={{ padding: "6px", margin: "0 2px 2px 0" }}
  //               >
  //                 <i className="fas fa-share" style={{ margin: 0 }}></i>
  //               </Button>
  //             ) : (
  //               ""
  //             )}
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       Header: "C",
  //       accessor: "sales_plus_completion",
  //       className: "check",
  //       disableSortBy: true,
  //       Cell: ({ row }) => {
  //         return (
  //           <span>
  //             <OverlayTrigger
  //               placement="top"
  //               overlay={
  //                 <Tooltip id={`tooltip-top`}>Completion Status</Tooltip>
  //               }
  //             >
  //               <i
  //                 className="fas fa-check-square"
  //                 onClick={() => {
  //                   const confirmBox = window.confirm("Are you completed?");
  //                   if (confirmBox === true) {
  //                     movetoCompleted(row.original.sales_plus_id);
  //                   }
  //                 }}
  //                 style={{ color: "gray", fontSize: "18px" }}
  //               ></i>
  //             </OverlayTrigger>
  //           </span>
  //         );
  //       },
  //     },
  //   ],
  //   []
  // );

  // const typeRadioHandler = (status) => {
  //   setSelectedType(status);
  // };

  // const sendMail = async (postdata) => {
  //   try {
  //     const options = {
  //       method: "post",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //       body: JSON.stringify(postdata),
  //     };

  //     const url = API_URL + "sendMailnewCustomer/" + selectedJobId;

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     if (data.status === "success") {
  //       setListUpdated(true);

  //       setSharePopup(false);

  //       sweetAlertHandler({
  //         title: "Good job!",
  //         type: "success",
  //         text: "Successfully Send Mail!",
  //       });
  //     } else {
  //       sweetAlertHandler({
  //         title: "Error!",
  //         type: "error",
  //         text: "Error in Sending Mail!",
  //       });
  //     }
  //   } catch {}
  // };

  // const sendSMS = async (postdata) => {
  //   try {
  //     const options = {
  //       method: "post",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //       body: JSON.stringify(postdata),
  //     };

  //     const url = API_URL + "sendSmsnewCustomer/" + selectedJobId;

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     if (data.status === "success") {
  //       setListUpdated(true);

  //       setSharePopup(false);

  //       sweetAlertHandler({
  //         title: "Good job!",
  //         type: "success",
  //         text: "Successfully Send SMS!",
  //       });
  //     } else {
  //       sweetAlertHandler({
  //         title: "Error!",
  //         type: "error",
  //         text: "Error in Sending SMS!",
  //       });
  //     }
  //   } catch {}
  // };

  // const sendWhatsapp = async (postdata) => {
  //   try {
  //     const options = {
  //       method: "post",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //       body: JSON.stringify(postdata),
  //     };

  //     const url = API_URL + "sendWhatsappnewCustomer/" + selectedJobId;

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     if (data.status === "success") {
  //       setListUpdated(true);

  //       setSharePopup(false);

  //       sweetAlertHandler({
  //         title: "Good job!",
  //         type: "success",
  //         text: "Successfully Send WhatsApp!",
  //       });
  //     } else {
  //       sweetAlertHandler({
  //         title: "Error!",
  //         type: "error",
  //         text: "Error in Sending WhatsApp!",
  //       });
  //     }
  //   } catch {}
  // };

  // const showSharePopup = async (rowdata) => {
  //   setSharePopup(true);
  //   setSelectedJobId(rowdata.sales_plus_id);

  //   const jobNumber = 1000 + rowdata.sales_plus_id;

  //   setSelectedType("whatsapp");

  //   resetShareDetails({
  //     sales_plus_message_option: "whatsapp",
  //     sales_plus_email: rowdata.sales_plus_email,
  //     sales_plus_phone: rowdata.sales_plus_phone,
  //     sales_person_phone: rowdata.user_phone,
  //     sales_plus_email_subject:
  //       "Locator: " + rowdata.sales_plus_customer_status + " #" + jobNumber,
  //   });

  //   try {
  //     const options = {
  //       method: "get",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //     };

  //     const url = API_URL + "ViewsinglenewCustomer/" + rowdata.sales_plus_id;

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     resetShareDetails({
  //       ...getShareValues(),
  //       customer_whatsapp_comment: "Here is the job status. " + data.link,
  //       customer_sms_comment: "Here is the job status. " + data.link,
  //       customer_mail_comment: "Here is the job status. " + data.link,
  //     });
  //   } catch {}
  // };

  // const movetoCompleted = async (id) => {
  //   try {
  //     const options = {
  //       method: "get",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //     };

  //     const url = API_URL + "changeCompletionStatus/" + id + "/1";
  //     console.log(url);

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     if (data.status === "success") {
  //       sweetAlertHandler({
  //         title: "Good job!",
  //         type: "success",
  //         text: "Successfully moved!",
  //       });

  //       setListUpdated(true);
  //     } else {
  //       sweetAlertHandler({
  //         title: "Error!",
  //         type: "error",
  //         text: "Error in updating expected date!",
  //       });
  //     }
  //   } catch {}
  // };

  // const addNewSalesJob = () => {
  //   setUpdatePopup(true);
  //   setSelectedJobId(0);

  //   resetupdate({
  //     sales_plus_company_name: "",
  //     sales_plus_customer_name: "",
  //     sales_plus_email: "",
  //     sales_plus_phone: "",
  //     sales_plus_address: "",
  //     sales_plus_person: 0,
  //     sales_plus_quantity_new: "",
  //     sales_plus_quantity_migrate: "",
  //     sales_plus_quantity_trading: "",
  //     sales_plus_quantity_service: "",
  //     sales_plus_source: "",
  //     sales_plus_project_type: "",
  //     sales_plus_implementation_type: "",
  //     sales_plus_project_value: "",
  //     sales_plus_accessories: "",
  //     sales_plus_won_note: "",
  //     sales_plus_payment_collected: "",
  //     sales_plus_customer_invoice: "",
  //     sales_plus_payment_status: false,
  //     sales_plus_job_remarks: "",
  //     customer_comment: "",
  //     sales_plus_traccar_customer_created: 0,
  //     sales_plus_company_traccar_id: 0,
  //   });
  // };

  // const showUpdatePopup = (rowdata) => {
  //   setUpdatePopup(true);
  //   setSelectedJobId(rowdata.sales_plus_id);

  //   resetupdate({
  //     sales_plus_company_name: rowdata.sales_plus_company_name,
  //     sales_plus_customer_name: rowdata.sales_plus_customer_name,
  //     sales_plus_email: rowdata.sales_plus_email,
  //     sales_plus_phone: rowdata.sales_plus_phone,
  //     sales_plus_address: rowdata.sales_plus_address,
  //     sales_plus_person: rowdata.sales_plus_person,
  //     sales_plus_quantity_new: rowdata.sales_plus_quantity_new,
  //     sales_plus_quantity_migrate: rowdata.sales_plus_quantity_migrate,
  //     sales_plus_quantity_trading: rowdata.sales_plus_quantity_trading,
  //     sales_plus_quantity_service: rowdata.sales_plus_quantity_service,
  //     sales_plus_source: rowdata.sales_plus_source,
  //     sales_plus_project_type: "",
  //     sales_plus_implementation_type: "",
  //     sales_plus_project_value: rowdata.sales_plus_project_value,
  //     sales_plus_accessories: rowdata.sales_plus_accessories,
  //     sales_plus_won_note: rowdata.sales_plus_won_note,
  //     sales_plus_payment_collected: rowdata.sales_plus_payment_collected,
  //     sales_plus_customer_invoice: rowdata.sales_plus_customer_invoice,
  //     sales_plus_payment_status:
  //       rowdata.sales_plus_payment_status === "yes" ? true : false,
  //     sales_plus_job_remarks: rowdata.sales_plus_job_remarks,
  //     customer_comment: rowdata.customer_comment,
  //     sales_plus_traccar_customer_created:
  //       rowdata.sales_plus_traccar_customer_created,
  //     sales_plus_company_traccar_id: rowdata.sales_plus_company_traccar_id,
  //   });
  // };

  // const onSubmitUpdate = async (postdata) => {
  //   const updateddata = {
  //     ...postdata,
  //     sales_plus_payment_status:
  //       postdata.sales_plus_payment_status === true ? "yes" : "no",
  //     sales_plus_date: Moment(new Date()).format("DD/MM/YYYY"),
  //     sales_plus_customer_flag: 1,
  //     sales_plus_entry_type: 1,
  //     sales_plus_status: "Won",
  //   };

  //   if (selectedJobId === 0) {
  //     try {
  //       const options = {
  //         method: "post",
  //         headers: {
  //           Accept: "application/json, text/plain, */*",
  //           "Content-Type": "application/json",
  //           Xtoken: authToken,
  //         },
  //         body: JSON.stringify(updateddata),
  //       };

  //       const url = API_URL + "addsalesplus";

  //       const response = await fetch(url, options);

  //       const data = await response.json();

  //       if (data.status === "success") {
  //         setListUpdated(true);

  //         setUpdatePopup(false);

  //         sweetAlertHandler({
  //           title: "Good job!",
  //           type: "success",
  //           text: "Successfully added sales job!",
  //         });
  //       } else {
  //         sweetAlertHandler({
  //           title: "Error!",
  //           type: "error",
  //           text: "Error in adding sales job!",
  //         });
  //       }
  //     } catch {}
  //   } else {
  //     try {
  //       const options = {
  //         method: "post",
  //         headers: {
  //           Accept: "application/json, text/plain, */*",
  //           "Content-Type": "application/json",
  //           Xtoken: authToken,
  //         },
  //         body: JSON.stringify(updateddata),
  //       };

  //       const url = API_URL + "saveJobDetails/" + selectedJobId;

  //       const response = await fetch(url, options);

  //       const data = await response.json();

  //       if (data.status === "success") {
  //         setListUpdated(true);

  //         setUpdatePopup(false);

  //         sweetAlertHandler({
  //           title: "Good job!",
  //           type: "success",
  //           text: "Successfully updated details!",
  //         });
  //       } else {
  //         sweetAlertHandler({
  //           title: "Error!",
  //           type: "error",
  //           text: "Error in updating data!",
  //         });
  //       }
  //     } catch {}
  //   }
  // };

  // const handleScheduleDateChange = (date) => {
  //   resetSchedule({ ...getScheduleValues(), job_date: date });
  // };

  // const onSubmitSchedule = async (postdata) => {
  //   const updateddata = {
  //     ...postdata,
  //     job_date: Moment(new Date(postdata.job_date)).format("YYYY-MM-DD hh:mm"),
  //     job_user_id: 0,
  //   };

  //   try {
  //     const options = {
  //       method: "post",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //       body: JSON.stringify(updateddata),
  //     };

  //     const url = API_URL + "addjob";

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     if (data.status === "success") {
  //       setSchedulePopup(false);

  //       sweetAlertHandler({
  //         title: "Good job!",
  //         type: "success",
  //         text: "Successfully added schedule!",
  //       });
  //     } else {
  //       sweetAlertHandler({
  //         title: "Error!",
  //         type: "error",
  //         text: "Error in adding schedule!",
  //       });
  //     }
  //   } catch {}
  // };

  // const submitMailForm = async (data) => {
  //   try {
  //     if (isEmptyBody()) {
  //       return;
  //     }
  //     var d = {
  //       ...data,
  //       body: body.toString("html"),
  //     };
  //     console.log("data", d);
  //   } catch (error) {
  //     console.log("error...", error);
  //   }
  // };

  // const addUserToTraccar = async (postcredata) => {
  //   try {
  //     const options = {
  //       method: "post",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //       body: JSON.stringify(postcredata),
  //     };

  //     const url = API_URL + "addUserToTraccar/" + selectedJobId;

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     if (data.status === "success") {
  //       setTraccarCredentialsPopup(false);

  //       sweetAlertHandler({
  //         title: "Good job!",
  //         type: "success",
  //         text: "Successfully Added User to Traccar!",
  //       });
  //     } else {
  //       sweetAlertHandler({
  //         title: "Error!",
  //         type: "error",
  //         text: "Error in adding user to traccar!",
  //       });
  //     }
  //   } catch {}
  // };

  // const deleteSalesJob = async () => {
  //   try {
  //     const options = {
  //       method: "get",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //     };

  //     const url = API_URL + "salesplusFlagChange/" + selectedJobId;

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     if (data.status === "success") {
  //       setListUpdated(true);

  //       sweetAlertHandler({
  //         title: "Good job!",
  //         type: "success",
  //         text: "Successfully changed status to deleted!",
  //       });
  //     } else {
  //       sweetAlertHandler({
  //         title: "Error!",
  //         type: "error",
  //         text: "Error in changing status!",
  //       });
  //     }
  //   } catch {}
  // };

  // const handleExpectedDateChange = (date) => {
  //   setExpectedDate(date);
  // };

  // const saveExpectedDate = async () => {
  //   try {
  //     const options = {
  //       method: "post",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //       body: JSON.stringify({ sales_plus_expected_completion: expectedDate }),
  //     };

  //     const url = API_URL + "saveJobDetails/" + selectedJobId;

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     if (data.status === "success") {
  //       sweetAlertHandler({
  //         title: "Good job!",
  //         type: "success",
  //         text: "Successfully updated expected date of completion!",
  //       });

  //       setListUpdated(true);
  //     } else {
  //       sweetAlertHandler({
  //         title: "Error!",
  //         type: "error",
  //         text: "Error in updating expected date!",
  //       });
  //     }

  //     setDateModal(false);
  //   } catch {}
  // };

  // const showStatusPopup = (rowdata) => {
  //   seStatusModal(true);
  //   setSelectedJobId(rowdata.sales_plus_id);
  //   reset({
  //     sales_plus_customer_status: rowdata.sales_plus_customer_status,
  //   });
  // };

  // const onSubmit = async (datarow) => {
  //   try {
  //     const options = {
  //       method: "post",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //       body: JSON.stringify(datarow),
  //     };

  //     const url = API_URL + "saveJobDetails/" + selectedJobId;

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     if (data.status === "success") {
  //       sweetAlertHandler({
  //         title: "Good job!",
  //         type: "success",
  //         text: "Successfully updated status!",
  //       });

  //       setListUpdated(true);
  //     } else {
  //       sweetAlertHandler({
  //         title: "Error!",
  //         type: "error",
  //         text: "Error in updating status!",
  //       });
  //     }

  //     seStatusModal(false);
  //   } catch {}
  // };

  // const getSalesPersonsList = useCallback(async () => {
  //   try {
  //     const options = {
  //       method: "get",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //     };

  //     const url = API_URL + "salesperson";

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     setsalespersons(data.data);
  //   } catch {}
  // }, []);

  // const getTechnicianList = useCallback(async () => {
  //   try {
  //     const options = {
  //       method: "get",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //     };

  //     const url = API_URL + "technicians";

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     settechnicians(data.data);
  //   } catch {}
  // }, []);

  // const getCustomerList = useCallback(async () => {
  //   try {
  //     const options = {
  //       method: "get",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //     };

  //     const url = API_URL + "listcustomersforselect";

  //     const response = await fetch(url, options);

  //     const data = await response.json();

  //     setcustomers(data.data);
  //   } catch {}
  // }, []);

  // useEffect(() => {
  //   getSalesPersonsList();
  //   getCustomerList();
  //   getTechnicianList();
  // }, [getSalesPersonsList, getCustomerList, getTechnicianList]);

  // useEffect(() => {
  //   if (listupdated) {
  //     const sortBy = [
  //       { id: sortType, desc: sortOrder === "desc" ? true : false },
  //     ];
  //     const searchText = searchKeyword;
  //     const pageIndex = currentPage;
  //     const filterarray = filterData;
  //     getJobsList({
  //       pageIndex,
  //       searchText,
  //       sortBy,
  //       filterarray,
  //       salesplusstatus,
  //       searchFrom,
  //       searchTo,
  //       verifiedSts,
  //       collectedSts,
  //     });
  //   }
  // }, [listupdated]);

  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   } else {
  //     setSearchKeyword("");
  //     const searchText = "";
  //     const pageIndex = 0;
  //     const filterarray = filterData;

  //     if (salesplusstatus === 0) {
  //       setSortType("sales_plus_customer_status");
  //       setSortOrder("desc");
  //       const sortBy = [{ id: "sales_plus_customer_status", desc: true }];

  //       getJobsList({
  //         pageIndex,
  //         searchText,
  //         sortBy,
  //         filterarray,
  //         salesplusstatus,
  //         searchFrom,
  //         searchTo,
  //         verifiedSts,
  //         collectedSts,
  //       });
  //     } else {
  //       setSortType("sales_plus_completed_date");
  //       setSortOrder("desc");
  //       const sortBy = [{ id: "sales_plus_completed_date", desc: true }];

  //       getJobsList({
  //         pageIndex,
  //         searchText,
  //         sortBy,
  //         filterarray,
  //         salesplusstatus,
  //         searchFrom,
  //         searchTo,
  //         verifiedSts,
  //         collectedSts,
  //       });
  //     }
  //   }
  // }, [salesplusstatus]);

  // // Reordering Jobs
  // const reorderJobs = (startIndex, endIndex) => {
  //   const newData = [...jobs];
  //   const [movedRow] = newData.splice(startIndex, 1);
  //   newData.splice(endIndex, 0, movedRow);
  //   setJobs(newData);
  // };

  // const updateJobs = async (rowIndex, columnID, newValue) => {
  //   /* Add the new job to the jobs array which is state and map and add the new job */
  //   setJobs((oldData) =>
  //     oldData.map((row, index) => {
  //       if (index === rowIndex) {
  //         return {
  //           ...oldData[rowIndex],
  //           [columnID]: newValue,
  //         };
  //       }
  //       return row;
  //     })
  //   );
  //   try {
  //     const options = {
  //       method: "post",
  //       headers: {
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //         Xtoken: authToken,
  //       },
  //       body: JSON.stringify(jobs),
  //     };
  //     /* update the new jobs to the backend */
  //     const url = API_URL + "UpdateSalesJobOrder";

  //     const response = await fetch(url, options);

  //     const data = await response.json();
  //   } catch {}
  // };

  // const changeSelectedView = (key) => {
  //   setKey(key);

  //   if (key === "pending") {
  //     setsalesplusstatus(0);
  //   } else {
  //     setsalesplusstatus(1);
  //   }
  // };

  // const handleDeleteJob = (id) => {
  //   setSelectedJobId(id);

  //   const confirmBox = window.confirm(
  //     "Are you sure you want to delete this job?"
  //   );
  //   if (confirmBox === true) {
  //     deleteSalesJob();
  //   }
  // };

  // const onDateButtonClick = (types) => {
  //   var currentDate = new Date();

  //   if ("tmw" == types) {
  //     currentDate.setDate(currentDate.getDate() + 1);
  //   } else if ("dat" == types) {
  //     currentDate.setDate(currentDate.getDate() + 2);
  //   }

  //   handleScheduleDateChange(new Date(currentDate));
  // };

  // return (
  //   <React.Fragment>
  //     <Row>
  //       {/* <Col className="p-0">
  //         {isLoading ? <Loader /> : null}
  //         <Tabs activeKey={key} onSelect={(key) => changeSelectedView(key)}>
  //           <Tab eventKey="pending" title={pendingTitle}>
  //             <DynamicTable
  //               columns={columns}
  //               data={jobs}
  //               fromNumber={fromNumber}
  //               toNumber={toNumber}
  //               getJobsList={getJobsList}
  //               totalCount={totalCount}
  //               salesplusstatus={salesplusstatus}
  //               statusCount={statusCount}
  //               updateJobs={updateJobs}
  //               reorderJobs={reorderJobs}
  //               addNewSalesJob={addNewSalesJob}
  //             />
  //           </Tab>
  //           <Tab eventKey="completed" title={completedTitle}>
  //             <CompletedJobsTable
  //               columns={completedColumns}
  //               data={jobs}
  //               fromNumber={fromNumber}
  //               toNumber={toNumber}
  //               getJobsList={getJobsList}
  //               totalCount={totalCount}
  //               salesplusstatus={salesplusstatus}
  //               addNewSalesJob={addNewSalesJob}
  //             />
  //           </Tab>
  //         </Tabs>
  //       </Col> */}
  //       <h1 className="bg-green-500">Sandeep</h1>
  //       {isLoading && <h1>loading...</h1>}
  //     </Row>

  //     {/* Modal for setting Date */}

  //     {/* Modal for setting Status  */}

  //     {/* Modal for Updating the jobs */}

  //     {/* Modal for setting traccar Credentials */}

  //     {/* Modal for sending mail */}

  //     {/* // Modal for sharePopup */}

  //     {/* Modal for setting Schedules */}
  //   </React.Fragment>
  // );
}

export default App;
