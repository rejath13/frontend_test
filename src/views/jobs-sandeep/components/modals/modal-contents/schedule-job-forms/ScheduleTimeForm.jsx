import React, { useEffect } from "react";
import moment from "moment";
import {
  setFromTime,
  setDuration,
  setToTime,
  getTimes,
} from "../../../../../../store/slices/scheduler/schedulerFormSlice";
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";

const ScheduleTimeForm = () => {
  //
  const dispatch = useDispatch();

  let { fromTime, toTime, duration } = useSelector(getTimes);
  fromTime = fromTime ? new Date(fromTime) : "";
  toTime = toTime ? new Date(toTime) : "";
  duration = duration ? new Date(duration) : "";

  // console.log("Duration is ", duration);

  const calculateToTime = () => {
    const formattedDuration = moment(duration, "hh:mm");
    const formattedFromTime = moment(fromTime, "hh:mm");
    const calculatedToTime = formattedFromTime.add({
      hours: formattedDuration.hours(),
      minutes: formattedDuration.minutes(),
    });
    return calculatedToTime.toISOString();
  };

  let durationMinTime = new Date().setHours(0, 0, 0);
  let durationMaxTime = new Date().setHours(12, 0, 0);

  const calculateDuration = () => {
    const momentFromTime = moment(fromTime, "hh:mm");
    const momentToTime = moment(toTime, "hh:mm");

    const calculatedDuration = moment.duration(
      momentToTime.diff(momentFromTime)
    );

    const hours = calculatedDuration.hours();
    const minutes = calculatedDuration.minutes();
    const momentDuration = moment().set({ hours, minutes });
    return momentDuration.toISOString();
  };

  // Effect to run when fromTime & duration exists and toTime does not exist
  useEffect(() => {
    if (fromTime && duration && !toTime) {
      const calculatedToTime = calculateToTime();
      dispatch(setToTime(calculatedToTime));
    }
  }, [fromTime, duration]);

  // Effect to run when toTime exists but duration does not exist
  useEffect(() => {
    if (toTime && !duration) {
      // console.log("Duration in check : ", duration);
      const calculatedDuration = calculateDuration();
      dispatch(setDuration(calculatedDuration));
    }
  }, [toTime]);

  const handleDurationChange = (datePickerTime) => {
    datePickerTime = moment(datePickerTime);
    dispatch(setToTime(null));
    dispatch(setDuration(datePickerTime.toISOString()));
  };

  const handleToTimeChange = (datePickerTime) => {
    datePickerTime = moment(datePickerTime);
    let formattedFromTime = moment(fromTime);
    if (datePickerTime.isAfter(formattedFromTime)) {
      // Check whether new To Time is greater than from Time
      dispatch(setDuration(null));
      dispatch(setToTime(datePickerTime.toISOString()));
    } else {
      console.log("To Time cannot be less than from time");
    }
  };

  const handleFromTimeChange = (datePickerTime) => {
    dispatch(setFromTime(datePickerTime.toISOString()));
  };
  return (
    <>
      <Form.Group className="date-picker" controlId="formFromTimePicker">
        <Form.Label>From Time.</Form.Label>

        <DatePicker
          selected={fromTime ? fromTime : ""}
          onChange={handleFromTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          //   timeFormat="HH:mm"
          timeCaption="Time"
          dateFormat="h:mm aa"
          className="form-control"
          // dateFormat="h:mm aa"
        />
      </Form.Group>
      <Form.Group className="date-picker" controlId="formFromTimePicker">
        <Form.Label>Duration</Form.Label>

        <DatePicker
          selected={duration}
          onChange={handleDurationChange}
          openToDate={new Date(2000, 0, 1, 0, 0, 0)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeFormat="HH:mm"
          timeCaption="Time"
          dateFormat="HH:mm"
          className="form-control"
          minTime={durationMinTime}
          maxTime={durationMaxTime}
        />
      </Form.Group>
      <Form.Group className="date-picker" controlId="formToTimePicker">
        <Form.Label>To Time.</Form.Label>

        <DatePicker
          selected={toTime}
          //   onChange={(time) => handleToTimeChange(time)}
          onChange={handleToTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          className="form-control"
          // dateFormat="h:mm aa"
        />
      </Form.Group>
    </>
  );
};

export default ScheduleTimeForm;
