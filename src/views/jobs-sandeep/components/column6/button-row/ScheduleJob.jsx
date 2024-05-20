import React from "react";
import { MdAssignmentAdd } from "react-icons/md";
import { useDispatch } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { openModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import "./ScheduleJob.scss";

const ScheduleJob = ({ jobId }) => {
  //
  const dispatch = useDispatch();

  const tooltip = <Tooltip>Create New Schedule for Job</Tooltip>;

  const handleScheduleButtonClick = () => {
    dispatch(
      openModal({
        componentKey: "scheduleJobContent",
        size: "xl",
        data: {
          jobId,
        },
      })
    );
  };

  return (
    <>
      <OverlayTrigger overlay={tooltip} trigger={["hover", "focus"]}>
        <button
          className="button-row-icon create-schedule-icon"
          onClick={handleScheduleButtonClick}
        >
          <MdAssignmentAdd />
        </button>
      </OverlayTrigger>
    </>
  );
};

export default ScheduleJob;
