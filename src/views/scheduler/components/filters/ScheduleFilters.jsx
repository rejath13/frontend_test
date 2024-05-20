import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import {
  getScheduleFilterCheckboxes,
  resetScheduleFilters,
} from "../../../../store/slices/scheduler/schedulerFilterSlice";
import ScheduleFilterDatePicker from "./components/ScheduleFilterDatePicker";
import ScheduleFilterCheckbox from "./components/ScheduleFilterCheckbox";
import ScheduleFilterSearchbox from "./components/ScheduleFilterSearchbox";
import ScheduleFilterTechnician from "./components/ScheduleFilterTechnician";
import { TbFilterOff } from "react-icons/tb";
import ScheduleFilterPriority from "./components/ScheduleFilterPriority";
import "./ScheduleFilters.scss";

const ScheduleFilters = () => {
  //
  const dispatch = useDispatch();

  const filterCheckboxes = useSelector(getScheduleFilterCheckboxes);

  return (
    <>
      <div className="schedule-filters">
        <section className="schedule-filters-datepicker">
          <ScheduleFilterDatePicker />
        </section>

        <section className="schedule-filters-checkboxes-container">
          {filterCheckboxes.map((filterCheckbox) => (
            <ScheduleFilterCheckbox
              key={filterCheckbox.id}
              checkbox={filterCheckbox}
            />
          ))}
        </section>

        <section className="schedule-filters-technician">
          <ScheduleFilterTechnician />
        </section>

        <section className="schedule-searchbox">
          <ScheduleFilterSearchbox />
        </section>

        <section>
          <ScheduleFilterPriority />
        </section>

        <section className="schedule-filters-reset-section">
          <Button
            variant="danger"
            className="schedule-filter-reset-button"
            onClick={() => dispatch(resetScheduleFilters())}
          >
            <TbFilterOff className="filter-icon" />
          </Button>
        </section>
      </div>
    </>
  );
};

export default ScheduleFilters;
