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

import moment from "moment";
import PostRequest from "../../../services/PostRequest";
import ProjectItem from "../projects/ProjectItem";
import { implementationType } from "../projects/project-options-data";

const PermitAddEditForm = (props) => {
  const { companies = [] } = props;

  const [selectedCompany, setSelectedCompany] = useState(false);
  const [selectedProject, setSelectedProject] = useState(false);

  const [showProjectDetails, setShowProjectDetails] = useState(false);
  
  const [isNewProject, setIsNewProject] = useState(false);

  const [projects, setProjects] = useState([]);

  const finalCompanies = companies.map((c) => {
    return { value: c.sales_plus_id, label: c.sales_plus_company_name, data: c }
  });

  const formatOptionLabel = ({ value, label, data }) => (
    <div className="row">
      <div className="col-6 formatOptionLabel">
        <b> {label} </b>
      </div>
      <div className="col-2">
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

  const formatOptionLabelProject = ({ value, label, data }) => (
    <div className="row">
      <div className="col-4 formatOptionLabel">
        <b> {data.clientName} </b>
      </div>
      <div className="col-3">
        <div className="font-12">
          <label> Sales Date : {moment(label).format('DD MMM, YYYY')} </label>
        </div>
      </div>
      <div className="col-3">
        <div className="font-12">
          <label> Sales Person : {data.salePerson} </label>
        </div>
      </div>
      <div className="col-2 text-right">
        <div className="font-12">
          <label> Quantity : {data.quantity} </label>
        </div>
      </div>
      </div>
  );


  const loadProject = async (data = {}) => {
    try {
      const projectsResponse = await PostRequest('/itc/projects', data);

      var finalProject = projectsResponse.map((c) => {
        return { value: c.id, label: c.salesDate, data: c };
      });

      setProjects(finalProject);
    } catch (error) {
      console.log('Error', error);
    }


  }

  const handleOnSelect = (selectedCompany) => {
    try {

      setSelectedCompany(selectedCompany);
      setSelectedProject(false);
      setProjects([]);

      loadProject({
        company: selectedCompany.value
      });


    } catch (error) { }
  };

  const handleProjectChange = (project) => {
    setSelectedProject(project)
  }

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Form.Group controlId="company" className="mb-3">
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="company"
              options={finalCompanies}
              formatOptionLabel={formatOptionLabel}
              onChange={handleOnSelect}
              placeholder="Select Company"
            />
          </Form.Group>
          {selectedCompany && !isNewProject && (
                <Form.Group controlId="project" className="d-flex algin-items-center justify-content-between">
                <div style={{ width : '80%'}}>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="project"
                    onChange={handleProjectChange}
                    options={projects}
                    formatOptionLabel={formatOptionLabelProject}
                    placeholder="Select ITC Project"
                  />
                </div>
                <button onClick={ () => setIsNewProject(true)} type="button" className="btn btn-secondary"> Create New </button>
              </Form.Group>

          )}
        </Col>

      </Row>


      {/* CREATE NEW PROJECT ON GOING */}
      
     {isNewProject  && <div>

        <div className="d-flex justify-content-between algin-items-center">
            <h6> Create New Project </h6>
            <h6 onClick={ () => setIsNewProject(false)}  className="text-muted pointer"> Choose from list? </h6>
        </div>
        

         <hr />
        
          <Row>
              <Col>
                <Form.Group controlId="clientName">
                  <Form.Label>ITC Company Name</Form.Label>
                  <Form.Control
                    name="clientName"
                    type="text"
                    placeholder=""
                    defaultValue={''}
                  />
                  <input type="hidden" name="isNewProject" value={"true"} />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId="implementationType">
                  <Form.Label>Implementation Type</Form.Label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="projectImplementationType"
                    options={implementationType}
                    defaultValue={implementationType[0]}
                    placeholder="Select implementation"
                  />
                </Form.Group>
              </Col>
          </Row>

          <hr />
     </div>
      }


      {(selectedProject || isNewProject) && (
        <React.Fragment>

          {selectedProject &&  <div className="text-right mb-3">
            <span className="pointer" onClick={() => setShowProjectDetails(!showProjectDetails)}> {!showProjectDetails ? 'Show Project Details?' : 'Hide Project Details'}  </span>
          </div>
          }

          {showProjectDetails && <div className="project-cart-details">
            <ProjectItem
              project={selectedProject.data}
              index={false} />
          </div>}

          <Row>
            <Col>
              <Form.Group controlId="chassisNo">
                <Form.Control
                  name="chassisNo"
                  type="text"
                  placeholder="Enter Chassis No"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="trailerID">
                <Form.Control
                  name="trailerID"
                  type="text"
                  placeholder="Enter Trailer ID"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="vehicleModel">
                <Form.Control
                  name="vehicleModel"
                  type="text"
                  placeholder="Enter Vehicle Model"
                  required
                />
              </Form.Group>
            </Col>

           
          </Row>

          <Row>
          <Col>
              <Form.Group controlId="vehicleType">
                <Form.Control
                  name="vehicleType"
                  type="text"
                  placeholder="Enter Vehicle Type"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="deviceID">
                <Form.Control
                  name="deviceID"
                  type="text"
                  placeholder="Enter Device ID"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="platNumber">
                <Form.Control
                  name="platNumber"
                  type="text"
                  placeholder="Enter Plat Number"
                  required
                />
              </Form.Group>
            </Col>
           
          </Row>

          <Row>
          <Col>
              <Form.Group controlId="simCardNumber">
                <Form.Control
                  name="simCardNumber"
                  type="text"
                  placeholder="Enter Vehicle SIM Card Number"
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="deviceModel">
                <Form.Control
                  name="deviceModel"
                  type="text"
                  placeholder="Device Model"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <select className="form-control"
                  placeholder="Device Type"
                  required
                  name="deviceType">
                    <option selected value={'New Device'}> New Device </option>
                    <option value={'Existing Device'}> Existing Device </option>
                    <option value={'Verify'}> Verify </option>
                </select>
            </Col>

          </Row>

          <Row>

            <Col>
                    <Form.Group controlId="registrationExpire">
                      <Form.Control
                        name="registrationExpire"
                        type="text"
                        placeholder="Registration Expire"
                      />
                    </Form.Group>
                  </Col>

              <Col>
            
                <Form.Group controlId="implementationType">
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

            <Col>
              
              <Form.Group controlId="remarks">
                <Form.Control
                  name="remarks"
                  type="text"
                  placeholder="Remarks here"
                />
              </Form.Group>
          </Col>

           
          </Row>


        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default PermitAddEditForm;
