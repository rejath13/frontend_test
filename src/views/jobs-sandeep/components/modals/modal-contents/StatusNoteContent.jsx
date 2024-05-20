import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Alert, Form } from "react-bootstrap";
import "./StatusNoteContent.scss";
import { getSingleJob } from "../../../../../store/slices/jobs/jobSlice";

import { closeModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { useUpdateStatusNoteMutation } from "../../../../../store/api/jobs/jobsApi";

import { Spinner } from "react-bootstrap";

const StatusNoteContent = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setCustomerComment(e.target.value);
  };

  const { data } = useSelector((state) => state.jobsModal);

  if (data.jobId) {
    dispatch(getSingleJob(data.jobId));
  }

  const job = useSelector((state) => state.jobs.jobDetails);

  const [customerComment, setCustomerComment] = useState(
    job?.salesPlus?.noteCustomerComment
  );

  const [updateStatusNote, { isLoading, isError, isSuccess }] =
    useUpdateStatusNoteMutation();

  const handleSave = async () => {
    const response = await updateStatusNote({
      jobId: job.id,
      salesPlusId: job?.salesPlus?.id,
      noteCustomerComment: customerComment,
    });
  };

  return (
    // The Modal Component is inside JobsModal. These will be injected into the modal when it is opened
    <>
      <Modal.Header closeButton>
        <Modal.Title>Update Status Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="status-note-modal">
          <Form.Group controlId="formCustomerName">
            {/* <Form.Label>Status Note</Form.Label> */}
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Status Note"
              value={customerComment || ""}
              onChange={handleChange}
            />
            {/* {editNote && <Button variant="success">Save</Button>} */}
            {/* {statusNote ? statusNote : "Status  Note "} */}
            {/* </Form.Control> */}
          </Form.Group>

          <div className="company-info">
            <p>Job Id : {job && job.id}</p>
            <p>Company Name : {job && job.salesPlus.companyName}</p>
            <p>Customer Name : {job && job.salesPlus.customerName}</p>
            <p>Sales Plus Id : {job && job.salesPlus.id}</p>
          </div>
        </section>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Status Note Saved Successfully!"
              : isError
              ? "Could not Save. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={() => handleSave()}>
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

export default StatusNoteContent;
