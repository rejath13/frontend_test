import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import { useGetTechniciansQuery } from "../../../../../../store/api/jobs/jobsApi";
import {
  getTechnicianId,
  setTechnician,
} from "../../../../../../store/slices/scheduler/schedulerFormSlice";
import { capitalizeFirstLetter } from "../../../../helpers/job-card-helper";

const ScheduleTechnicianForm = () => {
  //

  // Get Technician list
  const { data: technicians } = useGetTechniciansQuery();

  const technicianId = useSelector(getTechnicianId);

  const dispatch = useDispatch();
  return (
    <>
      <Form.Group controlId="formTechnician">
        <Form.Label>Technician</Form.Label>
        <Form.Control
          as="select"
          custom
          value={technicianId}
          onChange={(e) => dispatch(setTechnician(e.target.value))}
        >
          {/* <option value="">Select Technician</option> */}
          {technicians &&
            technicians.map((technician) => {
              return (
                <option key={technician.id} value={technician.id}>
                  {capitalizeFirstLetter(technician.name)}
                </option>
              );
            })}
        </Form.Control>
      </Form.Group>
    </>
  );
};

export default ScheduleTechnicianForm;
