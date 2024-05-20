import React from "react";
import { Badge } from "react-bootstrap";
import { LocationIcon, TechnicianIcon } from "../../icons";
import {
  implementationTypeStyles,
  getHoursAndMinutes,
  formatToMomentDate,
  formatToMomentTime,
} from "../../../helpers/schedule-info-helper";
import { openModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { useDispatch } from "react-redux";
import ScheduleLocationInfo from "./ScheduleLocationInfo";
import ScheduleQuantitiesInfo from "./ScheduleQuantitiesInfo";
import { checkScheduleExpiry } from "../../../helpers/schedule-helper";
import { useToasts } from "react-toast-notifications";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import "./ScheduleInfo.scss";

const ScheduleInfo = ({ schedule }) => {
  //
  const dispatch = useDispatch();

  const { fromTime, toTime, scheduleDate, duration } = schedule;
  console.log(`
  Schedule Slot:
  From Time: ${fromTime},
  To Time: ${toTime},
  Duration : ${duration}
  `)
  const { addToast } = useToasts();

  // console.log("Schedule: ", schedule);

  // console.log(fromTime, toTime, scheduleDate);
  const { hours: durationHours, minutes: durationMinutes } =
    getHoursAndMinutes(duration);

  const handleUpdateScheduleData = () => {
    const isScheduleExpired = checkScheduleExpiry(schedule?.scheduleDate);

    if (!isScheduleExpired) {
      dispatch(
        openModal({
          componentKey: "updateScheduleDataContent",
          size: "xl",
          data: {
            schedule: schedule,
          },
        })
      );
    } else {
      const toastMessage =
        "Schedule expired!. Either Repeat Schedule or Create a new one";
      showToast(toastMessage, "error", addToast);
    }
  };

  const formatTimeSlot = (duration, fromTime, toTime) => {
    if (!duration || !fromTime || !toTime) {
      return "Not Scheduled";
    } else {
      return `${formatToMomentTime(fromTime)} - ${formatToMomentTime(toTime)}`;
    }
  };
  // console.log("Duration in scheudle card: ", duration);

  return (
    <>
      <div
        id="schedule-info-row"
        className="row1 "
        onClick={handleUpdateScheduleData}
      >
        <div className="heading-stacked" onClick={handleUpdateScheduleData}>
          <p className="label-name">Date</p>
          <p>{formatToMomentDate(scheduleDate)}</p>
        </div>
        <div className="heading-stacked">
          <p className="label-name">Time Slot</p>
          <p>
            <Badge
              variant={`${
                !duration || !fromTime || !toTime ? "danger" : "success"
              }`}
              className="badge-time-slot"
            >
              {formatTimeSlot(duration, fromTime, toTime)}
            </Badge>
          </p>
        </div>
        <div className="heading-stacked">
          <p className="label-name">Duration</p>
          <p>
            {durationHours > 0 ? `${durationHours} hrs ` : ""}
            {durationMinutes > 0 ? ` ${durationMinutes} mins` : ""}
            {/* {isDurationZero(duration) && <Badge variant="danger">0</Badge>} */}
          </p>
        </div>
        <div className="heading-stacked">
          <p className="label-name">Technician</p>
          <p>
            <Badge
              size="lg"
              className={
                parseInt(schedule?.technician?.id) === 1
                  ? "badge-technician bg-danger"
                  : "badge-technician"
              }
            >
              <TechnicianIcon />
              <span>{schedule?.technician?.name}</span>
            </Badge>
          </p>
        </div>
      </div>
      <div className="row2">
        <div className="flex-row space-between">
          <div className="implementation-type">
            <p className="flex-row">
              <span className="label-name">Imp. Type :</span>
              <span
                style={implementationTypeStyles(
                  schedule?.salesPlus?.implementationType
                )}
              >
                {schedule?.salesPlus?.implementationType}
              </span>
            </p>
          </div>
          <div className="quantities">
            <ScheduleQuantitiesInfo schedule={schedule} />
          </div>
        </div>
        <div className="flex-row space-between">
          <ScheduleLocationInfo schedule={schedule} />
        </div>
      </div>
    </>
  );
};

export default ScheduleInfo;
