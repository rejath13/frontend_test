import React, { useEffect, useState } from "react";
import TimelineFilterDatePicker from "./components/TimelineFilterDatePicker";
import { useSelector } from "react-redux";
import {
  getTimelineFilterScheduleDate,
  getUnscheduledItems,
} from "../../../../../store/slices/scheduler/timelineFilterSlice";
import TimelineFilterDateText from "./components/TimelineFilterDateText";
import UnscheduledItems from "./components/UnscheduledItems";
import ShowTimeRange from "./components/ShowTimeRange";
import "./TimelineFilters.scss";

const TimelineFilters = () => {
  //
  const scheduleDate = useSelector(getTimelineFilterScheduleDate);
  let unscheduledItems = useSelector(getUnscheduledItems);
  console.log('Unscheduled Items in TimelineFilters: ', unscheduledItems)
  // console.log("Timeline filers unscheduled: ", unscheduledItems);
  // Filter unscheduled items based on the current date selected in timeline filters
  // console.log(`
  // Unscheduled date: ${unscheduledItems[0]?.scheduleDate},
  // schedule date: ${scheduleDate}
  // `);
  unscheduledItems = unscheduledItems.filter(
    (item) => item.scheduleDate === scheduleDate
  );



  return (
    <div id="timeline-filters">
      <TimelineFilterDatePicker />
      <TimelineFilterDateText />
      {unscheduledItems.length > 0 && (
        <UnscheduledItems unscheduledItems={unscheduledItems} />
      )}

      <ShowTimeRange />
    </div>
  );
};

export default TimelineFilters;
