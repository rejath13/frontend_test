import React from "react";
import { Form } from "react-bootstrap";
import { PriorityIcon } from "../../icons";
import { useSelector, useDispatch } from "react-redux";
import {
  getScheduleFilterPriority,
  toggleScheduleFilterPriority,
} from "../../../../../store/slices/scheduler/schedulerFilterSlice";
import "./ScheduleFilterPriority.scss";

const ScheduleFilterPriority = () => {
  //
  const dispatch = useDispatch();
  const isHighPriority = useSelector(getScheduleFilterPriority);

  return (
    <div className="priority-form">
      <Form.Group controlId="formHighPriority">
        <div className="priority-container">
          <Form.Label>
            <div className="priority-icon">{<PriorityIcon />}</div>
          </Form.Label>

          <Form.Check
            type="checkbox"
            // label={isHighPriority && <PriorityIcon />}
            checked={isHighPriority}
            onChange={(e) => dispatch(toggleScheduleFilterPriority())}
            as="input"
          />
        </div>
      </Form.Group>
    </div>
  );
};

export default ScheduleFilterPriority;
