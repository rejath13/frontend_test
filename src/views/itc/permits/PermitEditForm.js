import React, { useEffect, useState } from "react";
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

const PermitEditForm = (props) => {
  const { companies = [], permit } = props;

  const [selectedCompany, setSelectedCompany] = useState(false);
  const [selectedProject, setSelectedProject] = useState(false);

  // console.log(selectedProject);

  const [showProjectDetails, setShowProjectDetails] = useState(false);

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
          <label> Location : {data?.sales_plus_region} </label>
        </div>
      </div>
      <div className="col-4 text-right">
        <div className="font-12">
          <label> Customer : {data?.sales_plus_customer_name} </label>
        </div>
      </div>
      </div>
  );

  const formatOptionLabelProject = ({ value, label, data }) => (
    <div className="row">
      <div className="col-4 formatOptionLabel">
        <b> {data?.clientName} </b>
      </div>
      <div className="col-3">
        <div className="font-12">
          <label> Sales Date : {moment(label).format('DD MMM, YYYY')} </label>
        </div>
      </div>
      <div className="col-3">
        <div className="font-12">
          <label> Sales Person : {data?.salePerson} </label>
        </div>
      </div>
      <div className="col-2 text-right">
        <div className="font-12">
          <label> Quantity : {data?.quantity} </label>
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

      finalProject.sort((a,b)=> (a.data.clientName > b.data.clientNam ? 1 : -1))


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

  useEffect(() => {
    var index = companies.findIndex((c) => c.sales_plus_id == permit.company)
    if(index != -1) setSelectedCompany({ value: companies[index].sales_plus_id, label: companies[index].sales_plus_company_name, data: companies[index] })
    setSelectedProject(permit.projectData.id)
    // setSelectedProject({ value: permit.projectData.id, label: permit.projectData.salesDate, data: permit.projectData })
    loadProject({
        company: companies[index].sales_plus_id
      });
  }, [permit])

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
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
              value={selectedCompany || false}
              placeholder="Select Company"
            />
          </Form.Group>

          {selectedCompany && (
            <Form.Group controlId="project" className="mb-3">
              {/* <Select
                className="basic-single"
                classNamePrefix="select"
                name="project"
                onChange={handleProjectChange}
                options={projects}
                value={selectedProject || false}
                formatOptionLabel={formatOptionLabelProject}
                placeholder="Select ITC Project"
              /> */}
              <select 
                value={selectedProject || false}
                // value={selectedProject}
                onChange={handleProjectChange}
                name="project"
                className="form-control">

                  <option value={''}> Select ITC Project </option>
                  {projects.map((projectK,id) => <option key={id} value={projectK.value}> {projectK.data?.clientName} [ Sales Date : {moment(projectK.label).format('DD MMM, YYYY')}, Sales Person : {projectK.data?.salePerson}, Quantity : {projectK.data?.quantity}] </option>)}

              </select>
            </Form.Group>
          )}
        </Col>
      </Row>

    </React.Fragment>
  );
};

export default PermitEditForm;
