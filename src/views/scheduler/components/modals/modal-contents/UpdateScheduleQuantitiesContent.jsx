import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./UpdateScheduleQuantitiesContent.scss";
import { Form, Modal, Button, Spinner, Alert } from "react-bootstrap";
import {
  closeModal,
  getCurrentScheduleData,
} from "../../../../../store/slices/jobs/jobsModalSlice";
import { useUpdateScheduleQtyMutation } from "../../../../../store/api/scheduler/schedulerApi";
import { checkJobAndScheduleQty } from "../../../helpers/schedule-helper";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import { useToasts } from "react-toast-notifications";

const UpdateScheduleQuantitiesContent = () => {
  //
  const dispatch = useDispatch();

  const { addToast } = useToasts();

  const schedule = useSelector(getCurrentScheduleData);
  console.log("current schedule in qty update: ", schedule);
  const [updateScheduleQty, { isLoading, isError, isSuccess }] =
    useUpdateScheduleQtyMutation();
  const [qty, setQty] = useState({
    scheduleId: schedule?.id,
    qtyNew: schedule?.qtyNew,
    qtyMigration: schedule?.qtyMigration || "0",
    qtyTrading: schedule?.qtyTrading,
    qtyService: schedule?.qtyService,
    qtyOthers: schedule?.qtyOthers,
  });

  const handleQtySubmit = async () => {
    const schedQuantities = {
      schedQtyNew: qty?.qtyNew,
      schedQtyService: qty?.qtyService,
      schedQtyMigrate: qty?.qtyMigration,
      schedQtyTrading: qty?.qtyTrading,
    };
    console.log("sched salesPlus: ", schedule?.salesPlus);
    console.log("Sched quantities: ", schedQuantities);
    const isJobAndScheduleQtyOk = checkJobAndScheduleQty(
      schedule,
      schedQuantities
    );

    if (isJobAndScheduleQtyOk.status) {
      const response = await updateScheduleQty(qty);
    } else {
      const toastMessage = isJobAndScheduleQtyOk.msg;
      showToast(toastMessage, "error", addToast);
    }
  };

  // Close the modal when successful update
  useEffect(() => {
    if(isSuccess) {
      setTimeout(() => {
        dispatch(closeModal())
      }, 1000)
    }
  }, [isSuccess])
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Change Schedule Quantities</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="update-schedule-qty">
          <Form.Group controlId="formQuantityNew">
            <Form.Label>Quantity New</Form.Label>
            <Form.Control
              type="number"
              value={qty.qtyNew}
              onChange={(e) =>
                setQty({
                  ...qty,
                  qtyNew: e.target.value,
                })
              }
              placeholder="Quantity New"
            />
          </Form.Group>
          <Form.Group controlId="formQuantityMigrate">
            <Form.Label>Quantity Migrate</Form.Label>
            <Form.Control
              type="number"
              value={qty.qtyMigration}
              onChange={(e) =>
                setQty({
                  ...qty,
                  qtyMigration: e.target.value,
                })
              }
              placeholder="Quantity Migrate"
            />
          </Form.Group>
          <Form.Group controlId="formQuantityTrading">
            <Form.Label>Quantity Trading</Form.Label>
            <Form.Control
              type="number"
              value={qty.qtyTrading}
              onChange={(e) =>
                setQty({
                  ...qty,
                  qtyTrading: e.target.value,
                })
              }
              placeholder="Quantity Trading"
            />
          </Form.Group>
          <Form.Group controlId="formQuantityService">
            <Form.Label>Quantity Service</Form.Label>
            <Form.Control
              type="number"
              value={qty.qtyService}
              onChange={(e) =>
                setQty({
                  ...qty,
                  qtyService: e.target.value,
                })
              }
              placeholder="Quantity Service"
            />
          </Form.Group>
          <Form.Group controlId="formQuantity Others">
            <Form.Label>Quantity Others</Form.Label>
            <Form.Control
              type="number"
              value={qty.qtyOthers}
              onChange={(e) =>
                setQty({
                  ...qty,
                  qtyOthers: e.target.value,
                })
              }
              placeholder="Quantity Others"
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {(isSuccess || isError) && (
          <Alert variant={isSuccess ? "success" : "danger"}>
            {isSuccess
              ? "Schedules Qty updated Successfully!"
              : isError
              ? "Could not Save. Please Try Again !"
              : ""}
          </Alert>
        )}
        <Button variant="success" onClick={handleQtySubmit}>
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

export default UpdateScheduleQuantitiesContent;
