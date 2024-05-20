import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Popover, Overlay } from "react-bootstrap";
import { openModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { truncateString } from "../../../../jobs-sandeep/helpers/job-card-helper";
import "./CommentInfo.scss";

const CommentInfo = ({ schedule }) => {
  // Need popover to display comment Admin and comment techinician
  const [popoverTarget, setPopoverTarget] = useState(null);
  const [popoverContent, setPopoverContent] = useState("");

  const dispatch = useDispatch();

  const { commentAdmin, commentTechnician } = schedule;

  const handleMouseEnter = (event, newContent) => {
    // console.log("event target: ", event.target);
    setPopoverTarget(event.target);
    setPopoverContent(newContent);
  };

  const handleMouseLeave = () => {
    setPopoverTarget(null);
  }; // ========================================================/

  const handleUpdateScheduleComment = (componentKey) => {
    dispatch(
      openModal({
        componentKey,
        size: "md",
        data: {
          schedule: schedule,
        },
      })
    );
  };
  return (
    <>
      <div
        className="schedule-card-comment"
        onClick={() =>
          handleUpdateScheduleComment("updateScheduleAdminCommentContent")
        }
        onMouseEnter={(e) => handleMouseEnter(e, commentAdmin)}
        onMouseLeave={() => handleMouseLeave()}
      >
        <p className="schedule-card-comment-text">
          <span>Admin: </span>
          {commentAdmin && truncateString(commentAdmin, 25)}
        </p>
      </div>
      <div
        className="schedule-card-comment"
        // onClick={() =>
        //   handleUpdateScheduleComment("updateScheduleAdminCommentContent")
        // }
        onMouseEnter={(e) => handleMouseEnter(e, commentTechnician)}
        onMouseLeave={() => handleMouseLeave()}
      >
        <p className="schedule-card-comment-text">
          <span>Tech: </span>{" "}
          {commentTechnician && truncateString(commentTechnician, 25)}
        </p>
      </div>
      <Overlay show={!!popoverTarget} target={popoverTarget} placement="top">
        {(props) => (
          <Popover id="popover-contained" {...props}>
            <Popover.Content>{popoverContent || "Empty"}</Popover.Content>
          </Popover>
        )}
      </Overlay>
    </>
  );
};

export default CommentInfo;
