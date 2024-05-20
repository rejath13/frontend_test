import React, { useState, useCallback, useEffect } from "react";

import {
  Row,
  Col,
  Button,
  Form,
  Modal,
  Table,
  Card,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";

import Select from "react-select";

import DatePicker from "react-datepicker";

import { useForm } from "react-hook-form";

import Moment from "moment";

import { API_URL } from "../../config/constant";

import "./saleplus.css";

import { allImplementationType } from "../itc/projects/project-options-data";

function Salesplusform({ salesId, data, updatesaleplus, closepopup }) {
  const authToken = localStorage.getItem("authToken");
  const [plusid, setPlusId] = useState(salesId);
  const [salespersonList, setsalepersonList] = useState([]);
  const [companyname, setcompanyname] = useState(data.sales_plus_company_name);
  const [lastDealPopup, setlastDealPopup] = useState(null);
  const [lastDealdata, getlastDealdata] = useState([]);
  const [choosenDate, setchoosenDate] = useState(
    new Date(data.sales_plus_date)
  );
  const [meeting, setmeeting] = useState(data.sales_plus_meeting);
  const [renewalDate, setrenewalDate] = useState();
  const [installDate, setinstallDate] = useState();
  const [customers, setCustomers] = useState([]);
  const loginUserId = localStorage.getItem("loginUserId");

  var loginSalesPerson = "";
  var loginSalesPersonPhone = "";

  const getcustomerlist = async () => {
    const options = {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Xtoken: authToken,
      },
    };

    const url = API_URL + "listcustomers";

    const response = await fetch(url, options);

    const data = await response.json();
    setCustomers(data.data);
  };

  const handlechoosenDateChange = (date) => {
    setchoosenDate(new Date(date));
    reset1({
      ...getValues1(),
      sales_plus_date: choosenDate,
    });
  };

  const handleInstDateChange = (date) => {
    if (date) {
      setinstallDate(new Date(date));
    } else {
      setinstallDate();
    }

    reset1({
      ...getValues1(),
      sales_plus_installation: installDate,
    });
  };

  const handleCompanyChange = (e) => {
    var id = e.target.value;
    var data = customers.filter((value) => {
      return value.id == id;
    });
    console.log(data);
    reset1({
      ...getValues1(),
      sales_plus_customer_name: data[0].sales_plus_customer_name,
      sales_plus_phone: data[0].sales_plus_phone,
      sales_plus_email: data[0].sales_plus_email,
      sales_plus_company_name: data[0].name,
      sales_plus_address: data[0].sales_plus_address,
      usertype: data[0].usertype,
      // existing_customer: data[0].usertype === 0 ? 1 : 0,
      sales_plus_traccar_customer_created: data[0].usertype === 0 ? 1 : 0,
      sales_plus_company_traccar_id: data[0].usertype === 0 && data[0].id,
    });

    setcompanyname(data.sales_plus_company_name);
  };

  const handleRenewalDateChange = (date) => {
    setrenewalDate(new Date(date));
    reset1({
      ...getValues1(),
      sales_plus_renewel: renewalDate,
    });
  };

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    reset: reset1,
    getValues: getValues1,
  } = useForm({
    defaultValues: {
      sales_plus_date: Moment(data.sales_plus_date).format("DD-MM-yyyy"),
      sales_plus_source: data.sales_plus_source,
      sales_plus_region: data.sales_plus_region,
      sales_plus_status: data.sales_plus_status,
      sales_plus_implementation_type: data.sales_plus_implementation_type,
      sales_plus_customer_name: data.sales_plus_customer_name,
      sales_plus_company_name: data.sales_plus_company_name,
      // existing_customer: data.existing_customer,
      sales_plus_project_value: data.sales_plus_project_value,
      sales_plus_phone: data.sales_plus_phone,
      sales_plus_email: data.sales_plus_email,
      sales_plus_designation: data.sales_plus_designation,
      sales_plus_quantity_new: data.sales_plus_quantity_new,
      sales_plus_quantity_migrate: data.sales_plus_quantity_migrate,
      sales_plus_quantity_trading: data.sales_plus_quantity_trading,
      sales_plus_quantity_service: data.sales_plus_quantity_service,
      sales_plus_price: data.sales_plus_price,
      sales_plus_installation: data.sales_plus_installation,
      sales_plus_renewel: data.sales_plus_renewel,
      sales_plus_supplier: data.sales_plus_supplier,
      sales_plus_accessories: data.sales_plus_accessories,
      sales_plus_id: data.sales_plus_id,
      sales_plus_comment: data.sales_plus_comment,
      sales_plus_address: data.sales_plus_address,
      sales_plus_person: loginUserId,
      sales_plus_type: data.sales_plus_type,
      actiontype: data.actiontype,
      usertype: -1,
    },
  });

  const editsaleplus = async (saleplus) => {
    try {
      const options = {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
        body: JSON.stringify(saleplus),
      };

      if (plusid != 0) var url = API_URL + "editsalesplus/" + plusid;
      else var url = API_URL + "addsalesplus";
      const response = await fetch(url, options);

      const data1 = await response.json();

      if (data1.status === "success") {
        sweetAlertHandler({
          title: "Good job!",
          type: "success",
          text: data1.data,
        });
        resetcustomerdata(data);
        updatesaleplus();
        //closepopup();
      } else {
        sweetAlertHandler({
          title: "Error!",
          type: "error",
          text: "Error in updating !",
        });
      }
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

      setsalepersonList(data.data);

      loginSalesPerson = salespersonList.filter((value) => {
        return value.user_id == loginUserId;
      });
      loginSalesPersonPhone = loginSalesPerson[0].user_phone;
      console.log(loginSalesPerson[0]);
    } catch {}
  }, []);

  const saveSalesPlusCustomer = async () => {
    reset1({
      ...getValues1(),
      sales_plus_customer_flag: 1,
    });
    editsaleplus(getValues1());
  };

  const checkContactSalesperson = async () => {
    if (companyname != null) {
      const options = {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Xtoken: authToken,
        },
      };

      const url = API_URL + "checkContactSalesperson/" + companyname;

      const response = await fetch(url, options);

      const dealdata = await response.json();
      getlastDealdata(dealdata.data);
      setlastDealPopup(true);
    }
  };

  const fnmeeting = (e) => {
    var checked = e.target.checked;
    if (checked) {
      reset1({
        ...getValues1(),
        sales_plus_meeting: 1,
      });
      setmeeting(1);
    } else {
      reset1({
        ...getValues1(),
        sales_plus_meeting: 0,
      });
      setmeeting(0);
    }
  };

  const changepersonname = (e) => {
    reset1({
      ...getValues1(),
      sales_plus_person: e.target.key,
    });
  };

  const changecompanyname = (e) => {
    setcompanyname(e.target.value);
  };

  const resetcustomerdata = (data) => {
    setcompanyname("");

    reset1({
      sales_plus_address: "",
      sales_plus_comment: "",
      sales_plus_company_name: "",
      // existing_customer: 0,
      sales_plus_customer_name: "",
      sales_plus_designation: "",
      sales_plus_email: "",
      sales_plus_id: "",
      sales_plus_person: loginUserId,
      sales_plus_phone: "",
      sales_plus_price: "",
      sales_plus_project_value: "",
      sales_plus_quantity_migrate: "",
      sales_plus_quantity_new: "",
      sales_plus_quantity_trading: "",
      sales_plus_quantity_service: "",
      sales_plus_supplier: "",
      sales_plus_accessories: "",
      sales_plus_type: "new",
      sales_plus_implementation_type: "",
      usertype: -1,
    });
  };

  useEffect(() => {
    getSalesPersonsList();
    getcustomerlist();
  }, [plusid]);

  const SpinnerLoader = () => (
    <span
      style={{
        position: "absolute",
        display: "block",
        right: "50px",
        top: "35px",
        zIndex: "200",
      }}
    >
      <i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
    </span>
  );

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#f4f7fa",
      height: "43px",
    }),
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

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      //title: alert.title,
      icon: "success",
      text: alert.text,
      type: alert.type,
    });
  };

  return (
    <>
      <div className="App">
        <Modal.Header closeButton>
          <Modal.Title as="h5">Sales Plus Form</Modal.Title>
          <h6 className="m-0 ml-2" style={{ lineHeight: "1.8" }}>
            - {Moment(choosenDate).format("DD-MM-yyyy")}
          </h6>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>
          <Card style={{ margin: 0 }}>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <Form onSubmit={handleSubmit1(editsaleplus)}>
                    <Row>
                      <Col md={2}>
                        <Form.Label>Source:</Form.Label>
                        <Form.Control
                          as="select"
                          {...register1("sales_plus_source")}
                        >
                          <option value="">Select Source</option>

                          <option value="cold call">Cold Call</option>

                          <option value="referal">Referal</option>

                          <option value="company lead">Company Lead</option>

                          <option value="dealer">Dealer</option>

                          <option value="door to door">Door to Door</option>

                          <option value="MECAF2019">MECAF 2019</option>
                        </Form.Control>
                      </Col>

                      <Col md={2}>
                        <Form.Label>Region:</Form.Label>
                        <Form.Control
                          as="select"
                          {...register1("sales_plus_region")}
                        >
                          <option value="">Select Region</option>

                          <option value="Sharjah">Sharjah</option>

                          <option value="Dubai">Dubai</option>

                          <option value="Abu Dhabi">Abu Dhabi</option>

                          <option value="Ajman">Ajman</option>

                          <option value="Fujairah">Fujairah</option>

                          <option value="Ras Al Khaimah">Ras Al Khaimah</option>

                          <option value="Umm Al Quwain">Umm Al Quwain</option>
                        </Form.Control>
                      </Col>

                      <Col md={2}>
                        <Form.Label>Status:</Form.Label>
                        <Form.Control
                          as="select"
                          {...register1("sales_plus_status")}
                        >
                          <option value="">Select status</option>
                          <option value="New">New Lead</option>
                          <option value="Proposed">Proposed</option>
                          <option value="PartiallyWon">Partially Won</option>
                          <option value="Won">Won</option>
                          <option value="Hold">Hold</option>
                          <option value="Lost">Lost</option>
                          <option value="Completed">Completed</option>
                          <option value="Duplicate">Duplicate</option>
                          <option value="Demo">Demo</option>
                          <option value="MigrationCheck">
                            Check for Migration
                          </option>
                        </Form.Control>
                      </Col>

                      <Col md={2}>
                        <Form.Label>Implementation Type:</Form.Label>
                        <Form.Control
                          as="select"
                          {...register1("sales_plus_implementation_type")}
                        >
                          <option value="">Select Implementation Type</option>
                          {allImplementationType.map((type, i) => (
                            <option key={i} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>

                      <Col md={2}>
                        <Form.Label>Price:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Price Details"
                          {...register1("sales_plus_price")}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>Project Value:</Form.Label>
                        <Form.Control
                          rows="1"
                          style={{ marginBottom: "10px" }}
                          placeholder="Project Value"
                          {...register1("sales_plus_project_value")}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>Customer: </Form.Label>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <select
                            name="job_customer"
                            as="select"
                            value={companyname}
                            onChange={handleCompanyChange}
                            className="form-control"
                          >
                            <option value="None">Select Customer</option>
                            {customers &&
                              customers.map((person) => (
                                <option
                                  key={person.id}
                                  value={person.id}
                                  className={
                                    person.usertype === 0 ? "text-primary" : ""
                                  }
                                >
                                  {person.email}
                                </option>
                              ))}
                          </select>
                          <span className="text-success">
                            {getValues1("usertype") === 0
                              ? " (From Customers)"
                              : getValues1("usertype") > 0
                              ? " (From Deals)"
                              : ""}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md={4} className="pr-0">
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Customer Name"
                          {...register1("sales_plus_company_name")}
                          onChange={(e) => changecompanyname(e)}
                          className="d-inline-block"
                          style={{ width: "82%" }}
                        />

                        <button
                          className="btn btn-danger m-0 ml-2 d-inline-block"
                          style={{ padding: "10px" }}
                          type="button"
                          onClick={() => resetcustomerdata(data)}
                        >
                          <i
                            className="feather icon-refresh-cw"
                            style={{ margin: 0, fontSize: "16px" }}
                          ></i>
                        </button>
                      </Col>

                      <Col md={1}>
                        <Form.Label>Existing:</Form.Label>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              Existing Customer
                            </Tooltip>
                          }
                        >
                          <div className="checkbox d-inline checkbox-success">
                            <Form.Control
                              type="checkbox"
                              name="existing_customer"
                              id="danger-checkbox-5"
                              {...register1("existing_customer")}
                            />
                            <Form.Label
                              htmlFor="danger-checkbox-5"
                              className="cr"
                            ></Form.Label>
                          </div>
                        </OverlayTrigger>
                      </Col>

                      {/* <Col md={1}>
                                                <Form.Label>Existing:</Form.Label>
                                                <OverlayTrigger
                                                    placement='top'
                                                    overlay={<Tooltip id={`tooltip-top`}>Existing Customer</Tooltip>}
                                                >
                                                    <div className="checkbox d-inline checkbox-success">
                                                        <Form.Control type="checkbox" name="existing_customer" id="danger-checkbox-5"  {...register1('existing_customer')} />
                                                        <Form.Label htmlFor="danger-checkbox-5" className="cr"></Form.Label>
                                                    </div>
                                                </OverlayTrigger>
                                            </Col> */}

                      <Col md={2}>
                        <Form.Label>Contact Name:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Contact Name"
                          {...register1("sales_plus_customer_name")}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Label>Phone:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Phone"
                          {...register1("sales_plus_phone")}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                          style={{ marginBottom: "10px" }}
                          rows="1"
                          placeholder="Email"
                          {...register1("sales_plus_email")}
                        />
                      </Col>

                      <Col md={2} className="mb-2">
                        <Form.Label>Designation:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Designation"
                          {...register1("sales_plus_designation")}
                        />
                      </Col>

                      <Col md={4}>
                        <Form.Label>Address:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Address"
                          {...register1("sales_plus_address")}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>New Qty:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="New Quantity"
                          {...register1("sales_plus_quantity_new")}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>Migrate Qty:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Migrate Quantity"
                          {...register1("sales_plus_quantity_migrate")}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>Trading Qty:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Trading Quantity"
                          {...register1("sales_plus_quantity_trading")}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>Service Qty:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Service Quantity"
                          {...register1("sales_plus_quantity_service")}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>Sales Type:</Form.Label>
                        <Form.Control
                          as="select"
                          {...register1("sales_plus_type")}
                        >
                          <option value="">Select Sales Type</option>

                          <option value="new">New Device</option>

                          <option value="migrate">Migrate</option>

                          <option value="trading">Trading</option>

                          <option value="new-migrate">
                            New Device and Migrate
                          </option>

                          <option value="new-trading">
                            New Device and Trading
                          </option>

                          <option value="migrate-trading">
                            Migrate and Trading
                          </option>

                          <option value="new-migrate-trading">
                            New Device and Migrate and Trading
                          </option>
                        </Form.Control>
                      </Col>

                      <Col md={2}>
                        <Form.Label>Supplier:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Supplier Name"
                          {...register1("sales_plus_supplier")}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>Install Date:</Form.Label>
                        <DatePicker
                          placeholderText="Install Date"
                          selected={installDate}
                          onChange={handleInstDateChange}
                          className="form-control"
                          dateFormat="dd-MM-yyyy"
                          isClearable={true}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>Renewal Date:</Form.Label>
                        <DatePicker
                          placeholderText="Renewal Date"
                          selected={renewalDate}
                          onChange={handleRenewalDateChange}
                          className="form-control"
                          dateFormat="dd-MM-yyyy"
                          isClearable={true}
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Label>Accessories If Any:</Form.Label>
                        <Form.Control
                          rows="1"
                          placeholder="Accessories"
                          {...register1("sales_plus_accessories")}
                        />
                      </Col>

                      {(loginUserId == 1 || loginUserId == 14) && (
                        <Col md={3}>
                          <Form.Label>Sales Person:</Form.Label>
                          <Form.Control
                            as="select"
                            {...register1("sales_plus_person")}
                          >
                            <option value="None">Select sales person</option>
                            {salespersonList &&
                              salespersonList.map((person) => (
                                <option
                                  selected={
                                    getValues1("sales_plus_person") ==
                                    person.user_id
                                  }
                                  key={person.user_id}
                                  value={person.user_id}
                                >
                                  {person.user_name}
                                </option>
                              ))}
                          </Form.Control>
                        </Col>
                      )}

                      <Col
                        md={loginUserId == 1 || loginUserId == 14 ? "9" : "12"}
                      >
                        <Form.Label>Comment:</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows="2"
                          placeholder="Comment"
                          {...register1("sales_plus_comment")}
                        />
                      </Col>

                      <Col md={12} className="text-right mt-3">
                        <button
                          type="submit"
                          className="text-capitalize btn btn-success"
                        >
                          SAVE
                        </button>

                        {(data.sales_plus_status == "Won" ||
                          data.sales_plus_status == "Completed") && (
                          <a
                            target="_blank"
                            href={
                              "https://api.whatsapp.com/send?phone=" +
                              loginSalesPersonPhone +
                              "&text=New Job Created " +
                              "%0aCompany name : " +
                              data.sales_plus_company_name +
                              "%0aCustomer name : " +
                              data.sales_plus_customer_name +
                              "%0aContact Phone : " +
                              data.sales_plus_phone +
                              "%0aProject Value : " +
                              data.sales_plus_project_value +
                              "%0aLead Source : " +
                              data.sales_plus_source +
                              "%0aSales Person : " +
                              data.user_name +
                              "%0aPayment : " +
                              data.sales_plus_payment_status +
                              "%0aNote to scheduler : " +
                              data.sales_plus_won_note
                                ? data.sales_plus_won_note
                                : ""
                            }
                            type="submit"
                            class="btn btn-primary"
                            style={{
                              "pointer-events":
                                data.sales_plus_customer_flag == 1
                                  ? "none"
                                  : "auto",
                            }}
                            onClick={() => {
                              const confirmBox = window.confirm(
                                "Are you sure you want to save as new Customer ?"
                              );
                              if (confirmBox === true) {
                                saveSalesPlusCustomer(data);
                              }
                            }}
                          >
                            {data.sales_plus_customer_flag == 1 ? (
                              <>
                                <i class="fa fa-check"></i>
                                <span>Job Created</span>
                              </>
                            ) : (
                              <>
                                <i class="fa fa-times"></i>
                                <span>Create as a job</span>
                              </>
                            )}
                          </a>
                        )}

                        {((data.sales_plus_status == "Won" &&
                          data.sales_plus_customer_flag == 1) ||
                          (data.sales_plus_status == "Completed" &&
                            data.sales_plus_customer_flag == 1)) && (
                          <a
                            target="_blank"
                            href={
                              "https://api.whatsapp.com/send?phone=" +
                              loginSalesPersonPhone +
                              "&text=New Job Created " +
                              "%0aCompany name : " +
                              data.sales_plus_company_name +
                              "%0aCustomer name : " +
                              data.sales_plus_customer_name +
                              "%0aContact Phone : " +
                              data.sales_plus_phone +
                              "%0aProject Value : " +
                              data.sales_plus_project_value +
                              "%0aLead Source : " +
                              data.sales_plus_source +
                              "%0aSales Person : " +
                              data.user_name +
                              "%0aPayment : " +
                              data.sales_plus_payment_status +
                              "%0aNote to scheduler : " +
                              data.sales_plus_won_note
                            }
                            type="submit"
                            class="btn btn-warning"
                          >
                            <span>
                              Share <i class="fa fa-share"></i>
                            </span>
                          </a>
                        )}
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
      </div>

      <Modal
        size="xl"
        show={lastDealPopup}
        onHide={() => setlastDealPopup(false)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Last Deal </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>
          <Table
            responsive
            style={{ border: "1px solid #eaeaea", borderTop: "none" }}
          >
            <thead>
              <tr>
                <th> Company Name</th>
                <th>Customer Name </th>
                <th> Sales Person</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lastDealdata &&
                lastDealdata.map((item, index) => (
                  <tr>
                    <th>{item.sales_plus_company_name}</th>
                    <th>{item.sales_plus_customer_name}</th>
                    <th>{item.user_name}</th>
                    <th>{item.sales_plus_source}</th>
                    <th>{item.sales_plus_status}</th>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Salesplusform;
