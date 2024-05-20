import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Alert, Button, Spinner } from "react-bootstrap";
import { closeModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { useUpdateScheduleDataMutation } from "../../../../../store/api/scheduler/schedulerApi";
import { getCurrentScheduleData } from "../../../../../store/slices/jobs/jobsModalSlice";
// import { ScheduleTimeForm } from "../../../../jobs-sandeep/components/modals/modal-contents/schedule-job-forms";
import UpdateScheduleDataForm from "./forms/UpdateScheduleDataForm";
import moment from "moment";
import { useToasts } from "react-toast-notifications";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import "./UpdateScheduleDataContent.scss";
import ScheduleCard from "../../components/ScheduleCard";
import {
  calculateScheduleStatus,
  checkScheduleOkToUpdate,
} from "../../../helpers/schedule-helper";
import { formatToMomentDate } from "../../../helpers/schedule-info-helper";

const UpdateScheduleDataContent = () => {
  //
  const dispatch = useDispatch();

  // update schedule mutation
  const [updateScheduleData, { isLoading, isError, isSuccess }] =
    useUpdateScheduleDataMutation();

    console.log('UpdateSchedule data isSuccess ', isSuccess)

  const { addToast } = useToasts();

  // Get current Schedule
  const schedule = useSelector(getCurrentScheduleData);
  // console.log("Current Schedule in update schedule: ", schedule);
  const {
    id: scheduleId,
    scheduleDate,
    fromTime,
    toTime,
    duration,
    technicianId,
    isSentToTechnician,
  } = schedule;

  // console.log('Schedule date in UpdateSchedule: ', scheduleDate)

  // Schedule Info State
  const [info, setInfo] = useState({
    scheduleId: scheduleId,
    scheduleDate: scheduleDate
      ? moment(scheduleDate, "YYYY-MM-DD").toDate()
      : null,
    fromTime: fromTime ? moment(fromTime, "HH:mm:ss").toDate() : null,
    toTime: toTime ? moment(toTime, "HH:mm:ss").toDate() : null,
    duration: duration ? moment(duration, "HH:mm:ss").toDate() : null,
    technicianId: technicianId,
    isSentToTechnician,
  });

  // Close the modal when successful update
  useEffect(() => {
    if(isSuccess) {
      setTimeout(() => {

        dispatch(closeModal())
      }, 1000)
    }
  }, [isSuccess])


  // console.log("state updated: ", info);
  // useEffect(() => {
  //   console.log("state updated: ", info);
  // }, []);

  // handle update schedule submit
  const handleUpdateScheduleData = () => {
    const { fromTime, toTime, duration } = info;



    const scheduleStatus = calculateScheduleStatus(info);
    // console.log("Scheudle STatus in update: ", scheduleStatus);

    const isScheduleOkToUpdate = checkScheduleOkToUpdate(info);

    if (isScheduleOkToUpdate.status) {
      // console.log('Info is ', info)
      const response = updateScheduleData({ info, scheduleStatus });
      // console.log("Response update schedule: ", response);
    } else {
      const toastMessage = isScheduleOkToUpdate.msg;
      showToast(toastMessage, "error", addToast);
    }

    // if (fromTime && toTime && duration) {
    //   const response = updateScheduleData(info);
    // } else if (!fromTime && !toTime && !duration) {
    //   const response = updateScheduleData(info);
    // } else {
    //   const toastMessage = "One or more schedule timing is empty!";
    //   console.log(toastMessage);
    //   showToast(toastMessage, "error", addToast);
    // }
  };
  return (
    // The Modal Component is inside JobsModal. These will be injected into
    // the modal when it is opened
    <>
      <Modal.Header closeButton>
        <Modal.Title>Update Schedule Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="update-schedule-data-modal">
          {(isSuccess || isError) && (
            <Alert variant={isSuccess ? "success" : "danger"}>
              {isSuccess
                ? "Schedule Data Saved Successfully!"
                : isError
                ? "Could not Save. Please Try Again !"
                : ""}
            </Alert>
          )}

          <UpdateScheduleDataForm
            // schedule={currentSchedule}
            info={info}
            setInfo={setInfo}
          />
        </section>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => handleUpdateScheduleData()}>
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

export default UpdateScheduleDataContent;
