import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import Select from "react-select";
import useGoogleLocationSuggestions from "../../../hooks/useGoogleLocationSuggestions";
import { getGeoData } from "../../../../../../store/slices/scheduler/schedulerFormSlice";

const ScheduleGoogleLocationForm = () => {
  //
  const dispatch = useDispatch();

  const { location, coordinates } = useSelector(getGeoData);

  const {
    locationSuggestions,
    isLocationSuggestionsLoading,
    isLocationSuggestionsError,
  } = useGoogleLocationSuggestions();

  const [selectedOption, setSelectedOption] = useState(null);
  console.log();

  const handleLocationInputChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    // setFormDetails({ ...formDetails, location: selectedOption });
    // // console.log("Selected option: ", textInputValue);
    // // setFormDetails({ ...formDetails, location: textInputValue });
  };

  const handleLocationSelectChange = (selectedOption) => {
    // console.log("Selected option 2: ", selectedOption.label);
    // setSelectedOption(selectedOption);
    // setFormDetails({ ...formDetails, location: selectedOption.label });
  };

  const handleCoordinatesInputChange = (newValue) => {};
  return (
    <>
      <Form.Group controlId="formLocation">
        <Form.Label>Location</Form.Label>
        <Select
          placeholder="Enter location"
          //   isClearable
          isSearchable
          //   loadOptions={useGoogleLocationSuggestions}
          //   value={formDetails.location}
          value={selectedOption}
          options={locationSuggestions}
          onInputChange={handleLocationInputChange}
          onChange={handleLocationSelectChange}
          blurInputOnSelect={false}
          //   onMenuClose={handleLocationSelectChange}
        />
        {/* <Form.Control
                  type="text"
                  name="location"
                  value={formDetails.location}
                  onChange={handleLocationInputChange}
                  placeholder="Enter Location"
                /> */}
      </Form.Group>
      {/* <Form.Group controlId="formLattitude">
                <Form.Label>Coordinates</Form.Label>
                <Form.Control
                  type="text"
                  name="lattitude"
                  value={formDetails.coordinates}
                  onChange={handleCoordinatesChange}
                  placeholder="Enter Lattitude"
                />
              </Form.Group> */}
    </>
  );
};

export default ScheduleGoogleLocationForm;
