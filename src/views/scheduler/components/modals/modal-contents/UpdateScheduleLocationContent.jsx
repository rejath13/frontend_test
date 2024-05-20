import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./UpdateScheduleLocationContent.scss";
import { Form, Modal, Button, Spinner, Alert } from "react-bootstrap";
import {
  closeModal,
  getCurrentScheduleData,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import { useUpdateScheduleLocationMutation } from "../../../../../store/api/scheduler/schedulerApi";
import LocatorAdminLocationContainer from "../../components/google-maps/LocatorAdminLocationContainer";
import {
  getGoogleMapLocation,
  setGoogleMapLocation,
} from "../../../../../store/slices/google-maps/googleMapSlice";

const UpdateScheduleLocationContent = () => {
  //

  const dispatch = useDispatch();

  const schedule = useSelector(getCurrentScheduleData);

  useEffect(() => {
    dispatch(
      setGoogleMapLocation({
        address: schedule?.location,
        lat: parseFloat(schedule?.lat),
        lng: parseFloat(schedule?.lng),
      })
    );
  }, []);

  const position = useSelector(getGoogleMapLocation);
  // const [locationData, setLocationData] = useState({
  //   scheduleId: schedule?.id,
  //   location: schedule?.location,
  //   coordinates: schedule?.coordinates,
  // });

  const [updateScheduleLocation, { isLoading, isError, isSuccess }] =
    useUpdateScheduleLocationMutation();

  const handleLocationSubmit = () => {
    const locationData = {
      scheduleId: schedule?.id,
      position: position,
    };
    const response = updateScheduleLocation(locationData);
  };

  // Close the modal when successful update
  useEffect(() => {
    if(isSuccess) {
      setTimeout(() => {

        dispatch(closeModal())
      }, 1000)
    }
  }, [isSuccess])
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Change Schedule Location Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="update-schedule-location">
          <LocatorAdminLocationContainer />
        </div>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Schedules Location updated Successfully!"
              : isError
              ? "Could not Save. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={handleLocationSubmit}>
          {isLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              variant="light"
            />
          ) : (
            "Save"
          )}
        </Button>

        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

export default UpdateScheduleLocationContent;
