import { useState, useEffect } from "react";
import moment from "moment";

const useCurrentCalendarDateEffect = (scheduleDate) => {
  const [currentCalendarDate, setCurrentCalendarDate] = useState();
  useEffect(() => {
    setCurrentCalendarDate((prevDate) =>
      scheduleDate
        ? moment(scheduleDate).utc().format("YYYY-MM-DDTHH:mm:ss[Z]")
        : moment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]")
    );
  }, [scheduleDate]);
  return currentCalendarDate;
};

export default useCurrentCalendarDateEffect;
