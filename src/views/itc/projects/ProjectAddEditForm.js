import React, { useState } from "react";
import {
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  Form,
  Badge,
  OverlayTrigger,
  Tooltip,
  Modal,
  Card,
} from "react-bootstrap";

import Select from "react-select";
import "../itc.css";
import Datetime from "react-datetime";
import moment from 'moment';
import {
  implementationType,
  invoiceStatus,
  leadSource,
  leadType,
  paymentStatus,
  projectStatus,
} from "./project-options-data";
import ReactSelect from "react-select";

const ProjectAddEditForm = (props) => {

  const { companies = [], salesPersons = [] } = props;


  const finalCompanies = companies.map(c => {
    return { value: c.sales_plus_id, label: c.sales_plus_company_name, data: c }
  })

  const [isNewCompany, setIsNewCompany] = useState(false)
  const [salesDate, setSalesDate] = useState(moment(new Date()).format('DD-MM-yyyy'))
  const [selectedCompanyCustomer, setSelectedCompanyCustomer] = useState('');
  const [activeSalesPerson, setActiveSalesPerson] = useState(salesPersons[0]);



  
  const handleSelectedSalesDateChange = (value) => {
    setSalesDate(value.format('DD-MM-YYYY'))
  }

  const formatOptionLabel = ({ value, label, data }) => (
    <div className="row">
      <div className="col-5 formatOptionLabel">
        <b> {label} </b>
      </div>
      <div className="col-3">
        <div className="font-12">
          <label> Location : {data.sales_plus_region} </label>
        </div>
      </div>
      <div className="col-4 text-right">
        <div className="font-12">
          <label> Customer : {data.sales_plus_customer_name} </label>
        </div>
      </div>
    </div>
  );


  return (
    <React.Fragment>
      {!isNewCompany && (
        <Row>
          <Col md={12} className="mb-2">
            <span className="text-muted"> Company Details</span>
          </Col>

          <Col>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="company"
              options={finalCompanies}
              onChange={(d) => {
                setSelectedCompanyCustomer(d.data.sales_plus_customer_name);
                const salespersonData = salesPersons.find( s => s.user_id == d.data.sales_plus_person);
                if(salespersonData){
                  setActiveSalesPerson(salespersonData);
                } else {
                  alert(`${d.label} has sales person id ${d.data.sales_plus_person} but that ID is not exist in sales person table`);
                }

              }}
              formatOptionLabel={formatOptionLabel}
              placeholder="Select Company or Create New Company"
            />
          </Col>
          <Col md="auto">
            <Button onClick={() => setIsNewCompany(!isNewCompany)} size="sm" variant="dark">
              Add New Company
            </Button>
          </Col>
        </Row>
      )}

      {isNewCompany && (
        <React.Fragment>
          <Row>
            <Col className="mb-2">
              <span className="text-muted"> Company Details</span>
            </Col>

            <Col md="auto">
              <Button onClick={() => setIsNewCompany(!isNewCompany)} size="sm" variant="dark">
                Choose from List
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="sales_plus_company_name">
                <Form.Label>Locator Client<span className="required">*</span></Form.Label>
                <Form.Control
                  name="sales_plus_company_name"
                  required
                  type="text"
                  placeholder=""
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="itc_username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="itc_username"
                  type="text"
                  placeholder=""
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="itc_password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="itc_password"
                  type="text"
                  placeholder=""
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="sales_plus_region">
                <Form.Label>Region</Form.Label>
                <Form.Control
                  name="sales_plus_region"
                  type="text"
                  placeholder=""
                />
              </Form.Group>
            </Col>
          </Row>
        </React.Fragment>
      )}

      <input type="hidden" value={isNewCompany} name="isNewCompany" />

      <Row className="mt-4">
        <Col md={12} className="mb-2">
          <span className="text-muted"> Project Details</span>
        </Col>
        <Col>
          <Form.Group controlId="formBasicEmail1">
            <Form.Label>Sales Date</Form.Label>
            <Datetime
              // onChange={()=>{}}
              initialValue={salesDate}
              onChange={handleSelectedSalesDateChange}
              timeFormat={false}
              name=""
              dateFormat={'DD-MM-YYYY'}
              inputProps={{ placeholder: "Select Date" }}
            />
            <input type="hidden" value={salesDate} name="salesDate" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="salePerson">
            <Form.Label>Sale Person</Form.Label>
            <Select
              onChange={(d) => setActiveSalesPerson(d)}
              closeMenuOnSelect={false}
              value={activeSalesPerson}
              name="salePerson"
              getOptionLabel={(option) => option.user_name}
              getOptionValue={(option) => option.user_name}
              options={salesPersons}
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="clientName">
            <Form.Label>ITC Company Name</Form.Label>
            <Form.Control
              name="clientName"
              type="text"
              placeholder=""
              defaultValue={selectedCompanyCustomer}
            />
          </Form.Group>
        </Col>


      </Row>

      <Row>
        <Col>
          <Form.Group controlId="leadSource">
            <Form.Label>Lead Source</Form.Label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="leadSource"
              options={leadSource}
              defaultValue={leadSource[0]}
              placeholder="Select Lead Source"
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="leadType">
            <Form.Label>Lead Type</Form.Label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="leadType"
              options={leadType}
              defaultValue={leadType[0]}
              placeholder="Select Lead Type"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="implementationType">
            <Form.Label>Implementation Type</Form.Label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="implementationType"
              options={implementationType}
              defaultValue={implementationType[0]}
              placeholder="Select implementation"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              name="quantity"
              type="number"
              placeholder=""
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="pricing">
            <Form.Label>Price</Form.Label>
            <Form.Control name="pricing" type="number" placeholder="" />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="projectStatus">
            <Form.Label>Project Status</Form.Label>
            <ReactSelect
              className="basic-single"
              classNamePrefix="select"
              name="projectStatus"
              options={projectStatus}
              defaultValue={projectStatus[0]}
              placeholder="Select Project Status"
            />
          </Form.Group>
        </Col>


      </Row>

      <Row>
        <Col>
          <Form.Group controlId="contactName">
            <Form.Label>Contact Name <span className="required">*</span></Form.Label>
            <Form.Control
              name="contactName"
              required
              type="text"
              placeholder=""
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="contactNumber">
            <Form.Label>Contact Number <span className="required">*</span></Form.Label>
            <Form.Control
              name="contactNumber"
              required
              type="text"
              placeholder=""
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="contactEmail">
            <Form.Label>Contact Email</Form.Label>
            <Form.Control
              name="contactEmail"
              type="email"
              placeholder=""
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>

      <Col>
              
          <Form.Group controlId="tradeNumber">
          <Form.Label>Trade Number</Form.Label>
            <Form.Control
              name="tradeNumber"
              type="text"
              placeholder="Trade Number here"
            />
          </Form.Group>
      </Col>


        <Col>
          <Form.Group controlId="billedTo">
            <Form.Label>Billed To</Form.Label>
            <Form.Control name="billedTo" type="text" placeholder="" />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="notes">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              name="notes"
              type="text"
              placeholder="Write notes here"
            />
          </Form.Group>
        </Col>

      </Row>

    </React.Fragment>
  );
};

export default ProjectAddEditForm;
