import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import "./DeleteStatusContent.scss";
import { getSingleJob } from "../../../../../store/slices/jobs/jobSlice";
import { useDeleteJobMutation } from "../../../../../store/api/jobs/jobsApi";
import { closeModal } from "../../../../../store/slices/jobs/jobsModalSlice";

const DeleteStatusContent = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { data } = useSelector((state) => state.jobsModal);
  if (data.jobId) {
    dispatch(getSingleJob(data.jobId));
  }
  const job = useSelector((state) => state.jobs.jobDetails);

  const [deleteJob, isLoading] = useDeleteJobMutation();

  const handleDelete = async (jobId) => {
    try {
      const response = await deleteJob({ jobId });
      if (!response.error) {
        setMessage("Job Deleted");
      } else {
        setMessage("Something went wrong");
      }
      // console.log("res deleting job: ", response);
    } catch (err) {
      setMessage("Something went wrong");
      // console.log(err);
    }
  };

  return (
    // The Modal Component is inside JobsModal. These will be injected into the modal when it is opened
    <>
      <Modal.Header closeButton>
        <Modal.Title>Delete Job</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="delete-status-modal">
          {!message && (
            <div>
              <p className="warning-text">
                Do you really want to delete the job?
              </p>
              <div>
                <p>Job Id : {job && job.id}</p>
                <p>Company Name : {job && job.salesPlus.companyName}</p>
                <p>Customer Name : {job && job.salesPlus.customerName}</p>
                <p>Sales Plus Id : {job && job.salesPlus.id}</p>
              </div>
            </div>
          )}
          {message && <div>{message}</div>}
        </section>
      </Modal.Body>
      <Modal.Footer>
        {!message && (
          <Button variant="danger" onClick={() => handleDelete(data.jobId)}>
            Yes, Delete
          </Button>
        )}
        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          {!message ? "Cancel" : "Close"}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default DeleteStatusContent;
