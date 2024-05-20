import React from "react";
import { Form } from "react-bootstrap";
import { PriorityIcon } from "../../../../icons";
import "./RepeatSchedulePriorityForm.scss";

const RepeatSchedulePriorityForm = ({ repeatForm, setRepeatForm }) => {
  //
  const { isHighPriority } = repeatForm;

  const handlePriorityChange = () => {
    setRepeatForm({ ...repeatForm, isHighPriority: !isHighPriority });
  };
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
            onChange={handlePriorityChange}
            as="input"
          />
        </div>
      </Form.Group>
    </>
  );
};

export default RepeatSchedulePriorityForm;
