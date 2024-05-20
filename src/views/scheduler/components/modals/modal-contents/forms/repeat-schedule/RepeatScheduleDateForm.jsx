import React from "react";
import moment from "moment";
import {
  getScheduleDate,
  setScheduleDate,
} from "../../../../../../../store/slices/scheduler/schedulerFormSlice";

import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";

const RepeatScheduleDateForm = () => {
  //
  const dispatch = useDispatch();

  const scheduleDate = new Date(useSelector(getScheduleDate));
  //   console.log("Scheudle Date is ", scheduleDate);

  return (
    <Form.Group className="date-picker" controlId="formDatePicker">
      <Form.Label>Schedule Date</Form.Label>
      <div className="date-btn-row">
        <DatePicker
          selected={scheduleDate}
          onChange={(date) => {
            dispatch(setScheduleDate(date.toISOString()));
          }}
          showIcon
          className="form-control"
          dateFormat="dd-MM-yyyy"
          isClearable
        />
        <div>
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
              dispatch(setScheduleDate(moment().add(1, "days").toISOString()));
            }}
          >
            TMW
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              dispatch(setScheduleDate(moment().add(2, "days").toISOString()));
            }}
          >
            DAT
          </Button>
        </div>
      </div>
    </Form.Group>
  );
};

export default RepeatScheduleDateForm;
