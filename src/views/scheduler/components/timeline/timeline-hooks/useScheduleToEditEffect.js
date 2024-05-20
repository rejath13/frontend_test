import { useEffect, useState } from "react";

const useScheduleToEditEffect = (
  schedules,
  scheduleToEdit,
  setScheduleToEdit
) => {
  useEffect(() => {
    setScheduleToEdit((prevSchedule) => {
      if (prevSchedule) {
        const temp = schedules.find((item) => item.id === prevSchedule.id);
        return temp;
      } else {
        return null;
      }
    });
  }, [schedules, scheduleToEdit]);
};

export default useScheduleToEditEffect;
