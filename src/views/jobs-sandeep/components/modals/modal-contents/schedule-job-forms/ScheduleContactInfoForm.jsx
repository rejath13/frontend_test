import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getScheduleContactInfo,
  setScheduleContactInfo,
} from "../../../../../../store/slices/scheduler/schedulerFormSlice";
import { Form } from "react-bootstrap";

const ScheduleContactInfoForm = () => {
  //
  const dispatch = useDispatch();
  const { contactName, contactPhone } = useSelector(getScheduleContactInfo);
  const handleContactChange = (e, propertyName) => {
    dispatch(setScheduleContactInfo({ [propertyName]: e.target.value }));
  };
  return (
    <>
      <Form.Group controlId="formSchedQtyMigrate">
        <Form.Label>Contact Name</Form.Label>
        <Form.Control
          type="text"
          value={contactName || ""}
          onChange={(e) => handleContactChange(e, "contactName")}
        />
      </Form.Group>
      <Form.Group controlId="formSchedQtyMigrate">
        <Form.Label>Contact Phone</Form.Label>
        <Form.Control
          type="text"
          value={contactPhone || ""}
          onChange={(e) => handleContactChange(e, "contactPhone")}
        />
      </Form.Group>
    </>
  );
};

export default ScheduleContactInfoForm;
