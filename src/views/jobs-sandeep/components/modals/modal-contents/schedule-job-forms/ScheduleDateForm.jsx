import React from "react";
import moment from "moment";
import {
  getScheduleDate,
  setScheduleDate,
} from "../../../../../../store/slices/scheduler/schedulerFormSlice";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import { checkDateBeforeCurrentDay } from "../../../../../scheduler/helpers/schedule-helper";
import { useToasts } from "react-toast-notifications";
import { showToast } from "../../../../../scheduler/helpers/schedule-update-schedule-data-helpers";

const ScheduleDateForm = () => {
  //
  const dispatch = useDispatch();

  const { addToast } = useToasts();

  const scheduleDate = new Date(useSelector(getScheduleDate));
  //   console.log("Scheudle Date is ", scheduleDate);
  const handleScheduleDateChange = (updatedDate) => {
    // check whether updated date is before the current day. Only if not should be able to update.

    const isDateBeforeCurrentDay = checkDateBeforeCurrentDay({
      date: updatedDate,
    });

    if (!isDateBeforeCurrentDay) {
      dispatch(setScheduleDate(updatedDate.toISOString()));
    } else {
      const toastMessage = "Schedule date cannot be before today !";
      showToast(toastMessage, "error", addToast);
    }
  };

  return (
    <Form.Group className="date-picker" controlId="formDatePicker">
      <Form.Label>Schedule Date</Form.Label>
      <div className="date-btn-row">
        <DatePicker
          selected={scheduleDate}
          onChange={(date) => {
            handleScheduleDateChange(date);
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
              handleScheduleDateChange(moment().toDate());
            }}
          >
            TDY
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              handleScheduleDateChange(moment().add(1, "days").toDate());
            }}
          >
            TMW
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              handleScheduleDateChange(moment().add(2, "days").toDate());
            }}
          >
            DAT
          </Button>
        </div>
      </div>
    </Form.Group>
  );
};

export default ScheduleDateForm;
