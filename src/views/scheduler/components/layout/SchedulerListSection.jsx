import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../../jobs-sandeep/helpers/job-card-helper";
import {
  useFetchSchedulesQuery,
  useFetchTimelineSchedulesQuery,
} from "../../../../store/api/scheduler/schedulerApi";
import SchedulesView from "./SchedulesView";
import TimelineView from "../timeline/TimelineView";
import { getTimelineActiveStatus } from "../../../../store/slices/scheduler/schedulerMainNavSlice";
import { getSchedulerFilterScheduleDate } from "../../../../store/slices/scheduler/schedulerFilterSlice";
import "./SchedulerListSection.scss";
import ScheduleAppliedFilters from "../filters/components/ScheduleAppliedFilters";

const SchedulerListSection = ({ currentMainNav }) => {
  // SchedulerListSection Component
  const isTimelineActive = useSelector(getTimelineActiveStatus);
  const filterScheduleDate = useSelector(getSchedulerFilterScheduleDate);
  const filters = useSelector((state) => state.schedulerFilter);
  // console.log("Filters: ", filters);
  const timelineFilters = useSelector((state) => state.timelineFilter);
  // console.log("Timeline filters: ", timelineFilters);

  const [backendFilters, setBackendFilters] = useState({});

  // useEffect(() => {
  //   console.log(
  //     "Timefilter activated. Clearing backendFilters and setting timelinefilters to backendFilters"
  //   );
  //   setBackendFilters((prevFilters) => ({
  //     scheduleDate: timelineFilters?.scheduleDate,
  //   }));
  // }, [timelineFilters.scheduleDate]);

  useEffect(() => {
    // console.log("useeffect scheudle date changed", filters.scheduleDate);
    setBackendFilters((prevFilters) => ({
      ...prevFilters,
      scheduleDate: filters?.scheduleDate,
      checkboxes: filters?.checkboxes,
      technicianId: filters?.technicianId,
      isHighPriority: filters?.isHighPriority,
      allPendingFilter: filters?.allPendingFilter,
    }));
  }, [
    filters.scheduleDate,
    filters.checkboxes,
    filters.technicianId,
    filters.isHighPriority,
    filters.allPendingFilter,
  ]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setBackendFilters((prevFilters) => ({
        ...prevFilters,
        scheduleSearchboxValue: filters?.scheduleSearchboxValue,
      }));
    }, [200]);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [filters.scheduleSearchboxValue]);

  // console.log("backendfilters: ", backendFilters);

  // Fetch schedules using rtk-query and pass filters
  const {
    data: schedules,
    isLoading,
    isError,
    refetch,
  } = useFetchSchedulesQuery(backendFilters);
  // console.log("Normal schedules data: ", schedules);

  const { data: timelineSchedules } =
    useFetchTimelineSchedulesQuery(timelineFilters);
  // console.log("Timeline schedules data: ", timelineSchedules);

  useEffect(() => {
    refetch();
  }, [backendFilters]);

  // console.log("Schedules: ", schedules);
  // console.log("Current main nav: ", currentMainNav);

  return (
    <section className="scheduler-list-section">
      {/* <h6 className="text-center pt-2">
        {capitalizeFirstLetter(currentMainNav.link)} - SchedulerListSection
      </h6> */}
      {currentMainNav.link === "schedules" && (
        <ScheduleAppliedFilters schedulesCount={schedules?.length} />
      )}

      {/* Schedules View */}
      {!isTimelineActive && schedules && (
        <SchedulesView schedules={schedules} />
      )}

      {/* Timeline View */}
      {isTimelineActive && schedules && (
        <TimelineView schedules={timelineSchedules} />
      )}
    </section>
  );
};

export default SchedulerListSection;
