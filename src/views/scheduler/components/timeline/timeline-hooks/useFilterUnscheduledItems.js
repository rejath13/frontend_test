import { useState, useEffect } from "react";

const useFilterUnscheduledItems = (unscheduledItems, searchText) => {
  const [schedules, setSchedules] = useState(unscheduledItems);
  useEffect(() => {
    if (searchText) {
      console.log("search text not empty", searchText);
      const filteredSchedules = schedules.filter(
        (schedule) => {
          //   console.log("companyName: ", schedule?.salesPlus?.companyName);
          return schedule?.salesPlus?.companyName
            .toLowerCase()
            .includes(searchText.toLowerCase());
        }
        // searchText.includes(schedule?.salesPlus?.companyName)
      );
      console.log("filtered schedule: ", filteredSchedules);
      setSchedules((prev) => filteredSchedules);
    } else {
      console.log("Search text  empty");
      setSchedules(unscheduledItems);
    }
  }, [searchText]);
  return schedules;
};

export default useFilterUnscheduledItems;
