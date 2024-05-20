import React from "react";
import { Breadcrumb, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getScheduleAppliedFilters } from "../../../../../store/slices/scheduler/schedulerFilterSlice";
import "./ScheduleAppliedFilters.scss";

const ScheduleAppliedFilters = ({ schedulesCount }) => {
  //
  const appliedFilters = useSelector(getScheduleAppliedFilters);
  //   console.log("Applied Filters: ", appliedFilters);
  return (
    <div id="schedule-applied-filters">
      <p className="applied-filters-count">
        <Badge
          variant={`${schedulesCount > 0 ? "success" : "danger"}`}
          className="applied-filters-count-badge"
        >
          {schedulesCount}
        </Badge>{" "}
        Schedules Found
      </p>
      <p className="applied-filters-heading">Filters : </p>
      <Breadcrumb className="applied-filters-breadcrumb">
        {appliedFilters &&
          appliedFilters.map((item, index) => (
            <Breadcrumb.Item
              key={index}
              className="applied-filters-breadcrumb-item"
              href="#"
            >
              {item}
            </Breadcrumb.Item>
          ))}
      </Breadcrumb>
    </div>
  );
};

export default ScheduleAppliedFilters;
