import React from "react";
import { Modal } from "react-bootstrap";
import "./PaymentModal.scss";

const PaymentModal = ({children, title, showModal, setShowModal}) => {
  return (
    <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="payment-modal-body">
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;
