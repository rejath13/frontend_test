import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
// import {
//   getJobDetails,
//   getSingleJob,
// } from "../../../../../store/slices/jobs/jobSlice";
import {
  closeModal,
  getCurrentScheduleData,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import { Form } from "react-bootstrap";
import moment from "moment";

// import ScheduleJobInfoForm from "../../../../jobs-sandeep/components/modals/modal-contents/schedule-job-forms/ScheduleJobInfoForm";
// import ScheduleContactInfoForm from "../../../../jobs-sandeep/components/modals/modal-contents/schedule-job-forms/ScheduleContactInfoForm";
import { useRepeatScheduleMutation } from "../../../../../store/api/scheduler/schedulerApi";
import "./RepeatScheduleContent.scss";
import RepeatScheduleContactInfoForm from "./forms/repeat-schedule/RepeatScheduleContactInfoForm";
// import RepeatScheduleDateForm from "./forms/repeat-schedule/RepeatScheduleDateForm";
// import UpdateScheduleDataForm from "./forms/UpdateScheduleDataForm";
import RepeatScheduleDataForm from "./forms/repeat-schedule/RepeatScheduleDataForm";
import RepeatSchedulePriorityForm from "./forms/repeat-schedule/RepeatSchedulePriorityForm";
import RepeatScheduleQuantitiesForm from "./forms/repeat-schedule/RepeatScheduleQuantitiesForm";
import RepeatScheduleAdminCommentForm from "./forms/repeat-schedule/RepeatScheduleAdminCommentForm";
// import RepeatScheduleLocationForm from "./forms/repeat-schedule/RepeatScheduleLocationForm";
import RepeatScheduleJobInfo from "./forms/repeat-schedule/RepeatScheduleJobInfo";
import LocatorAdminLocationContainer from "../../components/google-maps/LocatorAdminLocationContainer";
import {
  getGoogleMapLocation,
  setGoogleMapLocation,
} from "../../../../../store/slices/google-maps/googleMapSlice";
import {
  calculateScheduleStatus,
  checkJobAndScheduleQty,
} from "../../../helpers/schedule-helper";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import { useToasts } from "react-toast-notifications";

const RepeatScheduleContent = () => {
  const dispatch = useDispatch();
  //
  const { addToast } = useToasts();

  // Get Current Schedule from Modal State
  const schedule = useSelector(getCurrentScheduleData);
  // console.log("Current schedule : ", schedule);
  const { fromTime, duration, toTime } = schedule;

  useEffect(() => {
    dispatch(
      setGoogleMapLocation({
        address: schedule?.location,
        lat: parseFloat(schedule?.lat),
        lng: parseFloat(schedule?.lng),
      })
    );
  }, []);

  const position = useSelector(getGoogleMapLocation);

  console.log('Schedule in repeat schedule content: ', schedule);

  const [repeatForm, setRepeatForm] = useState({
    scheduleId: schedule?.id,
    jobId: schedule?.job?.id,
    salesPlusId: schedule?.salesPlus?.id,
    contactName: schedule?.contactName,
    contactPhone: schedule?.contactPhone,
    scheduleDate: moment(schedule?.scheduleDate, "YYYY-MM-DD").toDate(),
    fromTime: fromTime ? moment(fromTime, "HH:mm:ss").toDate() : null,
    duration: duration ? moment(duration, "HH:mm:ss").toDate() : null,
    toTime: toTime ? moment(toTime, "HH:mm:ss").toDate() : null,
    technicianId: schedule?.technicianId,
    schedQtyNew: schedule?.qtyNew,
    schedQtyMigration: schedule?.qtyMigration,
    schedQtyTrading: schedule?.qtyTrading,
    schedQtyService: schedule?.qtyService,
    schedQtyOthers: schedule?.qtyOthers,
    isHighPriority: schedule?.isHighPriority,
    commentAdmin: schedule?.commentAdmin,
    location: schedule?.location,
    coordinates: schedule?.coordinates,
  });

  useEffect(() => {
    setRepeatForm((prevForm) => ({
      ...prevForm,
      location: position?.address,
      lat: position?.lat,
      lng: position?.lng,
    }));
  }, [position?.address, position?.lat, position?.lng]);

  // Get Current JobId from Modal State
  // const jobId = useSelector(getCurrentJobId);
  // useEffect(() => {
  //   // Get Current Job Details if job id exists
  //   if (jobId) {
  //     dispatch(getSingleJob(jobId));
  //   }
  // }, [jobId]);

  // const job = useSelector(getJobDetails);

  // useEffect(() => {
  //   if (job) {
  //     dispatch(
  //       setJobInfo({
  //         jobId: job?.id,
  //         salesPlusId: job?.salesPlus?.id ?? "",
  //         companyName: job?.salesPlus?.companyName ?? "",
  //         contactName: job?.salesPlus?.customerName ?? "",
  //         contactPhone: job?.salesPlus?.customerPhone ?? "",
  //         schedQtyNew: job?.salesPlus?.quantityNew ?? "",
  //         schedQtyService: job?.salesPlus?.quantityService ?? "",
  //         schedQtyMigrate: job?.salesPlus?.quantityMigrate ?? "",
  //         schedQtyTrading: job?.salesPlus?.quantityTrading ?? "",
  //       })
  //     );
  //   }
  // }, [job]);

  const [repeatSchedule, { isLoading, isSuccess, isError }] =
    useRepeatScheduleMutation();

  const handleScheduleSubmit = async () => {
    // Dispatch createSchedule Mutation here
    // console.log(
    //   "Calculated Schedule Status: ",
    //   calculateScheduleStatus(repeatForm)
    // );
    console.log("schedule is ", schedule?.salesPlus);
    console.log("Repeat Form is ", repeatForm);
    const isJobAndScheduleQtyOk = checkJobAndScheduleQty(schedule, repeatForm);

    if (isJobAndScheduleQtyOk.status) {
      repeatSchedule({
        repeatForm,
        scheduleStatus: calculateScheduleStatus(repeatForm),
      });
    } else {
      const toastMessage = isJobAndScheduleQtyOk.msg;
      showToast(toastMessage, "error", addToast);
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
        <Modal.Title>Repeat Schedule</Modal.Title>
        <RepeatScheduleJobInfo schedule={schedule} />
      </Modal.Header>
      <Modal.Body>
        <section className="repeat-schedule-job-modal">
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
              <RepeatScheduleContactInfoForm
                repeatForm={repeatForm}
                setRepeatForm={setRepeatForm}
              />
              <RepeatSchedulePriorityForm
                repeatForm={repeatForm}
                setRepeatForm={setRepeatForm}
              />
            </div>
          </div>
          <div className="form-section">
            <div className="form-row ">
              <RepeatScheduleDataForm
                repeatForm={repeatForm}
                setRepeatForm={setRepeatForm}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="form-row ">
              <div className="quantities-row">
                <RepeatScheduleQuantitiesForm
                  repeatForm={repeatForm}
                  setRepeatForm={setRepeatForm}
                />
              </div>

              <div className="admin-comment">
                <RepeatScheduleAdminCommentForm
                  repeatForm={repeatForm}
                  setRepeatForm={setRepeatForm}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
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
        <Button variant="success" onClick={() => handleScheduleSubmit()}>
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
