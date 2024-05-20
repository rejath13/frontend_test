import React from "react";
import {
  getIsSentToTechnician,
  toggleIsSentToTechnician,
} from "../../../../../../store/slices/scheduler/schedulerFormSlice";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-bootstrap";
import { PriorityIcon } from "../../../../../scheduler/components/icons";

const AssignToTechnicianForm = () => {
  //
  const dispatch = useDispatch();
  const isSentToTechnician = useSelector(getIsSentToTechnician);

  //   const handleSentToTechnicianChange = (e) => {
  //     const changedValue = e.target.checked;
  //     console.log("handle send technicain: ", changedValue);
  //   };

  return (
    <>
      <Form.Group controlId="formHighPriority">
        <div className="priority-container">
          <Form.Label> Assign To Technician ?</Form.Label>
          {/* <div className="priority-icon">{<PriorityIcon />}</div> */}
          <Form.Check
            type="checkbox"
            label={isSentToTechnician && <PriorityIcon />}
            checked={isSentToTechnician}
            onChange={() => dispatch(toggleIsSentToTechnician())}
            as="input"
          />
        </div>
      </Form.Group>
    </>
  );
};

export default AssignToTechnicianForm;
