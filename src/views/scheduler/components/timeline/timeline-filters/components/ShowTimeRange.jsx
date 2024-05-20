import React from "react";
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  getShowMorningTimeRange,
  toggleShowMorningTimeRange,
} from "../../../../../../store/slices/scheduler/timelineFilterSlice";
import "./ShowTimeRange.scss";

const ShowTimeRange = () => {
  //
  const isChecked = useSelector(getShowMorningTimeRange);

  const dispatch = useDispatch();

  return (
    <div id="timerange-toggle-form">
      <Form.Group controlId="formTimeRangeToggle">
        <div className="timerange-toggle-container">
          <Form.Check
            type="checkbox"
            // label={isHighPriority && <PriorityIcon />}
            checked={isChecked}
            onChange={(e) => dispatch(toggleShowMorningTimeRange())}
            as="input"
          />
          <Form.Label>
            {/* <div className="priority-icon">{<PriorityIcon />}</div> */}
            <p>Morning Time Range</p>
          </Form.Label>
        </div>
      </Form.Group>
    </div>
  );
};

export default ShowTimeRange;
