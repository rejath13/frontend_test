import React from "react";
import ScheduleCard from "../components/ScheduleCard";

const SchedulesView = ({ schedules }) => {
  return (
    <>
      {schedules &&
        schedules?.map((schedule, index) => (
          <ScheduleCard key={index} schedule={schedule} />
        ))}
    </>
  );
};

export default SchedulesView;
