import { useState, useEffect } from "react";
import moment from "moment";

const useSetFullCalendarDate = (scheduleDate, calendarRef) => {
  let formattedDate = scheduleDate
    ? moment(scheduleDate).toDate().toISOString()
    : moment().toDate().toISOString();

  useEffect(() => {
    if (calendarRef.current) {
      let calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(formattedDate);
    }
  }, [scheduleDate]);
};

export default useSetFullCalendarDate;
