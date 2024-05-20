import React from "react";
import { useSelector } from "react-redux";
import { getTimelineFilterScheduleDate } from "../../../../../../store/slices/scheduler/timelineFilterSlice";
import moment from "moment";
import "./TimelineFilterDateText.scss";

const TimelineFilterDateText = () => {
  //
  let timelineScheduleDate = useSelector(getTimelineFilterScheduleDate);
  timelineScheduleDate = timelineScheduleDate
    ? moment(timelineScheduleDate)
    : moment();
  timelineScheduleDate = (
    <>
      <span>{timelineScheduleDate.format("MMMM D, YYYY")}</span>
      <span>{timelineScheduleDate.format("dddd")}</span>
    </>
  );

  return (
    <div id="timeline-date-text-container">
      <p className="timeline-date-text">{timelineScheduleDate}</p>
    </div>
  );
};

export default TimelineFilterDateText;
