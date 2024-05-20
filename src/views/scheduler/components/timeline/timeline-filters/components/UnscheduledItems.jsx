import React, { useEffect, useState } from "react";
import { Modal, Button, Badge, InputGroup, Form } from "react-bootstrap";
import ScheduleCard from "../../../components/ScheduleCard";
import { IoSearchSharp as SearchIcon } from "react-icons/io5";
import useFilterUnscheduledItems from "../../timeline-hooks/useFilterUnscheduledItems";
import "./UnscheduledItems.scss";

const UnscheduledItems = ({ unscheduledItems }) => {
  //
  console.log("Inside unscheduled component");
  const [showUnscheduledItems, setShowUnscheduledItems] = useState(false);
  const [searchText, setSearchText] = useState("");

  const schedules = useFilterUnscheduledItems(unscheduledItems, searchText);

  console.log('Schedules in UnscheduledItems: ', schedules)

  const handleShowItems = () => {
    setShowUnscheduledItems(true);
  };

  const handleClose = () => {
    setShowUnscheduledItems(false);
  };

  //   console.log("Serach Text: ", searchText);

  const handleSearchTextChange = (e) => {
    setSearchText((prev) => e.target.value);
  };
  return (
    <div id="unscheduled-items">
      <Button variant="warning" size="sm" onClick={handleShowItems}>
        {schedules.length}
      </Button>
      {showUnscheduledItems && (
        <div>
          <Modal
            show={showUnscheduledItems}
            onHide={handleClose}
            size="xl"
            id="unscheduled-items-modal"
          >
            <Modal.Header closeButton className="header">
              <Modal.Title className="title">
                Unscheduled Items
                <Badge className="badge-schedules-count" variant="warning">
                  {schedules.length}
                </Badge>
              </Modal.Title>
              <div className="search-box">
                <InputGroup className="mb-3 ">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">
                      <SearchIcon />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    value={searchText}
                    onChange={handleSearchTextChange}
                    placeholder="Search Company Name"
                    aria-label="Company Name"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </div>
            </Modal.Header>
            <Modal.Body>
              {/* Content of your modal goes here */}
              {schedules.map((schedule) => {
                // console.log("Schedule: ", schedule);
                return <ScheduleCard key={schedule.id} schedule={schedule} />;
              })}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default UnscheduledItems;
