import React from "react";
import { RiMailSendLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  openModal,
  closeModal,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import "./SendMail.scss";

const SendMail = ({ jobId }) => {
  //

  const dispatch = useDispatch();

  const tooltip = <Tooltip>Send Mail to Customer</Tooltip>;
  return (
    <>
      <OverlayTrigger overlay={tooltip} trigger={["hover", "focus"]}>
        <button className="button-row-icon send-mail-icon">
          <RiMailSendLine
            onClick={() =>
              dispatch(
                openModal({
                  componentKey: "sendMailContent",
                  size: "lg",
                  data: {
                    jobId,
                  },
                })
              )
            }
          />
        </button>
      </OverlayTrigger>
    </>
  );
};

export default SendMail;
