import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setJobStatusFilters } from "../../../../../store/slices/jobs/jobsFilterSlice";
import { Form } from "react-bootstrap";
import { capitalizeFirstLetter } from "../../../helpers/job-card-helper";

const JobStatusFilter = () => {
  //
  const dispatch = useDispatch();
  const { checkboxes: jobStatuses, jobStatusFilters } = useSelector(
    (state) => state.jobsFilter
  );

  const handleJobStatusChange = (e) => {
    dispatch(setJobStatusFilters(e.target.value));
  };

  return (
    <>
      <h6>Job Status : </h6>

      <div className="additionalFilters__checkbox-section">
        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Label>Select Job Status</Form.Label>
          <Form.Control
            as="select"
            custom
            value={jobStatusFilters || ""}
            onChange={handleJobStatusChange}
          >
            <option value="">Select Job Status</option>
            {jobStatuses &&
              jobStatuses.map((jobStatus) => {
                return (
                  <option key={jobStatus.id} value={jobStatus.name}>
                    {capitalizeFirstLetter(jobStatus.name)}
                  </option>
                );
              })}
          </Form.Control>
        </Form.Group>
      </div>
    </>
  );
};

export default JobStatusFilter;
