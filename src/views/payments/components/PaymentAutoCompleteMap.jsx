import React, { useState, useEffect, useCallback } from "react";
import { Col, Form } from "react-bootstrap";
import PaymentMap from "./PaymentMap";
import { Autocomplete } from "@react-google-maps/api";
import "./PaymentAutoCompleteMap.scss";
import { findCenter } from "../paymenthelper";
import { fromLatLng } from "react-geocode";

const PaymentAutoCompleteMap = ({ values, errors, touched, handleChange, setFieldValue }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [lat, lng] = values?.coordinate?.split(",")?.map(parseFloat);
  const [locationCoords, setLocationCoords] = useState(
    values?.coordinate
      ? {
          lat,
          lng,
        }
      : null
  );

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceSelected = () => {
    const place = autocomplete.getPlace();
    const { lat, lng } = place.geometry.location;
    const formattedAddress = place?.formatted_address;
    // for storing in DB
    setFieldValue("location", formattedAddress);
    setFieldValue("coordinate", `${lat()},${lng()}`)
    // for passing value to map
    const coords = findCenter(lat(), lng());
    setLocationCoords(coords);
  };

  // fetch location from coordinates using geocode
  const fetchLoactionData = useCallback(async (lat, lng) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      try {
        const response = await fromLatLng(lat, lng, apiKey);
        const formattedAddress = response.results[0].formatted_address;
        setFieldValue('location', formattedAddress );
        const coords = findCenter(lat, lng);
        setLocationCoords(coords);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    
  }, []);


  // when coordinates values is changed
  useEffect(() => {
    if (values?.coordinate) {
      const [lat, lng] = values?.coordinate?.split(",");
      if (lat && lng) {
        fetchLoactionData(lat, lng);
      }
    } else {
      setFieldValue('location', "" );
      setLocationCoords(null);
    }
  }, [values.coordinate]);



  return (
    <>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Group controlId="coordinate">
            <Form.Label>Coordinate</Form.Label>
            <Form.Control
              type="text"
              name="coordinate"
              placeholder="latitude, longitude"
              value={values?.coordinate}
              onChange={handleChange}
              isInvalid={errors.coordinate && touched.coordinate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.coordinate}
            </Form.Control.Feedback>
          </Form.Group>
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceSelected}
            types={["geocode"]}
          >
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                isInvalid={errors.location && touched.location}
                onChange={handleChange}
                value={values.location}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location}
              </Form.Control.Feedback>
            </Form.Group>
          </Autocomplete>
        </Form.Group>
        {/* second col */}
        <Form.Group as={Col}>
          <PaymentMap isLocation={true} locationCoords={locationCoords} />
        </Form.Group>
      </Form.Row>
    </>
  );
};

export default React.memo(PaymentAutoCompleteMap);
