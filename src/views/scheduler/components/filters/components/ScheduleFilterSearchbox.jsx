import React from "react";
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import "./ScheduleFilterSearchbox.scss";
import {
  getScheduleFilterSearchboxValue,
  setScheduleSearchboxValue,
} from "../../../../../store/slices/scheduler/schedulerFilterSlice";

const ScheduleFilterSearchbox = () => {
  //
  const dispatch = useDispatch();
  const searchboxValue = useSelector(getScheduleFilterSearchboxValue);

  const handleOnChange = (e) => {
    dispatch(setScheduleSearchboxValue(e.target.value));
  };
  return (
    <Form.Control
      type="text"
      placeholder="Search Jobs"
      value={searchboxValue}
      key="searchJobsTextFilter"
      onChange={handleOnChange}
    />
  );
};

export default ScheduleFilterSearchbox;
