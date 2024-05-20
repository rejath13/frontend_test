import React from "react";
import ScheduleCard from "../components/ScheduleCard";
import { Modal, Button } from "react-bootstrap";
import "./TimelineScheduleView.scss";

const TimelineScheduleView = ({
  schedule,
  showEditSchedule,
  setShowEditSchedule,
}) => {
  const handleClose = () => {
    setShowEditSchedule(false);
  };
  return (
    <div id="timeline-single-schedule">
      <Modal
        show={showEditSchedule}
        onHide={handleClose}
        size="xl"
        id="full-width-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Timeline Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Content of your modal goes here */}
          <ScheduleCard schedule={schedule} />{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimelineScheduleView;
