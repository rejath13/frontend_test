import React from "react";
import { Badge } from "react-bootstrap";
import { formatScheduleStatus } from "../../../helpers/schedule-status-row-helper";
import { capitalizeFirstLetter } from "../../../../jobs-sandeep/helpers/job-card-helper";
import { useDispatch } from "react-redux";
import { openModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import "./ScheduleStatusRow.scss";

const ScheduleStatusRow = ({ schedule }) => {
  //
  const dispatch = useDispatch();
  const { scheduleStatus: status, isTrained, isPaid, paymentType } = schedule;
  const {
    color: badgeBgColor,
    textColor: badgeTextColor,
    scheduleStatus,
  } = formatScheduleStatus(status);
  const defaultModalProperties = {
    componentKey: "",
    size: "sm",
    data: { schedule },
  };

  const handleUpdateSchedule = (componentKey) => {
    dispatch(
      openModal({
        componentKey,
        size: "lg",
        data: { schedule },
      })
    );
  };

  return (
    <>
      <div className="row1 schedule-status-row">
        <div
          className="heading-stacked schedule-status"
          onClick={() => handleUpdateSchedule("updateScheduleStatusContent")}
        >
          <p className="label-name">Sched Status</p>
          <Badge
            style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
          >
            {scheduleStatus && scheduleStatus}
          </Badge>
        </div>
        <div
          className="heading-stacked schedule-trained-status"
          onClick={() =>
            handleUpdateSchedule("updateScheduleTrainedStatusContent")
          }
        >
          <p className="label-name">Trained</p>
          <Badge variant={isTrained ? "success" : "danger"}>
            {isTrained ? "Yes" : "No"}
          </Badge>
        </div>
        <div
          className="heading-stacked schedule-payment-status"
          onClick={() =>
            handleUpdateSchedule("updateSchedulePaymentStatusContent")
          }
        >
          <p className="label-name">Payment</p>
          <Badge variant={isPaid ? "success" : "danger"}>
            {isPaid ? "Paid" : "Not Paid"}
          </Badge>
          {isPaid && paymentType && (
            <p className="tiny-info">{capitalizeFirstLetter(paymentType)}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ScheduleStatusRow;
