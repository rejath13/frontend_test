import React from "react";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  getTimelineFilterScheduleDate,
  setTimelineScheduleDate,
} from "../../../../../../store/slices/scheduler/timelineFilterSlice";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import "./TimelineFilterDatePicker.scss";

const TimelineFilterDatePicker = () => {
  //
  const dispatch = useDispatch();

  const scheduleDate = useSelector(getTimelineFilterScheduleDate);
  // console.log("Timeline schedule date: ", scheduleDate);

  const handleDirectionClick = (direction) => {
    let date = scheduleDate ? moment(scheduleDate) : moment();
    if (direction === "next") {
      date = date.add(1, "days").format("YYYY-MM-DD");
    }
    if (direction === "prev") {
      date = date.subtract(1, "days").format("YYYY-MM-DD");
    }
    dispatch(setTimelineScheduleDate(date));
  };

  return (
    <div id="timeline-filter-date-picker">
      {/* <Form.Group className="date-picker" controlId="formDatePicker"> */}
      {/* <Form.Label>Schedule Date</Form.Label> */}
      <div className="date-btn-row">
        <DatePicker
          selected={
            scheduleDate
              ? moment(scheduleDate, "YYYY-MM-DD").toDate()
              : moment().toDate()
          }
          onChange={(date) => {
            if (date) {
              dispatch(
                setTimelineScheduleDate(moment(date).format("YYYY-MM-DD"))
              );
            } else {
              dispatch(setTimelineScheduleDate(null));
            }
          }}
          showIcon
          className="form-control"
          dateFormat="dd-MM-yyyy"
          isClearable
          placeholderText="Select Date"
        />
        <div className="direction-buttons">
          <Button
            className="btn-prev-date"
            size="sm"
            variant="info"
            onClick={() => handleDirectionClick("prev")}
          >
            <FiChevronLeft />
          </Button>
          <Button
            className="btn-next-date"
            size="sm"
            variant="info"
            onClick={() => handleDirectionClick("next")}
          >
            <FiChevronRight />
          </Button>
        </div>
        {/* <div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                dispatch(setScheduleDate(moment().toISOString()));
              }}
            >
              TDY
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                dispatch(
                  setScheduleDate(moment().add(1, "days").toISOString())
                );
              }}
            >
              TMW
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                dispatch(
                  setScheduleDate(moment().add(2, "days").toISOString())
                );
              }}
            >
              DAT
            </Button>
          </div> */}
      </div>
      {/* </Form.Group> */}
    </div>
  );
};

export default TimelineFilterDatePicker;
