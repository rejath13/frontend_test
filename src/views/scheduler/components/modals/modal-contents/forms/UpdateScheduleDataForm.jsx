import React, { useState, useEffect } from "react";
import moment from "moment";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import {
  durationMinTime,
  durationMaxTime,
  formFromTime,
  formDuration,
  formToTime,
  calculateFromTime,
  calculateDuration,
  calculateToTime,
  showToast,
  validateDurationChange,
} from "../../../../helpers/schedule-update-schedule-data-helpers";
import { useToasts } from "react-toast-notifications";
import { useGetTechniciansQuery } from "../../../../../../store/api/jobs/jobsApi";
import { useUpdateScheduleDataMutation } from "../../../../../../store/api/scheduler/schedulerApi";
import { capitalizeFirstLetter } from "../../../../../jobs-sandeep/helpers/job-card-helper";
import "./UpdateScheduleDataForm.scss";
import { checkDateBeforeCurrentDay } from "../../../../helpers/schedule-helper";

const UpdateScheduleDataForm = ({ info, setInfo }) => {
  //

  useEffect(() => {
    const scheduleDate = info.scheduleDate;
    console.log('Form schedule date: ', scheduleDate)
  }, [])

  const dispatch = useDispatch();

  const [updateScheduleData, { isLoading, isError, isSuccess }] =
    useUpdateScheduleDataMutation();

  const { addToast } = useToasts();

  // Get Technician list
  const { data: technicians } = useGetTechniciansQuery();

  const handleScheduleDateChange = (updatedDate) => {
    // check whether updated date is before the current day. Only if not should be able to update.
    const isDateBeforeCurrentDay = checkDateBeforeCurrentDay({
      date: updatedDate,
    });

    if (!isDateBeforeCurrentDay) {
      setInfo((prevInfo) => ({
        ...prevInfo,
        scheduleDate: updatedDate,
      }));
    } else {
      const toastMessage = "Schedule date cannot be before today !";
      showToast(toastMessage, "error", addToast);
    }
  };

  // Handle Duration
  const handleDurationChange = (datePickerTime) => {
    const { fromTime, toTime } = info;

    if (fromTime) {
      const calculatedToTime = calculateToTime(datePickerTime, fromTime);
      setInfo((prevInfo) => ({
        ...prevInfo,
        duration: datePickerTime,
        toTime: calculatedToTime,
      }));
    }

    if (toTime && !fromTime) {
      const calculatedFromTime = calculateFromTime({
        duration: datePickerTime,
        toTime,
      });
      setInfo((prevInfo) => ({
        ...prevInfo,
        duration: datePickerTime,
        fromTime: calculatedFromTime,
      }));
    }
    // const result = validateDurationChange({
    //   fromTime,
    //   duration: datePickerTime,
    //   toTime,
    // });

    // if (result.validated) {
    //   const calculatedToTime = calculateToTime(datePickerTime, info.fromTime);
    //   // datePickerTime = moment(datePickerTime);
    //   setInfo((prevInfo) => ({
    //     ...prevInfo,
    //     duration: datePickerTime,
    //     toTime: calculatedToTime,
    //   }));
    // } else {
    //   showToast(result.message, "error", addToast);
    // }
  };

  // Handle To Time
  const handleToTimeChange = (datePickerTime) => {
    const { fromTime, toTime, duration } = info;

    if (duration) {
      const calculatedDuration = calculateDuration(fromTime, datePickerTime);

      setInfo((prevInfo) => ({
        ...prevInfo,
        duration: calculatedDuration,
        toTime: datePickerTime,
      }));
    } else {
      setInfo((prevInfo) => ({
        ...prevInfo,
        duration: null,
        toTime: datePickerTime,
      }));
    }
  };

  // Handle From Time
  const handleFromTimeChange = (datePickerTime) => {
    const { fromTime, toTime, duration } = info;
    // Check whether new To Time is greater than from Time
    if (toTime && datePickerTime) {
      const calculatedDuration = calculateDuration(datePickerTime, toTime);

      setInfo((prevInfo) => ({
        ...prevInfo,
        fromTime: datePickerTime,
        duration: calculatedDuration,
      }));
    } else {
      setInfo((prevInfo) => ({
        ...prevInfo,
        fromTime: datePickerTime,
        toTime: null,
        duration: null,
      }));
    }
  };

  return (
    <div className="schedule-data-form">
      <Form.Group className="date-picker" controlId="formDatePicker">
        <Form.Label>Schedule Date </Form.Label>
        <div className="">
          <DatePicker
            selected={info.scheduleDate ? info.scheduleDate : null}
            onChange={handleScheduleDateChange}
            showIcon
            className="form-control"
            dateFormat="dd-MM-yyyy"
            // isClearable
          />
          <div className="date-btn-row">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                handleScheduleDateChange(moment().toDate());
                // setInfo((prevInfo) => ({
                //   ...prevInfo,
                //   scheduleDate: moment().toDate(),
                // }));
              }}
            >
              TDY
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                handleScheduleDateChange(moment().add(1, "days").toDate());
                // setInfo((prevInfo) => ({
                //   ...prevInfo,
                //   scheduleDate: moment().add(1, "days").toDate(),
                // }));
              }}
            >
              TMW
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                handleScheduleDateChange(moment().add(2, "days").toDate());
                // setInfo((prevInfo) => ({
                //   ...prevInfo,
                //   scheduleDate: moment().add(2, "days").toDate(),
                // }));
              }}
            >
              DAT
            </Button>
          </div>
        </div>
      </Form.Group>
      <Form.Group className="date-picker" controlId="formFromTimePicker">
        <Form.Label>From Time.</Form.Label>

        <DatePicker
          selected={info.fromTime ? formFromTime(info.fromTime) : null}
          onChange={handleFromTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          //   timeFormat="HH:mm"
          timeCaption="Time"
          dateFormat="h:mm aa"
          className="form-control"
          isClearable
          // minTime={new Date(0, 0, 0, 8, 0)} // 8:00 AM
          // maxTime={new Date(0, 0, 0, 20, 0)} // 8:00 PM

          // dateFormat="h:mm aa"
        />
      </Form.Group>
      <Form.Group className="date-picker" controlId="formDurationPicker">
        <Form.Label>Duration</Form.Label>

        <DatePicker
          selected={info.duration ? formDuration(info.duration) : null}
          onChange={handleDurationChange}
          openToDate={new Date(2000, 0, 1, 0, 0, 0)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeFormat="HH:mm"
          timeCaption="Time"
          dateFormat="HH:mm"
          className="form-control"
          minTime={durationMinTime}
          maxTime={durationMaxTime}
        />
      </Form.Group>
      <Form.Group className="date-picker" controlId="formToTimePicker">
        <Form.Label>To Time.</Form.Label>

        <DatePicker
          selected={info.toTime ? formToTime(info.toTime) : null}
          //   onChange={(time) => handleToTimeChange(time)}
          onChange={handleToTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          className="form-control"
          // dateFormat="h:mm aa"
        />
      </Form.Group>
      <Form.Group controlId="formTechnician">
        <Form.Label>Technician</Form.Label>
        <Form.Control
          as="select"
          custom
          value={info.technicianId}
          onChange={(e) =>
            setInfo((prevInfo) => ({
              ...prevInfo,
              technicianId: e.target.value,
            }))
          }
        >
          {/* <option value="">Select Technician</option> */}
          {technicians &&
            technicians.map((technician) => {
              return (
                <option key={technician.id} value={technician.id}>
                  {capitalizeFirstLetter(technician.name)}
                </option>
              );
            })}
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default UpdateScheduleDataForm;
