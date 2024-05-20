import React, { useEffect, useState, useRef } from "react";

// import FullCalendar from "@fullcalendar/react"; // must go before plugins
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline"; // a plugin!
// import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { useGetTechniciansQuery } from "../../../../store/api/jobs/jobsApi";
import { useSelector, useDispatch } from "react-redux";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import resourceTimelinePlugin from "@fullcalendar/resource-timeline"; // a plugin!
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import {
  getShowMorningTimeRange,
  getTimelineFilterScheduleDate,
} from "../../../../store/slices/scheduler/timelineFilterSlice";
import {
  formatTimelineResources,
  formatTimelineEvents,
  findUnscheduledItems,
  eventRender,
} from "./timeline-helper";
import {
  calculateDuration,
  showToast,
} from "../../helpers/schedule-update-schedule-data-helpers";

// import "./timeline.css";
import moment from "moment/moment";
import ScheduleCard from "../components/ScheduleCard";
import useCurrentCalendarDateEffect from "./timeline-hooks/useCurrentCalendarDateEffect";
import useScheduleToEditEffect from "./timeline-hooks/useScheduleToEditEffect";
import useSetFullCalendarDate from "./timeline-hooks/useSetFullCalendarDate";
import useFormatSchedulesToEvents from "./timeline-hooks/useFormatScheduleToEvents";
import {
  useUpdateScheduleTimingMutation,
  useUpdateTimelineTechnicianMutation,
} from "../../../../store/api/scheduler/schedulerApi";
import TimelineScheduleView from "./TimelineScheduleView";
import useGetUnscheduledItems from "./timeline-hooks/useGetUnscheduledItems";
import "./TimelineView.scss";
import {
  checkScheduleOkToUpdate,
  checkTimelineScheduleOkToUpdate,
  checkTimelineTechnicianOkToUpdate,
} from "../../helpers/schedule-helper";
import { useToasts } from "react-toast-notifications";
import useTechnicianUpdateSuccessToast from "./timeline-hooks/useTechnicianUpdateSuccessToast";
import useScheduleUpdateSuccessToast from "./timeline-hooks/useScheduleUpdateSuccessToast";

