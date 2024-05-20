import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Modal, Button, Spinner, Alert } from "react-bootstrap";
import {
  closeModal,
  getCurrentScheduleData,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import { useUpdateScheduleTrainedStatusMutation } from "../../../../../store/api/scheduler/schedulerApi";
import { capitalizeFirstLetter } from "../../../../jobs-sandeep/helpers/job-card-helper";
import "./UpdateScheduleTrainedStatusContent.scss";

const UpdateScheduleTrainedStatusContent = () => {
  //

  const dispatch = useDispatch();

  const schedule = useSelector(getCurrentScheduleData);

  console.log("Schedule trained: ", schedule.isTrained);

  const [statusData, setStatusData] = useState({
    scheduleId: schedule?.id,
    isTrained: schedule?.isTrained || false,
  });

  const trainedLabels = [
    { id: 1, label: "Trained", value: true },
    { id: 2, label: "Not Trained", value: false },
  ];

  const [updateScheduleTrainedStatus, { isLoading, isError, isSuccess }] =
    useUpdateScheduleTrainedStatusMutation();

  const handleScheduleTrainedStatusSubmit = () => {
    const response = updateScheduleTrainedStatus(statusData);
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
        <Modal.Title>Update Schedule Trained Status </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="update-schedule-trained-status">
          <Form.Group controlId="formScheduleTrainedStatus">
            <Form.Label>Schedule Trained Status</Form.Label>
            <Form.Control
              as="select"
              custom
              value={statusData.isTrained}
              onChange={(e) =>
                setStatusData((prevData) => ({
                  ...prevData,
                  isTrained: e.target.value,
                }))
              }
            >
              {/* <option value="">Select Technician</option> */}
              {trainedLabels.map((item) => {
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
              ? "Schedules Trained Status updated Successfully!"
              : isError
              ? "Could not Save. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={handleScheduleTrainedStatusSubmit}>
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

export default UpdateScheduleTrainedStatusContent;
