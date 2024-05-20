import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RepeatScheduleIcon } from "../../icons";
import { MdSendToMobile as SendToTechnicianIcon } from "react-icons/md";
import { openModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import {
  checkScheduleExpiry,
  checkScheduleOkToSend,
} from "../../../helpers/schedule-helper";
import { useToasts } from "react-toast-notifications";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FiSend as SendScheduleIcon } from "react-icons/fi";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import "./ScheduleButtonRow.scss";

const ScheduleButtonRow = ({ schedule }) => {
  //
  const dispatch = useDispatch();

  const { addToast } = useToasts();

  const tooltip = {
    sendSchedule: <Tooltip>Send Schedule</Tooltip>,
    sendToTechnician: <Tooltip>Send to Technician</Tooltip>,
    repeatSchedule: <Tooltip>Repeat Schedule</Tooltip>,
  };

  const handleRepeat = () => {
    dispatch(
      openModal({
        componentKey: "repeatScheduleContent",
        size: "xl",
        data: {
          schedule,
        },
      })
    );
  };

  // console.log("Current schedule: ", schedule);

  const handleSendToTechnician = () => {
    const isScheduleOkToSend = checkScheduleOkToSend(schedule);
    // console.log("Is schedule ok to send: ", isScheduleOkToSend);

    // if (isScheduleExpired) {
    //   const toastMessage =
    //     '"Schedule expired! Please create a new one or repeat this one"';
    //   showToast(toastMessage, "error", addToast);
    //   return;
    // }

    // if (!isScheduleOkToSend) {
    //   const toastMessage =
    //     "Cannot Assign to Technician! Schedule Data Missing ";
    //   showToast(toastMessage, "error", addToast);
    //   return;
    // }

    if (isScheduleOkToSend.status) {
      dispatch(
        openModal({
          componentKey: "sendToTechnicianContent",
          size: "lg",
          data: {
            schedule,
          },
        })
      );
    } else {
      const toastMessage = isScheduleOkToSend.msg;
      showToast(toastMessage, "error", addToast);
    }
   }
  // Map: https://www.google.com/maps?q=${encodeURIComponent(schedule?.lat)},${encodeURIComponent(schedule?.lng)}

  const handleSendSchedule = () => {
    const isScheduleExpired = checkScheduleExpiry(schedule?.scheduleDate);
    console.log("Expiry: ", isScheduleExpired);
    console.log('Schedule in send to technician: ', schedule);
    const salesPersonName = schedule?.salesPlus?.salesPerson?.name;
    
    if (!isScheduleExpired) {
      if (schedule?.technician?.phone){

        const whatsappMessage = `
          Company Name: ${schedule?.salesPlus?.companyName.toUpperCase()}
          Sales Person: ${salesPersonName ? salesPersonName : 'Not Provided'}
          Implementation Type: ${schedule?.salesPlus?.implementationType}
          Price: AED ${schedule?.salesPlus?.projectValue}
          Quantity: New - ${schedule?.qtyNew}, Service - ${schedule?.qtyService}
          Schedule Date: ${schedule?.scheduleDate}
          Time Slot: ${schedule?.fromTime} - ${schedule?.toTime}
          Contact Name: ${schedule?.contactName}
          Contact No: ${schedule?.contactPhone}
  
          
          Map: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schedule?.lat)},${encodeURIComponent(schedule?.lng)}
     
    
          Note: ${schedule?.commentAdmin}
        `;
        const url = `https://wa.me/${schedule?.technician?.phone}?text=${encodeURIComponent(
          whatsappMessage
        )}`;
        // console.log('Whatsapp Message : ', whatsappMessage)
        window.open(url, "_blank");
      } else {
        const toastMessage =
        "Technician Not Selected! Select a technician";
        showToast(toastMessage, "error", addToast);
      }
    } else {
      const toastMessage =
        "Schedule expired! Either Repeat Schedule or Create a new one";
      showToast(toastMessage, "error", addToast);
    }
  };

  // const handleSendSchedule = () => {
  //   const whatsappMessage = `
  //     Company Name: ${schedule?.salesPlus?.companyName.toUpperCase()}
  //     Sales Person: ${schedule?.salesPerson?.name}
  //   `;
  //   alert(whatsappMessage);
  // };

  return (
    <>
      <div className="row2 schedule-button-row">
        <OverlayTrigger
          overlay={tooltip.sendSchedule}
          trigger={["hover", "focus"]}
        >
          <Button
            id="send-schedule-btn"
            variant="success"
            className="btn-send-schedule"
            onClick={handleSendSchedule}
          >
            <SendScheduleIcon />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          overlay={tooltip.sendToTechnician}
          trigger={["hover", "focus"]}
        >
          <Button
            variant="primary"
            className="btn-send-to-technician"
            onClick={handleSendToTechnician}
          >
            <SendToTechnicianIcon />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          overlay={tooltip.repeatSchedule}
          trigger={["hover", "focus"]}
        >
          <Button
            variant="warning"
            className="btn-repeat-schedule"
            onClick={handleRepeat}
          >
            <RepeatScheduleIcon />
          </Button>
        </OverlayTrigger>

        {/* <div className="btn-repeat-schedule" onClick={handleRepeat}>
          <RepeatScheduleIcon />
        </div> */}
      </div>
    </>
  );
};

export default ScheduleButtonRow;
