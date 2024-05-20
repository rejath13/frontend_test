import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Modal, Button, Spinner, Alert } from "react-bootstrap";
import {
  closeModal,
  getCurrentScheduleData,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import { useUpdateScheduleAdminCommentMutation } from "../../../../../store/api/scheduler/schedulerApi";

import "./UpdateScheduleAdminCommentContent.scss";

const UpdateScheduleAdminCommentContent = () => {
  //

  const dispatch = useDispatch();

  const schedule = useSelector(getCurrentScheduleData);

  const [statusData, setStatusData] = useState({
    scheduleId: schedule?.id,
    commentAdmin: schedule?.commentAdmin || "",
  });

  const [updateScheduleAdminComment, { isLoading, isError, isSuccess }] =
    useUpdateScheduleAdminCommentMutation();

  const handleScheduleAdminCommentSubmit = () => {
    const response = updateScheduleAdminComment(statusData);
  };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Update Schedule Admin Comment </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="update-schedule-admin-comment">
          <Form.Group controlId="formScheduleAdminComment">
            <Form.Label>Schedule Admin Comment </Form.Label>
            <Form.Control
              as="textarea"
              value={statusData.commentAdmin}
              // disabled
              rows={5}
              onChange={(e) =>
                setStatusData((prevData) => ({
                  ...prevData,
                  commentAdmin: e.target.value,
                }))
              }
              placeholder="Schedule Admin Comment"
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Schedules Admin Comment updated Successfully!"
              : isError
              ? "Could not Save. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={handleScheduleAdminCommentSubmit}>
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

export default UpdateScheduleAdminCommentContent;
