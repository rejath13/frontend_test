import React from "react";
import { setImplementationTypeFilters } from "../../../../../store/slices/jobs/jobsFilterSlice";
import { useGetImplementationTypesQuery } from "../../../../../store/api/jobs/jobsApi";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";

const ImplementationTypeFilter = () => {
  //
  const dispatch = useDispatch();
  const { implementationTypeFilters } = useSelector(
    (state) => state.jobsFilter
  );
  const { data: implementationTypes } = useGetImplementationTypesQuery();

  const handleImplementationTypeChange = (e) => {
    dispatch(setImplementationTypeFilters(e.target.value));
  };

  return (
    <>
      <div className="additionalFilters__checkbox-section">
        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Label>Select Implementation Type</Form.Label>
          <Form.Control
            as="select"
            custom
            value={implementationTypeFilters || ""}
            onChange={handleImplementationTypeChange}
          >
            <option value="">Select Implementation Type</option>
            {implementationTypes &&
              implementationTypes.map((item, index) => {
                return (
                  <option key={index} value={item.implementationType}>
                    {item.implementationType.toUpperCase()}
                  </option>
                );
              })}
          </Form.Control>
        </Form.Group>
      </div>
    </>
  );
};

export default ImplementationTypeFilter;
