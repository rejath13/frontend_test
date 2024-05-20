import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Alert, Spinner, Dropdown } from "react-bootstrap";
import {
  getJobDetails,
  getSingleJob,
} from "../../../../../store/slices/jobs/jobSlice";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { useGetTechniciansQuery } from "../../../../../store/api/jobs/jobsApi";
import {
  useCreateScheduleMutation,
  useGetGoogleLocationSuggestionsQuery,
} from "../../../../../store/api/scheduler/schedulerApi";
import {
  capitalizeFirstLetter,
  getDurations,
} from "../../../helpers/job-card-helper";
import { PriorityIcon } from "../../../../scheduler/components/icons";
import {
  closeModal,
  getCurrentJobId,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import DatePicker from "react-datepicker";
import "./ScheduleJobContent.scss";
import moment from "moment";
import useGoogleLocationSuggestions from "../../hooks/useGoogleLocationSuggestions";

const ScheduleJobContent = () => {
  const dispatch = useDispatch();

  // Get Technician list
  const { data: technicians } = useGetTechniciansQuery();
  //   console.log("Technicians: ", technicians);

  // Get Durations from helper
  let durations = getDurations();
  //   console.log("Durations : ", durations);

  // Get Current JobId from Modal State
  const jobId = useSelector(getCurrentJobId);

  // Get Current Job Details if job id exists
  if (jobId) {
    dispatch(getSingleJob(jobId));
  }
  const job = useSelector(getJobDetails);

  const {
    id,
    companyName,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    implementationType,
    quantityNew,
    quantityMigrate,
    quantityTrading,
    quantityService,
  } = job.salesPlus;
  //   console.log("today is ", moment().format("DD-MM-YYYY"));

  //   const [locationSuggestions, setLocationSuggestions] = useState([]);

  const [formDetails, setFormDetails] = useState({
    salesPlusId: id ?? "",
    companyName: companyName ?? "",
    contactName: customerName ?? "",
    contactPhone: customerPhone ?? "",
    scheduleDate: moment(),
    fromTime: "",
    duration: "",
    toTime: "",
    technicianId: "",
    schedQtyNew: quantityNew ?? "",
    schedQtyMigrate: quantityMigrate ?? "",
    schedQtyTrading: quantityTrading ?? "",
    schedQtyService: quantityService ?? "",
    schedQtyOthers: "",
    isHighPriority: false,
    commentAdmin: "",
    location: null,
    coordinates: "",
    // lattitude: job.lattitude ?? "",
    // longitude: job.longitude ?? "",
  });

  let durationMinTime = new Date().setHours(0, 0, 0);
  let durationMaxTime = new Date().setHours(12, 0, 0);

  const [createSchedule, { isLoading, isSuccess, isError }] =
    useCreateScheduleMutation();

  const {
    locationSuggestions,
    isLocationSuggestionsLoading,
    isLocationSuggestionsError,
  } = useGoogleLocationSuggestions(formDetails.location);

  console.log("locations suggestions: ", locationSuggestions);

  useEffect(() => {
    if (formDetails.fromTime && formDetails.duration && !formDetails.toTime) {
      calculateToTime();
    }
  }, [formDetails.fromTime, formDetails.duration]);

  useEffect(() => {
    if (formDetails.toTime && !formDetails.duration) {
      calculateDuration();
    }
  }, [formDetails.toTime]);

  const calculateDuration = () => {
    const fromTime = moment(formDetails.fromTime, "hh:mm");
    const toTime = moment(formDetails.toTime, "hh:mm");

    const duration = moment.duration(toTime.diff(fromTime));

    const hours = Math.floor(Math.abs(duration.asHours()));
    let minutes = duration.minutes();

    // console.log("From Time: ", fromTime);
    // console.log("To Time: ", toTime);
    // console.log("Duration hours: ", hours);
    // console.log("Duration minutes: ", minutes);
    const momentDuration = moment().set({ hours, minutes });
    setFormDetails({ ...formDetails, duration: new Date(momentDuration) });
  };

  const calculateToTime = () => {
    const duration = moment(formDetails.duration, "hh:mm");
    const fromTime = moment(formDetails.fromTime, "hh:mm");
    const toTime = fromTime.add({
      hours: duration.hours(),
      minutes: duration.minutes(),
    });
    setFormDetails({ ...formDetails, toTime: new Date(toTime) });
  };

  const handleScheduleSubmit = async (jobId) => {
    // Dispatch createSchedule Mutation here
    const scheduleData = {
      jobId,
      formDetails,
    };
    createSchedule(scheduleData);
    // updateJob({ jobId, formData: formDetails });
  };

  const handleToTimeChange = (datePickerTime) => {
    datePickerTime = moment(datePickerTime);
    // console.log("Date picker time is : ", datePickerTime);
    let fromTime = moment(formDetails.fromTime);
    if (datePickerTime.isAfter(fromTime)) {
      // Check whether new To Time is greater than from Time
      setFormDetails({
        ...formDetails,
        duration: "",
        toTime: new Date(datePickerTime),
      });
    } else {
      //   console.log("To Time cannot be less than from time");
    }
  };

  const [selectedOption, setSelectedOption] = useState(null);
  console.log();

  const handleLocationInputChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormDetails({ ...formDetails, location: selectedOption });
    // console.log("Selected option: ", textInputValue);
    // setFormDetails({ ...formDetails, location: textInputValue });
  };

  const handleLocationSelectChange = (selectedOption) => {
    console.log("Selected option 2: ", selectedOption.label);
    setSelectedOption(selectedOption);
    setFormDetails({ ...formDetails, location: selectedOption.label });
  };

  const handleCoordinatesInputChange = (newValue) => {};

  return (
    // The Modal Component is inside JobsModal. These will be injected into the modal when it is opened
    <>
      <Modal.Header closeButton>
        <Modal.Title>Create a Schedule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="schedule-job-modal">
          <>
            {isLoading && (
              <div className="loader-container">
                <Spinner
                  as="span"
                  animation="border"
                  size="xl"
                  role="status"
                  aria-hidden="true"
                  variant="success"
                />
              </div>
            )}
          </>
          <div className="form-section">
            <div className="form-row date-row">
              <Form.Group className="date-picker" controlId="formDatePicker">
                <Form.Label>Schedule Date</Form.Label>
                <div className="date-btn-row">
                  <DatePicker
                    selected={formDetails?.scheduleDate?.toDate()}
                    onChange={(date) => {
                      setFormDetails({
                        ...formDetails,
                        scheduleDate: moment(date),
                      });
                    }}
                    showIcon
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    isClearable
                  />
                  <div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setFormDetails({
                          ...formDetails,
                          scheduleDate: moment(),
                        })
                      }
                    >
                      TDY
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setFormDetails({
                          ...formDetails,
                          scheduleDate: moment().add(1, "days"),
                        })
                      }
                    >
                      TMW
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setFormDetails({
                          ...formDetails,
                          scheduleDate: moment().add(2, "days"),
                        })
                      }
                    >
                      DAT
                    </Button>
                  </div>
                </div>
              </Form.Group>
              <Form.Group
                className="date-picker"
                controlId="formFromTimePicker"
              >
                <Form.Label>From Time.</Form.Label>

                <DatePicker
                  selected={formDetails.fromTime}
                  onChange={(time) =>
                    setFormDetails({ ...formDetails, fromTime: time })
                  }
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  //   timeFormat="HH:mm"
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="form-control"
                  // dateFormat="h:mm aa"
                />
              </Form.Group>
              <Form.Group
                className="date-picker"
                controlId="formFromTimePicker"
              >
                <Form.Label>Duration</Form.Label>

                <DatePicker
                  selected={formDetails.duration}
                  onChange={(time) => {
                    setFormDetails({
                      ...formDetails,
                      toTime: "",
                      duration: time,
                    });
                  }}
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
                  selected={formDetails.toTime}
                  //   onChange={(time) => handleToTimeChange(time)}
                  onChange={(time) => handleToTimeChange(time)}
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
                  value={formDetails.technicianId}
                  onChange={(e) =>
                    setFormDetails({
                      ...formDetails,
                      technicianId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Technician</option>
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
              <Form.Group controlId="formHighPriority">
                <div className="priority-container">
                  <Form.Label> High Priority ?</Form.Label>
                  {/* <div className="priority-icon">{<PriorityIcon />}</div> */}
                  <Form.Check
                    type="checkbox"
                    label={formDetails.isHighPriority && <PriorityIcon />}
                    checked={formDetails.isHighPriority}
                    onChange={() =>
                      setFormDetails({
                        ...formDetails,
                        isHighPriority: !formDetails.isHighPriority,
                      })
                    }
                    as="input"
                  />
                </div>
              </Form.Group>
            </div>
          </div>
          <div className="form-section">
            <div className="form-row">
              <Form.Group controlId="formcShedQtyNew">
                <Form.Label>Qty. New</Form.Label>
                <Form.Control
                  type="text"
                  value={formDetails.schedQtyNew}
                  onChange={(e) =>
                    setFormDetails({
                      ...formDetails,
                      schedQtyNew: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formSchedQtyMigrate">
                <Form.Label>Qty. Migrate</Form.Label>
                <Form.Control
                  type="text"
                  value={formDetails.schedQtyMigrate}
                  onChange={(e) =>
                    setFormDetails({
                      ...formDetails,
                      schedQtyMigrate: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formSchedQtyTrading">
                <Form.Label>Qty. Trading</Form.Label>
                <Form.Control
                  type="text"
                  value={formDetails.schedQtyTrading}
                  onChange={(e) =>
                    setFormDetails({
                      ...formDetails,
                      schedQtyTrading: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formSchedQtyService">
                <Form.Label>Qty. Service</Form.Label>
                <Form.Control
                  type="text"
                  value={formDetails.schedQtyService}
                  onChange={(e) =>
                    setFormDetails({
                      ...formDetails,
                      schedQtyService: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formSchedQtyOthers">
                <Form.Label>Qty. Others</Form.Label>
                <Form.Control
                  type="text"
                  value={formDetails.schedQtyOthers}
                  onChange={(e) =>
                    setFormDetails({
                      ...formDetails,
                      schedQtyOthers: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
          </div>
          <div className="form-section">
            <div className="form-row">
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
            </div>
          </div>
        </section>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Job Details Updated Successfully!"
              : isError
              ? "Could not Save Job Details. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={() => handleScheduleSubmit(jobId)}>
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

export default ScheduleJobContent;
