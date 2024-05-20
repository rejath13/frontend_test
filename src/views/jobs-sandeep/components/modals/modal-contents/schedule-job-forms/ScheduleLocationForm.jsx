import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Col } from "react-bootstrap";
import {
  getGeoData,
  setGeoData,
} from "../../../../../../store/slices/scheduler/schedulerFormSlice";

const ScheduleLocationForm = () => {
  //
  const dispatch = useDispatch();

  const { location, coordinates } = useSelector(getGeoData);

  return (
    <Form.Row>
      <Col>
        <Form.Group controlId="formScheduleLocation">
          <Form.Label>Schedule Location </Form.Label>
          <Form.Control
            type="text"
            value={location || ""}
            onChange={(e) =>
              dispatch(setGeoData({ location: e.target.value, coordinates }))
            }
            placeholder="Schedule Location"
          />
        </Form.Group>
        <Form.Group controlId="formScheduleCoordinates">
          <Form.Label>Schedule Coordinates </Form.Label>
          <Form.Control
            type="text"
            value={coordinates || ""}
            onChange={(e) =>
              dispatch(setGeoData({ location, coordinates: e.target.value }))
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

export default ScheduleLocationForm;
