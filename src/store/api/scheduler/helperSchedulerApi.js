import store from "../../index";
import {
  getScheduleFilterPriority,
  getScheduleFiltersStatusArray,
  getTechnicianFilter,
} from "../../slices/scheduler/schedulerFilterSlice";
import { setScheduleCounts } from "../../slices/scheduler/scheduleCountSlice";

export function calculateScheduleStatusCounts(data) {
  const scheduleStatuses = [
    "unscheduled",
    "scheduled",
    "assigned",
    "partial",
    "completed",
  ];
  const counts = {};
  scheduleStatuses.map((status) => {
    counts[`${status}Count`] = data.filter(
      (item) => item.scheduleStatus === status
    ).length;
  });
  store.dispatch(setScheduleCounts(counts));

  //   console.log("Counts: ", counts);
}

export function transformData(data, filters) {
  // console.log("Data: ", data);
  calculateScheduleStatusCounts(data);

  // Get the status array filters from the filter slice
  const statusArrayFilters = getScheduleFiltersStatusArray(store.getState());
  const filterTechnicianId = getTechnicianFilter(store.getState());
  const isHighPriority = getScheduleFilterPriority(store.getState());

  let filteredData = data;
  if (statusArrayFilters.length > 0) {
    filteredData = filteredData.filter((item) =>
      statusArrayFilters.includes(item.scheduleStatus)
    );
  }
  if (filterTechnicianId) {
    filteredData = filteredData.filter(
      (item) => filterTechnicianId === item.technicianId.toString() //item.technicianId is Int and filterTechnicianId is String
    );
    calculateScheduleStatusCounts(filteredData);
  }
  if (isHighPriority) {
    filteredData = filteredData.filter((item) => item.isHighPriority);
    calculateScheduleStatusCounts(filteredData);
  }

  // console.log("Filtered data: ", filteredData);

  return filteredData;
}
