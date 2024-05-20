import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import ScheduleCard from "../../components/ScheduleCard";

import {
  closeModal,
  getCurrentJobId,
  getCurrentScheduleData,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import { Form } from "react-bootstrap";
import moment from "moment";

import { useRepeatScheduleMutation } from "../../../../../store/api/scheduler/schedulerApi";
import "./RepeatScheduleContent.scss";

const RepeatScheduleContent = () => {
  const dispatch = useDispatch();

  const [newSchedule, setNewSchedule] = useState();

  // Get Current Schedule from Modal State
  const schedule = useSelector(getCurrentScheduleData);
  console.log("Current schedule : ", schedule);

  const [repeatForm, setRepeatForm] = useState({
    scheduleId: schedule?.id,
    isRepeatForPartial: schedule?.isRepeatForPartial,
  });

  const [repeatSchedule, { data, isLoading, isSuccess, isError }] =
    useRepeatScheduleMutation();

  useEffect(() => {
    setNewSchedule(data);
  }, [data]);

  const handleRepeatForPartialChange = () => {
    setRepeatForm((prevRepeatForm) => ({
      ...prevRepeatForm,
      isRepeatForPartial: !prevRepeatForm.isRepeatForPartial,
    }));
  };

  console.log("Repeat result data: ", newSchedule);

  const handleRepeatScheduleSubmit = async () => {
    // Dispatch createSchedule Mutation here
    repeatSchedule(repeatForm);
  };

  return (
    // The Modal Component is inside JobsModal. These will be injected into the modal when it is opened
    <>
      <Modal.Header closeButton>
        <Modal.Title>Repeat Schedule</Modal.Title>
        {/* <ScheduleJobInfoForm /> */}
      </Modal.Header>
      <Modal.Body>
        <section className="repeat-schedule-modal">
          <>
            {isLoading && (
              <div className="loader-container">
                <Spinner
                  as="span"
                  animation="border"
                  size="xl"
                  role="status"
                  aria-hidden="true"
                  variant="success"
                />
              </div>
            )}
          </>
          <Form.Group controlId="formIsRepeatForPartial">
            <div className="priority-container">
              <Form.Label>
                {" "}
                Is this a repeat for a partially completed schedule ?
              </Form.Label>
              {/* <div className="priority-icon">{<PriorityIcon />}</div> */}
              <Form.Check
                type="checkbox"
                checked={repeatForm.isRepeatForPartial}
                onChange={handleRepeatForPartialChange}
                as="input"
              />
            </div>
          </Form.Group>
          <section className="new-schedule">
            {newSchedule && <ScheduleCard schedule={newSchedule} />}
          </section>
        </section>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "New Schedule is Repeated!"
              : isError
              ? "Could not Save Job Details. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={() => handleRepeatScheduleSubmit()}>
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

export default RepeatScheduleContent;
