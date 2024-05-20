import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

import "./LocatorAdminMap.scss";
import {
  getGoogleMapLocation,
  setGoogleMapLocation,
} from "../../../../../store/slices/google-maps/googleMapSlice";
import { fetchAddressFromCoordinates } from "../../../helpers/schedule-helper";

const LocatorAdminMap = () => {
  //
  const dispatch = useDispatch();

  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  const position = useSelector(getGoogleMapLocation);

  // console.log("Map Component Position: ", position);

  const mapRef = useRef(null);

  // Handler for Google Maps Marker ===================== /
  const handleMarkerDragEnd = async ({ lat, lng }) => {
    // get location address
    console.log("Type of lat: ", typeof lat);
    const coordinates = { lat, lng };
    const result = await fetchAddressFromCoordinates({ lat, lng });
    const address = result.formatted_address || "";
    console.log("Address is : ", address);
    dispatch(setGoogleMapLocation({ address, lat, lng }));
  };

  return (
    // <Map center={position} zoom={13}>
    //   <Marker position={position} />
    // </Map>
    <div style={{ height: "400px", width: "100%" }}>
      {/* <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}> */}
      {position?.lat && position?.lng && (
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={15}
          center={position}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {position && (
            <Marker
              position={position}
              draggable={true}
              onDragEnd={(e) => {
                console.log("Marker movied: ", e);
                handleMarkerDragEnd({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                });
              }}
            />
          )}
        </GoogleMap>
      )}
      {!position?.lat && !position?.lng && (
        <div className="d-flex justify-content-center align-items-center w-100 h-100">
          Google Map - Choose a Location
        </div>
      )}
      {/* </LoadScript> */}
    </div>
  );
};

export default LocatorAdminMap;
