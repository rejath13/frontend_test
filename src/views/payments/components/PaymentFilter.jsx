import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import {
  collectedByOptions,
  emiratesOptions,
  invoiceOptions,
  statusOptions,
} from "../paymenthelper";

const PaymentFilter = ({ setShowModal, currentFilter, handleFilter }) => {
  const [filterValues, setFilterValues] = useState(null);
  const handleChange = (e) => {
    setFilterValues((prev) => ({
      ...prev,
      [e.target.name]: e?.target?.value,
    }));
  };


  return (
    <>
      <Form>
        <Form.Row>
          <Form.Group as={Col} xs={6} className="mb-3">
            <Form.Label>Payment Status</Form.Label>
            <div>
              <Form.Control
                as="select"
                defaultValue={currentFilter?.status || "all"}
                onChange={handleChange}
                name="status"
              >
                <option value={"all"}>All</option>
                {statusOptions?.map((status) => (
                  <option value={status?.value} key={status?.value}>
                    {status?.title}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Form.Group>
          <Form.Group as={Col} xs={6} controlId="collectedBy">
            <Form.Label>Collected By</Form.Label>
            <Form.Control
              as="select"
              defaultValue={currentFilter?.collectedBy || "all"}
              name="collectedBy"
              onChange={handleChange}
            >
              <option value={"all"}>All</option>
              {collectedByOptions?.map((user, index) => (
                <option value={user} key={index}>
                  {user}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="emirate">
            <Form.Label>Emirate</Form.Label>
            <Form.Control
              as="select"
              defaultValue={currentFilter?.emirate || "all"}
              name="emirate"
              onChange={handleChange}
            >
              <option value={"all"}>All</option>
              {emiratesOptions?.map((emirate) => (
                <option value={emirate.value} key={emirate.id}>
                  {emirate.value}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="originalInvoice">
            <Form.Label>Original Invoice</Form.Label>
            <Form.Control
              as="select"
              defaultValue={currentFilter?.originalInvoice || "all"}
              name="originalInvoice"
              onChange={handleChange}
            >
              <option value={"all"}>All</option>
              {invoiceOptions?.map((invoice) => (
                <option value={invoice.value} key={invoice.value}>
                  {invoice.title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
        <Form.Group as={Col} xs={6} controlId="fromDate">
            <Form.Label>From Date</Form.Label>
            <Form.Control
                type="date"
                name="fromDate"
                defaultValue={currentFilter?.fromDate}
                onChange={handleChange}
                // isInvalid={errors.amount && touched.amount}
              />
          </Form.Group>
          <Form.Group as={Col} xs={6} controlId="toDate">
            <Form.Label>To Date</Form.Label>
            <Form.Control
                type="date"
                name="toDate"
                defaultValue={currentFilter?.toDate}
                onChange={handleChange}
                // isInvalid={errors.amount && touched.amount}
              />
          </Form.Group>
        </Form.Row>
      </Form>
      <Form.Row className="justify-content-end">
        <Form.Group as={Col} md="auto">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
        </Form.Group>
        <Form.Group as={Col} md="auto">
          <Button
            variant="primary"
            type="submit"
            onClick={() => handleFilter(filterValues)}
          >
            Apply filter
          </Button>
        </Form.Group>
      </Form.Row>
    </>
  );
};

export default React.memo(PaymentFilter);
