import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import { PriorityIcon } from "../../../../../scheduler/components/icons";
import {
  getIsHighPriority,
  toggleIsHighPriority,
} from "../../../../../../store/slices/scheduler/schedulerFormSlice";

const SchedulePriorityForm = () => {
  //
  const dispatch = useDispatch();

  const isHighPriority = useSelector(getIsHighPriority);

  return (
    <>
      <Form.Group controlId="formHighPriority">
        <div className="priority-container">
          <Form.Label> High Priority ?</Form.Label>
          {/* <div className="priority-icon">{<PriorityIcon />}</div> */}
          <Form.Check
            type="checkbox"
            label={isHighPriority && <PriorityIcon />}
            checked={isHighPriority}
            onChange={(e) => dispatch(toggleIsHighPriority())}
            as="input"
          />
        </div>
      </Form.Group>
    </>
  );
};

export default SchedulePriorityForm;
