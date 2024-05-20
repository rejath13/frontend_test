import React from "react";
import { Badge } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { useToasts } from "react-toast-notifications";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import "./ScheduleQuantitiesInfo.scss";
import { checkScheduleExpiry } from "../../../helpers/schedule-helper";

const ScheduleQuantitiesInfo = ({ schedule }) => {
  //
  const dispatch = useDispatch();

  const { addToast } = useToasts();

  const handleUpdateScheduleQuantities = () => {
    const isScheduleExpired = checkScheduleExpiry(schedule?.scheduleDate);
    if (isScheduleExpired) {
      const toastMessage =
        "Schedule expired! Please create a new one or repeat this one";

      showToast(toastMessage, "error", addToast);
    } else {
      dispatch(
        openModal({
          componentKey: "updateScheduleQuantitiesContent",
          size: "lg",
          data: {
            schedule,
          },
        })
      );
    }
  };

  return (
    <p
      className="flex-row schedule-quantities-info"
      onClick={handleUpdateScheduleQuantities}
    >
      <span className="label-name">Sched Qty :</span>
      <span className="flex-row qty-row">
        {schedule.qtyNew > 0 && (
          <Badge variant="primary">N{schedule.qtyNew}</Badge>
        )}
        {schedule.qtyMigration > 0 && (
          <Badge variant="warning">M{schedule.qtyMigration}</Badge>
        )}
        {schedule.qtyTrading > 0 && (
          <Badge variant="secondary">T{schedule.qtyTrading}</Badge>
        )}
        {schedule.qtyService > 0 && (
          <Badge variant="success">S{schedule.qtyService}</Badge>
        )}
        {schedule.qtyOthers > 0 && (
          <Badge variant="info">O{schedule.qtyOthers}</Badge>
        )}
      </span>
    </p>
  );
};

export default ScheduleQuantitiesInfo;
