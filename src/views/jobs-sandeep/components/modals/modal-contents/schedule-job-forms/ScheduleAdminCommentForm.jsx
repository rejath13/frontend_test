import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import {
  getScheduleAdminComment,
  setScheduleAdminComment,
} from "../../../../../../store/slices/scheduler/schedulerFormSlice";

const ScheduleAdminCommentForm = () => {
  //
  const scheduleAdminComment = useSelector(getScheduleAdminComment);

  const dispatch = useDispatch();
  return (
    <Form.Group controlId="formScheduleAdminComment">
      <Form.Label>Schedule Admin Comment </Form.Label>
      <Form.Control
        as="textarea"
        value={scheduleAdminComment}
        // disabled
        onChange={(e) => dispatch(setScheduleAdminComment(e.target.value))}
        // onChange={(e) =>
        //   setFormDetails({
        //     ...formDetails,
        //     noteForScheduling: e.target.value,
        //   })
        // }
        placeholder="Schedule Note"
      />
    </Form.Group>
  );
};

export default ScheduleAdminCommentForm;
