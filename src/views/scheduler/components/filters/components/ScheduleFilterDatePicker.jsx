import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { getSchedulerFilterScheduleDate } from "../../../../../store/slices/scheduler/schedulerFilterSlice";
import { useSelector, useDispatch } from "react-redux";
import { setScheduleDate } from "../../../../../store/slices/scheduler/schedulerFilterSlice";
import moment from "moment";
import ScheduleFilterAllPending from "./ScheduleFilterAllPending";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./ScheduleFilterDatePicker.scss";

const ScheduleFilterDatePicker = () => {
  //
  const scheduleDate = useSelector(getSchedulerFilterScheduleDate);
  const dispatch = useDispatch();
  // const [activeButton, setActiveButton] = useState({
  //   name: "",
  // });

  const calculateActiveButton = (scheduleDate) => {
    const yest = moment().subtract(1, "days").format("YYYY-MM-DD");
    const tdy = moment().format("YYYY-MM-DD");
    const tmw = moment().add(1, "days").format("YYYY-MM-DD");
    const dat = moment().add(2, "days").format("YYYY-MM-DD");
    let activeButton;
    if (scheduleDate === yest) return "YEST";
    if (scheduleDate === tdy) return "TDY";
    if (scheduleDate === tmw) return "TMW";
    if (scheduleDate === dat) return "DAT";
  };

  const activeButton = calculateActiveButton(scheduleDate);

  // console.log("Active Button: ", activeButton);

  // const [buttonStates, setButtonStates] = useState([
  //   {
  //     id: 1,
  //     name: "yest",
  //     isActive: false,
  //   },
  // ]);

  // const handleButtonStates = (e) => {
  //   const clickedButtonName = e.target.innerText;
  //   setActiveButton({ name: clickedButtonName });

  //   // const newButtonStates = buttonStates.map((button) => {
  //   //   if (button.name === clickedButtonName) {
  //   //     button.isActive = true;
  //   //   } else {
  //   //     button.isActive = false;
  //   //   }
  //   // });
  //   // setButtonStates(newButtonStates);
  // };

  return (
    // <Form.Group className="date-picker" controlId="formDatePicker">
    // {/* <Form.Label>Schedule Date</Form.Label> */}
    <div id="schedule-filter-date-picker" className="date-btn-row">
      <DatePicker
        selected={
          scheduleDate ? moment(scheduleDate, "YYYY-MM-DD").toDate() : null
        }
        onChange={(date) => {
          if (date) {
            dispatch(setScheduleDate(moment(date).format("YYYY-MM-DD")));
          } else {
            dispatch(setScheduleDate(null));
          }
        }}
        showIcon
        className="form-control"
        dateFormat="dd-MM-yyyy"
        // isClearable={true}
        placeholderText="Select Date"
      />
      <div className="button-row">
        {/* All Pending is not related to datepicker ! */}
        <ScheduleFilterAllPending />
        <Button
          size="sm"
          variant={activeButton === "YEST" ? "primary" : "secondary"}
          onClick={(e) => {
            // handleButtonStates(e);
            dispatch(
              setScheduleDate(moment().subtract(1, "days").format("YYYY-MM-DD"))
            );
          }}
        >
          YEST
        </Button>
        <Button
          size="sm"
          variant={activeButton === "TDY" ? "primary" : "secondary"}
          onClick={(e) => {
            // handleButtonStates(e);
            dispatch(setScheduleDate(moment().format("YYYY-MM-DD")));
          }}
        >
          TDY
        </Button>
        <Button
          size="sm"
          variant={activeButton === "TMW" ? "primary" : "secondary"}
          onClick={(e) => {
            // handleButtonStates(e);
            dispatch(
              setScheduleDate(moment().add(1, "days").format("YYYY-MM-DD"))
            );
          }}
        >
          TMW
        </Button>
        <Button
          size="sm"
          variant={activeButton === "DAT" ? "primary" : "secondary"}
          onClick={(e) => {
            // handleButtonStates(e);
            dispatch(
              setScheduleDate(moment().add(2, "days").format("YYYY-MM-DD"))
            );
          }}
        >
          DAT
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            dispatch(
              setScheduleDate(
                moment(scheduleDate).subtract(1, "days").format("YYYY-MM-DD")
              )
            );
          }}
        >
          <FiChevronLeft />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            dispatch(
              setScheduleDate(
                moment(scheduleDate).add(1, "days").format("YYYY-MM-DD")
              )
            );
          }}
        >
          <FiChevronRight />
        </Button>
      </div>
    </div>
    // </Form.Group>
  );
};

export default ScheduleFilterDatePicker;
