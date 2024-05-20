import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { capitalizeFirstLetter } from "../../../jobs-sandeep/helpers/job-card-helper";
import { getTimelineActiveStatus } from "../../../../store/slices/scheduler/schedulerMainNavSlice";
import "./SchedulerFilterSection.scss";
import TimelineFilters from "../timeline/timeline-filters/TimelineFilters";
import ScheduleFilters from "../filters/ScheduleFilters";

const SchedulerFilterSection = ({ currentMainNav }) => {
  //
  const isTimelineActive = useSelector(getTimelineActiveStatus);

  return (
    <section className="scheduler-filter-section">
      {/* {capitalizeFirstLetter(currentMainNav.link)} SchedulerFilterSection */}
      {!isTimelineActive ? <ScheduleFilters /> : <TimelineFilters />}
    </section>
  );
};

export default SchedulerFilterSection;
