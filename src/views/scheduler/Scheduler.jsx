import React, { useEffect } from "react";
import "./Scheduler.scss";
import { useSelector } from "react-redux";
import { selectCurrentMainNav } from "../../store/slices/scheduler/schedulerMainNavSlice";
import {
  SchedulerFilterSection,
  SchedulerListSection,
  SchedulerMainNav,

} from "./components";
import SchedulesModal from "./components/modals/SchedulesModal";
import useGetUnscheduledItems from "./components/timeline/timeline-hooks/useGetUnscheduledItems";
// import TimeZoneFixerTemp from "./components/TimeZoneFixerTemp";


const Scheduler = () => {
  // Scheduler Component

    // // Find Unscheduled Items
    // const unscheduledItems = useGetUnscheduledItems(schedules);
    // console.log("Unscheduled items: ", unscheduledItems);
  // useEffect(() => {

  // }, [])
  const currentMainNav = useSelector(selectCurrentMainNav);
  return (
    <div className="scheduler">
      <SchedulesModal />
      <SchedulerMainNav />
      {/* <TimeZoneFixerTemp /> Can remove later created for testing timezone issues.. */}
      <SchedulerFilterSection currentMainNav={currentMainNav} />
      <SchedulerListSection currentMainNav={currentMainNav} />
    </div>
  );
};

export default Scheduler;
