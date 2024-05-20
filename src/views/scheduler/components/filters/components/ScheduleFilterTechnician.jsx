import React from "react";
import { capitalizeFirstLetter } from "../../../../jobs-sandeep/helpers/job-card-helper";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import {
  setTechnicianFilter,
  getTechnicianFilter,
} from "../../../../../store/slices/scheduler/schedulerFilterSlice";
import { useGetTechniciansQuery } from "../../../../../store/api/jobs/jobsApi";
import "./ScheduleFilterTechnician.scss";

const ScheduleFilterTechnician = () => {
  //
  const dispatch = useDispatch();

  // Get Technician list
  const { data: technicians } = useGetTechniciansQuery();

  const technicianId = useSelector(getTechnicianFilter);

  return (
    <Form.Control
      as="select"
      custom
      value={technicianId || ""}
      onChange={(e) => dispatch(setTechnicianFilter(e.target.value))}
    >
      <option value="">Technician</option>
      {technicians &&
        technicians.map((technician) => {
          return (
            <option key={technician.id} value={technician.id}>
              {capitalizeFirstLetter(technician.name)}
            </option>
          );
        })}
    </Form.Control>
    // <Form.Group controlId="formTechnician">
    //   {/* <Form.Label>Technician</Form.Label> */}
    // {/* </Form.Group> */}
  );
};

export default ScheduleFilterTechnician;
