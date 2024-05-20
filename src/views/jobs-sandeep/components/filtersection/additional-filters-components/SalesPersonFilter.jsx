import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { capitalizeFirstLetter } from "../../../helpers/job-card-helper";
import { setSalesPersonFilters } from "../../../../../store/slices/jobs/jobsFilterSlice";
import { useGetSalesPersonsQuery } from "../../../../../store/api/jobs/jobsApi";
import { Form } from "react-bootstrap";

const SalesPersonFilter = () => {
  const dispatch = useDispatch();

  const { salesPersonFilters } = useSelector((state) => state.jobsFilter);
  const { data: salesPersons } = useGetSalesPersonsQuery();

  const handleSalesPersonChange = (e) => {
    dispatch(setSalesPersonFilters(e.target.value));
  };

  return (
    <>
      <h6>Sales Persons : </h6>

      <div className="additionalFilters__checkbox-section">
        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Label>Select SalesPerson</Form.Label>
          <Form.Control
            as="select"
            custom
            value={salesPersonFilters || ""}
            onChange={handleSalesPersonChange}
          >
            <option value="">Select Sales Person</option>
            {salesPersons &&
              salesPersons.map((salesPerson) => {
                return (
                  <option key={salesPerson.id} value={salesPerson.id}>
                    {capitalizeFirstLetter(salesPerson.name)}
                  </option>
                );
              })}
          </Form.Control>
        </Form.Group>
      </div>
    </>
  );
};

export default SalesPersonFilter;
