import moment from "moment";
import { capitalizeFirstLetter } from "../../../jobs-sandeep/helpers/job-card-helper";
export const formatTimelineResources = (technicians) => {
  const resources = [];
  technicians?.forEach((technician) => {
    const newResource = {
      id: technician?.id,
      title: technician?.name,
    };
    resources.push(newResource);
  });
  return resources;
};

export const formatTimelineEvents = (schedules) => {
  const events = [];
  schedules?.forEach((schedule) => {
    const { scheduleDate, fromTime, toTime } = schedule;
    // Combine scheduleDate and fromTime to create the start moment
    const startMoment = moment(
      `${scheduleDate} ${fromTime}`,
      "YYYY-MM-DD HH:mm:ss"
    );

    // Combine scheduleDate and toTime to create the end moment
    const endMoment = moment(
      `${scheduleDate} ${toTime}`,
      "YYYY-MM-DD HH:mm:ss"
    );
    const newEvent = {
      id: schedule?.id,
      resourceId: schedule?.technician?.id,
      title: capitalizeFirstLetter(schedule?.salesPlus?.companyName),
      start: startMoment.utc().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      end: endMoment.utc().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      // backgroundColor: getEventBgColor(schedule),
      extendedProps: {
        scheduleStatus: schedule?.scheduleStatus,
        isSentToTechnician: schedule?.isSentToTechnician,
      },
    };
    // console.log("timeline from time: ", schedule?.fromTime);
    events.push(newEvent);
  });
  return events;
};

export const eventRender = ({ event, view }) => {
  const eventBgColor = () => {
    switch (event.extendedProps.scheduleStatus) {
      case "unscheduled":
        return "red";
      case "scheduled":
        return "purple";
      case "assigned":
        return "#0d6efd";
      case "partial":
        return "#ffc107";
      case "completed":
        return "#198754";
      default:
        return "white";
    }
  };

  const eventStyles = {
    backgroundColor: eventBgColor(),
    color: event.textColor || "#fff",
    // border: "1px solid  #3788d8",
    borderRadius: "5px",
    width: "100%",
    padding: "2px 5px",
    minHeight: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    whiteSpace: "nowrap",
    overflow: "hidden", // Optional: Hide any overflow content if needed
    textOverflow: "ellipsis", // Optional: Show ellipsis (...) for overflowed text
    boxSizing: "border-box",
  };

  return (
    <div style={eventStyles}>
      {/* {event.title} */}
      <span>{event.title}</span>
      <span>{event?.resource?.title}</span>
    </div>
  );
};

export const getEventBgColor = (schedule) => {
  switch (schedule.scheduleStatus) {
    case "unscheduled":
      return "red";
    case "scheduled":
      return "purple";
    case "assigned":
      return "violet";
    case "partial":
      return "orange";
    case "completed":
      return "green";
    default:
      return "white";
  }
};

export const findUnscheduledItems = (schedules) => {
  // console.log("duration");
  const unscheduledItems = schedules.filter((schedule) => !schedule?.duration);
  // console.log("Unscheduled Items: ", unscheduledItems);
  return unscheduledItems;
};

// export const calculateDuration = (fromTime, toTime) => {
//   const logMessage = `Inside calculateDuration :
//     From Time: ${fromTime}
//     To Time: ${toTime}
//   `;
//   console.log(logMessage);
// };
