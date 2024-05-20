import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import {
  getJobDetails,
  getSingleJob,
} from "../../../../../store/slices/jobs/jobSlice";
import { useCreateScheduleMutation } from "../../../../../store/api/scheduler/schedulerApi";
import {
  closeModal,
  getCurrentJobId,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import "./ScheduleJobContent.scss";
import {
  ScheduleDateForm,
  ScheduleTimeForm,
  ScheduleQuantitiesForm,
  ScheduleTechnicianForm,
  SchedulePriorityForm,
  ScheduleAdminCommentForm,
} from "./schedule-job-forms";
import { setJobInfo } from "../../../../../store/slices/scheduler/schedulerFormSlice";
import ScheduleJobInfoForm from "./schedule-job-forms/ScheduleJobInfoForm";
import ScheduleContactInfoForm from "./schedule-job-forms/ScheduleContactInfoForm";
import LocatorAdminLocationContainer from "../../../../scheduler/components/components/google-maps/LocatorAdminLocationContainer";
import { getGoogleMapLocation } from "../../../../../store/slices/google-maps/googleMapSlice";
import {
  calculateScheduleStatus,
  checkJobAndScheduleQty,
  checkScheduleOkToSend,
  checkScheduleOkToUpdate,
} from "../../../../scheduler/helpers/schedule-helper";
import AssignToTechnicianForm from "./schedule-job-forms/AssignToTechnicianForm";
import { showToast } from "../../../../scheduler/helpers/schedule-update-schedule-data-helpers";
import { useToasts } from "react-toast-notifications";

const ScheduleJobContent = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const position = useSelector(getGoogleMapLocation);

  // Get Current JobId from Modal State
  const jobId = useSelector(getCurrentJobId);
  useEffect(() => {
    // Get Current Job Details if job id exists
    if (jobId) {
      dispatch(getSingleJob(jobId));
    }
  }, [jobId]);

  const job = useSelector(getJobDetails);
  useEffect(() => {
    if (job) {
      // console.log("job: ", job);
      dispatch(
        setJobInfo({
          jobId: job?.id,
          salesPlusId: job?.salesPlus?.id ?? "",
          companyName: job?.salesPlus?.companyName ?? "",
          contactName: job?.salesPlus?.customerName ?? "",
          contactPhone: job?.salesPlus?.customerPhone ?? "",
          schedQtyNew: job?.salesPlus?.quantityNew ?? "",
          schedQtyService: job?.salesPlus?.quantityService ?? "",
          schedQtyMigrate: job?.salesPlus?.quantityMigrate ?? "",
          schedQtyTrading: job?.salesPlus?.quantityTrading ?? "",
        })
      );
    }
  }, [job]);

  const [createSchedule, { isLoading, isSuccess, isError }] =
    useCreateScheduleMutation();

  // handle Create Schedule Section ======================== /
  const scheduleData = useSelector((state) => state.schedulerForm);

  const handleScheduleSubmit = async (jobId) => {
    const isScheduleOkToUpdate = checkScheduleOkToUpdate(scheduleData);

    const isJobAndScheduleQtyOk = checkJobAndScheduleQty(job, scheduleData);

    console.log("Calculated Status: ", calculateScheduleStatus(scheduleData));
    // Dispatch createSchedule Mutation here
    if (isScheduleOkToUpdate.status && isJobAndScheduleQtyOk.status) {
      console.log('Form Details in Create Schedule Content: ', scheduleData)
      createSchedule({
        formDetails: scheduleData,
        position,
        scheduleStatus: calculateScheduleStatus(scheduleData),
      });
    } else {
      if (!isScheduleOkToUpdate.status) {
        const toastMessage = isScheduleOkToUpdate.msg;
        showToast(toastMessage, "error", addToast);
      }
      if (!isJobAndScheduleQtyOk.status) {
        const toastMessage = isJobAndScheduleQtyOk.msg;
        showToast(toastMessage, "error", addToast);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        dispatch(closeModal())
      }, 1000)
    }
  }, [isSuccess])

  return (
    // The Modal Component is inside JobsModal. These will be injected into the modal when it is opened
    <>
      <Modal.Header closeButton>
        <Modal.Title>Create a Schedule</Modal.Title>
        <ScheduleJobInfoForm />
      </Modal.Header>
      <Modal.Body>
        <section className="schedule-job-modal">
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
          <div className="form-section">
            <div className="form-row ">
              <ScheduleContactInfoForm />
            </div>
          </div>
          <div className="form-section">
            <div className="form-row date-row">
              <ScheduleDateForm />
              <ScheduleTimeForm />
              <ScheduleTechnicianForm />
              <div>
                <SchedulePriorityForm />
                <AssignToTechnicianForm />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-row quantities-row">
              <ScheduleQuantitiesForm />
              <div className="admin-comment">
                <ScheduleAdminCommentForm />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              {/* <ScheduleLocationForm /> */}
              <LocatorAdminLocationContainer />
            </div>
          </div>
        </section>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Job Details Updated Successfully!"
              : isError
              ? "Could not Save Job Details. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={() => handleScheduleSubmit(jobId)}>
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

export default ScheduleJobContent;
