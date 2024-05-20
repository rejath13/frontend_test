import React, { useEffect, useRef, useState } from "react";
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

import "../itc.css";

import moment from "moment";
import Select from "react-select";
import { editFieldModalData } from "./project-options-data";
import { showAlert } from "../../../services/alert";
import PostRequest from "../../../services/PostRequest";
import ProjectAddEditForm from "./ProjectAddEditForm";
import ProjectEditForm from "./ProjectEditForm";

const loginUserId = localStorage.getItem('loginUserId');

export function commaSeparateNumber(val) {

  if (!val) return "-";

  // remove sign if negative
  var sign = 1;
  if (val < 0) {
    sign = -1;
    val = -val;
  }

  // trim the number decimal point if it exists
  let num = val.toString().includes(".")
    ? val.toString().split(".")[0]
    : val.toString();

  while (/(\d+)(\d{3})/.test(num.toString())) {
    // insert comma to 4th last position to the match number
    num = num.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }

  // add number after decimal point
  if (val.toString().includes(".")) {
    num = num + "." + val.toString().split(".")[1];
  }

  // return result with - sign if negative
  return sign < 0 ? "-" + num : num;
}

const ProjectItem = (props) => {
  const { project, onCompanyEdited = null, loadProjects = null, loadPermits = null, companies = [], salesPersons = [], loadCompanies = () => { } } = props;

  const editFieldFormRef = useRef()
  const editCompanyFormRef = useRef()
  const editProjectFormRef = useRef();

  const [projectData, setProjectData] = useState(project)

  const [editFieldModalOpen, setEditFieldModelOpen] = useState(false);
  const [editProjectModalOpen, setEditProjectModelOpen] = useState(false);
  const [modalFieldName, setModalFieldName] = useState("Project Status")
  const [isEditCompanyModal, setEditCompanyModal] = useState(false)

  const toggleEditCompanyModal = () => setEditCompanyModal(!isEditCompanyModal)

  const [isDeleted, setIsDeleted] = useState(false);

  const handleSubmitModalForm = async (e) => {

    try {

      const formData = new FormData(editFieldFormRef.current);
      e.preventDefault();

      const formDataObj = Array.from(formData.entries()).reduce((prev, [name, value]) => ({
        ...prev,
        [name]: value
      }), {});

      formDataObj['projectId'] = project?.id
      const responseData = await PostRequest('/itc/project/edit', formDataObj, "editProject");

      setEditFieldModelOpen(false)
      showAlert({ title: 'Project Edited', type: 'success', text: 'Successfully edited project!' })
      if (loadProjects) loadProjects()
      if (loadPermits) loadPermits()
    } catch (error) {
      alert(error)
    }

  }

  const handleSubmitEditCompanyForm = async (e) => {
    try {

      const formData = new FormData(editCompanyFormRef.current);
      e.preventDefault();

      const formDataObj = Array.from(formData.entries()).reduce((prev, [name, value]) => ({
        ...prev,
        [name]: value
      }), {});

      formDataObj['sales_plus_id'] = project?.companyData?.sales_plus_id
      const responseData = await PostRequest('/itc/company/update', formDataObj, "editCompany");

      toggleEditCompanyModal()
      showAlert({ title: 'Company Edited', type: 'success', text: 'Successfully edited company!' })
      if (onCompanyEdited) onCompanyEdited()
    } catch (error) {
      alert(error)
    }
  }

  const renderEditFieldModel = () => {
    return (
      <Modal
        size="lg"
        centered
        show={editFieldModalOpen}
        onHide={() => setEditFieldModelOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Edit {modalFieldName}</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmitModalForm} ref={editFieldFormRef} className="itc-form">
          <Modal.Body>

            <Row>
              <Col>
                <Form.Group controlId={editFieldModalData[modalFieldName]['name']}>
                  <Form.Label>{modalFieldName}</Form.Label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name={editFieldModalData[modalFieldName]['name']}
                    options={editFieldModalData[modalFieldName]['options']}
                    defaultValue={{ label: project[editFieldModalData[modalFieldName]['name']], value: project[editFieldModalData[modalFieldName]['name']] }}
                    placeholder={`Select ${modalFieldName}`}
                  />
                </Form.Group>
              </Col>
            </Row>

          </Modal.Body>
          <Modal.Footer>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditFieldModelOpen(false)}
            >
              Close
            </Button>
            <Button type="submit" size="sm" id="editProject" variant="primary">Save Changes</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  };

  const renderEditCompanyModal = () => {
    return <Modal
      size="lg"
      centered
      show={isEditCompanyModal}
      onHide={toggleEditCompanyModal}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">Edit Company</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmitEditCompanyForm} ref={editCompanyFormRef} className="itc-form">
        <Modal.Body>

          <Row>
            <Col md="6">
              <Form.Group controlId="sales_plus_company_name">
                <Form.Label>Locator Client <span className="required">*</span></Form.Label>
                <Form.Control
                  name="sales_plus_company_name"
                  required
                  type="text"
                  placeholder=""
                  defaultValue={project?.companyData?.sales_plus_company_name || ''}
                />
              </Form.Group>
            </Col>

            <Col md="6">
              <Form.Group controlId="itc_username">
                <Form.Label>Person Name</Form.Label>
                <Form.Control
                  name="sales_plus_customer_name"
                  type="text"
                  placeholder=""
                  defaultValue={project?.companyData?.sales_plus_customer_name || ''}
                />
              </Form.Group>
            </Col >

            <Col md="6">
              <Form.Group controlId="itc_username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="itc_username"
                  type="text"
                  placeholder=""
                  defaultValue={project?.companyData?.itc_username || ''}
                />
              </Form.Group>
            </Col >

            <Col md="6">
              <Form.Group controlId="itc_password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="itc_password"
                  type="text"
                  placeholder=""
                  defaultValue={project?.companyData?.itc_password || ''}
                />
              </Form.Group>
            </Col>

            <Col md="12">
              <Form.Group controlId="sales_plus_region">
                <Form.Label>Region</Form.Label>
                <Form.Control
                  name="sales_plus_region"
                  type="text"
                  placeholder=""
                  defaultValue={project?.companyData?.sales_plus_region || ''}
                />
              </Form.Group>
            </Col>
          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleEditCompanyModal}
          >
            Close
          </Button>
          {/* onClick={handleAddProjectForm} */}
          <Button type="submit" size="sm" id="editCompany" variant="primary">Save Changes</Button>
        </Modal.Footer>
      </form>
    </Modal>
  }

  const openModal = (field) => {
    setModalFieldName(field)
    setEditFieldModelOpen(true)
  }

  const renderLeadStatus = () => {
    switch (projectData.leadSource) {
      case "Door to Door":
        return (
          <div className="itc-project-badge lead-door-to-door">
            {" "}
            {projectData.leadSource}
          </div>
        );
      case "Referral":
        return (
          <div className="itc-project-badge lead-referral">
            {" "}
            {projectData.leadSource}{" "}
          </div>
        );
      case "Company Lead":
        return (
          <div className="itc-project-badge lead-company-lead">
            {" "}
            {projectData.leadSource}{" "}
          </div>
        );
      case "Cold Calling":
        return (
          <div className="itc-project-badge lead-cold-calling">
            {" "}
            {projectData.leadSource}{" "}
          </div>
        );
      case "Dealer":
        return (
          <div className="itc-project-badge lead-dealer">
            {" "}
            {projectData.leadSource}{" "}
          </div>
        );
      default:
        return (
          <div className="itc-project-badge badge-dark ">
            {" "}
            {projectData.leadSource}{" "}
          </div>
        );
    }
  };

  const leadType = () => {
    switch (projectData.leadType) {
      case "New":
        return <div className="itc-project-badge lead-type-new"> New Lead</div>;
      case "Migration":
        return (
          <div className="itc-project-badge lead-migration"> Migration </div>
        );
      case "Existing Customer":
        return (
          <div className="itc-project-badge lead-type-existing-customer">
            {" "}
            Existing Customer{" "}
          </div>
        );
      default:
        return (
          <div className="itc-project-badge badge-dark ">
            {" "}
            {projectData.leadType}{" "}
          </div>
        );
    }
  };

  const renderImplementationType = () => {
    switch (projectData.implementationType) {
      case "LOCATOR":
        return (
          <div className="itc-project-badge implementationType-locator">
            {" "}
            {projectData.implementationType}{" "}
          </div>
        );
      case "LOCATOR+ASATEEL":
      case "DUAL":
      case "LOCATOR+SECUREPATH":
        return (
          <div className="itc-project-badge implementationType-dual">
            {" "}
            {projectData.implementationType}{" "}
          </div>
        );
      case "ASATEEL":
        return (
          <div className="itc-project-badge implementationType-ASATEEL">
            {" "}
            {projectData.implementationType}{" "}
          </div>
        );
      case "RASID":
        return (
          <div className="itc-project-badge implementationType-RASID">
            {" "}
            {projectData.implementationType}{" "}
          </div>
        );
      default:
        return (
          <div className="itc-project-badge badge-dark ">
            {" "}
            {projectData.implementationType}{" "}
          </div>
        );
    }
  };

  const renderProjectStatus = () => {
    switch (projectData.projectStatus) {
      case "New":
      case "Account Created":
        return (
          <div className="itc-project-badge project-status-new">
            {" "}
            {projectData.projectStatus}{" "}
          </div>
        );
      case "Traffic File Added":
        return (
          <div className="itc-project-badge project-status-file-added">
            {" "}
            {projectData.projectStatus}{" "}
          </div>
        );
      case "On Going Installation":
        return (
          <div className="itc-project-badge project-status-on-going">
            {" "}
            {projectData.projectStatus}{" "}
          </div>
        );
      case "Completed":
        return (
          <div className="itc-project-badge project-status-Completed">
            {" "}
            {projectData.projectStatus}{" "}
          </div>
        );
      default:
        return (
          <div className="itc-project-badge payment-not-paid">
            {" "}
            {projectData.projectStatus}{" "}
          </div>
        );
    }
  };

  const renderProjectStatusBadge = () => {
    switch (projectData.projectStatus) {
      case "New":
      case "Account Created":
        return (
          <span className="itc-project-status-badge project-status-new">
            Status : {" "}
            {projectData.projectStatus}{" "}
          </span>
        );
      case "Traffic File Added":
        return (
          <span className="itc-project-status-badge project-status-file-added">
            Status : {" "}
            {projectData.projectStatus}{" "}
          </span>
        );
      case "On Going Installation":
        return (
          <span className="itc-project-status-badge project-status-on-going">
            Status : {" "}
            {projectData.projectStatus}{" "}
          </span>
        );
      case "Completed":
        return (
          <span className="itc-project-status-badge project-status-Completed">
            Status : {" "}
            {projectData.projectStatus}{" "}
          </span>
        );
      default:
        return (
          <span className="itc-project-status-badge payment-not-paid">
            Status : {" "}
            {projectData.projectStatus}{" "}
          </span>
        );
    }
  };

  const renderPaymentStatus = () => {
    switch (projectData.paymentStatus) {
      case "Paid":
        return <div className="itc-project-badge payment-paid"> Paid </div>;
      default:
        return (
          <div className="itc-project-badge payment-not-paid"> Not Paid </div>
        );
    }
  };

  const renderInvoiceStatus = () => {
    switch (projectData.invoiceStatus) {
      case "Invoiced":
        return (
          <div className="itc-project-badge payment-paid">
            {" "}
            {projectData.invoiceStatus}{" "}
          </div>
        );
      default:
        return (
          <div className="itc-project-badge payment-not-paid">
            {" "}
            {projectData.invoiceStatus}{" "}
          </div>
        );
    }
  };

  const handleEditProjectForm = async (e) => {

    const formData = new FormData(editProjectFormRef.current);
    e.preventDefault();

    const formDataObj = Array.from(formData.entries()).reduce((prev, [name, value]) => ({
      ...prev,
      [name]: value
    }), {});

    formDataObj['projectId'] = projectData.id;

    try {
      if (formDataObj.company == '') throw new Error("Please select Company");
      const responseData = await PostRequest('/itc/project/edit', formDataObj, "updateProject");
      setProjectData(responseData)
      setEditProjectModelOpen(false);
      showAlert({ title: 'Project Updated', type: 'success', text: 'Successfully updated project!' })
      loadCompanies()
      if (loadProjects) loadProjects()
      if (loadPermits) loadPermits()
    } catch (error) {
      alert(error);
    }

  }

  const renderEditProjectModel = () => {
    return (
      <Modal
        size="lg"
        centered
        show={editProjectModalOpen}
        onHide={() => setEditProjectModelOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Edit Project</Modal.Title>
        </Modal.Header>
        <form ref={editProjectFormRef} onSubmit={handleEditProjectForm} className="itc-form">
          <Modal.Body>

            <ProjectEditForm projectData={projectData} companies={companies} salesPersons={salesPersons} />

          </Modal.Body>
          <Modal.Footer>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditProjectModelOpen(false)}
            >
              Close
            </Button>
            <Button type="submit" size="sm" id="updateProject" variant="primary">Edit Project</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  };

  const handleDeleteProject = async () => {

    if (window.confirm('Are you sure you want to delete this project?')) {

      const data = {
        project: projectData.id
      }

      try {
        await PostRequest("/itc/project/delete", data);

        showAlert({
          title: "Project Deleted",
          type: "success",
          text: "Successfully deleted project!",
        });

        setIsDeleted(true)

      } catch (error) {
        console.log("error", error);
        alert(error);
      }

    }


  };

  useEffect(() => {
    setProjectData(project);
  }, [project])

  if (isDeleted) return null;

  return (
    <React.Fragment>
      <React.Fragment>
        <Row className="mb-2">
          <Col md={6}>
            {props.index !== false && <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Project Number</Tooltip>}
            >
              <span className="badge badge-light">#{props.index + 1} </span>
            </OverlayTrigger>
            }

            <span className="badge badge-dark ml-2">
              Sales Date : {moment(projectData.salesDate).format("MMMM DD, YYYY")}{" "}
            </span>
            <span className="badge badge-warning ml-2">
              Quantity : {projectData.quantity}
            </span>
            <span className="badge badge-info ml-2">
              Price : AED {commaSeparateNumber(projectData.pricing)}
            </span>
            {renderProjectStatusBadge()}
            <span className="badge badge-dark ml-2">
              CreatedAt : {moment(projectData.createdAt).format("DD/MM/YY")}{" "}
            </span>
            <span className="badge badge-primary ml-2">
              Trade No. : {projectData.tradeNumber ? projectData.tradeNumber : '-'}
            </span>
          </Col>
          <Col>
            <span className="project-font-title">Sales Person :</span>
            <span className="project-font-label"> {projectData.salePerson}</span>
          </Col>

          <Col>
            <span className="project-font-title">Location :</span>
            <span className="project-font-label">
              {" "}
              {projectData.companyData?.sales_plus_region || ''}
            </span>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col md={6}>
            <span className="project-font-title">Locator Client :</span>
            <span className="project-font-label pointer" onClick={props.isCompanyEditable ? toggleEditCompanyModal : null}>{projectData.companyData?.sales_plus_company_name || ''}</span>
          </Col>
          <Col>
            <span className="project-font-title">ITC Company Name :</span>
            <span className="project-font-label">
              {projectData.clientName}
            </span>
          </Col>
          <Col>
            <span className="project-font-title">Billed To :</span>
            <span className="project-font-label">{projectData.billedTo}</span>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col md={4}>
            <span className="project-font-title"> Notes : </span>
            <span className="project-font-label">{projectData.notes}</span>
          </Col>

          <Col md={8} className="d-flex justify-content-end">
            {/* Lead Source */}

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Lead Status</Tooltip>}
            >
              {/* <div onClick={() => openModal("Lead Status")}> */}
              {renderLeadStatus()}
              {/* </div> */}
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Lead Type</Tooltip>}
            >
              {/* <div onClick={() => openModal("Lead Type")}> */}
              {leadType()}
              {/* </div> */}
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`}>Implementation Type</Tooltip>
              }
            >
              {/* onClick={() => openModal("Implementation Type")} */}
              {/* onClick={() => openModal("Implementation Type")} */}
              <div>
                {renderImplementationType()}
              </div>
            </OverlayTrigger>

            {/* <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Project Status</Tooltip>}
            >
              <div onClick={() => openModal("Project Status")}>
                {renderProjectStatus()}
              </div>
            </OverlayTrigger> */}


            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Invoice Status</Tooltip>}
            >
              <div onClick={() => loginUserId == 7 ? openModal("Invoice Status") : null}>
                {renderInvoiceStatus()}
              </div>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Payment Status</Tooltip>}
            >
              <div onClick={() => loginUserId == 7 ? openModal("Payment Status") : null}>
                {renderPaymentStatus()}
              </div>
            </OverlayTrigger>

            {props.isEditable && <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Edit Project</Tooltip>}
            >
              <Button
                onClick={() => setEditProjectModelOpen(true)}
                className="text-capitalize mr-0"
                variant="primary"
                style={{ height: 26, width: 26, textAlign: 'center', padding: 0 }}
              >
                <i className="fa fa-edit" style={{ margin: 0 }}></i>
              </Button>
            </OverlayTrigger>}

            {loginUserId == 7 && props.isDeletable && <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Permanent Delete</Tooltip>}
            >
              <Button
                onClick={handleDeleteProject}
                className="text-capitalize mr-0"
                variant="danger"
                style={{ height: 26, width: 26, textAlign: 'center', padding: 0, marginLeft: 5 }}
              >
                <i className="fa fa-trash" style={{ margin: 0 }}></i>
              </Button>
            </OverlayTrigger>}

          </Col>
        </Row>
      </React.Fragment>

      {props.index !== false && <hr style={{ borderTopWidth: 2.5 }} />}
      {renderEditFieldModel()}
      {renderEditCompanyModal()}
      {renderEditProjectModel()}
    </React.Fragment>
  );
};

export default ProjectItem;
