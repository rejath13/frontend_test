import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { getSingleJob } from "../../../../../store/slices/jobs/jobSlice";
import {
  useGetImplementationTypesQuery,
  useGetSalesPersonsQuery,
  // useGetSourceTypesQuery,
  useUpdateJobMutation,
} from "../../../../../store/api/jobs/jobsApi";
import { capitalizeFirstLetter } from "../../../helpers/job-card-helper";
import { closeModal } from "../../../../../store/slices/jobs/jobsModalSlice";

import "./EditJobContent.scss";
import axios from "axios";

const EditJobContent = () => {
  const dispatch = useDispatch();

  // Get Sales Person & Implementation Types data from Backend
  const { data: salesPersons } = useGetSalesPersonsQuery();
  const { data: implementationTypes } = useGetImplementationTypesQuery();
  // const { data: sourceTypes } = useGetSourceTypesQuery();

  // Logged in User Details
  const loginUserName = localStorage.getItem("loginUserName");
  const loginUserType = localStorage.getItem("loginUserType");
  const loginUserId = localStorage.getItem("loginUserId");

  const {
    data: { jobId },
  } = useSelector((state) => state.jobsModal);

  if (jobId) {
    dispatch(getSingleJob(jobId));
  }
  const job = useSelector((state) => state.jobs.jobDetails);

  const {
    id,
    companyName,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    implementationType,
    // sourceType,
    projectValue,
    quantityNew,
    quantityMigrate,
    quantityTrading,
    quantityService,
    customerInvoice,
    paymentStatus,
    accessories,
    noteCustomerComment,
    noteForScheduling,
    jobRemarks,
  } = job.salesPlus;

  const { id: salesPersonId = "", name: salesPersonName = "" } =
    job?.salesPlus?.salesPerson || {};

  const { paymentVerified } = job;

  const [formDetails, setFormDetails] = useState({
    salesPlusId: id ?? "",
    companyName: companyName ?? "",
    customerName: customerName ?? "",
    customerEmail: customerEmail ?? "",
    customerPhone: customerPhone ?? "",
    customerAddress: customerAddress ?? "",
    projectValue: projectValue ?? "",
    salesPersonId: salesPersonId ?? "",
    implementationType: implementationType ?? "",
    // sourceType: sourceType ?? "",
    quantityNew: quantityNew ?? "",
    quantityMigrate: quantityMigrate ?? "",
    quantityTrading: quantityTrading ?? "",
    quantityService: quantityService ?? "",
    customerInvoice: customerInvoice ?? "",
    paymentStatus: paymentStatus ?? "",
    paymentVerified: paymentVerified ?? "",
    accessories: accessories ?? "",
    noteCustomerComment: noteCustomerComment ?? "",
    noteForScheduling: noteForScheduling ?? "",
    jobRemarks: jobRemarks ?? "",
    location: job.location ?? "",
    lattitude: job.lattitude ?? "",
    longitude: job.longitude ?? "",
  });

  const [updateJob, { isLoading, isSuccess, isError }] = useUpdateJobMutation();

  const handleEdit = async (jobId) => {
    updateJob({ jobId, formData: formDetails });
  };

  // For Location Change
  useEffect(() => {
    const googleApiKey = "AIzaSyAJwujaucAqjiBhstqgj2ykhwCQGOFcVco";

    // setFormDetails({ ...formDetails, lattitude: "", longitude: "" });

    const delay = 3000; // 1 second delay
    let timeoutId = setTimeout(async () => {
      // Call API
      console.log("Search term is ", formDetails.location);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          formDetails.location
        )}&key=${googleApiKey}`
      );
      const lat = response?.data?.results[0]?.geometry?.location?.lat;
      const lng = response?.data?.results[0]?.geometry?.location?.lng;
      console.log("Google Maps Response Lattitude: ", lat, lng);
      if (!formDetails.lattitude && !formDetails.longitude) {
        setFormDetails({ ...formDetails, lattitude: lat, longitude: lng });
      }
    }, delay);

    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [formDetails.location]);

  // For Coordinates Change
  // useEffect(() => {
  //   const googleApiKey = "AIzaSyAJwujaucAqjiBhstqgj2ykhwCQGOFcVco";

  //   const delay = 3000; // 1 second delay
  //   let timeoutId = setTimeout(async () => {
  //     // Call API

  //     const response = await axios.get(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${formDetails.lattitude},${formDetails.longitude}&key=${googleApiKey}`
  //     );
  //     const results = response?.data.results;
  //     const largestAddressComponentsObject = results.reduce(
  //       (maxObject, currentObject) => {
  //         if (
  //           currentObject.address_components.length >
  //           maxObject.address_components.length
  //         ) {
  //           return currentObject;
  //         }
  //         return maxObject;
  //       },
  //       results[0]
  //     );
  //     const formattedAddress = largestAddressComponentsObject.formatted_address;
  //     if (formattedAddress) {
  //       setFormDetails({ ...formDetails, location: formattedAddress });
  //     }
  //     console.log("formatted address: ", formattedAddress);
  //     // const lat = response?.data?.results[0]?.geometry?.location?.lat;
  //     // const lng = response?.data?.results[0]?.geometry?.location?.lng;
  //     console.log("Google Maps Response : ", response);
  //     // setFormDetails({ ...formDetails, lattitude: lat, longitude: lng });
  //   }, delay);

  //   // Cleanup function
  //   return () => clearTimeout(timeoutId);
  // }, [formDetails.lattitude, formDetails.longitude]);

  const handleLocationChange = async (e) => {
    const name = e.target.name;
    console.log("event name is ", name);
    if (name === "location") {
      setFormDetails({ ...formDetails, lattitude: "", longitude: "" });
      setFormDetails({ ...formDetails, location: e.target.value });
    } else if (name === "lattitude") {
      setFormDetails({ ...formDetails, lattitude: e.target.value });
    } else {
      setFormDetails({ ...formDetails, longitude: e.target.value });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(closeModal())
    }
  }, [isSuccess])

  return (
    // The Modal Component is inside JobsModal. These will be injected into the modal when it is opened
    <>
      <Modal.Header closeButton>
        <Modal.Title>Edit Job</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="edit-job-modal">
          <>
            {isLoading && (
              <div className="loader-container">
                <Spinner
                  as="span"
                  animation="border"
                  size="xl"
                  role="status"
                  aria-hidden="true"
                  variant="success"
                />
              </div>
            )}
            <div className="job-form-section">
              {/* <p>{formDetails.companyName}</p> */}

              <div className="job-form-row">
                <Form.Group controlId="formCompanyName">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formDetails.companyName}
                    disabled
                    // placeholder="Enter email"
                  />
                </Form.Group>
                <Form.Group controlId="formCustomerName">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formDetails.customerName}
                    disabled
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        customerName: e.target.value,
                      })
                    }
                    placeholder="Enter email"
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formDetails.customerEmail}
                    disabled
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        customerEmail: e.target.value,
                      })
                    }
                    placeholder="Enter email"
                  />
                </Form.Group>
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="phone"
                    value={formDetails.customerPhone}
                    disabled
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        customerPhone: e.target.value,
                      })
                    }
                    placeholder="Enter Phone"
                  />
                </Form.Group>
                <Form.Group controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={formDetails.customerAddress}
                    disabled
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        customerAddress: e.target.value,
                      })
                    }
                    placeholder="Enter Address"
                  />
                </Form.Group>
                <Form.Group controlId="formProjectValue">
                  <Form.Label>Project Value</Form.Label>
                  <Form.Control
                    type="text"
                    value={formDetails.projectValue}
                    disabled
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        projectValue: e.target.value,
                      })
                    }
                    placeholder="Enter Project Value"
                  />
                </Form.Group>
                <Form.Group controlId="formLocation">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formDetails.location}
                    disabled
                    onChange={handleLocationChange}
                    placeholder="Enter Location"
                  />
                </Form.Group>
                <Form.Group controlId="formLattitude">
                  <Form.Label>Lattitude</Form.Label>
                  <Form.Control
                    type="text"
                    name="lattitude"
                    value={formDetails.lattitude}
                    disabled
                    onChange={handleLocationChange}
                    placeholder="Enter Lattitude"
                  />
                </Form.Group>
                <Form.Group controlId="formLongitude">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="text"
                    name="longitude"
                    value={formDetails.longitude}
                    disabled
                    onChange={handleLocationChange}
                    placeholder="Enter Longitude"
                  />
                </Form.Group>
              </div>
            </div>
            <div className="job-form-section">
              <div className="job-form-row">
                <Form.Group controlId="formSalesPerson">
                  <Form.Label>Select SalesPerson</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    value={formDetails.salesPersonId}
                    disabled
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        salesPersonId: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Sales Person</option>
                    {salesPersons &&
                      salesPersons.map((salesPerson) => {
                        return (
                          <option key={salesPerson.id} value={salesPerson.id}>
                            {capitalizeFirstLetter(salesPerson.name)}
                          </option>
                        );
                      })}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formImplementationType">
                  <Form.Label>Select Implementation Type</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    value={formDetails.implementationType}
                    disabled
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        implementationType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Implementation Type</option>
                    {implementationTypes &&
                      implementationTypes.map((item, index) => {
                        return (
                          <option key={index} value={item.implementationType}>
                            {item.implementationType.toUpperCase()}
                          </option>
                        );
                      })}
                  </Form.Control>
                </Form.Group>
                {/* <Form.Group controlId="formSourceType">
                  <Form.Label>Select Source Type</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    value={formDetails.sourceType}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        sourceType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Source Type</option>
                    {sourceTypes &&
                      sourceTypes.map((item, index) => {
                        return (
                          <option key={index} value={item.sourceType}>
                            {capitalizeFirstLetter(item.sourceType)}
                          </option>
                        );
                      })}
                  </Form.Control>
                </Form.Group> */}
                <Form.Group controlId="formCustomerInvoice">
                  <Form.Label>Customer Invoice</Form.Label>
                  <Form.Control
                    type="text"
                    value={formDetails.customerInvoice}
                    disabled
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        customerInvoice: e.target.value,
                      })
                    }
                    placeholder="Customer Invoice"
                  />
                </Form.Group>
                <Form.Group controlId="formPaymentStatus">
                  <Form.Label>Payment Status</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    value={formDetails.paymentStatus}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        paymentStatus: e.target.value,
                      })
                    }
                  >
                    <option value="">Please Select</option>
                    <option value="yes">Paid</option>
                    <option value="no">Not Paid</option>
                    <option value="partial">Partially Paid</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formPaymentVerified">
                  <Form.Label>Payment Verified</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    value={formDetails.paymentVerified}
                    disabled={!["celine", "admin"].includes(loginUserName)}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        paymentVerified: e.target.value,
                      })
                    }
                  >
                    <option value="">Please Select</option>
                    <option value={true}>Verified</option>
                    <option value={false}>Not Verified</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formAccessories">
                  <Form.Label>Accessories :</Form.Label>
                  <Form.Control
                    type="text"
                    value={formDetails.accessories}
                    disabled
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        accessories: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
            </div>

            <div className="job-form-section">
              <h6>Quantities:</h6>

              <div className="job-form-row">
                <Form.Group controlId="formQuantityNew">
                  <Form.Label>Quantity New</Form.Label>
                  <Form.Control
                    type="text"
                    value={formDetails.quantityNew}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        quantityNew: e.target.value,
                      })
                    }
                    placeholder="Quantity New"
                  />
                </Form.Group>

                <Form.Group controlId="formQuantityMigration">
                  <Form.Label>Quantity Migration</Form.Label>
                  <Form.Control
                    type="text"
                    value={formDetails.quantityMigrate}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        quantityMigrate: e.target.value,
                      })
                    }
                    placeholder="Quantity Migration"
                  />
                </Form.Group>
                <Form.Group controlId="formQuantityTrading">
                  <Form.Label>Quantity Trading</Form.Label>
                  <Form.Control
                    type="text"
                    value={formDetails.quantityTrading}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        quantityTrading: e.target.value,
                      })
                    }
                    placeholder="Quantity Trading"
                  />
                </Form.Group>
                <Form.Group controlId="formQuantityService">
                  <Form.Label>Quantity Service</Form.Label>
                  <Form.Control
                    type="text"
                    value={formDetails.quantityService}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        quantityService: e.target.value,
                      })
                    }
                    placeholder="Quantity Service"
                  />
                </Form.Group>
              </div>
            </div>
            <div className="job-form-section ">
              {/* <h6>Quantities:</h6> */}

              <div className="job-form-row form-note-section">
                <Form.Group controlId="formScheduleNote">
                  <Form.Label>Schedule Note </Form.Label>
                  <Form.Control
                    as="textarea"
                    value={formDetails.noteForScheduling}
                    disabled
                    // onChange={(e) =>
                    //   setFormDetails({
                    //     ...formDetails,
                    //     noteForScheduling: e.target.value,
                    //   })
                    // }
                    placeholder="Schedule Note"
                  />
                </Form.Group>
                <Form.Group controlId="formStatusNote">
                  <Form.Label>Status Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={formDetails.noteCustomerComment}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        noteCustomerComment: e.target.value,
                      })
                    }
                    placeholder="Status Note"
                  />
                </Form.Group>

                <Form.Group controlId="formJobRemarks">
                  <Form.Label>Job Remarks </Form.Label>
                  <Form.Control
                    as="textarea"
                    value={formDetails.jobRemarks}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        jobRemarks: e.target.value,
                      })
                    }
                    placeholder="Job Remarks"
                  />
                </Form.Group>
              </div>
            </div>
          </>
        </section>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Job Details Updated Successfully!"
              : isError
              ? "Could not Save Job Details. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={() => handleEdit(jobId)}>
          {isLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              variant="light"
            />
          ) : (
            "Save"
          )}
        </Button>

        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

export default EditJobContent;
