import React, { useRef, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Autocomplete } from "@react-google-maps/api";
import {
  getGoogleMapLocation,
  setGoogleMapLocation,
} from "../../../../../store/slices/google-maps/googleMapSlice";
import "./LocatorAdminLocationForm.scss";
import { fetchAddressFromCoordinates } from "../../../helpers/schedule-helper";

const LocatorAdminLocationForm = () => {
  //
  const [placePredictions, setPlacePredictions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const dispatch = useDispatch();
  // Get the position from the Google Maps slice state ============ /
  const position = useSelector(getGoogleMapLocation);

  // Handler for Location Change ====================== /
  const onPlaceChanged = () => {
    // console.log("inside on place");
    if (selectedPlace) {
      const place = selectedPlace?.getPlace();
      const name = place?.name;
      const formattedAddress = place?.formatted_address;
      const lat = place?.geometry?.location?.lat();
      const lng = place?.geometry?.location?.lng();
      // console.log(`Place: , ${place}`);

      // console.log(`Place:`, JSON.parse(JSON.stringify(place)));
      // console.log(`Name:`, name);
      // console.log(`Formatted Address: ${formattedAddress}`);
      // console.log(`Lattitude: ${lat}`);
      // console.log(`Longitude: ${lng}`);
      dispatch(setGoogleMapLocation({ address: formattedAddress, lat, lng }));
    } else {
      alert("Please enter text");
    }
  };

  const onLoad = (autocomplete) => {
    setSelectedPlace(autocomplete);
  };

  // Handler for Coordinates Change ====================== /
  const handleCoordinatesChange = async (e) => {
    let coordString = e.target.value;
    let result = null;
    let lat = null;
    let lng = null;
    if (coordString.includes(",")) {
      coordString = coordString.replace(/\s/g, "");
      let coordinatesArray = coordString.split(",");
      // console.log("Coordinates Array: ", coordinatesArray);
      lat = parseFloat(coordinatesArray[0]);
      // console.log("Latitude: ", lat);
      lng = parseFloat(coordinatesArray[1]);
      // console.log("Longitude: ", lng);
      result = await fetchAddressFromCoordinates({ lat, lng });
    }
    const address = result.formatted_address || "";
    // console.log("Address is : ", address);
    dispatch(setGoogleMapLocation({ address, lat, lng }));
  };
  return (
    <div className="d-flex flex-column">
      <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
        {/* <input type="text" /> */}
        <Form.Group controlId="formScheduleLocation">
          <Form.Label>Enter Location </Form.Label>
          <Form.Control
            type="text"
            defaultValue={position?.address}
            // value={position?.address}
            // onChange={(e) =>
            //   dispatch(
            //     setGoogleMapLocation({
            //       address: e.target.value,
            //       lat: null,
            //       lng: null,
            //     })
            //   )
            // }
            //   ref={inputRef}
            // autoComplete="off"
            // ref={autocompleteInputRef}
            //   value={position?.address || ""}
            // onChange={handleLocationChange}
            placeholder="Schedule Location"
          />
          <div>
            <p>Chosen Location: </p>
            <p className="font-weight-bold text-success font-italic">
              {position?.address}
            </p>
          </div>
        </Form.Group>
      </Autocomplete>
      {/* {Boolean(position) && (
        <div className="d-flex flex-column">
          <p>Selected Address:</p>
          <p> {position.address}</p>
          <br />
          <br />
          <p>Coordinates:</p>
          <p>
            {position?.lat}, {position?.lng}
          </p>
        </div>
      )} */}

      <Form.Group controlId="formScheduleCoordinates">
        <Form.Label>Schedule Coordinates </Form.Label>
        <Form.Control
          type="text"
          value={`${position?.lat}, ${position?.lng}`}
          onChange={handleCoordinatesChange}
          placeholder="Schedule Coordinates"
        />
        <div>
          <p>Chosen Coordinates:</p>
          <p className="font-weight-bold text-success font-italic">{`${position?.lat}, ${position?.lng}`}</p>
        </div>
      </Form.Group>
    </div>
  );
};

export default LocatorAdminLocationForm;
