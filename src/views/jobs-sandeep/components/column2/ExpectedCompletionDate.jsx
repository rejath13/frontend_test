import React, { useState, useEffect, useRef } from "react";
import { FaRegCalendarPlus } from "react-icons/fa6";
import {
  formattedItems,
  checkDateProximity,
  isValidDate,
} from "../../helpers/job-card-helper";
import { useDispatch } from "react-redux";
import { openModal } from "../../../../store/slices/jobs/jobsModalSlice";

import "./ExpectedCompletionDate.scss";
import { Badge } from "react-bootstrap";

const ExpectedCompletionDate = ({
  jobId,
  expectedCompletionDate,
  expectedCompletionTime,
}) => {
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formattedDate = formattedItems.expectedCompletion(
    expectedCompletionDate
  );

  // console.log("Expe comp time: ", expectedCompletionTime);

  const dateProximity =
    (isValidDate(expectedCompletionDate, formattedDate) &&
      checkDateProximity(expectedCompletionDate)) ||
    "";

  const dateProximityBadgeVariant = () => {
    switch (dateProximity) {
      case "Today":
        return "warning";
      case "Tomorrow":
        return "info";
      case "DAT":
        return "success";
      case "Yesterday":
        return "danger";
    }
  };

  // Only the time part of the datetime is used. The date part is received from expectedCompletionDate.
  const extractTime = (expectedCompletionTime) => {
    const dateTime = new Date(expectedCompletionTime);

    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let seconds = dateTime.getSeconds();

    // Determine if it's AM or PM
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Format the time part as HH:mm:ss
    const formattedTime = `${padZero(hours)}:${padZero(minutes)} ${amPm}`;
    return formattedTime;
  };

  function padZero(number) {
    return number.toString().padStart(2, "0");
  }

  return (
    <>
      <div className="expected-date-completion">
        <div className="date">
          {isValidDate() ? (
            <p>
              Exp: {formattedDate}{" "}
              {expectedCompletionTime && (
                <span>: {extractTime(expectedCompletionTime)}</span>
              )}{" "}
            </p>
          ) : (
            ""
          )}
          {dateProximity ? (
            <Badge variant={dateProximityBadgeVariant()}>{dateProximity}</Badge>
          ) : (
            ""
          )}
        </div>
        <div className="calendar-icon-container">
          <div
            className="svg-container"
            // ref={calendarButtonRef}
            onClick={() =>
              dispatch(
                openModal({
                  componentKey: "expectedCompletionDateContent",
                  size: "lg",
                  data: {
                    jobId,
                  },
                })
              )
            }
          >
            <FaRegCalendarPlus />
          </div>
        </div>
      </div>
      {/* {showDatePicker && (
        <div className="datepicker-container" ref={containerRef}>
          <DatePicker
            selected={expDate}
            onChange={(date) => setExpDate(date)}
            className="form-control"
            dateFormat="dd-MM-yyyy"
            isClearable
          />
          <Button variant="info" onClick={handleSaveExpDate}>
            +
          </Button>
        </div>
      )} */}
    </>
  );
};

export default ExpectedCompletionDate;
