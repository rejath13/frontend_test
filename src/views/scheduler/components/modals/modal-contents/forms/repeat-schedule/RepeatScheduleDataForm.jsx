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
  calculateDuration,
  calculateToTime,
  showToast,
  calculateFromTime,
} from "../../../../../helpers/schedule-update-schedule-data-helpers";
import { useToasts } from "react-toast-notifications";
import { useGetTechniciansQuery } from "../../../../../../../store/api/jobs/jobsApi";
import { capitalizeFirstLetter } from "../../../../../../jobs-sandeep/helpers/job-card-helper";
import "./RepeatScheduleDataForm.scss";
import { checkDateBeforeCurrentDay } from "../../../../../helpers/schedule-helper";

const RepeatScheduleDataForm = ({ repeatForm, setRepeatForm }) => {
  //
  const dispatch = useDispatch();

  const { addToast } = useToasts();

  // Get Technician list
  const { data: technicians } = useGetTechniciansQuery();

  // Handle Schedule Date Change
  const handleScheduleDateChange = (updatedDate) => {
    // check whether updated date is before the current day. Only if not should be able to update.

    const isDateBeforeCurrentDay = checkDateBeforeCurrentDay({
      date: updatedDate,
    });

    if (!isDateBeforeCurrentDay) {
      setRepeatForm((prevInfo) => ({
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
    const { fromTime, toTime } = repeatForm;

    if (fromTime) {
      const calculatedToTime = calculateToTime(datePickerTime, fromTime);
      setRepeatForm((prevRepeatForm) => ({
        ...prevRepeatForm,
        duration: datePickerTime,
        toTime: calculatedToTime,
      }));
    }
    if (toTime) {
      const calculatedFromTime = calculateFromTime({
        duration: datePickerTime,
        toTime,
      });
      setRepeatForm((prevRepeatForm) => ({
        ...prevRepeatForm,
        duration: datePickerTime,
        fromTime: calculatedFromTime,
      }));
    }

    // datePickerTime = moment(datePickerTime);
  };

  // Handle To Time
  const handleToTimeChange = (datePickerTime) => {
    const { fromTime, toTime, duration } = repeatForm;

    if (duration) {
      const calculatedDuration = calculateDuration(fromTime, datePickerTime);

      setRepeatForm((prevRepeatForm) => ({
        ...prevRepeatForm,
        duration: calculatedDuration,
        toTime: datePickerTime,
      }));
    } else {
      setRepeatForm((prevRepeatForm) => ({
        ...prevRepeatForm,
        duration: null,
        toTime: datePickerTime,
      }));
    }
  };

  // Handle From Time
  const handleFromTimeChange = (datePickerTime) => {
    const { fromTime, toTime, duration } = repeatForm;
    console.log(`
    Repeat from Datepicker time: ${datePickerTime}
    `);

    if (toTime && datePickerTime) {
      const calculatedDuration = calculateDuration(datePickerTime, toTime);

      setRepeatForm((prevRepeatForm) => ({
        ...prevRepeatForm,
        fromTime: datePickerTime,
        duration: calculatedDuration,
      }));
    } else {
      console.log("Cannot calculate duration: fromtime is null");
      setRepeatForm((prevRepeatForm) => ({
        ...prevRepeatForm,
        fromTime: datePickerTime,
        duration: null,
      }));
    }
  };

  return (
    <>
      <Form.Group className="date-picker" controlId="formDatePicker">
        <Form.Label>Schedule Date</Form.Label>
        <div className="repeat-schedule-date">
          <DatePicker
            selected={repeatForm.scheduleDate}
            onChange={(date) => {
              handleScheduleDateChange(date);
            }}
            showIcon
            className="form-control"
            dateFormat="dd-MM-yyyy"
            isClearable
          />
          <div className="date-btn-row">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                handleScheduleDateChange(moment().toDate());
              }}
            >
              TDY
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                handleScheduleDateChange(moment().add(1, "days").toDate());
              }}
            >
              TMW
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                handleScheduleDateChange(moment().add(2, "days").toDate());
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
          selected={formFromTime(repeatForm.fromTime)}
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
          selected={formDuration(repeatForm.duration)}
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
          // isClearable
        />
      </Form.Group>
      <Form.Group className="date-picker" controlId="formToTimePicker">
        <Form.Label>To Time.</Form.Label>

        <DatePicker
          selected={formToTime(repeatForm.toTime)}
          //   onChange={(time) => handleToTimeChange(time)}
          onChange={handleToTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          className="form-control"
          isClearable
          // dateFormat="h:mm aa"
        />
      </Form.Group>
      <Form.Group controlId="formTechnician">
        <Form.Label>Technician</Form.Label>
        <Form.Control
          as="select"
          custom
          value={repeatForm.technicianId}
          onChange={(e) =>
            setRepeatForm((prevRepeatForm) => ({
              ...prevRepeatForm,
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
    </>
  );
};

export default RepeatScheduleDataForm;
