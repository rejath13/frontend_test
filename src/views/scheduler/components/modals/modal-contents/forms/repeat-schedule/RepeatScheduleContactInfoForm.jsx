import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Form } from "react-bootstrap";
import "./RepeatScheduleContactInfoForm.scss";

const RepeatScheduleContactInfoForm = ({ repeatForm, setRepeatForm }) => {
  //
  const { contactName, contactPhone } = repeatForm;
  const dispatch = useDispatch();

  const handleContactChange = (e, propertyName) => {
    setRepeatForm({ ...repeatForm, [propertyName]: e.target.value });
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

export default RepeatScheduleContactInfoForm;
