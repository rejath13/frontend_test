import React, { useEffect, useState, useRef } from "react";

// import FullCalendar from "@fullcalendar/react"; // must go before plugins
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline"; // a plugin!
// import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import resourceTimelinePlugin from "@fullcalendar/resource-timeline"; // a plugin!
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

import "./timeline.css";
import moment from "moment/moment";

import ReactDOMServer from "react-dom/server";
import $ from "jquery";
import _ from 'underscore';

import { useDispatch, useSelector } from "react-redux";


const randomTimes = () => {
    // Generate a random start time between 8am and 12pm
    const startTime = moment().set({
        hour: Math.floor(Math.random() * 5) + 8,
        minute: Math.floor(Math.random() * 60),
        second: Math.floor(Math.random() * 60)
    });
    
    // Generate a random end time between 1pm and 5pm, but at least 2 hours after start time
    const endTime = moment(startTime).add({
        hour: Math.floor(Math.random() * 4) + 2,
        minute: Math.floor(Math.random() * 60),
        second: Math.floor(Math.random() * 60)
    }).set({
        hour: Math.floor(Math.random() * 4) + 13
    });

    return {startTime,endTime}
    
}




const _getEventColor = (job) => {

    var DEFAULT_EVENT_COLOR = '#28a744';
    const PRIMARY_EVENT_COLOR = '#007bff';
    const WARNING_EVENT_COLOR = '#ffc107';
    const DANGER_EVENT_COLOR = '#ff002a';

    // Primary color
    if(job.job_new != 0 && job.job_new != null) return PRIMARY_EVENT_COLOR;
   
    if(job.job_migration != 0 && job.job_migration != null) return WARNING_EVENT_COLOR;

    if(job.job_replace != 0 && job.job_replace != null) return DANGER_EVENT_COLOR;

    return DEFAULT_EVENT_COLOR

}

const TimelineView = (props) => {


    const { jobs = [] } = props;

    console.log('jobs',jobs);


  const dispatch = useDispatch();
  const calenderRef = useRef();

  const [staff,setStaff] = useState([])
  const [staffJobs,setStaffJobs] = useState([]);

 

    useEffect(() =>{
        var uniqMembersJobs = _.groupBy(jobs, 'job_technician_id');

        var finalMembers = [];
        var finalMembersJobs = [];
        
        Object.keys(uniqMembersJobs).map((key,index) => {

            try {
                
                finalMembers.push({
                    id : uniqMembersJobs[key][0].job_technician_id,
                    title : uniqMembersJobs[key][0].technician_name,
                })

                uniqMembersJobs[key].map(job =>{

                    const {startTime,endTime} = randomTimes()

                    finalMembersJobs.push({
                        resourceId : uniqMembersJobs[key][0].job_technician_id,
                        title : job.job_address,
                        start : startTime.format('YYYY-MM-DD HH:mm:ss'),
                        end : endTime.format('YYYY-MM-DD HH:mm:ss'),
                        color : _getEventColor(job)
                    });
                })

            } catch (error) {
                console.log('Error',error)
            }

        })

        console.log('finalMembers',finalMembers)
        console.log('finalMembersJobs',finalMembersJobs)

        setStaff(finalMembers);
        setStaffJobs(finalMembersJobs)


    },[jobs])

  return (
    <FullCalendar
        ref={calenderRef}
        nowIndicator={true}
        timeZone="IST"
        stickyFooterScrollbar={true}
        editable={true}
        eventStartEditable={true}
        droppable={true}
        eventResourceEditable={true}
        eventDurationEditable={true}
        aspectRatio={10}
        initialEvents={staffJobs}
        events={staffJobs}
        scrollTimeReset={true}
        resources={staff}
        height={"89vh"}
        resourceAreaWidth={"15%"}
        initialView="resourceTimelineDay"
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        plugins={[resourceTimelinePlugin, interactionPlugin]}
      />
  );
};
const styles = {
  container: {
    height: "91vh",
    overflowY: "auto",
    paddingTop: 10,
    position: "absolute",
    right: 0,
    zIndex: 999,
  },
};

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default React.memo(TimelineView);
