import React from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  getScheduleFiltersAllPendingStatus,
  toggleScheduleFiltersAllPending,
} from "../../../../../store/slices/scheduler/schedulerFilterSlice";

const ScheduleFilterAllPending = () => {
  //
  const dispatch = useDispatch();
  const allPendingStatus = useSelector(getScheduleFiltersAllPendingStatus);
  return (
    <Button
      size="sm"
      variant={allPendingStatus ? "warning" : "outline-secondary"}
      style={{ color: allPendingStatus ? "white" : "" }}
      onClick={() => dispatch(toggleScheduleFiltersAllPending())}
    >
      All Pending
    </Button>
  );
};

export default ScheduleFilterAllPending;
