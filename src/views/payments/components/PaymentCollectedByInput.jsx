import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { collectedByOptions } from "../paymenthelper";
import { useChangeStatusMutation } from "../../../store/api/payments/paymentApi";

const PaymentCollectedByInput = ({ paymentId, setShowModal }) => {
  const [collectedBy, setCollectedBy] = useState("MIDHUN");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const {value} = e?.target;
    if(!value || value === "Choose Collectd By"){
        return  setError("Collected by is required");
    }
    setCollectedBy(e?.target?.value);
    setError(null);
  };

 

  const [changeStatus] = useChangeStatusMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeStatus({ status: "collected", paymentId, collectedBy });
      setShowModal(false);
    } catch (error) {
      console.log("Error in changing status", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group as={Col} xs={12} controlId="collectedBy">
        {/* <Form.Label>Collected By</Form.Label> */}
        <Form.Control
          as="select"
          defaultValue={"MIDHUN"}
          name="collectedBy"
          onChange={handleChange}
          isInvalid={error}
        >
          <option value={""}>Choose Collecetd By</option>
          {collectedByOptions?.map((user, index) => (
            <option value={user} key={index}>
              {user}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Row className="justify-content-end">
        <Form.Group as={Col} md="auto">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
        </Form.Group>
        <Form.Group as={Col} md="auto">
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form.Group>
      </Form.Row>
    </Form>
  );
};

export default PaymentCollectedByInput;
