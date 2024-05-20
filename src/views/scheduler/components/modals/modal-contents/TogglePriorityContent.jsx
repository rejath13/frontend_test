import React, { useState } from "react";
import { closeModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { PriorityIcon } from "../../icons";
import { useToggleSchedulePriorityMutation } from "../../../../../store/api/scheduler/schedulerApi";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import { useToasts } from "react-toast-notifications";
import "./TogglePriorityContent.scss";
import { checkScheduleExpiry } from "../../../helpers/schedule-helper";

const TogglePriorityContent = () => {
  //
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const {
    data: { schedule },
  } = useSelector((state) => state.jobsModal);
  //   const isLoading = false;
  //   console.log("Toggle Priority Schedule: ", schedule);

  const [isHighPriority, setIsHighPriority] = useState(schedule.isHighPriority);

  const [toggleSchedulePriority, { isLoading, isError, isSuccess }] =
    useToggleSchedulePriorityMutation();

  //   console.log("Schedule in modal: ", schedule);

  const handleToggleIsHighPriority = () => {
    const isScheduleExpired = checkScheduleExpiry(schedule?.scheduleDate);

    if (isScheduleExpired) {
      const toastMessage =
        '"Schedule expired! Please create a new one or repeat this one"';
      showToast(toastMessage, "error", addToast);
      return;
    }

    // console.log("Prev Priority: ", isHighPriority);
    // console.log("Toggling");
    setIsHighPriority((prevPriority) => !prevPriority);
  };
  const handlePrioritySubmit = async () => {
    const response = await toggleSchedulePriority({
      scheduleId: schedule.id,
      isHighPriority,
    });
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Change Schedule Priority</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="toggle-priority-modal">
          <Form.Group controlId="formHighPriority">
            <div className="priority-container">
              <Form.Label>
                <PriorityIcon /> High Priority ?
              </Form.Label>
              {/* <div className="priority-icon">{<PriorityIcon />}</div> */}
              <Form.Check
                type="checkbox"
                // label={isHighPriority && <PriorityIcon />}
                checked={isHighPriority}
                onChange={handleToggleIsHighPriority}
                as="input"
              />
            </div>
          </Form.Group>
        </section>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handlePrioritySubmit}>
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

export default TogglePriorityContent;
