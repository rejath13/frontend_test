import React, { useState } from "react";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { truncateString } from "../../helpers/job-card-helper";

const ScheduleNote = ({ statusWonNote, jobId }) => {
  // console.log("Status Won note: ", statusWonNote);
  const [showPopover, setShowPopover] = useState(false);
  const popoverContent = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Schedule Note</Popover.Title>
      <Popover.Content>{statusWonNote || "Empty"}</Popover.Content>
    </Popover>
  );

  const handleMouseEnter = () => {
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
    // console.log("Mouse enter leave");
  };
  // console.log("Edit note is ", editNote);

  return (
    <div
      className="schedule-note"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {statusWonNote && <div>{truncateString(statusWonNote, 50)}</div>}
      {statusWonNote && (
        <OverlayTrigger
          trigger="hover focus"
          placement="right"
          show={showPopover}
          overlay={popoverContent}
        >
          <div></div>
        </OverlayTrigger>
      )}
    </div>
  );
};

export default ScheduleNote;
