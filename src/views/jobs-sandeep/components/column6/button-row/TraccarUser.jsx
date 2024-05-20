import React from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  openModal,
  closeModal,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import "./TraccarUser.scss";

const TraccarUser = ({ traccarId, jobId }) => {
  //   traccarId = "sandeep1234";

  const tooltip = <Tooltip>Create Traccar User</Tooltip>;
  const dispatch = useDispatch();
  return (
    <>
      {traccarId ? (
        <p>ID: {traccarId}</p>
      ) : 
      (
        <OverlayTrigger overlay={tooltip} trigger={["hover", "focus"]}>
          <button className="button-row-icon create-traccar-icon">
            <AiOutlineUserAdd
              onClick={() =>
                dispatch(
                  openModal({
                    componentKey: "createTraccarUserContent",
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
      )
      }
    </>
  );
};

export default TraccarUser;
