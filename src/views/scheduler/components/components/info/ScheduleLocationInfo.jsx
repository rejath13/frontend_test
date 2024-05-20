import React from "react";
import { LocationIcon } from "../../icons";
import { useDispatch } from "react-redux";
import { openModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { checkScheduleExpiry } from "../../../helpers/schedule-helper";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import { useToasts } from "react-toast-notifications";
import "./ScheduleLocationInfo.scss";

const ScheduleLocationInfo = ({ schedule }) => {
  //
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { location, coordinates } = schedule;

  const handleUpdateScheduleLocation = () => {
    const isScheduleExpired = checkScheduleExpiry(schedule?.scheduleDate);
    if (isScheduleExpired) {
      const toastMessage =
        "Schedule expired! Please create a new one or repeat this one";
      showToast(toastMessage, "error", addToast);
    } else {
      dispatch(
        openModal({
          componentKey: "updateScheduleLocationContent",
          size: "lg",
          data: {
            schedule,
          },
        })
      );
    }
  };
  return (
    <div id="schedule-location-info" onClick={handleUpdateScheduleLocation}>
      <p className="location">
        <span className="location-icon">
          <LocationIcon />
        </span>
        <span>
          {location && `${location}, `}
          {coordinates}
        </span>
      </p>
    </div>
  );
};

export default ScheduleLocationInfo;
