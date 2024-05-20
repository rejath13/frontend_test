import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./UpdateScheduleContactInfoContent.scss";
import { Form, Modal, Button, Spinner, Alert } from "react-bootstrap";
import {
  closeModal,
  getCurrentScheduleData,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import { useUpdateScheduleContactInfoMutation } from "../../../../../store/api/scheduler/schedulerApi";

const UpdateScheduleContactInfoContent = () => {
  //
  const dispatch = useDispatch();
  const schedule = useSelector(getCurrentScheduleData);

  console.log("current schedule in contact info update: ", schedule);

  const [updateScheduleContactInfo, { isLoading, isError, isSuccess }] =
    useUpdateScheduleContactInfoMutation();

  const [contactInfo, setContactInfo] = useState({
    scheduleId: schedule?.id,
    contactName: schedule?.contactName,
    contactPhone: schedule?.contactPhone,
  });

  const handleContactInfoSubmit = () => {
    const response = updateScheduleContactInfo(contactInfo);
  };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Update Schedule Contact Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="update-schedule-contact-info">
          <Form.Group controlId="formContactName">
            <Form.Label>Contact Name</Form.Label>
            <Form.Control
              type="text"
              value={contactInfo.contactName}
              onChange={(e) =>
                setContactInfo({
                  ...contactInfo,
                  contactName: e.target.value,
                })
              }
              placeholder="Contact Name"
            />
          </Form.Group>
          <Form.Group controlId="formContactPhone">
            <Form.Label>Contact Phone</Form.Label>
            <Form.Control
              type="text"
              value={contactInfo.contactPhone}
              onChange={(e) =>
                setContactInfo({
                  ...contactInfo,
                  contactPhone: e.target.value,
                })
              }
              placeholder="Contact Phone"
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Schedules Contact Info updated Successfully!"
              : isError
              ? "Could not Save. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={handleContactInfoSubmit}>
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

export default UpdateScheduleContactInfoContent;
