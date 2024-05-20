import { useSelector, useDispatch } from "react-redux";
import { findUnscheduledItems } from "../timeline-helper";
import { useEffect } from "react";
import { setUnscheduledItems } from "../../../../../store/slices/scheduler/timelineFilterSlice";

const useGetUnscheduledItems = (schedules) => {
  //
  const dispatch = useDispatch();

  const unscheduledItems = findUnscheduledItems(schedules);
  useEffect(() => {
    if (unscheduledItems.length > 0) {
      dispatch(setUnscheduledItems(unscheduledItems));
    }
  }, [unscheduledItems.length]);
  // return unscheduledItems;
};

export default useGetUnscheduledItems;
