import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Modal, Button, Spinner, Alert } from "react-bootstrap";
import {
  closeModal,
  getCurrentScheduleData,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import { useUpdateSchedulePaymentStatusMutation } from "../../../../../store/api/scheduler/schedulerApi";
import { capitalizeFirstLetter } from "../../../../jobs-sandeep/helpers/job-card-helper";
import "./UpdateSchedulePaymentStatusContent.scss";

const UpdateSchedulePaymentStatusContent = () => {
  //

  const dispatch = useDispatch();

  const schedule = useSelector(getCurrentScheduleData);

  console.log("Schedule trained: ", schedule.isTrained);

  const [statusData, setStatusData] = useState({
    scheduleId: schedule?.id,
    isPaid: schedule?.isPaid || false,
  });

  const paymentLabels = [
    { id: 1, label: "Paid", value: true },
    { id: 2, label: "Not Paid", value: false },
  ];

  const [updateSchedulePaymentStatus, { isLoading, isError, isSuccess }] =
    useUpdateSchedulePaymentStatusMutation();

  const handleSchedulePaymentStatusSubmit = () => {
    const response = updateSchedulePaymentStatus(statusData);
  };

   // Close the modal when successful update
   useEffect(() => {
    if(isSuccess) {
      setTimeout(() => {
        dispatch(closeModal())
      }, 1000)
    }
  }, [isSuccess])
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Update Schedule Payment Status </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="update-schedule-payment-status">
          <Form.Group controlId="formSchedulePaymentStatus">
            <Form.Label>Schedule Payment Status</Form.Label>
            <Form.Control
              as="select"
              custom
              value={statusData.isPaid}
              onChange={(e) =>
                setStatusData((prevData) => ({
                  ...prevData,
                  isPaid: e.target.value,
                }))
              }
            >
              {/* <option value="">Select Technician</option> */}
              {paymentLabels.map((item) => {
                console.log("item is ", item);
                return (
                  <option key={item.id} value={item.value}>
                    {capitalizeFirstLetter(item.label)}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Schedules Payment Status updated Successfully!"
              : isError
              ? "Could not Save. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={handleSchedulePaymentStatusSubmit}>
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

export default UpdateSchedulePaymentStatusContent;
