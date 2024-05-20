import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Modal, Button, Spinner, Alert } from "react-bootstrap";
import {
  closeModal,
  getCurrentScheduleData,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import { useUpdateScheduleStatusMutation } from "../../../../../store/api/scheduler/schedulerApi";
import { capitalizeFirstLetter } from "../../../../jobs-sandeep/helpers/job-card-helper";
import "./UpdateScheduleStatusContent.scss";
import { useToasts } from "react-toast-notifications";

const UpdateScheduleStatusContent = () => {
  //

  const dispatch = useDispatch();

  const { addToast } = useToasts();

  const schedule = useSelector(getCurrentScheduleData);

  const [statusData, setStatusData] = useState({
    scheduleId: schedule?.id,
    scheduleStatus: schedule?.scheduleStatus,
  });

  // const scheduleLabels = ["schedules", "assigned", "partial", "completed"];
  const scheduleLabels = ["partial", "completed"];

  const [updateScheduleStatus, { isLoading, isError, isSuccess }] =
    useUpdateScheduleStatusMutation();

  const handleScheduleStatusSubmit = () => {
    const response = updateScheduleStatus(statusData);
  };

  const handleScheduleStatusChange = (e) => {
    let statusChosen = e.target.value;
    console.log("e is : ", statusChosen);
    if (statusChosen === "assigned") {
      if (
        schedule?.scheduleDate &&
        schedule?.fromTime &&
        schedule?.toTime &&
        schedule?.duration &&
        schedule?.technicianId !== 1
      ) {
        setStatusData((prevData) => ({
          ...prevData,
          scheduleStatus: e.target.value,
        }));
      } else {
        const toastMessage =
          "Cannot change status to assigned. Schedule Data not set";
        addToast(toastMessage, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      setStatusData((prevData) => ({
        ...prevData,
        scheduleStatus: e.target.value,
      }));
    }
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
        <Modal.Title>Update Schedule Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="update-schedule-status">
          <Form.Group controlId="formScheduleStatus">
            <Form.Label>Schedule Status</Form.Label>
            <Form.Control
              as="select"
              custom
              value={statusData.scheduleStatus}
              onChange={handleScheduleStatusChange}
            >
              <option value="">Select Status</option>
              {scheduleLabels.map((label, index) => {
                return (
                  <option key={index} value={label}>
                    {capitalizeFirstLetter(label)}
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
              ? "Schedules Status updated Successfully!"
              : isError
              ? "Could not Save. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={handleScheduleStatusSubmit}>
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

export default UpdateScheduleStatusContent;
