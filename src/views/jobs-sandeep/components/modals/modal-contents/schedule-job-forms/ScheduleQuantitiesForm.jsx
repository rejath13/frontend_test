import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import { getCurrentJobId } from "../../../../../../store/slices/jobs/jobsModalSlice";
import {
  getSchedQuantities,
  setSchedQuantities,
} from "../../../../../../store/slices/scheduler/schedulerFormSlice";

const ScheduleQuantitiesForm = () => {
  //
  const dispatch = useDispatch();

  const jobId = useSelector(getCurrentJobId);

  const {
    schedQtyNew,
    schedQtyMigrate,
    schedQtyTrading,
    schedQtyService,
    schedQtyOthers,
  } = useSelector(getSchedQuantities);

  // console.log("Current Job id : ", jobId);
  return (
    <>
      <Form.Group controlId="formcShedQtyNew">
        <Form.Label>Qty. New</Form.Label>
        <Form.Control
          type="number"
          value={schedQtyNew || ""}
          onChange={(e) =>
            dispatch(setSchedQuantities({ schedQtyNew: e.target.value }))
          }
        />
      </Form.Group>
      <Form.Group controlId="formSchedQtyMigrate">
        <Form.Label>Qty. Migrate</Form.Label>
        <Form.Control
          type="number"
          value={schedQtyMigrate || ""}
          onChange={(e) =>
            dispatch(setSchedQuantities({ schedQtyMigrate: e.target.value }))
          }
        />
      </Form.Group>
      <Form.Group controlId="formSchedQtyTrading">
        <Form.Label>Qty. Trading</Form.Label>
        <Form.Control
          type="number"
          value={schedQtyTrading || ""}
          onChange={(e) =>
            dispatch(setSchedQuantities({ schedQtyTrading: e.target.value }))
          }
        />
      </Form.Group>
      <Form.Group controlId="formSchedQtyService">
        <Form.Label>Qty. Service</Form.Label>
        <Form.Control
          type="number"
          value={schedQtyService || ""}
          onChange={(e) =>
            dispatch(setSchedQuantities({ schedQtyService: e.target.value }))
          }
        />
      </Form.Group>
      <Form.Group controlId="formSchedQtyOthers">
        <Form.Label>Qty. Others</Form.Label>
        <Form.Control
          type="number"
          value={schedQtyOthers || ""}
          onChange={(e) =>
            dispatch(setSchedQuantities({ schedQtyOthers: e.target.value }))
          }
        />
      </Form.Group>
    </>
  );
};

export default ScheduleQuantitiesForm;
