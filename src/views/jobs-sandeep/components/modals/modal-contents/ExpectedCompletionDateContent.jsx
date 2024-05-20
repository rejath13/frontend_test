import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Alert, Spinner, Form } from "react-bootstrap";
import "./ExpectedCompletionDateContent.scss";
import { getSingleJob } from "../../../../../store/slices/jobs/jobSlice";
import { closeModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { useSetExpectedCompletionDateMutation } from "../../../../../store/api/jobs/jobsApi";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExpectedCompletionDateContent = () => {
  const dispatch = useDispatch();

  const [expDate, setExpDate] = useState(new Date());
  const [expTime, setExpTime] = useState();
  const { data } = useSelector((state) => state.jobsModal);

  console.log("The selected Date is : ", expDate);
  console.log("The selected Time is : ", expTime);

  if (data.jobId) {
    dispatch(getSingleJob(data.jobId));
  }
  const job = useSelector((state) => state.jobs.jobDetails);

  const [setExpectedCompletionDate, { isLoading, isError, isSuccess }] =
    useSetExpectedCompletionDateMutation();

  const handleSaveExpDate = async () => {
    const formattedDate = DateTime.fromJSDate(expDate).toFormat("yyyy-MM-dd");
    console.log("Saving ", formattedDate);

    const response = await setExpectedCompletionDate({
      jobId: job.id,
      expectedDate: formattedDate,
      expectedTime: expTime,
    });
  };

  return (
    // The Modal Component is inside JobsModal. These will be injected into the modal when it is opened
    <>
      <Modal.Header closeButton>
        <Modal.Title>Set Expected Completion Date</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="expected-completion-modal">
          {(isSuccess || isError) && (
            <Alert variant={isSuccess ? "success" : "danger"}>
              {isSuccess
                ? "Expected Completion Date Saved Successfully!"
                : isError
                ? "Could not Save. Please Try Again !"
                : ""}
            </Alert>
          )}
          {/* Date Picker */}
          <Form.Group controlId="formDatePicker">
            <Form.Label>Exp. Completion Date</Form.Label>
            <DatePicker
              selected={expDate}
              onChange={(date) => setExpDate(date)}
              showIcon
              className="form-control"
              dateFormat="dd-MM-yyyy"
              isClearable
            />
          </Form.Group>
          {/* Time Picker */}
          <Form.Group controlId="formTimePicker">
            <Form.Label>Exp. Completion Time</Form.Label>

            <DatePicker
              selected={expTime}
              onChange={(time) => setExpTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="form-control"
              // dateFormat="h:mm aa"
            />
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
        <Button variant="success" onClick={() => handleSaveExpDate()}>
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
          "Close"
        </Button>
      </Modal.Footer>
    </>
  );
};

export default ExpectedCompletionDateContent;
