import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Spinner, Form, Alert } from "react-bootstrap";
import "./CreateTraccarUserContent.scss";
import { getSingleJob } from "../../../../../store/slices/jobs/jobSlice";
import { useCreateTraccarUserMutation } from "../../../../../store/api/jobs/jobsApi";
import { closeModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { BsPersonCheck } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";

const DeleteStatusContent = () => {
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.jobsModal);

  data.jobId && dispatch(getSingleJob(data.jobId));
  const job = useSelector((state) => state.jobs.jobDetails);

  const [
    createTraccarUser,
    { isLoading, isError, isSuccess, data: responseMessage },
  ] = useCreateTraccarUserMutation();

  console.log("Is loading is ", isLoading);
  console.log("Is error is ", isError);

  const handleCreateTraccarUser = async (jobId) => {
    setShowForm(false);
    try {
      const response = await createTraccarUser({ jobId, userForm });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setUserForm({ ...userForm, username: "", password: "" });
  };

  return (
    // The Modal Component is inside JobsModal. These will be injected into the modal when it is opened
    <>
      <Modal.Header closeButton>
        <Modal.Title>Create Traccar User </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="create-traccar-modal">
          {isLoading || isError || isSuccess ? (
            <div className="loader">
              <div className="success-message-container">
                {isLoading && (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                      variant="success"
                    />
                    <h3 className="text-primary">Creating Traccar User...</h3>
                  </>
                )}
                {isSuccess && (
                  <>
                    <BsPersonCheck className="icon success-icon" />
                    <h3 className="text-success ">Traccar User Created !!</h3>
                  </>
                )}
                {isError && (
                  <>
                    <h3 className="text-danger">
                      Could not create Traccar User !{" "}
                    </h3>
                    <FiUserX className="icon error-icon" />
                  </>
                )}
              </div>

              {/* {isError &&                '<h3 className="text-danger">Something went wrong !</h3>'} */}
            </div>
          ) : null}
          <div>
            {!confirmation && (
              <Alert variant="warning" className="text-center">
                <b>
                  Do you really want to create a traccar account for this job?
                </b>
              </Alert>
            )}
            {showForm && (
              <div>
                <Form>
                  <Form.Group controlId="formUsername">
                    <Form.Label>To:</Form.Label>
                    <Form.Control
                      type="text"
                      value={userForm.username}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          username: e.target.value,
                        })
                      }
                      // disabled
                      placeholder="Enter Username"
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>To:</Form.Label>
                    <Form.Control
                      type="text"
                      value={userForm.password}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          password: e.target.value,
                        })
                      }
                      // disabled
                      placeholder="Enter Password"
                    />
                  </Form.Group>
                  <div className="form-button-container">
                    <Button
                      variant="success"
                      onClick={() => handleCreateTraccarUser(data.jobId)}
                    >
                      {isLoading && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                      {isLoading
                        ? "Creating Traccar User"
                        : "Create Traccar User"}
                    </Button>
                    {/* <Button variant="secondary" onClick={handleCloseForm}>
                      Cancel
                    </Button> */}
                  </div>
                </Form>
              </div>
            )}
            <div>
              <p>Job Id : {job && job.id}</p>
              <p>Company Name : {job && job.salesPlus.companyName}</p>
              <p>Customer Name : {job && job.salesPlus.customerName}</p>
              <p>Sales Plus Id : {job && job.salesPlus.id}</p>
            </div>
          </div>
        </section>
      </Modal.Body>
      <Modal.Footer>
        {!isSuccess && !isError && !isLoading ? (
          <Button
            variant={!isSuccess ? "primary" : "light"}
            //   onClick={() => handleCreateTraccarUser(data.jobId)}
            onClick={() => {
              setConfirmation(!confirmation);
              setShowForm((prevState) => !prevState);
            }}
            disabled={isSuccess}
          >
            {showForm ? "Cancel" : "Yes"}
          </Button>
        ) : isError ? (
          <Button
            variant="primary"
            onClick={() => {
              setConfirmation(!confirmation);
              setShowForm(true);
            }}
          >
            Retry
          </Button>
        ) : null}

        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

export default DeleteStatusContent;
