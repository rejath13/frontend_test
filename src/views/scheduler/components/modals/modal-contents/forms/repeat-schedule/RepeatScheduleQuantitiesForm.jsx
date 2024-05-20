import React from "react";
import { Form } from "react-bootstrap";

const RepeatScheduleQuantitiesForm = ({ repeatForm, setRepeatForm }) => {
  const {
    schedQtyNew,
    schedQtyMigration,
    schedQtyTrading,
    schedQtyService,
    schedQtyOthers,
  } = repeatForm;

  const handleQuantityChange = (e, propertyName) => {
    setRepeatForm({ ...repeatForm, [propertyName]: e.target.value });
  };

  return (
    <>
      <Form.Group controlId="formcShedQtyNew">
        <Form.Label>Qty. New</Form.Label>
        <Form.Control
          type="number"
          value={schedQtyNew || ""}
          onChange={(e) => handleQuantityChange(e, "schedQtyNew")}
        />
      </Form.Group>
      <Form.Group controlId="formSchedQtyMigrate">
        <Form.Label>Qty. Migrate</Form.Label>
        <Form.Control
          type="number"
          value={schedQtyMigration || ""}
          onChange={(e) => handleQuantityChange(e, "schedQtyMigration")}
        />
      </Form.Group>
      <Form.Group controlId="formSchedQtyTrading">
        <Form.Label>Qty. Trading</Form.Label>
        <Form.Control
          type="number"
          value={schedQtyTrading || ""}
          onChange={(e) => handleQuantityChange(e, "schedQtyTrading")}
        />
      </Form.Group>
      <Form.Group controlId="formSchedQtyService">
        <Form.Label>Qty. Service</Form.Label>
        <Form.Control
          type="number"
          value={schedQtyService || ""}
          onChange={(e) => handleQuantityChange(e, "schedQtyService")}
        />
      </Form.Group>
      <Form.Group controlId="formSchedQtyOthers">
        <Form.Label>Qty. Others</Form.Label>
        <Form.Control
          type="number"
          value={schedQtyOthers || ""}
          onChange={(e) => handleQuantityChange(e, "schedQtyOthers")}
        />
      </Form.Group>
    </>
  );
};

export default RepeatScheduleQuantitiesForm;
