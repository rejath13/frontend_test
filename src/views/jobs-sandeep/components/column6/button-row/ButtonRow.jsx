import React from "react";
import TraccarUser from "./TraccarUser";
import ScheduleJob from "./ScheduleJob";
// import AddDevice from "./AddDevice";
import SendMail from "./SendMail";
import AdditionalOptions from "./AdditionalOptions";

import "./ButtonRow.scss";

const ButtonRow = ({ jobId, traccarId }) => {
  return (
    <>
      <div className="traccar-user-section">
        <TraccarUser traccarId={traccarId} jobId={jobId} />
      </div>
      {traccarId && (
        <div className="schedule-section">
          {/* There should be a schedule status in the jobs table which will be
        a boolean that shows whether scheduled or not. If not scheduled, show
        the button to shedule the job */}
          <ScheduleJob jobId={jobId} />
        </div>
      )}
      {/* <div className="add-device-section">
        <AddDevice />
      </div> */}
      <div className="send-mail-section">
        <SendMail jobId={jobId} />
      </div>
      <div className="additional-options-section">
        <AdditionalOptions jobId={jobId} />
      </div>
    </>
  );
};

export default ButtonRow;
