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
  Table,
} from "react-bootstrap";

import { jsPDF } from "jspdf";
import { PDFViewer, pdf } from "@react-pdf/renderer";

import "../itc.css";
import moment from "moment";
import ProjectItem, {
  commaSeparateNumber,
  renderImplementationType,
} from "../projects/ProjectItem";
import PostRequest, { API_URL } from "../../../services/PostRequest";
import { showAlert } from "../../../services/alert";

import CertificateTemplate from "../certificates/CertificateTemplate";
import { saveAs } from "file-saver";
import PermitEditForm from "./PermitEditForm";

const AttachmentsPreview = ({ name, file, onDelete }) => {
  return (
    <Card style={{ width: "14rem", margin: 10 }}>
      {file && <Card.Img height={100} width={100} variant="top" src={file} />}
      <Card.Body style={{ padding: 5 }}>
        <Card.Text>{name}</Card.Text>
        <Button onClick={onDelete} size="sm" variant="primary">
          Remove
        </Button>
      </Card.Body>
    </Card>
  );
};

const getStatusAsBool = (active, current) => {
  if (active == current) return true;
  return false;
};

const getStatusAName = (isTrue, active, permitStatus) => {
  if (isTrue) return active;
  return permitStatus;
};

const PermitItem = ({
  permit,
  companies = [],
  onCopyPermit = () => {},
  syncPermits = () => {},
}) => {
  var certificateFields = [
    {
      name: "Certificate No",
      key: "certificateNumber",
      value: permit.certificateNumber,
    },
    {
      name: "Issue Date",
      key: "issueDate",
      value:
        permit.issueDate && permit.issueDate !== ""
          ? moment(permit.issueDate).format("DD MMMM, YYYY")
          : "",
    },
    {
      name: "Expiry Date",
      key: "expiryDate",
      value:
        permit.issueDate && permit.issueDate !== ""
          ? moment(permit.issueDate).add(1, "year").format("DD MMMM, YYYY")
          : "",
    },
    {
      name: "Requested By",
      key: "requestedBy",
      value: "CIVIL DEFENCE",
    },
    {
      name: "Installation Status",
      key: "installationStatus",
      value: permit.installationStatus,
    },
    {
      name: "Company Name",
      key: "companyName",
      value: permit.projectData?.clientName,
    },
    {
      name: "Vehicle Model",
      key: "vehicleModel",
      value: permit.vehicleModel,
    },
    {
      name: "Vehicle Plate No",
      key: "platNumber",
      value: permit.platNumber,
    },
    {
      name: "Chassis No",
      key: "chassisNo",
      value: permit.chassisNo,
    },
    {
      name: "Trailer ID",
      key: "trailerID",
      value: permit.trailerID,
    },
    {
      name: "Trailer Chassis No",
      key: "trailerChassis",
      value: permit.trailerChassis,
    },
    {
      name: "Vehicle Type",
      key: "vehicleType",
      value: permit.vehicleType,
    },
    {
      name: "Device ID",
      key: "deviceID",
      value: permit.deviceID,
    },
    {
      name: "Device Network",
      key: "deviceNetwork",
      value: "4G",
    },
    {
      name: "SIM Card NO",
      key: "simCardNumber",
      value: permit.simCardNumber,
    },
  ];

  const permitForm = useRef();

  const [installationStatus, setInstallationStatus] = useState(
    getStatusAsBool("Installed", permit.installationStatus)
  );
  const [activationStatus, setActivationStatus] = useState(
    getStatusAsBool("Activated", permit.activationStatus)
  );
  const [certificateStatus, setCertificateStatus] = useState(
    getStatusAsBool("Issued", permit.certificateStatus)
  );

  const [permitStatus, setPermitStatus] = useState(
    getStatusAsBool("Issued", permit.permitStatus)
  );

  const [paymentStatus, setPaymentStatus] = useState(
    getStatusAsBool("Issued", permit.permitPaymentStatus)
  );

  const [currentPermit, setCurrentPermit] = useState(permit);

  const [isDeleted, setIsDeleted] = useState(false);

  const [certificateModelOpen, setCertificateModelOpen] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  const editPermitFormRef = useRef();
  const [editPermitModelOpen, setEditPermitModelOpen] = useState(false);

  const [showDeviceLogs, setShowDeviceLogs] = useState(false);
  const [deviceLogs, setDeviceLogs] = useState([]);

  const [documentUploadModel, setDocumentUploadModel] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [documents, setDocuments] = useState([]);

  const handleUpdatePermit = async () => {
    const formData = new FormData(permitForm.current);
    const loginUserName = localStorage.getItem("loginUserName");
    for (const [name, value] of formData.entries()) {
      console.log(`${name}: ${value}`);
    }

    const formDataObj = Array.from(formData.entries()).reduce(
      (prev, [name, value]) => ({
        ...prev,
        [name]: value,
      }),
      {}
    );

    formDataObj.permit = permit.id;
    formDataObj.username = loginUserName;
    formDataObj.installationStatus = getStatusAName(
      installationStatus,
      "Installed",
      "Pending"
    );
    formDataObj.activationStatus = getStatusAName(
      activationStatus,
      "Activated",
      "Pending"
    );
    formDataObj.certificateStatus = getStatusAName(
      certificateStatus,
      "Issued",
      "Pending"
    );
    formDataObj.permitStatus = getStatusAName(
      permitStatus,
      "Issued",
      "Pending"
    );
    formDataObj.permitPaymentStatus = getStatusAName(
      paymentStatus,
      "Paid",
      "Not Paid"
    );

    if (permit.isCopy) {
      try {
        formDataObj.project = permit.project;
        formDataObj.company = permit.company;
        const responseData = await PostRequest(
          "/itc/permit/create",
          formDataObj
        );
        showAlert({
          title: "Permits Created",
          type: "success",
          text: "Successfully created permit!",
        });
        syncPermits(permit, responseData);
      } catch (error) {
        alert(error);
      }
    } else {
      try {
        var response = await PostRequest("/itc/permit/update", formDataObj);
        setCurrentPermit(response);
        showAlert({
          title: "Permits Updated",
          type: "success",
          text: "Successfully updated permit!",
        });
        syncPermits(permit, response, false);
      } catch (error) {
        console.log("error", error);
        alert(error);
      }
    }
  };

  const handleEditPermitForm = async () => {
    const formData = new FormData(editPermitFormRef.current);

    const formDataObj = Array.from(formData.entries()).reduce(
      (prev, [name, value]) => ({
        ...prev,
        [name]: value,
      }),
      {}
    );

    try {

      console.log('formDataObj',formDataObj)

      if (formDataObj.project == "") throw new Error("Please select Project");
      formDataObj.permit = permit.id;
      const responseData = await PostRequest(
        "/itc/permit/update",
        formDataObj,
        "editePermit"
      );
      setCurrentPermit(responseData);
      setEditPermitModelOpen(false);
      showAlert({
        title: "Permits Edited",
        type: "success",
        text: "Successfully edited permit!",
      });
      // loadPermits()
    } catch (error) {
      alert(error);
    }
  };


  const handleUploadDocuments = async (e) => {
    
    const data = new FormData();
    data.append("permit", permit.id);
    selectedFiles.map(f => {
        data.append("documents", f);
    })

    try {
      const documentUploadResponse = await PostRequest(
        "/itc/permit/upload-document",
        data,
        "uploadDocumentButton",
        true
      );

      // showAlert({
      //   title: "Documents Uploaded Successfully",
      //   type: "success",
      // });

      // Update Document List
      var cloneDocumentList = [...documents];
      cloneDocumentList = cloneDocumentList.concat(documentUploadResponse);
      setDocuments(cloneDocumentList);
      setSelectedFiles([]);
      setPreviewUrls([]);



    } catch (error) {
      console.log("Error", error);
      showAlert({ title: "Oops!", type: "error", text: error });
    } 
  };

  const renderEditPermitModel = () => {
    return (
      <Modal
        size="lg"
        centered
        show={editPermitModelOpen}
        onHide={() => setEditPermitModelOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Edit Permit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form ref={editPermitFormRef} className="itc-form">
            <PermitEditForm companies={companies} permit={currentPermit} />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setEditPermitModelOpen(false)}
          >
            Close
          </Button>
          <Button
            onClick={handleEditPermitForm}
            size="sm"
            id="editePermit"
            variant="primary"
          >
            Edit Permit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handlePermitDelete = async () => {
    if (window.confirm("Are you sure you want to delete permit?")) {
      const data = {
        permit: permit.id,
      };

      try {
        await PostRequest("/itc/permit/delete", data);

        showAlert({
          title: "Permits Deleted",
          type: "success",
          text: "Successfully deleted permit!",
        });

        setIsDeleted(true);
      } catch (error) {
        console.log("error", error);
        alert(error);
      }
    }
  };

  const handleChangeCertificate = (e, index) => {
    certificateFields[index].value = e.target.value;
  };

  const handleCopyCancel = () => {
    setIsDeleted(true);
  }

  const renderCertificateModel = () => {
    return (
      <Modal
        size="lg"
        centered
        show={certificateModelOpen}
        onHide={() => setCertificateModelOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Manage Certificate Fields</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {certificateFields.map((field, index) => (
            <Form.Group key={index} controlId={field.key}>
              <Form.Label>{field.name}</Form.Label>
              <Form.Control
                name={field.key}
                type="text"
                onChange={(e) => handleChangeCertificate(e, index)}
                defaultValue={field.value}
                placeholder={`Enter ${field.name}`}
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCertificateModelOpen(false)}
          >
            Close
          </Button>
          <Button
            onClick={handleDownloadCertificate}
            size="sm"
            variant="primary"
          >
            Download Certificate
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handleDeleteDocument = (i) => {

    if(window.confirm('Are you sure you want to delete this attachment?')) {
      
      try {

        const cloneOfDocument = [...documents];
        cloneOfDocument.splice(i,1);
        setDocuments(cloneOfDocument);

        // update in db

        PostRequest("/itc/permit/update", {
          permit : permit.id,
          documentAttachments:JSON.stringify(cloneOfDocument) 
        });
        
      } catch (error) {
        
      }

    }

  }

  const renderDocumentUploadModel = () => {
    return (
      <Modal
        size="lg"
        centered
        show={documentUploadModel}
        onHide={() => setDocumentUploadModel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6> Upload New Document </h6>
          <Row>
            <Col md="12">
              <Form.Group>
                <Form.Label>Attachments</Form.Label>
                <div className="custom-file">
                  <Form.Control
                    multiple
                    onChange={fileSelectedHandler}
                    type="file"
                    className="custom-file-input"
                    id="validatedCustomFile"
                  />
                  <Form.Label
                    className="custom-file-label"
                    htmlFor="validatedCustomFile"
                  >
                    Choose file...
                  </Form.Label>
                </div>
              </Form.Group>

              {previewUrls.length > 0 && (
                <div className="d-flex p-2">
                  {previewUrls.map((fileObj, index) => (
                    <React.Fragment key={fileObj.file.name}>
                      {fileObj.url && (
                        <AttachmentsPreview
                          name={fileObj.file.name}
                          file={fileObj.url}
                          onDelete={() => removeFile(index)}
                        />
                      )}
                      {!fileObj.url && (
                        <AttachmentsPreview
                          name={fileObj.file.name}
                          file={false}
                          onDelete={() => removeFile(index)}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </Col>
          </Row>

          <hr className="mt-5" />
          <h6 className="mb-3"> Uploaded Documents </h6>
          <Row>
            <Col md="12">
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Document Name</th>
                    <th>View</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    documents.map((d,i) =>  (<tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>{d.name}</td>
                      <td> <a target="__blank" href={ API_URL + '/itc/permit/document/' + d.fileName}> View </a> </td>
                      <td>
                        <button onClick={ () => handleDeleteDocument(i) } className="btn btn-sm btn-danger"> Delete </button>
                      </td>
                    </tr>)
                  )}
                 
                  {documents.length == 0 && <tr>
                    <td  className="text-center" colSpan={4}> No any documents Uploaded.</td>
                  </tr>}
                 
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setDocumentUploadModel(false)}
          >
            Close
          </Button>
          <Button
            onClick={handleUploadDocuments}
            size="sm"
            id="uploadDocumentButton"
            variant="primary"
          >
            Upload Document
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };


  const renderDeviceLogs = () => {
    return (
      <Modal
        size="lg"
        centered
        show={showDeviceLogs}
        onHide={() => setShowDeviceLogs(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Device ID Logs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md="12">
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Logs</th>
                  </tr>
                </thead>
                <tbody>
                {
                    deviceLogs.map((d,i) =>  (<tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>{d.message}</td>
                    </tr>)
                  )}
                 
                  { deviceLogs.length == 0 && <tr>
                    <td  className="text-center" colSpan={4}> No any device logs found.</td>
                  </tr>}
                 
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowDeviceLogs(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const fileSelectedHandler = (event) => {
    const files = Array.from(event.target.files);

    const fileUrls = files.map((file) => ({
      file,
      url: file.type.includes("image") ? URL.createObjectURL(file) : null,
    }));

    setSelectedFiles([...selectedFiles, ...files]);
    setPreviewUrls([...previewUrls, ...fileUrls]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);

    const updatedUrls = [...previewUrls];
    updatedUrls.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
  };

  const handleDownloadCertificate = async () => {
    // const htmlString = CertificateTemplate();

    const blob = await pdf(
      <CertificateTemplate certificateFields={certificateFields} />
    ).toBlob();

    saveAs(blob, `${permit.projectData.clientName}_${permit.platNumber}.pdf`);
  };

  const handleInputValueChange = (e) => {
    var clone = { ...currentPermit };
    clone[e.target.name] = e.target.value;
    setCurrentPermit(clone);
  };



  useEffect(() => {
    setInstallationStatus(
      getStatusAsBool("Installed", permit.installationStatus)
    );
    setActivationStatus(getStatusAsBool("Activated", permit.activationStatus));
    setCertificateStatus(getStatusAsBool("Issued", permit.certificateStatus));
    setPermitStatus(getStatusAsBool("Issued", permit.permitStatus));
    setPaymentStatus(getStatusAsBool("Paid", permit.permitPaymentStatus));
    setCurrentPermit(permit);



    try {
      setDocuments(JSON.parse(permit.documentAttachments))

      if(permit.deviceLogs){
        setDeviceLogs(JSON.parse(permit.deviceLogs).reverse())
      }
      
      // console.log('permit.documentAttachments',documents)

    } catch (error) {
      // console.log('Error',error)
    }

  }, [permit]);

  const loginUserId = localStorage.getItem("loginUserId");

  if (isDeleted) return null;

  return (
    <React.Fragment>
      {/* 
    <PDFViewer style={{ height : 500, width : 500 }}>
        <CertificateTemplate />
    </PDFViewer> */}

      {renderCertificateModel()}

      {renderDocumentUploadModel()}

      {renderDeviceLogs()}

      <div className={permit.isCopy ? "permit-copy" : ""}>
        <div className="row ml-0">
          <div className="col-8 summary-card">
            {!showProjectDetails && (
              <Row className="my-1">
                <div className="col-12">
                  <span className="badge badge-dark">
                    Sales Date :{" "}
                    {moment(currentPermit.projectData?.salesDate).format(
                      "MMMM DD, YYYY"
                    )}{" "}
                  </span>
                  <span className="badge badge-warning ml-2">
                    Quantity : {currentPermit.projectData?.quantity}
                  </span>
                  <span className="badge badge-info ml-2">
                    Price : AED{" "}
                    {commaSeparateNumber(currentPermit.projectData?.pricing)}
                  </span>
                  <span className="badge badge-dark ml-2">
                    CreatedAt :{" "}
                    {moment(currentPermit.createdAt).format(
                      "DD/MM/YY"
                    )}{" "}
                  </span>
                  <span className="badge badge-primary ml-2">
                    Trade No. : { currentPermit.projectData?.tradeNumber ? currentPermit.projectData?.tradeNumber : '-'}
                  </span>
                </div>
              </Row>
            )}
            <Row className="mt-2 mb-1">
              <div className="col-12">
                {showProjectDetails ? (
                  <div className="project-cart-details">
                    <ProjectItem
                      project={{
                        ...currentPermit.projectData,
                        companyData: currentPermit.permitCompanyData,
                      }}
                      index={false}
                    />
                  </div>
                ) : (
                  <>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top`}>Locator Client</Tooltip>
                      }
                    >
                      <span
                        className="badge badge-danger pointer"
                        onClick={
                          !permit.isCopy
                            ? () => setEditPermitModelOpen(true)
                            : null
                        }
                      >
                        {
                          currentPermit.permitCompanyData
                            ?.sales_plus_company_name
                        }
                      </span>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top`}>
                          Implementation Type
                        </Tooltip>
                      }
                    >
                      <span className="badge badge-secondary ml-2">
                        {currentPermit.projectData?.implementationType}
                      </span>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top`}>Sales Person</Tooltip>
                      }
                    >
                      <span className="badge badge-secondary ml-2">
                        {currentPermit.projectData?.salePerson}
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top`}>ITC Company Name</Tooltip>
                      }
                    >
                      <span className="badge badge-secondary ml-2">
                        {currentPermit.projectData?.clientName}
                      </span>
                    </OverlayTrigger>
                  </>
                )}
              </div>
              <div
                className="col-12 text-end font-10 pointer"
                onClick={() => setShowProjectDetails(!showProjectDetails)}
              >
                {showProjectDetails ? "Hide" : "Show"} More?
              </div>
            </Row>
          </div>

          <div className="col-4">
            <div className="d-flex align-items-center justify-content-between">
              <div className="mb-2">
                <Form.Group className="d-inline">
                  <div className="checkbox d-inline checkbox-fill checkbox-primary">
                    <Form.Control
                      type="checkbox"
                      onChange={() =>
                        setInstallationStatus(!installationStatus)
                      }
                      name="permit"
                      id={`installation_${currentPermit.id}`}
                      checked={installationStatus}
                    />
                    <Form.Label
                      htmlFor={`installation_${currentPermit.id}`}
                      className="cr"
                    >
                      Installation
                    </Form.Label>
                  </div>
                  <div className="status-update">
                    {currentPermit.installationStatusUpdate}
                  </div>
                </Form.Group>
              </div>
              <div className="mb-2">
                <Form.Group className="d-inline">
                  <div className="checkbox d-inline checkbox-fill checkbox-primary">
                    <Form.Control
                      type="checkbox"
                      onChange={() => setActivationStatus(!activationStatus)}
                      name="permit"
                      id={`activation_${currentPermit.id}`}
                      checked={activationStatus}
                    />
                    <Form.Label
                      htmlFor={`activation_${currentPermit.id}`}
                      className="cr"
                    >
                      Activation
                    </Form.Label>
                  </div>
                  <div className="status-update">
                    {currentPermit.activationStatusUpdate}
                  </div>
                </Form.Group>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="mb-2">
                <Form.Group className="d-inline">
                  <div className="checkbox d-inline checkbox-fill checkbox-primary">
                    <Form.Control
                      type="checkbox"
                      onChange={() => setCertificateStatus(!certificateStatus)}
                      name="permit"
                      id={`certificate_${currentPermit.id}`}
                      checked={certificateStatus}
                    />
                    <Form.Label
                      htmlFor={`certificate_${currentPermit.id}`}
                      className="cr"
                    >
                      Certification
                    </Form.Label>
                  </div>
                  <div className="status-update">
                    {currentPermit.certificateStatusUpdate}
                  </div>
                </Form.Group>
              </div>

              <div className="mb-2">
                <Form.Group className="d-inline">
                  <div className="checkbox d-inline checkbox-fill checkbox-primary">
                    <Form.Control
                      type="checkbox"
                      onChange={() => setPermitStatus(!permitStatus)}
                      name="permit"
                      id={`permit_${currentPermit.id}`}
                      checked={permitStatus}
                    />
                    <Form.Label
                      htmlFor={`permit_${currentPermit.id}`}
                      className="cr"
                    >
                      Permit
                    </Form.Label>
                  </div>
                  <div className="status-update">
                    {currentPermit.permitStatusUpdate}
                  </div>
                </Form.Group>
              </div>

              {/* ONLY FOR  celine */}
              <div className="mb-2">
                <Form.Group className="d-inline">
                  <div className="checkbox d-inline checkbox-fill checkbox-primary">
                    <Form.Control
                      type="checkbox"
                      onChange={() =>
                        loginUserId == 7
                          ? setPaymentStatus(!paymentStatus)
                          : null
                      }
                      name="permitPaymentStatus"
                      id={`permitPaymentStatus_${currentPermit.id}`}
                      checked={paymentStatus}
                      disabled={loginUserId == 7 ? false : true}
                    />
                    <Form.Label
                      htmlFor={`permitPaymentStatus_${currentPermit.id}`}
                      className="cr"
                    >
                      Payment
                    </Form.Label>
                  </div>
                  <div className="status-update">
                    {currentPermit.permitPaymentStatusUpdate}
                  </div>
                </Form.Group>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between permit-action-buttons">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Save</Tooltip>}
              >
                <Button
                  onClick={handleUpdatePermit}
                  className="text-capitalize mr-0"
                  variant="success"
                  style={{
                    height: 40,
                    width: 40,
                    textAlign: "center",
                    padding: 0,
                  }}
                >
                  <i
                    className="far fa-file"
                    style={{ margin: 0, fontSize: 18, marginTop: 3 }}
                  ></i>
                </Button>
              </OverlayTrigger>
              <br />
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Download File</Tooltip>}
              >
                <Button
                  onClick={() => setCertificateModelOpen(true)}
                  className="text-capitalize mr-0"
                  variant="primary"
                  style={{
                    height: 40,
                    width: 40,
                    textAlign: "center",
                    padding: 0,
                  }}
                >
                  <i className="fa fa-download" style={{ margin: 0 }}></i>
                </Button>
              </OverlayTrigger>
              <br />
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}> {permit.isCopy ? 'Cancel Copy' : 'Copy'} </Tooltip>}
              >
                <Button
                  onClick={() => permit.isCopy ? handleCopyCancel() : onCopyPermit(permit)}
                  className="text-capitalize mr-0"
                  variant="warning"
                  style={{
                    height: 40,
                    width: 40,
                    textAlign: "center",
                    padding: 0,
                  }}
                >
                  <i className={ permit.isCopy ? "fa fa-times" : "fa fa-copy" } style={{ margin: 0 }}></i>
                </Button>
              </OverlayTrigger>
              <br />
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Documents Upload</Tooltip>}
              >
                <Button
                  onClick={() => setDocumentUploadModel(!documentUploadModel)}
                  className="text-capitalize mr-0"
                  variant="secondary"
                  style={{
                    height: 40,
                    width: 40,
                    textAlign: "center",
                    padding: 0,
                  }}
                >
                  <i className="fa fa-upload" style={{ margin: 0 }}></i>
                </Button>
              </OverlayTrigger>
              <br />
              {loginUserId == 7 && (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-top`}>Permanent Delete</Tooltip>
                  }
                >
                  <Button
                    onClick={handlePermitDelete}
                    className="text-capitalize mr-0"
                    variant="danger"
                    style={{
                      height: 40,
                      width: 40,
                      textAlign: "center",
                      padding: 0,
                    }}
                  >
                    <i className="fa fa-trash" style={{ margin: 0 }}></i>
                  </Button>
                </OverlayTrigger>
              )}
            </div>
          </div>
        </div>

        <form ref={permitForm}>
          <div className="row form-group mt-3">
            <div className="col-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Chassis ID</Tooltip>}
              >
                <input
                  key={currentPermit.id}
                  type="text"
                  className="form-control"
                  placeholder="Chassis ID"
                  required
                  name="chassisNo"
                  value={currentPermit.chassisNo}
                  onChange={handleInputValueChange}
                />
              </OverlayTrigger>
            </div>
            <div className="col-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Trailer ID</Tooltip>}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Trailer ID"
                  required
                  name="trailerID"
                  value={currentPermit.trailerID}
                  onChange={handleInputValueChange}
                />
              </OverlayTrigger>
            </div>
            <div className="col-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Vehicle Modal</Tooltip>}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Vehicle Modal"
                  required
                  name="vehicleModel"
                  value={currentPermit.vehicleModel}
                  onChange={handleInputValueChange}
                />
              </OverlayTrigger>
            </div>
            <div className="col-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Vehicle Type</Tooltip>}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Vehicle Type"
                  required
                  name="vehicleType"
                  value={currentPermit.vehicleType}
                  onChange={handleInputValueChange}
                />
              </OverlayTrigger>
            </div>
            <div className="col-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Plate No</Tooltip>}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Plate No:"
                  required
                  name="platNumber"
                  value={currentPermit.platNumber}
                  onChange={handleInputValueChange}
                />
              </OverlayTrigger>
            </div>
            <div className="col-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>SIM</Tooltip>}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="SIM"
                  required
                  name="simCardNumber"
                  value={currentPermit.simCardNumber}
                  onChange={handleInputValueChange}
                />
              </OverlayTrigger>
            </div>
          </div>

          <div className="row form-group mt-2">
            <div className="col-2">
              <div className="d-flex align-items-center">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Device ID</Tooltip>}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Device ID"
                    required
                    name="deviceID"
                    value={currentPermit.deviceID}
                    onChange={handleInputValueChange}
                  />
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Device Logs </Tooltip>}
                >
                  <span onClick={() => setShowDeviceLogs(true)} className="permit-device-log-icon">
                    <i className="fa fa-eye " aria-hidden="true"></i>
                  </span>
                </OverlayTrigger>
              </div>
            </div>

            <div className="col-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Device Model</Tooltip>}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Device Model"
                  required
                  name="deviceModel"
                  value={currentPermit.deviceModel}
                  onChange={handleInputValueChange}
                />
              </OverlayTrigger>
            </div>

            <div className="col-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Device Type</Tooltip>}
              >
                <select
                  className="form-control"
                  placeholder="Device Type"
                  required
                  name="deviceType"
                  onChange={handleInputValueChange}
                  style={{ height: 34 }}
                  value={currentPermit.deviceType}
                >
                  <option value={"New Device"}> New Device </option>
                  <option value={"Existing Device"}> Existing Device </option>
                  <option value={"Verify"}> Verify </option>
                </select>
              </OverlayTrigger>
            </div>

            <div className="col-2">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>Implementation Type</Tooltip>
                }
              >
                <select
                  className="form-control"
                  placeholder="Implementation Type"
                  required
                  name="implementationType"
                  onChange={handleInputValueChange}
                  style={{ height: 34 }}
                  value={currentPermit.implementationType}
                >
                  <option value={"ASATEEL"}> ASATEEL </option>
                  <option value={"LOCATOR+ASATEEL"}> LOCATOR+ASATEEL </option>
                </select>
              </OverlayTrigger>
            </div>

            <div className="col-2">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>Registration Expire</Tooltip>
                }
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Registration Expire"
                  required
                  name="registrationExpire"
                  value={currentPermit.registrationExpire}
                  onChange={handleInputValueChange}
                />
              </OverlayTrigger>
            </div>

            <div className="col-2">
              <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Remarks</Tooltip>}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Remarks"
                    name="remarks"
                    value={currentPermit.remarks}
                    onChange={handleInputValueChange}
                  />
                </OverlayTrigger>
            </div>

           
          </div>
          
        </form>

        {renderEditPermitModel()}

        <hr style={{ borderTopWidth: 2.5 }} />
      </div>
    </React.Fragment>
  );
};

export default React.memo(PermitItem);
