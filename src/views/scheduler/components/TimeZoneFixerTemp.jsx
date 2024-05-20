import React from 'react'
import { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import DatePicker from "react-datepicker";
import moment from 'moment';

import { useUpdateTimezoneFixerDataMutation } from '../../../store/api/scheduler/schedulerApi';

const TimeZoneFixerTemp = () => {
    const [data, setData] = useState({
        fromTime: null,
        toTime: null,
        duration: null,
    })

    const [updateTimezoneFixerData, {isLoading, isError, isSuccess}] = useUpdateTimezoneFixerDataMutation()

    
    const handleFromTimeChange = (datePickerTime) => {
      console.log("DatePicker time is ,", datePickerTime);
      console.log('Moment DatePicker time is , ', moment.utc(datePickerTime))
      setData(prevData => {
        return {
          ...prevData,
          fromTime: moment.utc(datePickerTime)
        }
      })

    }

    const handleFixerSubmit = () => {
      updateTimezoneFixerData({data})
    }

 
  return (
    <div>      
      <Form.Group className="date-picker" controlId="formFromTimePicker">
    <Form.Label>From Time.</Form.Label>

    <DatePicker
      selected={data.fromTime ? data.fromTime.toDate() : ""}
      onChange={handleFromTimeChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      //   timeFormat="HH:mm"
      timeCaption="Time"
      dateFormat="h:mm aa"
      className="form-control"
      // dateFormat="h:mm aa"
    />
    <Button onClick={handleFixerSubmit}>Send</Button> 
  </Form.Group>
  {/* <Form.Group className="date-picker" controlId="formFromTimePicker">
    <Form.Label>Duration</Form.Label>

    <DatePicker
      selected={duration}
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
  </Form.Group> */}
  </div>
  )
}

export default TimeZoneFixerTemp