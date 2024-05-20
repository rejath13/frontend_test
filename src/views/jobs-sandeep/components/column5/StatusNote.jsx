import React, { useState } from "react";
import { Form, Button, Popover, OverlayTrigger } from "react-bootstrap";
import "./StatusNote.scss";
import { openModal } from "../../../../store/slices/jobs/jobsModalSlice";
import { useDispatch } from "react-redux";
import { truncateString } from "../../helpers/job-card-helper";

const StatusNote = ({ statusNote, jobId }) => {
  const [showPopover, setShowPopover] = useState(false);
  const dispatch = useDispatch();
  // const [editNote, setEditNote] = useState(false);
  const popoverContent = statusNote && (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Status Note</Popover.Title>
      <Popover.Content>{statusNote || "Empty"}</Popover.Content>
    </Popover>
  );

  const handleMouseEnter = () => {
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
  };

  return (
    <div
      className="status-note"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() =>
        dispatch(
          openModal({
            componentKey: "statusNoteContent",
            size: "lg",
            data: {
              jobId,
            },
          })
        )
      }
    >
      {statusNote && <div>{truncateString(statusNote, 50)}</div>}

      {statusNote && (
        <OverlayTrigger
          trigger="hover focus"
          placement="right"
          show={showPopover}
          overlay={popoverContent}
        >
          <div>{/*Empty div as OverlayTrigger needs a child*/}</div>
        </OverlayTrigger>
      )}
    </div>
  );
};

export default StatusNote;
