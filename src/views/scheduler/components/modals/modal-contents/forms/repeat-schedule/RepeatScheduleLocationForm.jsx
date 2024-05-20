import React from "react";
import { Form, Col } from "react-bootstrap";
import "./RepeatScheduleLocationForm.scss";

const RepeatScheduleLocationForm = ({ repeatForm, setRepeatForm }) => {
  return (
    <Form.Row>
      <Col>
        <Form.Group controlId="formScheduleLocation">
          <Form.Label>Schedule Location </Form.Label>
          <Form.Control
            type="text"
            value={repeatForm?.location || ""}
            onChange={(e) =>
              setRepeatForm((prevRepeatForm) => ({
                ...prevRepeatForm,
                location: e.target.value,
              }))
            }
            placeholder="Schedule Location"
          />
        </Form.Group>
        <Form.Group controlId="formScheduleCoordinates">
          <Form.Label>Schedule Coordinates </Form.Label>
          <Form.Control
            type="text"
            value={repeatForm?.coordinates || ""}
            onChange={(e) =>
              setRepeatForm((prevRepeatForm) => ({
                ...prevRepeatForm,
                coordinates: e.target.value,
              }))
            }
            placeholder="Schedule Coordinates"
          />
        </Form.Group>
      </Col>
      <Col>
        <div className="h-100 d-flex justify-content-center align-items-center">
          <h6 className="text-center">Google Map Goes Here</h6>
        </div>
      </Col>
    </Form.Row>
  );
};

export default RepeatScheduleLocationForm;
