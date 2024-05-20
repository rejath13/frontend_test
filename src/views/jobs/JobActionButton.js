import React from "react";
import { Dropdown } from "react-bootstrap";
import './job-action-button.css';

const JobActionButton = (props) => {

    const { 
        job,
        handleCreateLocatorUser = () => {},
        handleSendMailToUser = () => {},
        handleCreateSchedule = () => {},
        handleDeleteJob = () => {},
    } = props;

    return (
        <Dropdown>
        <Dropdown.Toggle variant="link" bsPrefix="p-0">
            <i class="fas fa-ellipsis-h action-dots"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
            
            {job.sales_plus_traccar_customer_created == '0' && <Dropdown.Item onClick={handleCreateLocatorUser}>  
                <span className="text-muted font-13"> <i className="fas fa-plus"></i> Create Locator User</span>
            </Dropdown.Item>}

            {job.sales_plus_customer_mail == '0' && <Dropdown.Item onClick={handleSendMailToUser}>  
                <span className="text-muted font-13"> <i className="fas fa-envelope"></i> Send Mail</span>
            </Dropdown.Item> }

            {job.sales_plus_traccar_customer_created != 1 && <Dropdown.Item onClick={handleCreateSchedule}>  
                <span className="text-muted font-13"> <i className="fas fa-calendar-day"></i> Create Schedule</span>
            </Dropdown.Item>}
            <Dropdown.Item onClick={handleDeleteJob}>  
                <span className="text-muted font-13"> <i className="fas fa-trash"></i> Delete Job</span>
            </Dropdown.Item>

            <Dropdown.Item onClick={handleDeleteJob}>  
                <span className="text-muted font-13"> <i className="fas fa-table"></i> Devices List</span>
            </Dropdown.Item>

        </Dropdown.Menu>
        </Dropdown>
    );
};

export default JobActionButton;
