import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import { closeModal } from "../../../../store/slices/jobs/jobsModalSlice";
import componentMap from "../../../jobs-sandeep/components/modals/modalComponentMap";

const SchedulesModal = () => {
  const dispatch = useDispatch();
  const { show, componentKey, size } = useSelector((state) => state.jobsModal);

  return (
    <Modal
      show={show}
      onHide={() => dispatch(closeModal())}
      size={size}
      backdrop={true}
      keyboard={true}
      animation={false}
    >
      {componentKey && componentMap[componentKey]}
    </Modal>
  );
};

export default SchedulesModal;
