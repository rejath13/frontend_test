import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { getCurrentScheduleData } from "../../../../../store/slices/jobs/jobsModalSlice";
import { useSendScheduleToTechnicianMutation } from "../../../../../store/api/scheduler/schedulerApi";
import { useToasts } from "react-toast-notifications";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import "./SendToTechnicianContent.scss";
import { checkScheduleExpiry } from "../../../helpers/schedule-helper";

const SendToTechnicianContent = () => {
  //
  const dispatch = useDispatch();

  const { addToast } = useToasts();

  // Get Current Schedule from Modal State
  const schedule = useSelector(getCurrentScheduleData);

  const [
    sendScheduleToTechnician,
    { isLoading, isSuccess, isFetching, isError },
  ] = useSendScheduleToTechnicianMutation();

  if (isSuccess) {
    setTimeout(() => {
      dispatch(closeModal());
    }, 3000);
  }

  const handleSendToTechnicianSubmit = async () => {
    // Write code to alert with already sent to technician
    // const { isSentToTechnician } = schedule;
    // Send data to backend

    // if (!isSentToTechnician) {
    await sendScheduleToTechnician({
      scheduleId: schedule?.id,
      // scheduleDate: schedule?.scheduleDate,
      // fromTime: schedule?.fromTime,
      // toTime: schedule?.toTime,
      // duration: schedule?.duration,
      isSentToTechnician: true,
    });
    // } else {
    //   const toastMessage = `Schedule already assigned to Technician`;
    //   const toastType = "error";
    //   showToast(toastMessage, toastType, addToast);
    // }
  };

  // const calculateScheduleStatus = () => {
  //   let scheduleStatus = "";

  // if (
  //   parseInt(technicianId) !== 1 &&
  //   fromTime &&
  //   duration &&
  //   toTime &&
  //   scheduleDate &&
  //   isSentToTechnician
  // ) {
  //   scheduleStatus = "assigned";
  // } else if (
  //   parseInt(technicianId) !== 1 &&
  //   fromTime &&
  //   duration &&
  //   toTime &&
  //   scheduleDate &&
  //   !isSentToTechnician
  // ) {
  //   scheduleStatus = "scheduled";
  // } else {
  //   scheduleStatus = "unscheduled";
  // }
  // return scheduleStatus;
  // }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Send Schedule To Technician</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="send-to-technician-modal">
          <p>Are you sure you want to send the schedule to Technician?</p>
        </section>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Schedule Assigned To Technician Successfully!"
              : isError
              ? "Something went wrong. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={handleSendToTechnicianSubmit}>
          {isLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              variant="light"
            />
          ) : isSuccess ? (
            "Assigned"
          ) : (
            "Yes"
          )}
        </Button>

        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

export default SendToTechnicianContent;
