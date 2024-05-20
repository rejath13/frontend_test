import React, { useState, useEffect, useRef } from "react";
import "./LocatorAdminLocationContainer";
import { useSelector, useDispatch } from "react-redux";
import { LoadScript } from "@react-google-maps/api";
import { useJsApiLoader } from "@react-google-maps/api";
import LocatorAdminMap from "./LocatorAdminMap";
import {
  getGoogleMapLocation,
  resetGoogleMapLocation,
  setGoogleMapLocation,
} from "../../../../../store/slices/google-maps/googleMapSlice";
import LocatorAdminLocationForm from "./LocatorAdminLocationForm";

const LocatorAdminLocationContainer = () => {
  //

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetGoogleMapLocation());
  }, []);

  // const { isLoaded } = useJsApiLoader({
  //   // googleMapsApiKey: "AIzaSyCVtBGriVB1AJ-oRgXJHzmwhrOyQYPUTrA",
  //   libraries: ["places"],
  // });

  return (
    <>
      {/* {isLoaded && ( */}
      <>
        <LocatorAdminLocationForm />

        <LocatorAdminMap />
      </>
      {/* )} */}
    </>
  );
};

export default LocatorAdminLocationContainer;
