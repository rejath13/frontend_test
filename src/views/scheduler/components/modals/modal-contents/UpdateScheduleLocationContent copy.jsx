import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./UpdateScheduleLocationContent.scss";
import { Form, Modal, Button, Spinner, Alert } from "react-bootstrap";
import {
  closeModal,
  getCurrentScheduleData,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import { useUpdateScheduleLocationMutation } from "../../../../../store/api/scheduler/schedulerApi";

const UpdateScheduleLocationContent = () => {
  //

  const dispatch = useDispatch();

  const schedule = useSelector(getCurrentScheduleData);
  const [locationData, setLocationData] = useState({
    scheduleId: schedule?.id,
    location: schedule?.location,
    coordinates: schedule?.coordinates,
  });

  const [updateScheduleLocation, { isLoading, isError, isSuccess }] =
    useUpdateScheduleLocationMutation();

  const handleLocationSubmit = () => {
    const response = updateScheduleLocation(locationData);
  };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Change Schedule Location Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="update-schedule-location">
          <div className="form-col">
            <Form.Group controlId="formScheduleLocation">
              <Form.Label>Schedule Location </Form.Label>
              <Form.Control
                type="text"
                value={locationData.location || ""}
                onChange={(e) =>
                  setLocationData((prevData) => ({
                    ...prevData,
                    location: e.target.value,
                  }))
                }
                placeholder="Schedule Location"
              />
            </Form.Group>
            <Form.Group controlId="formScheduleCoordinates">
              <Form.Label>Schedule Coordinates </Form.Label>
              <Form.Control
                type="text"
                value={locationData.coordinates || ""}
                onChange={(e) =>
                  setLocationData((prevData) => ({
                    ...prevData,
                    coordinates: e.target.value,
                  }))
                }
                placeholder="Schedule Coordinates"
              />
            </Form.Group>
          </div>
          <div className="google-map">Map goes here</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Schedules Location updated Successfully!"
              : isError
              ? "Could not Save. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={handleLocationSubmit}>
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

export default UpdateScheduleLocationContent;