const TimelineView = ({ schedules }) => {
  //
  console.log('Schedules timeline view: ',)
  const [showEditSchedule, setShowEditSchedule] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);

  const calendarRef = useRef(null);
  let tempSchedule = null;

  const { addToast } = useToasts();

  const [
    updateScheduleTiming,
    {
      isLoading: isTimingLoading,
      isFetching: isTimingFetching,
      isError: isTimingError,
      isSuccess: isScheduleUpdateSuccess,
    },
  ] = useUpdateScheduleTimingMutation();
  const [
    updateTimelineTechnician,
    {
      isLoading: isTechnicianLoading,
      isFetching: isTechnicianFetching,
      isError: isTechnicianError,
      isSuccess: isTechnicianUpdateSuccess,
    },
  ] = useUpdateTimelineTechnicianMutation();

  // console.log("Schedules: ", schedules);

  // Get setting for showing timeline full day or  morning only
  const showMorningTimeRange = useSelector(getShowMorningTimeRange);

  // Find Unscheduled Items
  const unscheduledItems = useGetUnscheduledItems(schedules);
  // console.log("Unscheduled items: ", unscheduledItems);

  // Get Current Schedule Date from Timeline Filter
  let scheduleDate = useSelector(getTimelineFilterScheduleDate);

  // Get Technician list
  const { data: technicians } = useGetTechniciansQuery();

  // Format Technicians as Resources in Full Calendar Timeline Format
  const resources = formatTimelineResources(technicians);

  // Format Schedules as Events in Full Calendar Timeline Format
  const { events, setEvents } = useFormatSchedulesToEvents(schedules);

  // const currentCalendarDate = useCurrentCalendarDateEffect(scheduleDate); // Custom Hook

  useScheduleToEditEffect(schedules, scheduleToEdit, setScheduleToEdit);

  useSetFullCalendarDate(scheduleDate, calendarRef);

  // console.log("events: ", events);

  useTechnicianUpdateSuccessToast(isTechnicianUpdateSuccess);
  useScheduleUpdateSuccessToast(isScheduleUpdateSuccess);

  const handleEventClick = (info) => {
    tempSchedule = schedules.find(
      (schedule) => schedule.id === parseInt(info.event.id)
    );
    setShowEditSchedule((prevShow) => !prevShow);
    setScheduleToEdit(tempSchedule);
  };

  const handleEventDrop = async (info) => {
    const { event, oldResource, newResource, start, end, revert } = info;

    if (oldResource && newResource) {
      // Technician changed

      const duration = calculateDuration(event.start, event.end);
      const scheduleData = {
        scheduleId: event?.id,
        technicianId: newResource?.id,
        fromTime: event?.start,
        toTime: event?.end,
        duration,
        isSentToTechnician: event.extendedProps?.isSentToTechnician,
      };

      const isTechnicianOkToUpdate =
        checkTimelineTechnicianOkToUpdate(scheduleData);

      console.log("istechnicianOkToUpdate : ", isTechnicianOkToUpdate);

      if (isTechnicianOkToUpdate.status) {
        await updateTimelineTechnician(scheduleData);
      } else {
        const toastMessage = isTechnicianOkToUpdate.msg;
        showToast(toastMessage, "error", addToast);
        info.revert();
      }
    } else {
      await handleEventResize(info);
    }
  };

  const handleEventResize = async (info) => {
    const { event, revert } = info;

    const duration = calculateDuration(event.start, event.end);
    console.log("Duration: ", duration);

    const scheduleData = {
      scheduleId: event?.id,
      // technicianId: newResource?.id,
      fromTime: event?.start,
      toTime: event?.end,
      duration,
      isSentToTechnician: event.extendedProps?.isSentToTechnician,
    };

    const isScheduleOkToUpdate = checkTimelineScheduleOkToUpdate(scheduleData);
    console.log("Is schedule ok to update: ", isScheduleOkToUpdate);

    if (isScheduleOkToUpdate.status) {
      const response = await updateScheduleTiming(scheduleData);
    } else {
      const toastMessage = isScheduleOkToUpdate.msg;
      showToast(toastMessage, "error", addToast);
      revert();
    }

    // If you want to prevent the resize and revert the event to its original duration:
    // revert();
  };

  return (
    // <h1>Timeline calendar</h1>
    <>
      {scheduleToEdit && (
        <TimelineScheduleView
          schedule={scheduleToEdit}
          showEditSchedule={showEditSchedule}
          setShowEditSchedule={setShowEditSchedule}
        />
      )}

      <div
        className="calendar-container"
        style={{ width: "100%", height: "100%" }}
      >
        <FullCalendar
          ref={calendarRef}
          key={scheduleDate}
          nowIndicator={true}
          // timeZone="UTC"
          stickyFooterScrollbar={true}
          editable={true}
          eventStartEditable={true}
          droppable={true}
          resources={resources}
          eventResourceEditable={true}
          eventDurationEditable={true}
          slotMinWidth={12}
          slotDuration="00:15:00" // Set the slot duration to 15 minutes
          // slotLabelInterval="00:15:00" // Set the slot label interval to 15 minutes
          events={events}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventContent={eventRender}
          // eventDragMinDistance={0}
          //   aspectRatio={1.5}
          headerToolbar={{
            left: "",
            center: "",
            right: "",
          }}
          //   initialEvents={staffJobs}
          // initialDate={moment().toDate().toISOString()}
          // now={currentCalendarDate}
          // scrollTimeReset={true}
          // resources={}

          resourceAreaWidth={"15%"}
          initialView="resourceTimelineDay"
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          width="100%"
          height="100vh"
          slotMinTime={`${showMorningTimeRange ? "08:00:00" : "00:00:00"}`}
          slotMaxTime={`${showMorningTimeRange ? "20:00:00" : "24:00:00"}`}
          // scrollTime="08:00:00"
          slotLabelInterval={{ hours: 1 }}
          // slotLabelFormat={{
          //   hour: "numeric",
          //   minute: "2-digit",
          //   omitZeroMinute: false,
          //   hour12: false,
          // }}
          // slotDuration="01:00:00"
        />
      </div>
    </>
  );
};

// const styles = {
//   container: {
//     height: "91vh",
//     overflowY: "auto",
//     paddingTop: 10,
//     position: "absolute",
//     right: 0,
//     zIndex: 999,
//     width: "30rem",
//   },
// };

export default TimelineView;
