import React from "react";
import { Form } from "react-bootstrap";
import "./RepeatScheduleAdminCommentForm.scss";

const RepeatScheduleAdminCommentForm = ({ repeatForm, setRepeatForm }) => {
  return (
    <Form.Group controlId="formRepeatScheduleAdminComment">
      <Form.Label>Schedule Admin Comment </Form.Label>
      <Form.Control
        as="textarea"
        value={repeatForm.commentAdmin}
        // disabled
        onChange={(e) =>
          setRepeatForm({
            ...repeatForm,
            commentAdmin: e.target.value,
          })
        }
        placeholder="Comment Admin"
      />
    </Form.Group>
  );
};

export default RepeatScheduleAdminCommentForm;
