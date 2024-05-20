import { useState, useEffect } from "react";
import { formatTimelineEvents } from "../timeline-helper";

const useFormatSchedulesToEvents = (schedules) => {
  const [events, setEvents] = useState(formatTimelineEvents(schedules));

  useEffect(() => {
    setEvents(formatTimelineEvents(schedules));
  }, [schedules]);
  return { events, setEvents };
};

export default useFormatSchedulesToEvents;
