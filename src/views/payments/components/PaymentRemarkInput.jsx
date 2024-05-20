import React, { useState } from "react";
import { Button, Col, Form, ListGroup } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import "./PaymentRemarkInput.scss";
import { fetchLocalData, fetchUserId } from "../paymenthelper";

const PaymentRemarkInput = ({
  remarks,
  setRemarks,
  currentRemark,
  setCurrentRemark,
  type,
}) => {
  const [edit, setEdit] = useState(0);
  const loginUserId = fetchUserId();
  const loginUserName = fetchLocalData("loginUserName");
  // for editing existing remark
  const handlePreviousRemarkChange = (e, id) => {
    setRemarks((prev) =>
      prev?.map((remark) =>
        remark?.id === id
          ? { ...remark, remark: e?.target?.value, userId: loginUserId }
          : remark
      )
    );
  };

  // function to track new remark
  const handleNewRemarkChange = (e) => {
    setCurrentRemark({
      id: `new${remarks?.length + 1}`,
      remark: e?.target?.value,
      userId: loginUserId,
    });
  };

  // function to append new remark to the previous remarks array
  const handleAddRemark = () => {
    if (currentRemark?.remark) {
      setRemarks((prev) => [{ ...currentRemark }, ...prev]);
      setCurrentRemark((prev) => ({
        ...prev,
        remark: "",
        id: null,
        userId: null,
      }));
    } else {
      return null;
    }
  };

  return (
    <Form.Row className="remark-input-container">
      <Form.Group as={Col} controlId="remarks" className="remark-input-group">
        <Form.Label>Remarks</Form.Label>

        <Form.Control
          as="textarea"
          rows="3"
          name="remarks"
          // value={type === "edit" ? currentRemark?.remark : values?.remark}
          // onChange={type === "edit" ? handleNewRemarkChange : handleChange}
          value={currentRemark?.remark}
          onChange={handleNewRemarkChange}
          className="remark-input"
        />
        {type === "edit" && (
          <Button
            size="sm"
            className="add-btn"
            onClick={() => handleAddRemark()}
            disabled={!currentRemark?.remark}
          >
            +
          </Button>
        )}
      </Form.Group>
      {/* Previous remarks */}
      {type === "edit" && (
        <div className="previous-remarks">
          {remarks && remarks?.length > 0 && <strong>Previous Remarks:</strong>}
          <ListGroup className="mt-1 mb-4">
            {remarks &&
              remarks?.length > 0 &&
              remarks?.map((remark) => (
                <ListGroup.Item key={remark?.id} className="remark-items">
                  <div className="d-flex flex-column">
                    <input
                      type="text"
                      className="previous-remark-input"
                      disabled={edit === remark.id ? false : true}
                      value={remark?.remark}
                      onChange={(e) =>
                        handlePreviousRemarkChange(e, remark?.id)
                      }
                    />
                    <div className="d-flex justify-content-end align-items-center">
                      <small className="remark-date d-flex">
                        {remark?.addedDate
                          ? format(
                              parseISO(remark.addedDate),
                              "yyyy-MM-dd HH:mm"
                            )
                          : "now"}{" "}
                        -{" "}
                        {remark?.remarkUser?.name || loginUserName || "Unknown"}
                      </small>
                      {edit === remark?.id ? (
                        <FaCheckCircle
                          className="text-success remark-action"
                          onClick={() => setEdit(0)}
                        />
                      ) : (
                        <i
                          className="feather icon-edit text-secondary remark-action"
                          title="Edit Remark"
                          onClick={() => setEdit(remark?.id)}
                        ></i>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
      )}
    </Form.Row>
  );
};

export default PaymentRemarkInput;
