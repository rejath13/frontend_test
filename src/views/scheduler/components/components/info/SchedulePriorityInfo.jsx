import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToggleSchedulePriorityMutation } from "../../../../../store/api/scheduler/schedulerApi";

import { PriorityIcon } from "../../icons";
import { useToasts } from "react-toast-notifications";
import { checkScheduleExpiry } from "../../../helpers/schedule-helper";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";

const SchedulePriorityInfo = ({ schedule }) => {
  //
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [toggleSchedulePriority, { isLoading, isError, isSuccess }] =
    useToggleSchedulePriorityMutation();

  const handlePriorityChange = async () => {
    const isScheduleExpired = checkScheduleExpiry(schedule?.scheduleDate);

    if (isScheduleExpired) {
      const toastMessage =
        '"Schedule expired! Please create a new one or repeat this one"';
      showToast(toastMessage, "error", addToast);
      return;
    }
    const response = await toggleSchedulePriority({
      scheduleId: schedule.id,
      isHighPriority: !schedule.isHighPriority,
    });

    // dispatch(
    //   openModal({
    //     componentKey: "togglePriorityContent",
    //     size: "sm",
    //     data: { schedule },
    //   })
    // );
  };

  useEffect(() => {
    let toastMessage = ""; // Declare within useEffect

    if (isError) {
      toastMessage = "Something went wrong!";
    } else if (isSuccess) {
      toastMessage = `Schedule-${schedule.id} Priority updated successfully!`;
    }

    if (toastMessage) {
      showToast(toastMessage, isError ? "error" : "success", addToast);
    }
  }, [isError, isSuccess]);

  return (
    <>
      <p
        className={`priority-icon ${
          !schedule.isHighPriority
            ? "priority-icon-disabled"
            : "priority-icon-enabled"
        }`}
        onClick={handlePriorityChange}
      >
        {<PriorityIcon />}
      </p>
    </>
  );
};

export default SchedulePriorityInfo;
