import React, { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import "./AdditionalOptions.scss";

const AdditionalOptions = ({ jobId }) => {
  //
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);

  const tooltip = <Tooltip>Additional Options</Tooltip>;

  return (
    <div className="additional-options">
      <OverlayTrigger
        // show={showOptions ? false : true}
        overlay={tooltip}
        trigger={["hover", "focus"]}
      >
        <button className="button-row-icon options-button">
          <BiDotsVerticalRounded onClick={() => setShowOptions(!showOptions)} />
        </button>
      </OverlayTrigger>
      {showOptions && (
        <div className="options-container">
          <ul>
            <li
              className="delete"
              onClick={() =>
                dispatch(
                  openModal({
                    componentKey: "deleteStatusContent",
                    size: "md",
                    data: {
                      jobId,
                    },
                  })
                )
              }
            >
              Delete Job
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdditionalOptions;
